/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import mqtt, { MqttClient } from 'mqtt';
import {
  CharacterCustomization,
  EmoteType,
  MultiplayerChatMessage,
  RemotePlayerState,
  RoomSummary,
} from '../types';

export type ConnectionStatus = 'disconnected' | 'connecting' | 'connected';
export type TransportMode = 'native_ws' | 'cloud_relay';

export interface MultiplayerSnapshot {
  status: ConnectionStatus;
  playerId: string | null;
  roomId: string;
  hostId: string | null;
  hostName: string | null;
  maxPlayers: number;
  remotePlayers: RemotePlayerState[];
  chatMessages: MultiplayerChatMessage[];
  rooms: RoomSummary[];
  lastError: string | null;
}

interface RelayPresencePayload {
  id: string;
  joinedAt: number;
  ts: number;
  playerName: string;
  character: CharacterCustomization;
  position: [number, number, number];
  rotationY: number;
  isMoving: boolean;
  isSprinting: boolean;
  isJumping: boolean;
  activeEmote: EmoteType | null;
  scene: string;
}

interface RelayRoomDirectoryPayload {
  roomId: string;
  playerCount: number;
  maxPlayers: number;
  hostId: string | null;
  hostName: string | null;
  ts: number;
}

const DEFAULT_PUBLIC_ROOM = 'VALWORLD-1';
const MAX_PLAYERS_PER_ROOM = 6;
const RELAY_PREFIX = 'valworld3d/net1';
const CLOUD_RELAY_BROKERS = [
  'wss://test.mosquitto.org:8081/mqtt',
  'wss://broker.emqx.io:8084/mqtt',
  'wss://broker.hivemq.com:8884/mqtt',
];

export function normalizeLobbyId(raw: string): string {
  return raw
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9_-]/g, '')
    .slice(0, 20);
}

function readInitialUrlLobbyId(): string {
  if (typeof window === 'undefined') return 'auto';
  try {
    const params = new URLSearchParams(window.location.search);
    const raw = params.get('lobby') || params.get('room');
    const clean = raw ? normalizeLobbyId(raw) : '';
    return clean || 'auto';
  } catch {
    return 'auto';
  }
}

class MultiplayerClient {
  // Transport mode & native WebSocket state
  private transportMode: TransportMode | null = null;
  private ws: WebSocket | null = null;
  private nativeHasWelcomed = false;

  // Cloud WSS Relay (MQTT over WebSocket) state for Vercel & static hosts
  private relayClient: MqttClient | null = null;
  private relayBrokerIdx = 0;
  private relayJoinedAt = Date.now();
  private relayActiveRoom: string | null = null;
  private relayPeerMeta = new Map<string, { joinedAt: number; lastSeen: number; playerName: string }>();
  private relayDirectory = new Map<string, RelayRoomDirectoryPayload>();
  private relaySeenChatIds = new Set<string>();
  private relayHeartbeatTimer: ReturnType<typeof setInterval> | null = null;
  private relayPruneTimer: ReturnType<typeof setInterval> | null = null;
  private unloadHandlerBound = false;

  // Shared Multiplayer Snapshot state
  private status: ConnectionStatus = 'disconnected';
  private playerId: string | null = null;
  private roomId = readInitialUrlLobbyId();
  private hostId: string | null = null;
  private hostName: string | null = null;
  private maxPlayers = MAX_PLAYERS_PER_ROOM;
  private remotePlayers = new Map<string, RemotePlayerState>();
  private chatMessages: MultiplayerChatMessage[] = [];
  private rooms: RoomSummary[] = [];
  private lastError: string | null = null;

  private pendingCreateRoom = false;
  private listeners = new Set<(snapshot: MultiplayerSnapshot) => void>();
  private lastMoveEmitAt = 0;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private shouldStayConnected = false;

  private latestIdentity: {
    playerName: string;
    character: CharacterCustomization;
    position: [number, number, number];
    rotationY: number;
    scene: string;
    activeEmote?: EmoteType | null;
  } | null = null;

  public getInitialInvitedLobbyId(): string | null {
    return this.roomId !== 'auto' ? this.roomId : null;
  }

  public setPreferredLobbyId(lobbyId: string) {
    const clean = normalizeLobbyId(lobbyId);
    if (!clean) return;
    this.pendingCreateRoom = false;
    this.roomId = clean;
    this.lastError = null;

    if (this.transportMode === 'native_ws' && this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.sendJoinPacket(clean);
    } else if (this.transportMode === 'cloud_relay' && this.relayClient?.connected) {
      this.joinRelayRoom(clean);
    }
    this.notify();
  }

