/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as THREE from 'three';
import { soundManager } from '../../audio/SoundSynthesizer';
import { inputManager } from '../../core/InputManager';
import { CameraPerspective } from '../../types';

export interface PhysicsLevelData {
  levelNumber: number;
  title: string;
  planet: string;
  gravity: number;
  powerHint: number;
  angleHint: number;
  targetPositions: Array<[number, number, number]>;
  description: string;
}

export const PHYSICS_LEVELS: PhysicsLevelData[] = [
  { levelNumber: 1, title: 'Uji Tembak Pemula', planet: 'Bumi (9.8 m/s²)', gravity: 9.8, powerHint: 16, angleHint: 45, targetPositions: [[12, 2.5, 0]], description: 'Gerak parabola dasar di Bumi dengan sudut optimum elevasi.' },
  { levelNumber: 2, title: 'Target Menengah', planet: 'Bumi (9.8 m/s²)', gravity: 9.8, powerHint: 18, angleHint: 45, targetPositions: [[16, 2.8, 0]], description: 'Menambah gaya dorong pegas untuk menjangkau lentera lebih jauh.' },
  { levelNumber: 3, title: 'Lentera Tinggi', planet: 'Bumi (9.8 m/s²)', gravity: 9.8, powerHint: 20, angleHint: 60, targetPositions: [[14, 5.0, 0]], description: 'Sudut tembakan tinggi menghasilkan puncak parabola yang melambung.' },
  { levelNumber: 4, title: 'Gravitasi Bulan: Tembakan Ringan', planet: 'Bulan (1.6 m/s²)', gravity: 1.6, powerHint: 12, angleHint: 35, targetPositions: [[18, 4.0, 0]], description: 'Di Bulan gravitasi sangat lemah, bola melayang lebih lama dan jauh!' },
  { levelNumber: 5, title: 'Kubah Antariksa Bulan', planet: 'Bulan (1.6 m/s²)', gravity: 1.6, powerHint: 14, angleHint: 45, targetPositions: [[24, 6.0, 0]], description: 'Jangkau target di ujung kubah dengan gaya pegas minimum.' },
  { levelNumber: 6, title: 'Gravitasi Mars: Planet Merah', planet: 'Mars (3.7 m/s²)', gravity: 3.7, powerHint: 15, angleHint: 40, targetPositions: [[16, 3.2, 0]], description: 'Gravitasi Mars sekitar sepertiga Bumi, lintasan terasa empuk.' },
  { levelNumber: 7, title: 'Lembah Kawah Mars', planet: 'Mars (3.7 m/s²)', gravity: 3.7, powerHint: 18, angleHint: 50, targetPositions: [[20, 4.5, 0]], description: 'Menyesuaikan sudut elevasi melewati bibir kawah Mars.' },
  { levelNumber: 8, title: 'Target Ganda Berjarak', planet: 'Bumi (9.8 m/s²)', gravity: 9.8, powerHint: 19, angleHint: 45, targetPositions: [[13, 2.5, -1], [19, 3.5, 1]], description: 'Fokuskan tembakan mengenai formasi lentera sakura.' },
  { levelNumber: 9, title: 'Gravitasi Venus: Udara Tebal', planet: 'Venus (8.9 m/s²)', gravity: 8.9, powerHint: 19, angleHint: 45, targetPositions: [[15, 2.5, 0]], description: 'Percepatan gravitasi Venus hampir mirip Bumi namun butuh presisi sudut.' },
  { levelNumber: 10, title: 'Gravitasi Raksasa Jupiter', planet: 'Jupiter (24.8 m/s²)', gravity: 24.8, powerHint: 25, angleHint: 55, targetPositions: [[12, 1.8, 0]], description: 'Gravitasi masif menarik proyektil sangat cepat ke bawah! Gunakan daya penuh!' },
  { levelNumber: 11, title: 'Badai Gas Jupiter', planet: 'Jupiter (24.8 m/s²)', gravity: 24.8, powerHint: 26, angleHint: 50, targetPositions: [[14, 2.0, 0]], description: 'Daya dorong maksimum menembus tarikan gravitasi monster raksasa gas.' },
  { levelNumber: 12, title: 'Mikrogravitasi Ceres', planet: 'Asteroid Ceres (0.3 m/s²)', gravity: 0.3, powerHint: 10, angleHint: 25, targetPositions: [[26, 4.0, 0]], description: 'Hampir tanpa bobot! Sentuhan kecil membuat proyektil meluncur tanpa henti.' },
  { levelNumber: 13, title: 'Tembakan Datar Sudut Rendah', planet: 'Bumi (9.8 m/s²)', gravity: 9.8, powerHint: 22, angleHint: 25, targetPositions: [[15, 1.5, 0]], description: 'Sudut rendah menghasilkan lintasan datar berkecepatan tinggi.' },
  { levelNumber: 14, title: 'Tembakan Mortir Sudut 70°', planet: 'Bumi (9.8 m/s²)', gravity: 9.8, powerHint: 24, angleHint: 70, targetPositions: [[11, 4.5, 0]], description: 'Melambung tinggi hampir vertikal dan menukik tepat di target.' },
  { levelNumber: 15, title: 'Gravitasi Saturnus: Cincin Es', planet: 'Saturnus (10.4 m/s²)', gravity: 10.4, powerHint: 21, angleHint: 45, targetPositions: [[17, 3.0, 0]], description: 'Keseimbangan daya di planet cincin bercahaya.' },
  { levelNumber: 16, title: 'Gravitasi Neptunus: Lautan Metana', planet: 'Neptunus (11.2 m/s²)', gravity: 11.2, powerHint: 22, angleHint: 48, targetPositions: [[18, 3.2, 0]], description: 'Planet terjauh dengan gravitasi 11.2 m/s² yang membutuhkan sudut presisi.' },
  { levelNumber: 17, title: 'Tiga Lentera Tingkat', planet: 'Mars (3.7 m/s²)', gravity: 3.7, powerHint: 20, angleHint: 45, targetPositions: [[14, 2.5, 0], [18, 4.0, 0], [22, 5.5, 0]], description: 'Lintasan spektakuler menyapu deretan lentera bertingkat.' },
  { levelNumber: 18, title: 'Gravitasi Merkurius: Sinar Surya', planet: 'Merkurius (3.7 m/s²)', gravity: 3.7, powerHint: 17, angleHint: 42, targetPositions: [[19, 3.8, 0]], description: 'Menembak di dekat matahari dengan perhitungan sudut tajam.' },
  { levelNumber: 19, title: 'Target Ekstrem Ujung Desa', planet: 'Bumi (9.8 m/s²)', gravity: 9.8, powerHint: 24, angleHint: 45, targetPositions: [[23, 2.8, 0]], description: 'Batas jangkauan ketapel tradisional desa sakura.' },
  { levelNumber: 20, title: 'Bos Balistik: Tembakan Shogun Kosmik', planet: 'Alam Kosmik (5.5 m/s²)', gravity: 5.5, powerHint: 22, angleHint: 46, targetPositions: [[25, 4.2, 0]], description: 'Ujian akhir sang Ahli Balistik! Tembakan legendaris di angkasa sakura.' },
];

