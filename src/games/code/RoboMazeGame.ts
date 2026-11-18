/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as THREE from 'three';
import { soundManager } from '../../audio/SoundSynthesizer';
import { CameraPerspective } from '../../types';

export interface CodeLevelData {
  levelNumber: number;
  title: string;
  robotStart: [number, number];
  crystalPos: [number, number];
  walls: Array<[number, number]>;
  description: string;
}

export const CODE_LEVELS: CodeLevelData[] = [
  { levelNumber: 1, title: 'Langkah Pertama Robot', robotStart: [0, 2], crystalPos: [0, 0], walls: [], description: 'Instruksi sekuensial lurus: Eksekusi dua perintah Maju berturut-turut.' },
  { levelNumber: 2, title: 'Belokan Kanan Kristal', robotStart: [-1, 2], crystalPos: [1, 1], walls: [[-1, 1], [0, 1]], description: 'Menggabungkan perintah belok kanan dengan langkah maju.' },
  { levelNumber: 3, title: 'Menghindari Tembok Kiri', robotStart: [0, 2], crystalPos: [-2, 0], walls: [[-1, 2], [0, 1]], description: 'Mengarahkan robot memutar menghindari rintangan laser.' },
  { levelNumber: 4, title: 'Jalur Huruf L', robotStart: [-2, 2], crystalPos: [2, -2], walls: [[0, 0], [-1, 0]], description: 'Navigasi lintasan sudut siku-siku menuju sudut seberang.' },
  { levelNumber: 5, title: 'Perulangan Loop 3 Langkah', robotStart: [-2, 1], crystalPos: [1, 1], walls: [], description: 'Pola berulang: Menggerakkan robot 3 langkah ke kanan secara berurutan.' },
  { levelNumber: 6, title: 'Labirin Zigzag', robotStart: [-2, 2], crystalPos: [2, 0], walls: [[-1, 1], [1, 1]], description: 'Bergerak zigzag menghindari blok penghalang di tengah grid.' },
  { levelNumber: 7, title: 'Koridor Sempit Es', robotStart: [0, 2], crystalPos: [0, -2], walls: [[-1, 0], [1, 0]], description: 'Melewati celah sempit satu ubin di antara dua dinding tebal.' },
  { levelNumber: 8, title: 'Putaran U-Turn', robotStart: [-1, -1], crystalPos: [1, -1], walls: [[0, -1], [0, 0]], description: 'Melakukan putaran balik U-turn mengelilingi penghalang tengah.' },
  { levelNumber: 9, title: 'Labirin Tangga Berundak', robotStart: [-2, 2], crystalPos: [1, -1], walls: [[-1, 2], [0, 1], [1, 0]], description: 'Algoritma melangkah seperti menaiki anak tangga diagonal.' },
  { levelNumber: 10, title: 'Rintangan Kotak Benteng', robotStart: [0, 2], crystalPos: [0, -2], walls: [[-1, 0], [0, 0], [1, 0]], description: 'Benteng melintang di tengah mengharuskan robot memutar lewat tepi kiri/kanan.' },
  { levelNumber: 11, title: 'Labirin Spiral Masuk', robotStart: [-2, -2], crystalPos: [0, 0], walls: [[-1, -1], [0, -1], [1, -1], [1, 0], [1, 1]], description: 'Menyusuri jalur melingkar spiral ke pusat matriks.' },
  { levelNumber: 12, title: 'Algoritma S-Curve', robotStart: [-2, 2], crystalPos: [2, -2], walls: [[-1, 1], [0, 1], [0, -1], [1, -1]], description: 'Dua kurva kelokan berlawanan membentuk huruf S.' },
  { levelNumber: 13, title: 'Tembok Diagonal Silang', robotStart: [-2, 0], crystalPos: [2, 0], walls: [[-1, -1], [0, 0], [1, 1]], description: 'Menavigasi pembatas diagonal penghalang radiasi kristal.' },
  { levelNumber: 14, title: 'Pengambilan Kristal Terpencil', robotStart: [2, 2], crystalPos: [-2, -2], walls: [[0, 1], [0, -1], [-1, 0]], description: 'Perjalanan terjauh melintasi seluruh sudut matriks komputasi.' },
  { levelNumber: 15, title: 'Optimasi Langkah Minimum', robotStart: [-2, 1], crystalPos: [2, -1], walls: [[-1, 0], [0, 0], [1, 0]], description: 'Mencari jalur terpendek (Dijkstra shortest path) dengan perintah paling efisien.' },
  { levelNumber: 16, title: 'Jalur Celah Catur', robotStart: [-1, 2], crystalPos: [1, -2], walls: [[-2, 1], [0, 1], [2, 1], [-1, -1], [1, -1]], description: 'Menembus pola rintangan papan catur.' },
  { levelNumber: 17, title: 'Labirin Ruang Hampa', robotStart: [0, 2], crystalPos: [-2, -2], walls: [[-1, 1], [-1, 0], [0, 0]], description: 'Menghindari jebakan sudut mati (dead end trap).' },
  { levelNumber: 18, title: 'Kaidah Tangan Kanan (Wall Follower)', robotStart: [-2, 2], crystalPos: [0, -1], walls: [[-1, 1], [0, 1], [1, 1], [1, 0]], description: 'Menerapkan logika robotika penelusur dinding kanan secara konsisten.' },
  { levelNumber: 19, title: 'Matriks Simetris Ganda', robotStart: [-2, -2], crystalPos: [2, 2], walls: [[-1, -1], [1, 1], [0, 1], [0, -1]], description: 'Penyeimbangan koordinat kartesius maju dan berbelok simetris.' },
  { levelNumber: 20, title: 'Grand Master Algoritma Kuantum', robotStart: [-2, 2], crystalPos: [2, -2], walls: [[-1, 2], [-1, 1], [0, 0], [1, -1], [1, -2]], description: 'Puncak kecerdasan logika pemrograman robotik! Menyelesaikan labirin kuantum paling rumit.' },
];

