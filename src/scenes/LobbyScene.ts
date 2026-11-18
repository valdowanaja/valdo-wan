/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as THREE from 'three';
import { AnimeCharacterModel } from '../characters/AnimeCharacterModel';
import { EduBotMascot } from '../characters/EduBotMascot';
import { GuardianNPC } from '../characters/GuardianNPC';
import { WorldNPC } from '../characters/WorldNPC';
import { GAME_CATALOG, WORLD_NPCS, WORLD_REGIONS, WorldRegion } from '../data/constants';
import { LOCALIZED_GAMES, LOCALIZED_NPCS, LOCALIZED_REGIONS, TRANSLATIONS } from '../data/i18n';
import { createCobblestoneTexture } from '../core/ProceduralTextures';
import { inputManager } from '../core/InputManager';
import { soundManager } from '../audio/SoundSynthesizer';
import { AppLanguage, CameraPerspective, EmoteType, GameInfo, NpcEntity, RemotePlayerState } from '../types';

export interface GateTrigger {
  game: GameInfo;
  position: THREE.Vector3;
  distance: number;
}

export interface JumpPadTrigger {
  position: THREE.Vector3;
  targetRegionName: string;
}

interface BridgeSegment {
  start: THREE.Vector3;
  end: THREE.Vector3;
  dir: THREE.Vector3;
  length: number;
  halfWidth: number;
}

interface SkyBird {
  group: THREE.Group;
  leftWing: THREE.Mesh;
  rightWing: THREE.Mesh;
  center: THREE.Vector3;
  radius: number;
  speed: number;
  phase: number;
  altitude: number;
}

interface IslandAnimal {
  group: THREE.Group;
  homeCenter: THREE.Vector3;
  wanderTarget: THREE.Vector3;
  phase: number;
  pauseTimer: number;
  earL?: THREE.Mesh;
  earR?: THREE.Mesh;
}

interface RemotePlayerVisual {
  model: AnimeCharacterModel;
  nameTag: THREE.Mesh;
  ring: THREE.Mesh;
  targetPos: THREE.Vector3;
  targetRotY: number;
  isMoving: boolean;
  isSprinting: boolean;
  isJumping: boolean;
  lastCharSig: string;
  lastName: string;
  activeEmote: EmoteType | null;
}

export class LobbyScene {
  public scene: THREE.Scene;
  public camera: THREE.PerspectiveCamera;
  public playerModel: AnimeCharacterModel;
  public mascot: EduBotMascot;
  public guardians: GuardianNPC[] = [];
  public worldNpcs: WorldNPC[] = [];

  // Gate triggers & localized billboards
  public gates: Array<{
    game: GameInfo;
    mesh: THREE.Group;
    position: THREE.Vector3;
    billboard: THREE.Mesh;
  }> = [];
  public nearestGate: GateTrigger | null = null;
  public nearestGuardian: GameInfo | null = null;
  public nearestWorldNpc: NpcEntity | null = null;
  public isNearMascot = false;

  // Walkable surfaces for accurate gravity & abyss fall detection
  private bridgeSegments: BridgeSegment[] = [];
  private circleColliders: Array<{ x: number; z: number; radius: number }> = [];
  public onFallRespawnCallback?: () => void;

  // Jump Pads (Wind Updrafts)
  public jumpPads: JumpPadTrigger[] = [];

  // Collectibles for Special NPC Quests
  public collectibleItems: Array<{
    id: string;
    type: 'mana_crystal' | 'sheriff_badge';
    mesh: THREE.Group;
    position: THREE.Vector3;
    collected: boolean;
  }> = [];
  public onCollectItemCallback?: (type: 'mana_crystal' | 'sheriff_badge') => void;

  public currentRegion: WorldRegion = WORLD_REGIONS[0];

  // Animated environment elements
  private petalParticles!: THREE.Points;
  private particleCount = 220;
  private fireflyParticles!: THREE.Points;
  private fireflyCount = 90;
  private windmillBlades?: THREE.Group;
  private fountainCrystal?: THREE.Mesh;
  private fountainRipple?: THREE.Mesh;
  private skyClouds: Array<{ group: THREE.Group; speed: number; angle: number; dist: number; y: number }> = [];
  private skyBirds: SkyBird[] = [];
  private islandAnimals: IslandAnimal[] = [];
  private shrineOrbs: THREE.Mesh[] = [];
  private torchFlames: THREE.Mesh[] = [];

  // Sprint trail dust particles
  private sprintDustPool: Array<{ mesh: THREE.Mesh; life: number; vel: THREE.Vector3 }> = [];
  private sprintDustTimer = 0;

  // Player physics / movement state
  public playerPosition = new THREE.Vector3(0, 0, 4);
  public playerRotation = 0;
  private playerVelocityY = 0;
  private isGrounded = true;
  public isCurrentlySprinting = false;

  // Camera Orbit & Angle State
  public cameraYaw = 0;
  public cameraPitch = 0.35;
  public cameraDistance = 5.8;
  private cameraBobTime = 0;
  private currentFov = 55;

  // Genshin-style Cinematic Dialogue Camera
  public isInDialogueMode = false;
  private dialogueTargetPos: THREE.Vector3 | null = null;

  // Visual Player Indicators
  public playerNameTag?: THREE.Mesh;
  public playerGroundRing?: THREE.Mesh;

  // Remote Multiplayer Players (up to 5 others = 6 total)
  private remotePlayersMap = new Map<string, RemotePlayerVisual>();

  constructor(playerModel: AnimeCharacterModel) {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color('#1a092b');
    this.scene.fog = new THREE.FogExp2('#1a092b', 0.0085);

    this.camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 420);
    this.camera.position.set(0, 4.5, 11);

    this.playerModel = playerModel;
    this.scene.add(this.playerModel.group);

    this.mascot = new EduBotMascot();
    this.mascot.group.position.set(2.4, 0, 2.0);
    this.scene.add(this.mascot.group);

