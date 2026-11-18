/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as THREE from 'three';
import { soundManager } from '../../audio/SoundSynthesizer';
import { CameraPerspective } from '../../types';

export interface UiLevelData {
  levelNumber: number;
  title: string;
  cards: Array<{ label: string; offset: number }>;
  description: string;
}

export const UI_LEVELS: UiLevelData[] = [
  { levelNumber: 1, title: 'Grid 8-Point Navigasi', cards: [{ label: 'NAVBAR: MARGIN 8PX', offset: -0.6 }, { label: 'LOGO: RATA TENGAH', offset: 0.4 }, { label: 'MENU: SPACING 16PX', offset: -0.3 }], description: 'Menyelaraskan elemen navbar ke kelipatan kisi 8-point standar industri.' },
  { levelNumber: 2, title: 'Hierarki Judul & Kontras', cards: [{ label: 'H1 HERO: FONT-SIZE 48PX', offset: 0.5 }, { label: 'H2 SUBTITLE: FONT-SIZE 20PX', offset: -0.4 }, { label: 'PARAGRAF: LINE-HEIGHT 1.6', offset: 0.3 }], description: 'Menciptakan hierarki tipografi berjenjang yang mudah dipindai mata.' },
  { levelNumber: 3, title: 'Padding Kartu Produk', cards: [{ label: 'GAMBAR: BORDER-RADIUS 16PX', offset: -0.5 }, { label: 'LABEL HARGA: PADDING 12PX', offset: 0.4 }, { label: 'TOMBOL BELI: FULL-WIDTH', offset: -0.2 }], description: 'Konsistensi jarak dalam (padding) kartu menjaga kerapian antarmuka.' },
  { levelNumber: 4, title: 'Spasi Tombol Call-to-Action', cards: [{ label: 'PRIMARY CTA: KONTRAS TINGGI', offset: 0.6 }, { label: 'SECONDARY: GHOST BUTTON', offset: -0.5 }, { label: 'TERTIARY: TEXT-LINK', offset: 0.3 }], description: 'Menegaskan hierarki visual tombol tindakan agar pengguna tidak ragu.' },
  { levelNumber: 5, title: 'Target Sentuh Mobile (48px)', cards: [{ label: 'HAMBURGER: 48×48PX', offset: -0.4 }, { label: 'SEARCH BAR: HEIGHT 48PX', offset: 0.5 }, { label: 'FILTER CHIPS: MIN 44PX', offset: -0.3 }], description: 'Hukum Fitts: Ukuran tombol sentuh minimal 48px mencegah salah pencet di layar HP.' },
  { levelNumber: 6, title: 'Formulir Input Sejajar', cards: [{ label: 'LABEL FORM: RATA KIRI', offset: 0.4 }, { label: 'TEXTFIELD: OUTLINE 2PX', offset: -0.6 }, { label: 'HELPER TEXT: UKURAN 12PX', offset: 0.2 }], description: 'Penempatan label di atas input field mempercepat pengisian formulir hingga 2× lipat.' },
  { levelNumber: 7, title: 'Tabel Data Keuangan', cards: [{ label: 'KOLOM TEKS: RATA KIRI', offset: -0.5 }, { label: 'KOLOM ANGKA: RATA KANAN', offset: 0.4 }, { label: 'STATUS BADGE: RATA TENGAH', offset: -0.3 }], description: 'Kaidah tabel UI: Angka numerik wajib rata kanan agar desimal mudah dibandingkan.' },
  { levelNumber: 8, title: 'Modal Konfirmasi Bahaya', cards: [{ label: 'DIALOG TITLE: ICON PERINGATAN', offset: 0.5 }, { label: 'DESKRIPSI: KONFIRMASI HAPUS', offset: -0.4 }, { label: 'TOMBOL DESTRUCTIVE: MERAH', offset: 0.3 }], description: 'Dialog destruktif memerlukan kejelasan tombol batal dan konfirmasi terpisah.' },
  { levelNumber: 9, title: 'Breadcrumbs Navigasi', cards: [{ label: 'BERANDA / KATALOG / DETAIL', offset: -0.6 }, { label: 'SEPARATOR IKON: CHEVRON', offset: 0.3 }, { label: 'HALAMAN AKTIF: BOLD', offset: -0.4 }], description: 'Navigasi breadcrumb membantu pengguna memahami posisi di dalam arsitektur informasi.' },
  { levelNumber: 10, title: 'Bottom Tab Bar Mobile', cards: [{ label: 'TAB 1: BERANDA', offset: 0.4 }, { label: 'TAB 2: JELAJAH (AKTIF)', offset: -0.5 }, { label: 'TAB 3: PROFIL PENGGUNA', offset: 0.2 }], description: 'Tab bar bawah mematuhi thumb zone (jangkauan ibu jari) pengguna smartphone.' },
  { levelNumber: 11, title: 'Sistem Kartu Metrik Dashboard', cards: [{ label: 'METRIK ANGKA: 3,420 XP', offset: -0.5 }, { label: 'PERSENTASE: +18% HIJAU', offset: 0.4 }, { label: 'SPARKLINE: GRAFIK TREN', offset: -0.3 }], description: 'Penyajian KPI dashboard dengan rasio kontras warna status positif dan negatif.' },
  { levelNumber: 12, title: 'Floating Action Button (FAB)', cards: [{ label: 'FAB POSISI: POJOK KANAN BAWAH', offset: 0.6 }, { label: 'ELEVASI SHADOW: 8DP', offset: -0.4 }, { label: 'TOOLTIP: TAMBAH CATATAN', offset: 0.3 }], description: 'Tindakan paling utama (primary action) diapungkan pada elevasi z-index tertinggi.' },
  { levelNumber: 13, title: 'Accordion FAQ Interaktif', cards: [{ label: 'HEADER ITEM: EXPANDABLE', offset: -0.4 }, { label: 'IKON INDIKATOR: ROTASI 180°', offset: 0.5 }, { label: 'KONTEN: PADDING VERTICAL 16PX', offset: -0.3 }], description: 'Menyimpan ruang layar dengan menyembunyikan detail sekunder sampai dibutuhkan.' },
  { levelNumber: 14, title: 'Skeleton Loading Placeholder', cards: [{ label: 'SKELETON AVATAR: BULAT 40PX', offset: 0.5 }, { label: 'SKELETON BARIS 1: LEBAR 80%', offset: -0.6 }, { label: 'SKELETON BARIS 2: LEBAR 40%', offset: 0.2 }], description: 'Skeleton screen mengurangi perceived waiting time dibanding spinner pemutar.' },
  { levelNumber: 15, title: 'Dropdown Menu Seleksi', cards: [{ label: 'TRIGGER BUTTON: PADDING 14PX', offset: -0.5 }, { label: 'MENU POPOVER: BORDER KONTRAST', offset: 0.4 }, { label: 'ITEM HOVER: HIGHLIGHT CYAN', offset: -0.3 }], description: 'Status visual hover dan focus ring yang tegas memenuhi standar aksesibilitas.' },
  { levelNumber: 16, title: 'Pagination Halaman Responsif', cards: [{ label: 'TOMBOL SEBELUMNYA', offset: 0.4 }, { label: 'NOMOR HALAMAN: KOTAK 36PX', offset: -0.5 }, { label: 'TOMBOL SELANJUTNYA', offset: 0.3 }], description: 'Kemudahan lompat halaman data besar tanpa membebani memori browser.' },
  { levelNumber: 17, title: 'Banner Peringatan Sistem', cards: [{ label: 'ICON INFO: BIRU CYAN', offset: -0.6 }, { label: 'PESAN SISTEM: LINE-HEIGHT 1.5', offset: 0.5 }, { label: 'TOMBOL DISMISS (X)', offset: -0.2 }], description: 'Pemberitahuan non-intrusif yang tetap dapat ditutup oleh pengguna.' },
  { levelNumber: 18, title: 'Status Step Wizard Multi-Langkah', cards: [{ label: 'LANGKAH 1: SELESAI (CENTANG)', offset: 0.5 }, { label: 'LANGKAH 2: AKTIF (GLOW CYAN)', offset: -0.4 }, { label: 'LANGKAH 3: PENDING (ABU-ABU)', offset: 0.3 }], description: 'Mengurangi beban kognitif pada proses registrasi panjang dengan alur bertahap.' },
  { levelNumber: 19, title: 'Tooltip Petunjuk Kontekstual', cards: [{ label: 'TRIGGER IKON PERTANYAAN (?)', offset: -0.5 }, { label: 'BUBBLE TOOLTIP: BG GELAP', offset: 0.4 }, { label: 'PANAH SEGITIGA PENUNJUK', offset: -0.2 }], description: 'Mikro-bantuan tepat saat kursor pengguna mendekati elemen yang memerlukan penjelasan.' },
  { levelNumber: 20, title: 'Grand Master Sistem Desain UI', cards: [{ label: 'DESIGN TOKENS: WARNA & FONT', offset: 0.6 }, { label: 'KOMPONEN REUSABLE BERSIH', offset: -0.6 }, { label: 'GRID 8-POINT PARIPURNA', offset: 0.3 }], description: 'Puncak integrasi sistem desain UI cyberpunk! Seluruh kartu holografik sejajar presisi.' },
];

