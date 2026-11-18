/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AppLanguage, CharacterArchetypeId, GameId } from '../types';

export interface TranslationBundle {
  common: {
    close: string;
    back: string;
    backToLobby: string;
    lobby: string;
    exit: string;
    settings: string;
    achievements: string;
    mainMenu: string;
    muteAudio: string;
    unmuteAudio: string;
    muteAll: string;
    active: string;
    inactive: string;
    level: string;
    stars: string;
    send: string;
    understand: string;
    retryLevel: string;
    nextLevel: string;
    you: string;
  };
  title: {
    badge: string;
    subtitle: string;
    startAdventure: string;
    customizeCharacter: string;
    lobbyIdPlaceholder: string;
    joinLobbyBtn: string;
    createLobbyBtn: string;
    invitedToLobby: string;
    footerLeft: string;
    miniGamesCount: string;
    animeCharsCount: string;
    proceduralLabel: string;
  };
  settings: {
    title: string;
    languageLabel: string;
    cameraLabel: string;
    tppLabel: string;
    fppLabel: string;
    graphicsLabel: string;
    lowFps: string;
    medFps: string;
    highFps: string;
    audioLabel: string;
    bgmLabel: string;
    sfxLabel: string;
    accessibilityLabel: string;
    highContrast: string;
    reducedMotion: string;
    resetAll: string;
    resetConfirm: string;
    resetConfirmYes: string;
    resetConfirmCancel: string;
  };
  customizer: {
    headerTitle: string;
    dragHint: string;
    saveAndEnter: string;
    chibiTag: string;
    hairColor: string;
    outfitColor: string;
    eyeColor: string;
  };
  lobby: {
    worldMapBtn: string;
    worldMapTitle: string;
    worldMapSubtitle: string;
    youAreHere: string;
    teleportHere: string;
    gateSubtitle: string;
    enterGateBtn: string;
    talkBtn: string;
    speakPrompt: string;
    enterPrompt: string;
    questCompleted: string;
    questDoneMsg: string;
    navHints: string;
    fallRespawnToast: string;
    sprintActive: string;
  };
  multiplayer: {
    title: string;
    playersCount: string;
    roomLabel: string;
    lobbyIdLabel: string;
    hostLabel: string;
    youAreHost: string;
    switchRoom: string;
    joinRoomPlaceholder: string;
    joinBtn: string;
    createRoomBtn: string;
    copyLobbyId: string;
    copyInviteLink: string;
    copiedLobbyId: string;
    copiedInviteLink: string;
    activeServers: string;
    shareHint: string;
    connected: string;
    connecting: string;
    disconnected: string;
    roomFullError: string;
    chatPlaceholder: string;
    noMessages: string;
    maxPlayersNote: string;
  };
  emote: {
    btnLabel: string;
    tooltip: string;
    cmdTooltip: string;
    cmdPlaceholder: string;
    labels: Record<'cheer' | 'dance' | 'wave' | 'bow' | 'think', string>;
  };
  virtualControls: {
    interactBtn: string;
    jumpBtn: string;
    sprintBtn: string;
    legendMove: string;
    legendJump: string;
    legendSprint: string;
    legendInteract: string;
  };
  dialogue: {
    headerTag: string;
    escClose: string;
    startChallenge: string;
    closeChat: string;
    fastForwardHint: string;
    footerBrand: string;
    qRules: string;
    qObjectives: string;
    qTips: string;
    qStart: string;
    qStartResponse: string;
    qBye: string;
    qByeResponse: string;
  };
  victory: {
    tag: string;
    greatJob: string;
    solvedPrefix: string;
    whyTitle: string;
    xpEarned: string;
  };
  leaderboard: {
    title: string;
    currentRank: string;
    ranks: {
      master: string;
      architect: string;
      explorer: string;
      apprentice: string;
    };
    badgesCollection: string;
    unlockedCount: string;
    subjectsProgress: string;
  };
  games: {
    selectLevelTitle: string;
    twentyStages: string;
    scienceConcept: string;
    gotItContinue: string;
    math: {
      pickLevelTitle: string;
      edubotHint: string;
      bridgeOpenTitle: string;
      bridgeOpenDesc: string;
    };
    physics: {
      angle: string;
      power: string;
      field: string;
      elevationLabel: string;
      springPowerLabel: string;
      switchGravity: string;
      moonLabel: string;
      earthLabel: string;
      launchBtn: string;
      cameraHint: string;
      windLabel: string;
      targetsLabel: string;
    };
    design: {
      harmonyScore: string;
      ruleLabel: string;
      complementary: string;
      analogous: string;
      triadic: string;
      baseHue: string;
      accentHue: string;
    };
    ui: {
      instruction: string;
      aligned: string;
      alignBtn: string;
      toleranceHint: string;
    };
    ux: {
      satisfaction: string;
      persona: string;
      optimizeBtn: string;
      chooseFixes: string;
    };
    chemistry: {
      targetPrefix: string;
      needLabel: string;
      addAtom: string;
    };
    code: {
      linesLabel: string;
      blocksUnit: string;
      targetLabel: string;
      emptyPrompt: string;
      cmdForward: string;
      cmdLeft: string;
      cmdRight: string;
      clearBtn: string;
      runBtn: string;
    };
    biology: {
      organelleLabel: string;
      photonsLabel: string;
      photonCaught: string;
      catchPhoton: string;
      rosWarning: string;
    };
    dungeon: {
      selectRankTitle: string;
      selectRankSub: string;
      hunterEliminated: string;
      eliminatedDesc: string;
      toLobby: string;
    };
  };
}

