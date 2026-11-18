/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as THREE from 'three';
import { soundManager } from '../../audio/SoundSynthesizer';
import { CameraPerspective } from '../../types';

export interface UxLevelData {
  levelNumber: number;
  title: string;
  persona: string;
  initialSatisfaction: number;
  targetSatisfaction: number;
  beforeSteps: string[];
  afterSteps: string[];
  explanation: string;
}

export const UX_LEVELS: UxLevelData[] = [
  { levelNumber: 1, title: 'Pemangkasan Friction Checkout', persona: 'Rani (Mahasiswi Buru-Buru)', initialSatisfaction: 60, targetSatisfaction: 98, beforeSteps: ['Pilih Menu Manual Kertas', 'Antre Kasir 20 Menit', 'Bayar Tunai Uang Pas', 'Tunggu Panggilan'], afterSteps: ['Scan QR Meja Mandiri', 'Bayar E-Wallet 1-Klik', 'Ambil di Jalur Kilat'], explanation: 'Mengurangi friksi titik sentuh fisik meningkatkan kecepatan transaksi hingga 75%.' },
  { levelNumber: 2, title: 'Onboarding Pengguna Baru', persona: 'Dimas (Pelanggan Pertama Kali)', initialSatisfaction: 55, targetSatisfaction: 96, beforeSteps: ['Form Registrasi 10 Kolom', 'Verifikasi Email Rumit', 'Buka Menu Bingung'], afterSteps: ['Sign-in 1-Tap Google', 'Rekomendasi Menu Favorit', 'Diskon Selamat Datang'], explanation: 'Prinsip Time-to-Value: Biarkan pengguna merasakan manfaat produk sebelum meminta data pribadi.' },
  { levelNumber: 3, title: 'Pemulihan Error Menu Habis', persona: 'Siti (Pekerja Kantor)', initialSatisfaction: 50, targetSatisfaction: 95, beforeSteps: ['Pesan Kopi Hazelnut', 'Kasir Bilang Habis!', 'Bingung Pilih Ulang'], afterSteps: ['Indikator Stok Realtime', 'Saran Otomatis Alternatif Serupa', 'Proses Cepat'], explanation: 'Heuristik Nielsen #9: Bantu pengguna mengenali, mendiagnosis, dan memulihkan diri dari error.' },
  { levelNumber: 4, title: 'Aksesibilitas Kontras & Font', persona: 'Pak Budi (Pelanggan Lansia)', initialSatisfaction: 45, targetSatisfaction: 97, beforeSteps: ['Font Kecil 10px Buram', 'Kontras Abu di Atas Putih', 'Tombol Terlalu Mepet'], afterSteps: ['Mode Font Ramah Lansia (18px)', 'Kontras Tinggi WCAG AAA', 'Tombol Luas Jarak Aman'], explanation: 'Desain inklusif memastikan aplikasi dapat digunakan dengan nyaman oleh semua kalangan usia.' },
  { levelNumber: 5, title: 'Feedback Status Pesanan Realtime', persona: 'Bayu (Driver Ojek Online)', initialSatisfaction: 62, targetSatisfaction: 98, beforeSteps: ['Menunggu Tanpa Kepastian', 'Bolak-balik Tanya Barista', 'Pesanan Belum Siap'], afterSteps: ['Progress Bar: Dibuat → Siap', 'Notifikasi Getar Saat Siap', 'Pengambilan Mulus'], explanation: 'Heuristik Nielsen #1: Selalu komunikasikan visibilitas status sistem secara berkala.' },
  { levelNumber: 6, title: 'Penyederhanaan Pilihan (Hick’s Law)', persona: 'Clara (Ragu-ragu)', initialSatisfaction: 58, targetSatisfaction: 95, beforeSteps: ['Buku Menu 80 Varian', 'Deskripsi Membingungkan', 'Lama Menimbang Pilihan'], afterSteps: ['Kategori 5 Best-Seller', 'Filter Rasa: Manis/Pahit/Creamy', 'Pilihan Cepat 10 Detik'], explanation: 'Hukum Hick: Semakin banyak pilihan, semakin lama dan stres waktu yang dibutuhkan untuk memutuskan.' },
  { levelNumber: 7, title: 'Personalisasi Tingkat Kemanisan', persona: 'Reza (Diet Rendah Gula)', initialSatisfaction: 64, targetSatisfaction: 99, beforeSteps: ['Harus Ingatkan Barista Lisan', 'Kadang Tertukar Gula Normal', 'Kecewa'], afterSteps: ['Slider Sugar Level: 0/25/50/100%', 'Pilihan Susu Nabati Oat/Almond', 'Simpan ke Profil'], explanation: 'Memberikan kendali dan kebebasan personalisasi membangun loyalitas pelanggan.' },
  { levelNumber: 8, title: 'Sistem Pembatalan Fleksibel', persona: 'Maya (Salah Pencet Pesanan)', initialSatisfaction: 40, targetSatisfaction: 96, beforeSteps: ['Salah Klik Ukuran Besar', 'Tidak Ada Tombol Batal', 'Uang Terpotong'], afterSteps: ['Tombol Undo 15 Detik', 'Edit Item Sebelum Diproses', 'Rasa Tenang'], explanation: 'Heuristik Nielsen #3: User control and freedom — sediakan "pintu darurat" (Undo/Cancel).' },
  { levelNumber: 9, title: 'Pencarian Instan dengan Saran', persona: 'Yoga (Pecinta Kopi V60)', initialSatisfaction: 52, targetSatisfaction: 95, beforeSteps: ['Scroll Daftar Panjang 5 Halaman', 'Ketik Pencarian Sering Typo', 'Hasil Kosong'], afterSteps: ['Autocomplete Cerdas', 'Pencarian Fuzzy Toleran Typo', 'Hasil Langsung Muncul'], explanation: 'Mengurangi beban ketik pengguna ponsel dengan pencarian prediktif.' },
  { levelNumber: 10, title: 'Program Loyalitas Transparan', persona: 'Tasya (Pengumpul Poin)', initialSatisfaction: 65, targetSatisfaction: 98, beforeSteps: ['Kartu Stempel Kertas Sering Hilang', 'Tidak Tahu Jumlah Poin', 'Klaim Reward Rumit'], afterSteps: ['Stempel Digital Otomatis', 'Progress 8/10 Menuju Kopi Gratis', 'Klaim 1-Ketukan'], explanation: 'Gamifikasi dan transparansi progres memperkuat retensi harian pengguna.' },
  { levelNumber: 11, title: 'Pemesanan Berulang 1-Ketuk', persona: 'Fajar (Pelanggan Harian)', initialSatisfaction: 70, targetSatisfaction: 99, beforeSteps: ['Pilih Menu yang Sama Tiap Pagi', 'Isi Ulang Alamat', 'Konfirmasi Ulang'], afterSteps: ['Widget "Pesan Ulang Kemarin"', 'Konfirmasi 1-Ketuk', 'Siap Diambil Saat Tiba'], explanation: 'Memangkas langkah untuk task repetitif harian hingga mendekati nol gesekan.' },
  { levelNumber: 12, title: 'Rating & Ulasan yang Bermakna', persona: 'Nadia (Reviewer Kuliner)', initialSatisfaction: 55, targetSatisfaction: 96, beforeSteps: ['Form Review 5 Bintang Kosong', 'Wajib Tulis Esai Panjang', 'Malas Mengisi'], afterSteps: ['Chip Cepat: Rasa Enak / Cepat', 'Opsional Foto Minuman', 'Reward Koin Ulasan'], explanation: 'Desain survei mikro yang ringan meningkatkan angka partisipasi hingga 400%.' },
  { levelNumber: 13, title: 'Pemesanan Rombongan (Group Order)', persona: 'Andi (Ketua Tim Kantor)', initialSatisfaction: 48, targetSatisfaction: 97, beforeSteps: ['Catat Pesanan 8 Teman di Kertas', 'Rentan Tertukar Menu', 'Rebutan Hitung Uang'], afterSteps: ['Bagikan Link Pesanan Bersama', 'Masing-masing Pilih di HP Sendiri', 'Split Bill Otomatis'], explanation: 'Menyelesaikan skenario kolaboratif sosial dalam satu alur terpadu.' },
  { levelNumber: 14, title: 'Mode Offline Toleran Sinyal', persona: 'Rico (Sinyal Seluler Lemah)', initialSatisfaction: 42, targetSatisfaction: 95, beforeSteps: ['Aplikasi Blank Saat Offline', 'Menu Hilang Total', 'Transaksi Gagal'], afterSteps: ['Cache Menu Lokal', 'Antrean Offline Tersinkron Otomatis', 'Pesan Tetap Berhasil'], explanation: 'Prinsip Offline-First: Jangan biarkan koneksi buruk merusak kepercayaan pengguna.' },
  { levelNumber: 15, title: 'Pengingat Promosi Kontekstual', persona: 'Dina (Pemburu Promo Jam 2 Siang)', initialSatisfaction: 60, targetSatisfaction: 96, beforeSteps: ['Spam Notifikasi Tiap 2 Jam', 'Promo Tidak Relevan', 'Mute Notifikasi'], afterSteps: ['Promo Tepat Waktu Coffee Break', 'Diskon Minuman Favorit Saja', 'Buka Langsung Masuk Keranjang'], explanation: 'Notifikasi yang relevan dan personal dihargai sebagai asisten, bukan gangguan spam.' },
  { levelNumber: 16, title: 'Kebijakan Privasi Transparan', persona: 'Kurnia (Peduli Privasi Data)', initialSatisfaction: 50, targetSatisfaction: 98, beforeSteps: ['Izin Lokasi & Kontak Paksa', 'Syarat & Ketentuan Rumit', 'Khawatir Data Dijual'], afterSteps: ['Penjelasan Bahasa Sederhana', 'Izin Lokasi Hanya Saat Cari Toko', 'Kendali Hapus Akun'], explanation: 'Transparansi etika privasi adalah fondasi kepercayaan merek jangka panjang.' },
  { levelNumber: 17, title: 'Pilihan Pengambilan Drive-Thru', persona: 'Ibu Sarah (Membawa Balita)', initialSatisfaction: 58, targetSatisfaction: 97, beforeSteps: ['Harus Parkir & Turun Mobil', 'Menggendong Anak Masuk Kafe', 'Repot'], afterSteps: ['Pilih Mode "Antar ke Mobil"', 'Ketik Plat Nomor', 'Barista Antar ke Jendela'], explanation: 'Memahami konteks lingkungan fisik pengguna saat berinteraksi dengan layanan.' },
  { levelNumber: 18, title: 'Pencegahan Kelelahan Keputusan', persona: 'Aldo (Bingung Kombinasi Makanan)', initialSatisfaction: 62, targetSatisfaction: 96, beforeSteps: ['Pilih Kopi Sendiri', 'Cari Pastry di Tab Terpisah', 'Total Harga Membengkak'], afterSteps: ['Paket Combo Sarapan Hemat', 'Rekomendasi Croissant Pasangan Kopi', 'Hemat 25%'], explanation: 'Bundling cerdas mengurangi cognitive load dan sekaligus menaikkan average order value.' },
  { levelNumber: 19, title: 'Apresiasi & Mikro-Interaksi Bahagia', persona: 'Putri (Merayakan Kelulusan)', initialSatisfaction: 72, targetSatisfaction: 99, beforeSteps: ['Halaman Sukses Standar Datar', 'Tanpa Ucapan', 'Kaku'], afterSteps: ['Konfeti Animasi Kartun 3D', 'Ucapan Kartu Digital Semangat', 'Rasa Bahagia'], explanation: 'Desain emosional (Don Norman): Kesan gembira mengubah kepuasan menjadi advokasi merek.' },
  { levelNumber: 20, title: 'Ekosistem Pengalaman Pengguna Paripurna', persona: 'Seluruh Komunitas Kafe EduVerse', initialSatisfaction: 65, targetSatisfaction: 100, beforeSteps: ['Alur Terpisah dan Terfragmentasi', 'Banyak Titik Kesalahan', 'Beban Kognitif Tinggi'], afterSteps: ['Sinergi Seamless Digital & Fisik', 'Nol Friksi Transaksi', 'Pengalaman Pelanggan Sempurna'], explanation: 'Puncak integrasi riset UX! Mengharmonisasikan kebutuhan bisnis, teknologi, dan empati manusia.' },
];

