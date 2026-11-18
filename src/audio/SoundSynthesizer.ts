/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

class SoundSynthesizer {
  private ctx: AudioContext | null = null;
  private bgmGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private masterGain: GainNode | null = null;
  private isUnlocked = false;

  private activeBgmType: string | null = null;
  private bgmTimer: number | null = null;
  private bgmStep = 0;

  constructor() {
    // Initialized on first user interaction
  }

  public init() {
    if (this.ctx) return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.8, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      this.bgmGain = this.ctx.createGain();
      this.bgmGain.gain.setValueAtTime(0.65, this.ctx.currentTime);
      this.bgmGain.connect(this.masterGain);

      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.setValueAtTime(0.8, this.ctx.currentTime);
      this.sfxGain.connect(this.masterGain);

      this.isUnlocked = true;
    } catch (e) {
      console.warn('Web Audio not supported:', e);
    }
  }

  public resume() {
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    this.isUnlocked = true;
  }

  public setVolumes(bgmVol: number, sfxVol: number, isMuted: boolean) {
    if (!this.ctx || !this.bgmGain || !this.sfxGain || !this.masterGain) return;
    const now = this.ctx.currentTime;
    if (isMuted) {
      this.masterGain.gain.setTargetAtTime(0, now, 0.05);
    } else {
      this.masterGain.gain.setTargetAtTime(0.85, now, 0.05);
      this.bgmGain.gain.setTargetAtTime(bgmVol, now, 0.05);
      this.sfxGain.gain.setTargetAtTime(sfxVol, now, 0.05);
    }
  }

  // ===================== SFX =====================

  public playClick() {
    if (!this.ctx || !this.sfxGain) return;
    this.resume();
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, now);
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.06);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.08);
  }

  public playJump() {
    if (!this.ctx || !this.sfxGain) return;
    this.resume();
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(180, now);
    osc.frequency.exponentialRampToValueAtTime(440, now + 0.15);

    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.18);
  }

  public playSwordHit() {
    if (!this.ctx || !this.sfxGain) return;
    this.resume();
    const now = this.ctx.currentTime;

    // Metal clink/slice
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(880, now);
    osc.frequency.exponentialRampToValueAtTime(220, now + 0.1);

    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.12);
  }

  public playPickup() {
    if (!this.ctx || !this.sfxGain) return;
    this.resume();
    const now = this.ctx.currentTime;
    [523.25, 783.99].forEach((freq, i) => {
      if (!this.ctx || !this.sfxGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + i * 0.06);

      gain.gain.setValueAtTime(0.3, now + i * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.06 + 0.18);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(now + i * 0.06);
      osc.stop(now + i * 0.06 + 0.18);
    });
  }

  public playCorrect() {
    if (!this.ctx || !this.sfxGain) return;
    this.resume();
    const now = this.ctx.currentTime;
    // C5, E5, G5, C6 major arpeggio fanfare
    const freqs = [523.25, 659.25, 783.99, 1046.5];
    freqs.forEach((freq, idx) => {
      if (!this.ctx || !this.sfxGain) return;
      const t = now + idx * 0.08;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, t);

      gain.gain.setValueAtTime(0.35, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.4);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(t);
      osc.stop(t + 0.4);
    });
  }

  public playInteract() {
    if (!this.ctx || !this.sfxGain) return;
    this.resume();
    const now = this.ctx.currentTime;
    // Crisp Genshin-style interaction chime: E5 -> B5
    [659.25, 987.77].forEach((freq, i) => {
      if (!this.ctx || !this.sfxGain) return;
      const t = now + i * 0.05;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.05, t + 0.12);

      gain.gain.setValueAtTime(0.32, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.14);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(t);
      osc.stop(t + 0.14);
    });
  }

  public playMenuTransition() {
    if (!this.ctx || !this.sfxGain) return;
    this.resume();
    const now = this.ctx.currentTime;
    // Sleek cinematic whoosh & chime
    const osc = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.15);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(400, now);
    filter.frequency.exponentialRampToValueAtTime(3200, now + 0.15);

    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.18);
  }

  public playLevelSwitch() {
    if (!this.ctx || !this.sfxGain) return;
    this.resume();
    const now = this.ctx.currentTime;
    // Sparkle crystal level switch: G5 -> C6 -> E6
    [783.99, 1046.5, 1318.51].forEach((freq, idx) => {
      if (!this.ctx || !this.sfxGain) return;
      const t = now + idx * 0.04;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t);

      gain.gain.setValueAtTime(0.28, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.16);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(t);
      osc.stop(t + 0.16);
    });
  }

  public playSpeechBlip(pitch = 1.0) {
    if (!this.ctx || !this.sfxGain) return;
    this.resume();
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    const baseFreq = 480 * pitch + (Math.random() - 0.5) * 40;
    osc.frequency.setValueAtTime(baseFreq, now);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.9, now + 0.035);

    gain.gain.setValueAtTime(0.09, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.04);
  }

  public playJumpPad() {
    if (!this.ctx || !this.sfxGain) return;
    this.resume();
    const now = this.ctx.currentTime;
    // Aerodynamic wind launch updraft
    const osc = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.exponentialRampToValueAtTime(620, now + 0.35);

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(600, now);
    filter.frequency.exponentialRampToValueAtTime(1800, now + 0.35);
    filter.Q.value = 3;

    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.4);
  }

  public playError() {
    if (!this.ctx || !this.sfxGain) return;
    this.resume();
    const now = this.ctx.currentTime;
    // Gentle friendly error: G4 -> Eb4
    [392.0, 311.13].forEach((freq, idx) => {
      if (!this.ctx || !this.sfxGain) return;
      const t = now + idx * 0.12;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t);

      gain.gain.setValueAtTime(0.25, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(t);
      osc.stop(t + 0.25);
    });
  }

  public playLevelVictory() {
    if (!this.ctx || !this.sfxGain) return;
    this.resume();
    const now = this.ctx.currentTime;
    const melody = [
      { f: 523.25, d: 0.12 }, // C5
      { f: 659.25, d: 0.12 }, // E5
      { f: 783.99, d: 0.12 }, // G5
      { f: 1046.5, d: 0.25 }, // C6
      { f: 880.0, d: 0.12 },  // A5
      { f: 1046.5, d: 0.5 },  // C6 (hold)
    ];

    let offset = 0;
    melody.forEach((note) => {
      if (!this.ctx || !this.sfxGain) return;
      const t = now + offset;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(note.f, t);

      gain.gain.setValueAtTime(0.4, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + note.d * 1.5);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(t);
      osc.stop(t + note.d * 1.5);

      offset += note.d;
    });
  }

  public playFootstep() {
    if (!this.ctx || !this.sfxGain) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(90 + Math.random() * 20, now);
    osc.frequency.exponentialRampToValueAtTime(40, now + 0.05);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(250, now);

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.05);
  }

  // ===================== PROCEDURAL BGM =====================

  public startBGM(type: 'lobby' | 'math' | 'customizer' | 'dungeon') {
    if (this.activeBgmType === type) return;
    this.stopBGM();
    this.activeBgmType = type;
    this.bgmStep = 0;

    if (!this.ctx) this.init();
    this.resume();

    // Loop interval
    const stepInterval = type === 'lobby' ? 320 : type === 'math' ? 260 : type === 'dungeon' ? 180 : 380;
    this.bgmTimer = window.setInterval(() => {
      this.tickBGM(type);
    }, stepInterval);
  }

  public stopBGM() {
    if (this.bgmTimer) {
      clearInterval(this.bgmTimer);
      this.bgmTimer = null;
    }
    this.activeBgmType = null;
  }

  private tickBGM(type: 'lobby' | 'math' | 'customizer' | 'dungeon') {
    if (!this.ctx || !this.bgmGain || !this.isUnlocked) return;

    if (type === 'lobby') {
      // Kalimba / marimba twilight pentatonic (F, G, A, C, D)
      const scale = [349.23, 392.0, 440.0, 523.25, 587.33, 698.46];
      const chords = [
        [scale[0], scale[2], scale[3]], // F-A-C
        [scale[1], scale[3], scale[4]], // G-C-D
        [scale[2], scale[3], scale[5]], // A-C-F
        [scale[1], scale[2], scale[4]], // G-A-D
      ];
      const chordIdx = Math.floor(this.bgmStep / 8) % chords.length;
      const noteIdx = this.bgmStep % 4;

      // Play soft arpeggio note
      const freq = chords[chordIdx][noteIdx % chords[chordIdx].length] * (noteIdx === 0 ? 0.5 : 1);
      this.playSynthPluck(freq, 0.14, 'sine', 0.28);

      // Warm bass on downbeat
      if (this.bgmStep % 8 === 0) {
        this.playSynthPluck(chords[chordIdx][0] * 0.5, 0.18, 'triangle', 0.5);
      }
    } else if (type === 'math') {
      // Playful fantasy quest pizzicato (C, D, E, G, A)
      const scale = [261.63, 293.66, 329.63, 392.0, 440.0, 523.25];
      const pattern = [0, 2, 4, 2, 1, 3, 5, 3, 2, 4, 3, 1, 0, 4, 3, 2];
      const note = scale[pattern[this.bgmStep % pattern.length]];

      this.playSynthPluck(note, 0.16, 'triangle', 0.22);

      // Light percussion kick on beat
      if (this.bgmStep % 4 === 0) {
        this.playSynthPluck(110, 0.15, 'sine', 0.15);
      }
    } else if (type === 'dungeon') {
      // Epic Anime Battle OST in D Minor (Sawano style Solo Leveling Battle Theme)
      const step = this.bgmStep % 32;

      // 1. Chords progression (Dm -> Bb -> C -> Am)
      const chordIdx = Math.floor(step / 8);
      const chords = [
        [293.66, 349.23, 440.0], // D4, F4, A4 (D minor)
        [233.08, 293.66, 349.23], // Bb3, D4, F4 (Bb major)
        [261.63, 329.63, 392.0], // C4, E4, G4 (C major)
        [220.0, 261.63, 329.63], // A3, C4, E4 (A minor)
      ];

      // 2. Brass/Choir Chord Swell on bar downbeats
      if (step % 8 === 0) {
        chords[chordIdx].forEach((freq) => {
          this.playSynthPluck(freq, 0.18, 'sawtooth', 0.9);
          this.playSynthPluck(freq * 0.5, 0.12, 'triangle', 1.1);
        });
      }

      // 3. Driving 16th-note Anime Bassline Ostinato (Pumping octaves)
      const rootNotes = [73.42, 58.27, 65.41, 55.0]; // D1, Bb0, C1, A0
      const currentRoot = rootNotes[chordIdx];
      const isOctaveUp = step % 2 === 1;
      const bassFreq = isOctaveUp ? currentRoot * 2 : currentRoot;
      this.playSynthPluck(bassFreq, 0.35, 'sawtooth', 0.14);

      // 4. Heroic Anime Lead Synth-Violin Melody
      const leadNotes = [
        // D minor bar (0-7)
        587.33, 698.46, 880.0, 698.46, 587.33, 698.46, 783.99, 880.0,
        // Bb bar (8-15)
        932.33, 880.0, 698.46, 587.33, 698.46, 880.0, 932.33, 1046.5,
        // C bar (16-23)
        1046.5, 932.33, 880.0, 783.99, 880.0, 1046.5, 1174.66, 1046.5,
        // Am turnaround bar (24-31)
        880.0, 783.99, 698.46, 587.33, 659.25, 783.99, 880.0, 1174.66,
      ];
      const lead = leadNotes[step];
      if (step % 2 === 0 || step >= 24) {
        this.playSynthPluck(lead, 0.22, 'triangle', 0.22);
      }

      // 5. Anime Battle Drums
      // Kick: four-on-the-floor + syncopated accents
      if (step % 4 === 0 || step === 14 || step === 22 || step === 30) {
        this.playDrumKick();
      }
      // Snare: explosive on beat 2 and 4 (steps 4, 12, 20, 28) + rapid fills on steps 30, 31
      if (step % 8 === 4 || step === 30 || step === 31) {
        this.playDrumSnare();
      }
      // Hi-hat: driving 16th rhythm
      this.playDrumHiHat(step % 4 === 2 ? 0.12 : 0.06);

    } else if (type === 'customizer') {
      // Smooth lounge pentatonic keys
      const scale = [220.0, 261.63, 293.66, 329.63, 392.0];
      const note = scale[this.bgmStep % scale.length];
      this.playSynthPluck(note, 0.12, 'sine', 0.4);
    }

    this.bgmStep++;
  }

  private playDrumKick() {
    if (!this.ctx || !this.bgmGain) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.exponentialRampToValueAtTime(38, now + 0.12);

    gain.gain.setValueAtTime(0.5, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

    osc.connect(gain);
    gain.connect(this.bgmGain);

    osc.start(now);
    osc.stop(now + 0.14);
  }

  private playDrumSnare() {
    if (!this.ctx || !this.bgmGain) return;
    const now = this.ctx.currentTime;

    // Body tone
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.exponentialRampToValueAtTime(80, now + 0.1);

    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

    osc.connect(gain);
    gain.connect(this.bgmGain);
    osc.start(now);
    osc.stop(now + 0.12);

    // Noise snap burst
    const bufferSize = this.ctx.sampleRate * 0.12;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.25, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

    noise.connect(noiseGain);
    noiseGain.connect(this.bgmGain);
    noise.start(now);
  }

  private playDrumHiHat(volume = 0.08) {
    if (!this.ctx || !this.bgmGain) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(7500, now);

    gain.gain.setValueAtTime(volume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

    osc.connect(gain);
    gain.connect(this.bgmGain);

    osc.start(now);
    osc.stop(now + 0.04);
  }

  private playSynthPluck(freq: number, gainVol: number, type: OscillatorType, duration: number) {
    if (!this.ctx || !this.bgmGain) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);

    gain.gain.setValueAtTime(gainVol, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    osc.connect(gain);
    gain.connect(this.bgmGain);

    osc.start(now);
    osc.stop(now + duration);
  }
}

export const soundManager = new SoundSynthesizer();