export class RoboMazeGame {
  public scene: THREE.Scene;
  public camera: THREE.PerspectiveCamera;

  // Level State
  public currentLevelIdx = 0;
  public currentLevelData = CODE_LEVELS[0];

  // Code commands queue
  public commandQueue: string[] = [];
  public isExecuting = false;
  public isLevelFinished = false;

  private robotMesh!: THREE.Group;
  private robotBodyMesh!: THREE.Mesh;
  private energyCrystal!: THREE.Mesh;
  private currentStep = 0;
  private gridX = 0;
  private gridZ = 2;
  // 0: North (-Z), 1: East (+X), 2: South (+Z), 3: West (-X)
  private robotDir = 0;
  private mazeTileMeshes: THREE.Object3D[] = [];
  private execInterval: ReturnType<typeof setInterval> | null = null;

  constructor(initialLevel = 0) {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color('#111827');

    this.camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
    this.camera.position.set(0, 7, 7);
    this.camera.lookAt(new THREE.Vector3(0, 0, 0));

    this.setupLighting();
    this.loadLevel(initialLevel);
  }

  public loadLevel(levelIdx: number) {
    if (this.execInterval) {
      clearInterval(this.execInterval);
      this.execInterval = null;
    }
    this.currentLevelIdx = Math.max(0, Math.min(levelIdx, CODE_LEVELS.length - 1));
    this.currentLevelData = CODE_LEVELS[this.currentLevelIdx];
    this.commandQueue = [];
    this.isExecuting = false;
    this.isLevelFinished = false;

    this.setupMazeGrid();
  }

  private setupLighting() {
    const key = new THREE.DirectionalLight('#60a5fa', 1.8);
    key.position.set(5, 8, 5);
    this.scene.add(key);

    const point = new THREE.PointLight('#38bdf8', 1.5, 10);
    point.position.set(0, 3, 0);
    this.scene.add(point);

    this.scene.add(new THREE.AmbientLight('#1e293b', 0.6));
  }

  private resetRobotPosition() {
    this.gridX = this.currentLevelData.robotStart[0];
    this.gridZ = this.currentLevelData.robotStart[1];
    this.robotDir = 0; // Always starts facing North (-Z)
    if (this.robotMesh) {
      this.robotMesh.position.set(this.gridX, 0.1, this.gridZ);
      this.robotMesh.rotation.y = 0;
    }
    if (this.robotBodyMesh) {
      (this.robotBodyMesh.material as THREE.MeshToonMaterial).color.set('#3b82f6');
    }
  }

  private setupMazeGrid() {
    this.mazeTileMeshes.forEach((t) => this.scene.remove(t));
    this.mazeTileMeshes = [];
    if (this.energyCrystal) this.scene.remove(this.energyCrystal);
    if (this.robotMesh) this.scene.remove(this.robotMesh);

    // Circuit grid lines underneath
    const circuitGrid = new THREE.GridHelper(5.4, 5, '#38bdf8', '#1e293b');
    circuitGrid.position.y = -0.05;
    this.mazeTileMeshes.push(circuitGrid);
    this.scene.add(circuitGrid);

    // 5x5 Maze Grid with tall glowing red laser barriers for walls
    const tileGeo = new THREE.BoxGeometry(0.9, 0.12, 0.9);
    const wallGeo = new THREE.BoxGeometry(0.82, 0.95, 0.82);

    for (let x = -2; x <= 2; x++) {
      for (let z = -2; z <= 2; z++) {
        const isWall = this.currentLevelData.walls.some((w) => w[0] === x && w[1] === z);
        const tileMat = new THREE.MeshStandardMaterial({
          color: isWall ? '#450a0a' : '#1e293b',
          emissive: isWall ? '#ef4444' : '#0284c7',
          emissiveIntensity: isWall ? 0.45 : 0.12,
        });
        const tile = new THREE.Mesh(isWall ? wallGeo : tileGeo, tileMat);
        tile.position.set(x, isWall ? 0.5 : 0, z);
        this.mazeTileMeshes.push(tile);
        this.scene.add(tile);
      }
    }

    // Energy Crystal Target
    const crystalGeo = new THREE.OctahedronGeometry(0.35, 0);
    const crystalMat = new THREE.MeshStandardMaterial({
      color: '#facc15',
      emissive: '#eab308',
      emissiveIntensity: 0.9,
    });
    this.energyCrystal = new THREE.Mesh(crystalGeo, crystalMat);
    this.energyCrystal.position.set(this.currentLevelData.crystalPos[0], 0.6, this.currentLevelData.crystalPos[1]);
    this.scene.add(this.energyCrystal);

    // Chibi Robot with Directional Visor & Front Arrow (facing -Z initially)
    this.robotMesh = new THREE.Group();
    this.robotBodyMesh = new THREE.Mesh(
      new THREE.BoxGeometry(0.46, 0.48, 0.46),
      new THREE.MeshToonMaterial({ color: '#3b82f6' })
    );
    this.robotBodyMesh.position.y = 0.24;

    const visor = new THREE.Mesh(
      new THREE.BoxGeometry(0.34, 0.12, 0.06),
      new THREE.MeshBasicMaterial({ color: '#22d3ee' })
    );
    visor.position.set(0, 0.3, -0.24);

    const dirNose = new THREE.Mesh(
      new THREE.ConeGeometry(0.14, 0.25, 4),
      new THREE.MeshBasicMaterial({ color: '#facc15' })
    );
    dirNose.rotation.x = -Math.PI / 2;
    dirNose.position.set(0, 0.52, -0.18);

    this.robotMesh.add(this.robotBodyMesh, visor, dirNose);
    this.resetRobotPosition();
    this.scene.add(this.robotMesh);
  }

