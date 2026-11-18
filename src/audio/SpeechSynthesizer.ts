/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useGameStore } from '../state/useGameStore';
import { AppLanguage } from '../types';

export type VoicePersona = 'wizard' | 'cowboy' | 'chibi' | 'scholar' | 'robot' | 'female' | 'male' | 'default';

class SpeechSynthesizer {
  private synth: SpeechSynthesis | null = null;
  private indonesianVoice: SpeechSynthesisVoice | null = null;
  private englishVoice: SpeechSynthesisVoice | null = null;
  private japaneseVoice: SpeechSynthesisVoice | null = null;
  private isSupported = false;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
      this.isSupported = true;
      this.loadVoices();
      if (this.synth.onvoiceschanged !== undefined) {
        this.synth.onvoiceschanged = () => this.loadVoices();
      }
    }
  }

  private loadVoices() {
    if (!this.synth) return;
    const voices = this.synth.getVoices();
    this.indonesianVoice = voices.find((v) => v.lang.toLowerCase().startsWith('id')) || null;
    this.englishVoice = voices.find((v) => v.lang.toLowerCase().startsWith('en')) || voices[0] || null;
    this.japaneseVoice = voices.find((v) => v.lang.toLowerCase().startsWith('ja')) || null;
  }

  private getLangCode(lang: AppLanguage): string {
    if (lang === 'ja') return 'ja-JP';
    if (lang === 'en') return 'en-US';
    return 'id-ID';
  }

  public speak(text: string, persona: VoicePersona = 'default') {
    if (!this.synth || !this.isSupported) return;

    const cleanText = text
      .replace(/[◆★•*#_\[\]\(\)]/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    if (!cleanText) return;

    try {
      this.synth.cancel();
      this.loadVoices();

      const lang = useGameStore.getState().language;
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = this.getLangCode(lang);

      let voice: SpeechSynthesisVoice | null = null;
      if (lang === 'ja') voice = this.japaneseVoice;
      else if (lang === 'en') voice = this.englishVoice;
      else voice = this.indonesianVoice;

      if (voice) {
        utterance.voice = voice;
      }

      switch (persona) {
        case 'wizard':
          utterance.pitch = 0.78;
          utterance.rate = 0.92;
          break;
        case 'cowboy':
          utterance.pitch = 0.88;
          utterance.rate = 0.96;
          break;
        case 'chibi':
          utterance.pitch = 1.4;
          utterance.rate = 1.05;
          break;
        case 'scholar':
          utterance.pitch = 1.05;
          utterance.rate = 0.98;
          break;
        case 'robot':
          utterance.pitch = 1.15;
          utterance.rate = 1.12;
          break;
        case 'female':
          utterance.pitch = 1.2;
          utterance.rate = 1.0;
          break;
        case 'male':
          utterance.pitch = 0.9;
          utterance.rate = 1.0;
          break;
        default:
          utterance.pitch = 1.0;
          utterance.rate = 1.0;
      }

      this.synth.speak(utterance);
    } catch (e) {
      console.warn('SpeechSynthesis error:', e);
    }
  }

  public stop() {
    if (this.synth) {
      try {
        this.synth.cancel();
      } catch {}
    }
  }
}

export const speechSynthesizer = new SpeechSynthesizer();