export class SakuraLaunchGame {
  public scene: THREE.Scene;
  public camera: THREE.PerspectiveCamera;

  // Level State
  public currentLevelIdx = 0;
  public currentLevelData = PHYSICS_LEVELS[0];

  // Catapult & Projectile state
  public angleDegrees = 25;
  public power = 12;
  public gravity = 9.8;
  public windAcceleration = 0;
  public isSimulating = false;
  public isLevelFinished = false;
  private hasLanded = false;
  private landingResetTimer = 0;

  // Free Mouse Camera Orbit Controls
  public cameraYaw = 0.08;
  public cameraPitch = 0.24;
  public cameraDistance = 24;
  private cameraTarget = new THREE.Vector3(6, 2.5, 0);

  private projectile!: THREE.Mesh;
  private projectileVelocity = new THREE.Vector3();
  private trajectoryLine!: THREE.Line;
  private lanternGroups: Array<{ group: THREE.Group; basePos: THREE.Vector3; hit: boolean }> = [];
  private lanternLights: THREE.PointLight[] = [];
  private barrierGroup: THREE.Group | null = null;
  private barrierSpec: { x: number; height: number } | null = null;
  private catapultBase!: THREE.Group;
  private armMesh!: THREE.Mesh;
  private windBanner!: THREE.Mesh;