export interface UxFixOption {
  label: string;
  isGood: boolean;
  picked: boolean;
}

const UX_ANTI_PATTERNS = [
  'Popup Iklan Fullscreen Wajib',
  'Sembunyikan Tombol Batal',
  'Form Registrasi 12 Kolom',
  'Reset Keranjang Saat Refresh',
  'Teks Abu Tipis 9px',
  'Auto-Play Musik Keras',
  'Biaya Tersembunyi di Akhir',
  'Captcha Rumit Sebelum Lihat Menu',
];

export class UserCafeGame {
  public scene: THREE.Scene;
  public camera: THREE.PerspectiveCamera;

  // Level State
  public currentLevelIdx = 0;
  public currentLevelData = UX_LEVELS[0];

  // UX Steps & Choices state
  public journeySteps = UX_LEVELS[0].beforeSteps;
  public uxOptions: UxFixOption[] = [];
  public isOptimized = false;
  public satisfaction = UX_LEVELS[0].initialSatisfaction;
  public isLevelFinished = false;

  private customerMesh!: THREE.Group;

  constructor(initialLevel = 0) {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color('#382216');

    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
    this.camera.position.set(0, 2.2, 5.5);
    this.camera.lookAt(new THREE.Vector3(0, 1.2, 0));

    this.setupLighting();
    this.setupCafeDiorama();

    this.loadLevel(initialLevel);
  }

