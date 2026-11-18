/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as THREE from 'three';
import { soundManager } from '../../audio/SoundSynthesizer';
import { CameraPerspective } from '../../types';

export interface BioLevelData {
  levelNumber: number;
  title: string;
  organelle: string;
  targetCount: number;
  description: string;
}

export const BIO_LEVELS: BioLevelData[] = [
  { levelNumber: 1, title: 'Kloroplas: Foton Fotosintesis', organelle: 'Kloroplas', targetCount: 3, description: 'Menangkap 3 foton cahaya matahari pada tilakoid untuk memulai fotofosforilasi.' },
  { levelNumber: 2, title: 'Klorofil Daun: Reaksi Terang', organelle: 'Klorofil a & b', targetCount: 4, description: 'Pigmen klorofil tereksitasi oleh spektrum cahaya biru dan merah.' },
  { levelNumber: 3, title: 'Mitokondria: Pembangkit ATP', organelle: 'Mitokondria', targetCount: 4, description: 'Respirasi seluler aerob menghasilkan 36-38 molekul ATP per glukosa.' },
  { levelNumber: 4, title: 'Membran Sel: Difusi Selektif', organelle: 'Lapisan Fosfolipid', targetCount: 3, description: 'Membran semipermeabel mengatur keluar masuknya ion dan nutrisi penting.' },
  { levelNumber: 5, title: 'Ribosom: Sintesis Protein', organelle: 'Ribosom 80S', targetCount: 5, description: 'Menerjemahkan kode genetik mRNA menjadi untaian rantai polipeptida.' },
  { levelNumber: 6, title: 'Vakuola: Tekanan Turgor', organelle: 'Vakuola Sentral', targetCount: 4, description: 'Menyimpan cadangan air dan ion untuk menjaga sel tumbuhan tetap kaku dan tegak.' },
  { levelNumber: 7, title: 'Retikulum Endoplasma Kasar', organelle: 'RE Kasar', targetCount: 4, description: 'Jaringan saluran membran bergranula yang melipat dan mematangkan protein.' },
  { levelNumber: 8, title: 'Aparatus Golgi: Vesikel Transport', organelle: 'Badan Golgi', targetCount: 5, description: 'Pusat pengemasan, penandaan, dan pengiriman glikoprotein ke target sel.' },
  { levelNumber: 9, title: 'Nukleus: Inti Genetika', organelle: 'Nukleus & Kromatin', targetCount: 4, description: 'Menyimpan kode cetak biru kehidupan dalam bentuk heliks ganda asam deoksiribonukleat (DNA).' },
  { levelNumber: 10, title: 'Dinding Sel: Polimer Selulosa', organelle: 'Dinding Sel', targetCount: 5, description: 'Lapisan mikrofibril selulosa yang memberi perlindungan mekanis dari lisis osmosis.' },
  { levelNumber: 11, title: 'Fotolisis Air: Pelepasan Oksigen', organelle: 'Lumen Tilakoid', targetCount: 4, description: 'Pemecahan molekul 2H₂O menjadi 4H⁺, 4e⁻, dan pelepasan gas O₂ ke atmosfer bumi.' },
  { levelNumber: 12, title: 'Siklus Calvin: Fiksasi RuBisCO', organelle: 'Stroma Kloroplas', targetCount: 5, description: 'Enzim RuBisCO mengikat gas CO₂ menjadi gula fosfat 3-karbon (G3P).' },
  { levelNumber: 13, title: 'Glikolisis Sitoplasma', organelle: 'Sitosol Sel', targetCount: 4, description: 'Pemecahan glukosa 6-karbon menjadi dua molekul piruvat berenergi.' },
  { levelNumber: 14, title: 'Siklus Krebs / Asam Sitrat', organelle: 'Matriks Mitokondria', targetCount: 5, description: 'Oksidasi asetil-KoA menghasilkan pembawa elektron NADH dan FADH₂.' },
  { levelNumber: 15, title: 'Rantai Transpor Elektron', organelle: 'Krista Mitokondria', targetCount: 6, description: 'Gradien konsentrasi proton memutar enzim ATP sintase seperti turbin biologis nano.' },
  { levelNumber: 16, title: 'Replikasi DNA Semi-Konservatif', organelle: 'Nukleoplasma', targetCount: 5, description: 'Enzim DNA polimerase menyintesis untai anakan komplementer dengan akurasi tinggi.' },
  { levelNumber: 17, title: 'Transkripsi mRNA', organelle: 'Nukleolus', targetCount: 5, description: 'Penyalinan urutan basa nitrogen DNA menjadi messenger RNA beruntai tunggal.' },
  { levelNumber: 18, title: 'Translasi Kodon & Antikodon', organelle: 'Poliribosom', targetCount: 6, description: 'Molekul tRNA membawa asam amino spesifik sesuai triplet kodon genetik.' },
  { levelNumber: 19, title: 'Pembelahan Mitosis: Metafase', organelle: 'Gelendong Mitosis', targetCount: 5, description: 'Kromosom berjajar di bidang ekuator ditarik oleh benang mikrotubulus sentriol.' },
  { levelNumber: 20, title: 'Master Biosfer Ekosistem Selular', organelle: 'Simfoni Sel Daun Purba', targetCount: 6, description: 'Puncak pemahaman biologi sel! Integrasi sempurna seluruh organel metabolik kehidupan.' },
];