export const TRANSLATIONS: Record<AppLanguage, TranslationBundle> = {
  id: {
    common: {
      close: '✕ Tutup',
      back: 'Kembali',
      backToLobby: 'Kembali ke Lobi',
      lobby: 'Lobi',
      exit: 'Keluar',
      settings: 'Pengaturan',
      achievements: 'Prestasi & Lencana',
      mainMenu: 'Menu Utama',
      muteAudio: 'Mute Audio',
      unmuteAudio: 'Buka Suara',
      muteAll: 'Mute Semua',
      active: 'Aktif',
      inactive: 'Non-aktif',
      level: 'Level',
      stars: 'Bintang',
      send: 'Kirim',
      understand: 'Mengerti!',
      retryLevel: 'Ulangi Level',
      nextLevel: 'Level Selanjutnya',
      you: 'Kamu',
    },
    title: {
      badge: 'Semesta Belajar 3D',
      subtitle: 'Jelajahi pulau langit 3D, pecahkan teka-teki nyata di 9 dunia mini-game seru, dan bermain bersama hingga 6 pemain di Valworld3D!',
      startAdventure: 'Mulai Petualangan',
      customizeCharacter: 'Kustomisasi Karakter',
      lobbyIdPlaceholder: 'Masukkan ID LOBBY teman (mis. VAL-4829)',
      joinLobbyBtn: 'Masuk ID LOBBY',
      createLobbyBtn: 'Buat Room Baru',
      invitedToLobby: 'Diundang ke ID LOBBY: {id}',
      footerLeft: 'Valworld3D · Dibuat dengan Three.js & Web Audio API',
      miniGamesCount: '9 Dunia 3D',
      animeCharsCount: '8 Karakter Anime',
      proceduralLabel: 'Multiplayer 6 Pemain',
    },
    settings: {
      title: 'Pengaturan',
      languageLabel: 'Bahasa Permainan (Language)',
      cameraLabel: 'Sudut Pandang Kamera (Perspektif)',
      tppLabel: '👤 TPP (Orang Ketiga)',
      fppLabel: '👀 FPP (Orang Pertama)',
      graphicsLabel: 'Kualitas Grafis (FPS & Efek)',
      lowFps: 'Rendah (30 FPS)',
      medFps: 'Sedang',
      highFps: 'Tinggi (60 FPS)',
      audioLabel: 'Volume Suara',
      bgmLabel: 'Musik Latar (BGM)',
      sfxLabel: 'Efek Suara (SFX)',
      accessibilityLabel: 'Kenyamanan & Aksesibilitas',
      highContrast: 'Mode Kontras Tinggi',
      reducedMotion: 'Kurangi Gerakan Kamera',
      resetAll: 'Reset Seluruh Progres',
      resetConfirm: 'Yakin ingin mereset seluruh XP, Level, Lencana, dan Tantangan dari nol?',
      resetConfirmYes: 'Ya, Reset dari Nol',
      resetConfirmCancel: 'Batal',
    },
    customizer: {
      headerTitle: 'Pilih & Kustomisasi Karakter',
      dragHint: 'Geser untuk memutar 360°',
      saveAndEnter: 'Simpan & Masuk Lobi',
      chibiTag: 'Chibi',
      hairColor: 'Warna Rambut',
      outfitColor: 'Warna Pakaian',
      eyeColor: 'Warna Mata',
    },
    lobby: {
      worldMapBtn: 'Peta Dunia',
      worldMapTitle: 'Peta Open World Valworld3D',
      worldMapSubtitle: 'Pilih wilayah mana pun untuk melakukan Teleport / Fast Travel instan',
      youAreHere: 'Kamu di sini',
      teleportHere: 'Teleport ke Sini ➔',
      gateSubtitle: 'Gerbang {subject} · 20 Level',
      enterGateBtn: 'Masuk Gerbang [E]',
      talkBtn: 'Bicara [E]',
      speakPrompt: '[E] Bicara dengan {name}',
      enterPrompt: '[E] Masuk {title}',
      questCompleted: 'SELESAI ⭐',
      questDoneMsg: 'Lencana "{badge}" telah terbuka!',
      navHints: '🖱️ Klik Kiri & Geser: Putar Kamera · Scroll: Zoom · WASD: Gerak · Shift: Sprint · V: TPP/FPP · M: Peta · E: Interaksi',
      fallRespawnToast: 'Kamu terjatuh dari pulau langit! Dikembalikan ke tempat aman.',
      sprintActive: 'SPRINT',
    },
    multiplayer: {
      title: 'Multiplayer',
      playersCount: '{count}/6 Pemain',
      roomLabel: 'Ruang',
      lobbyIdLabel: 'ID LOBBY',
      hostLabel: 'Pemilik Room',
      youAreHost: 'Pemilik',
      switchRoom: 'Ganti Ruang',
      joinRoomPlaceholder: 'Masukkan ID LOBBY (mis. VAL-4829)',
      joinBtn: 'Masuk',
      createRoomBtn: 'Buat ID Baru',
      copyLobbyId: 'Salin ID',
      copyInviteLink: 'Salin Link',
      copiedLobbyId: 'ID LOBBY Disalin!',
      copiedInviteLink: 'Link Undangan Disalin!',
      activeServers: 'Server / Lobby Aktif',
      shareHint: 'Bagikan ID LOBBY atau Link di atas agar pemain dari server mana pun bisa bergabung!',
      connected: 'Terhubung',
      connecting: 'Menghubungkan...',
      disconnected: 'Terputus',
      roomFullError: 'Ruang {roomId} penuh (maksimal 6 pemain)!',
      chatPlaceholder: 'Tulis pesan obrolan...',
      noMessages: 'Belum ada pesan. Sapa temanmu!',
      maxPlayersNote: 'Maksimal 6 pemain per ruang secara real-time.',
    },
    emote: {
      btnLabel: 'Emot (1-5)',
      tooltip: 'Pilih Gerakan Emotikon',
      cmdTooltip: 'Ketik Sintak Emot (/dance, /cheer, dll)',
      cmdPlaceholder: 'Ketik sintak: /dance, /cheer...',
      labels: {
        cheer: 'Bersorak',
        dance: 'Menari',
        wave: 'Melambai',
        bow: 'Hormat',
        think: 'Berpikir',
      },
    },
    virtualControls: {
      interactBtn: 'AKSI [E]',
      jumpBtn: 'LOMPAT',
      sprintBtn: 'LARI',
      legendMove: 'WASD: Bergerak',
      legendJump: 'Space: Lompat',
      legendSprint: 'Shift: Sprint',
      legendInteract: 'E: Interaksi',
    },
    dialogue: {
      headerTag: 'Dialog Interaktif Valworld3D',
      escClose: '[ESC] Keluar Dialog',
      startChallenge: 'Mulai Mainkan {title} (20 Level)',
      closeChat: 'Pamit / Tutup Obrolan',
      fastForwardHint: 'Tekan [Spasi] atau klik untuk mempercepat teks',
      footerBrand: 'Valworld3D Cendekia',
      qRules: 'Bagaimana peraturan tantangan ini?',
      qObjectives: 'Apa tujuan pembelajarannya?',
      qTips: 'Apakah ada tips rahasia?',
      qStart: 'Mulai Tantangan (Level 1 - 20)!',
      qStartResponse: 'Bagus sekali! Persiapkan analisismu, kita mulai sekarang!',
      qBye: 'Sampai jumpa nanti.',
      qByeResponse: 'Selamat menjelajahi pulau-pulau Valworld3D!',
    },
    victory: {
      tag: 'Level Selesai!',
      greatJob: 'Luar Biasa!',
      solvedPrefix: 'Kamu telah memecahkan teka-teki:',
      whyTitle: 'Mengapa Jawabannya Begitu?',
      xpEarned: '+{xp} XP Didapatkan!',
    },
    leaderboard: {
      title: 'Prestasi & Lencana',
      currentRank: 'Pangkat Saat Ini',
      ranks: {
        master: 'Master Semesta',
        architect: 'Arsitek Logika',
        explorer: 'Penjelajah Bintang',
        apprentice: 'Magang Valworld3D',
      },
      badgesCollection: 'Koleksi Lencana ({count} Terbuka)',
      unlockedCount: 'Terbuka',
      subjectsProgress: 'Progres Tantangan (20 Level)',
    },
    games: {
      selectLevelTitle: 'Pilih Level {title}',
      twentyStages: '20 Tingkat Tantangan Pembelajaran Bertahap',
      scienceConcept: 'Konsep Sains: {title}',
      gotItContinue: 'Saya Paham! Lanjutkan Tantangan ➔',
      math: {
        pickLevelTitle: 'Pilih Level Kastil Angka',
        edubotHint: 'Petunjuk EduBot',
        bridgeOpenTitle: 'Persamaan Valid! Jembatan Terbuka!',
        bridgeOpenDesc: 'Berjalanlah menyeberangi jembatan menuju Gerbang Kastil!',
      },
      physics: {
        angle: 'Sudut',
        power: 'Daya',
        field: 'Medan',
        elevationLabel: 'Sudut Elevasi',
        springPowerLabel: 'Daya Tembakan Pegas',
        switchGravity: 'Ganti Gravitasi ({mode})',
        moonLabel: 'Bulan 1.6',
        earthLabel: 'Bumi 9.8',
        launchBtn: 'LUNCURKAN! 🌸',
        cameraHint: '🖱️ Geser mouse pada layar untuk memutar kamera & lihat target · Scroll untuk zoom',
        windLabel: 'Angin',
        targetsLabel: 'Target',
      },
      design: {
        harmonyScore: 'Skor Harmoni',
        ruleLabel: 'Aturan',
        complementary: 'Komplementer',
        analogous: 'Analog',
        triadic: 'Triadik',
        baseHue: 'Hue Warna Gaun Dasar',
        accentHue: 'Hue Warna Aksen',
      },
      ui: {
        instruction: 'Geser & Sejajarkan Kartu Antarmuka ke Garis Kisi 8-Point!',
        aligned: '✓ {label} Rapi',
        alignBtn: 'Luruskan {label}',
        toleranceHint: 'Nudge ◀ ▶ tiap kartu hingga offset di dalam ±0.05',
      },
      ux: {
        satisfaction: 'Kepuasan Pelanggan',
        persona: 'Persona',
        optimizeBtn: 'Optimalkan Alur Layanan Pengguna!',
        chooseFixes: 'Pilih hanya perbaikan UX yang tepat (opsi buruk menurunkan kepuasan)',
      },
      chemistry: {
        targetPrefix: 'Sintesis Molekul Target',
        needLabel: 'Butuh:',
        addAtom: '+ Atom {sym}',
      },
      code: {
        linesLabel: 'Baris Kode: {count} Blok',
        blocksUnit: 'Blok',
        targetLabel: 'Target: Kristal Energi',
        emptyPrompt: 'Klik tombol instruksi untuk menyusun program...',
        cmdForward: 'Maju',
        cmdLeft: 'Kiri',
        cmdRight: 'Kanan',
        clearBtn: 'Hapus',
        runBtn: 'Jalankan',
      },
      biology: {
        organelleLabel: 'Organel',
        photonsLabel: 'Foton Cahaya',
        photonCaught: '✓ Foton {n}',
        catchPhoton: 'Foton {n} ☀️',
        rosWarning: 'Tangkap Foton ☀️ — Hindari Radikal Bebas ☠️!',
      },
      dungeon: {
        selectRankTitle: 'Pilih Tingkat Dungeon Solo Leveling',
        selectRankSub: '20 Gerbang Bayangan dari E-Rank hingga Shadow Monarch',
        hunterEliminated: 'Hunter Tereliminasi!',
        eliminatedDesc: 'Komandan Ksatria berhasil menumbangkanmu. Bangkit kembali dan atur ritme tebasan pedang dan dash bayangan!',
        toLobby: 'Ke Lobi',
      },
    },
  },

  en: {
    common: {
      close: '✕ Close',
      back: 'Back',
      backToLobby: 'Back to Lobby',
      lobby: 'Lobby',
      exit: 'Exit',
      settings: 'Settings',
      achievements: 'Achievements & Badges',
      mainMenu: 'Main Menu',
      muteAudio: 'Mute Audio',
      unmuteAudio: 'Unmute Audio',
      muteAll: 'Mute All',
      active: 'On',
      inactive: 'Off',
      level: 'Level',
      stars: 'Stars',
      send: 'Send',
      understand: 'Got it!',
      retryLevel: 'Retry Level',
      nextLevel: 'Next Level',
      you: 'You',
    },
    title: {
      badge: '3D Learning Universe',
      subtitle: 'Explore floating 3D sky islands, solve puzzles across 9 exciting mini-game worlds, and play together with up to 6 players in Valworld3D!',
      startAdventure: 'Start Adventure',
      customizeCharacter: 'Customize Character',
      lobbyIdPlaceholder: 'Enter owner LOBBY ID (e.g. VAL-4829)',
      joinLobbyBtn: 'Join LOBBY ID',
      createLobbyBtn: 'Create Room',
      invitedToLobby: 'Invited to LOBBY ID: {id}',
      footerLeft: 'Valworld3D · Powered by Three.js & Web Audio API',
      miniGamesCount: '9 3D Worlds',
      animeCharsCount: '8 Anime Characters',
      proceduralLabel: '6-Player Multiplayer',
    },
    settings: {
      title: 'Settings',
      languageLabel: 'Game Language',
      cameraLabel: 'Camera Perspective',
      tppLabel: '👤 TPP (Third-Person)',
      fppLabel: '👀 FPP (First-Person)',
      graphicsLabel: 'Graphics Quality (FPS & Effects)',
      lowFps: 'Low (30 FPS)',
      medFps: 'Medium',
      highFps: 'High (60 FPS)',
      audioLabel: 'Audio Volume',
      bgmLabel: 'Background Music (BGM)',
      sfxLabel: 'Sound Effects (SFX)',
      accessibilityLabel: 'Comfort & Accessibility',
      highContrast: 'High Contrast Mode',
      reducedMotion: 'Reduce Camera Motion',
      resetAll: 'Reset All Progress',
      resetConfirm: 'Reset all XP, Levels, Badges, and Challenge progress back to zero?',
      resetConfirmYes: 'Yes, Reset to Zero',
      resetConfirmCancel: 'Cancel',
    },
    customizer: {
      headerTitle: 'Select & Customize Character',
      dragHint: 'Drag to rotate 360°',
      saveAndEnter: 'Save & Enter Lobby',
      chibiTag: 'Chibi',
      hairColor: 'Hair Color',
      outfitColor: 'Outfit Color',
      eyeColor: 'Eye Color',
    },
    lobby: {
      worldMapBtn: 'World Map',
      worldMapTitle: 'Valworld3D Open World Map',
      worldMapSubtitle: 'Pick any island region for instant Teleport / Fast Travel',
      youAreHere: 'You are here',
      teleportHere: 'Teleport Here ➔',
      gateSubtitle: '{subject} Gate · 20 Levels',
      enterGateBtn: 'Enter Gate [E]',
      talkBtn: 'Talk [E]',
      speakPrompt: '[E] Talk to {name}',
      enterPrompt: '[E] Enter {title}',
      questCompleted: 'COMPLETED ⭐',
      questDoneMsg: 'Badge "{badge}" unlocked!',
      navHints: '🖱️ Left-Drag: Rotate Camera · Scroll: Zoom · WASD: Move · Shift: Sprint · V: TPP/FPP · M: Map · E: Interact',
      fallRespawnToast: 'You fell off the sky island! Returned safely to the plaza.',
      sprintActive: 'SPRINT',
    },
    multiplayer: {
      title: 'Multiplayer',
      playersCount: '{count}/6 Players',
      roomLabel: 'Room',
      lobbyIdLabel: 'LOBBY ID',
      hostLabel: 'Room Owner',
      youAreHost: 'Host',
      switchRoom: 'Switch Room',
      joinRoomPlaceholder: 'Enter LOBBY ID (e.g. VAL-4829)',
      joinBtn: 'Join',
      createRoomBtn: 'New ID',
      copyLobbyId: 'Copy ID',
      copyInviteLink: 'Copy Link',
      copiedLobbyId: 'LOBBY ID Copied!',
      copiedInviteLink: 'Invite Link Copied!',
      activeServers: 'Active Servers / Lobbies',
      shareHint: 'Share your LOBBY ID or Invite Link so any player can enter your room!',
      connected: 'Connected',
      connecting: 'Connecting...',
      disconnected: 'Disconnected',
      roomFullError: 'Room {roomId} is full (max 6 players)!',
      chatPlaceholder: 'Type chat message...',
      noMessages: 'No messages yet. Say hello!',
      maxPlayersNote: 'Real-time multiplayer capped at 6 players per room.',
    },
    emote: {
      btnLabel: 'Emotes (1-5)',
      tooltip: 'Choose Character Emote',
      cmdTooltip: 'Type Emote Command (/dance, /cheer, etc.)',
      cmdPlaceholder: 'Type command: /dance, /cheer...',
      labels: {
        cheer: 'Cheer',
        dance: 'Dance',
        wave: 'Wave',
        bow: 'Bow',
        think: 'Think',
      },
    },
    virtualControls: {
      interactBtn: 'ACT [E]',
      jumpBtn: 'JUMP',
      sprintBtn: 'RUN',
      legendMove: 'WASD: Move',
      legendJump: 'Space: Jump',
      legendSprint: 'Shift: Sprint',
      legendInteract: 'E: Interact',
    },
    dialogue: {
      headerTag: 'Valworld3D Interactive Dialogue',
      escClose: '[ESC] Close Dialogue',
      startChallenge: 'Start {title} (20 Levels)',
      closeChat: 'Farewell / Close',
      fastForwardHint: 'Press [Space] or click to speed up text',
      footerBrand: 'Valworld3D Academy',
      qRules: 'What are the rules of this challenge?',
      qObjectives: 'What are the learning objectives?',
      qTips: 'Do you have any secret tips?',
      qStart: 'Start Challenge (Level 1 - 20)!',
      qStartResponse: 'Excellent! Sharpen your mind, let us begin right now!',
      qBye: 'See you later.',
      qByeResponse: 'Enjoy exploring the floating islands of Valworld3D!',
    },
    victory: {
      tag: 'Stage Cleared!',
      greatJob: 'Awesome Job!',
      solvedPrefix: 'You solved the challenge:',
      whyTitle: 'Why Does This Work?',
      xpEarned: '+{xp} XP Earned!',
    },
    leaderboard: {
      title: 'Achievements & Badges',
      currentRank: 'Current Rank',
      ranks: {
        master: 'Universe Master',
        architect: 'Logic Architect',
        explorer: 'Star Explorer',
        apprentice: 'Valworld3D Apprentice',
      },
      badgesCollection: 'Badge Collection ({count} Unlocked)',
      unlockedCount: 'Unlocked',
      subjectsProgress: 'Challenge Progress (20 Levels)',
    },
    games: {
      selectLevelTitle: 'Select {title} Level',
      twentyStages: '20 Progressive Learning Challenges',
      scienceConcept: 'Science Concept: {title}',
      gotItContinue: 'Got It! Continue Challenge ➔',
      math: {
        pickLevelTitle: 'Select Number Castle Level',
        edubotHint: 'EduBot Hint',
        bridgeOpenTitle: 'Valid Equation! Bridge Raised!',
        bridgeOpenDesc: 'Walk across the crystal bridge to the Castle Gate!',
      },
      physics: {
        angle: 'Angle',
        power: 'Power',
        field: 'Gravity',
        elevationLabel: 'Launch Angle',
        springPowerLabel: 'Spring Launch Power',
        switchGravity: 'Switch Gravity ({mode})',
        moonLabel: 'Moon 1.6',
        earthLabel: 'Earth 9.8',
        launchBtn: 'LAUNCH! 🌸',
        cameraHint: '🖱️ Drag mouse on screen to orbit camera & inspect targets · Scroll to zoom',
        windLabel: 'Wind',
        targetsLabel: 'Targets',
      },
      design: {
        harmonyScore: 'Harmony Score',
        ruleLabel: 'Rule',
        complementary: 'Complementary',
        analogous: 'Analogous',
        triadic: 'Triadic',
        baseHue: 'Base Outfit Hue',
        accentHue: 'Accent Color Hue',
      },
      ui: {
        instruction: 'Nudge & Align UI Cards onto the 8-Point Grid!',
        aligned: '✓ {label} Aligned',
        alignBtn: 'Align {label}',
        toleranceHint: 'Nudge ◀ ▶ each card until offset is within ±0.05',
      },
      ux: {
        satisfaction: 'Customer Satisfaction',
        persona: 'Persona',
        optimizeBtn: 'Optimize User Flow!',
        chooseFixes: 'Select genuine UX fixes only (bad choices hurt satisfaction)',
      },
      chemistry: {
        targetPrefix: 'Target Molecule Synthesis',
        needLabel: 'Need:',
        addAtom: '+ {sym} Atom',
      },
      code: {
        linesLabel: 'Code Queue: {count} Blocks',
        blocksUnit: 'Blocks',
        targetLabel: 'Target: Energy Crystal',
        emptyPrompt: 'Click instruction buttons to build your program...',
        cmdForward: 'Forward',
        cmdLeft: 'Left',
        cmdRight: 'Right',
        clearBtn: 'Clear',
        runBtn: 'Run',
      },
      biology: {
        organelleLabel: 'Organelle',
        photonsLabel: 'Light Photons',
        photonCaught: '✓ Photon {n}',
        catchPhoton: 'Photon {n} ☀️',
        rosWarning: 'Catch Photons ☀️ — Avoid Toxic ROS ☠️!',
      },
      dungeon: {
        selectRankTitle: 'Select Solo Leveling Dungeon Gate',
        selectRankSub: '20 Shadow Gates from E-Rank to Shadow Monarch',
        hunterEliminated: 'Hunter Eliminated!',
        eliminatedDesc: 'The Knight Commander struck you down. Rise again and time your slashes and shadow dashes!',
        toLobby: 'To Lobby',
      },
    },
  },

  ja: {
    common: {
      close: '✕ 閉じる',
      back: '戻る',
      backToLobby: 'ロビーへ戻る',
      lobby: 'ロビー',
      exit: '退出',
      settings: '設定',
      achievements: '実績・バッジ',
      mainMenu: 'タイトルへ',
      muteAudio: 'ミュート',
      unmuteAudio: '音声オン',
      muteAll: 'すべて消音',
      active: 'オン',
      inactive: 'オフ',
      level: 'レベル',
      stars: 'スター',
      send: '送信',
      understand: 'わかった！',
      retryLevel: 'やり直す',
      nextLevel: '次のレベル',
      you: 'あなた',
    },
    title: {
      badge: '3D ラーニング・ユニバース',
      subtitle: '浮遊する3Dスカイアイランドを冒険し、9つの楽しいミニゲームに挑戦しよう！最大6人のマルチプレイにも対応！',
      startAdventure: '冒険をはじめる',
      customizeCharacter: 'キャラカスタマイズ',
      lobbyIdPlaceholder: 'ロビーIDを入力 (例: VAL-4829)',
      joinLobbyBtn: 'IDで参加',
      createLobbyBtn: 'ルーム作成',
      invitedToLobby: '招待されたロビーID: {id}',
      footerLeft: 'Valworld3D · Three.js & Web Audio API',
      miniGamesCount: '9つの3Dワールド',
      animeCharsCount: '8人のアニメキャラ',
      proceduralLabel: '最大6人マルチプレイ',
    },
    settings: {
      title: '設定',
      languageLabel: '言語設定 (Language)',
      cameraLabel: 'カメラ視点モード',
      tppLabel: '👤 TPP（三人称視点）',
      fppLabel: '👀 FPP（一人称視点）',
      graphicsLabel: 'グラフィック品質 (FPS・効果)',
      lowFps: '低 (30 FPS)',
      medFps: '標準',
      highFps: '高 (60 FPS)',
      audioLabel: '音量設定',
      bgmLabel: 'BGM音量',
      sfxLabel: '効果音 (SFX) 音量',
      accessibilityLabel: '快適さ・アクセシビリティ',
      highContrast: 'ハイコントラストモード',
      reducedMotion: 'カメラの揺れを軽減',
      resetAll: 'すべての進行をリセット',
      resetConfirm: 'XP・レベル・バッジ・チャレンジ進行をすべてゼロに戻しますか？',
      resetConfirmYes: 'はい、リセットする',
      resetConfirmCancel: 'キャンセル',
    },
    customizer: {
      headerTitle: 'キャラクター選択・カスタマイズ',
      dragHint: 'ドラッグで360°回転',
      saveAndEnter: '保存してロビーへ',
      chibiTag: 'ちび',
      hairColor: '髪の色',
      outfitColor: '衣装の色',
      eyeColor: '瞳の色',
    },
    lobby: {
      worldMapBtn: 'ワールドマップ',
      worldMapTitle: 'Valworld3D オープンワールドマップ',
      worldMapSubtitle: '行きたいエリアを選んで瞬時にワープ移動できます',
      youAreHere: '現在地',
      teleportHere: 'ここへワープ ➔',
      gateSubtitle: '{subject}ゲート · 全20レベル',
      enterGateBtn: 'ゲートへ入る [E]',
      talkBtn: '会話する [E]',
      speakPrompt: '[E] {name}と話す',
      enterPrompt: '[E] {title}へ入る',
      questCompleted: '達成 ⭐',
      questDoneMsg: 'バッジ「{badge}」を獲得しました！',
      navHints: '🖱️ 左ドラッグ: 視点回転 · スクロール: 拡大縮小 · WASD: 移動 · Shift: ダッシュ · V: 視点切替 · M: マップ · E: 決定',
      fallRespawnToast: '空の島から落ちました！中央広場へ戻りました。',
      sprintActive: 'ダッシュ',
    },
    multiplayer: {
      title: 'マルチプレイ',
      playersCount: '{count}/6 人参加中',
      roomLabel: 'ルーム',
      lobbyIdLabel: 'ロビーID',
      hostLabel: 'ルームオーナー',
      youAreHost: 'オーナー',
      switchRoom: 'ルーム変更',
      joinRoomPlaceholder: 'ロビーIDを入力 (例: VAL-4829)',
      joinBtn: '参加',
      createRoomBtn: '新規ID作成',
      copyLobbyId: 'IDコピー',
      copyInviteLink: '招待リンク',
      copiedLobbyId: 'ロビーIDをコピーしました！',
      copiedInviteLink: '招待リンクをコピーしました！',
      activeServers: '公開サーバー / ロビー一覧',
      shareHint: 'ロビーIDまたは招待リンクを共有すると、どのプレイヤーも同じ部屋に参加できます！',
      connected: '接続済み',
      connecting: '接続中...',
      disconnected: '切断',
      roomFullError: 'ルーム {roomId} は満員です（最大6人）！',
      chatPlaceholder: 'チャットを入力...',
      noMessages: 'メッセージはまだありません。挨拶しよう！',
      maxPlayersNote: '1ルーム最大6人までリアルタイム同時プレイ可能。',
    },
    emote: {
      btnLabel: 'エモート (1-5)',
      tooltip: 'キャラクターエモートを選択',
      cmdTooltip: 'コマンド入力 (/dance, /cheer など)',
      cmdPlaceholder: 'コマンド入力: /dance, /cheer...',
      labels: {
        cheer: '応援',
        dance: 'ダンス',
        wave: '手を振る',
        bow: 'お辞儀',
        think: '考える',
      },
    },
    virtualControls: {
      interactBtn: '話す/調べる [E]',
      jumpBtn: 'ジャンプ',
      sprintBtn: 'ダッシュ',
      legendMove: 'WASD: 移動',
      legendJump: 'Space: ジャンプ',
      legendSprint: 'Shift: ダッシュ',
      legendInteract: 'E: 決定/会話',
    },
    dialogue: {
      headerTag: 'Valworld3D インタラクティブ会話',
      escClose: '[ESC] 会話を閉じる',
      startChallenge: '{title} を開始（全20レベル）',
      closeChat: '会話を終える',
      fastForwardHint: '[Space] またはクリックで文字送りを早める',
      footerBrand: 'Valworld3D アカデミー',
      qRules: 'このチャレンジのルールは？',
      qObjectives: '学習目標は何ですか？',
      qTips: '攻略のヒントはありますか？',
      qStart: 'チャレンジを開始する (Lv 1 - 20)！',
      qStartResponse: '素晴らしい意気込みだ！準備ができたら今すぐ始めよう！',
      qBye: 'また後で！',
      qByeResponse: 'Valworld3Dの島々の冒険を楽しんでね！',
    },
    victory: {
      tag: 'ステージクリア！',
      greatJob: 'お見事！',
      solvedPrefix: 'クリアしたチャレンジ:',
      whyTitle: '解説・なぜそうなるの？',
      xpEarned: '+{xp} XP 獲得！',
    },
    leaderboard: {
      title: '実績・バッジ',
      currentRank: '現在のランク',
      ranks: {
        master: 'ユニバースマスター',
        architect: '論理の設計者',
        explorer: '星の探検家',
        apprentice: 'Valworld3D見習い',
      },
      badgesCollection: 'バッジコレクション（{count}個解除）',
      unlockedCount: '解除済み',
      subjectsProgress: 'チャレンジ進行状況（全20レベル）',
    },
    games: {
      selectLevelTitle: '{title} レベル選択',
      twentyStages: '段階的に学べる全20ステージ',
      scienceConcept: '学習ポイント: {title}',
      gotItContinue: '理解した！チャレンジを続ける ➔',
      math: {
        pickLevelTitle: '数字の城 レベル選択',
        edubotHint: 'エデュボットのヒント',
        bridgeOpenTitle: '数式が成立！クリスタル橋が出現！',
        bridgeOpenDesc: '橋を渡ってお城のゲートへ向かおう！',
      },
      physics: {
        angle: '角度',
        power: 'パワー',
        field: '重力',
        elevationLabel: '発射角度',
        springPowerLabel: 'カタパルト威力',
        switchGravity: '重力を切替 ({mode})',
        moonLabel: '月 1.6',
        earthLabel: '地球 9.8',
        launchBtn: '発射する！🌸',
        cameraHint: '🖱️ 画面をドラッグしてカメラを動かしターゲットを確認 · スクロールで拡大縮小',
        windLabel: '風速',
        targetsLabel: 'ターゲット',
      },
      design: {
        harmonyScore: '調和スコア',
        ruleLabel: '配色ルール',
        complementary: '補色',
        analogous: '類似色',
        triadic: 'トライアド',
        baseHue: 'ベース衣装の色相',
        accentHue: 'アクセント色相',
      },
      ui: {
        instruction: 'サイバーUIカードを8ポイントグリッドへ微調整して整列させよう！',
        aligned: '✓ {label} 整列済み',
        alignBtn: '{label} を整列',
        toleranceHint: '◀ ▶ で各カードのズレを ±0.05 以内に合わせよう',
      },
      ux: {
        satisfaction: '顧客満足度',
        persona: 'ペルソナ',
        optimizeBtn: 'ユーザー体験フローを最適化！',
        chooseFixes: '正しいUX改善のみを選択しよう（悪い選択肢は満足度が下がります）',
      },
      chemistry: {
        targetPrefix: '合成する分子ターゲット',
        needLabel: '必要:',
        addAtom: '+ {sym} 原子',
      },
      code: {
        linesLabel: '命令コード: {count} ブロック',
        blocksUnit: 'ブロック',
        targetLabel: '目標: エネルギークリスタル',
        emptyPrompt: '下の命令ボタンを押してプログラムを組もう...',
        cmdForward: '前進',
        cmdLeft: '左回転',
        cmdRight: '右回転',
        clearBtn: '消去',
        runBtn: '実行',
      },
      biology: {
        organelleLabel: '細胞小器官',
        photonsLabel: '光量子 (フォトン)',
        photonCaught: '✓ フォトン {n}',
        catchPhoton: 'フォトン {n} ☀️',
        rosWarning: 'フォトン ☀️ を集めて活性酸素 ☠️ を避けよう！',
      },
      dungeon: {
        selectRankTitle: '俺だけレベルアップ・ダンジョン選択',
        selectRankSub: 'E級から影の君主までの全20ゲート',
        hunterEliminated: 'ハンター戦闘不能！',
        eliminatedDesc: '騎士団長に倒されてしまった。再び立ち上がり、剣撃と影のダッシュで勝利を掴め！',
        toLobby: 'ロビーへ',
      },
    },
  },
};