  public queueCreateShareableRoom() {
    this.pendingCreateRoom = true;
    this.lastError = null;
    if (this.transportMode === 'native_ws' && this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.sendCreateRoomPacket();
    } else if (this.transportMode === 'cloud_relay' && this.relayClient?.connected) {
      this.createRelayRoom();
    }
    this.notify();
  }

  public createShareableRoom() {
    this.lastError = null;
    this.pendingCreateRoom = true;
    if (this.transportMode === 'native_ws' && this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.sendCreateRoomPacket();
    } else if (this.transportMode === 'cloud_relay' && this.relayClient?.connected) {
      this.createRelayRoom();
    } else if (this.latestIdentity) {
      this.connect(this.latestIdentity);
    } else {
      // Fallback: pre-generate a local room ID until connect() runs
      const nextId = this.generateClientLobbyId();
      this.roomId = nextId;
      this.pendingCreateRoom = false;
      this.syncBrowserUrl(nextId);
      this.notify();
    }
  }

  public getInviteUrl(targetRoomId?: string): string {
    const id = normalizeLobbyId(targetRoomId || this.roomId);
    if (typeof window === 'undefined') return '';
    if (!id || id === 'AUTO') return window.location.origin;
    return `${window.location.origin}/?lobby=${encodeURIComponent(id)}`;
  }

  private generateClientLobbyId(): string {
    const known = new Set(this.rooms.map((r) => r.roomId));
    for (let i = 0; i < 30; i++) {
      const code = Math.floor(1000 + Math.random() * 9000);
      const candidate = `VAL-${code}`;
      if (!known.has(candidate)) return candidate;
    }
    return `VAL-${Date.now().toString(36).toUpperCase().slice(-5)}`;
  }

  public connect(identity: {
    playerName: string;
    character: CharacterCustomization;
    position: [number, number, number];
    rotationY: number;
    scene: string;
    roomId?: string;
  }) {
    this.latestIdentity = {
      ...identity,
      activeEmote: this.latestIdentity?.activeEmote ?? null,
    };
    if (identity.roomId) {
      this.roomId = normalizeLobbyId(identity.roomId) || 'auto';
      this.pendingCreateRoom = false;
    }
    this.shouldStayConnected = true;

    if (this.transportMode === 'native_ws' && this.ws) {
      if (this.ws.readyState === WebSocket.OPEN) {
        if (this.pendingCreateRoom) {
          this.sendCreateRoomPacket();
        } else if (identity.roomId) {
          this.sendJoinPacket(this.roomId);
        }
        return;
      }
      if (this.ws.readyState === WebSocket.CONNECTING) return;
    }

    if (this.transportMode === 'cloud_relay' && this.relayClient) {
      if (this.relayClient.connected) {
        if (this.pendingCreateRoom) {
          this.createRelayRoom();
        } else if (identity.roomId) {
          this.joinRelayRoom(this.roomId);
        }
        return;
      }
      return;
    }

    if (this.status === 'connecting') return;
    void this.detectAndOpenTransport();
  }

  /**
   * Detects whether a dedicated Node WebSocket backend (VITE_WS_URL or local server.ts /api/health)
   * is running. On Vercel or static hosts (where serverless functions don't host /ws),
   * skips the failing /ws handshake and connects directly via Cloud WSS Relay.
   */
  private async detectAndOpenTransport() {
    if (typeof window === 'undefined' || !this.shouldStayConnected) return;

    this.status = 'connecting';
    this.lastError = null;
    this.notify();

    const envWsUrl = (import.meta as unknown as { env?: Record<string, string | undefined> }).env?.VITE_WS_URL?.trim();
    if (envWsUrl) {
      this.transportMode = 'native_ws';
      this.openNativeSocket(envWsUrl);
      return;
    }

    const hasBackendWs = await this.probeNativeBackendHealth();
    if (!this.shouldStayConnected) return;

    if (hasBackendWs) {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      this.transportMode = 'native_ws';
      this.openNativeSocket(`${protocol}//${window.location.host}/ws`);
    } else {
      this.transportMode = 'cloud_relay';
      this.openCloudRelay();
    }
  }

  private async probeNativeBackendHealth(): Promise<boolean> {
    if (typeof window === 'undefined') return false;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 1600);