export class NeonInterfaceGame {
  public scene: THREE.Scene;
  public camera: THREE.PerspectiveCamera;

  // Level State
  public currentLevelIdx = 0;
  public currentLevelData = UI_LEVELS[0];

  // Alignment state
  public cardAlignments: number[] = [-0.6, 0.4, -0.4];
  public isAligned = false;
  public isLevelFinished = false;

  private cardMeshes: THREE.Mesh[] = [];
  private guideBeam!: THREE.Mesh;

  constructor(initialLevel = 0) {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color('#0c1222');

    this.camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
    this.camera.position.set(0, 1.6, 4.5);
    this.camera.lookAt(new THREE.Vector3(0, 1.4, 0));

    this.setupLighting();
    this.setupCyberEnvironment();
    this.loadLevel(initialLevel);
  }

  private setupCyberEnvironment() {
    // Vertical 8-point Grid Wall behind cards
    const grid = new THREE.GridHelper(10, 20, '#06b6d4', '#1e293b');
    grid.rotation.x = Math.PI / 2;
    grid.position.set(0, 1.5, -0.55);
    this.scene.add(grid);

    // Center X = 0 Laser Alignment Beam
    this.guideBeam = new THREE.Mesh(
      new THREE.CylinderGeometry(0.025, 0.025, 3.6, 8),
      new THREE.MeshBasicMaterial({ color: '#22d3ee', transparent: true, opacity: 0.75 })
    );
    this.guideBeam.position.set(0, 1.5, -0.15);
    this.scene.add(this.guideBeam);

    // Flanking Neon Cyber Pillars
    [-2.8, 2.8].forEach((px) => {
      const pillar = new THREE.Mesh(
        new THREE.BoxGeometry(0.28, 4.2, 0.28),
        new THREE.MeshStandardMaterial({
          color: '#0f172a',
          emissive: '#ec4899',
          emissiveIntensity: 0.55,
          roughness: 0.25,
        })
      );
      pillar.position.set(px, 1.5, -0.4);
      this.scene.add(pillar);
    });
  }