export interface LocalizedGameStrings {
  title: string;
  subject: string;
  tagline: string;
  badgeName: string;
  guardianTitle: string;
  guardianGreeting: string;
  guardianRules: string[];
  guardianObjectives: string[];
  guardianProTip: string;
}

export const LOCALIZED_GAMES: Record<AppLanguage, Record<GameId, LocalizedGameStrings>> = {
  id: {
    math: {
      title: 'Kastil Angka',
      subject: 'Matematika',
      tagline: 'Rangkai balok angka dan bangun jembatan kristal melintasi jurang awan!',
      badgeName: 'Arsitek Pecahan & Aljabar',
      guardianTitle: 'Pustakawan Aritmatika Kastil',
      guardianGreeting: 'Salam, calon cendekia! Kastil Angka menguji ketajaman logikamu dalam menyeimbangkan angka.',
      guardianRules: [
        'Dekati balok angka di pelataran dan tekan [E] untuk mengambilnya.',
        'Bawa balok tersebut ke soket jembatan yang kosong dan tekan [E] untuk memasangnya.',
        'Jika seluruh slot terpenuhi dan membentuk persamaan yang benar, jembatan kristal akan naik dari awan.',
        'Seberangi jembatan menuju Gerbang Kastil untuk membuka tantangan berikutnya!',
      ],
      guardianObjectives: [
        'Memahami penjumlahan, pengurangan, dan perkalian sebagai relasi seimbang.',
        'Menemukan pola barisan angka dan pecahan berpenyebut sama.',
        'Menyelesaikan aljabar sederhana dan sistem persamaan linier.',
      ],
      guardianProTip: 'Jika menemui kebuntuan, tombol Petunjuk siap memberikan arahan logis.',
    },
    physics: {
      title: 'Sakura Launch',
      subject: 'Fisika',
      tagline: 'Kuasai sudut, trajektori pegas, dan gravitasi planet di desa sakura.',
      badgeName: 'Master Balistik Newton',
      guardianTitle: 'Master Balistik Kinematika',
      guardianGreeting: 'Konnichiwa! Di desa sakura ini, angin dan gravitasi akan menjadi teman belajarmu.',
      guardianRules: [
        'Atur sudut elevasi ketapel bambu (antara 15° hingga 75°) menggunakan slider.',
        'Tarik daya pegas ketapel sesuai jarak target lentera.',
        'Geser layar dengan mouse untuk mengamati posisi target lentera.',
        'Tekan "LUNCURKAN!" dan perhatikan lintasan kurva parabola yang terbentuk!',
      ],
      guardianObjectives: [
        'Memahami hubungan sudut elevasi dan kecepatan awal terhadap jarak tempuh mendatar.',
        'Menganalisis dampak gravitasi planet terhadap tinggi maksimum proyektil.',
      ],
      guardianProTip: 'Sudut peluncuran 45 derajat menghasilkan jarak jangkauan terjauh pada daya tembakan yang sama!',
    },
    design: {
      title: 'Atelier Warna',
      subject: 'Desain Grafis',
      tagline: 'Eksplorasi harmoni warna komplementer, analogus, dan estetika visual.',
      badgeName: 'Kurator Spektrum Emas',
      guardianTitle: 'Kurator Harmoni Visual Pop',
      guardianGreeting: 'Bonjour! Selamat datang di Atelier Warna. Mari kita ciptakan komposisi visual yang memukau mata dunia.',
      guardianRules: [
        'Pilih aturan harmoni warna (Komplementer, Analog, atau Triadik).',
        'Putar slider Hue untuk memilih warna dasar dan aksen manekin.',
        'Capai skor harmoni tinggi untuk menyelesaikan level!',
      ],
      guardianObjectives: [
        'Mengenal lingkaran warna 12 nada.',
        'Membedakan harmoni komplementer dan analogus.',
      ],
      guardianProTip: 'Gunakan aturan 60-30-10 untuk komposisi warna yang seimbang!',
    },
    ui: {
      title: 'Neon Interface',
      subject: 'UI Design',
      tagline: 'Perbaiki tata letak antarmuka cyberpunk: alignment, hierarki, dan kontras.',
      badgeName: 'Insinyur Pixel Perfect',
      guardianTitle: 'Insinyur Sistem Hologram Kota Cyber',
      guardianGreeting: 'Sistem mengalami distorsi tata letak! Bantu saya menata kembali kartu antarmuka sebelum server reboot.',
      guardianRules: [
        'Periksa kartu antarmuka yang posisinya berantakan.',
        'Tekan tombol luruskan untuk meratakan ke kisi 8-point.',
      ],
      guardianObjectives: [
        'Menerapkan prinsip perataan (Alignment) dan spasi konsisten.',
      ],
      guardianProTip: 'Gunakan kelipatan 8px untuk ritme visual yang kokoh.',
    },
    ux: {
      title: 'Kafe Pengguna',
      subject: 'UX Design',
      tagline: 'Pahami persona pelanggan dan perbaiki alur pesanan di kafe diorama 3D.',
      badgeName: 'Empati Pengguna Prima',
      guardianTitle: 'Spesialis Alur Pengalaman Kafe',
      guardianGreeting: 'Selamat datang di Kafe Pengguna! Alur yang mulus adalah rahasia senyum pelanggan.',
      guardianRules: [
        'Periksa persona pelanggan dan tahapan pesanan.',
        'Optimalkan alur layanan untuk menghapus friksi!',
      ],
      guardianObjectives: [
        'Mempraktikkan riset empati pengguna berdasarkan persona nyata.',
      ],
      guardianProTip: 'Prioritaskan langkah yang menghilangkan keraguan pengguna sejak awal!',
    },
    chemistry: {
      title: 'Lab Bintang',
      subject: 'Kimia',
      tagline: 'Rakit atom 3D menjadi molekul ajaib di stasiun luar angkasa nol gravitasi.',
      badgeName: 'Alkemis Molekul Bintang',
      guardianTitle: 'Kepala Riset Molekul Kosmik',
      guardianGreeting: 'Selamat datang di stasiun nol gravitasi! Partikel unsur kimia siap kamu rangkai menjadi molekul.',
      guardianRules: [
        'Tambahkan atom H, O, C, dan N sesuai rumus senyawa target.',
        'Lengkapi seluruh atom untuk menyelesaikan sintesis!',
      ],
      guardianObjectives: [
        'Mengenal rumus kimia dan perbandingan atom dalam senyawa nyata.',
      ],
      guardianProTip: 'Perhatikan angka indeks pada rumus kimia seperti H₂O atau CH₄!',
    },
    code: {
      title: 'Robo Labirin',
      subject: 'Logika Koding',
      tagline: 'Program robot chibi dengan blok perintah urutan, perulangan, dan kondisi.',
      badgeName: 'Pakar Algoritma Cilik',
      guardianTitle: 'Arsitek Algoritma Robotik',
      guardianGreeting: 'Inisialisasi berhasil! Robot penjelajah butuh algoritma tepat menuju kristal energi.',
      guardianRules: [
        'Susun instruksi Maju, Kiri, dan Kanan.',
        'Tekan Jalankan untuk menggerakkan robot menuju kristal!',
      ],
      guardianObjectives: [
        'Berpikir algoritmik berurutan dan debugging.',
      ],
      guardianProTip: 'Bayangkan arah hadap robot sebelum berbelok kiri atau kanan!',
    },
    biology: {
      title: 'Hutan Sel',
      subject: 'Biologi',
      tagline: 'Menyusut ke dalam sel raksasa bioluminescent dan selamatkan organel inti!',
      badgeName: 'Penjelajah Mikrokosmos Sel',
      guardianTitle: 'Penjaga Ekosistem Sel Tumbuhan',
      guardianGreeting: 'Selamat datang di skala mikron! Sel raksasa ini membutuhkan foton cahaya untuk berenergi.',
      guardianRules: [
        'Tangkap seluruh partikel foton cahaya matahari yang dibutuhkan organel.',
      ],
      guardianObjectives: [
        'Mengenal organel sel eukariotik dan tahapan fotosintesis.',
      ],
      guardianProTip: 'Kloroplas menangkap cahaya untuk menghasilkan energi kehidupan!',
    },
    dungeon: {
      title: 'Dungeon Gerbang Bayangan',
      subject: 'Aksi Solo Leveling',
      tagline: 'Tebasan pedang bayangan, proyektil sihir ungu, dan aktifkan Ultimate Monarch!',
      badgeName: 'Shadow Monarch Sovereign',
      guardianTitle: 'Panglima Bayangan Monarki',
      guardianGreeting: 'Gerbang dimensi merah terbuka. Apakah kamu berani menghadapi pasukan bayangan?',
      guardianRules: [
        'Tekan [J] / Pedang untuk tebasan kombo, [K] / Sihir untuk tembakan jarak jauh.',
        'Tekan [Spasi] untuk dash menghindar.',
        'Kalahkan 3 prajurit bayangan untuk mengisi Ultimate [Q]: ARISE!',
        'Kalahkan Boss di tiap lantai untuk menembus 20 Level Dungeon!',
      ],
      guardianObjectives: [
        'Melatih refleks serangan pedang, sihir jarak jauh, dan manajemen MP/HP.',
      ],
      guardianProTip: 'Kalahkan 3 monster kecil terlebih dahulu untuk meledakkan Ultimate ke arah Boss!',
    },
  },

  en: {
    math: {
      title: 'Number Castle',
      subject: 'Mathematics',
      tagline: 'Assemble number blocks and raise crystal bridges across the sky abyss!',
      badgeName: 'Fraction & Algebra Architect',
      guardianTitle: 'Castle Arithmetic Librarian',
      guardianGreeting: 'Greetings, young scholar! Number Castle tests your logic in balancing mathematical equations.',
      guardianRules: [
        'Approach number blocks in the courtyard and press [E] to pick them up.',
        'Carry the block to an empty bridge socket and press [E] to place it.',
        'When all slots form a true equation, the crystal bridge rises from the clouds.',
        'Cross the bridge to the Castle Gate to clear the stage!',
      ],
      guardianObjectives: [
        'Master addition, subtraction, multiplication, and fractions as balanced equations.',
        'Solve foundational algebra and linear pattern puzzles.',
      ],
      guardianProTip: 'If you get stuck, tap the Hint button for a logical clue without spoiling the answer.',
    },
    physics: {
      title: 'Sakura Launch',
      subject: 'Physics',
      tagline: 'Master launch angles, spring force, and planetary gravity in Sakura Village.',
      badgeName: 'Newton Ballistics Master',
      guardianTitle: 'Kinematics Ballistics Master',
      guardianGreeting: 'Konnichiwa! Here in Sakura Village, wind and gravity will become your greatest teachers.',
      guardianRules: [
        'Adjust the bamboo catapult angle (15° to 75°) with the slider.',
        'Set spring launch power to reach the glowing lantern targets.',
        'Drag the screen with your mouse to rotate the camera and spot distant targets.',
        'Press "LAUNCH!" and observe the parabolic trajectory curve!',
      ],
      guardianObjectives: [
        'Understand how launch angle and initial speed determine horizontal range.',
        'Analyze how different planetary gravities change projectile arcs.',
      ],
      guardianProTip: 'A 45-degree launch angle yields the longest range on flat ground for the same launch power!',
    },
    design: {
      title: 'Color Atelier',
      subject: 'Graphic Design',
      tagline: 'Explore complementary, analogous, and triadic color harmony in 3D.',
      badgeName: 'Golden Spectrum Curator',
      guardianTitle: 'Pop Visual Harmony Curator',
      guardianGreeting: 'Bonjour! Welcome to the Color Atelier. Let us craft stunning, balanced palettes!',
      guardianRules: [
        'Choose the requested harmony rule (Complementary, Analogous, or Triadic).',
        'Adjust the Base and Accent Hue sliders until the harmony score peaks.',
      ],
      guardianObjectives: [
        'Understand the 12-tone color wheel and complementary contrasts.',
      ],
      guardianProTip: 'Apply the 60-30-10 rule for balanced visual composition!',
    },
    ui: {
      title: 'Neon Interface',
      subject: 'UI Design',
      tagline: 'Fix cyberpunk interface layouts: alignment, hierarchy, and visual balance.',
      badgeName: 'Pixel Perfect Engineer',
      guardianTitle: 'Cyber City Hologram Engineer',
      guardianGreeting: 'The interface grid is distorted! Help realign the holographic cards before reboot.',
      guardianRules: [
        'Inspect misaligned cyberpunk UI panels in 3D.',
        'Click Align on each card to snap them cleanly onto the 8-point grid.',
      ],
      guardianObjectives: [
        'Apply alignment, consistent spacing, and clear visual hierarchy.',
      ],
      guardianProTip: 'Consistent 8px spacing multiples keep interfaces crisp and scannable.',
    },
    ux: {
      title: 'User Cafe',
      subject: 'UX Design',
      tagline: 'Understand user personas and streamline order flows in a 3D cafe diorama.',
      badgeName: 'Prime User Empathy',
      guardianTitle: 'Cafe Experience Flow Specialist',
      guardianGreeting: 'Welcome to User Cafe! Seamless customer journeys are the secret behind every smile.',
      guardianRules: [
        'Review the active customer persona and current ordering steps.',
        'Optimize the journey to eliminate friction and boost satisfaction!',
      ],
      guardianObjectives: [
        'Practice user empathy and identify drop-off friction points.',
      ],
      guardianProTip: 'Remove unnecessary steps early in the checkout journey!',
    },
    chemistry: {
      title: 'Star Lab',
      subject: 'Chemistry',
      tagline: 'Assemble 3D atoms into molecules inside a zero-gravity orbital station.',
      badgeName: 'Star Molecule Alchemist',
      guardianTitle: 'Cosmic Molecular Research Lead',
      guardianGreeting: 'Welcome aboard the zero-G station! Combine chemical elements into life-sustaining molecules.',
      guardianRules: [
        'Add H, O, C, and N atoms matching the target chemical formula.',
        'Complete the exact atom count to trigger molecular synthesis!',
      ],
      guardianObjectives: [
        'Recognize real chemical formulas and molecular composition.',
      ],
      guardianProTip: 'Count the subscripts carefully—like 2 Hydrogens and 1 Oxygen for H₂O!',
    },
    code: {
      title: 'Robo Maze',
      subject: 'Coding Logic',
      tagline: 'Program a chibi explorer robot using sequential logic and turn commands.',
      badgeName: 'Little Algorithm Expert',
      guardianTitle: 'Robotics Algorithm Architect',
      guardianGreeting: 'System initialized! Our explorer bot needs clean instructions to reach the energy crystal.',
      guardianRules: [
        'Queue Forward, Left, and Right commands in sequence.',
        'Hit Run to watch the robot execute your code step-by-step!',
      ],
      guardianObjectives: [
        'Build sequential algorithmic thinking and step-by-step debugging skills.',
      ],
      guardianProTip: 'Trace the robot’s facing direction in your head before adding Left or Right turns!',
    },
    biology: {
      title: 'Cell Forest',
      subject: 'Biology',
      tagline: 'Shrink to micron scale inside a bioluminescent plant cell and energize organelles!',
      badgeName: 'Cell Microcosm Explorer',
      guardianTitle: 'Plant Cell Ecosystem Guardian',
      guardianGreeting: 'You have shrunk to micron scale! Help the glowing cell organelles capture sunlight photons.',
      guardianRules: [
        'Catch all required sunlight photons to power photosynthesis and ATP synthesis.',
      ],
      guardianObjectives: [
        'Identify key plant cell organelles and how light fuels cellular energy.',
      ],
      guardianProTip: 'Chloroplasts capture light energy so mitochondria can fuel the entire cell!',
    },
    dungeon: {
      title: 'Shadow Gate Dungeon',
      subject: 'Solo Leveling Action',
      tagline: 'Unleash shadow blades, purple arcane bolts, and Monarch Ultimate strikes!',
      badgeName: 'Shadow Monarch Sovereign',
      guardianTitle: 'Shadow Monarch Commander',
      guardianGreeting: 'The crimson dimensional gate stands open. Dare you face the shadow legion inside?',
      guardianRules: [
        'Press [J] / Sword for melee slash combos, [K] / Magic for arcane ranged bolts.',
        'Press [Space] to shadow-dash away from boss swings.',
        'Defeat 3 shadow soldiers to charge Ultimate [Q]: ARISE!',
        'Defeat the Boss on every floor across 20 Dungeon Levels!',
      ],
      guardianObjectives: [
        'Master combat timing, dodge dashes, and resource management.',
      ],
      guardianProTip: 'Clear the 3 smaller shadow minions first to unleash your Ultimate straight onto the Boss!',
    },
  },

  ja: {
    math: {
      title: '数字の城',
      subject: '算数・数学',
      tagline: '数字ブロックを組み合わせて、雲の谷を渡るクリスタルの橋を架けよう！',
      badgeName: '分数・代数の建築家',
      guardianTitle: '城の算術司書',
      guardianGreeting: 'ようこそ若き賢者よ！数字の城では論理とバランスの力が試されるぞ。',
      guardianRules: [
        '広場の数字ブロックに近づき、[E]キーで持ち上げよう。',
        '空いている橋のスロットへ運び、[E]キーでセットしよう。',
        '正しい数式が完成すると、雲の中からクリスタルの橋が出現する！',
        '橋を渡って城のゲートへたどり着けばクリアだ！',
      ],
      guardianObjectives: [
        '四則演算と分数をバランスの関係として理解する。',
        '簡単な一次方程式と数列パターンを解き明かす。',
      ],
      guardianProTip: '迷ったときはヒントボタンで論理の道しるべを確認しよう！',
    },
    physics: {
      title: 'サクラ・ローンチ',
      subject: '物理',
      tagline: '桜の里で発射角度・バネの力・惑星の重力をマスターしよう。',
      badgeName: 'ニュートン弾道マスター',
      guardianTitle: '運動学・弾道マスター',
      guardianGreeting: 'こんにちは！この桜の里では、風と重力がキミの最高の先生になるよ。',
      guardianRules: [
        'スライダーで竹カタパルトの角度（15°〜75°）を調整しよう。',
        'ランタンの距離に合わせて発射パワーを合わせよう。',
        '画面をマウスでドラッグするとカメラを回してターゲットの位置をよく確認できるよ。',
        '「発射する！」を押して放物線の軌跡を観察しよう！',
      ],
      guardianObjectives: [
        '発射角度と初速度が飛距離に与える関係を理解する。',
        '月や木星など異なる重力が軌道に及ぼす影響を学ぶ。',
      ],
      guardianProTip: '同じ発射パワーなら、角度45度が最も遠くまで飛ぶ黄金角だよ！',
    },
    design: {
      title: 'カラーアトリエ',
      subject: 'グラフィックデザイン',
      tagline: '補色・類似色・トライアド配色の調和を3Dスタジオで体験しよう。',
      badgeName: 'ゴールデンスペクトラム学芸員',
      guardianTitle: 'ポップビジュアル調和キュレーター',
      guardianGreeting: 'ボンジュール！カラーアトリエへようこそ。美しい配色バランスを生み出そう！',
      guardianRules: [
        '指定された配色ルール（補色・類似色・トライアド）を選択しよう。',
        'ベース色相とアクセント色相を調整して調和スコアを上げよう！',
      ],
      guardianObjectives: [
        '12色相環と美しいコントラスト配色の基礎を学ぶ。',
      ],
      guardianProTip: 'ベース60%・サブ30%・アクセント10%の比率が美しく見える秘訣！',
    },
    ui: {
      title: 'ネオン・インターフェース',
      subject: 'UIデザイン',
      tagline: 'サイバー空間のUIレイアウトのズレ・階層・視認性を修復しよう！',
      badgeName: 'ピクセルパーフェクト技師',
      guardianTitle: 'サイバーシティ・ホログラム技師',
      guardianGreeting: 'システムUIのレイアウトが崩れている！再起動前にカードを整列させてくれ！',
      guardianRules: [
        'ズレているサイバーパネルを確認しよう。',
        '整列ボタンを押して8ポイントグリッドにぴったり合わせよう！',
      ],
      guardianObjectives: [
        '整列（アライメント）と一貫した余白設計を身につける。',
      ],
      guardianProTip: '8の倍数で余白を作ると一気にプロらしい画面になるよ！',
    },
    ux: {
      title: 'ユーザーカフェ',
      subject: 'UXデザイン',
      tagline: '3Dカフェで顧客ペルソナに共感し、注文体験のストレスを解消しよう。',
      badgeName: 'ユーザー共感マスター',
      guardianTitle: 'カフェ体験フロー設計士',
      guardianGreeting: 'ユーザーカフェへようこそ！迷いのない体験フローがお客様を笑顔にするんだ。',
      guardianRules: [
        'お客様のペルソナと注文ステップを確認しよう。',
        '最適化ボタンでボトルネックを取り除こう！',
      ],
      guardianObjectives: [
        'ペルソナ視点に立った共感リサーチと体験改善を学ぶ。',
      ],
      guardianProTip: '最初の迷いをなくすだけで満足度は劇的に向上するよ！',
    },
    chemistry: {
      title: 'スターラボ',
      subject: '化学',
      tagline: '無重力の宇宙ステーションで3D原子を組み立てて分子を合成しよう。',
      badgeName: '星分子の錬金術師',
      guardianTitle: '宇宙分子研究所長',
      guardianGreeting: '無重力ステーションへようこそ！宇宙に浮かぶ原子を組み合わせて分子を作ろう。',
      guardianRules: [
        '目標の化学式に合わせて H, O, C, N 原子を追加しよう。',
        '必要な原子をすべて揃えると分子合成が完了！',
      ],
      guardianObjectives: [
        '化学式と分子を構成する原子の比率を理解する。',
      ],
      guardianProTip: 'H₂Oなら水素(H)が2つ、酸素(O)が1つ。添字をよく見よう！',
    },
    code: {
      title: 'ロボ迷路',
      subject: 'プログラミング論理',
      tagline: '順次処理と回転ブロックでちびロボットを結晶まで導こう。',
      badgeName: 'ちびアルゴリズム博士',
      guardianTitle: 'ロボティクス・アルゴリズム設計者',
      guardianGreeting: 'システム起動完了！探査ロボをエネルギークリスタルまで導く命令を組んでくれ！',
      guardianRules: [
        '「前進」「左回転」「右回転」の命令を順番に並べよう。',
        '実行ボタンでロボットの動きを確認しよう！',
      ],
      guardianObjectives: [
        '順次処理のプログラミング思考とデバッグ力を鍛える。',
      ],
      guardianProTip: 'ロボットが今どっちを向いているかをイメージしてから回転を入れよう！',
    },
    biology: {
      title: '細胞の森',
      subject: '生物',
      tagline: 'ミクロサイズに変身して発光植物細胞に入り、小器官を救おう！',
      badgeName: '細胞ミクロ探検家',
      guardianTitle: '植物細胞エコシステム守護者',
      guardianGreeting: 'ミクロの世界へようこそ！光のフォトンを集めて細胞のエネルギーを生み出そう。',
      guardianRules: [
        '光合成に必要な太陽光のフォトンをすべてキャッチしよう！',
      ],
      guardianObjectives: [
        '葉緑体やミトコンドリアなど細胞小器官の働きを学ぶ。',
      ],
      guardianProTip: '葉緑体が光の力を受け取ることで細胞全体が元気に動くよ！',
    },
    dungeon: {
      title: '影の門ダンジョン',
      subject: '俺レベ風アクション',
      tagline: '影の斬撃・紫の魔法弾・そして君主のアルティメット「起きろ（ARISE）」を発動せよ！',
      badgeName: '影の君主ソヴリン',
      guardianTitle: '影の軍団総司令官',
      guardianGreeting: '深紅の次元ゲートが開かれた。影の軍団に立ち向かう覚悟はあるか？',
      guardianRules: [
        '[J] / 剣ボタンで連続斬撃、[K] / 魔法で遠距離魔法弾を発射。',
        '[Space] で素早い影ダッシュ回避。',
        '雑魚モンスターを3体倒すとアルティメット [Q]「ARISE!」が発動可能！',
        '全20階層のボスを撃破して真の君主を目指せ！',
      ],
      guardianObjectives: [
        'アクション戦闘のタイミングとスキル・MP管理を極める。',
      ],
      guardianProTip: 'まずは周囲の影兵士3体を素早く倒してアルティメットを溜めよう！',
    },
  },
};