  public addCommand(cmd: string) {
    if (this.isExecuting) return;
    soundManager.playClick();
    this.commandQueue.push(cmd);
  }

  public clearCommands() {
    if (this.execInterval) {
      clearInterval(this.execInterval);
      this.execInterval = null;
    }
    this.isExecuting = false;
    this.commandQueue = [];
    this.resetRobotPosition();
  }

  public executeCode() {
    if (this.isExecuting || this.commandQueue.length === 0) return;
    this.resetRobotPosition();
    this.isExecuting = true;
    this.currentStep = 0;

    this.execInterval = setInterval(() => {
      if (this.currentStep < this.commandQueue.length) {
        soundManager.playFootstep();
        const cmd = this.commandQueue[this.currentStep];

        if (cmd === 'Maju') {
          let nx = this.gridX;
          let nz = this.gridZ;
          if (this.robotDir === 0) nz -= 1;
          else if (this.robotDir === 1) nx += 1;
          else if (this.robotDir === 2) nz += 1;
          else if (this.robotDir === 3) nx -= 1;

          const hitWall = this.currentLevelData.walls.some((w) => w[0] === nx && w[1] === nz);
          const outOfBounds = nx < -2 || nx > 2 || nz < -2 || nz > 2;

          if (hitWall || outOfBounds) {
            // Crash into wall or void boundary!
            soundManager.playError();
            if (this.robotBodyMesh) {
              (this.robotBodyMesh.material as THREE.MeshToonMaterial).color.set('#ef4444');
            }
            if (this.execInterval) {
              clearInterval(this.execInterval);
              this.execInterval = null;
            }
            setTimeout(() => {
              this.isExecuting = false;
              this.resetRobotPosition();
            }, 500);
            return;
          }

          this.gridX = nx;
          this.gridZ = nz;
          this.robotMesh.position.set(this.gridX, 0.1, this.gridZ);
        } else if (cmd === 'Kiri') {
          this.robotDir = (this.robotDir + 3) % 4;
          this.robotMesh.rotation.y = -this.robotDir * (Math.PI / 2);
        } else if (cmd === 'Kanan') {
          this.robotDir = (this.robotDir + 1) % 4;
          this.robotMesh.rotation.y = -this.robotDir * (Math.PI / 2);
        }

        this.currentStep++;

        // Win immediately upon stepping onto Crystal tile!
        if (
          this.gridX === this.currentLevelData.crystalPos[0] &&
          this.gridZ === this.currentLevelData.crystalPos[1] &&
          !this.isLevelFinished
        ) {
          if (this.execInterval) {
            clearInterval(this.execInterval);
            this.execInterval = null;
          }
          this.isExecuting = false;
          this.isLevelFinished = true;
          soundManager.playCorrect();
          soundManager.playLevelVictory();
        }
      } else {
        if (this.execInterval) {
          clearInterval(this.execInterval);
          this.execInterval = null;
        }
        this.isExecuting = false;

        if (
          this.gridX === this.currentLevelData.crystalPos[0] &&
          this.gridZ === this.currentLevelData.crystalPos[1] &&
          !this.isLevelFinished
        ) {
          this.isLevelFinished = true;
          soundManager.playCorrect();
          soundManager.playLevelVictory();
        } else if (!this.isLevelFinished) {
          soundManager.playError();
        }
      }
    }, 420);
  }

  public update(delta: number, _cameraMode: CameraPerspective = 'tpp') {
    this.energyCrystal.rotation.y += delta * 1.5;
  }
}