  public loadLevel(levelIdx: number) {
    this.currentLevelIdx = Math.max(0, Math.min(levelIdx, UX_LEVELS.length - 1));
    this.currentLevelData = UX_LEVELS[this.currentLevelIdx];
    this.journeySteps = [...this.currentLevelData.beforeSteps];
    this.satisfaction = this.currentLevelData.initialSatisfaction;
    this.isOptimized = false;
    this.isLevelFinished = false;

    const goodFixes = this.currentLevelData.afterSteps.slice(0, 2).map((label) => ({
      label,
      isGood: true,
      picked: false,
    }));
    const trap1 = UX_ANTI_PATTERNS[(levelIdx * 3) % UX_ANTI_PATTERNS.length];
    const trap2 = UX_ANTI_PATTERNS[(levelIdx * 3 + 4) % UX_ANTI_PATTERNS.length];
    const combined: UxFixOption[] = [
      ...goodFixes,
      { label: trap1, isGood: false, picked: false },
      { label: trap2, isGood: false, picked: false },
    ];

    // Deterministic rotation based on levelIdx so good/bad aren't always in fixed positions
    const rot = (levelIdx + 1) % combined.length;
    this.uxOptions = [...combined.slice(rot), ...combined.slice(0, rot)];
  }

  private setupLighting() {
    const key = new THREE.DirectionalLight('#fed7aa', 1.8);
    key.position.set(3, 5, 4);
    this.scene.add(key);

    const warm = new THREE.PointLight('#f59e0b', 1.8, 9);
    warm.position.set(0, 2.5, 0);
    this.scene.add(warm);

    this.scene.add(new THREE.AmbientLight('#78350f', 0.55));
  }