  public get targetsHit(): number {
    return this.lanternGroups.filter((l) => l.hit).length;
  }

  public get totalTargets(): number {
    return this.lanternGroups.length;
  }

  constructor(initialLevel = 0) {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color('#381335');
    this.scene.fog = new THREE.FogExp2('#381335', 0.014);

    this.camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 200);
    this.camera.position.set(4, 7, 25);
    this.camera.lookAt(this.cameraTarget);

    this.setupLighting();
    this.setupEnvironment();
    this.setupCatapult();
    this.setupTrajectoryLine();

    this.loadLevel(initialLevel);
  }

  private setupLighting() {
    const sun = new THREE.DirectionalLight('#fed7aa', 1.8);
    sun.position.set(10, 20, 10);
    sun.castShadow = true;
    this.scene.add(sun);

    const hemi = new THREE.HemisphereLight('#f472b6', '#3b0764', 0.95);
    this.scene.add(hemi);

    const amb = new THREE.AmbientLight('#fb7185', 0.45);
    this.scene.add(amb);
  }

  private setupEnvironment() {
    // Extended Village ground so far targets rest comfortably on solid grass
    const groundGeo = new THREE.CylinderGeometry(36, 36, 1, 40);
    const groundMat = new THREE.MeshToonMaterial({ color: '#166534' });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.position.set(8, -0.5, 0);
    ground.receiveShadow = true;
    this.scene.add(ground);

    // Firing lane strip
    const laneMat = new THREE.MeshBasicMaterial({ color: '#fde047', transparent: true, opacity: 0.35 });
    const lane = new THREE.Mesh(new THREE.PlaneGeometry(34, 2.2), laneMat);
    lane.rotation.x = -Math.PI / 2;
    lane.position.set(10, 0.02, 0);
    this.scene.add(lane);

    // Distance yardage ticks every 5m along firing lane
    for (let x = 0; x <= 25; x += 5) {
      const tick = new THREE.Mesh(
        new THREE.PlaneGeometry(0.15, 2.2),
        new THREE.MeshBasicMaterial({ color: '#ffffff', transparent: true, opacity: 0.45 })
      );
      tick.rotation.x = -Math.PI / 2;
      tick.position.set(x, 0.03, 0);
      this.scene.add(tick);
    }

    // Traditional Torii Gate backdrop behind catapult
    const torii = new THREE.Group();
    torii.position.set(-10, 0, -4);
    const toriiMat = new THREE.MeshToonMaterial({ color: '#dc2626' });
    const pL = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.25, 5.2, 10), toriiMat);
    pL.position.set(-1.6, 2.6, 0);
    const pR = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.25, 5.2, 10), toriiMat);
    pR.position.set(1.6, 2.6, 0);
    const lintel = new THREE.Mesh(new THREE.BoxGeometry(4.8, 0.45, 0.5), toriiMat);
    lintel.position.set(0, 5.1, 0);
    torii.add(pL, pR, lintel);
    this.scene.add(torii);

    // Distant Pagoda Silhouette behind range
    const pagoda = new THREE.Group();
    pagoda.position.set(22, 0, -14);
    for (let tier = 0; tier < 3; tier++) {
      const roof = new THREE.Mesh(
        new THREE.ConeGeometry(2.6 - tier * 0.55, 1.3, 6),
        new THREE.MeshToonMaterial({ color: '#881337' })
      );
      roof.position.y = 2.4 + tier * 2.1;
      const body = new THREE.Mesh(
        new THREE.BoxGeometry(2.0 - tier * 0.4, 1.8, 2.0 - tier * 0.4),
        new THREE.MeshToonMaterial({ color: '#fef2f2' })
      );
      body.position.y = 1.2 + tier * 2.1;
      pagoda.add(body, roof);
    }
    this.scene.add(pagoda);

    // Wind direction banner pole next to catapult
    const flagPole = new THREE.Mesh(
      new THREE.CylinderGeometry(0.06, 0.08, 3.2, 8),
      new THREE.MeshStandardMaterial({ color: '#fde047' })
    );
    flagPole.position.set(-6, 1.6, -2.2);
    this.scene.add(flagPole);

    this.windBanner = new THREE.Mesh(
      new THREE.BoxGeometry(1.1, 0.36, 0.05),
      new THREE.MeshBasicMaterial({ color: '#38bdf8' })
    );
    this.windBanner.position.set(-5.4, 2.9, -2.2);
    this.scene.add(this.windBanner);

    // Sakura trees placed behind range lane so sightlines stay open
    for (let i = 0; i < 6; i++) {
      const tree = this.createSakuraTree();
      tree.position.set(-2 + i * 6.5, 0, -7 - (i % 2) * 3);
      this.scene.add(tree);
    }
  }

  private createSakuraTree(): THREE.Group {
    const tree = new THREE.Group();
    const trunk = new THREE.Mesh(
      new THREE.CylinderGeometry(0.25, 0.35, 3.5, 8),
      new THREE.MeshToonMaterial({ color: '#78350f' })
    );
    trunk.position.y = 1.75;
    tree.add(trunk);

    const crownMat = new THREE.MeshToonMaterial({ color: '#f472b6' });
    for (let i = 0; i < 4; i++) {
      const puff = new THREE.Mesh(new THREE.SphereGeometry(1.2 + (i % 2) * 0.35, 8, 8), crownMat);
      puff.position.set(((i % 2) - 0.5) * 1.3, 3.2 + (i % 3) * 0.4, (i - 1.5) * 0.5);
      tree.add(puff);
    }
    return tree;
  }

  private setupCatapult() {
    this.catapultBase = new THREE.Group();
    this.catapultBase.position.set(-6, 0, 0);

    const woodMat = new THREE.MeshToonMaterial({ color: '#92400e' });

    const base = new THREE.Mesh(new THREE.BoxGeometry(2.5, 0.4, 1.8), woodMat);
    base.position.y = 0.2;
    this.catapultBase.add(base);

    [-0.7, 0.7].forEach((z) => {
      const sup = new THREE.Mesh(new THREE.BoxGeometry(0.3, 2.2, 0.3), woodMat);
      sup.position.set(0, 1.1, z);
      this.catapultBase.add(sup);
    });

    const armGeo = new THREE.BoxGeometry(3.2, 0.2, 0.25);
    this.armMesh = new THREE.Mesh(armGeo, woodMat);
    this.armMesh.position.set(0.6, 1.8, 0);
    this.armMesh.rotation.z = THREE.MathUtils.degToRad(this.angleDegrees);
    this.catapultBase.add(this.armMesh);

    const ballGeo = new THREE.SphereGeometry(0.32, 16, 16);
    const ballMat = new THREE.MeshStandardMaterial({
      color: '#ffffff',
      roughness: 0.2,
      emissive: '#f472b6',
      emissiveIntensity: 0.4,
    });
    this.projectile = new THREE.Mesh(ballGeo, ballMat);
    this.projectile.position.copy(this.getLaunchPosition());
    this.scene.add(this.projectile);

    this.scene.add(this.catapultBase);
  }

  public loadLevel(levelIdx: number) {
    this.currentLevelIdx = Math.max(0, Math.min(levelIdx, PHYSICS_LEVELS.length - 1));
    this.currentLevelData = PHYSICS_LEVELS[this.currentLevelIdx];
    this.gravity = this.currentLevelData.gravity;
    this.isLevelFinished = false;
    this.isSimulating = false;
    this.hasLanded = false;
    this.landingResetTimer = 0;

    // Neutral off-target initial values so player must calculate angle, power & wind
    this.angleDegrees = 25;
    this.power = 12;

    // Add progressive wind for levels >= 4 (index >= 3)
    const windPattern = [-1.4, 1.5, -1.8, 2.0, -2.2, 1.8, -1.6, 2.2];
    this.windAcceleration =
      this.currentLevelIdx >= 3 ? windPattern[this.currentLevelIdx % windPattern.length] : 0;

    if (this.windBanner) {
      if (Math.abs(this.windAcceleration) < 0.01) {
        this.windBanner.scale.x = 0.25;
        this.windBanner.position.x = -5.8;
      } else {
        this.windBanner.scale.x = Math.min(1.4, Math.abs(this.windAcceleration) * 0.65);
        this.windBanner.position.x = -6 + Math.sign(this.windAcceleration) * 0.55;
      }
    }

    if (this.armMesh) {
      this.armMesh.rotation.z = THREE.MathUtils.degToRad(this.angleDegrees);
    }

    this.setupBarrierForLevel();
    this.setupLanternTargetsForLevel();
    this.resetProjectile();
  }

  private setupBarrierForLevel() {
    if (this.barrierGroup) {
      this.scene.remove(this.barrierGroup);
      this.barrierGroup = null;
    }
    this.barrierSpec = null;

    if (this.currentLevelIdx < 5) return;

    const minTargetX = Math.min(...this.currentLevelData.targetPositions.map((p) => p[0]));
    const wallX = Number(((-6 + minTargetX) * 0.45).toFixed(1));
    const wallHeight = Math.min(3.8, 2.4 + Math.floor((this.currentLevelIdx - 5) / 5) * 0.45);
    this.barrierSpec = { x: wallX, height: wallHeight };

    const g = new THREE.Group();
    g.position.set(wallX, 0, 0);
    const wall = new THREE.Mesh(
      new THREE.BoxGeometry(0.9, wallHeight, 5.2),
      new THREE.MeshStandardMaterial({
        color: '#991b1b',
        emissive: '#ef4444',
        emissiveIntensity: 0.25,
        roughness: 0.5,
      })
    );
    wall.position.y = wallHeight * 0.5;
    g.add(wall);

    const cap = new THREE.Mesh(
      new THREE.BoxGeometry(1.15, 0.22, 5.4),
      new THREE.MeshStandardMaterial({ color: '#fde047', metalness: 0.6 })
    );
    cap.position.y = wallHeight;
    g.add(cap);

    this.barrierGroup = g;
    this.scene.add(g);
  }

  private setupLanternTargetsForLevel() {
    this.lanternGroups.forEach((l) => this.scene.remove(l.group));
    this.lanternLights.forEach((lt) => this.scene.remove(lt));
    this.lanternGroups = [];
    this.lanternLights = [];

    const lanternMat = new THREE.MeshStandardMaterial({
      color: '#f43f5e',
      emissive: '#fb7185',
      emissiveIntensity: 1.0,
    });
    const goldMat = new THREE.MeshStandardMaterial({
      color: '#fde047',
      emissive: '#f59e0b',
      emissiveIntensity: 0.8,
    });
    const haloMat = new THREE.MeshBasicMaterial({
      color: '#fef08a',
      transparent: true,
      opacity: 0.75,
      side: THREE.DoubleSide,
    });
    const beaconMat = new THREE.MeshBasicMaterial({
      color: '#fb7185',
      transparent: true,
      opacity: 0.2,
      depthWrite: false,
      side: THREE.DoubleSide,
    });

    this.currentLevelData.targetPositions.forEach((pos) => {
      const targetGroup = new THREE.Group();
      targetGroup.position.set(pos[0], pos[1], pos[2]);

      const lantern = new THREE.Mesh(new THREE.CylinderGeometry(0.65, 0.65, 1.25, 16), lanternMat);
      targetGroup.add(lantern);

      const topCap = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.7, 0.16, 16), goldMat);
      topCap.position.y = 0.65;
      const botCap = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.7, 0.16, 16), goldMat);
      botCap.position.y = -0.65;
      targetGroup.add(topCap, botCap);

      const bullseyeRing = new THREE.Mesh(new THREE.TorusGeometry(1.05, 0.08, 8, 28), haloMat);
      bullseyeRing.rotation.y = Math.PI / 2;
      targetGroup.add(bullseyeRing);

      const frontRing = new THREE.Mesh(new THREE.TorusGeometry(1.05, 0.06, 8, 28), haloMat);
      targetGroup.add(frontRing);

      const beacon = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.55, 10, 12), beaconMat);
      beacon.position.y = 2.5;
      targetGroup.add(beacon);

      const supportPole = new THREE.Mesh(
        new THREE.CylinderGeometry(0.06, 0.08, pos[1], 8),
        new THREE.MeshBasicMaterial({ color: '#fcd34d', transparent: true, opacity: 0.45 })
      );
      supportPole.position.y = -pos[1] * 0.5;
      targetGroup.add(supportPole);

      const groundRing = new THREE.Mesh(
        new THREE.RingGeometry(0.8, 1.25, 24),
        new THREE.MeshBasicMaterial({ color: '#fde047', side: THREE.DoubleSide, transparent: true, opacity: 0.65 })
      );
      groundRing.rotation.x = -Math.PI / 2;
      groundRing.position.y = -pos[1] + 0.05;
      targetGroup.add(groundRing);

      this.lanternGroups.push({
        group: targetGroup,
        basePos: new THREE.Vector3(pos[0], pos[1], pos[2]),
        hit: false,
      });
      this.scene.add(targetGroup);

      const light = new THREE.PointLight('#fb7185', 2.0, 9);
      light.position.set(pos[0], pos[1], pos[2]);
      this.lanternLights.push(light);
      this.scene.add(light);
    });
  }

  private setupTrajectoryLine() {
    const pointsCount = 24;
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(pointsCount * 3);
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const mat = new THREE.LineDashedMaterial({
      color: '#facc15',
      dashSize: 0.4,
      gapSize: 0.25,
      linewidth: 2,
    });

    this.trajectoryLine = new THREE.Line(geo, mat);
    this.scene.add(this.trajectoryLine);
  }

  public getLaunchPosition(): THREE.Vector3 {
    const rad = THREE.MathUtils.degToRad(this.angleDegrees);
    return new THREE.Vector3(-6 + Math.cos(rad) * 1.6, 1.8 + Math.sin(rad) * 1.6, 0);
  }

  public setAngle(angle: number) {
    this.angleDegrees = angle;
    this.armMesh.rotation.z = THREE.MathUtils.degToRad(angle);
    if (!this.isSimulating) {
      this.projectile.position.copy(this.getLaunchPosition());
      this.updateTrajectoryPrediction();
    }
  }

  public setPower(power: number) {
    this.power = power;
    this.updateTrajectoryPrediction();
  }

  public setGravity(g: number) {
    this.gravity = g;
    this.updateTrajectoryPrediction();
  }

  private updateTrajectoryPrediction() {
    const start = this.getLaunchPosition();
    const rad = THREE.MathUtils.degToRad(this.angleDegrees);
    const vx = Math.cos(rad) * this.power;
    const vy = Math.sin(rad) * this.power;

    const positions = this.trajectoryLine.geometry.attributes.position.array as Float32Array;
    const dt = 0.045;

    for (let i = 0; i < 24; i++) {
      const t = i * dt;
      const px = start.x + vx * t + 0.5 * this.windAcceleration * t * t;
      const py = start.y + vy * t - 0.5 * this.gravity * t * t;
      const pz = start.z;

      positions[i * 3] = px;
      positions[i * 3 + 1] = Math.max(0, py);
      positions[i * 3 + 2] = pz;
    }

    this.trajectoryLine.geometry.attributes.position.needsUpdate = true;
    this.trajectoryLine.computeLineDistances();
  }

  public launch() {
    if (this.isSimulating) return;
    this.isSimulating = true;
    this.hasLanded = false;
    this.landingResetTimer = 0;
    soundManager.playJump();

    const start = this.getLaunchPosition();
    this.projectile.position.copy(start);

    const rad = THREE.MathUtils.degToRad(this.angleDegrees);
    this.projectileVelocity.set(Math.cos(rad) * this.power, Math.sin(rad) * this.power, 0);
  }

  public resetProjectile() {
    this.isSimulating = false;
    this.hasLanded = false;
    this.landingResetTimer = 0;
    this.projectile.position.copy(this.getLaunchPosition());
    this.updateTrajectoryPrediction();
  }

  public update(delta: number, cameraMode: CameraPerspective = 'tpp') {
    // 1. Free Mouse Orbit & Scroll Zoom (Does not modify launch mechanics)
    const { dx, dy, isDragging } = inputManager.consumePointerDelta();
    const zoom = inputManager.consumeZoomDelta();

    if (isDragging && (Math.abs(dx) > 0.001 || Math.abs(dy) > 0.001)) {
      this.cameraYaw -= dx * 0.0045;
      this.cameraPitch = THREE.MathUtils.clamp(this.cameraPitch + dy * 0.0035, 0.04, 1.15);
    }
    if (Math.abs(zoom) > 0.001) {
      this.cameraDistance = THREE.MathUtils.clamp(this.cameraDistance + zoom * 2.5, 10, 40);
    }

    // Animate lanterns gently (plus vertical bobbing on harder levels >= 9)
    const t = performance.now() * 0.002;
    const amp = this.currentLevelIdx >= 8 ? 0.65 : 0.14;
    this.lanternGroups.forEach((l, idx) => {
      if (!l.hit) {
        l.group.position.y = Math.max(1.2, l.basePos.y + Math.sin(t * (this.currentLevelIdx >= 8 ? 1.35 : 1) + idx) * amp);
        l.group.rotation.y += delta * 0.9;
      }
    });

    // 2. Projectile Ballistic Simulation with Wind & Barrier Obstacle
    if (this.isSimulating) {
      if (!this.hasLanded) {
        this.projectileVelocity.x += this.windAcceleration * delta;
        this.projectileVelocity.y -= this.gravity * delta;
        this.projectile.position.addScaledVector(this.projectileVelocity, delta);

        // Check mid-range barrier obstacle collision
        if (
          this.barrierSpec &&
          Math.abs(this.projectile.position.x - this.barrierSpec.x) < 0.7 &&
          this.projectile.position.y <= this.barrierSpec.height + 0.3 &&
          Math.abs(this.projectile.position.z) < 2.8
        ) {
          this.hasLanded = true;
          this.landingResetTimer = 0.7;
          soundManager.playError();
        }

        // Ground collision or far boundary
        if (this.projectile.position.y <= 0.3 || this.projectile.position.x > 38 || this.projectile.position.x < -16) {
          this.projectile.position.y = Math.max(0.3, this.projectile.position.y);
          this.hasLanded = true;
          this.landingResetTimer = 0.8;
          soundManager.playFootstep();
        }
      } else {
        this.landingResetTimer -= delta;
        if (this.landingResetTimer <= 0) {
          this.resetProjectile();
        }
      }

      // Check collision against ALL lanterns (use live group position)
      this.lanternGroups.forEach((l) => {
        if (!l.hit && this.projectile.position.distanceTo(l.group.position) < 1.35) {
          l.hit = true;
          soundManager.playCorrect();
          l.group.scale.set(0.1, 0.1, 0.1);
          if (this.lanternGroups.every((item) => item.hit) && !this.isLevelFinished) {
            this.isLevelFinished = true;
            soundManager.playLevelVictory();
          }
        }
      });
    }

    // 3. Camera Tracking with Full User Orbit Control
    if (cameraMode === 'fpp') {
      const lookDir = new THREE.Vector3(
        Math.cos(this.cameraYaw - Math.PI / 2) * Math.cos(this.cameraPitch),
        -Math.sin(this.cameraPitch) + 0.15,
        Math.sin(this.cameraYaw - Math.PI / 2) * Math.cos(this.cameraPitch)
      );
      this.camera.position.lerp(new THREE.Vector3(-8.5, 2.8, 1.5), 0.1);
      const aimCenter = new THREE.Vector3(8, 3, 0);
      const orbitOffset = new THREE.Vector3(
        Math.sin(this.cameraYaw) * 14,
        -Math.sin(this.cameraPitch) * 10 + 3,
        -Math.cos(this.cameraYaw) * 14
      );
      this.camera.lookAt(aimCenter.add(orbitOffset.multiplyScalar(0.35)).add(lookDir));
    } else {
      const targetFocus = this.isSimulating
        ? new THREE.Vector3().lerpVectors(new THREE.Vector3(6, 2.5, 0), this.projectile.position, 0.55)
        : new THREE.Vector3(6, 2.5, 0);
      this.cameraTarget.lerp(targetFocus, 0.08);

      const offsetX = Math.sin(this.cameraYaw) * Math.cos(this.cameraPitch) * this.cameraDistance;
      const offsetY = Math.sin(this.cameraPitch) * this.cameraDistance;
      const offsetZ = Math.cos(this.cameraYaw) * Math.cos(this.cameraPitch) * this.cameraDistance;

      const desiredPos = new THREE.Vector3(
        this.cameraTarget.x + offsetX,
        Math.max(1.2, this.cameraTarget.y + offsetY),
        this.cameraTarget.z + offsetZ
      );

      this.camera.position.lerp(desiredPos, 0.12);
      this.camera.lookAt(this.cameraTarget);
    }
  }
}