    this.setupLighting();
    this.setupSkyDome();
    this.setupSkyClouds();
    this.setupCentralSanctuary();
    this.setupRegionalIslandsAndBridges();
    this.setupNatureDetails();
    this.setupWildlife();
    this.setupWorldNPCs();
    this.setupJumpPads();
    this.setupParticles();
    this.setupSprintDustPool();
    this.setupCollectibles();
    this.setupPlayerVisualIndicators();
  }

  private setupLighting() {
    const keyLight = new THREE.DirectionalLight('#fed7aa', 1.85);
    keyLight.position.set(45, 65, 35);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 200;
    const d = 100;
    keyLight.shadow.camera.left = -d;
    keyLight.shadow.camera.right = d;
    keyLight.shadow.camera.top = d;
    keyLight.shadow.camera.bottom = -d;
    this.scene.add(keyLight);

    // Subtle cool rim light opposite to sun for natural anime shading depth
    const rimLight = new THREE.DirectionalLight('#38bdf8', 0.55);
    rimLight.position.set(-40, 28, -45);
    this.scene.add(rimLight);

    const hemiLight = new THREE.HemisphereLight('#f9a8d4', '#311042', 1.0);
    this.scene.add(hemiLight);

    const amb = new THREE.AmbientLight('#a855f7', 0.5);
    this.scene.add(amb);
  }

  private setupSkyDome() {
    const skyGeo = new THREE.SphereGeometry(340, 32, 16);
    const skyCanvas = document.createElement('canvas');
    skyCanvas.width = 512;
    skyCanvas.height = 512;
    const ctx = skyCanvas.getContext('2d')!;

    const grad = ctx.createLinearGradient(0, 0, 0, 512);
    grad.addColorStop(0, '#12051d');
    grad.addColorStop(0.38, '#380e3d');
    grad.addColorStop(0.68, '#c2410c');
    grad.addColorStop(1, '#fde68a');

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 512);

    // Twinkling stars in upper twilight sky
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    for (let s = 0; s < 140; s++) {
      const sx = (Math.sin(s * 78.233) * 0.5 + 0.5) * 512;
      const sy = (Math.cos(s * 12.989) * 0.5 + 0.5) * 210;
      const r = s % 5 === 0 ? 1.8 : 1.0;
      ctx.beginPath();
      ctx.arc(sx, sy, r, 0, Math.PI * 2);
      ctx.fill();
    }

    const skyTex = new THREE.CanvasTexture(skyCanvas);
    const skyMat = new THREE.MeshBasicMaterial({
      map: skyTex,
      side: THREE.BackSide,
      depthWrite: false,
    });
    const sky = new THREE.Mesh(skyGeo, skyMat);
    this.scene.add(sky);
  }

  private setupSkyClouds() {
    const cloudMat = new THREE.MeshToonMaterial({
      color: '#fde2e4',
      transparent: true,
      opacity: 0.85,
    });
    for (let i = 0; i < 16; i++) {
      const group = new THREE.Group();
      const puffs = 3 + (i % 3);
      for (let p = 0; p < puffs; p++) {
        const puff = new THREE.Mesh(
          new THREE.SphereGeometry(3.2 + (p % 2) * 1.4, 10, 10),
          cloudMat
        );
        puff.scale.set(1.4, 0.65, 1.1);
        puff.position.set((p - puffs * 0.5) * 3.4, (p % 2) * 0.8, (Math.random() - 0.5) * 2.0);
        group.add(puff);
      }
      const angle = (i / 16) * Math.PI * 2;
      const dist = 70 + (i % 4) * 28;
      const y = 22 + (i % 5) * 6;
      group.position.set(Math.cos(angle) * dist, y, Math.sin(angle) * dist);
      this.scene.add(group);
      this.skyClouds.push({ group, speed: 0.012 + (i % 3) * 0.004, angle, dist, y });
    }
  }

  private setupCentralSanctuary() {
    const island = new THREE.Group();

    const topGeo = new THREE.CylinderGeometry(18, 17, 1.4, 32);
    const grassMat = new THREE.MeshToonMaterial({ color: '#16a34a' });
    const topMesh = new THREE.Mesh(topGeo, grassMat);
    topMesh.position.y = -0.7;
    topMesh.receiveShadow = true;
    island.add(topMesh);

    const baseGeo = new THREE.ConeGeometry(17, 15, 24);
    const rockMat = new THREE.MeshToonMaterial({ color: '#4a2840' });
    const baseMesh = new THREE.Mesh(baseGeo, rockMat);
    baseMesh.position.y = -8.2;
    baseMesh.rotation.x = Math.PI;
    island.add(baseMesh);

    const plazaGeo = new THREE.CylinderGeometry(11, 11, 0.08, 32);
    const stoneTex = createCobblestoneTexture();
    const plazaMat = new THREE.MeshStandardMaterial({
      map: stoneTex,
      roughness: 0.8,
    });
    const plazaMesh = new THREE.Mesh(plazaGeo, plazaMat);
    plazaMesh.position.y = 0.02;
    plazaMesh.receiveShadow = true;
    island.add(plazaMesh);

    // Central Glowing Knowledge Crystal Fountain + Animated Water Surface
    const fountainGroup = new THREE.Group();
    const basin = new THREE.Mesh(
      new THREE.CylinderGeometry(2.6, 2.4, 0.5, 16),
      new THREE.MeshToonMaterial({ color: '#e2e8f0' })
    );
    basin.position.y = 0.25;
    fountainGroup.add(basin);

    const waterDisk = new THREE.Mesh(
      new THREE.CircleGeometry(2.3, 24),
      new THREE.MeshStandardMaterial({
        color: '#38bdf8',
        emissive: '#0284c7',
        emissiveIntensity: 0.35,
        roughness: 0.1,
        metalness: 0.3,
      })
    );
    waterDisk.rotation.x = -Math.PI / 2;
    waterDisk.position.y = 0.51;
    fountainGroup.add(waterDisk);

    this.fountainRipple = new THREE.Mesh(
      new THREE.RingGeometry(0.4, 0.55, 24),
      new THREE.MeshBasicMaterial({ color: '#bae6fd', side: THREE.DoubleSide, transparent: true, opacity: 0.7 })
    );
    this.fountainRipple.rotation.x = -Math.PI / 2;
    this.fountainRipple.position.y = 0.53;
    fountainGroup.add(this.fountainRipple);

    this.fountainCrystal = new THREE.Mesh(
      new THREE.OctahedronGeometry(0.95, 0),
      new THREE.MeshStandardMaterial({
        color: '#38bdf8',
        emissive: '#0284c7',
        emissiveIntensity: 1.15,
        roughness: 0.1,
        metalness: 0.25,
      })
    );
    this.fountainCrystal.position.y = 2.0;
    fountainGroup.add(this.fountainCrystal);

    const crystalLight = new THREE.PointLight('#38bdf8', 2.2, 12);
    crystalLight.position.set(0, 2.2, 0);
    fountainGroup.add(crystalLight);
    island.add(fountainGroup);
    this.addCollider(0, 0, 2.8);

    // Animated Windmill Landmark
    const windmill = this.createWindmill();
    windmill.position.set(-10.5, 0, -8.5);
    windmill.rotation.y = Math.PI * 0.22;
    island.add(windmill);
    this.addCollider(-10.5, -8.5, 2.1);

    // Central Waypoint Shrine
    const shrine = this.createWaypointShrine();
    shrine.position.set(0, 0, -11);
    island.add(shrine);
    this.addCollider(0, -11, 1.35);

    // Cozy Wooden Benches & Street Lanterns around the plaza
    const benchAngles = [0.6, 2.2, 4.0, 5.5];
    benchAngles.forEach((ang) => {
      const bench = this.createWoodenBench();
      const bx = Math.cos(ang) * 9.5;
      const bz = Math.sin(ang) * 9.5;
      bench.position.set(bx, 0, bz);
      bench.rotation.y = -ang + Math.PI / 2;
      island.add(bench);
      this.addCollider(bx, bz, 0.95);

      const lamp = this.createWarmLampPost();
      const lx = Math.cos(ang + 0.25) * 10.6;
      const lz = Math.sin(ang + 0.25) * 10.6;
      lamp.position.set(lx, 0, lz);
      island.add(lamp);
      this.addCollider(lx, lz, 0.45);
    });

    // Lush Sakura & Pine trees near Sanctuary rim
    const treePositions: Array<[number, number, boolean]> = [
      [13, -6, true],
      [-13, 7, false],
      [11, 10, true],
      [-14, -1, false],
    ];
    treePositions.forEach(([tx, tz, isSakura]) => {
      const tree = isSakura ? this.createSakuraTree() : this.createPineTree();
      tree.position.set(tx, 0, tz);
      island.add(tree);
      this.addCollider(tx, tz, 0.85);
    });

    this.scene.add(island);
  }

  private addCollider(x: number, z: number, radius: number) {
    this.circleColliders.push({ x, z, radius });
  }

  private createWindmill(): THREE.Group {
    const wm = new THREE.Group();
    const towerMat = new THREE.MeshToonMaterial({ color: '#f1f5f9' });
    const roofMat = new THREE.MeshToonMaterial({ color: '#dc2626' });

    const tower = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.8, 6.0, 12), towerMat);
    tower.position.y = 3.0;
    tower.castShadow = true;
    wm.add(tower);

    const roof = new THREE.Mesh(new THREE.ConeGeometry(1.5, 2.0, 12), roofMat);
    roof.position.y = 7.0;
    wm.add(roof);

    const bladeGroup = new THREE.Group();
    bladeGroup.position.set(0, 5.5, 1.35);
    const bladeMat = new THREE.MeshToonMaterial({ color: '#fed7aa' });
    for (let b = 0; b < 4; b++) {
      const armPivot = new THREE.Group();
      armPivot.rotation.z = (b * Math.PI) / 2;
      const blade = new THREE.Mesh(new THREE.BoxGeometry(0.36, 3.0, 0.06), bladeMat);
      blade.position.y = 1.5;
      armPivot.add(blade);
      bladeGroup.add(armPivot);
    }
    this.windmillBlades = bladeGroup;
    wm.add(bladeGroup);
    return wm;
  }

  private createWoodenBench(): THREE.Group {
    const bench = new THREE.Group();
    const wood = new THREE.MeshToonMaterial({ color: '#92400e' });
    const iron = new THREE.MeshStandardMaterial({ color: '#334155', metalness: 0.6 });

    const seat = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.1, 0.55), wood);
    seat.position.y = 0.45;
    const back = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.45, 0.08), wood);
    back.position.set(0, 0.72, -0.22);
    back.rotation.x = -0.15;

    [-0.75, 0.75].forEach((lx) => {
      const leg = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.45, 0.5), iron);
      leg.position.set(lx, 0.225, 0);
      bench.add(leg);
    });
    bench.add(seat, back);
    return bench;
  }

  private createWarmLampPost(): THREE.Group {
    const lamp = new THREE.Group();
    const iron = new THREE.MeshStandardMaterial({ color: '#1e293b', metalness: 0.7 });
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.1, 2.8, 8), iron);
    post.position.y = 1.4;
    const lantern = new THREE.Mesh(
      new THREE.SphereGeometry(0.22, 10, 10),
      new THREE.MeshBasicMaterial({ color: '#fde047' })
    );
    lantern.position.y = 2.9;
    this.torchFlames.push(lantern);
    lamp.add(post, lantern);
    return lamp;
  }

  private createPineTree(): THREE.Group {
    const tree = new THREE.Group();
    const trunk = new THREE.Mesh(
      new THREE.CylinderGeometry(0.22, 0.34, 2.4, 8),
      new THREE.MeshToonMaterial({ color: '#78350f' })
    );
    trunk.position.y = 1.2;
    tree.add(trunk);

    const leafMat = new THREE.MeshToonMaterial({ color: '#15803d' });
    for (let i = 0; i < 3; i++) {
      const cone = new THREE.Mesh(new THREE.ConeGeometry(1.5 - i * 0.35, 1.8, 8), leafMat);
      cone.position.y = 2.4 + i * 1.1;
      tree.add(cone);
    }
    return tree;
  }

  private createWaypointShrine(): THREE.Group {
    const shrine = new THREE.Group();
    const stoneMat = new THREE.MeshStandardMaterial({ color: '#475569', roughness: 0.8 });
    const crystalMat = new THREE.MeshStandardMaterial({
      color: '#38bdf8',
      emissive: '#0284c7',
      emissiveIntensity: 0.9,
    });

    const base = new THREE.Mesh(new THREE.CylinderGeometry(1.0, 1.2, 0.4, 8), stoneMat);
    base.position.y = 0.2;
    shrine.add(base);

    const pillar = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.25, 1.8, 8), stoneMat);
    pillar.position.y = 1.1;
    shrine.add(pillar);

    const orb = new THREE.Mesh(new THREE.OctahedronGeometry(0.35, 0), crystalMat);
    orb.position.y = 2.4;
    this.shrineOrbs.push(orb);
    shrine.add(orb);

    const pLight = new THREE.PointLight('#38bdf8', 1.4, 6);
    pLight.position.set(0, 2.4, 0);
    shrine.add(pLight);

    return shrine;
  }

  private setupRegionalIslandsAndBridges() {
    const centerRadius = 18;

    GAME_CATALOG.forEach((game) => {
      const region = WORLD_REGIONS.find((r) => r.gameId === game.id);
      if (!region) return;

      const [targetX, targetZ] = region.center;
      const islandRadius = region.radius;

      const islandGroup = new THREE.Group();
      islandGroup.position.set(targetX, 0, targetZ);

      const topGeo = new THREE.CylinderGeometry(islandRadius, islandRadius * 0.94, 1.5, 32);
      const grassMat = new THREE.MeshToonMaterial({
        color: this.getRegionGrassColor(game.id),
      });
      const topMesh = new THREE.Mesh(topGeo, grassMat);
      topMesh.position.y = -0.75;
      topMesh.receiveShadow = true;
      islandGroup.add(topMesh);

      const rockGeo = new THREE.ConeGeometry(islandRadius * 0.94, 16, 24);
      const rockMat = new THREE.MeshToonMaterial({ color: '#3b1c34' });
      const rockMesh = new THREE.Mesh(rockGeo, rockMat);
      rockMesh.position.y = -8.75;
      rockMesh.rotation.x = Math.PI;
      islandGroup.add(rockMesh);

      this.populateRegionThematicProps(islandGroup, game.id, targetX, targetZ);

      const shrine = this.createWaypointShrine();
      shrine.position.set(0, 0, -islandRadius * 0.55);
      islandGroup.add(shrine);
      this.addCollider(targetX, targetZ - islandRadius * 0.55, 1.35);

      // Gate & Guardian on this island
      const gateGroup = new THREE.Group();
      gateGroup.position.set(0, 0, islandRadius * 0.4);

      const pillarMat = new THREE.MeshToonMaterial({ color: game.color });
      const archMat = new THREE.MeshStandardMaterial({
        color: '#ffffff',
        roughness: 0.3,
        emissive: game.color,
        emissiveIntensity: 0.35,
      });

      const pGeo = new THREE.CylinderGeometry(0.38, 0.48, 4.4, 10);
      const leftP = new THREE.Mesh(pGeo, pillarMat);
      leftP.position.set(-1.6, 2.2, 0);
      const rightP = new THREE.Mesh(pGeo, pillarMat);
      rightP.position.set(1.6, 2.2, 0);

      // Solid colliders on the two gate pillars so players walk cleanly through the center portal
      this.addCollider(targetX - 1.6, targetZ + islandRadius * 0.4, 0.72);
      this.addCollider(targetX + 1.6, targetZ + islandRadius * 0.4, 0.72);

      const archGeo = new THREE.BoxGeometry(4.0, 0.8, 0.9);
      const arch = new THREE.Mesh(archGeo, archMat);
      arch.position.set(0, 4.7, 0);

      gateGroup.add(leftP, rightP, arch);

      const portalGeo = new THREE.PlaneGeometry(2.6, 4.2);
      const portalMat = new THREE.MeshBasicMaterial({
        color: game.color,
        transparent: true,
        opacity: 0.55,
        side: THREE.DoubleSide,
      });
      const portalPlane = new THREE.Mesh(portalGeo, portalMat);
      portalPlane.position.set(0, 2.3, 0);
      gateGroup.add(portalPlane);

      const labelMesh = this.createGateBillboard(game.title, game.subject, game.color);
      labelMesh.position.set(0, 5.7, 0);
      gateGroup.add(labelMesh);

      const gateLight = new THREE.PointLight(game.color, 1.4, 8);
      gateLight.position.set(0, 3.2, 0.8);
      gateGroup.add(gateLight);

      islandGroup.add(gateGroup);
      this.scene.add(islandGroup);

      const worldGatePos = new THREE.Vector3(targetX, 0, targetZ + islandRadius * 0.4);
      this.gates.push({
        game,
        mesh: gateGroup,
        position: worldGatePos,
        billboard: labelMesh,
      });

      const guardian = new GuardianNPC(game.guardian);
      guardian.group.position.set(targetX + 2.5, 0, targetZ + islandRadius * 0.45);
      this.scene.add(guardian.group);
      this.guardians.push(guardian);

      this.buildSuspensionBridge(
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(targetX, 0, targetZ),
        centerRadius,
        islandRadius,
        game.color
      );
    });
  }

  private getRegionGrassColor(gameId: string): string {
    switch (gameId) {
      case 'dungeon': return '#1a0b2e';
      case 'math': return '#1e1b4b';
      case 'physics': return '#15803d';
      case 'design': return '#4c1d95';
      case 'ui': return '#082f49';
      case 'ux': return '#78350f';
      case 'chemistry': return '#064e3b';
      case 'code': return '#1e293b';
      case 'biology': return '#15803d';
      default: return '#15803d';
    }
  }

  private populateRegionThematicProps(group: THREE.Group, gameId: string, wx: number, wz: number) {
    if (gameId === 'dungeon') {
      for (let i = 0; i < 4; i++) {
        const pillar = new THREE.Mesh(
          new THREE.CylinderGeometry(0.5, 0.7, 7.5, 6),
          new THREE.MeshStandardMaterial({
            color: '#1e1035',
            emissive: '#7c3aed',
            emissiveIntensity: 0.85,
            roughness: 0.2,
          })
        );
        const ang = (i / 4) * Math.PI * 2 + 0.4;
        const px = Math.cos(ang) * 8.5;
        const pz = Math.sin(ang) * 8.5;
        pillar.position.set(px, 3.75, pz);
        group.add(pillar);
        this.addCollider(wx + px, wz + pz, 0.85);
      }
    } else if (gameId === 'physics') {
      const torii = this.createToriiGate();
      torii.position.set(0, 0, 3.2);
      group.add(torii);
      this.addCollider(wx - 2, wz + 3.2, 0.55);
      this.addCollider(wx + 2, wz + 3.2, 0.55);

      for (let i = 0; i < 4; i++) {
        const tree = this.createSakuraTree();
        const tx = -8.5 + i * 5.5;
        const tz = -6.5 + (i % 2) * 4.5;
        tree.position.set(tx, 0, tz);
        group.add(tree);
        this.addCollider(wx + tx, wz + tz, 0.75);
      }
    } else if (gameId === 'math') {
      for (let i = 0; i < 3; i++) {
        const spire = new THREE.Mesh(
          new THREE.ConeGeometry(0.8, 6.0, 6),
          new THREE.MeshStandardMaterial({ color: '#ec4899', emissive: '#be185d', emissiveIntensity: 0.6 })
        );
        const sx = -6 + i * 6;
        spire.position.set(sx, 3, -6);
        group.add(spire);
        this.addCollider(wx + sx, wz - 6, 0.9);
      }
    } else if (gameId === 'biology') {
      for (let i = 0; i < 4; i++) {
        const shroom = this.createBioMushroom();
        const mx = -7 + i * 4.5;
        const mz = -5 + (i % 2) * 4;
        shroom.position.set(mx, 0, mz);
        group.add(shroom);
        this.addCollider(wx + mx, wz + mz, 0.75);
      }
    } else if (gameId === 'ui') {
      for (let i = 0; i < 3; i++) {
        const pillar = new THREE.Mesh(
          new THREE.BoxGeometry(0.8, 7.0, 0.8),
          new THREE.MeshStandardMaterial({ color: '#06b6d4', emissive: '#0891b2', emissiveIntensity: 0.7 })
        );
        const px = -7 + i * 7;
        pillar.position.set(px, 3.5, -6);
        group.add(pillar);
        this.addCollider(wx + px, wz - 6, 0.75);
      }
    } else if (gameId === 'design') {
      ['#ec4899', '#facc15', '#38bdf8'].forEach((col, i) => {
        const gem = new THREE.Mesh(
          new THREE.OctahedronGeometry(1.1, 0),
          new THREE.MeshStandardMaterial({ color: col, emissive: col, emissiveIntensity: 0.5 })
        );
        const gx = -6 + i * 6;
        gem.position.set(gx, 2.2, -5);
        this.shrineOrbs.push(gem);
        group.add(gem);
        this.addCollider(wx + gx, wz - 5, 1.0);
      });
    } else if (gameId === 'ux') {
      for (let i = 0; i < 2; i++) {
        const table = new THREE.Group();
        const post = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 2.6, 8), new THREE.MeshToonMaterial({ color: '#78350f' }));
        post.position.y = 1.3;
        const umbrella = new THREE.Mesh(new THREE.ConeGeometry(1.8, 0.7, 8), new THREE.MeshToonMaterial({ color: i === 0 ? '#f59e0b' : '#fb7185' }));
        umbrella.position.y = 2.65;
        table.add(post, umbrella);
        const ux = -5 + i * 10;
        table.position.set(ux, 0, -4);
        group.add(table);
        this.addCollider(wx + ux, wz - 4, 0.7);
      }
    } else if (gameId === 'chemistry') {
      const core = new THREE.Mesh(new THREE.SphereGeometry(0.9, 14, 14), new THREE.MeshStandardMaterial({ color: '#10b981', emissive: '#059669', emissiveIntensity: 0.8 }));
      core.position.set(0, 2.6, -5);
      const orbitRing = new THREE.Mesh(new THREE.TorusGeometry(2.0, 0.08, 8, 28), new THREE.MeshBasicMaterial({ color: '#38bdf8' }));
      orbitRing.position.set(0, 2.6, -5);
      orbitRing.rotation.x = 0.6;
      group.add(core, orbitRing);
      this.addCollider(wx, wz - 5, 1.2);
    } else if (gameId === 'code') {
      for (let i = 0; i < 3; i++) {
        const mono = new THREE.Mesh(
          new THREE.BoxGeometry(1.1, 4.2, 0.6),
          new THREE.MeshStandardMaterial({ color: '#1e293b', emissive: '#3b82f6', emissiveIntensity: 0.45 })
        );
        const mx = -6 + i * 6;
        mono.position.set(mx, 2.1, -6);
        group.add(mono);
        this.addCollider(wx + mx, wz - 6, 0.85);
      }
    }
  }

  private setupNatureDetails() {
    // Instanced Grass Tufts + Wildflowers + Mossy Boulders across Sanctuary & Green Islands
    const bladeGeo = new THREE.ConeGeometry(0.11, 0.42, 4);
    bladeGeo.translate(0, 0.21, 0);
    const bladeMat = new THREE.MeshToonMaterial({ color: '#22c55e' });

    const flowerGeo = new THREE.SphereGeometry(0.14, 6, 6);
    const rockGeo = new THREE.DodecahedronGeometry(0.55, 0);
    const rockMat = new THREE.MeshToonMaterial({ color: '#64748b' });

    const grassPositions: Array<{ x: number; z: number; s: number; rot: number }> = [];
    const flowerPositions: Array<{ x: number; z: number; col: string }> = [];
    const boulderPositions: Array<{ x: number; z: number; s: number; rot: number }> = [];

    const flowerColors = ['#f472b6', '#fde047', '#38bdf8', '#fb7185', '#c084fc'];

    WORLD_REGIONS.forEach((reg) => {
      const countGrass = reg.id === 'sanctuary' ? 75 : 42;
      const minR = reg.id === 'sanctuary' ? 11.2 : 4.5;
      const maxR = reg.radius - 1.6;

      for (let i = 0; i < countGrass; i++) {
        const ang = Math.random() * Math.PI * 2;
        const r = minR + Math.random() * (maxR - minR);
        const x = reg.center[0] + Math.cos(ang) * r;
        const z = reg.center[1] + Math.sin(ang) * r;
        grassPositions.push({ x, z, s: 0.7 + Math.random() * 0.7, rot: Math.random() * Math.PI });
        if (i % 3 === 0) {
          flowerPositions.push({ x: x + 0.15, z: z - 0.1, col: flowerColors[i % flowerColors.length] });
        }
      }

      for (let b = 0; b < 4; b++) {
        const ang = (b / 4) * Math.PI * 2 + 0.3;
        const r = reg.radius - 2.2;
        boulderPositions.push({
          x: reg.center[0] + Math.cos(ang) * r,
          z: reg.center[1] + Math.sin(ang) * r,
          s: 0.7 + (b % 2) * 0.45,
          rot: b * 1.1,
        });
      }
    });

    const grassInst = new THREE.InstancedMesh(bladeGeo, bladeMat, grassPositions.length);
    const dummy = new THREE.Object3D();
    grassPositions.forEach((g, idx) => {
      dummy.position.set(g.x, 0, g.z);
      dummy.rotation.set(0, g.rot, 0);
      dummy.scale.set(g.s, g.s, g.s);
      dummy.updateMatrix();
      grassInst.setMatrixAt(idx, dummy.matrix);
    });
    this.scene.add(grassInst);

    const flowerMat = new THREE.MeshBasicMaterial({ color: '#ffffff' });
    const flowerInst = new THREE.InstancedMesh(flowerGeo, flowerMat, flowerPositions.length);
    const tmpCol = new THREE.Color();
    flowerPositions.forEach((f, idx) => {
      dummy.position.set(f.x, 0.22, f.z);
      dummy.rotation.set(0, 0, 0);
      dummy.scale.set(1, 0.7, 1);
      dummy.updateMatrix();
      flowerInst.setMatrixAt(idx, dummy.matrix);
      tmpCol.set(f.col);
      flowerInst.setColorAt(idx, tmpCol);
    });
    if (flowerInst.instanceColor) flowerInst.instanceColor.needsUpdate = true;
    this.scene.add(flowerInst);

    const rockInst = new THREE.InstancedMesh(rockGeo, rockMat, boulderPositions.length);
    boulderPositions.forEach((rk, idx) => {
      dummy.position.set(rk.x, 0.2, rk.z);
      dummy.rotation.set(0, rk.rot, 0);
      dummy.scale.set(rk.s, rk.s * 0.7, rk.s);
      dummy.updateMatrix();
      rockInst.setMatrixAt(idx, dummy.matrix);
      this.addCollider(rk.x, rk.z, 0.6 * rk.s);
    });
    this.scene.add(rockInst);
  }

  private setupWildlife() {
    // 1. Flocks of Graceful Soaring Sky Birds
    const birdBodyMat = new THREE.MeshToonMaterial({ color: '#f8fafc' });
    const wingMat = new THREE.MeshToonMaterial({ color: '#e2e8f0', side: THREE.DoubleSide });

    for (let i = 0; i < 14; i++) {
      const birdGroup = new THREE.Group();
      const body = new THREE.Mesh(new THREE.ConeGeometry(0.14, 0.55, 6), birdBodyMat);
      body.rotation.x = Math.PI / 2;
      birdGroup.add(body);

      const wingGeo = new THREE.PlaneGeometry(0.65, 0.25);
      const leftWing = new THREE.Mesh(wingGeo, wingMat);
      leftWing.position.set(-0.34, 0.05, 0);
      const rightWing = new THREE.Mesh(wingGeo, wingMat);
      rightWing.position.set(0.34, 0.05, 0);
      birdGroup.add(leftWing, rightWing);

      const center = i < 7 ? new THREE.Vector3(0, 0, 0) : new THREE.Vector3(45, 0, 35);
      this.scene.add(birdGroup);
      this.skyBirds.push({
        group: birdGroup,
        leftWing,
        rightWing,
        center,
        radius: 16 + (i % 5) * 6,
        speed: 0.25 + (i % 3) * 0.08,
        phase: i * 0.9,
        altitude: 11 + (i % 4) * 3.5,
      });
    }

    // 2. Cute Island Rabbits & Foxes roaming grassy islands
    const animalHomes: Array<[number, number, string]> = [
      [8, -9, '#f8fafc'],    // White Sanctuary bunny
      [-8, -12, '#fed7aa'],  // Cream Sanctuary bunny
      [52, 39, '#fb923c'],   // Sakura valley fox
      [60, 48, '#f8fafc'],   // Sakura valley bunny
      [64, -10, '#a3e635'],  // Bio forest critter
      [-42, 45, '#f9a8d4'],  // Pastel bunny
    ];

    animalHomes.forEach(([ax, az, col], idx) => {
      const animal = new THREE.Group();
      const furMat = new THREE.MeshToonMaterial({ color: col });

      const body = new THREE.Mesh(new THREE.SphereGeometry(0.24, 10, 10), furMat);
      body.scale.set(0.9, 0.85, 1.25);
      body.position.y = 0.22;
      animal.add(body);

      const head = new THREE.Mesh(new THREE.SphereGeometry(0.18, 10, 10), furMat);
      head.position.set(0, 0.38, 0.22);
      animal.add(head);

      const earGeo = new THREE.ConeGeometry(0.055, 0.24, 6);
      const earL = new THREE.Mesh(earGeo, furMat);
      earL.position.set(-0.08, 0.54, 0.22);
      const earR = new THREE.Mesh(earGeo, furMat);
      earR.position.set(0.08, 0.54, 0.22);
      animal.add(earL, earR);

      const tail = new THREE.Mesh(new THREE.SphereGeometry(0.08, 6, 6), new THREE.MeshToonMaterial({ color: '#ffffff' }));
      tail.position.set(0, 0.22, -0.28);
      animal.add(tail);

      animal.position.set(ax, 0, az);
      this.scene.add(animal);

      this.islandAnimals.push({
        group: animal,
        homeCenter: new THREE.Vector3(ax, 0, az),
        wanderTarget: new THREE.Vector3(ax + 1.5, 0, az + 1.0),
        phase: idx * 1.4,
        pauseTimer: 1.0,
        earL,
        earR,
      });
    });
  }

  private createToriiGate(): THREE.Group {
    const torii = new THREE.Group();
    const redMat = new THREE.MeshToonMaterial({ color: '#dc2626' });
    const blackMat = new THREE.MeshToonMaterial({ color: '#18181b' });

    const pGeo = new THREE.CylinderGeometry(0.25, 0.3, 4.5, 8);
    const p1 = new THREE.Mesh(pGeo, redMat);
    p1.position.set(-2, 2.25, 0);
    const p2 = new THREE.Mesh(pGeo, redMat);
    p2.position.set(2, 2.25, 0);

    const beam1 = new THREE.Mesh(new THREE.BoxGeometry(5.2, 0.45, 0.45), redMat);
    beam1.position.set(0, 4.6, 0);

    const roof = new THREE.Mesh(new THREE.BoxGeometry(5.6, 0.25, 0.6), blackMat);
    roof.position.set(0, 4.9, 0);

    torii.add(p1, p2, beam1, roof);
    return torii;
  }

  private createSakuraTree(): THREE.Group {
    const tree = new THREE.Group();
    const trunk = new THREE.Mesh(
      new THREE.CylinderGeometry(0.3, 0.4, 3.8, 8),
      new THREE.MeshToonMaterial({ color: '#78350f' })
    );
    trunk.position.y = 1.9;
    tree.add(trunk);

    const blossomMat = new THREE.MeshToonMaterial({ color: '#f472b6' });
    for (let i = 0; i < 4; i++) {
      const puff = new THREE.Mesh(new THREE.SphereGeometry(1.3, 8, 8), blossomMat);
      puff.position.set((i - 1.5) * 0.9, 3.8 + (i % 2) * 0.4, ((i % 3) - 1) * 0.7);
      tree.add(puff);
    }
    return tree;
  }

  private createBioMushroom(): THREE.Group {
    const shroom = new THREE.Group();
    const stem = new THREE.Mesh(
      new THREE.CylinderGeometry(0.3, 0.5, 3.2, 8),
      new THREE.MeshStandardMaterial({ color: '#fef08a' })
    );
    stem.position.y = 1.6;
    shroom.add(stem);

    const cap = new THREE.Mesh(
      new THREE.ConeGeometry(1.8, 1.2, 12),
      new THREE.MeshStandardMaterial({
        color: '#84cc16',
        emissive: '#4d7c0f',
        emissiveIntensity: 0.8,
      })
    );
    cap.position.y = 3.3;
    shroom.add(cap);
    return shroom;
  }

  private buildSuspensionBridge(
    centerPos: THREE.Vector3,
    targetPos: THREE.Vector3,
    centerRad: number,
    targetRad: number,
    accentColor: string
  ) {
    const bridgeGroup = new THREE.Group();
    const dir = new THREE.Vector3().subVectors(targetPos, centerPos).normalize();
    const start = new THREE.Vector3().copy(centerPos).addScaledVector(dir, centerRad - 0.4);
    const end = new THREE.Vector3().copy(targetPos).addScaledVector(dir, -(targetRad - 0.4));
    const distance = start.distanceTo(end);

    this.bridgeSegments.push({
      start: start.clone(),
      end: end.clone(),
      dir: dir.clone(),
      length: distance,
      halfWidth: 1.55,
    });

    const steps = Math.max(4, Math.floor(distance / 2.0));
    const plankMat = new THREE.MeshStandardMaterial({ color: '#78350f', roughness: 0.9 });
    const ropeMat = new THREE.MeshStandardMaterial({ color: '#b45309', roughness: 0.9 });
    const sideVec = new THREE.Vector3(-dir.z, 0, dir.x);

    for (let i = 0; i <= steps; i++) {
      const alpha = i / steps;
      const pos = new THREE.Vector3().lerpVectors(start, end, alpha);
      const sag = Math.sin(alpha * Math.PI) * -0.6;
      pos.y += sag;

      const plank = new THREE.Mesh(new THREE.BoxGeometry(2.7, 0.16, 1.8), plankMat);
      plank.position.copy(pos);
      plank.lookAt(new THREE.Vector3().addVectors(pos, dir));
      bridgeGroup.add(plank);

      [-1.25, 1.25].forEach((side) => {
        const post = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 1.15, 6), ropeMat);
        post.position.set(
          pos.x + sideVec.x * side,
          pos.y + 0.55,
          pos.z + sideVec.z * side
        );
        bridgeGroup.add(post);
      });
    }

    // Glowing lantern post at start of bridge
    const signPost = new THREE.Group();
    signPost.position.copy(start).addScaledVector(sideVec, 1.6);
    const sPillar = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.1, 2.2, 8), ropeMat);
    sPillar.position.y = 1.1;
    const sGem = new THREE.Mesh(
      new THREE.OctahedronGeometry(0.22, 0),
      new THREE.MeshBasicMaterial({ color: accentColor })
    );
    sGem.position.y = 2.3;
    signPost.add(sPillar, sGem);
    bridgeGroup.add(signPost);

    this.scene.add(bridgeGroup);
  }

  /**
   * Computes exact ground/bridge Y height under (x, z), or null if over open sky void!
   */
  public getWalkableFloorHeight(x: number, z: number): number | null {
    // 1. Central Sanctuary disk (r = 18.0)
    if (Math.hypot(x, z) <= 18.0) {
      return 0;
    }

    // 2. Regional Islands
    for (let i = 0; i < WORLD_REGIONS.length; i++) {
      const reg = WORLD_REGIONS[i];
      if (reg.id === 'sanctuary') continue;
      if (Math.hypot(x - reg.center[0], z - reg.center[1]) <= reg.radius) {
        return 0;
      }
    }

    // 3. Suspension Bridges
    for (let i = 0; i < this.bridgeSegments.length; i++) {
      const seg = this.bridgeSegments[i];
      const dx = x - seg.start.x;
      const dz = z - seg.start.z;
      const proj = dx * seg.dir.x + dz * seg.dir.z;
      const perp = Math.abs(dx * -seg.dir.z + dz * seg.dir.x);

      if (proj >= -0.8 && proj <= seg.length + 0.8 && perp <= seg.halfWidth) {
        const alpha = THREE.MathUtils.clamp(proj / seg.length, 0, 1);
        return Math.sin(alpha * Math.PI) * -0.6;
      }
    }

    return null;
  }

  private setupWorldNPCs() {
    WORLD_NPCS.forEach((npcData) => {
      const npc = new WorldNPC(npcData);
      this.scene.add(npc.group);
      this.worldNpcs.push(npc);
    });
  }

  private setupJumpPads() {
    WORLD_REGIONS.forEach((region) => {
      if (region.id === 'sanctuary') return;
      const [tx, tz] = region.center;
      const dir = new THREE.Vector3(tx, 0, tz).normalize();
      const padPos = new THREE.Vector3().copy(dir).multiplyScalar(16.6);

      this.jumpPads.push({
        position: padPos,
        targetRegionName: region.name,
      });

      const ringGeo = new THREE.RingGeometry(0.6, 1.2, 24);
      const ringMat = new THREE.MeshBasicMaterial({
        color: '#facc15',
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.8,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = -Math.PI / 2;
      ring.position.set(padPos.x, 0.05, padPos.z);
      this.scene.add(ring);

      const updraftLight = new THREE.PointLight('#facc15', 1.6, 6);
      updraftLight.position.set(padPos.x, 0.8, padPos.z);
      this.scene.add(updraftLight);
    });
  }

  private setupCollectibles() {
    const manaPositions: Array<[number, number, number]> = [
      [-6, 0.8, -4],
      [5, 0.8, -7],
      [-8, 0.8, 4],
      [7, 0.8, 6],
      [0, 0.8, 12],
    ];

    manaPositions.forEach((pos, idx) => {
      const group = new THREE.Group();
      group.position.set(pos[0], pos[1], pos[2]);

      const crystal = new THREE.Mesh(
        new THREE.OctahedronGeometry(0.35, 0),
        new THREE.MeshStandardMaterial({
          color: '#a855f7',
          emissive: '#c084fc',
          emissiveIntensity: 0.9,
          roughness: 0.1,
        })
      );
      group.add(crystal);

      const light = new THREE.PointLight('#c084fc', 1.2, 4);
      light.position.y = 0.2;
      group.add(light);

      this.scene.add(group);
      this.collectibleItems.push({
        id: `mana_${idx}`,
        type: 'mana_crystal',
        mesh: group,
        position: new THREE.Vector3(pos[0], pos[1], pos[2]),
        collected: false,
      });
    });

    // Placed safely inside Sakura Valley island [55, 45] (radius 18)
    const sheriffPositions: Array<[number, number, number]> = [
      [47, 0.8, 37],
      [63, 0.8, 38],
      [52, 0.8, 33],
      [45, 0.8, 50],
      [62, 0.8, 52],
    ];

    sheriffPositions.forEach((pos, idx) => {
      const group = new THREE.Group();
      group.position.set(pos[0], pos[1], pos[2]);

      const starBadge = new THREE.Mesh(
        new THREE.CylinderGeometry(0.28, 0.28, 0.08, 5),
        new THREE.MeshStandardMaterial({
          color: '#fbbf24',
          emissive: '#f59e0b',
          emissiveIntensity: 0.9,
          metalness: 0.8,
          roughness: 0.2,
        })
      );
      starBadge.rotation.x = Math.PI / 2;
      group.add(starBadge);

      const light = new THREE.PointLight('#f59e0b', 1.2, 4);
      light.position.y = 0.2;
      group.add(light);

      this.scene.add(group);
      this.collectibleItems.push({
        id: `badge_${idx}`,
        type: 'sheriff_badge',
        mesh: group,
        position: new THREE.Vector3(pos[0], pos[1], pos[2]),
        collected: false,
      });
    });
  }

  private createGateBillboard(title: string, subject: string, accentColor: string): THREE.Mesh {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 160;
    const ctx = canvas.getContext('2d')!;

    ctx.fillStyle = 'rgba(26, 11, 46, 0.92)';
    ctx.beginPath();
    ctx.roundRect(10, 10, 492, 140, 24);
    ctx.fill();

    ctx.strokeStyle = accentColor;
    ctx.lineWidth = 8;
    ctx.stroke();

    ctx.fillStyle = accentColor;
    ctx.font = 'bold 30px "Fredoka", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(subject.toUpperCase(), 256, 55);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 44px "Fredoka", sans-serif';
    ctx.fillText(title, 256, 110);

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;

    const planeGeo = new THREE.PlaneGeometry(2.8, 0.9);
    const planeMat = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      side: THREE.DoubleSide,
    });
    return new THREE.Mesh(planeGeo, planeMat);
  }

  private setupParticles() {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(this.particleCount * 3);
    const colors = new Float32Array(this.particleCount * 3);

    for (let i = 0; i < this.particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 180;
      positions[i * 3 + 1] = Math.random() * 14 + 0.5;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 180;

      const isGold = Math.random() > 0.5;
      colors[i * 3] = isGold ? 0.98 : 0.95;
      colors[i * 3 + 1] = isGold ? 0.85 : 0.45;
      colors[i * 3 + 2] = isGold ? 0.35 : 0.75;
    }

    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const mat = new THREE.PointsMaterial({
      size: 0.24,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
    });

    this.petalParticles = new THREE.Points(geo, mat);
    this.scene.add(this.petalParticles);

    // Warm Fireflies / Butterflies glowing gently above islands
    const fGeo = new THREE.BufferGeometry();
    const fPos = new Float32Array(this.fireflyCount * 3);
    for (let i = 0; i < this.fireflyCount; i++) {
      const reg = WORLD_REGIONS[i % WORLD_REGIONS.length];
      const ang = Math.random() * Math.PI * 2;
      const r = Math.random() * (reg.radius - 2);
      fPos[i * 3] = reg.center[0] + Math.cos(ang) * r;
      fPos[i * 3 + 1] = 0.6 + Math.random() * 2.5;
      fPos[i * 3 + 2] = reg.center[1] + Math.sin(ang) * r;
    }
    fGeo.setAttribute('position', new THREE.BufferAttribute(fPos, 3));
    const fMat = new THREE.PointsMaterial({
      color: '#fde047',
      size: 0.2,
      transparent: true,
      opacity: 0.85,
    });
    this.fireflyParticles = new THREE.Points(fGeo, fMat);
    this.scene.add(this.fireflyParticles);
  }

  private setupSprintDustPool() {
    const geo = new THREE.SphereGeometry(0.14, 6, 6);
    for (let i = 0; i < 16; i++) {
      const mat = new THREE.MeshBasicMaterial({
        color: '#e0f2fe',
        transparent: true,
        opacity: 0,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.visible = false;
      this.scene.add(mesh);
      this.sprintDustPool.push({
        mesh,
        life: 0,
        vel: new THREE.Vector3(),
      });
    }
  }

  private spawnSprintDust() {
    const slot = this.sprintDustPool.find((d) => d.life <= 0);
    if (!slot) return;
    slot.life = 0.42;
    slot.mesh.visible = true;
    slot.mesh.position.set(
      this.playerPosition.x + (Math.random() - 0.5) * 0.45,
      this.playerPosition.y + 0.15,
      this.playerPosition.z + (Math.random() - 0.5) * 0.45
    );
    slot.mesh.scale.setScalar(1.0);
    slot.vel.set((Math.random() - 0.5) * 1.2, 1.1 + Math.random() * 0.8, (Math.random() - 0.5) * 1.2);
  }

  private createPlayerNameTagMesh(label: string, strokeColor = '#38bdf8'): THREE.Mesh {
    const tagCanvas = document.createElement('canvas');
    tagCanvas.width = 384;
    tagCanvas.height = 96;
    const ctx = tagCanvas.getContext('2d')!;

    ctx.fillStyle = 'rgba(15, 23, 42, 0.88)';
    ctx.beginPath();
    ctx.roundRect(16, 12, 352, 72, 36);
    ctx.fill();

    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = 4;
    ctx.stroke();

    ctx.fillStyle = '#fdf4ff';
    ctx.font = 'bold 28px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(label, 192, 48);

    const tagTex = new THREE.CanvasTexture(tagCanvas);
    tagTex.colorSpace = THREE.SRGBColorSpace;
    const tagMat = new THREE.MeshBasicMaterial({
      map: tagTex,
      transparent: true,
      depthWrite: false,
    });
    return new THREE.Mesh(new THREE.PlaneGeometry(1.85, 0.46), tagMat);
  }

  private setupPlayerVisualIndicators() {
    const ringGeo = new THREE.RingGeometry(0.35, 0.45, 32);
    const ringMat = new THREE.MeshBasicMaterial({
      color: '#38bdf8',
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.75,
    });
    this.playerGroundRing = new THREE.Mesh(ringGeo, ringMat);
    this.playerGroundRing.rotation.x = -Math.PI / 2;
    this.playerGroundRing.position.y = 0.03;
    this.playerModel.group.add(this.playerGroundRing);

    this.playerNameTag = this.createPlayerNameTagMesh('★ Kamu ★');
    this.playerNameTag.position.y = 2.25;
    this.playerModel.group.add(this.playerNameTag);
  }

  public updateLocalization(lang: AppLanguage, playerName: string) {
    const t = TRANSLATIONS[lang];
    // Update local player nameplate
    if (this.playerNameTag) {
      const nextMesh = this.createPlayerNameTagMesh(`★ ${playerName} (${t.common.you}) ★`, '#38bdf8');
      const oldMat = this.playerNameTag.material as THREE.MeshBasicMaterial;
      const newMat = nextMesh.material as THREE.MeshBasicMaterial;
      if (oldMat.map) oldMat.map.dispose();
      oldMat.map = newMat.map;
      oldMat.needsUpdate = true;
      nextMesh.geometry.dispose();
    }

    // Update Gate billboards
    this.gates.forEach((g) => {
      const loc = LOCALIZED_GAMES[lang][g.game.id];
      if (!loc) return;
      const nextMesh = this.createGateBillboard(loc.title, loc.subject, g.game.color);
      const oldMat = g.billboard.material as THREE.MeshBasicMaterial;
      const newMat = nextMesh.material as THREE.MeshBasicMaterial;
      if (oldMat.map) oldMat.map.dispose();
      oldMat.map = newMat.map;
      oldMat.needsUpdate = true;
      nextMesh.geometry.dispose();
    });

    // Update WorldNPC titles
    this.worldNpcs.forEach((npc) => {
      const loc = LOCALIZED_NPCS[lang][npc.entity.id];
      if (loc) {
        npc.updateLocalizedBillboard(loc.title);
      }
    });
  }

  /**
   * Synchronize remote multiplayer players (up to 6 total players in room)
   */
  public syncRemotePlayers(remotePlayers: RemotePlayerState[], delta: number) {
    const activeIds = new Set(remotePlayers.map((p) => p.id));

    // Remove disconnected players
    this.remotePlayersMap.forEach((vis, id) => {
      if (!activeIds.has(id)) {
        this.scene.remove(vis.model.group);
        this.remotePlayersMap.delete(id);
      }
    });

    // Add / Update active players
    remotePlayers.forEach((rp) => {
      const charSig = JSON.stringify(rp.character);
      let vis = this.remotePlayersMap.get(rp.id);

      if (!vis) {
        const model = new AnimeCharacterModel(rp.character);
        model.group.position.set(rp.position[0], rp.position[1], rp.position[2]);
        model.group.rotation.y = rp.rotationY;

        const ring = new THREE.Mesh(
          new THREE.RingGeometry(0.35, 0.45, 24),
          new THREE.MeshBasicMaterial({ color: '#f59e0b', side: THREE.DoubleSide, transparent: true, opacity: 0.75 })
        );
        ring.rotation.x = -Math.PI / 2;
        ring.position.y = 0.03;
        model.group.add(ring);

        const nameTag = this.createPlayerNameTagMesh(rp.playerName, '#f59e0b');
        nameTag.position.y = 2.25;
        model.group.add(nameTag);

        this.scene.add(model.group);

        vis = {
          model,
          nameTag,
          ring,
          targetPos: new THREE.Vector3(rp.position[0], rp.position[1], rp.position[2]),
          targetRotY: rp.rotationY,
          isMoving: rp.isMoving,
          isSprinting: rp.isSprinting,
          isJumping: rp.isJumping,
          lastCharSig: charSig,
          lastName: rp.playerName,
          activeEmote: rp.activeEmote,
        };
        this.remotePlayersMap.set(rp.id, vis);
      } else {
        vis.targetPos.set(rp.position[0], rp.position[1], rp.position[2]);
        vis.targetRotY = rp.rotationY;
        vis.isMoving = rp.isMoving;
        vis.isSprinting = rp.isSprinting;
        vis.isJumping = rp.isJumping;

        if (vis.lastCharSig !== charSig) {
          vis.model.applyCustomization(rp.character);
          vis.lastCharSig = charSig;
        }
        if (vis.lastName !== rp.playerName) {
          const nextTag = this.createPlayerNameTagMesh(rp.playerName, '#f59e0b');
          const oldMat = vis.nameTag.material as THREE.MeshBasicMaterial;
          const newMat = nextTag.material as THREE.MeshBasicMaterial;
          if (oldMat.map) oldMat.map.dispose();
          oldMat.map = newMat.map;
          oldMat.needsUpdate = true;
          nextTag.geometry.dispose();
          vis.lastName = rp.playerName;
        }
        if (vis.activeEmote !== rp.activeEmote) {
          vis.model.setEmote(rp.activeEmote);
          vis.activeEmote = rp.activeEmote;
        }
      }

      // Smooth interpolation & limb animation
      vis.model.group.position.lerp(vis.targetPos, Math.min(delta * 14, 1));
      let diff = vis.targetRotY - vis.model.group.rotation.y;
      while (diff < -Math.PI) diff += Math.PI * 2;
      while (diff > Math.PI) diff -= Math.PI * 2;
      vis.model.group.rotation.y += diff * Math.min(delta * 14, 1);

      vis.model.update(delta, vis.isMoving, vis.isJumping, false, vis.isSprinting);
      vis.nameTag.quaternion.copy(this.camera.quaternion);
    });
  }

  public enterDialogue(npcPos: THREE.Vector3) {
    this.isInDialogueMode = true;
    this.dialogueTargetPos = npcPos.clone();
  }

  public exitDialogue() {
    this.isInDialogueMode = false;
    this.dialogueTargetPos = null;
  }

  public teleportPlayerTo(x: number, z: number) {
    this.playerPosition.set(x, 0.2, z);
    this.playerVelocityY = 0;
    this.isGrounded = true;
    soundManager.playMenuTransition();
  }

  public resetWorldState() {
    this.playerPosition.set(0, 0, 4);
    this.playerRotation = 0;
    this.playerVelocityY = 0;
    this.isGrounded = true;
    this.collectibleItems.forEach((item) => {
      item.collected = false;
      item.mesh.visible = true;
    });
  }

  private resolvePlayerCollisions() {
    const playerRadius = 0.44;

    // 1. Static Circle Colliders (fountain, windmill, trees, pillars, shrines, rocks)
    for (let i = 0; i < this.circleColliders.length; i++) {
      const col = this.circleColliders[i];
      const dx = this.playerPosition.x - col.x;
      const dz = this.playerPosition.z - col.z;
      const dist = Math.hypot(dx, dz);
      const minDist = playerRadius + col.radius;
      if (dist < minDist) {
        if (dist > 0.0001) {
          const push = (minDist - dist) / dist;
          this.playerPosition.x += dx * push;
          this.playerPosition.z += dz * push;
        } else {
          this.playerPosition.z += minDist;
        }
      }
    }

    // 2. Dynamic World NPCs, Guardians & Mascot (solid character bodies)
    const pushOutFromActor = (ax: number, az: number, actorRadius: number) => {
      const dx = this.playerPosition.x - ax;
      const dz = this.playerPosition.z - az;
      const dist = Math.hypot(dx, dz);
      const minDist = playerRadius + actorRadius;
      if (dist < minDist && dist > 0.0001) {
        const push = (minDist - dist) / dist;
        this.playerPosition.x += dx * push;
        this.playerPosition.z += dz * push;
      }
    };

    pushOutFromActor(this.mascot.group.position.x, this.mascot.group.position.z, 0.55);
    for (let i = 0; i < this.worldNpcs.length; i++) {
      const p = this.worldNpcs[i].group.position;
      pushOutFromActor(p.x, p.z, 0.5);
    }
    for (let i = 0; i < this.guardians.length; i++) {
      const p = this.guardians[i].group.position;
      pushOutFromActor(p.x, p.z, 0.55);
    }
  }

  public update(delta: number, cameraMode: CameraPerspective = 'tpp') {
    const time = performance.now() * 0.001;

    // 0. Mouse Drag Camera Look & Wheel Zoom
    const { dx, dy } = inputManager.consumePointerDelta();
    const zoom = inputManager.consumeZoomDelta();

    if (!this.isInDialogueMode) {
      if (Math.abs(dx) > 0.001 || Math.abs(dy) > 0.001) {
        this.cameraYaw -= dx * 0.0045;
        this.cameraPitch = THREE.MathUtils.clamp(this.cameraPitch + dy * 0.0035, 0.05, 1.25);
      }
      if (Math.abs(zoom) > 0.001) {
        this.cameraDistance = THREE.MathUtils.clamp(this.cameraDistance + zoom * 0.6, 3.2, 14.0);
      }
    }

    if (this.playerGroundRing) {
      const scale = 1.0 + Math.sin(Date.now() * 0.005) * 0.06;
      this.playerGroundRing.scale.set(scale, scale, 1);
    }

    // 1. Player Movement Logic + Shift Sprint
    const move = inputManager.getMovementVector();
    const isSprinting = move.isMoving && inputManager.isSprinting() && !this.isInDialogueMode;
    this.isCurrentlySprinting = isSprinting;
    const moveSpeed = isSprinting ? 11.4 : 6.8;

    // Smooth camera FOV boost on Sprint
    const targetFov = isSprinting && cameraMode === 'tpp' ? 63 : 55;
    if (Math.abs(this.currentFov - targetFov) > 0.05) {
      this.currentFov += (targetFov - this.currentFov) * Math.min(delta * 8, 1);
      this.camera.fov = this.currentFov;
      this.camera.updateProjectionMatrix();
    }

    if (move.isMoving && !this.isInDialogueMode) {
      const forward = new THREE.Vector3(-Math.sin(this.cameraYaw), 0, -Math.cos(this.cameraYaw));
      const right = new THREE.Vector3(Math.cos(this.cameraYaw), 0, -Math.sin(this.cameraYaw));

      const moveDir = new THREE.Vector3()
        .addScaledVector(right, move.x)
        .addScaledVector(forward, move.z)
        .normalize();

      this.playerPosition.addScaledVector(moveDir, moveSpeed * delta);
      this.resolvePlayerCollisions();

      const targetAngle = Math.atan2(moveDir.x, moveDir.z);
      let diff = targetAngle - this.playerRotation;
      while (diff < -Math.PI) diff += Math.PI * 2;
      while (diff > Math.PI) diff -= Math.PI * 2;
      this.playerRotation += diff * Math.min(delta * 14, 1.0);

      // Spawn dust trail when sprinting on ground
      if (isSprinting && this.isGrounded) {
        this.sprintDustTimer -= delta;
        if (this.sprintDustTimer <= 0) {
          this.sprintDustTimer = 0.06;
          this.spawnSprintDust();
        }
      }
    } else {
      this.resolvePlayerCollisions();
    }

    // Update Sprint Dust Particles
    this.sprintDustPool.forEach((d) => {
      if (d.life <= 0) return;
      d.life -= delta;
      if (d.life <= 0) {
        d.mesh.visible = false;
        return;
      }
      d.mesh.position.addScaledVector(d.vel, delta);
      const ratio = d.life / 0.42;
      d.mesh.scale.setScalar(0.5 + (1 - ratio) * 1.4);
      (d.mesh.material as THREE.MeshBasicMaterial).opacity = ratio * 0.65;
    });

    // 2. Jump Pads (Wind Updrafts)
    this.jumpPads.forEach((pad) => {
      const d = this.playerPosition.distanceTo(pad.position);
      if (d < 1.6 && this.isGrounded) {
        this.playerVelocityY = 16.0;
        this.isGrounded = false;
        soundManager.playJumpPad();
      }
    });

    // 3. Real Walkable Ground Check & Sky Abyss Falling Physics
    if (inputManager.isJumping() && this.isGrounded && !this.isInDialogueMode) {
      this.playerVelocityY = 7.8;
      this.isGrounded = false;
    }

    const floorY = this.getWalkableFloorHeight(this.playerPosition.x, this.playerPosition.z);

    if (floorY === null) {
      // Stepped off the island/bridge edge! Fall down into the abyss
      this.isGrounded = false;
      this.playerVelocityY -= 18.0 * delta;
      this.playerPosition.y += this.playerVelocityY * delta;

      if (this.playerPosition.y < -15.0) {
        // Respawn safely at Central Sanctuary
        this.playerPosition.set(0, 1.5, 4);
        this.playerVelocityY = 0;
        this.isGrounded = false;
        soundManager.playError();
        this.onFallRespawnCallback?.();
      }
    } else if (!this.isGrounded || this.playerPosition.y > floorY + 0.05) {
      this.playerVelocityY -= 18.0 * delta;
      this.playerPosition.y += this.playerVelocityY * delta;
      if (this.playerPosition.y <= floorY && this.playerVelocityY <= 0 && this.playerPosition.y >= floorY - 2.2) {
        this.playerPosition.y = floorY;
        this.playerVelocityY = 0;
        this.isGrounded = true;
      } else if (this.playerPosition.y < floorY - 2.2) {
        // Fell below the island rim
        this.isGrounded = false;
        if (this.playerPosition.y < -15.0) {
          this.playerPosition.set(0, 1.5, 4);
          this.playerVelocityY = 0;
          soundManager.playError();
          this.onFallRespawnCallback?.();
        }
      }
    } else {
      // Follow subtle bridge catenary height smoothly
      this.playerPosition.y = floorY;
    }

    this.playerModel.group.position.copy(this.playerPosition);
    this.playerModel.group.rotation.y = this.playerRotation;
    this.playerModel.update(delta, move.isMoving, !this.isGrounded, false, isSprinting);

    if (this.playerNameTag) {
      this.playerNameTag.quaternion.copy(this.camera.quaternion);
    }

    // 4. Camera Handling
    if (this.isInDialogueMode && this.dialogueTargetPos) {
      const dirToNpc = new THREE.Vector3().subVectors(this.dialogueTargetPos, this.playerPosition).normalize();
      const side = new THREE.Vector3(-dirToNpc.z, 0, dirToNpc.x).normalize();

      const desiredCam = new THREE.Vector3()
        .copy(this.playerPosition)
        .addScaledVector(side, 1.4)
        .addScaledVector(dirToNpc, -1.8);
      desiredCam.y = 1.6;

      const targetLook = new THREE.Vector3().copy(this.dialogueTargetPos);
      targetLook.y = 1.5;

      this.camera.position.lerp(desiredCam, 0.08);
      this.camera.lookAt(targetLook);
    } else if (cameraMode === 'fpp') {
      this.playerModel.setFppMode(true);
      if (this.playerNameTag) this.playerNameTag.visible = false;
      if (this.playerGroundRing) this.playerGroundRing.visible = false;

      if (move.isMoving) {
        this.cameraBobTime += delta * (isSprinting ? 18 : 12);
      }
      const bob = Math.sin(this.cameraBobTime) * 0.04;
      this.camera.position.set(this.playerPosition.x, this.playerPosition.y + 1.55 + bob, this.playerPosition.z);

      const lookDir = new THREE.Vector3(
        -Math.sin(this.cameraYaw) * Math.cos(this.cameraPitch),
        -Math.sin(this.cameraPitch),
        -Math.cos(this.cameraYaw) * Math.cos(this.cameraPitch)
      );
      this.camera.lookAt(new THREE.Vector3().copy(this.camera.position).add(lookDir));
    } else {
      this.playerModel.setFppMode(false);
      if (this.playerNameTag) this.playerNameTag.visible = true;
      if (this.playerGroundRing) this.playerGroundRing.visible = true;

      const offsetX = Math.sin(this.cameraYaw) * Math.cos(this.cameraPitch) * this.cameraDistance;
      const offsetY = Math.sin(this.cameraPitch) * this.cameraDistance;
      const offsetZ = Math.cos(this.cameraYaw) * Math.cos(this.cameraPitch) * this.cameraDistance;

      const desiredCameraPos = new THREE.Vector3(
        this.playerPosition.x + offsetX,
        this.playerPosition.y + 1.35 + offsetY,
        this.playerPosition.z + offsetZ
      );

      const cameraTarget = new THREE.Vector3(
        this.playerPosition.x,
        this.playerPosition.y + 1.35,
        this.playerPosition.z
      );

      this.camera.position.lerp(desiredCameraPos, 0.12);
      this.camera.lookAt(cameraTarget);
    }

    // 5. Mascot update
    this.mascot.update(delta);
    const distToMascot = this.playerPosition.distanceTo(this.mascot.group.position);
    this.isNearMascot = distToMascot < 3.4;
    if (this.isNearMascot) {
      this.mascot.group.lookAt(new THREE.Vector3(this.playerPosition.x, 0, this.playerPosition.z));
    }

    // 6. World NPCs Roaming & Socializing
    let closestWorldNpc: NpcEntity | null = null;
    let minNpcDist = Infinity;

    for (let i = 0; i < this.worldNpcs.length; i++) {
      const npc = this.worldNpcs[i];
      const d = this.playerPosition.distanceTo(npc.group.position);
      const isNearPlayer = d < 3.8;
      npc.setPlayerNear(isNearPlayer);

      // Check nearby NPC to socialize with!
      let socialPartner: THREE.Vector3 | null = null;
      if (!isNearPlayer) {
        for (let j = 0; j < this.worldNpcs.length; j++) {
          if (i === j) continue;
          const other = this.worldNpcs[j];
          const nd = npc.group.position.distanceTo(other.group.position);
          if (nd < 3.4) {
            socialPartner = other.group.position;
            break;
          }
        }
      }
      npc.setSocialInteraction(socialPartner);
      npc.update(delta, this.playerPosition, this.camera.quaternion);

      if (isNearPlayer && d < minNpcDist) {
        minNpcDist = d;
        closestWorldNpc = npc.entity;
      }
    }
    this.nearestWorldNpc = closestWorldNpc;

    // 7. Gate & Guardian Proximity Check
    let closestGate: GateTrigger | null = null;
    let closestGuardian: GameInfo | null = null;
    let minDistance = Infinity;

    this.gates.forEach((g) => {
      const d = this.playerPosition.distanceTo(g.position);
      if (d < 4.2 && d < minDistance) {
        minDistance = d;
        closestGate = { game: g.game, position: g.position, distance: d };
      }
    });

    this.guardians.forEach((guard) => {
      const d = this.playerPosition.distanceTo(guard.group.position);
      const isNear = d < 3.8;
      guard.setPlayerNear(isNear);
      guard.update(delta, this.playerPosition);

      if (isNear) {
        const game = GAME_CATALOG.find((gm) => gm.guardian.name === guard.guardian.name);
        if (game) closestGuardian = game;
      }
    });

    this.nearestGate = closestGate;
    this.nearestGuardian = closestGuardian;

    // 8. Current Open World Region
    let bestRegion = WORLD_REGIONS[0];
    let bestDist = Infinity;
    WORLD_REGIONS.forEach((r) => {
      const d = Math.hypot(this.playerPosition.x - r.center[0], this.playerPosition.z - r.center[1]);
      if (d < bestDist) {
        bestDist = d;
        bestRegion = r;
      }
    });
    this.currentRegion = bestRegion;

    // 9. Animate Environment Details (Windmill, Crystal, Fountain Ripples, Clouds, Birds, Animals, Fireflies)
    if (this.windmillBlades) {
      this.windmillBlades.rotation.z += delta * 0.9;
    }
    if (this.fountainCrystal) {
      this.fountainCrystal.rotation.y += delta * 1.1;
      this.fountainCrystal.position.y = 2.0 + Math.sin(time * 2.2) * 0.14;
    }
    if (this.fountainRipple) {
      const rippleCycle = (time * 0.65) % 1;
      const sc = 0.6 + rippleCycle * 3.4;
      this.fountainRipple.scale.set(sc, sc, 1);
      (this.fountainRipple.material as THREE.MeshBasicMaterial).opacity = (1 - rippleCycle) * 0.65;
    }
    this.shrineOrbs.forEach((orb, idx) => {
      orb.rotation.y += delta * 1.4;
      orb.position.y = 2.35 + Math.sin(time * 2 + idx) * 0.12;
    });

    this.skyClouds.forEach((c) => {
      c.angle += c.speed * delta;
      c.group.position.set(Math.cos(c.angle) * c.dist, c.y, Math.sin(c.angle) * c.dist);
      c.group.lookAt(0, c.y, 0);
    });

    this.skyBirds.forEach((b) => {
      b.phase += b.speed * delta;
      const nx = b.center.x + Math.cos(b.phase) * b.radius;
      const nz = b.center.z + Math.sin(b.phase) * b.radius;
      const ny = b.altitude + Math.sin(b.phase * 2.5) * 1.1;
      b.group.position.set(nx, ny, nz);
      b.group.rotation.y = -b.phase;
      const flap = Math.sin(time * 8 + b.phase * 5) * 0.55;
      b.leftWing.rotation.z = flap;
      b.rightWing.rotation.z = -flap;
    });

    this.islandAnimals.forEach((an) => {
      if (an.pauseTimer > 0) {
        an.pauseTimer -= delta;
        if (an.pauseTimer <= 0) {
          const ang = Math.random() * Math.PI * 2;
          const rad = 1.0 + Math.random() * 3.5;
          an.wanderTarget.set(
            an.homeCenter.x + Math.cos(ang) * rad,
            0,
            an.homeCenter.z + Math.sin(ang) * rad
          );
        }
      } else {
        const toT = new THREE.Vector3().subVectors(an.wanderTarget, an.group.position);
        toT.y = 0;
        const d = toT.length();
        if (d < 0.25) {
          an.pauseTimer = 1.5 + Math.random() * 2.5;
          an.group.position.y = 0;
        } else {
          toT.normalize();
          an.group.position.addScaledVector(toT, 1.8 * delta);
          an.phase += delta * 9;
          an.group.position.y = Math.abs(Math.sin(an.phase)) * 0.28;
          an.group.rotation.y = Math.atan2(toT.x, toT.z);
        }
      }
    });

    // Ambient Petals & Fireflies
    const pos = this.petalParticles.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < this.particleCount; i++) {
      pos[i * 3 + 1] -= delta * 0.7;
      pos[i * 3] += Math.sin(pos[i * 3 + 1] * 2 + i) * delta * 0.4;
      if (pos[i * 3 + 1] < 0) {
        pos[i * 3 + 1] = 14.0;
        pos[i * 3] = (Math.random() - 0.5) * 180;
        pos[i * 3 + 2] = (Math.random() - 0.5) * 180;
      }
    }
    this.petalParticles.geometry.attributes.position.needsUpdate = true;

    const fPos = this.fireflyParticles.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < this.fireflyCount; i++) {
      fPos[i * 3 + 1] += Math.sin(time * 2.5 + i) * delta * 0.35;
      fPos[i * 3] += Math.cos(time * 1.8 + i * 0.7) * delta * 0.25;
    }
    this.fireflyParticles.geometry.attributes.position.needsUpdate = true;

    // 10. Quest Collectibles
    this.collectibleItems.forEach((item) => {
      if (item.collected) return;
      item.mesh.rotation.y += delta * 2.2;
      item.mesh.position.y = item.position.y + Math.sin(Date.now() * 0.003 + item.position.x) * 0.15;

      const d = this.playerPosition.distanceTo(item.mesh.position);
      if (d < 1.8) {
        item.collected = true;
        item.mesh.visible = false;
        soundManager.playPickup();
        this.onCollectItemCallback?.(item.type);
      }
    });

    // 11. Dynamic Atmospheric Visual Shifting
    const targetColors: Record<string, string> = {
      sanctuary: '#1a092b',
      dungeon: '#0e0419',
      physics: '#290c24',
      math: '#250831',
      design: '#1c0836',
      ui: '#06132b',
      ux: '#271206',
      chemistry: '#031f1d',
      code: '#09152b',
      biology: '#062410',
    };
    const targetHex = targetColors[this.currentRegion.id] || '#1a092b';
    const targetColor = new THREE.Color(targetHex);
    (this.scene.background as THREE.Color).lerp(targetColor, 0.04);
    (this.scene.fog as THREE.FogExp2).color.lerp(targetColor, 0.04);
  }
}