export interface LocalizedRegionStrings {
  name: string;
  theme: string;
}

export const LOCALIZED_REGIONS: Record<AppLanguage, Record<string, LocalizedRegionStrings>> = {
  id: {
    sanctuary: { name: 'Kota Langit Valworld', theme: 'Plaza Pusat & Air Mancur Pengetahuan' },
    math: { name: 'Kastil Kristal Matika', theme: 'Menara Kristal & Jembatan Aljabar' },
    physics: { name: 'Desa Sakura & Lembah Balistik', theme: 'Torii Tradisional & Pagoda Kinematika' },
    design: { name: 'Atelier Pop & Distrik Seni Neon', theme: 'Galeri Warna & Panggung Mode 3D' },
    ui: { name: 'Distrik Cyberpunk Matrix', theme: 'Gedung Pencakar Langit Hologram' },
    ux: { name: 'Kafe Pengguna & Plaza Empati', theme: 'Kafe Terbuka & Journey Map Diorama' },
    chemistry: { name: 'Observatorium Kosmik & Nebula Kimia', theme: 'Kubah Planetarium & Partikel Bintang' },
    code: { name: 'Labirin Kode & Reruntuhan Robot Kuno', theme: 'Monolit Sirkuit Kuno & Kristal Logika' },
    biology: { name: 'Hutan Hayati Sel & Biosfer Mikron', theme: 'Kanopi Kloroplas & Jamur Bioluminescent' },
    dungeon: { name: 'Kawah Abyss Gerbang Bayangan', theme: 'Pilar Obsidian Kuno & Portal Solo Leveling' },
  },
  en: {
    sanctuary: { name: 'Valworld Sky Sanctuary', theme: 'Central Plaza & Fountain of Knowledge' },
    math: { name: 'Crystal Castle Math', theme: 'Crystal Spires & Algebra Bridges' },
    physics: { name: 'Sakura Ballistics Valley', theme: 'Traditional Torii & Kinematics Pagoda' },
    design: { name: 'Pop Atelier Arts District', theme: 'Color Gallery & 3D Fashion Stage' },
    ui: { name: 'Cyberpunk Matrix District', theme: 'Hologram Skyscrapers & 8pt Grid' },
    ux: { name: 'User Cafe & Empathy Plaza', theme: 'Open-Air Cafe & Journey Diorama' },
    chemistry: { name: 'Cosmic Nebula Observatory', theme: 'Planetarium Dome & Star Particles' },
    code: { name: 'Code Maze & Ancient Ruins', theme: 'Circuit Monoliths & Logic Crystals' },
    biology: { name: 'Cell Biosphere Forest', theme: 'Chloroplast Canopy & Glowing Fungi' },
    dungeon: { name: 'Shadow Gate Abyss Crater', theme: 'Obsidian Pillars & Monarch Portal' },
  },
  ja: {
    sanctuary: { name: 'ヴァルワールド天空聖域', theme: '中央広場＆知恵のクリスタル噴水' },
    math: { name: 'クリスタル数学城', theme: '水晶の尖塔＆代数の架け橋' },
    physics: { name: '桜の里・弾道渓谷', theme: '赤い鳥居＆運動学パゴダ' },
    design: { name: 'ポップアトリエ芸術区', theme: '色彩ギャラリー＆3Dステージ' },
    ui: { name: 'サイバーパンク・マトリックス区', theme: 'ホログラム高層ビル街' },
    ux: { name: 'ユーザーカフェ＆共感広場', theme: 'オープンカフェ＆体験ジオラマ' },
    chemistry: { name: '星雲化学天文台', theme: 'プラネタリウム＆星粒子ドーム' },
    code: { name: 'コード迷宮・古代ロボ遺跡', theme: '回路モノリス＆論理クリスタル' },
    biology: { name: '細胞バイオスフィアの森', theme: '葉緑体キャノピー＆発光キノコ' },
    dungeon: { name: '影の門・深淵クレーター', theme: '黒曜石の柱＆影の君主ポータル' },
  },
};