    try {
      const res = await fetch('/api/health', {
        method: 'GET',
        cache: 'no-store',
        signal: controller.signal,
      });
      if (!res.ok) return false;
      const contentType = res.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) return false;
      const data = await res.json();
      return Boolean(data && data.status === 'ok' && typeof data.maxPlayersPerRoom === 'number');
    } catch {
      return false;
    } finally {
      clearTimeout(timer);
    }
  }

  // =========================================================================
  // TRANSPORT 1: NATIVE SERVER.TS WEBSOCKET
  // =========================================================================

  private openNativeSocket(wsUrl: string) {
    if (typeof window === 'undefined') return;
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    this.nativeHasWelcomed = false;
    this.status = 'connecting';
    this.lastError = null;
    this.notify();

    try {
      const socket = new WebSocket(wsUrl);
      this.ws = socket;

      socket.onopen = () => {
        this.status = 'connected';
        this.lastError = null;
        if (this.pendingCreateRoom) {
          this.sendCreateRoomPacket();
        } else {
          this.sendJoinPacket(this.roomId || 'auto');
        }
        this.notify();
      };

      socket.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          this.handleNativeMessage(msg);
        } catch {}
      };

      socket.onclose = () => {
        const failedBeforeWelcome = !this.nativeHasWelcomed;
        this.ws = null;

        // If native /ws is blocked or unavailable on a reverse proxy/serverless host,
        // seamlessly switch over to Cloud WSS Relay instead of leaving user disconnected!
        if (failedBeforeWelcome && this.shouldStayConnected) {
          this.transportMode = 'cloud_relay';
          this.openCloudRelay();
          return;
        }

        this.status = 'disconnected';
        this.notify();
        if (this.shouldStayConnected && !this.reconnectTimer) {
          this.reconnectTimer = setTimeout(() => {
            this.reconnectTimer = null;
            if (this.shouldStayConnected) {
              this.openNativeSocket(wsUrl);
            }
          }, 2500);
        }
      };

      socket.onerror = () => {
        // Defer error surfacing; onclose handles fallback cleanly
      };
    } catch {
      this.transportMode = 'cloud_relay';
      this.openCloudRelay();
    }
  }

  private sendCreateRoomPacket() {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN || !this.latestIdentity) return;
    this.pendingCreateRoom = false;
    this.ws.send(
      JSON.stringify({
        type: 'create_room',
        ...this.latestIdentity,
      })
    );
  }

  private sendJoinPacket(roomId: string) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN || !this.latestIdentity) return;
    this.pendingCreateRoom = false;
    this.ws.send(
      JSON.stringify({
        type: 'join',
        roomId: roomId === 'auto' ? 'auto' : normalizeLobbyId(roomId) || 'auto',
        ...this.latestIdentity,
      })
    );
  }

  private handleNativeMessage(msg: any) {
    switch (msg.type) {
      case 'welcome': {
        this.nativeHasWelcomed = true;
        this.playerId = msg.playerId;
        this.roomId = msg.roomId;
        this.hostId = msg.hostId || null;
        this.hostName = msg.hostName || null;
        this.maxPlayers = msg.maxPlayers || MAX_PLAYERS_PER_ROOM;
        this.remotePlayers.clear();
        (msg.players || []).forEach((p: RemotePlayerState) => {
          if (p.id !== this.playerId) {
            this.remotePlayers.set(p.id, p);
          }
        });
        this.chatMessages = msg.chatHistory || [];
        this.rooms = msg.rooms || [];
        this.lastError = null;
        this.syncBrowserUrl(this.roomId);
        this.notify();
        break;
      }
      case 'rooms_updated': {
        if (Array.isArray(msg.rooms)) {
          this.rooms = msg.rooms;
          this.notify();
        }
        break;
      }
      case 'room_full': {
        this.lastError = `ROOM_FULL:${msg.roomId || ''}`;
        this.notify();
        break;
      }
      case 'player_joined': {
        if (msg.hostId !== undefined) this.hostId = msg.hostId;
        if (msg.hostName !== undefined) this.hostName = msg.hostName;
        if (msg.player && msg.player.id !== this.playerId) {
          this.remotePlayers.set(msg.player.id, msg.player);
          this.notify();
        }
        break;
      }
      case 'player_left': {
        if (msg.hostId !== undefined) this.hostId = msg.hostId;
        if (msg.hostName !== undefined) this.hostName = msg.hostName;
        if (msg.playerId) {
          this.remotePlayers.delete(msg.playerId);
          this.notify();
        }
        break;
      }
      case 'player_moved': {
        const existing = this.remotePlayers.get(msg.playerId);
        if (existing) {
          existing.position = msg.position;
          existing.rotationY = msg.rotationY;
          existing.isMoving = msg.isMoving;
          existing.isSprinting = msg.isSprinting;
          existing.isJumping = msg.isJumping;
          existing.scene = msg.scene;
        }
        break;
      }
      case 'player_customized': {
        if (msg.hostName !== undefined) this.hostName = msg.hostName;
        const existing = this.remotePlayers.get(msg.playerId);
        if (existing) {
          existing.playerName = msg.playerName;
          existing.character = msg.character;
          this.notify();
        }
        break;
      }
      case 'player_emote': {
        const existing = this.remotePlayers.get(msg.playerId);
        if (existing) {
          existing.activeEmote = msg.emote;
          this.notify();
        }
        break;
      }
      case 'chat': {
        if (msg.message) {
          this.chatMessages = [...this.chatMessages.slice(-29), msg.message];
          this.notify();
        }
        break;
      }
    }
  }

  // =========================================================================
  // TRANSPORT 2: CLOUD WSS RELAY (VERCEL / STATIC DEPLOYMENT MULTIPLAYER)
  // =========================================================================

  private openCloudRelay() {
    if (typeof window === 'undefined' || !this.shouldStayConnected) return;

    this.cleanupRelayClient(false);

    if (!this.playerId) {
      this.playerId = `p_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;
    }
    this.relayJoinedAt = Date.now();
    this.status = 'connecting';
    this.lastError = null;
    this.notify();

    const targetRoom =
      this.pendingCreateRoom
        ? this.generateClientLobbyId()
        : this.roomId && this.roomId !== 'auto'
        ? normalizeLobbyId(this.roomId) || DEFAULT_PUBLIC_ROOM
        : DEFAULT_PUBLIC_ROOM;

    const brokerUrl = CLOUD_RELAY_BROKERS[this.relayBrokerIdx % CLOUD_RELAY_BROKERS.length];
    let openedOnce = false;

    const client = mqtt.connect(brokerUrl, {
      clientId: `vw3d_${this.playerId}_${Math.random().toString(36).slice(2, 5)}`,
      clean: true,
      protocolVersion: 4,
      connectTimeout: 5500,
      reconnectPeriod: 0, // We manage failover cleanly across brokers
      keepalive: 25,
      will: {
        topic: `${RELAY_PREFIX}/r/${targetRoom}/p/${this.playerId}`,
        payload: '',
        qos: 1,
        retain: true,
      },
    });

    this.relayClient = client;

    if (!this.unloadHandlerBound) {
      this.unloadHandlerBound = true;
      window.addEventListener('beforeunload', () => {
        if (this.relayClient?.connected && this.relayActiveRoom && this.playerId) {
          this.relayClient.publish(`${RELAY_PREFIX}/r/${this.relayActiveRoom}/p/${this.playerId}`, '', {
            qos: 0,
            retain: true,
          });
        }
      });
    }

    client.on('connect', () => {
      if (this.relayClient !== client) return;
      openedOnce = true;
      this.status = 'connected';
      this.lastError = null;

      // Subscribe to active lobby directory
      client.subscribe(`${RELAY_PREFIX}/dir/+`, { qos: 0 });

      if (this.pendingCreateRoom) {
        this.pendingCreateRoom = false;
        this.joinRelayRoom(targetRoom, true);
      } else {
        this.joinRelayRoom(targetRoom, false);
      }

      this.startRelayTimers();
      this.notify();
    });

    client.on('message', (topic, payloadBuffer) => {
      if (this.relayClient !== client) return;
      this.handleRelayMessage(topic, payloadBuffer.toString());
    });

    client.on('error', () => {
      if (this.relayClient !== client) return;
      if (!openedOnce) {
        this.failoverRelayBroker();
      }
    });

    client.on('close', () => {
      if (this.relayClient !== client) return;
      if (!this.shouldStayConnected) return;

      if (!openedOnce) {
        this.failoverRelayBroker();
        return;
      }

      this.status = 'disconnected';
      this.notify();
      if (!this.reconnectTimer) {
        this.reconnectTimer = setTimeout(() => {
          this.reconnectTimer = null;
          if (this.shouldStayConnected && this.transportMode === 'cloud_relay') {
            this.openCloudRelay();
          }
        }, 2500);
      }
    });
  }

  private failoverRelayBroker() {
    this.cleanupRelayClient(false);
    this.relayBrokerIdx = (this.relayBrokerIdx + 1) % CLOUD_RELAY_BROKERS.length;

    if (this.shouldStayConnected && !this.reconnectTimer) {
      this.reconnectTimer = setTimeout(() => {
        this.reconnectTimer = null;
        if (this.shouldStayConnected && this.transportMode === 'cloud_relay') {
          this.openCloudRelay();
        }
      }, 900);
    }
  }

  private createRelayRoom() {
    const newId = this.generateClientLobbyId();
    this.pendingCreateRoom = false;
    this.joinRelayRoom(newId, true);
  }

  private joinRelayRoom(targetRoomRaw: string, forceNew = false) {
    const client = this.relayClient;
    if (!client || !client.connected || !this.playerId) return;

    const nextRoom =
      !targetRoomRaw || targetRoomRaw === 'auto' || targetRoomRaw === 'AUTO'
        ? DEFAULT_PUBLIC_ROOM
        : normalizeLobbyId(targetRoomRaw) || DEFAULT_PUBLIC_ROOM;

    // Check known directory capacity before switching if not already inside
    if (!forceNew && this.relayActiveRoom !== nextRoom) {
      const dirInfo = this.relayDirectory.get(nextRoom);
      if (dirInfo && Date.now() - dirInfo.ts < 25000 && dirInfo.playerCount >= MAX_PLAYERS_PER_ROOM) {
        this.lastError = `ROOM_FULL:${nextRoom}`;
        this.notify();
        return;
      }
    }

    // Leave old room cleanly
    const prevRoom = this.relayActiveRoom;
    if (prevRoom && prevRoom !== nextRoom) {
      client.publish(`${RELAY_PREFIX}/r/${prevRoom}/p/${this.playerId}`, '', { qos: 1, retain: true });
      client.unsubscribe(`${RELAY_PREFIX}/r/${prevRoom}/#`);

      if (this.hostId === this.playerId && this.remotePlayers.size === 0 && prevRoom !== DEFAULT_PUBLIC_ROOM) {
        client.publish(`${RELAY_PREFIX}/dir/${prevRoom}`, '', { qos: 0, retain: true });
      }
    }

    this.relayActiveRoom = nextRoom;
    this.roomId = nextRoom;
    this.relayJoinedAt = Date.now();
    this.remotePlayers.clear();
    this.relayPeerMeta.clear();
    this.chatMessages = [];
    this.relaySeenChatIds.clear();
    this.lastError = null;

    this.syncBrowserUrl(nextRoom);
    this.recomputeRelayHost();

    client.subscribe(`${RELAY_PREFIX}/r/${nextRoom}/#`, { qos: 0 }, () => {
      this.publishRelayPresence();
      this.publishRelayDirectory();
      this.notify();
    });
  }

  private publishRelayPresence() {
    const client = this.relayClient;
    if (!client || !client.connected || !this.relayActiveRoom || !this.playerId || !this.latestIdentity) return;

    const payload: RelayPresencePayload = {
      id: this.playerId,
      joinedAt: this.relayJoinedAt,
      ts: Date.now(),
      playerName: this.latestIdentity.playerName,
      character: this.latestIdentity.character,
      position: this.latestIdentity.position,
      rotationY: this.latestIdentity.rotationY,
      isMoving: false,
      isSprinting: false,
      isJumping: false,
      activeEmote: this.latestIdentity.activeEmote ?? null,
      scene: this.latestIdentity.scene,
    };

    client.publish(`${RELAY_PREFIX}/r/${this.relayActiveRoom}/p/${this.playerId}`, JSON.stringify(payload), {
      qos: 0,
      retain: true,
    });
  }

  private publishRelayDirectory() {
    const client = this.relayClient;
    if (!client || !client.connected || !this.relayActiveRoom || !this.playerId) return;

    // Only the room host (or solo occupant) updates the directory card to avoid redundant writes
    if (this.hostId && this.hostId !== this.playerId) return;

    const summary: RelayRoomDirectoryPayload = {
      roomId: this.relayActiveRoom,
      playerCount: Math.min(MAX_PLAYERS_PER_ROOM, this.remotePlayers.size + 1),
      maxPlayers: MAX_PLAYERS_PER_ROOM,
      hostId: this.hostId,
      hostName: this.hostName,
      ts: Date.now(),
    };

    this.relayDirectory.set(this.relayActiveRoom, summary);
    this.rebuildRoomsListFromRelay();

    client.publish(`${RELAY_PREFIX}/dir/${this.relayActiveRoom}`, JSON.stringify(summary), {
      qos: 0,
      retain: true,
    });
  }

  private startRelayTimers() {
    if (this.relayHeartbeatTimer) clearInterval(this.relayHeartbeatTimer);
    if (this.relayPruneTimer) clearInterval(this.relayPruneTimer);

    this.relayHeartbeatTimer = setInterval(() => {
      this.publishRelayPresence();
      this.publishRelayDirectory();
    }, 4500);

    this.relayPruneTimer = setInterval(() => {
      const now = Date.now();
      let changed = false;

      this.relayPeerMeta.forEach((meta, pid) => {
        if (now - meta.lastSeen > 14000) {
          this.relayPeerMeta.delete(pid);
          this.remotePlayers.delete(pid);
          changed = true;
        }
      });

      this.relayDirectory.forEach((dir, rid) => {
        if (rid !== this.relayActiveRoom && now - dir.ts > 26000) {
          this.relayDirectory.delete(rid);
          changed = true;
        }
      });

      if (changed) {
        this.recomputeRelayHost();
        this.rebuildRoomsListFromRelay();
        this.notify();
      }
    }, 3500);
  }

  private recomputeRelayHost() {
    if (!this.playerId || !this.latestIdentity) return;
    const candidates: Array<{ id: string; joinedAt: number; name: string }> = [
      { id: this.playerId, joinedAt: this.relayJoinedAt, name: this.latestIdentity.playerName },
    ];

    this.relayPeerMeta.forEach((meta, id) => {
      candidates.push({ id, joinedAt: meta.joinedAt, name: meta.playerName });
    });

    candidates.sort((a, b) => (a.joinedAt !== b.joinedAt ? a.joinedAt - b.joinedAt : a.id.localeCompare(b.id)));
    this.hostId = candidates[0]?.id || this.playerId;
    this.hostName = candidates[0]?.name || this.latestIdentity.playerName;
  }

  private rebuildRoomsListFromRelay() {
    const now = Date.now();
    const list: RoomSummary[] = [];

    this.relayDirectory.forEach((d) => {
      if (d.roomId === this.relayActiveRoom || (d.playerCount > 0 && now - d.ts < 26000) || d.roomId === DEFAULT_PUBLIC_ROOM) {
        list.push({
          roomId: d.roomId,
          playerCount: d.roomId === this.relayActiveRoom ? Math.min(MAX_PLAYERS_PER_ROOM, this.remotePlayers.size + 1) : d.playerCount,
          maxPlayers: MAX_PLAYERS_PER_ROOM,
          hostId: d.hostId,
          hostName: d.hostName,
        });
      }
    });

    if (!list.some((r) => r.roomId === DEFAULT_PUBLIC_ROOM)) {
      list.unshift({
        roomId: DEFAULT_PUBLIC_ROOM,
        playerCount: this.relayActiveRoom === DEFAULT_PUBLIC_ROOM ? Math.min(MAX_PLAYERS_PER_ROOM, this.remotePlayers.size + 1) : 0,
        maxPlayers: MAX_PLAYERS_PER_ROOM,
        hostId: this.relayActiveRoom === DEFAULT_PUBLIC_ROOM ? this.hostId : null,
        hostName: this.relayActiveRoom === DEFAULT_PUBLIC_ROOM ? this.hostName : null,
      });
    }

    if (this.relayActiveRoom && !list.some((r) => r.roomId === this.relayActiveRoom)) {
      list.push({
        roomId: this.relayActiveRoom,
        playerCount: Math.min(MAX_PLAYERS_PER_ROOM, this.remotePlayers.size + 1),
        maxPlayers: MAX_PLAYERS_PER_ROOM,
        hostId: this.hostId,
        hostName: this.hostName,
      });
    }

    this.rooms = list;
  }

  private handleRelayMessage(topic: string, raw: string) {
    if (!topic.startsWith(`${RELAY_PREFIX}/`)) return;
    const parts = topic.slice(RELAY_PREFIX.length + 1).split('/');

    // Directory update: dir/<roomId>
    if (parts[0] === 'dir' && parts[1]) {
      const rid = parts[1];
      if (!raw) {
        this.relayDirectory.delete(rid);
        this.rebuildRoomsListFromRelay();
        this.notify();
        return;
      }
      try {
        const parsed = JSON.parse(raw) as RelayRoomDirectoryPayload;
        if (parsed && parsed.roomId) {
          this.relayDirectory.set(rid, parsed);
          this.rebuildRoomsListFromRelay();
          this.notify();
        }
      } catch {}
      return;
    }

    // Room-scoped packet: r/<roomId>/<kind>/<senderId?>
    if (parts[0] !== 'r' || !parts[1] || parts[1] !== this.relayActiveRoom) return;
    const kind = parts[2];
    const senderId = parts[3];

    if (kind === 'p' && senderId) {
      if (senderId === this.playerId) return;

      if (!raw) {
        // Peer left cleanly
        this.relayPeerMeta.delete(senderId);
        this.remotePlayers.delete(senderId);
        this.recomputeRelayHost();
        this.rebuildRoomsListFromRelay();
        this.notify();
        return;
      }

      try {
        const p = JSON.parse(raw) as RelayPresencePayload;
        if (!p || !p.id) return;
        // Ignore stale retained presence older than 18s
        if (Date.now() - (p.ts || 0) > 18000) return;

        // Enforce 6-player room cap
        if (!this.remotePlayers.has(senderId) && this.remotePlayers.size >= MAX_PLAYERS_PER_ROOM - 1) {
          return;
        }

        const isNew = !this.remotePlayers.has(senderId);
        this.relayPeerMeta.set(senderId, {
          joinedAt: p.joinedAt || Date.now(),
          lastSeen: Date.now(),
          playerName: p.playerName || 'Explorer',
        });

        const existing = this.remotePlayers.get(senderId);
        if (existing) {
          existing.playerName = p.playerName;
          existing.character = p.character;
          existing.scene = p.scene;
          existing.activeEmote = p.activeEmote;
        } else {
          this.remotePlayers.set(senderId, {
            id: senderId,
            playerName: p.playerName || 'Explorer',
            character: p.character,
            position: p.position || [0, 0, 4],
            rotationY: p.rotationY || 0,
            isMoving: Boolean(p.isMoving),
            isSprinting: Boolean(p.isSprinting),
            isJumping: Boolean(p.isJumping),
            activeEmote: p.activeEmote ?? null,
            scene: p.scene || 'lobby',
          });
        }

        this.recomputeRelayHost();
        if (isNew) {
          this.rebuildRoomsListFromRelay();
        }
        this.notify();
      } catch {}
      return;
    }

    if (kind === 'm' && senderId && senderId !== this.playerId && raw) {
      try {
        const m = JSON.parse(raw) as {
          p?: [number, number, number];
          r?: number;
          mv?: boolean;
          sp?: boolean;
          jp?: boolean;
          sc?: string;
        };
        const existing = this.remotePlayers.get(senderId);
        const meta = this.relayPeerMeta.get(senderId);
        if (meta) meta.lastSeen = Date.now();
        if (existing) {
          if (Array.isArray(m.p) && m.p.length === 3) existing.position = m.p;
          if (typeof m.r === 'number') existing.rotationY = m.r;
          existing.isMoving = Boolean(m.mv);
          existing.isSprinting = Boolean(m.sp);
          existing.isJumping = Boolean(m.jp);
          if (m.sc) existing.scene = m.sc;
        }
      } catch {}
      return;
    }

    if (kind === 'e' && senderId && senderId !== this.playerId && raw) {
      try {
        const data = JSON.parse(raw) as { emote: EmoteType | null };
        const existing = this.remotePlayers.get(senderId);
        if (existing) {
          existing.activeEmote = data.emote ?? null;
          this.notify();
        }
      } catch {}
      return;
    }

    if (kind === 'c' && raw) {
      try {
        const msg = JSON.parse(raw) as MultiplayerChatMessage;
        if (msg && msg.id && !this.relaySeenChatIds.has(msg.id)) {
          this.relaySeenChatIds.add(msg.id);
          this.chatMessages = [...this.chatMessages.slice(-29), msg];
          this.notify();
        }
      } catch {}
    }
  }

  private cleanupRelayClient(publishLeave = true) {
    if (this.relayHeartbeatTimer) {
      clearInterval(this.relayHeartbeatTimer);
      this.relayHeartbeatTimer = null;
    }
    if (this.relayPruneTimer) {
      clearInterval(this.relayPruneTimer);
      this.relayPruneTimer = null;
    }
    if (this.relayClient) {
      try {
        if (publishLeave && this.relayClient.connected && this.relayActiveRoom && this.playerId) {
          this.relayClient.publish(`${RELAY_PREFIX}/r/${this.relayActiveRoom}/p/${this.playerId}`, '', {
            qos: 0,
            retain: true,
          });
        }
        this.relayClient.end(true);
      } catch {}
      this.relayClient = null;
    }
  }

  // =========================================================================
  // UNIFIED PUBLIC ACTIONS
  // =========================================================================

  public switchRoom(roomId: string) {
    const clean = normalizeLobbyId(roomId) || 'auto';
    this.lastError = null;
    this.pendingCreateRoom = false;

    if (this.transportMode === 'native_ws' && this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.sendJoinPacket(clean);
      return;
    }

    if (this.transportMode === 'cloud_relay' && this.relayClient?.connected) {
      this.joinRelayRoom(clean);
      return;
    }

    if (this.latestIdentity) {
      this.connect({ ...this.latestIdentity, roomId: clean });
    } else {
      this.roomId = clean;
      if (clean !== 'auto') this.syncBrowserUrl(clean);
      this.notify();
    }
  }

  private syncBrowserUrl(roomId: string) {
    if (typeof window === 'undefined' || !roomId) return;
    try {
      const url = new URL(window.location.href);
      url.searchParams.set('lobby', roomId);
      window.history.replaceState({}, '', url.toString());
    } catch {}
  }

  public emitMove(data: {
    position: [number, number, number];
    rotationY: number;
    isMoving: boolean;
    isSprinting: boolean;
    isJumping: boolean;
    scene: string;
  }) {
    if (this.latestIdentity) {
      this.latestIdentity.position = data.position;
      this.latestIdentity.rotationY = data.rotationY;
      this.latestIdentity.scene = data.scene;
    }

    const now = performance.now();
    const minInterval = this.transportMode === 'cloud_relay' ? 95 : 50;
    if (now - this.lastMoveEmitAt < minInterval) return;

    if (this.transportMode === 'native_ws' && this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.lastMoveEmitAt = now;
      this.ws.send(
        JSON.stringify({
          type: 'move',
          ...data,
        })
      );
      return;
    }

    if (
      this.transportMode === 'cloud_relay' &&
      this.relayClient?.connected &&
      this.relayActiveRoom &&
      this.playerId
    ) {
      this.lastMoveEmitAt = now;
      this.relayClient.publish(
        `${RELAY_PREFIX}/r/${this.relayActiveRoom}/m/${this.playerId}`,
        JSON.stringify({
          p: data.position,
          r: Number(data.rotationY.toFixed(3)),
          mv: data.isMoving,
          sp: data.isSprinting,
          jp: data.isJumping,
          sc: data.scene,
        }),
        { qos: 0, retain: false }
      );
    }
  }

  public emitCustomize(playerName: string, character: CharacterCustomization) {
    if (this.latestIdentity) {
      this.latestIdentity.playerName = playerName;
      this.latestIdentity.character = character;
    }

    if (this.transportMode === 'native_ws' && this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type: 'customize', playerName, character }));
      return;
    }

    if (this.transportMode === 'cloud_relay' && this.relayClient?.connected) {
      this.recomputeRelayHost();
      this.publishRelayPresence();
      this.publishRelayDirectory();
      this.notify();
    }
  }

  public emitEmote(emote: EmoteType | null) {
    if (this.latestIdentity) {
      this.latestIdentity.activeEmote = emote;
    }

    if (this.transportMode === 'native_ws' && this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type: 'emote', emote }));
      return;
    }

    if (
      this.transportMode === 'cloud_relay' &&
      this.relayClient?.connected &&
      this.relayActiveRoom &&
      this.playerId
    ) {
      this.relayClient.publish(
        `${RELAY_PREFIX}/r/${this.relayActiveRoom}/e/${this.playerId}`,
        JSON.stringify({ emote }),
        { qos: 0, retain: false }
      );
    }
  }

  public emitChat(text: string) {
    const clean = text.trim().slice(0, 140);
    if (!clean) return;

    if (this.transportMode === 'native_ws' && this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type: 'chat', text: clean }));
      return;
    }

    if (
      this.transportMode === 'cloud_relay' &&
      this.relayClient?.connected &&
      this.relayActiveRoom &&
      this.playerId
    ) {
      const chatMessage: MultiplayerChatMessage = {
        id: `msg_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        senderId: this.playerId,
        senderName: this.latestIdentity?.playerName || 'Explorer',
        text: clean,
        timestamp: Date.now(),
      };
      this.relaySeenChatIds.add(chatMessage.id);
      this.chatMessages = [...this.chatMessages.slice(-29), chatMessage];
      this.notify();

      this.relayClient.publish(
        `${RELAY_PREFIX}/r/${this.relayActiveRoom}/c`,
        JSON.stringify(chatMessage),
        { qos: 1, retain: false }
      );
    }
  }

  public getRemotePlayersList(): RemotePlayerState[] {
    return Array.from(this.remotePlayers.values());
  }

  public getSnapshot(): MultiplayerSnapshot {
    return {
      status: this.status,
      playerId: this.playerId,
      roomId: this.roomId,
      hostId: this.hostId,
      hostName: this.hostName,
      maxPlayers: this.maxPlayers,
      remotePlayers: Array.from(this.remotePlayers.values()),
      chatMessages: this.chatMessages,
      rooms: this.rooms,
      lastError: this.lastError,
    };
  }

  public subscribe(listener: (snapshot: MultiplayerSnapshot) => void) {
    this.listeners.add(listener);
    listener(this.getSnapshot());
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    const snap = this.getSnapshot();
    this.listeners.forEach((fn) => fn(snap));
  }

  public disconnect() {
    this.shouldStayConnected = false;
    this.transportMode = null;
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.cleanupRelayClient(true);
    this.status = 'disconnected';
    this.notify();
  }
}

export const multiplayerClient = new MultiplayerClient();
