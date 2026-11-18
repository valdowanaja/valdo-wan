/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as THREE from 'three';
import { AnimeCharacterModel } from '../../characters/AnimeCharacterModel';
import { createNumberBlockTexture } from '../../core/ProceduralTextures';
import { inputManager } from '../../core/InputManager';
import { soundManager } from '../../audio/SoundSynthesizer';

export interface MathLevelData {
  levelNumber: number;
  title: string;
  topic: string;
  instruction: string;
  equationDisplay: string;
  slotsCount: number;
  availableBlocks: string[]; // e.g. ['3', '5', '7']
  checkSolution: (placed: string[]) => boolean;
  explanation: string;
  hint: string;
}

export const MATH_LEVELS: MathLevelData[] = [
  {
    levelNumber: 1,
    title: 'Penjumlahan Awal',
    topic: 'Penjumlahan Dasar',
    instruction: 'Lengkapi persamaan jembatan agar bernilai 9!',
    equationDisplay: '4  +  [ ? ]  =  9',
    slotsCount: 1,
    availableBlocks: ['3', '5', '7'],
    checkSolution: (placed) => placed[0] === '5',
    explanation: '4 + 5 = 9. Jika kamu memiliki 4 balok dan menambahkan 5 balok lagi, totalnya pas menjadi 9.',
    hint: 'Berapakah selisih antara 9 dan 4? Cobalah 9 dikurangi 4.',
  },
  {
    levelNumber: 2,
    title: 'Gerbang Pengurangan',
    topic: 'Pengurangan',
    instruction: 'Cari angka yang tepat agar hasil pengurangannya adalah 8!',
    equationDisplay: '15  -  [ ? ]  =  8',
    slotsCount: 1,
    availableBlocks: ['6', '7', '9'],
    checkSolution: (placed) => placed[0] === '7',
    explanation: '15 - 7 = 8. Pengurangan adalah kebalikan dari penjumlahan (8 + 7 = 15).',
    hint: 'Jika kamu punya 15 buah kelereng dan tersisa 8, berapa yang hilang?',
  },
  {
    levelNumber: 3,
    title: 'Jembatan Ganda',
    topic: 'Pasangan Angka',
    instruction: 'Pilih dua balok yang bila dijumlahkan bernilai 12!',
    equationDisplay: '[ ? ]  +  [ ? ]  =  12',
    slotsCount: 2,
    availableBlocks: ['2', '5', '7', '9'],
    checkSolution: (placed) => {
      const sum = placed.reduce((a, b) => a + Number(b), 0);
      return sum === 12;
    },
    explanation: '5 + 7 = 12. Pasangan angka komplementer ini membentuk struktur jembatan yang kokoh.',
    hint: 'Cari angka ganjil yang jika dijumlahkan menghasilkan angka genap 12.',
  },
  {
    levelNumber: 4,
    title: 'Tangga Perkalian',
    topic: 'Perkalian Dasar',
    instruction: 'Isi faktor pengali agar menghasilkan kelipatan 42!',
    equationDisplay: '6  ×  [ ? ]  =  42',
    slotsCount: 1,
    availableBlocks: ['5', '6', '7', '8'],
    checkSolution: (placed) => placed[0] === '7',
    explanation: '6 × 7 = 42. Perkalian adalah penjumlahan berulang angka 6 sebanyak 7 kali.',
    hint: 'Ingat tabel perkalian 6: 6 × 6 = 36, jadi satu langkah lebih tinggi adalah...',
  },
  {
    levelNumber: 5,
    title: 'Menara Pembagian',
    topic: 'Pembagian & Rasio',
    instruction: 'Angka berapakah yang bila dibagi 4 menghasilkan 8?',
    equationDisplay: '[ ? ]  ÷  4  =  8',
    slotsCount: 1,
    availableBlocks: ['24', '28', '32'],
    checkSolution: (placed) => placed[0] === '32',
    explanation: '32 ÷ 4 = 8, karena 8 × 4 = 32. Pembagian membagi suatu nilai ke dalam kelompok sama rata.',
    hint: 'Kalikan hasil bagi (8) dengan pembagi (4) untuk menemukan angka awal.',
  },
  {
    levelNumber: 6,
    title: 'Pola Kristal Geometri',
    topic: 'Barisan Bilangan',
    instruction: 'Temukan angka lanjutan dari pola berlipat ganda ini!',
    equationDisplay: '3,  6,  12,  [ ? ],  48',
    slotsCount: 1,
    availableBlocks: ['18', '20', '24'],
    checkSolution: (placed) => placed[0] === '24',
    explanation: 'Tiap angka dikalikan 2 (rasio geometri ×2). 3 × 2 = 6, 6 × 2 = 12, 12 × 2 = 24, 24 × 2 = 48.',
    hint: 'Perhatikan hubungan antara 3 ke 6 dan 6 ke 12. Angka selalu dilipatduakan!',
  },
  {
    levelNumber: 7,
    title: 'Pecahan Jembatan Kristal',
    topic: 'Pecahan Berpenyebut Sama',
    instruction: 'Lengkapi penjumlahan pecahan sederhana!',
    equationDisplay: '1/4  +  [ ? ]  =  3/4',
    slotsCount: 1,
    availableBlocks: ['1/4', '2/4', '3/4'],
    checkSolution: (placed) => placed[0] === '2/4',
    explanation: '1/4 + 2/4 = 3/4. Karena penyebutnya sama-sama 4, kita cukup menjumlahkan pembilangnya: 1 + 2 = 3.',
    hint: 'Berapa banyak per-empat yang harus ditambahkan ke satu per-empat untuk mendapat tiga per-empat?',
  },
  {
    levelNumber: 8,
    title: 'Kombinasi Hitung Kastil',
    topic: 'Operasi Campuran',
    instruction: 'Hitung dalam kurung terlebih dahulu, lalu kurangi!',
    equationDisplay: '(5  ×  4)  -  [ ? ]  =  13',
    slotsCount: 1,
    availableBlocks: ['5', '6', '7', '8'],
    checkSolution: (placed) => placed[0] === '7',
    explanation: '(5 × 4) = 20. Kemudian 20 - 7 = 13. Aturan kabataku mengutamakan operasi di dalam tanda kurung.',
    hint: 'Selesaikan 5 × 4 dulu yaitu 20. Lalu hitung 20 dikurangi berapa agar jadi 13.',
  },
  {
    levelNumber: 9,
    title: 'Persamaan Aljabar Kuno',
    topic: 'Variabel Aljabar',
    instruction: 'Jika 2x + 3 = 17, berapakah nilai x?',
    equationDisplay: '2x  +  3  =  17  →  x  =  [ ? ]',
    slotsCount: 1,
    availableBlocks: ['5', '6', '7', '8'],
    checkSolution: (placed) => placed[0] === '7',
    explanation: '2x = 17 - 3 = 14. Maka x = 14 ÷ 2 = 7. Kita mengisolasi variabel x dengan langkah seimbang.',
    hint: 'Kurangi 17 dengan 3 terlebih dahulu, lalu bagi hasilnya dengan 2.',
  },
  {
    levelNumber: 10,
    title: 'Bos Kastil: Neraca Harmoni',
    topic: 'Sistem Persamaan Linier',
    instruction: 'Dua angka berjumlah 20 dan memiliki selisih 4. Pasang kedua angka!',
    equationDisplay: '[ ? ]  +  [ ? ]  =  20  &  Selisih = 4',
    slotsCount: 2,
    availableBlocks: ['8', '10', '12', '14'],
    checkSolution: (placed) => {
      const nums = placed.map(Number);
      return nums.includes(12) && nums.includes(8);
    },
    explanation: '12 + 8 = 20, dan 12 - 8 = 4! Kedua kondisi terpenuhi sempurna, membuka pintu takhta Raja Angka!',
    hint: 'Cari dua angka yang selisihnya tepat 4 dan jika dijumlahkan bernilai 20.',
  },
  {
    levelNumber: 11,
    title: 'Akar & Kuadrat Kristal',
    topic: 'Perpangkatan & Penarikan Akar',
    instruction: 'Jika x² = 64, berapakah nilai x positif?',
    equationDisplay: 'x²  =  64  →  x  =  [ ? ]',
    slotsCount: 1,
    availableBlocks: ['6', '7', '8', '9'],
    checkSolution: (placed) => placed[0] === '8',
    explanation: '8 × 8 = 64. Akar kuadrat dari 64 adalah 8.',
    hint: 'Bilangan kuadrat berapa yang dikalikan dengan dirinya sendiri bernilai 64?',
  },
  {
    levelNumber: 12,
    title: 'Faktorisasi Prima Menara',
    topic: 'Teori Bilangan Prima',
    instruction: 'Faktorisasi prima dari 42 adalah 2 × 3 × [ ? ]!',
    equationDisplay: '2  ×  3  ×  [ ? ]  =  42',
    slotsCount: 1,
    availableBlocks: ['5', '7', '11', '13'],
    checkSolution: (placed) => placed[0] === '7',
    explanation: '2 × 3 = 6, dan 6 × 7 = 42. Bilangan 7 adalah bilangan prima penutup faktorisasi.',
    hint: 'Bagi 42 dengan 6 (hasil dari 2 × 3).',
  },
  {
    levelNumber: 13,
    title: 'Rasio & Proporsi Emas',
    topic: 'Perbandingan Senilai',
    instruction: 'Lengkapi proporsi senilai: 4 : 7 = 16 : [ ? ]!',
    equationDisplay: '4 / 7  =  16 / [ ? ]',
    slotsCount: 1,
    availableBlocks: ['21', '24', '28', '32'],
    checkSolution: (placed) => placed[0] === '28',
    explanation: 'Pembilang dikalikan 4 (4 × 4 = 16), maka penyebut juga dikalikan 4 (7 × 4 = 28).',
    hint: 'Perhatikan bahwa 16 adalah 4 kali lipat dari 4. Kalikan angka 7 dengan 4.',
  },
  {
    levelNumber: 14,
    title: 'Jurang Bilangan Negatif',
    topic: 'Aritmatika Bilangan Bulat',
    instruction: 'Selesaikan persamaan: (-8) + [ ? ] = 7!',
    equationDisplay: '(-8)  +  [ ? ]  =  7',
    slotsCount: 1,
    availableBlocks: ['12', '14', '15', '16'],
    checkSolution: (placed) => placed[0] === '15',
    explanation: '(-8) + 15 = 7. Melangkah 15 satuan ke kanan dari titik -8 pada garis bilangan mendarat di 7.',
    hint: 'Untuk menemukan balok, hitung 7 dikurangi (-8) = 7 + 8.',
  },
  {
    levelNumber: 15,
    title: 'Kristal Persentase',
    topic: 'Persentase & Nilai Pecahan',
    instruction: 'Hitung nilai 20% dari 150!',
    equationDisplay: '20%  dari  150  =  [ ? ]',
    slotsCount: 1,
    availableBlocks: ['25', '30', '35', '40'],
    checkSolution: (placed) => placed[0] === '30',
    explanation: '20% = 0.2 atau 1/5. 150 ÷ 5 = 30.',
    hint: 'Bagi 150 dengan 10 (didapat 15), lalu kalikan 2.',
  },
  {
    levelNumber: 16,
    title: 'Urutan Fibonacci Alam',
    topic: 'Pola Barisan Fibonacci',
    instruction: 'Temukan suku berikutnya pada barisan: 2, 3, 5, 8, 13, [ ? ]!',
    equationDisplay: '2, 3, 5, 8, 13, [ ? ]',
    slotsCount: 1,
    availableBlocks: ['18', '20', '21', '24'],
    checkSolution: (placed) => placed[0] === '21',
    explanation: 'Tiap suku adalah jumlah dua suku sebelumnya: 8 + 13 = 21.',
    hint: 'Jumlahkan dua bilangan terakhir (8 dan 13).',
  },
  {
    levelNumber: 17,
    title: 'Sisa Pembagian Modulo',
    topic: 'Aritmatika Modular',
    instruction: 'Berapakah sisa dari 53 dibagi 8 (53 mod 8)?',
    equationDisplay: '53  mod  8  =  [ ? ]',
    slotsCount: 1,
    availableBlocks: ['3', '4', '5', '6'],
    checkSolution: (placed) => placed[0] === '5',
    explanation: '8 × 6 = 48. Sisa pembagiannya adalah 53 - 48 = 5.',
    hint: 'Kelipatan 8 terdekat di bawah 53 adalah 48. Berapa selisihnya?',
  },
  {
    levelNumber: 18,
    title: 'Sudut Segitiga Euklides',
    topic: 'Geometri Sudut Bidang',
    instruction: 'Jumlah sudut segitiga adalah 180°. Jika A=50° dan B=65°, berapa C?',
    equationDisplay: '50°  +  65°  +  [ ? ]°  =  180°',
    slotsCount: 1,
    availableBlocks: ['55', '60', '65', '70'],
    checkSolution: (placed) => placed[0] === '65',
    explanation: '50° + 65° = 115°. 180° - 115° = 65°.',
    hint: 'Kurangkan 180 dengan 115.',
  },
  {
    levelNumber: 19,
    title: 'Logaritma Biner Kastil',
    topic: 'Fungsi Logaritma',
    instruction: 'Jika 2ⁿ = 32, berapakah nilai n (log₂ 32)?',
    equationDisplay: 'log₂ (32)  =  [ ? ]',
    slotsCount: 1,
    availableBlocks: ['3', '4', '5', '6'],
    checkSolution: (placed) => placed[0] === '5',
    explanation: '2⁵ = 2 × 2 × 2 × 2 × 2 = 32. Maka nilai log₂ 32 adalah 5.',
    hint: 'Berapa kali angka 2 harus dikalikan berulang agar menjadi 32?',
  },
  {
    levelNumber: 20,
    title: 'Bos Agung: Teorema Pythagoras Kuno',
    topic: 'Teorema Geometri Segitiga Siku-Siku',
    instruction: 'Pada segitiga siku-siku dengan sisi 6 dan 8, hitung sisi miring c (c² = 6² + 8²)!',
    equationDisplay: '6²  +  8²  =  c²  →  c  =  [ ? ]',
    slotsCount: 1,
    availableBlocks: ['9', '10', '12', '14'],
    checkSolution: (placed) => placed[0] === '10',
    explanation: '6² = 36, 8² = 64. 36 + 64 = 100. Akar dari 100 adalah 10. Selamat, kamu Master Matematika Kastil!',
    hint: 'Hitung 36 + 64 = 100, lalu cari akar dari 100.',
  },
];