  private setupCafeDiorama() {
    // Wooden Floor
    const floor = new THREE.Mesh(
      new THREE.CylinderGeometry(2.6, 2.8, 0.3, 32),
      new THREE.MeshStandardMaterial({ color: '#78350f', roughness: 0.6 })
    );
    floor.position.y = -0.15;
    this.scene.add(floor);

    // Cafe Counter Bar
    const counter = new THREE.Mesh(
      new THREE.BoxGeometry(2.4, 1.1, 0.65),
      new THREE.MeshStandardMaterial({ color: '#451a03', roughness: 0.4 })
    );
    counter.position.set(0, 0.55, -0.7);
    this.scene.add(counter);

    // Espresso Machine + Coffee Cup on Counter
    const espresso = new THREE.Mesh(
      new THREE.BoxGeometry(0.45, 0.42, 0.35),
      new THREE.MeshStandardMaterial({ color: '#cbd5e1', metalness: 0.8, roughness: 0.2 })
    );
    espresso.position.set(-0.6, 1.31, -0.72);
    this.scene.add(espresso);

    const cup = new THREE.Mesh(
      new THREE.CylinderGeometry(0.12, 0.08, 0.22, 12),
      new THREE.MeshStandardMaterial({ color: '#ffffff' })
    );
    cup.position.set(0.45, 1.2, -0.68);
    this.scene.add(cup);

    // Barista NPC behind counter
    const barista = new THREE.Group();
    barista.position.set(0.05, 0, -1.25);
    const bBody = new THREE.Mesh(
      new THREE.CylinderGeometry(0.18, 0.22, 0.7, 12),
      new THREE.MeshToonMaterial({ color: '#10b981' })
    );
    bBody.position.y = 0.95;
    const bHead = new THREE.Mesh(
      new THREE.SphereGeometry(0.22, 14, 14),
      new THREE.MeshToonMaterial({ color: '#ffe4d6' })
    );
    bHead.position.y = 1.5;
    barista.add(bBody, bHead);
    this.scene.add(barista);

    // Hanging Warm Edison Pendant Lamps
    [-0.75, 0.75].forEach((lx) => {
      const bulb = new THREE.Mesh(
        new THREE.SphereGeometry(0.12, 12, 12),
        new THREE.MeshBasicMaterial({ color: '#fef08a' })
      );
      bulb.position.set(lx, 2.35, -0.5);
      this.scene.add(bulb);
    });

    // Bistro Table & Chair on right
    const table = new THREE.Mesh(
      new THREE.CylinderGeometry(0.45, 0.08, 0.75, 14),
      new THREE.MeshStandardMaterial({ color: '#92400e', roughness: 0.5 })
    );
    table.position.set(1.05, 0.37, 0.55);
    this.scene.add(table);

    // Customer Avatar
    this.customerMesh = new THREE.Group();
    const head = new THREE.Mesh(
      new THREE.SphereGeometry(0.24, 16, 16),
      new THREE.MeshToonMaterial({ color: '#ffe4d6' })
    );
    head.position.y = 1.45;
    const body = new THREE.Mesh(
      new THREE.CylinderGeometry(0.2, 0.25, 0.65, 12),
      new THREE.MeshToonMaterial({ color: '#f59e0b' })
    );
    body.position.y = 0.95;
    this.customerMesh.add(head, body);
    this.customerMesh.position.set(-0.7, 0, 0.65);
    this.scene.add(this.customerMesh);
  }