export interface LocalizedNpcStrings {
  title: string;
  region: string;
  initialDialogue: string;
  questTitle?: string;
  questDesc?: string;
  rewardBadge?: string;
  options: Array<{ label: string; response: string }>;
}

export const LOCALIZED_NPCS: Record<AppLanguage, Record<string, LocalizedNpcStrings>> = {
  id: {
    wizard: {
      title: 'Penyihir Agung Bintang Arcane',
      region: 'Kota Langit Valworld',
      initialDialogue: 'Salam dari ordo astral! Saya adalah Archmage Zephyr. Angin kosmik telah menyebarkan 5 Kristal Mana Arcane bercahaya di sekitar plaza langit. Maukah kamu membantu mengumpulkannya?',
      questTitle: 'Misteri Kristal Mana Arcane',
      questDesc: 'Kumpulkan 5 Kristal Mana Arcane melayang di sekitar pulau sentral',
      rewardBadge: 'Penyihir Kristal Arcane',
      options: [
        { label: 'Saya siap mengumpulkan 5 Kristal Mana Arcane!', response: 'Luar biasa! Kristal mana memancarkan aura ungu kebiruan. Dekati kristal tersebut untuk menyerap energi mana!' },
        { label: 'Apa sihir yang kamu kuasai?', response: 'Saya mempelajari manipulasi gravitasi, teleportasi ruang, dan bola energi sihir yang juga bisa kamu gunakan di dalam Dungeon Gerbang Bayangan!' },
        { label: 'Sampai jumpa, Archmage!', response: 'Semoga pendar bintang selalu menuntun langkahmu!' },
      ],
    },
    cowboy: {
      title: 'Koboi Penjaga Lembah Langit',
      region: 'Desa Sakura & Lembah Balistik',
      initialDialogue: 'Howdy, rekan! Saya Sheriff Morgan. Beberapa lencana bintang emas saya jatuh tercecer saat menunggang kuda awan. Jika kamu bisa menemukan 5 lencana itu, ada bintang kehormatan untukmu!',
      questTitle: 'Lencana Bintang Emas Sheriff',
      questDesc: 'Temukan 5 Lencana Bintang Emas yang tersebar di Desa Sakura',
      rewardBadge: 'Bintang Emas Sheriff Langit',
      options: [
        { label: 'Tentu, saya akan carikan 5 Lencana Sheriff itu!', response: 'Terima kasih banyak, kawan! Lencana itu berkilauan emas seperti matahari. Cari di sekitar padang rumput Desa Sakura!' },
        { label: 'Bagaimana rasanya menjadi koboi di pulau langit?', response: 'Angin kencang dan tebing curam membuat kita harus selalu waspada! Ketapel sakura dan busur panah adalah senjata andalan kami.' },
        { label: 'Sampai jumpa di jalan, Sheriff!', response: 'Tetap tegakkan topi koboi dan berhati-hatilah!' },
      ],
    },
    kael: {
      title: 'Pandu Petualang Open World',
      region: 'Kota Langit Valworld',
      initialDialogue: 'Halo petualang! Selamat datang di alam terbuka Valworld3D! Kepulauan langit ini sangat luas dan penuh rahasia ilmu yang saling terhubung.',
      options: [
        { label: 'Bagaimana cara menjelajah open world ini?', response: 'Terdapat 9 pulau besar yang terhubung oleh jembatan gantung! Kamu bisa berlari dengan Shift untuk sprint atau gunakan cincin angin updraft untuk melompat tinggi.' },
        { label: 'Apa itu cincin angin emas di dekat tebing?', response: 'Itu adalah Wind Updraft Jump Pad! Cukup injak lingkaran bercahaya emas itu, dan hembusan angin kencang akan menerbangkanmu!' },
        { label: 'Berapa level yang ada di setiap tantangan?', response: 'Setiap pulau dipimpin Master Penjaga dengan 20 level bertingkat dari pemula hingga grand master!' },
        { label: 'Sampai jumpa, Kael!', response: 'Semoga angin keberuntungan selalu menyertai langkahmu di Valworld3D!' },
      ],
    },
    lumina: {
      title: 'Pustakawan Sejarah Valworld',
      region: 'Kota Langit Valworld',
      initialDialogue: 'Buku-buku sejarah kuno mencatat bahwa Valworld3D dibangun oleh persekutuan ilmuwan dan seniman untuk menyatukan sains dan kreativitas.',
      options: [
        { label: 'Apa fungsi Kristal Pengetahuan di tengah air mancur?', response: 'Kristal itu mengalirkan berkah pengetahuan ke seluruh pulau. Setiap kali kamu menyelesaikan level, cahayanya semakin cemerlang!' },
        { label: 'Bagaimana cara mengganti sudut pandang kamera?', response: 'Tekan tombol [V] atau klik menu Pengaturan untuk beralih antara TPP dan FPP. Klik kiri dan geser mouse untuk memutar kamera!' },
        { label: 'Terima kasih atas bimbingannya, Lumina.', response: 'Teruslah penasaran dan eksplorasi setiap sudut dunia ini!' },
      ],
    },
    taro: {
      title: 'Pengamat Balistik Tradisional',
      region: 'Desa Sakura & Lembah Balistik',
      initialDialogue: 'Konnichiwa! Saya sedang mengamati angin musim semi dan gravitasi di desa sakura ini bersama Sensei Newton.',
      options: [
        { label: 'Bagaimana cara menembak tepat sasaran?', response: 'Kuncinya ada pada sudut elevasi dan daya dorong pegas! Pada sudut 45 derajat di gravitasi Bumi, proyektilmu meluncur paling jauh.' },
        { label: 'Apakah ada tantangan gravitasi planet lain?', response: 'Tentu saja! Di level lanjut, kamu akan mencoba gravitasi Bulan, Mars, bahkan raksasa gas Jupiter!' },
        { label: 'Semangat latihannya, Taro!', response: 'Arigato! Semoga tembakanmu selalu tepat mengenai lentera sakura!' },
      ],
    },
    aiko: {
      title: 'Peneliti Fotosintesis Biosfer',
      region: 'Hutan Hayati Sel & Biosfer Mikron',
      initialDialogue: 'Aroma segar klorofil tercium begitu harum di sini! Hutan sel ini hidup berkat pendar foton cahaya matahari.',
      options: [
        { label: 'Bagaimana proses fotosintesis sel terjadi?', response: 'Kloroplas menangkap foton sinar matahari, lalu mengubah air dan karbon dioksida menjadi glukosa dan oksigen segar!' },
        { label: 'Apa peran Ranger Klorofil di sini?', response: 'Ranger Klorofil menjaga 20 tingkat keseimbangan organel sel di dalam Hutan Sel!' },
        { label: 'Terima kasih, Aiko!', response: 'Jaga kelestarian alam mikrokosmos sel ya!' },
      ],
    },
    zero: {
      title: 'Unit Pengintai Komputasi',
      region: 'Labirin Kode & Reruntuhan Robot Kuno',
      initialDialogue: 'Bip-bop! Unit pengintai Zero siap membantu. Reruntuhan sirkuit ini menyimpan algoritma kuno Valworld.',
      options: [
        { label: 'Bagaimana cara memprogram robot penjelajah?', response: 'Susun baris instruksi gerak: Maju, Kiri, dan Kanan menuju kristal energi!' },
        { label: 'Bagaimana cara mendapatkan 3 bintang efisiensi?', response: 'Rancang kode sependek mungkin tanpa langkah sia-sia!' },
        { label: 'Kembali bertugas, Zero!', response: 'Sistem stand-by. Selamat memecahkan 20 level labirin logika!' },
      ],
    },
  },

  en: {
    wizard: {
      title: 'Grand Archmage of Arcane Stars',
      region: 'Valworld Sky Sanctuary',
      initialDialogue: 'Greetings from the astral order! I am Archmage Zephyr. Cosmic winds scattered 5 glowing Arcane Mana Crystals around the sky plaza. Will you help collect them?',
      questTitle: 'Mystery of the Arcane Crystals',
      questDesc: 'Collect 5 floating Arcane Mana Crystals around the central island',
      rewardBadge: 'Penyihir Kristal Arcane',
      options: [
        { label: 'I am ready to collect the 5 Arcane Mana Crystals!', response: 'Splendid! The crystals emit a violet-blue aura. Walk close to absorb their mana energy!' },
        { label: 'What magic do you practice?', response: 'I study gravity manipulation, spatial teleportation, and shadow-arcane bolts like those you cast in the Shadow Gate Dungeon!' },
        { label: 'Farewell, Archmage!', response: 'May starlight forever illuminate your footsteps!' },
      ],
    },
    cowboy: {
      title: 'Sky Valley Frontier Sheriff',
      region: 'Sakura Ballistics Valley',
      initialDialogue: 'Howdy, partner! I am Sheriff Morgan. Five of my gold star badges scattered while riding through Sakura Valley. Find them all and I will honor you with a special badge!',
      questTitle: 'Sheriff Gold Star Badges',
      questDesc: 'Find 5 Gold Star Badges scattered across Sakura Valley',
      rewardBadge: 'Bintang Emas Sheriff Langit',
      options: [
        { label: 'Count on me, Sheriff! I will find all 5 badges!', response: 'Much obliged, partner! Keep your eyes peeled around the cherry trees and grassy hills!' },
        { label: 'What is it like being a cowboy in the sky?', response: 'High winds and floating cliffs keep us sharp! Sakura catapults are our pride out here.' },
        { label: 'See you on the trail, Sheriff!', response: 'Keep your hat steady and watch your step near the island edge!' },
      ],
    },
    kael: {
      title: 'Open World Adventure Guide',
      region: 'Valworld Sky Sanctuary',
      initialDialogue: 'Hello, adventurer! Welcome to the open skies of Valworld3D! Nine floating islands await across these suspension bridges.',
      options: [
        { label: 'How do I explore this open world?', response: 'Hold [Shift] to sprint across islands and suspension bridges, or step onto glowing golden Wind Updraft rings to leap skyward!' },
        { label: 'What are the glowing golden rings near the cliff?', response: 'Those are Wind Updraft Jump Pads! Step inside and let the updraft launch you into the air!' },
        { label: 'How many levels does each challenge have?', response: 'Every single Guardian leads 20 progressive levels—from apprentice trials to grandmaster exams!' },
        { label: 'See you around, Kael!', response: 'May fair winds carry your journey across Valworld3D!' },
      ],
    },
    lumina: {
      title: 'Valworld Historical Archivist',
      region: 'Valworld Sky Sanctuary',
      initialDialogue: 'Ancient chronicles tell that Valworld3D was forged by scientists and artists to unite discovery and creativity.',
      options: [
        { label: 'What powers the Knowledge Crystal fountain?', response: 'It channels curiosity across every island. Each stage you beat makes its radiance shine brighter!' },
        { label: 'How do I adjust my camera perspective?', response: 'Press [V] or open Settings to switch between Third-Person (TPP) and First-Person (FPP). Drag with left mouse to look around!' },
        { label: 'Thank you for the lore, Lumina.', response: 'Stay curious and explore every corner of these sky islands!' },
      ],
    },
    taro: {
      title: 'Traditional Ballistics Apprentice',
      region: 'Sakura Ballistics Valley',
      initialDialogue: 'Konnichiwa! I am observing spring breezes and gravity trajectories here with Sensei Newton.',
      options: [
        { label: 'How do I aim accurately?', response: 'Balance launch angle and spring force! At 45 degrees on Earth gravity, projectiles reach maximum horizontal distance.' },
        { label: 'Are there other planetary gravities?', response: 'Yes! Later levels take you to the Moon, Mars, and even massive Jupiter!' },
        { label: 'Keep training hard, Taro!', response: 'Arigato! May every shot ring the sakura lantern!' },
      ],
    },
    aiko: {
      title: 'Biosphere Photosynthesis Researcher',
      region: 'Cell Biosphere Forest',
      initialDialogue: 'The crisp scent of chlorophyll fills the air! This giant cell forest thrives on radiant sunlight photons.',
      options: [
        { label: 'How does cellular photosynthesis work?', response: 'Chloroplasts capture photons of sunlight to turn water and carbon dioxide into glucose energy and fresh oxygen!' },
        { label: 'What does Ranger Chlorophyll do here?', response: 'Ranger Chlorophyll oversees 20 levels of cellular balance from mitochondria to the nucleus!' },
        { label: 'Thanks, Aiko!', response: 'Take care of the cellular microcosm!' },
      ],
    },
    zero: {
      title: 'Computational Scout Unit',
      region: 'Code Maze & Ancient Ruins',
      initialDialogue: 'Beep-boop! Scout unit Zero online. These circuit ruins preserve the oldest algorithms in Valworld.',
      options: [
        { label: 'How do I program the explorer bot?', response: 'Stack Forward, Turn Left, and Turn Right blocks to guide the bot safely to the energy crystal!' },
        { label: 'How do I earn 3 efficiency stars?', response: 'Keep your instruction sequence as concise as possible with zero wasted turns!' },
        { label: 'Back to patrol, Zero!', response: 'Standing by. Good luck clearing all 20 logic maze levels!' },
      ],
    },
  },

  ja: {
    wizard: {
      title: '星辰の大魔導士',
      region: 'ヴァルワールド天空聖域',
      initialDialogue: '星界の挨拶を！私は大魔導士ゼファー。宇宙の風が中央広場のあちこちに5つのアーケイン・マナクリスタルを散らしてしまったのだ。集めるのを手伝ってくれないか？',
      questTitle: '秘宝マナクリスタルの謎',
      questDesc: '中央の島に浮かぶ5つのマナクリスタルを集めよう',
      rewardBadge: 'Penyihir Kristal Arcane',
      options: [
        { label: '5つのマナクリスタルを集めてきます！', response: '頼もしいな！青紫に輝くクリスタルに近づけばマナを吸収できるぞ！' },
        { label: 'どんな魔法を研究しているのですか？', response: '重力操作、空間転移、そして影の門ダンジョンで君も使える魔力弾の術だ！' },
        { label: 'また後で、ゼファー先生！', response: '星々の輝きが君の旅路を照らさんことを！' },
      ],
    },
    cowboy: {
      title: '天空渓谷の保安官',
      region: '桜の里・弾道渓谷',
      initialDialogue: 'やあ相棒！俺は保安官モーガン。雲馬で桜の里を駆けていた時に金の星バッジを5つ落としてしまってね。見つけてくれたら名誉の証を贈ろう！',
      questTitle: '保安官の金の星バッジ',
      questDesc: '桜の里に散らばった5つの金星バッジを見つけよう',
      rewardBadge: 'Bintang Emas Sheriff Langit',
      options: [
        { label: '任せて！5つのバッジを探してくるよ！', response: '恩に着るよ相棒！桜の木や草原の近くをよく探してみてくれ！' },
        { label: '空の島で保安官をするのはどんな感じ？', response: '強い風と断崖絶壁のおかげで気が抜けないね！桜カタパルトが自慢の相棒さ。' },
        { label: 'また会おう、保安官！', response: '島の端から落ちないように気をつけてな！' },
      ],
    },
    kael: {
      title: 'オープンワールド冒険案内人',
      region: 'ヴァルワールド天空聖域',
      initialDialogue: 'ようこそ冒険者！ヴァルワールド3Dの広大な空へ！吊り橋で結ばれた9つの島々が待っているよ！',
      options: [
        { label: 'オープンワールドの歩き方は？', response: '[Shift]キーを押しながら走るとダッシュできるよ！崖際の黄金の上昇気流リングに乗れば高くジャンプできるんだ！' },
        { label: '黄金のリングは何ですか？', response: '上昇気流のジャンプパッドだよ！乗るだけで風の力が大空へ舞い上げてくれる！' },
        { label: '各チャレンジは何レベルまであるの？', response: 'すべての守護者が全20段階の試練を用意しているよ！' },
        { label: 'またね、カエル！', response: '良い風が君の冒険を運んでくれますように！' },
      ],
    },
    lumina: {
      title: 'ヴァルワールド歴史記録官',
      region: 'ヴァルワールド天空聖域',
      initialDialogue: '古の書物には、Valworld3Dは科学者と芸術家が知恵と創造を結びつけるために築いた世界だと記されています。',
      options: [
        { label: '中央の噴水クリスタルの役割は？', response: 'すべての島へ知恵の光を届けています。あなたが試練を解くほど輝きが増すのです！' },
        { label: 'カメラ視点はどうやって変えるの？', response: '[V]キーまたは設定画面からTPPとFPPを切り替えられます。左ドラッグで自由に視点操作できますよ！' },
        { label: '教えてくれてありがとう、ルミナ。', response: '探究心を大切に、世界の隅々まで冒険してくださいね！' },
      ],
    },
    taro: {
      title: '伝統弾道学の弟子',
      region: '桜の里・弾道渓谷',
      initialDialogue: 'こんにちは！ニュートン先生と一緒に、この桜の里で春風と重力の軌道を観察しています。',
      options: [
        { label: '狙い通りに命中させるコツは？', response: '角度とバネの力のバランスです！地球の重力では45度が一番遠くまで飛びますよ。' },
        { label: '他の惑星の重力ステージもあるの？', response: 'はい！月や火星、さらには巨大な木星の重力にも挑戦できます！' },
        { label: '稽古がんばってね、タロウ！', response: 'ありがとうございます！見事ランタンを射抜いてみせます！' },
      ],
    },
    aiko: {
      title: '光合成バイオスフィア研究員',
      region: '細胞バイオスフィアの森',
      initialDialogue: 'ここはクロロフィルの爽やかな香りに満ちていますね！この細胞の森は太陽の光量子によって生きています。',
      options: [
        { label: '光合成はどのように起きるの？', response: '葉緑体が太陽のフォトンを受け取り、水と二酸化炭素から栄養と新鮮な酸素を生み出すんです！' },
        { label: 'クロロフィルレンジャーの役割は？', response: '全20レベルの細胞バランスを守っています！' },
        { label: 'ありがとう、アイコ！', response: 'ミクロの自然を大切にしてくださいね！' },
      ],
    },
    zero: {
      title: '演算偵察ユニット',
      region: 'コード迷宮・古代ロボ遺跡',
      initialDialogue: 'ピポパ！偵察ユニット・ゼロ起動。この回路遺跡にはValworld最古のアルゴリズムが眠っています。',
      options: [
        { label: '探査ロボットはどう動かすの？', response: '「前進」「左」「右」の命令を順番に並べてクリスタルまで導きましょう！' },
        { label: '効率3つ星を取るコツは？', response: '無駄のない最短の命令ブロック数でクリアすることです！' },
        { label: '任務に戻って、ゼロ！', response: '待機モード移行。全20レベルの突破を応援しています！' },
      ],
    },
  },
};