export class MathCastleGame {
  public scene: THREE.Scene;
  public camera: THREE.PerspectiveCamera;
  public playerModel: AnimeCharacterModel;

  // Level State
  public currentLevelIdx = 0;
  public currentLevelData!: MathLevelData;
  public placedBlocks: (string | null)[] = [];
  public carriedBlock: { value: string; mesh: THREE.Mesh } | null = null;
  public isBridgeOpen = false;
  public isLevelFinished = false;

  // 3D Objects
  private blocksInWorld: Array<{ value: string; mesh: THREE.Mesh; homePos: THREE.Vector3 }> = [];
  private socketMeshes: THREE.Mesh[] = [];
  private bridgeSlabs: THREE.Mesh[] = [];
  private castleGateLeft!: THREE.Mesh;
  private castleGateRight!: THREE.Mesh;
  private chandelierGroup!: THREE.Group;
  private moatRings: THREE.Mesh[] = [];
  private errorFlashTimer = 0;

  // Interaction prompt helper
  public interactionPrompt: string | null = null;

  // Player position & physics
  public playerPosition = new THREE.Vector3(0, 0, 7);
  public playerRotation = 0;
  private playerVelocityY = 0;
  private isGrounded = true;

  // Scratch vectors to avoid per-frame allocations
  private readonly _fwd = new THREE.Vector3();
  private readonly _right = new THREE.Vector3();
  private readonly _moveDir = new THREE.Vector3();
  private readonly _upAxis = new THREE.Vector3(0, 1, 0);
  private readonly _carryVec = new THREE.Vector3();
  private readonly _desiredCam = new THREE.Vector3();
  private readonly _camTarget = new THREE.Vector3();