  public loadLevel(levelIdx: number) {
    this.currentLevelIdx = Math.max(0, Math.min(levelIdx, UI_LEVELS.length - 1));
    this.currentLevelData = UI_LEVELS[this.currentLevelIdx];
    // Quantize starting offsets cleanly to multiples of 0.2 so ±0.2 nudges always reach 0.00
    this.cardAlignments = this.currentLevelData.cards.map((c, idx) => {
      const snapped = Number((Math.round(c.offset / 0.2) * 0.2).toFixed(2));
      return snapped === 0 ? (idx % 2 === 0 ? 0.4 : -0.4) : snapped;
    });
    this.isAligned = false;
    this.isLevelFinished = false;

    this.setupHologramHUD();
  }

  private setupLighting() {
    const key = new THREE.DirectionalLight('#06b6d4', 2.0);
    key.position.set(3, 4, 3);
    this.scene.add(key);

    const rim = new THREE.DirectionalLight('#ec4899', 1.5);
    rim.position.set(-3, 3, -3);
    this.scene.add(rim);

    this.scene.add(new THREE.AmbientLight('#1e293b', 0.6));
  }

  private setupHologramHUD() {
    this.cardMeshes.forEach((c) => this.scene.remove(c));
    this.cardMeshes = [];

    const cardGeo = new THREE.PlaneGeometry(2.5, 0.75);

    this.currentLevelData.cards.forEach((cardData, idx) => {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 160;
      const ctx = canvas.getContext('2d')!;

      ctx.fillStyle = 'rgba(6, 182, 212, 0.18)';
      ctx.fillRect(0, 0, 512, 160);
      ctx.strokeStyle = '#06b6d4';
      ctx.lineWidth = 6;
      ctx.strokeRect(4, 4, 504, 152);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 30px "Fredoka", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(cardData.label, 256, 95);

      const tex = new THREE.CanvasTexture(canvas);
      const cardMat = new THREE.MeshBasicMaterial({ map: tex, transparent: true, side: THREE.DoubleSide });
      const card = new THREE.Mesh(cardGeo, cardMat);
      card.position.set(this.cardAlignments[idx], 2.2 - idx * 0.85, 0);

      this.cardMeshes.push(card);
      this.scene.add(card);
    });
  }

  public nudgeCard(idx: number, delta: number) {
    if (this.isLevelFinished || idx < 0 || idx >= this.cardAlignments.length) return;
    let next = Number(THREE.MathUtils.clamp(this.cardAlignments[idx] + delta, -1.4, 1.4).toFixed(2));
    if (Math.abs(next) <= 0.05) {
      next = 0;
      soundManager.playCorrect();
    } else {
      soundManager.playClick();
    }

    this.cardAlignments[idx] = next;
    this.cardMeshes[idx].position.x = next;

    if (this.cardAlignments.every((x) => Math.abs(x) <= 0.05) && !this.isLevelFinished) {
      this.isAligned = true;
      this.isLevelFinished = true;
      soundManager.playLevelVictory();
    }
  }

  public update(_delta: number, _cameraMode: CameraPerspective = 'tpp') {
    this.cardMeshes.forEach((card, idx) => {
      card.position.y = 2.2 - idx * 0.85 + Math.sin(Date.now() * 0.003 + idx) * 0.03;
    });
  }
}