export const LOCALIZED_PRESETS: Record<AppLanguage, Record<CharacterArchetypeId, { role: string; tagline: string; description: string }>> = {
  id: {
    aoi: { role: 'Gadis Petualang', tagline: 'Selalu siap melompat ke misteri baru!', description: 'Penuh semangat dan tangkas, memiliki kuncir kuda yang berkibar saat berlari.' },
    hana: { role: 'Gadis Bunga', tagline: 'Harmoni warna dan keceriaan di setiap langkah.', description: 'Anggun dengan rambut twin-tail lembut dan pita bunga yang memikat.' },
    kaede: { role: 'Peneliti Cilik', tagline: 'Fakta dan logika selalu mengungkap kebenaran.', description: 'Gadis cerdas berkacamata dengan potongan rambut bob rapi dan buku catatan.' },
    ren: { role: 'Pemuda Petir', tagline: 'Kecepatan berpikir adalah kunci kemenangan!', description: 'Pemuda berambut spiky penuh energi yang selalu tertantang memecahkan teka-teki.' },
    kaito: { role: 'Penjelajah Langit', tagline: 'Angin membawa petunjuk bagi mereka yang tenang.', description: 'Pemuda kalem berbusana modern dengan syal berkibar ditiup angin senja.' },
    daichi: { role: 'Sahabat Alam', tagline: 'Setiap masalah punya akar yang bisa dirawat.', description: 'Pemuda ramah berjaket kasual dengan senyum hangat dan tekad kuat.' },
    mimi: { role: 'Chibi Neko', tagline: 'Nyaa~! Belajar itu semanis kue ikan!', description: 'Gadis chibi bertelinga kucing yang menggemaskan dan lincah melompat.' },
    piko: { role: 'Chibi Astro', tagline: 'Meluncur ke bintang pengetahuan!', description: 'Penjelajah cilik berhelm kaca mini yang selalu ingin tahu misteri kosmos.' },
  },
  en: {
    aoi: { role: 'Adventure Girl', tagline: 'Always ready to leap into a new mystery!', description: 'Spirited and agile, with a signature ponytail that sways as she runs.' },
    hana: { role: 'Flower Maiden', tagline: 'Color harmony and cheer in every step.', description: 'Graceful with soft twin-tails and charming floral ribbons.' },
    kaede: { role: 'Young Researcher', tagline: 'Facts and logic always uncover the truth.', description: 'Sharp-minded scholar wearing glasses, a neat bob cut, and carrying field notes.' },
    ren: { role: 'Lightning Striker', tagline: 'Quick thinking is the key to victory!', description: 'Energetic spiky-haired hero always ready to tackle the toughest puzzles.' },
    kaito: { role: 'Sky Wanderer', tagline: 'The wind brings clues to those who stay calm.', description: 'Cool-headed explorer wearing a flowing scarf catching the twilight breeze.' },
    daichi: { role: 'Nature Friend', tagline: 'Every puzzle has roots we can nurture.', description: 'Friendly adventurer in a casual jacket with a warm smile and steady resolve.' },
    mimi: { role: 'Chibi Neko', tagline: 'Nyaa~! Learning is as sweet as taiyaki!', description: 'Adorable cat-eared chibi adventurer who loves bounding across sky islands.' },
    piko: { role: 'Chibi Astro', tagline: 'Blasting off to the stars of knowledge!', description: 'Tiny space explorer in a glass visor helmet curious about cosmic secrets.' },
  },
  ja: {
    aoi: { role: '冒険少女', tagline: '新しい謎へいつでも飛び込むよ！', description: '元気いっぱいで俊敏、走ると揺れるポニーテールが特徴。' },
    hana: { role: '花の乙女', tagline: '一歩ごとに色彩のハーモニーと笑顔を。', description: 'ふんわりツインテールと花の髪飾りが似合う優雅な少女。' },
    kaede: { role: '小さな研究者', tagline: '事実と論理は必ず真実を照らし出す。', description: 'メガネとボブカットが似合う知的なノート持ちのリサーチャー。' },
    ren: { role: '雷の少年', tagline: '閃きの速さこそ勝利の鍵だ！', description: '難問に挑むのが大好きなツンツン髪の熱血チャレンジャー。' },
    kaito: { role: '空の旅人', tagline: '風は穏やかな者に道標を運んでくれる。', description: '夕暮れの風になびくマフラーを巻いたクールな冒険者。' },
    daichi: { role: '自然の友', tagline: 'どんな難問にも育てられる根っこがある。', description: '温かい笑顔と強い意志を持つカジュアルスタイルの青年。' },
    mimi: { role: 'ちび猫娘', tagline: 'にゃあ〜！学ぶことはたい焼きみたいに甘いよ！', description: '猫耳がキュートで軽やかに跳ねるちびっ子冒険家。' },
    piko: { role: 'ちび宇宙飛行士', tagline: '知恵の星々へ発進だ！', description: '小さなガラスヘルメットを被った宇宙の謎が大好きなおチビ探検家。' },
  },
};