  // Camera Orbit & Look
  public cameraYaw = 0;
  public cameraPitch = 0.35;
  public cameraDistance = 6.2;

  constructor(playerModel: AnimeCharacterModel, initialLevel = 0) {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color('#381b4d');
    this.scene.fog = new THREE.FogExp2('#381b4d', 0.02);

    this.camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 200);
    this.camera.position.set(0, 4.5, 13);

    this.playerModel = playerModel;
    this.scene.add(this.playerModel.group);

    // Add luminous ground ring under player in math game
    const ringGeo = new THREE.RingGeometry(0.35, 0.45, 32);
    const ringMat = new THREE.MeshBasicMaterial({
      color: '#ec4899',
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.75,
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = 0.03;
    this.playerModel.group.add(ring);

    this.setupLighting();
    this.setupEnvironment();
    this.setupCastleStructures();

    this.loadLevel(initialLevel);
  }

  private setupLighting() {
    const sunLight = new THREE.DirectionalLight('#fed7aa', 1.8);
    sunLight.position.set(10, 25, 15);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 1024;
    sunLight.shadow.mapSize.height = 1024;
    this.scene.add(sunLight);

    const hemi = new THREE.HemisphereLight('#f472b6', '#4a154b', 0.9);
    this.scene.add(hemi);

    const ambient = new THREE.AmbientLight('#a855f7', 0.45);
    this.scene.add(ambient);
  }

  private setupEnvironment() {
    // Pastel Dawn Sky Dome
    const skyGeo = new THREE.SphereGeometry(140, 24, 16);
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d')!;
    const grad = ctx.createLinearGradient(0, 0, 0, 256);
    grad.addColorStop(0, '#2d123d');
    grad.addColorStop(0.5, '#701a75');
    grad.addColorStop(0.85, '#ec4899');
    grad.addColorStop(1, '#fde047');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 256, 256);

    const skyTex = new THREE.CanvasTexture(canvas);
    const skyMat = new THREE.MeshBasicMaterial({ map: skyTex, side: THREE.BackSide });
    this.scene.add(new THREE.Mesh(skyGeo, skyMat));

    // Arcane Moat Rings hovering in the chasm below
    for (let i = 0; i < 3; i++) {
      const mRing = new THREE.Mesh(
        new THREE.TorusGeometry(6 + i * 3.5, 0.08, 8, 48),
        new THREE.MeshBasicMaterial({
          color: i % 2 === 0 ? '#ec4899' : '#a855f7',
          transparent: true,
          opacity: 0.35,
        })
      );
      mRing.rotation.x = Math.PI / 2;
      mRing.position.set(0, -3.8 - i * 0.6, -2.5);
      this.moatRings.push(mRing);
      this.scene.add(mRing);
    }
  }

