/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as THREE from 'three';
import { soundManager } from '../../audio/SoundSynthesizer';
import { inputManager } from '../../core/InputManager';
import { CameraPerspective, DungeonLevelData } from '../../types';

export type { DungeonLevelData };

export const DUNGEON_LEVELS: DungeonLevelData[] = [
  {
    levelNumber: 1,
    title: 'Kuil Takhta Komandan Ksatria Merah',
    rank: 'A-Rank',
    bossName: 'Knight Commander, Igris the Red',
    bossTitle: 'Komandan Ksatria Berjubah Darah',
    bossHp: 650,
    bossAttack: 18,
    bossColor: '#dc2626',
    minionHp: 80,
    description: 'Pertarungan hidup mati melawan Komandan Ksatria Igris the Red di dalam kuil katedral bayangan.',
  },
  {
    levelNumber: 2,
    title: 'Rawa Kasaka Taring Biru',
    rank: 'E-Rank',
    bossName: 'Kasaka Taring Biru Raksasa',
    bossTitle: 'Ular Rawa Racun Sisik Baja',
    bossHp: 420,
    bossAttack: 14,
    bossColor: '#06b6d4',
    minionHp: 70,
    description: 'Ular raksasa dengan racun kelumpuhan. Habisi 3 anak ular untuk mengisi energi Ultimate!',
  },
  {
    levelNumber: 3,
    title: 'Gua Tambang Golem Berduri',
    rank: 'D-Rank',
    bossName: 'Raja Golem Batu Berduri',
    bossTitle: 'Raksasa Batu Magma Keras',
    bossHp: 500,
    bossAttack: 16,
    bossColor: '#f97316',
    minionHp: 80,
    description: 'Golem keras berlapis kristal magma. Gunakan sihir ungu untuk menembus pertahanan batunya.',
  },
  {
    levelNumber: 4,
    title: 'Gerbang Bawah Tanah E-Rank',
    rank: 'E-Rank',
    bossName: 'Cerberus Bayangan',
    bossTitle: 'Penjaga Neraka Bertaring Tiga',
    bossHp: 380,
    bossAttack: 12,
    bossColor: '#ef4444',
    minionHp: 65,
    description: 'Gerbang E-Rank tempat Hunter mengasah tebasan pedang dan sihir dasar.',
  },
  {
    levelNumber: 5,
    title: 'Sarang Ratu Laba-laba',
    rank: 'C-Rank',
    bossName: 'Ratu Laba-laba Djehut',
    bossTitle: 'Penguasa Jaring Racun Hitam',
    bossHp: 600,
    bossAttack: 20,
    bossColor: '#a855f7',
    minionHp: 100,
    description: 'Gunakan dash lincah untuk menghindari semburan jaring asam beracun.',
  },
  {
    levelNumber: 6,
    title: 'Lembah Serigala Taring Perak',
    rank: 'C-Rank',
    bossName: 'Raja Serigala Perak Lycan',
    bossTitle: 'Pemimpin Kawanan Taring Dingin',
    bossHp: 680,
    bossAttack: 22,
    bossColor: '#cbd5e1',
    minionHp: 110,
    description: 'Kawanan serigala bayangan yang bergerak cepat mengitari arena.',
  },
  {
    levelNumber: 7,
    title: 'Puncak Es Glasius',
    rank: 'B-Rank',
    bossName: 'Raksasa Es Frost Monarch',
    bossTitle: 'Panglima Badai Salju Beku',
    bossHp: 760,
    bossAttack: 24,
    bossColor: '#38bdf8',
    minionHp: 120,
    description: 'Lantai es licin dengan hantaman palu es pembeku darah.',
  },
  {
    levelNumber: 8,
    title: 'Kawah Naga Merah Vulkanik',
    rank: 'B-Rank',
    bossName: 'Wyvern Bayangan Ignis',
    bossTitle: 'Raja Langit Api Neraka',
    bossHp: 840,
    bossAttack: 26,
    bossColor: '#ea580c',
    minionHp: 130,
    description: 'Semburan nafas api magma yang menghanguskan seluruh sudut pilar arena.',
  },
  {
    levelNumber: 9,
    title: 'Kripta Kematian Arch-Lich',
    rank: 'A-Rank',
    bossName: 'Arch-Lich Malakor',
    bossTitle: 'Penyihir Kematian Tulang Abadi',
    bossHp: 920,
    bossAttack: 28,
    bossColor: '#8b5cf6',
    minionHp: 140,
    description: 'Lich kuno yang membangkitkan arwah tengkorak bayangan tanpa henti.',
  },
  {
    levelNumber: 10,
    title: 'Takhta Ksatria Hitam Elit',
    rank: 'A-Rank',
    bossName: 'Jenderal Igris Bertaring Petir',
    bossTitle: 'Panglima Perang Sayap Kiri',
    bossHp: 1020,
    bossAttack: 30,
    bossColor: '#6366f1',
    minionHp: 150,
    description: 'Bentuk evolusi Igris dengan pedang besar berbalut petir ungu berkilap.',
  },
  {
    levelNumber: 11,
    title: 'Pulau Semut Mutan Beru',
    rank: 'S-Rank',
    bossName: 'Beru Raja Semut Bayangan',
    bossTitle: 'Predator Terkuat Koloni Monster',
    bossHp: 1140,
    bossAttack: 34,
    bossColor: '#475569',
    minionHp: 160,
    description: 'Kecepatan supersonik dan cakar pembelah baja! Hindari terjangan mematikannya.',
  },
  {
    levelNumber: 12,
    title: 'Balairung Tertinggi Bellion',
    rank: 'S-Rank',
    bossName: 'Bellion Panglima Tertinggi',
    bossTitle: 'Pemegang Pedang Lipat Rantai Bayangan',
    bossHp: 1260,
    bossAttack: 36,
    bossColor: '#7c3aed',
    minionHp: 170,
    description: 'Panglima perang terkuat dengan pedang rantai bersayap hitam.',
  },
  {
    levelNumber: 13,
    title: 'Gurun Pasir Monarki Monster',
    rank: 'S-Rank',
    bossName: 'Kaisar Taring Buas Rakan',
    bossTitle: 'Raja Binatang Pemangsa Jiwa',
    bossHp: 1380,
    bossAttack: 38,
    bossColor: '#b45309',
    minionHp: 180,
    description: 'Auman sonik yang memecahkan bebatuan obsidian di sekitar arena.',
  },
  {
    levelNumber: 14,
    title: 'Lembah Es Absolut Sillad',
    rank: 'S-Rank',
    bossName: 'Monarki Salju Sillad',
    bossTitle: 'Pewaris Titik Nol Mutlak',
    bossHp: 1500,
    bossAttack: 40,
    bossColor: '#0284c7',
    minionHp: 190,
    description: 'Serangan tombak es meluncur dari langit secara bertubi-tubi.',
  },
  {
    levelNumber: 15,
    title: 'Dimensi Api Raja Raksasa Yogumunt',
    rank: 'S-Rank',
    bossName: 'Kaisar Pembakaran Transfigurasi',
    bossTitle: 'Tungku Api Kehancuran Jiwa',
    bossHp: 1640,
    bossAttack: 42,
    bossColor: '#b91c1c',
    minionHp: 200,
    description: 'Gelombang panas konstan yang mengharuskan penggunaan dash tepat waktu.',
  },
  {
    levelNumber: 16,
    title: 'Makam Naga Legendaris Kamish',
    rank: 'S-Rank',
    bossName: 'Naga Purba Kamish Bayangan',
    bossTitle: 'Bencana Terbesar Umat Manusia',
    bossHp: 1800,
    bossAttack: 45,
    bossColor: '#f59e0b',
    minionHp: 215,
    description: 'Naga raksasa legendaris yang bangkit dalam balutan api hitam pekat.',
  },
  {
    levelNumber: 17,
    title: 'Pintu Gerbang Dimensi Penguasa',
    rank: 'S-Rank',
    bossName: 'Malaikat Penghakiman Cahaya',
    bossTitle: 'Utusan Penguasa Takhta Terang',
    bossHp: 1960,
    bossAttack: 48,
    bossColor: '#fef08a',
    minionHp: 230,
    description: 'Pertarungan antara bayangan monarki melawan tentara cahaya langit.',
  },
  {
    levelNumber: 18,
    title: 'Ruang Hampa Monarki Kehancuran',
    rank: 'S-Rank',
    bossName: 'Antares Kaisar Naga Kehancuran',
    bossTitle: 'Monarki Kehancuran Tertinggi',
    bossHp: 2150,
    bossAttack: 52,
    bossColor: '#991b1b',
    minionHp: 245,
    description: 'Puncak kobaran api naga kosmik yang menuntut penguasaan Ultimate sempurna.',
  },
  {
    levelNumber: 19,
    title: 'Tahta Gelap Reinkarnasi',
    rank: 'S-Rank',
    bossName: 'Kloning Bayangan Monarki',
    bossTitle: 'Bayangan Cermin Penguasa Kematian',
    bossHp: 2350,
    bossAttack: 55,
    bossColor: '#3b0764',
    minionHp: 260,
    description: 'Menghadapi duplikat dirimu sendiri dengan gaya serangan pedang dan sihir serupa.',
  },
  {
    levelNumber: 20,
    title: 'Takhta Kaisar Bayangan Kuno Ashborn',
    rank: 'Monarch',
    bossName: 'Ashborn Dewa Monarki Bayangan',
    bossTitle: 'Asal Mula Kekuatan Kematian & Arise',
    bossHp: 2650,
    bossAttack: 60,
    bossColor: '#581c87',
    minionHp: 280,
    description: 'Ujian terakhir sang Shadow Sovereign! Kalahkan Sang Pencipta Takhta Bayangan!',
  },
];