export const LOCALIZED_BADGES: Record<AppLanguage, Record<string, { title: string; desc: string }>> = {
  id: {
    'Arsitek Pecahan & Aljabar': { title: 'Arsitek Pecahan & Aljabar', desc: 'Menyelesaikan tantangan di Kastil Angka dengan kalkulasi tepat!' },
    'Master Balistik Newton': { title: 'Master Balistik Newton', desc: 'Menembakkan proyektil dengan sudut dan gravitasi sempurna!' },
    'Kurator Spektrum Emas': { title: 'Kurator Spektrum Emas', desc: 'Menciptakan komposisi warna harmonis di Atelier Warna!' },
    'Insinyur Pixel Perfect': { title: 'Insinyur Pixel Perfect', desc: 'Memperbaiki antarmuka digital dengan tata letak presisi!' },
    'Empati Pengguna Prima': { title: 'Empati Pengguna Prima', desc: 'Mengoptimalkan alur kepuasan pelanggan di Kafe Pengguna!' },
    'Alkemis Molekul Bintang': { title: 'Alkemis Molekul Bintang', desc: 'Merangkai atom dan menyelesaikan reaksi kimia berharga!' },
    'Pakar Algoritma Cilik': { title: 'Pakar Algoritma Cilik', desc: 'Memandu robot menembus labirin dengan efisien!' },
    'Penjelajah Mikrokosmos Sel': { title: 'Penjelajah Mikrokosmos Sel', desc: 'Menyingkap rahasia fotosintesis dan kloroplas di Hutan Sel!' },
    'Langkah Pertama Valworld3D': { title: 'Langkah Pertama Valworld3D', desc: 'Menjelajahi Lobi Sky Islands di Valworld3D!' },
    'Bintang Cendekia': { title: 'Bintang Cendekia', desc: 'Mengumpulkan 10 bintang dari mini-game mana pun!' },
    'Penyihir Kristal Arcane': { title: 'Penyihir Kristal Arcane', desc: 'Menemukan 5 Kristal Mana Arcane untuk Archmage Zephyr!' },
    'Bintang Emas Sheriff Langit': { title: 'Bintang Emas Sheriff Langit', desc: 'Mengumpulkan 5 Lencana Bintang Emas untuk Sheriff Morgan!' },
    'Shadow Monarch Sovereign': { title: 'Shadow Monarch Sovereign', desc: 'Menaklukkan level dungeon dan membangkitkan kekuatan bayangan!' },
  },
  en: {
    'Arsitek Pecahan & Aljabar': { title: 'Fraction & Algebra Architect', desc: 'Cleared challenges inside Number Castle with exact math!' },
    'Master Balistik Newton': { title: 'Newton Ballistics Master', desc: 'Hit targets with textbook launch angles and gravity mastery!' },
    'Kurator Spektrum Emas': { title: 'Golden Spectrum Curator', desc: 'Crafted harmonious color palettes in Color Atelier!' },
    'Insinyur Pixel Perfect': { title: 'Pixel Perfect Engineer', desc: 'Aligned digital interfaces to crisp 8-point grids!' },
    'Empati Pengguna Prima': { title: 'Prime User Empathy', desc: 'Optimized customer satisfaction flows at User Cafe!' },
    'Alkemis Molekul Bintang': { title: 'Star Molecule Alchemist', desc: 'Synthesized essential chemical molecules in zero gravity!' },
    'Pakar Algoritma Cilik': { title: 'Little Algorithm Expert', desc: 'Guided the explorer bot through logic mazes efficiently!' },
    'Penjelajah Mikrokosmos Sel': { title: 'Cell Microcosm Explorer', desc: 'Unlocked the secrets of photosynthesis in Cell Forest!' },
    'Langkah Pertama Valworld3D': { title: 'First Steps in Valworld3D', desc: 'Explored the floating Sky Islands of Valworld3D!' },
    'Bintang Cendekia': { title: 'Scholar Star', desc: 'Collected 10 stars across any mini-game!' },
    'Penyihir Kristal Arcane': { title: 'Arcane Crystal Mage', desc: 'Found all 5 Arcane Mana Crystals for Archmage Zephyr!' },
    'Bintang Emas Sheriff Langit': { title: 'Sky Sheriff Gold Star', desc: 'Recovered 5 Gold Star Badges for Sheriff Morgan!' },
    'Shadow Monarch Sovereign': { title: 'Shadow Monarch Sovereign', desc: 'Conquered a Shadow Gate Dungeon boss and awakened ARISE!' },
  },
  ja: {
    'Arsitek Pecahan & Aljabar': { title: '分数・代数の建築家', desc: '数字の城で正確な数式パズルをクリアした！' },
    'Master Balistik Newton': { title: 'ニュートン弾道マスター', desc: '角度と重力を読み切って見事にランタンを射抜いた！' },
    'Kurator Spektrum Emas': { title: 'ゴールデンスペクトラム学芸員', desc: 'カラーアトリエで美しい調和配色を完成させた！' },
    'Insinyur Pixel Perfect': { title: 'ピクセルパーフェクト技師', desc: 'サイバーUIを8ポイントグリッドへ完璧に整列させた！' },
    'Empati Pengguna Prima': { title: 'ユーザー共感マスター', desc: 'ユーザーカフェの体験フローを最適化して笑顔を増やした！' },
    'Alkemis Molekul Bintang': { title: '星分子の錬金術師', desc: '無重力ステーションで大切な化学分子を合成した！' },
    'Pakar Algoritma Cilik': { title: 'ちびアルゴリズム博士', desc: 'ロボットを迷宮のクリスタルまで正しく導いた！' },
    'Penjelajah Mikrokosmos Sel': { title: '細胞ミクロ探検家', desc: '細胞の森で光合成とエネルギーの秘密を解き明かした！' },
    'Langkah Pertama Valworld3D': { title: 'Valworld3Dへの第一歩', desc: 'Valworld3Dの浮遊島ロビーを冒険した！' },
    'Bintang Cendekia': { title: '賢者の輝き', desc: 'ミニゲームで合計10個のスターを獲得した！' },
    'Penyihir Kristal Arcane': { title: 'アーケイン・クリスタル魔導士', desc: '大魔導士ゼファーのために5つのマナクリスタルを集めた！' },
    'Bintang Emas Sheriff Langit': { title: '天空保安官の金星', desc: '保安官モーガンのために5つの金星バッジを見つけ出した！' },
    'Shadow Monarch Sovereign': { title: '影の君主ソヴリン', desc: '影の門ダンジョンのボスを撃破し、真の力を覚醒させた！' },
  },
};

export function formatMsg(template: string, vars: Record<string, string | number>): string {
  let out = template;
  Object.entries(vars).forEach(([k, v]) => {
    out = out.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v));
  });
  return out;
}
