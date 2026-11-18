/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import http from 'http';
import path from 'path';
import express from 'express';
import { WebSocketServer, WebSocket } from 'ws';
import type {
  CharacterCustomization,
  EmoteType,
  MultiplayerChatMessage,
  RemotePlayerState,
  RoomSummary,
} from './src/types/index.js';

const PORT = Number(process.env.PORT) || 3000;
const MAX_PLAYERS_PER_ROOM = 6;
const DEFAULT_PUBLIC_ROOM = 'VALWORLD-1';

interface ConnectedPlayer extends RemotePlayerState {
  ws: WebSocket;
  roomId: string;
}

interface RoomState {
  roomId: string;
  hostId: string | null;
  hostName: string | null;
  players: Map<string, ConnectedPlayer>;
  chatHistory: MultiplayerChatMessage[];
}

const rooms = new Map<string, RoomState>();
let playerSeq = 1;

function normalizeLobbyId(raw: unknown): string {
  if (typeof raw !== 'string') return '';
  return raw
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9_-]/g, '')
    .slice(0, 20);
}

function generateShareableLobbyId(): string {
  for (let attempt = 0; attempt < 30; attempt++) {
    const code = Math.floor(1000 + Math.random() * 9000);
    const candidate = `VAL-${code}`;
    if (!rooms.has(candidate)) return candidate;
  }
  return `VAL-${Date.now().toString(36).toUpperCase().slice(-5)}`;
}

function getOrCreateRoom(roomId: string): RoomState {
  const cleanId = normalizeLobbyId(roomId) || DEFAULT_PUBLIC_ROOM;
  let room = rooms.get(cleanId);
  if (!room) {
    room = {
      roomId: cleanId,
      hostId: null,
      hostName: null,
      players: new Map(),
      chatHistory: [],
    };
    rooms.set(cleanId, room);
  }
  return room;
}

function findAvailablePublicRoom(): RoomState {
  for (let i = 1; i <= 50; i++) {
    const id = `VALWORLD-${i}`;
    const existing = rooms.get(id);
    if (!existing || existing.players.size < MAX_PLAYERS_PER_ROOM) {
      return getOrCreateRoom(id);
    }
  }
  return getOrCreateRoom(`VALWORLD-${Date.now().toString(36).toUpperCase().slice(-5)}`);
}

function getRoomSummaries(): RoomSummary[] {
  const list: RoomSummary[] = [];
  rooms.forEach((r) => {
    if (r.players.size > 0 || r.roomId === DEFAULT_PUBLIC_ROOM) {
      list.push({
        roomId: r.roomId,
        playerCount: r.players.size,
        maxPlayers: MAX_PLAYERS_PER_ROOM,
        hostId: r.hostId,
        hostName: r.hostName,
      });
    }
  });
  if (list.length === 0) {
    list.push({
      roomId: DEFAULT_PUBLIC_ROOM,
      playerCount: 0,
      maxPlayers: MAX_PLAYERS_PER_ROOM,
      hostId: null,
      hostName: null,
    });
  }
  return list;
}

function sanitizePlayerData(p: ConnectedPlayer): RemotePlayerState {
  return {
    id: p.id,
    playerName: p.playerName,
    character: p.character,
    position: p.position,
    rotationY: p.rotationY,
    isMoving: p.isMoving,
    isSprinting: p.isSprinting,
    isJumping: p.isJumping,
    activeEmote: p.activeEmote,
    scene: p.scene,
  };
}

function broadcastToRoom(room: RoomState, payload: unknown, excludeId?: string) {
  const raw = JSON.stringify(payload);
  room.players.forEach((p, id) => {
    if (id !== excludeId && p.ws.readyState === WebSocket.OPEN) {
      p.ws.send(raw);
    }
  });
}

function broadcastAll(payload: unknown) {
  const raw = JSON.stringify(payload);
  rooms.forEach((room) => {
    room.players.forEach((p) => {
      if (p.ws.readyState === WebSocket.OPEN) {
        p.ws.send(raw);
      }
    });
  });
}