  public toggleFix(idx: number) {
    if (this.isLevelFinished || idx < 0 || idx >= this.uxOptions.length) return;
    const opt = this.uxOptions[idx];
    opt.picked = !opt.picked;

    const totalGood = this.uxOptions.filter((o) => o.isGood).length;
    const pickedGood = this.uxOptions.filter((o) => o.isGood && o.picked).length;
    const pickedBad = this.uxOptions.filter((o) => !o.isGood && o.picked).length;

    if (opt.picked && !opt.isGood) {
      soundManager.playError();
    } else {
      soundManager.playPickup();
    }

    const base = this.currentLevelData.initialSatisfaction;
    const target = this.currentLevelData.targetSatisfaction;
    const gain = Math.round((pickedGood / Math.max(1, totalGood)) * (target - base));
    this.satisfaction = Math.max(15, Math.min(100, base + gain - pickedBad * 16));

    // Update preview journey steps
    const pickedLabels = this.uxOptions.filter((o) => o.picked).map((o) => o.label);
    this.journeySteps =
      pickedLabels.length > 0 ? pickedLabels : [...this.currentLevelData.beforeSteps];

    if (pickedGood === totalGood && pickedBad === 0 && !this.isLevelFinished) {
      this.isOptimized = true;
      this.isLevelFinished = true;
      this.journeySteps = [...this.currentLevelData.afterSteps];
      soundManager.playCorrect();
      soundManager.playLevelVictory();
    }
  }

  public update(_delta: number, _cameraMode: CameraPerspective = 'tpp') {
    this.customerMesh.position.y = Math.sin(Date.now() * 0.003) * 0.03;
  }
}