export interface CombatEntity {
  mesh: THREE.Group;
  name: string;
  isBoss: boolean;
  hp: number;
  maxHp: number;
  attackPower: number;
  isDead: boolean;
  attackCooldown: number;
  hitFlashTime: number;
  plumeMesh?: THREE.Group;
  swordMesh?: THREE.Mesh;
}

export class SoloDungeonGame {
  public scene: THREE.Scene;
  public camera: THREE.PerspectiveCamera;

  // Level State (20 Levels)
  public currentLevelIdx = 0;
  public currentLevelData = DUNGEON_LEVELS[0];

  // Player Stats & Solo Leveling Mechanics
  public playerHp = 1500;
  public playerMaxHp = 3920;
  public playerMp = 870;
  public playerMaxMp = 2004;
  public minionsKilled = 0;
  public targetMinionsForUltimate = 3;
  public isUltimateReady = false;
  public isLevelFinished = false;
  public isGameOver = false;

  // Combo & Timer (Matches Screenshot: 96 HITS & 01:32.111)
  public comboCount = 0;
  private comboTimer = 0;
  public elapsedTime = 0;

  // Player Movement & Anime Character Mesh
  public playerPos = new THREE.Vector3(0, 0, 6);
  public playerRotY = 0;
  public playerModelGroup: THREE.Group;
  private playerCoatTailLeft!: THREE.Mesh;
  private playerCoatTailRight!: THREE.Mesh;
  private playerDaggerRight!: THREE.Group;
  private playerDaggerLeft!: THREE.Group;
  private playerEyesMesh!: THREE.Mesh;
  private playerAuraRing!: THREE.Mesh;
  private playerElectricArcs: THREE.LineSegments[] = [];

  // Free Camera Orbit State (TPP)
  public cameraYaw = 0;
  public cameraPitch = 0.38; // ~22 degrees downward
  public cameraDistance = 8.5;

  // Slash Arc FX
  private swordSlashArcs: THREE.Mesh[] = [];
  private slashTimer = 0;

  // Enemies
  public bossEntity!: CombatEntity;
  public minionEntities: CombatEntity[] = [];

  // Magic Projectiles
  private magicProjectiles: Array<{
    mesh: THREE.Mesh;
    velocity: THREE.Vector3;
    life: number;
    color: string;
  }> = [];

  // Arena & Visual Lighting
  private arenaRadius = 24;
  private pillarColliders: Array<{ x: number; z: number; radius: number }> = [];
  private cathedralGroup!: THREE.Group;
  private shockwaveRing!: THREE.Mesh;
  private shockwaveTimer = 0;
  private bossTelegraphRing!: THREE.Mesh;
  private bossTelegraphTimer = 0;
  private bossTelegraphCooldown = 5.5;
  private bossSlamCenter = new THREE.Vector3();

  public get bossHp(): number {
    return this.bossEntity ? Math.max(0, this.bossEntity.hp) : 0;
  }

  public get bossMaxHp(): number {
    return this.bossEntity ? this.bossEntity.maxHp : (this.currentLevelData?.bossHp || 650);
  }

  public retryLevel(): void {
    this.loadLevel(this.currentLevelIdx);
  }