  private setupCastleStructures() {
    // 1. Player Platform (Starting terrace)
    const startPlatformGeo = new THREE.CylinderGeometry(8, 7.5, 2, 24);
    const platformMat = new THREE.MeshToonMaterial({ color: '#fbcfe8' });
    const startPlatform = new THREE.Mesh(startPlatformGeo, platformMat);
    startPlatform.position.set(0, -1, 7);
    startPlatform.receiveShadow = true;
    this.scene.add(startPlatform);

    // Decorative gold rim on starting platform
    const startRim = new THREE.Mesh(
      new THREE.TorusGeometry(8.05, 0.12, 8, 48),
      new THREE.MeshStandardMaterial({ color: '#facc15', emissive: '#f59e0b', emissiveIntensity: 0.4, metalness: 0.7 })
    );
    startRim.rotation.x = Math.PI / 2;
    startRim.position.set(0, 0, 7);
    this.scene.add(startRim);

    // 2. Castle Platform (Destination)
    const castlePlatformGeo = new THREE.CylinderGeometry(11, 10, 2.5, 24);
    const castlePlatform = new THREE.Mesh(castlePlatformGeo, platformMat);
    castlePlatform.position.set(0, -1, -12);
    castlePlatform.receiveShadow = true;
    this.scene.add(castlePlatform);

    // Castle Back Wall & Towers
    const wallMat = new THREE.MeshToonMaterial({ color: '#f472b6' });
    const towerMat = new THREE.MeshToonMaterial({ color: '#e879f9' });
    const roofMat = new THREE.MeshToonMaterial({ color: '#8b5cf6' });

    // Main Gate Frame
    const gateFrameGeo = new THREE.BoxGeometry(10, 6, 2);
    const gateFrame = new THREE.Mesh(gateFrameGeo, wallMat);
    gateFrame.position.set(0, 3, -16);
    gateFrame.castShadow = true;
    this.scene.add(gateFrame);

    // Stained-Glass Windows flanking the Castle Gate
    const glassMat = new THREE.MeshBasicMaterial({ color: '#fde047', transparent: true, opacity: 0.85 });
    [-3.6, 3.6].forEach((wx) => {
      const win = new THREE.Mesh(new THREE.BoxGeometry(1.1, 2.4, 0.12), glassMat);
      win.position.set(wx, 3.6, -14.95);
      this.scene.add(win);
    });

    // Castle Gate Doors (Left and Right swing)
    const doorGeo = new THREE.BoxGeometry(2.2, 4.5, 0.4);
    const doorMat = new THREE.MeshStandardMaterial({ color: '#a21caf', roughness: 0.4 });
    this.castleGateLeft = new THREE.Mesh(doorGeo, doorMat);
    this.castleGateLeft.position.set(-1.1, 2.25, -15);
    this.castleGateRight = new THREE.Mesh(doorGeo, doorMat);
    this.castleGateRight.position.set(1.1, 2.25, -15);
    this.scene.add(this.castleGateLeft, this.castleGateRight);

    // Flanking Castle Towers
    [-5.5, 5.5].forEach((tx) => {
      const tower = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 1.8, 9, 16), towerMat);
      tower.position.set(tx, 4.5, -16);
      tower.castShadow = true;

      const cone = new THREE.Mesh(new THREE.ConeGeometry(2.1, 3.5, 16), roofMat);
      cone.position.set(tx, 10.5, -16);
      cone.castShadow = true;

      this.scene.add(tower, cone);
    });

    // Floating Chandelier Crystal hovering over the bridge axis
    this.chandelierGroup = new THREE.Group();
    this.chandelierGroup.position.set(0, 6.2, -5.5);
    const crystal = new THREE.Mesh(
      new THREE.OctahedronGeometry(0.95, 0),
      new THREE.MeshStandardMaterial({ color: '#38bdf8', emissive: '#0ea5e9', emissiveIntensity: 0.9, roughness: 0.15 })
    );
    const halo = new THREE.Mesh(
      new THREE.TorusGeometry(1.4, 0.06, 8, 32),
      new THREE.MeshBasicMaterial({ color: '#facc15' })
    );
    halo.rotation.x = Math.PI / 2;
    this.chandelierGroup.add(crystal, halo);
    this.scene.add(this.chandelierGroup);

    // 3. Floating Bridge Slabs (initially submerged below chasm)
    for (let i = 0; i < 4; i++) {
      const slabGeo = new THREE.BoxGeometry(3.6, 0.4, 3.2);
      const slabMat = new THREE.MeshStandardMaterial({
        color: '#fdf2f8',
        emissive: '#ec4899',
        emissiveIntensity: 0.15,
        roughness: 0.3,
      });
      const slab = new THREE.Mesh(slabGeo, slabMat);
      slab.position.set(0, -6, 2.5 - i * 3.5);
      slab.receiveShadow = true;
      this.bridgeSlabs.push(slab);
      this.scene.add(slab);
    }
  }

  public loadLevel(levelIndex: number) {
    this.currentLevelIdx = levelIndex % MATH_LEVELS.length;
    this.currentLevelData = MATH_LEVELS[this.currentLevelIdx];
    this.isBridgeOpen = false;
    this.isLevelFinished = false;
    this.errorFlashTimer = 0;
    this.placedBlocks = new Array(this.currentLevelData.slotsCount).fill(null);
    this.carriedBlock = null;

    // Reset player position
    this.playerPosition.set(0, 0, 7);
    this.playerRotation = Math.PI; // Face castle

    // Reset Bridge slabs
    this.bridgeSlabs.forEach((slab) => {
      slab.position.y = -6;
    });

    // Reset Castle Doors
    this.castleGateLeft.rotation.y = 0;
    this.castleGateRight.rotation.y = 0;

    // Clear old blocks & sockets
    this.blocksInWorld.forEach((b) => this.scene.remove(b.mesh));
    this.blocksInWorld = [];
    this.socketMeshes.forEach((s) => this.scene.remove(s));
    this.socketMeshes = [];

    // Create Bridge Sockets near the edge (Z ≈ 3)
    const slotSpacing = 2.0;
    const startX = -((this.currentLevelData.slotsCount - 1) * slotSpacing) / 2;

    for (let i = 0; i < this.currentLevelData.slotsCount; i++) {
      const socketGeo = new THREE.BoxGeometry(1.4, 0.15, 1.4);
      const socketMat = new THREE.MeshStandardMaterial({
        color: '#fbcfe8',
        emissive: '#ec4899',
        emissiveIntensity: 0.4,
        roughness: 0.3,
      });
      const socket = new THREE.Mesh(socketGeo, socketMat);
      socket.position.set(startX + i * slotSpacing, 0.08, 3.2);
      socket.receiveShadow = true;
      this.socketMeshes.push(socket);
      this.scene.add(socket);
    }

    // Spawn Pickable Number Blocks on the platform
    const blockValues = this.currentLevelData.availableBlocks;
    const bSpacing = 1.8;
    const bStartX = -((blockValues.length - 1) * bSpacing) / 2;

    blockValues.forEach((val, idx) => {
      const blockTex = createNumberBlockTexture(val, '#ec4899');
      const blockGeo = new THREE.BoxGeometry(1.1, 1.1, 1.1);
      const blockMat = new THREE.MeshStandardMaterial({
        map: blockTex,
        roughness: 0.3,
        metalness: 0.1,
      });
      const blockMesh = new THREE.Mesh(blockGeo, blockMat);
      const pos = new THREE.Vector3(bStartX + idx * bSpacing, 0.55, 9.2);
      blockMesh.position.copy(pos);
      blockMesh.castShadow = true;
      this.scene.add(blockMesh);

      this.blocksInWorld.push({
        value: val,
        mesh: blockMesh,
        homePos: pos.clone(),
      });
    });
  }

  public handleInteractAction() {
    // 1. If currently carrying a block -> try to place it in nearest empty socket
    if (this.carriedBlock) {
      let nearestSocketIdx = -1;
      let minDist = 2.4;

      this.socketMeshes.forEach((sock, idx) => {
        const d = this.playerPosition.distanceTo(sock.position);
        if (d < minDist && this.placedBlocks[idx] === null) {
          minDist = d;
          nearestSocketIdx = idx;
        }
      });

      if (nearestSocketIdx !== -1) {
        soundManager.playPickup();
        const sockPos = this.socketMeshes[nearestSocketIdx].position;
        this.carriedBlock.mesh.position.set(sockPos.x, 0.65, sockPos.z);
        this.carriedBlock.mesh.scale.set(1, 1, 1);

        this.placedBlocks[nearestSocketIdx] = this.carriedBlock.value;
        this.carriedBlock = null;

        this.validateCurrentFormula();
        return;
      } else {
        // Drop block beside player cleanly
        this.carriedBlock.mesh.position.set(this.playerPosition.x + 1.1, 0.55, this.playerPosition.z);
        this.carriedBlock.mesh.scale.set(1, 1, 1);
        this.carriedBlock = null;
        return;
      }
    }

    // 2. Not carrying -> try to pick up nearest block in world OR retrieve from socket
    let nearestBlock: { value: string; mesh: THREE.Mesh; homePos: THREE.Vector3 } | null = null;
    let minBlockDist = 2.4;

    this.blocksInWorld.forEach((b) => {
      const d = this.playerPosition.distanceTo(b.mesh.position);
      if (d < minBlockDist) {
        minBlockDist = d;
        nearestBlock = b;
      }
    });

    if (nearestBlock) {
      soundManager.playPickup();
      const nb = nearestBlock as { value: string; mesh: THREE.Mesh; homePos: THREE.Vector3 };
      const inSocketIdx = this.placedBlocks.indexOf(nb.value);
      if (inSocketIdx !== -1) {
        this.placedBlocks[inSocketIdx] = null;
      }

      this.carriedBlock = { value: nb.value, mesh: nb.mesh };
    }
  }

  private validateCurrentFormula() {
    const allFilled = this.placedBlocks.every((b) => b !== null);
    if (!allFilled) return;

    const placedValues = this.placedBlocks as string[];
    const isValid = this.currentLevelData.checkSolution(placedValues);

    if (isValid) {
      soundManager.playCorrect();
      this.isBridgeOpen = true;
    } else {
      soundManager.playError();
      this.errorFlashTimer = 0.65;
      this.socketMeshes.forEach((sock) => {
        (sock.material as THREE.MeshStandardMaterial).emissive.set('#ef4444');
        (sock.material as THREE.MeshStandardMaterial).emissiveIntensity = 1.2;
      });
      setTimeout(() => {
        this.placedBlocks.forEach((val) => {
          if (!val) return;
          const block = this.blocksInWorld.find((b) => b.value === val);
          if (block) {
            block.mesh.position.copy(block.homePos);
          }
        });
        this.placedBlocks.fill(null);
      }, 700);
    }
  }

  private resolveCollisions() {
    const playerRadius = 0.48;

    // 1. Solid blocks resting on ground (cannot walk straight through blocks)
    this.blocksInWorld.forEach((b) => {
      if (this.carriedBlock && this.carriedBlock.mesh === b.mesh) return;
      if (b.mesh.position.y > 0.6) return;
      const dx = this.playerPosition.x - b.mesh.position.x;
      const dz = this.playerPosition.z - b.mesh.position.z;
      const dist = Math.hypot(dx, dz);
      const minSep = playerRadius + 0.62;
      if (dist < minSep) {
        if (dist > 0.001) {
          this.playerPosition.x = b.mesh.position.x + (dx / dist) * minSep;
          this.playerPosition.z = b.mesh.position.z + (dz / dist) * minSep;
        } else {
          this.playerPosition.z += minSep;
        }
      }
    });

    // 2. Flanking Castle Towers (-5.5, -16) & (5.5, -16)
    [-5.5, 5.5].forEach((tx) => {
      const dx = this.playerPosition.x - tx;
      const dz = this.playerPosition.z - (-16);
      const dist = Math.hypot(dx, dz);
      const minSep = playerRadius + 1.85;
      if (dist < minSep && dist > 0.001) {
        this.playerPosition.x = tx + (dx / dist) * minSep;
        this.playerPosition.z = -16 + (dz / dist) * minSep;
      }
    });

    // 3. Castle Gate Wall & Closed Doors
    if (!this.isBridgeOpen) {
      // Constrain to start platform circle (center 0,7 radius 7.5)
      const dx = this.playerPosition.x;
      const dz = this.playerPosition.z - 7;
      const d = Math.hypot(dx, dz);
      if (d > 7.45) {
        const f = 7.45 / d;
        this.playerPosition.x = dx * f;
        this.playerPosition.z = 7 + dz * f;
      }
    } else {
      // Walkable zones: Start terrace, bridge strip, or castle terrace
      if (this.playerPosition.z > 2.4) {
        const dx = this.playerPosition.x;
        const dz = this.playerPosition.z - 7;
        const d = Math.hypot(dx, dz);
        if (d > 7.5 && Math.abs(this.playerPosition.x) > 1.7) {
          const f = 7.5 / d;
          this.playerPosition.x = dx * f;
          this.playerPosition.z = 7 + dz * f;
        }
      } else if (this.playerPosition.z >= -2.0) {
        this.playerPosition.x = THREE.MathUtils.clamp(this.playerPosition.x, -1.65, 1.65);
      } else {
        const dx = this.playerPosition.x;
        const dz = this.playerPosition.z - (-12);
        const d = Math.hypot(dx, dz);
        if (d > 10.2) {
          const f = 10.2 / d;
          this.playerPosition.x = dx * f;
          this.playerPosition.z = -12 + dz * f;
        }
      }

      // Castle wall barrier outside doorway
      if (this.playerPosition.z < -14.2 && Math.abs(this.playerPosition.x) > 1.85) {
        this.playerPosition.z = -14.2;
      }
    }
  }

  public update(delta: number) {
    // 0. Mouse drag camera orbit & zoom
    const { dx, dy } = inputManager.consumePointerDelta();
    const zoom = inputManager.consumeZoomDelta();

    if (Math.abs(dx) > 0.001 || Math.abs(dy) > 0.001) {
      this.cameraYaw -= dx * 0.0045;
      this.cameraPitch = THREE.MathUtils.clamp(this.cameraPitch + dy * 0.0035, 0.05, 1.25);
    }

    if (Math.abs(zoom) > 0.001) {
      this.cameraDistance = THREE.MathUtils.clamp(this.cameraDistance + zoom * 0.6, 3.2, 12.0);
    }

    // Visual animations (chandelier, moat rings, error flash restore)
    if (this.chandelierGroup) {
      this.chandelierGroup.rotation.y += delta * 0.8;
      this.chandelierGroup.position.y = 6.2 + Math.sin(performance.now() * 0.002) * 0.25;
    }
    this.moatRings.forEach((mr, i) => {
      mr.rotation.z += delta * (i % 2 === 0 ? 0.35 : -0.25);
    });
    if (this.errorFlashTimer > 0) {
      this.errorFlashTimer -= delta;
      if (this.errorFlashTimer <= 0) {
        this.socketMeshes.forEach((sock) => {
          (sock.material as THREE.MeshStandardMaterial).emissive.set('#ec4899');
          (sock.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.4;
        });
      }
    }

    // 1. Movement logic relative to camera view
    const move = inputManager.getMovementVector();
    const moveSpeed = 6.2;

    if (move.isMoving) {
      this._fwd.set(-Math.sin(this.cameraYaw), 0, -Math.cos(this.cameraYaw));
      this._right.set(Math.cos(this.cameraYaw), 0, -Math.sin(this.cameraYaw));

      this._moveDir
        .set(0, 0, 0)
        .addScaledVector(this._right, move.x)
        .addScaledVector(this._fwd, move.z)
        .normalize();

      this.playerPosition.addScaledVector(this._moveDir, moveSpeed * delta);

      const targetAngle = Math.atan2(this._moveDir.x, this._moveDir.z);
      let diff = targetAngle - this.playerRotation;
      while (diff < -Math.PI) diff += Math.PI * 2;
      while (diff > Math.PI) diff -= Math.PI * 2;
      this.playerRotation += diff * Math.min(delta * 14, 1.0);
    }

    // Resolve platform, block & tower collisions smoothly
    this.resolveCollisions();

    // Jumping
    if (inputManager.isJumping() && this.isGrounded) {
      this.playerVelocityY = 7.0;
      this.isGrounded = false;
    }

    if (!this.isGrounded) {
      this.playerVelocityY -= 18.0 * delta;
      this.playerPosition.y += this.playerVelocityY * delta;
      if (this.playerPosition.y <= 0) {
        this.playerPosition.y = 0;
        this.playerVelocityY = 0;
        this.isGrounded = true;
      }
    }

    this.playerModel.group.position.copy(this.playerPosition);
    this.playerModel.group.rotation.y = this.playerRotation;
    this.playerModel.update(delta, move.isMoving, !this.isGrounded, this.isLevelFinished);

    // 2. Carried block floating in front of player
    if (this.carriedBlock) {
      this._carryVec.set(0, 1.4, 0.75).applyAxisAngle(this._upAxis, this.playerRotation);
      this.carriedBlock.mesh.position.copy(this.playerPosition).add(this._carryVec);
      this.carriedBlock.mesh.rotation.y = this.playerRotation;
    }

    // 3. Animate Bridge Rising if open
    if (this.isBridgeOpen) {
      this.bridgeSlabs.forEach((slab) => {
        slab.position.y = THREE.MathUtils.damp(slab.position.y, 0, 4.0, delta);
      });

      this.castleGateLeft.rotation.y = THREE.MathUtils.damp(this.castleGateLeft.rotation.y, -Math.PI * 0.45, 3.0, delta);
      this.castleGateRight.rotation.y = THREE.MathUtils.damp(this.castleGateRight.rotation.y, Math.PI * 0.45, 3.0, delta);

      if (this.playerPosition.z <= -13 && !this.isLevelFinished) {
        this.isLevelFinished = true;
        soundManager.playLevelVictory();
      }
    }

    // 4. Third-person camera orbit follow
    const offsetX = Math.sin(this.cameraYaw) * Math.cos(this.cameraPitch) * this.cameraDistance;
    const offsetY = Math.sin(this.cameraPitch) * this.cameraDistance;
    const offsetZ = Math.cos(this.cameraYaw) * Math.cos(this.cameraPitch) * this.cameraDistance;

    this._desiredCam.set(
      this.playerPosition.x + offsetX,
      this.playerPosition.y + 1.35 + offsetY,
      this.playerPosition.z + offsetZ
    );
    this._camTarget.set(
      this.playerPosition.x,
      this.playerPosition.y + 1.35,
      this.playerPosition.z
    );
    this.camera.position.lerp(this._desiredCam, 0.12);
    this.camera.lookAt(this._camTarget);

    // 5. Update interaction prompt
    this.updateInteractionPrompt();
  }

  private updateInteractionPrompt() {
    if (this.carriedBlock) {
      let nearSocket = false;
      this.socketMeshes.forEach((sock, idx) => {
        if (this.playerPosition.distanceTo(sock.position) < 2.4 && this.placedBlocks[idx] === null) {
          nearSocket = true;
        }
      });
      this.interactionPrompt = nearSocket
        ? `[E] Pasang Balok ${this.carriedBlock.value}`
        : '[E] Letakkan Balok';
      return;
    }

    let nearBlock: string | null = null;
    this.blocksInWorld.forEach((b) => {
      if (this.playerPosition.distanceTo(b.mesh.position) < 2.4) {
        nearBlock = b.value;
      }
    });

    if (nearBlock) {
      this.interactionPrompt = `[E] Ambil Balok ${nearBlock}`;
      return;
    }

    this.interactionPrompt = null;
  }
}