export interface BioNode {
  id: number;
  kind: 'photon' | 'ros';
  collected: boolean;
}

export class CellForestGame {
  public scene: THREE.Scene;
  public camera: THREE.PerspectiveCamera;

  // Level State
  public currentLevelIdx = 0;
  public currentLevelData = BIO_LEVELS[0];

  // Biology state
  public photonsCollected = 0;
  public targetPhotons = BIO_LEVELS[0].targetCount;
  public bioNodes: BioNode[] = [];
  public isPhotosynthesisActive = false;
  public isLevelFinished = false;

  private nodeMeshes: THREE.Mesh[] = [];
  private chloroplast!: THREE.Mesh;
  private dnaGroup!: THREE.Group;

  constructor(initialLevel = 0) {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color('#062410');
    this.scene.fog = new THREE.FogExp2('#062410', 0.03);

    this.camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
    this.camera.position.set(0, 1.8, 5);
    this.camera.lookAt(new THREE.Vector3(0, 1.2, 0));

    this.setupLighting();
    this.setupCellEnvironment();

    this.loadLevel(initialLevel);
  }

  public loadLevel(levelIdx: number) {
    this.currentLevelIdx = Math.max(0, Math.min(levelIdx, BIO_LEVELS.length - 1));
    this.currentLevelData = BIO_LEVELS[this.currentLevelIdx];
    this.targetPhotons = this.currentLevelData.targetCount;
    this.photonsCollected = 0;
    this.isPhotosynthesisActive = false;
    this.isLevelFinished = false;

    if (this.chloroplast) {
      (this.chloroplast.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.3;
    }

    this.setupNodesForLevel();
  }

  private setupLighting() {
    const key = new THREE.DirectionalLight('#a3e635', 1.6);
    key.position.set(4, 5, 4);
    this.scene.add(key);

    const glow = new THREE.PointLight('#84cc16', 2.0, 10);
    glow.position.set(0, 2, 0);
    this.scene.add(glow);

    this.scene.add(new THREE.AmbientLight('#14532d', 0.6));
  }

  private setupCellEnvironment() {
    // Chloroplast organelle (emerald disc)
    const chloroGeo = new THREE.CylinderGeometry(1.2, 1.2, 0.4, 24);
    const chloroMat = new THREE.MeshStandardMaterial({
      color: '#15803d',
      emissive: '#16a34a',
      emissiveIntensity: 0.3,
      roughness: 0.3,
    });
    this.chloroplast = new THREE.Mesh(chloroGeo, chloroMat);
    this.chloroplast.position.set(0, 0.8, -1.2);
    this.chloroplast.rotation.x = 0.4;
    this.scene.add(this.chloroplast);

    // 3D DNA Double Helix in background cytoplasm
    this.dnaGroup = new THREE.Group();
    this.dnaGroup.position.set(-1.9, 1.4, -1.8);
    for (let i = 0; i < 10; i++) {
      const ang = i * 0.65;
      const y = (i - 4.5) * 0.22;
      const strandA = new THREE.Mesh(
        new THREE.SphereGeometry(0.08, 8, 8),
        new THREE.MeshBasicMaterial({ color: '#38bdf8' })
      );
      strandA.position.set(Math.cos(ang) * 0.32, y, Math.sin(ang) * 0.32);

      const strandB = new THREE.Mesh(
        new THREE.SphereGeometry(0.08, 8, 8),
        new THREE.MeshBasicMaterial({ color: '#f472b6' })
      );
      strandB.position.set(-Math.cos(ang) * 0.32, y, -Math.sin(ang) * 0.32);

      this.dnaGroup.add(strandA, strandB);
    }
    this.scene.add(this.dnaGroup);
  }

  private setupNodesForLevel() {
    this.nodeMeshes.forEach((mesh) => {
      this.scene.remove(mesh);
      mesh.geometry.dispose();
      (mesh.material as THREE.Material).dispose();
    });
    this.nodeMeshes = [];

    const rosCount = 2 + Math.floor(this.currentLevelIdx / 5);
    const rawNodes: Array<{ kind: 'photon' | 'ros' }> = [
      ...Array.from({ length: this.targetPhotons }, () => ({ kind: 'photon' as const })),
      ...Array.from({ length: rosCount }, () => ({ kind: 'ros' as const })),
    ];

    // Deterministic interleave/shuffle per level
    const shuffled: Array<{ kind: 'photon' | 'ros' }> = [];
    const step = 3 + (this.currentLevelIdx % 3);
    const pool = [...rawNodes];
    let cursor = this.currentLevelIdx % pool.length;
    while (pool.length > 0) {
      cursor = (cursor + step) % pool.length;
      shuffled.push(pool.splice(cursor, 1)[0]);
    }

    this.bioNodes = shuffled.map((n, idx) => ({
      id: idx,
      kind: n.kind,
      collected: false,
    }));

    const total = this.bioNodes.length;
    const startX = -((total - 1) * 0.56) / 2;
    this.bioNodes.forEach((node, i) => {
      const geo =
        node.kind === 'photon'
          ? new THREE.SphereGeometry(0.18, 12, 12)
          : new THREE.IcosahedronGeometry(0.19, 0);
      const mat = new THREE.MeshBasicMaterial({
        color: node.kind === 'photon' ? '#fef08a' : '#e11d48',
      });
      const mesh = new THREE.Mesh(geo, mat);
      const x = startX + i * 0.56;
      const y = 1.55 + Math.sin((i / Math.max(1, total - 1)) * Math.PI) * 0.45;
      const z = 0.55 - Math.abs(x) * 0.14;
      mesh.position.set(x, y, z);
      this.nodeMeshes.push(mesh);
      this.scene.add(mesh);
    });
  }

  public collectNode(id: number) {
    if (this.isLevelFinished) return;
    const node = this.bioNodes.find((n) => n.id === id);
    if (!node) return;

    if (node.kind === 'ros') {
      // Toxic Reactive Oxygen Species orb! Lose 1 collected photon
      soundManager.playError();
      const prevPhoton = this.bioNodes.find((n) => n.kind === 'photon' && n.collected);
      if (prevPhoton) {
        prevPhoton.collected = false;
        if (this.nodeMeshes[prevPhoton.id]) {
          this.nodeMeshes[prevPhoton.id].visible = true;
        }
        this.photonsCollected = Math.max(0, this.photonsCollected - 1);
      }
      return;
    }

    if (node.collected) return;
    node.collected = true;
    if (this.nodeMeshes[node.id]) {
      this.nodeMeshes[node.id].visible = false;
    }
    this.photonsCollected++;
    soundManager.playPickup();

    if (this.photonsCollected >= this.targetPhotons && !this.isLevelFinished) {
      this.isPhotosynthesisActive = true;
      this.isLevelFinished = true;
      (this.chloroplast.material as THREE.MeshStandardMaterial).emissiveIntensity = 1.0;
      soundManager.playCorrect();
      soundManager.playLevelVictory();
    }
  }

  public update(delta: number, _cameraMode: CameraPerspective = 'tpp') {
    if (this.chloroplast) {
      this.chloroplast.rotation.y += delta * 0.3;
    }
    if (this.dnaGroup) {
      this.dnaGroup.rotation.y += delta * 0.8;
    }
    this.nodeMeshes.forEach((p, i) => {
      p.position.y += Math.sin(Date.now() * 0.003 + i) * 0.0018;
      p.rotation.y += delta * 0.9;
    });
  }
}