  constructor(initialLevel = 0) {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color('#080614');
    this.scene.fog = new THREE.FogExp2('#080614', 0.022);

    this.camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 150);
    this.camera.position.set(0, 6, 15);
    this.camera.lookAt(new THREE.Vector3(0, 1.4, 0));

    this.playerModelGroup = new THREE.Group();
    this.scene.add(this.playerModelGroup);

    this.setupLighting();
    this.setupCathedralDungeonArena();
    this.setupAnimeHunterPlayer();
    this.setupSlashFx();

    this.loadLevel(initialLevel);
  }

  private setupLighting() {
    // Moonlight key light streaming through cathedral windows
    const moonKey = new THREE.DirectionalLight('#38bdf8', 1.6);
    moonKey.position.set(15, 25, -15);
    moonKey.castShadow = true;
    this.scene.add(moonKey);

    // Warm torch light fill from gothic sconces
    const torchFill = new THREE.DirectionalLight('#f97316', 0.85);
    torchFill.position.set(-15, 12, 15);
    this.scene.add(torchFill);

    // Ambient gothic darkness
    const amb = new THREE.AmbientLight('#1e1035', 0.65);
    this.scene.add(amb);
  }

  private setupCathedralDungeonArena() {
    this.cathedralGroup = new THREE.Group();

    // 1. Grand Polished Indigo/Obsidian Marble Arena Floor
    const floorGeo = new THREE.CylinderGeometry(this.arenaRadius, this.arenaRadius, 1.2, 48);
    const floorCanvas = document.createElement('canvas');
    floorCanvas.width = 512;
    floorCanvas.height = 512;
    const ctx = floorCanvas.getContext('2d')!;

    // Dark marble gradient with runic circles
    const radGrad = ctx.createRadialGradient(256, 256, 10, 256, 256, 256);
    radGrad.addColorStop(0, '#1a1038');
    radGrad.addColorStop(0.5, '#0f0a24');
    radGrad.addColorStop(0.9, '#070512');
    radGrad.addColorStop(1, '#030208');
    ctx.fillStyle = radGrad;
    ctx.fillRect(0, 0, 512, 512);

    // Intricate Runic Summoning Pattern (Matching screenshot floor)
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.35)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(256, 256, 180, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = 'rgba(168, 85, 247, 0.4)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(256, 256, 110, 0, Math.PI * 2);
    ctx.stroke();

    for (let i = 0; i < 8; i++) {
      const ang = (i / 8) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(256 + Math.cos(ang) * 90, 256 + Math.sin(ang) * 90);
      ctx.lineTo(256 + Math.cos(ang) * 200, 256 + Math.sin(ang) * 200);
      ctx.stroke();
    }

    const floorTex = new THREE.CanvasTexture(floorCanvas);
    const floorMat = new THREE.MeshStandardMaterial({
      map: floorTex,
      roughness: 0.35,
      metalness: 0.3,
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.position.y = -0.6;
    floor.receiveShadow = true;
    this.cathedralGroup.add(floor);

    // 2. High Gothic Cathedral Pillars with Flaming Lantern Sconces
    const pillarMat = new THREE.MeshStandardMaterial({
      color: '#161026',
      roughness: 0.8,
      metalness: 0.2,
    });
    const pillarCapMat = new THREE.MeshStandardMaterial({
      color: '#281c44',
      roughness: 0.6,
      metalness: 0.4,
    });

    const numPillars = 10;
    for (let i = 0; i < numPillars; i++) {
      const angle = (i / numPillars) * Math.PI * 2;
      const x = Math.cos(angle) * (this.arenaRadius - 2.0);
      const z = Math.sin(angle) * (this.arenaRadius - 2.0);

      const pillarGroup = new THREE.Group();
      pillarGroup.position.set(x, 0, z);

      // Main Column
      const shaft = new THREE.Mesh(new THREE.BoxGeometry(1.8, 14, 1.8), pillarMat);
      shaft.position.y = 7;
      pillarGroup.add(shaft);

      // Ornate Capital & Base
      const base = new THREE.Mesh(new THREE.BoxGeometry(2.4, 1.2, 2.4), pillarCapMat);
      base.position.y = 0.6;
      const capital = new THREE.Mesh(new THREE.BoxGeometry(2.4, 1.4, 2.4), pillarCapMat);
      capital.position.y = 13.5;
      pillarGroup.add(base, capital);

      // Wall Lantern Sconce
      const lanternMat = new THREE.MeshBasicMaterial({ color: '#f59e0b' });
      const lantern = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.6, 0.4), lanternMat);
      lantern.position.set(0, 6, 1.0);
      pillarGroup.add(lantern);

      const torchLight = new THREE.PointLight('#f97316', 1.8, 12);
      torchLight.position.set(0, 6, 1.2);
      pillarGroup.add(torchLight);

      this.pillarColliders.push({ x, z, radius: 1.45 });
      this.cathedralGroup.add(pillarGroup);
    }

    // 3. Arched Gothic Windows in the Background (Moonlight Glow)
    for (let i = 0; i < 4; i++) {
      const winAng = Math.PI * 0.9 + (i - 1.5) * 0.45;
      const wx = Math.cos(winAng) * (this.arenaRadius + 0.5);
      const wz = Math.sin(winAng) * (this.arenaRadius + 0.5);

      const winGeo = new THREE.PlaneGeometry(3.5, 9.0);
      const winMat = new THREE.MeshBasicMaterial({
        color: '#38bdf8',
        transparent: true,
        opacity: 0.35,
        side: THREE.DoubleSide,
      });
      const winMesh = new THREE.Mesh(winGeo, winMat);
      winMesh.position.set(wx, 8.0, wz);
      winMesh.lookAt(0, 8.0, 0);
      this.cathedralGroup.add(winMesh);
    }

    // 4. Ground Burst Shockwave Ring (Matches Electric Blue Shockwave in screenshot)
    const ringGeo = new THREE.RingGeometry(2.0, 3.4, 32);
    const ringMat = new THREE.MeshBasicMaterial({
      color: '#38bdf8',
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide,
    });
    this.shockwaveRing = new THREE.Mesh(ringGeo, ringMat);
    this.shockwaveRing.rotation.x = -Math.PI / 2;
    this.shockwaveRing.position.y = 0.05;
    this.cathedralGroup.add(this.shockwaveRing);

    // 5. Boss Crimson AoE Telegraph Warning Ring
    const telGeo = new THREE.RingGeometry(0.4, 5.2, 36);
    const telMat = new THREE.MeshBasicMaterial({
      color: '#ef4444',
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide,
    });
    this.bossTelegraphRing = new THREE.Mesh(telGeo, telMat);
    this.bossTelegraphRing.rotation.x = -Math.PI / 2;
    this.bossTelegraphRing.position.y = 0.06;
    this.cathedralGroup.add(this.bossTelegraphRing);

    this.scene.add(this.cathedralGroup);
  }

  private setupAnimeHunterPlayer() {
    // Build Sung Jin-Woo Anime Character 3D Model
    const coatMat = new THREE.MeshToonMaterial({ color: '#0d0d14' });
    const shirtMat = new THREE.MeshToonMaterial({ color: '#e2e8f0' });
    const skinMat = new THREE.MeshToonMaterial({ color: '#ffdfd3' });
    const hairMat = new THREE.MeshToonMaterial({ color: '#09090b' });
    const cyanGlowMat = new THREE.MeshBasicMaterial({ color: '#00f0ff' });

    // Torso (Trenchcoat & Inner Shirt)
    const torso = new THREE.Group();
    torso.position.y = 1.25;

    const chest = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.65, 0.32), coatMat);
    const innerShirt = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.45, 0.34), shirtMat);
    innerShirt.position.set(0, 0.05, 0.01);
    torso.add(chest, innerShirt);

    // Flowing Dual Coat Tails (Billow backwards during runs/slashes)
    const coatTailGeo = new THREE.BoxGeometry(0.24, 0.9, 0.04);
    this.playerCoatTailLeft = new THREE.Mesh(coatTailGeo, coatMat);
    this.playerCoatTailLeft.position.set(-0.16, -0.65, -0.12);
    this.playerCoatTailLeft.rotation.x = 0.2;

    this.playerCoatTailRight = new THREE.Mesh(coatTailGeo, coatMat);
    this.playerCoatTailRight.position.set(0.16, -0.65, -0.12);
    this.playerCoatTailRight.rotation.x = 0.2;
    torso.add(this.playerCoatTailLeft, this.playerCoatTailRight);

    // Anime Head & Hair
    const head = new THREE.Group();
    head.position.y = 0.52;

    const face = new THREE.Mesh(new THREE.SphereGeometry(0.22, 14, 14), skinMat);
    head.add(face);

    // Glowing Anime Eyes (Cyan Hunter glow like screenshot)
    const eyeGeo = new THREE.PlaneGeometry(0.08, 0.035);
    this.playerEyesMesh = new THREE.Mesh(eyeGeo, cyanGlowMat);
    this.playerEyesMesh.position.set(0, 0.02, 0.21);
    head.add(this.playerEyesMesh);

    // Spiky Anime Bangs & Hair Tuft
    const hairBangs = new THREE.Mesh(new THREE.ConeGeometry(0.26, 0.42, 6), hairMat);
    hairBangs.position.set(0, 0.16, 0.06);
    hairBangs.rotation.x = 0.4;
    head.add(hairBangs);

    torso.add(head);

    // Legs
    const legGeo = new THREE.CylinderGeometry(0.1, 0.08, 0.85, 8);
    const pantsMat = new THREE.MeshToonMaterial({ color: '#111827' });
    const legL = new THREE.Mesh(legGeo, pantsMat);
    legL.position.set(-0.18, 0.45, 0);
    const legR = new THREE.Mesh(legGeo, pantsMat);
    legR.position.set(0.18, 0.45, 0);

    // Arms & Dual Daggers (Kasaka's Poison Fang & Knight Killer)
    this.playerDaggerRight = this.createRunicDagger('#00f0ff', '#38bdf8');
    this.playerDaggerRight.position.set(0.42, 1.1, 0.25);
    this.playerDaggerRight.rotation.set(0.5, 0, 0.2);

    this.playerDaggerLeft = this.createRunicDagger('#c084fc', '#a855f7');
    this.playerDaggerLeft.position.set(-0.42, 1.1, 0.25);
    this.playerDaggerLeft.rotation.set(0.5, 0, -0.2);

    // Electric Blue Surging Aura Ring (around player's feet)
    const auraGeo = new THREE.RingGeometry(0.7, 1.3, 24);
    const auraMat = new THREE.MeshBasicMaterial({
      color: '#38bdf8',
      transparent: true,
      opacity: 0.65,
      side: THREE.DoubleSide,
    });
    this.playerAuraRing = new THREE.Mesh(auraGeo, auraMat);
    this.playerAuraRing.rotation.x = -Math.PI / 2;
    this.playerAuraRing.position.y = 0.02;

    this.playerModelGroup.add(torso, legL, legR, this.playerDaggerRight, this.playerDaggerLeft, this.playerAuraRing);
  }

  private createRunicDagger(glowColor: string, bladeColor: string): THREE.Group {
    const group = new THREE.Group();

    // Hilt & Guard
    const hilt = new THREE.Mesh(
      new THREE.CylinderGeometry(0.025, 0.03, 0.2, 8),
      new THREE.MeshStandardMaterial({ color: '#1f2937', metalness: 0.9 })
    );
    const guard = new THREE.Mesh(
      new THREE.BoxGeometry(0.14, 0.03, 0.05),
      new THREE.MeshStandardMaterial({ color: '#374151', metalness: 0.8 })
    );
    guard.position.y = 0.1;
    group.add(hilt, guard);

    // Serrated Runic Glowing Blade
    const bladeGeo = new THREE.BoxGeometry(0.06, 0.85, 0.02);
    const bladeMat = new THREE.MeshStandardMaterial({
      color: bladeColor,
      emissive: glowColor,
      emissiveIntensity: 1.5,
      metalness: 0.5,
      roughness: 0.1,
    });
    const blade = new THREE.Mesh(bladeGeo, bladeMat);
    blade.position.y = 0.52;
    group.add(blade);

    return group;
  }

  private setupSlashFx() {
    // 3 layered anime sword slash arcs for multi-slash combos
    for (let i = 0; i < 3; i++) {
      const arcGeo = new THREE.RingGeometry(1.2 + i * 0.2, 2.0 + i * 0.3, 16, 1, 0, Math.PI * 0.8);
      const arcMat = new THREE.MeshBasicMaterial({
        color: i === 0 ? '#38bdf8' : i === 1 ? '#a855f7' : '#ffffff',
        transparent: true,
        opacity: 0,
        side: THREE.DoubleSide,
      });
      const arc = new THREE.Mesh(arcGeo, arcMat);
      arc.rotation.x = -Math.PI / 2;
      arc.position.y = 1.0;
      this.scene.add(arc);
      this.swordSlashArcs.push(arc);
    }
  }

  public loadLevel(levelIndex: number) {
    this.currentLevelIdx = Math.max(0, Math.min(DUNGEON_LEVELS.length - 1, levelIndex));
    this.currentLevelData = DUNGEON_LEVELS[this.currentLevelIdx];

    this.playerHp = 2800;
    this.playerMp = 1800;
    this.minionsKilled = 0;
    this.isUltimateReady = false;
    this.isLevelFinished = false;
    this.isGameOver = false;
    this.comboCount = 0;
    this.comboTimer = 0;
    this.bossTelegraphTimer = 0;
    this.bossTelegraphCooldown = 5.0;
    if (this.bossTelegraphRing) {
      (this.bossTelegraphRing.material as THREE.Material).opacity = 0;
    }
    this.playerPos.set(0, 0, 7);

    // Clean old enemies
    if (this.bossEntity?.mesh) this.scene.remove(this.bossEntity.mesh);
    this.minionEntities.forEach((m) => this.scene.remove(m.mesh));
    this.minionEntities = [];

    // Clean projectiles
    this.magicProjectiles.forEach((p) => this.scene.remove(p.mesh));
    this.magicProjectiles = [];

    // 1. Spawn Knight Commander, Igris the Red (or Level Boss)
    const isIgris = this.currentLevelData.bossName.includes('Igris');
    const bossGroup = isIgris
      ? this.createIgrisTheRedMesh()
      : this.createBossMesh(this.currentLevelData.bossColor, this.currentLevelData.rank);
    bossGroup.position.set(0, 0, -8);
    this.scene.add(bossGroup);

    this.bossEntity = {
      mesh: bossGroup,
      name: this.currentLevelData.bossName,
      isBoss: true,
      hp: this.currentLevelData.bossHp,
      maxHp: this.currentLevelData.bossHp,
      attackPower: this.currentLevelData.bossAttack,
      isDead: false,
      attackCooldown: 2.0,
      hitFlashTime: 0,
    };

    // 2. Spawn 3 Shadow Soldier Minions (Allies or Opponents to eliminate for Ultimate charge)
    const minionOffsets: Array<[number, number]> = [[-5, 2], [0, 1], [5, 2]];
    for (let i = 0; i < 3; i++) {
      const minionGroup = this.createShadowSoldierMesh();
      minionGroup.position.set(minionOffsets[i][0], 0, minionOffsets[i][1]);
      this.scene.add(minionGroup);

      this.minionEntities.push({
        mesh: minionGroup,
        name: `Shadow Soldier #${i + 1}`,
        isBoss: false,
        hp: this.currentLevelData.minionHp,
        maxHp: this.currentLevelData.minionHp,
        attackPower: 8,
        isDead: false,
        attackCooldown: 1.2 + Math.random() * 0.4,
        hitFlashTime: 0,
      });
    }
  }

  /**
   * Constructs Knight Commander, Igris the Red exactly as seen in the reference screenshot!
   */
  private createIgrisTheRedMesh(): THREE.Group {
    const group = new THREE.Group();

    const armorMat = new THREE.MeshStandardMaterial({
      color: '#b91c1c',
      roughness: 0.25,
      metalness: 0.85,
    });
    const darkArmorMat = new THREE.MeshStandardMaterial({
      color: '#450a0a',
      roughness: 0.3,
      metalness: 0.9,
    });
    const goldMat = new THREE.MeshStandardMaterial({
      color: '#f59e0b',
      roughness: 0.2,
      metalness: 0.9,
    });
    const plumeMat = new THREE.MeshBasicMaterial({
      color: '#ef4444',
      side: THREE.DoubleSide,
    });

    // Torso & Spiked Breastplate (Scale 3.2m tall)
    const torsoGroup = new THREE.Group();
    torsoGroup.position.y = 1.9;

    const chest = new THREE.Mesh(new THREE.BoxGeometry(0.9, 1.1, 0.55), armorMat);
    const abdomen = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.45, 0.65, 10), darkArmorMat);
    abdomen.position.y = -0.65;
    torsoGroup.add(chest, abdomen);

    // Gold Runic Trim on Breastplate
    const goldTrim = new THREE.Mesh(new THREE.BoxGeometry(0.94, 0.12, 0.58), goldMat);
    goldTrim.position.y = 0.15;
    torsoGroup.add(goldTrim);

    // Spiked Shoulder Pauldrons (Flared like screenshot)
    const pauldronGeo = new THREE.ConeGeometry(0.42, 0.75, 5);
    const pauldronL = new THREE.Mesh(pauldronGeo, armorMat);
    pauldronL.position.set(-0.72, 0.4, 0);
    pauldronL.rotation.z = Math.PI * 0.65;

    const pauldronR = new THREE.Mesh(pauldronGeo, armorMat);
    pauldronR.position.set(0.72, 0.4, 0);
    pauldronR.rotation.z = -Math.PI * 0.65;
    torsoGroup.add(pauldronL, pauldronR);

    // Gothic Horned Helmet
    const helmGroup = new THREE.Group();
    helmGroup.position.y = 0.85;

    const helm = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.36, 0.65, 10), armorMat);
    const visorGlow = new THREE.Mesh(
      new THREE.BoxGeometry(0.3, 0.05, 0.38),
      new THREE.MeshBasicMaterial({ color: '#fef08a' })
    );
    visorGlow.position.set(0, 0.04, 0.08);
    helmGroup.add(helm, visorGlow);

    // SIGNATURE FIERY RED PLUME (Curving high up & back like in screenshot)
    const plumeGroup = new THREE.Group();
    for (let i = 0; i < 7; i++) {
      const pSeg = new THREE.Mesh(new THREE.ConeGeometry(0.24 - i * 0.025, 0.6, 6), plumeMat);
      const angle = (i / 7) * Math.PI * 0.75;
      pSeg.position.set(0, 0.45 + i * 0.35, -0.15 - Math.sin(angle) * 0.45);
      pSeg.rotation.x = -angle;
      plumeGroup.add(pSeg);
    }
    helmGroup.add(plumeGroup);
    torsoGroup.add(helmGroup);

    // Tattered Flowing Crimson Cape
    const capeGeo = new THREE.PlaneGeometry(1.4, 2.6, 8, 8);
    const capeMat = new THREE.MeshStandardMaterial({
      color: '#7f1d1d',
      side: THREE.DoubleSide,
      roughness: 0.9,
    });
    const cape = new THREE.Mesh(capeGeo, capeMat);
    cape.position.set(0, -0.8, -0.35);
    cape.rotation.x = 0.15;
    torsoGroup.add(cape);

    // Legs
    const legGeo = new THREE.CylinderGeometry(0.18, 0.14, 1.3, 8);
    const legL = new THREE.Mesh(legGeo, armorMat);
    legL.position.set(-0.35, -1.3, 0);
    const legR = new THREE.Mesh(legGeo, armorMat);
    legR.position.set(0.35, -1.3, 0);
    torsoGroup.add(legL, legR);

    // Colossal Two-Handed Greatsword (Crimson Runic Blade)
    const swordGroup = new THREE.Group();
    swordGroup.position.set(0.9, 0.2, 0.5);
    swordGroup.rotation.set(0.2, 0, -0.3);

    const sBlade = new THREE.Mesh(
      new THREE.BoxGeometry(0.22, 2.6, 0.05),
      new THREE.MeshStandardMaterial({
        color: '#dc2626',
        emissive: '#ef4444',
        emissiveIntensity: 1.2,
        metalness: 0.9,
        roughness: 0.15,
      })
    );
    sBlade.position.y = 1.3;
    const sGuard = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.1, 0.12), goldMat);
    const sHilt = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.6, 8), darkArmorMat);
    sHilt.position.y = -0.3;
    swordGroup.add(sBlade, sGuard, sHilt);
    torsoGroup.add(swordGroup);

    group.add(torsoGroup);
    return group;
  }

  private createShadowSoldierMesh(): THREE.Group {
    const group = new THREE.Group();
    const shadowMat = new THREE.MeshStandardMaterial({
      color: '#0f172a',
      emissive: '#38bdf8',
      emissiveIntensity: 0.45,
      roughness: 0.3,
    });

    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.35, 1.2, 10), shadowMat);
    body.position.y = 0.6;
    group.add(body);

    const head = new THREE.Mesh(new THREE.SphereGeometry(0.2, 10, 10), shadowMat);
    head.position.y = 1.35;
    const eyes = new THREE.Mesh(
      new THREE.BoxGeometry(0.18, 0.04, 0.2),
      new THREE.MeshBasicMaterial({ color: '#38bdf8' })
    );
    eyes.position.set(0, 0.02, 0.1);
    head.add(eyes);
    group.add(head);

    return group;
  }

  private createBossMesh(colorHex: string, rank: string): THREE.Group {
    const group = new THREE.Group();
    const mat = new THREE.MeshStandardMaterial({
      color: colorHex,
      emissive: colorHex,
      emissiveIntensity: 0.6,
      roughness: 0.3,
      metalness: 0.7,
    });

    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 1.1, 2.6, 12), mat);
    body.position.y = 1.6;
    group.add(body);

    const head = new THREE.Mesh(new THREE.SphereGeometry(0.65, 12, 12), mat);
    head.position.y = 3.3;
    group.add(head);

    return group;
  }

  // --- COMBAT ACTIONS ---

  public attackSword() {
    if (this.isGameOver || this.isLevelFinished) return;
    soundManager.playSwordHit();

    // Increment combo
    this.comboCount++;
    this.comboTimer = 2.8;

    // Trigger visual slash arcs
    this.slashTimer = 0.22;
    this.swordSlashArcs.forEach((arc, i) => {
      (arc.material as THREE.Material).opacity = 0.9 - i * 0.25;
      arc.position.set(this.playerPos.x, 1.1 + i * 0.15, this.playerPos.z - 0.5);
      arc.rotation.z = Math.random() * Math.PI;
    });

    // Check hit on Boss & Minions
    const hitRadius = 3.6;
    [this.bossEntity, ...this.minionEntities].forEach((entity) => {
      if (!entity || entity.isDead) return;
      const d = this.playerPos.distanceTo(entity.mesh.position);
      if (d < hitRadius) {
        this.applyDamageToEnemy(entity, 80 + Math.floor(Math.random() * 35));
      }
    });

    // Step forward slightly during attack & enforce solid collisions
    const fwd = new THREE.Vector3(0, 0, -1).applyAxisAngle(new THREE.Vector3(0, 1, 0), this.playerRotY);
    this.playerPos.addScaledVector(fwd, 0.35);
    this.resolveDungeonCollisions();
  }

  public castMagic() {
    if (this.isGameOver || this.isLevelFinished) return;
    if (this.playerMp < 120) return;

    this.playerMp -= 120;
    soundManager.playJump();

    this.comboCount++;
    this.comboTimer = 2.8;

    // Spawn 3 rapid homing shadow daggers / orbs
    [-0.3, 0, 0.3].forEach((offsetAngle) => {
      const orb = new THREE.Mesh(
        new THREE.SphereGeometry(0.35, 12, 12),
        new THREE.MeshBasicMaterial({ color: '#38bdf8' })
      );
      orb.position.set(this.playerPos.x, 1.4, this.playerPos.z - 0.4);
      this.scene.add(orb);

      const dir = new THREE.Vector3(0, 0, -1)
        .applyAxisAngle(new THREE.Vector3(0, 1, 0), this.playerRotY + offsetAngle)
        .normalize();

      this.magicProjectiles.push({
        mesh: orb,
        velocity: dir.multiplyScalar(24),
        life: 1.8,
        color: '#38bdf8',
      });
    });
  }

  public dash() {
    if (this.isGameOver || this.isLevelFinished) return;
    soundManager.playJumpPad();

    const forward = new THREE.Vector3(0, 0, -1).applyAxisAngle(new THREE.Vector3(0, 1, 0), this.playerRotY);
    this.playerPos.addScaledVector(forward, 5.0);
    this.resolveDungeonCollisions();

    // Trigger shockwave ring flash
    this.shockwaveTimer = 0.25;
    this.shockwaveRing.position.set(this.playerPos.x, 0.05, this.playerPos.z);
    (this.shockwaveRing.material as THREE.Material).opacity = 0.9;
  }

  private resolveDungeonCollisions() {
    const playerRadius = 0.55;

    // 1. Arena Perimeter Boundary
    const pDist = Math.hypot(this.playerPos.x, this.playerPos.z);
    if (pDist > this.arenaRadius - 1.8) {
      const factor = (this.arenaRadius - 1.8) / pDist;
      this.playerPos.x *= factor;
      this.playerPos.z *= factor;
    }

    // 2. Gothic Cathedral Pillars
    for (const pil of this.pillarColliders) {
      const dx = this.playerPos.x - pil.x;
      const dz = this.playerPos.z - pil.z;
      const dist = Math.hypot(dx, dz);
      const minSep = playerRadius + pil.radius;
      if (dist < minSep && dist > 0.001) {
        this.playerPos.x = pil.x + (dx / dist) * minSep;
        this.playerPos.z = pil.z + (dz / dist) * minSep;
      }
    }

    // 3. Boss & Living Minion Solid Body Separation
    const actors = [this.bossEntity, ...this.minionEntities];
    for (const actor of actors) {
      if (!actor || actor.isDead) continue;
      const actorR = actor.isBoss ? 1.35 : 0.65;
      const dx = this.playerPos.x - actor.mesh.position.x;
      const dz = this.playerPos.z - actor.mesh.position.z;
      const dist = Math.hypot(dx, dz);
      const minSep = playerRadius + actorR;
      if (dist < minSep) {
        if (dist > 0.001) {
          this.playerPos.x = actor.mesh.position.x + (dx / dist) * minSep;
          this.playerPos.z = actor.mesh.position.z + (dz / dist) * minSep;
        } else {
          this.playerPos.z += minSep;
        }
      }
    }
  }

  public castSkill1() {
    // Shadow Step Slash
    this.dash();
    this.attackSword();
  }

  public castSkill2() {
    // Dagger Rush
    this.castMagic();
  }

  public castSkill3() {
    // Crushing Blow / Shockwave
    if (this.playerMp < 150) return;
    this.playerMp -= 150;
    this.shockwaveTimer = 0.5;
    this.shockwaveRing.position.set(this.playerPos.x, 0.05, this.playerPos.z);
    (this.shockwaveRing.material as THREE.Material).opacity = 1.0;

    [this.bossEntity, ...this.minionEntities].forEach((entity) => {
      if (!entity || entity.isDead) return;
      if (this.playerPos.distanceTo(entity.mesh.position) < 5.0) {
        this.applyDamageToEnemy(entity, 180);
      }
    });
  }

  public castUltimate() {
    if (!this.isUltimateReady || this.isGameOver || this.isLevelFinished) return;

    this.isUltimateReady = false;
    this.minionsKilled = 0;
    soundManager.playLevelVictory();

    this.comboCount += 10;
    this.comboTimer = 4.0;

    // Screen clearing "ARISE! Shadow Monarch Sovereign Strike"
    const ultDamage = 850;
    this.applyDamageToEnemy(this.bossEntity, ultDamage);
    this.minionEntities.forEach((m) => {
      if (!m.isDead) this.applyDamageToEnemy(m, ultDamage);
    });

    // Expand giant shockwave
    this.shockwaveTimer = 0.8;
    this.shockwaveRing.scale.set(4, 4, 4);
    (this.shockwaveRing.material as THREE.Material).opacity = 1.0;
  }

  private applyDamageToEnemy(entity: CombatEntity, dmg: number) {
    entity.hp -= dmg;
    entity.hitFlashTime = 0.15;
    soundManager.playCorrect();

    if (entity.hp <= 0 && !entity.isDead) {
      entity.hp = 0;
      entity.isDead = true;
      entity.mesh.visible = false;

      if (!entity.isBoss) {
        this.minionsKilled++;
        if (this.minionsKilled >= this.targetMinionsForUltimate) {
          this.isUltimateReady = true;
          soundManager.playCorrect();
        }
      } else {
        // Boss Defeated!
        this.isLevelFinished = true;
        soundManager.playLevelVictory();
      }
    }
  }

  // --- MAIN LOOP ---

  public update(delta: number, cameraMode: CameraPerspective = 'tpp') {
    this.elapsedTime += delta;

    // 1. Combo Timer Countdown
    if (this.comboTimer > 0) {
      this.comboTimer -= delta;
      if (this.comboTimer <= 0) {
        this.comboCount = 0;
      }
    }

    // 2. Regenerate MP over time
    if (this.playerMp < this.playerMaxMp) {
      this.playerMp = Math.min(this.playerMaxMp, this.playerMp + delta * 35);
    }

    // 3. Free Camera Orbit from Pointer Drag
    const { dx, dy, isDragging } = inputManager.consumePointerDelta();
    if (isDragging) {
      this.cameraYaw -= dx * 0.0055;
      this.cameraPitch = Math.max(0.12, Math.min(1.2, this.cameraPitch + dy * 0.0055));
    }
    const zoom = inputManager.consumeZoomDelta();
    this.cameraDistance = Math.max(4.5, Math.min(13.0, this.cameraDistance + zoom * 2.0));

    // 4. Free Movement in 3D relative to camera look
    const move = inputManager.getMovementVector();
    if (move.isMoving && !this.isGameOver && !this.isLevelFinished) {
      const forward = new THREE.Vector3(-Math.sin(this.cameraYaw), 0, -Math.cos(this.cameraYaw));
      const right = new THREE.Vector3(Math.cos(this.cameraYaw), 0, -Math.sin(this.cameraYaw));

      const worldDir = new THREE.Vector3()
        .addScaledVector(forward, move.z)
        .addScaledVector(right, move.x)
        .normalize();

      const speed = 7.8;
      this.playerPos.addScaledVector(worldDir, speed * delta);

      // Rotate player smoothly toward direction of travel
      const targetRot = Math.atan2(worldDir.x, worldDir.z) + Math.PI;
      let diff = targetRot - this.playerRotY;
      while (diff < -Math.PI) diff += Math.PI * 2;
      while (diff > Math.PI) diff -= Math.PI * 2;
      this.playerRotY += diff * 14.0 * delta;

      // Animate flowing coattails during run
      const sway = Math.sin(this.elapsedTime * 14) * 0.25;
      this.playerCoatTailLeft.rotation.x = 0.45 + sway;
      this.playerCoatTailRight.rotation.x = 0.45 - sway;
    } else {
      // Idle breathing sway
      this.playerCoatTailLeft.rotation.x = 0.15 + Math.sin(this.elapsedTime * 3) * 0.05;
      this.playerCoatTailRight.rotation.x = 0.15 + Math.sin(this.elapsedTime * 3) * 0.05;
    }

    // Enforce Arena Perimeter, Cathedral Pillars, Boss & Minion Collisions
    this.resolveDungeonCollisions();

    // Update Player Model Position & Rotation
    this.playerModelGroup.position.copy(this.playerPos);
    this.playerModelGroup.rotation.y = this.playerRotY;

    // Pulse Player Aura Ring
    this.playerAuraRing.rotation.z += delta * 2.0;

    // 5. Update Camera (TPP Spring Orbit vs FPP)
    if (cameraMode === 'fpp') {
      this.playerModelGroup.visible = false;
      this.camera.position.set(this.playerPos.x, this.playerPos.y + 1.65, this.playerPos.z);
      const lookDir = new THREE.Vector3(
        -Math.sin(this.cameraYaw) * Math.cos(this.cameraPitch),
        -Math.sin(this.cameraPitch) * 0.5,
        -Math.cos(this.cameraYaw) * Math.cos(this.cameraPitch)
      );
      this.camera.lookAt(new THREE.Vector3().copy(this.camera.position).add(lookDir));
    } else {
      this.playerModelGroup.visible = true;
      const targetLook = new THREE.Vector3(this.playerPos.x, 1.4, this.playerPos.z);
      const camX = Math.sin(this.cameraYaw) * Math.cos(this.cameraPitch) * this.cameraDistance;
      const camY = Math.sin(this.cameraPitch) * this.cameraDistance;
      const camZ = Math.cos(this.cameraYaw) * Math.cos(this.cameraPitch) * this.cameraDistance;

      const targetCamPos = new THREE.Vector3(
        this.playerPos.x + camX,
        this.playerPos.y + camY + 1.2,
        this.playerPos.z + camZ
      );

      this.camera.position.lerp(targetCamPos, 0.16);
      this.camera.lookAt(targetLook);
    }

    // 6. Shockwave Fade
    if (this.shockwaveTimer > 0) {
      this.shockwaveTimer -= delta;
      if (this.shockwaveTimer <= 0) {
        (this.shockwaveRing.material as THREE.Material).opacity = 0;
        this.shockwaveRing.scale.set(1, 1, 1);
      }
    }

    // 7. Slash Arcs Fade
    if (this.slashTimer > 0) {
      this.slashTimer -= delta;
      if (this.slashTimer <= 0) {
        this.swordSlashArcs.forEach((arc) => {
          (arc.material as THREE.Material).opacity = 0;
        });
      }
    }

    // 8. Magic Projectiles Update
    for (let i = this.magicProjectiles.length - 1; i >= 0; i--) {
      const p = this.magicProjectiles[i];
      p.mesh.position.addScaledVector(p.velocity, delta);
      p.life -= delta;

      let hit = false;
      [this.bossEntity, ...this.minionEntities].forEach((entity) => {
        if (!entity || entity.isDead) return;
        if (p.mesh.position.distanceTo(entity.mesh.position) < (entity.isBoss ? 2.5 : 1.3)) {
          this.applyDamageToEnemy(entity, 120);
          hit = true;
        }
      });

      if (hit || p.life <= 0) {
        this.scene.remove(p.mesh);
        p.mesh.geometry.dispose();
        this.magicProjectiles.splice(i, 1);
      }
    }

    // 9. Minion AI (Shadow Soldiers)
    this.minionEntities.forEach((m) => {
      if (m.isDead) return;

      const dir = new THREE.Vector3().subVectors(this.playerPos, m.mesh.position);
      const dist = dir.length();
      dir.normalize();

      if (dist > 2.0) {
        m.mesh.position.addScaledVector(dir, delta * 3.8);
      }
      m.mesh.lookAt(new THREE.Vector3(this.playerPos.x, m.mesh.position.y, this.playerPos.z));

      m.attackCooldown -= delta;
      if (m.attackCooldown <= 0 && dist < 2.5 && !this.isGameOver) {
        m.attackCooldown = 1.4;
        this.playerHp = Math.max(0, this.playerHp - m.attackPower);
        soundManager.playError();
        if (this.playerHp <= 0) {
          this.isGameOver = true;
        }
      }
    });

    // 10. Boss AI (Knight Commander, Igris the Red)
    if (this.bossEntity && !this.bossEntity.isDead) {
      const b = this.bossEntity;
      const bDir = new THREE.Vector3().subVectors(this.playerPos, b.mesh.position);
      const bDist = bDir.length();
      bDir.normalize();

      if (bDist > 3.6) {
        b.mesh.position.addScaledVector(bDir, delta * 2.8);
      }
      b.mesh.lookAt(new THREE.Vector3(this.playerPos.x, b.mesh.position.y, this.playerPos.z));

      // Boss Greatsword Slash Attack
      b.attackCooldown -= delta;
      if (b.attackCooldown <= 0 && bDist < 4.5 && !this.isGameOver) {
        b.attackCooldown = 2.0;
        this.playerHp = Math.max(0, this.playerHp - b.attackPower);
        soundManager.playError();
        if (this.playerHp <= 0) {
          this.isGameOver = true;
        }
      }

      // Boss Telegraphed Crimson AoE Slam (Dodge with [Space] Dash!)
      if (this.bossTelegraphTimer > 0) {
        this.bossTelegraphTimer -= delta;
        const pulse = 0.35 + Math.abs(Math.sin(performance.now() * 0.02)) * 0.45;
        (this.bossTelegraphRing.material as THREE.MeshBasicMaterial).opacity = pulse;
        if (this.bossTelegraphTimer <= 0) {
          (this.bossTelegraphRing.material as THREE.MeshBasicMaterial).opacity = 0;
          const distFromSlam = Math.hypot(
            this.playerPos.x - this.bossSlamCenter.x,
            this.playerPos.z - this.bossSlamCenter.z
          );
          if (distFromSlam < 5.2 && !this.isGameOver) {
            this.playerHp = Math.max(0, this.playerHp - Math.round(b.attackPower * 1.6));
            soundManager.playError();
            if (this.playerHp <= 0) {
              this.isGameOver = true;
            }
          } else {
            soundManager.playSwordHit();
          }
        }
      } else if (!this.isGameOver && !this.isLevelFinished) {
        this.bossTelegraphCooldown -= delta;
        if (this.bossTelegraphCooldown <= 0 && bDist < 12) {
          this.bossTelegraphCooldown = 5.8;
          this.bossTelegraphTimer = 1.15;
          this.bossSlamCenter.copy(b.mesh.position);
          this.bossTelegraphRing.position.set(this.bossSlamCenter.x, 0.06, this.bossSlamCenter.z);
        }
      }
    }
  }
}