function leaveCurrentRoom(player: ConnectedPlayer) {
  const room = rooms.get(player.roomId);
  if (!room) return;
  room.players.delete(player.id);

  // Transfer room ownership if the host leaves
  if (room.hostId === player.id) {
    const nextHost = room.players.values().next().value as ConnectedPlayer | undefined;
    room.hostId = nextHost ? nextHost.id : null;
    room.hostName = nextHost ? nextHost.playerName : null;
  }

  broadcastToRoom(room, {
    type: 'player_left',
    playerId: player.id,
    count: room.players.size,
    hostId: room.hostId,
    hostName: room.hostName,
  });

  if (room.players.size === 0 && room.roomId !== DEFAULT_PUBLIC_ROOM) {
    rooms.delete(room.roomId);
  }
}

async function startServer() {
  const app = express();
  app.use(express.json());

  // Allow cross-origin lobby inspection so external clients/links can check Lobby ID status
  app.use('/api', (_req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
  });

  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', maxPlayersPerRoom: MAX_PLAYERS_PER_ROOM, rooms: getRoomSummaries() });
  });

  app.get('/api/rooms', (_req, res) => {
    res.json({ maxPlayersPerRoom: MAX_PLAYERS_PER_ROOM, rooms: getRoomSummaries() });
  });

  app.get('/api/rooms/:roomId', (req, res) => {
    const cleanId = normalizeLobbyId(req.params.roomId);
    const room = cleanId ? rooms.get(cleanId) : undefined;
    if (!room) {
      res.json({
        exists: false,
        roomId: cleanId,
        playerCount: 0,
        maxPlayers: MAX_PLAYERS_PER_ROOM,
        isFull: false,
        hostName: null,
      });
      return;
    }
    res.json({
      exists: true,
      roomId: room.roomId,
      playerCount: room.players.size,
      maxPlayers: MAX_PLAYERS_PER_ROOM,
      isFull: room.players.size >= MAX_PLAYERS_PER_ROOM,
      hostName: room.hostName,
    });
  });

  const server = http.createServer(app);
  const wss = new WebSocketServer({ server, path: '/ws' });

  wss.on('connection', (ws) => {
    const playerId = `p_${Date.now().toString(36)}_${playerSeq++}`;
    let activePlayer: ConnectedPlayer | null = null;

    const joinIntoRoom = (targetRoom: RoomState, msg: any) => {
      if (targetRoom.players.size >= MAX_PLAYERS_PER_ROOM) {
        ws.send(
          JSON.stringify({
            type: 'room_full',
            roomId: targetRoom.roomId,
            maxPlayers: MAX_PLAYERS_PER_ROOM,
          })
        );
        return;
      }

      if (activePlayer) {
        leaveCurrentRoom(activePlayer);
      }

      const defaultCharacter: CharacterCustomization = msg.character || {
        archetypeId: 'aoi',
        hairColor: '#38bdf8',
        eyeColor: '#0284c7',
        outfitColor: '#ec4899',
        secondaryColor: '#ffffff',
      };

      const cleanName = String(msg.playerName || 'Explorer').trim().slice(0, 24) || 'Explorer';

      activePlayer = {
        ws,
        id: playerId,
        roomId: targetRoom.roomId,
        playerName: cleanName,
        character: defaultCharacter,
        position: Array.isArray(msg.position)
          ? [Number(msg.position[0]) || 0, Number(msg.position[1]) || 0, Number(msg.position[2]) || 4]
          : [0, 0, 4],
        rotationY: Number(msg.rotationY) || 0,
        isMoving: false,
        isSprinting: false,
        isJumping: false,
        activeEmote: null,
        scene: String(msg.scene || 'lobby'),
      };

      targetRoom.players.set(playerId, activePlayer);

      // Assign first player in room as Host / Room Owner
      if (!targetRoom.hostId) {
        targetRoom.hostId = playerId;
        targetRoom.hostName = cleanName;
      }

      const others: RemotePlayerState[] = [];
      targetRoom.players.forEach((p, id) => {
        if (id !== playerId) others.push(sanitizePlayerData(p));
      });

      const summaries = getRoomSummaries();

      ws.send(
        JSON.stringify({
          type: 'welcome',
          playerId,
          roomId: targetRoom.roomId,
          hostId: targetRoom.hostId,
          hostName: targetRoom.hostName,
          maxPlayers: MAX_PLAYERS_PER_ROOM,
          players: others,
          chatHistory: targetRoom.chatHistory.slice(-20),
          rooms: summaries,
        })
      );

      broadcastToRoom(
        targetRoom,
        {
          type: 'player_joined',
          player: sanitizePlayerData(activePlayer),
          count: targetRoom.players.size,
          hostId: targetRoom.hostId,
          hostName: targetRoom.hostName,
        },
        playerId
      );

      broadcastAll({
        type: 'rooms_updated',
        rooms: summaries,
      });
    };

    ws.on('message', (data) => {
      try {
        const msg = JSON.parse(data.toString());

        if (msg.type === 'create_room') {
          const newId = generateShareableLobbyId();
          const newRoom = getOrCreateRoom(newId);
          joinIntoRoom(newRoom, msg);
          return;
        }

        if (msg.type === 'join') {
          const normalized = normalizeLobbyId(msg.roomId);
          const targetRoom =
            normalized && normalized !== 'AUTO' ? getOrCreateRoom(normalized) : findAvailablePublicRoom();
          joinIntoRoom(targetRoom, msg);
          return;
        }

        if (!activePlayer) return;
        const room = rooms.get(activePlayer.roomId);
        if (!room) return;

        if (msg.type === 'move') {
          if (Array.isArray(msg.position) && msg.position.length === 3) {
            activePlayer.position = [
              Number(msg.position[0]) || 0,
              Number(msg.position[1]) || 0,
              Number(msg.position[2]) || 0,
            ];
          }
          activePlayer.rotationY = Number(msg.rotationY) || 0;
          activePlayer.isMoving = Boolean(msg.isMoving);
          activePlayer.isSprinting = Boolean(msg.isSprinting);
          activePlayer.isJumping = Boolean(msg.isJumping);
          activePlayer.scene = String(msg.scene || 'lobby');

          broadcastToRoom(
            room,
            {
              type: 'player_moved',
              playerId: activePlayer.id,
              position: activePlayer.position,
              rotationY: activePlayer.rotationY,
              isMoving: activePlayer.isMoving,
              isSprinting: activePlayer.isSprinting,
              isJumping: activePlayer.isJumping,
              scene: activePlayer.scene,
            },
            activePlayer.id
          );
        } else if (msg.type === 'customize') {
          if (msg.playerName) {
            activePlayer.playerName = String(msg.playerName).slice(0, 24);
            if (room.hostId === activePlayer.id) {
              room.hostName = activePlayer.playerName;
            }
          }
          if (msg.character) {
            activePlayer.character = msg.character;
          }
          broadcastToRoom(
            room,
            {
              type: 'player_customized',
              playerId: activePlayer.id,
              playerName: activePlayer.playerName,
              character: activePlayer.character,
              hostName: room.hostName,
            },
            activePlayer.id
          );
        } else if (msg.type === 'emote') {
          const emote = (msg.emote as EmoteType | null) || null;
          activePlayer.activeEmote = emote;
          broadcastToRoom(
            room,
            {
              type: 'player_emote',
              playerId: activePlayer.id,
              emote,
            },
            activePlayer.id
          );
        } else if (msg.type === 'chat') {
          const text = String(msg.text || '').trim().slice(0, 140);
          if (!text) return;
          const chatMessage: MultiplayerChatMessage = {
            id: `msg_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
            senderId: activePlayer.id,
            senderName: activePlayer.playerName,
            text,
            timestamp: Date.now(),
          };
          room.chatHistory.push(chatMessage);
          if (room.chatHistory.length > 40) room.chatHistory.shift();

          broadcastToRoom(room, {
            type: 'chat',
            message: chatMessage,
          });
        }
      } catch {
        // Ignore malformed packets safely
      }
    });

    ws.on('close', () => {
      if (activePlayer) {
        leaveCurrentRoom(activePlayer);
        activePlayer = null;
        broadcastAll({
          type: 'rooms_updated',
          rooms: getRoomSummaries(),
        });
      }
    });
  });

  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`Valworld3D server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start Valworld3D server:', err);
  process.exit(1);
});
