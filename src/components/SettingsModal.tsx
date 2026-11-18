/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useGameStore } from '../state/useGameStore';
import { soundManager } from '../audio/SoundSynthesizer';
import { AppLanguage, GraphicQuality } from '../types';
import { TRANSLATIONS } from '../data/i18n';
import { Volume2, VolumeX, Eye, Shield, RefreshCw, Globe } from 'lucide-react';

interface SettingsModalProps {
  onClose: () => void;
}

const LANGUAGE_OPTIONS: Array<{ code: AppLanguage; label: string; flag: string }> = [
  { code: 'id', label: 'Indonesia', flag: '🇮🇩' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'ja', label: '日本語', flag: '🇯🇵' },
];

export const SettingsModal: React.FC<SettingsModalProps> = ({ onClose }) => {
  const {
    language,
    setLanguage,
    cameraMode,
    setCameraMode,
    quality,
    setQuality,
    bgmVolume,
    setBgmVolume,
    sfxVolume,
    setSfxVolume,
    isMuted,
    toggleMute,
    highContrast,
    toggleHighContrast,
    reducedMotion,
    toggleReducedMotion,
    resetAllProgress,
  } = useGameStore();

  const t = TRANSLATIONS[language];
  const [confirmingReset, setConfirmingReset] = useState(false);

  const handleQualityChange = (q: GraphicQuality) => {
    soundManager.playClick();
    setQuality(q);
  };

  const handleConfirmReset = () => {
    soundManager.playMenuTransition();
    resetAllProgress();
    setConfirmingReset(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 select-none pointer-events-auto">
      <div className="bg-purple-950 border-2 border-purple-400 rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-purple-800">
          <div className="font-display font-extrabold text-2xl text-white">{t.settings.title}</div>
          <button
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="text-purple-300 hover:text-white font-bold text-sm"
          >
            {t.common.close}
          </button>
        </div>

        <div className="space-y-5 pt-4">
          {/* Language Switcher */}
          <div>
            <label className="text-xs font-bold text-pink-300 flex items-center gap-1.5 mb-2">
              <Globe className="w-3.5 h-3.5 text-pink-400" />
              <span>{t.settings.languageLabel}</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {LANGUAGE_OPTIONS.map((opt) => (
                <button
                  key={opt.code}
                  onClick={() => {
                    soundManager.playClick();
                    setLanguage(opt.code);
                  }}
                  className={`py-2.5 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    language === opt.code
                      ? 'bg-pink-600 text-white border-2 border-white shadow-md'
                      : 'bg-purple-900/60 text-purple-300 border border-purple-700/60 hover:bg-purple-800'
                  }`}
                >
                  <span>{opt.flag}</span>
                  <span>{opt.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Camera Perspective (TPP vs FPP) */}
          <div>
            <label className="text-xs font-bold text-pink-300 block mb-2">{t.settings.cameraLabel}</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  soundManager.playClick();
                  setCameraMode('tpp');
                }}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                  cameraMode === 'tpp'
                    ? 'bg-pink-600 text-white border-2 border-white shadow-md'
                    : 'bg-purple-900/60 text-purple-300 border border-purple-700/60 hover:bg-purple-800'
                }`}
              >
                <span>{t.settings.tppLabel}</span>
              </button>

              <button
                onClick={() => {
                  soundManager.playClick();
                  setCameraMode('fpp');
                }}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                  cameraMode === 'fpp'
                    ? 'bg-pink-600 text-white border-2 border-white shadow-md'
                    : 'bg-purple-900/60 text-purple-300 border border-purple-700/60 hover:bg-purple-800'
                }`}
              >
                <span>{t.settings.fppLabel}</span>
              </button>
            </div>
          </div>

          {/* Graphic Quality */}
          <div>
            <label className="text-xs font-bold text-pink-300 block mb-2">{t.settings.graphicsLabel}</label>
            <div className="grid grid-cols-3 gap-2">
              {(['low', 'med', 'high'] as GraphicQuality[]).map((q) => (
                <button
                  key={q}
                  onClick={() => handleQualityChange(q)}
                  className={`py-2 px-1 rounded-xl text-[11px] font-bold uppercase transition-all ${
                    quality === q
                      ? 'bg-pink-600 text-white border-2 border-white shadow-md'
                      : 'bg-purple-900/60 text-purple-300 border border-purple-700/60 hover:bg-purple-800'
                  }`}
                >
                  {q === 'low' ? t.settings.lowFps : q === 'med' ? t.settings.medFps : t.settings.highFps}
                </button>
              ))}
            </div>
          </div>

          {/* Audio Volume Controls */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-pink-300">{t.settings.audioLabel}</label>
              <button
                onClick={() => {
                  soundManager.init();
                  toggleMute();
                  soundManager.setVolumes(bgmVolume, sfxVolume, !isMuted);
                }}
                className="text-xs text-purple-200 flex items-center gap-1 font-semibold hover:text-white"
              >
                {isMuted ? <VolumeX className="w-3.5 h-3.5 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5 text-pink-300" />}
                {isMuted ? t.common.unmuteAudio : t.common.muteAll}
              </button>
            </div>

            <div className="space-y-3 bg-purple-900/40 p-3 rounded-2xl border border-purple-800/40">
              <div>
                <div className="flex justify-between text-xs text-purple-200 mb-1">
                  <span>{t.settings.bgmLabel}</span>
                  <span className="tabular-nums font-mono">{Math.round(bgmVolume * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={bgmVolume}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    setBgmVolume(val);
                    soundManager.setVolumes(val, sfxVolume, isMuted);
                  }}
                  className="w-full accent-pink-500 h-1.5 bg-purple-950 rounded-lg cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs text-purple-200 mb-1">
                  <span>{t.settings.sfxLabel}</span>
                  <span className="tabular-nums font-mono">{Math.round(sfxVolume * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={sfxVolume}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    setSfxVolume(val);
                    soundManager.setVolumes(bgmVolume, val, isMuted);
                  }}
                  className="w-full accent-pink-500 h-1.5 bg-purple-950 rounded-lg cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Accessibility */}
          <div>
            <label className="text-xs font-bold text-pink-300 block mb-2">{t.settings.accessibilityLabel}</label>
            <div className="space-y-2">
              <button
                onClick={() => {
                  soundManager.playClick();
                  toggleHighContrast();
                }}
                className={`w-full flex items-center justify-between p-3 rounded-xl border text-xs font-bold transition-colors ${
                  highContrast
                    ? 'bg-purple-900 border-pink-400 text-white'
                    : 'bg-purple-900/40 border-purple-800/40 text-purple-300 hover:bg-purple-800/50'
                }`}
              >
                <span className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-pink-400" />
                  {t.settings.highContrast}
                </span>
                <span>{highContrast ? t.common.active : t.common.inactive}</span>
              </button>

              <button
                onClick={() => {
                  soundManager.playClick();
                  toggleReducedMotion();
                }}
                className={`w-full flex items-center justify-between p-3 rounded-xl border text-xs font-bold transition-colors ${
                  reducedMotion
                    ? 'bg-purple-900 border-pink-400 text-white'
                    : 'bg-purple-900/40 border-purple-800/40 text-purple-300 hover:bg-purple-800/50'
                }`}
              >
                <span className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-pink-400" />
                  {t.settings.reducedMotion}
                </span>
                <span>{reducedMotion ? t.common.active : t.common.inactive}</span>
              </button>
            </div>
          </div>

          {/* Reset progress (2-step inline confirm — never uses window.confirm) */}
          <div className="pt-2">
            {!confirmingReset ? (
              <button
                onClick={() => {
                  soundManager.playClick();
                  setConfirmingReset(true);
                }}
                className="w-full py-2.5 rounded-xl border border-rose-800/60 bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 text-xs font-bold flex items-center justify-center gap-2 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                {t.settings.resetAll}
              </button>
            ) : (
              <div className="p-3 rounded-2xl border border-rose-500/70 bg-rose-950/80 space-y-2.5">
                <p className="text-xs font-semibold text-rose-100 leading-relaxed text-center">
                  {t.settings.resetConfirm}
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      soundManager.playClick();
                      setConfirmingReset(false);
                    }}
                    className="py-2 rounded-xl bg-purple-900/80 hover:bg-purple-800 text-purple-200 text-xs font-bold"
                  >
                    {t.settings.resetConfirmCancel}
                  </button>
                  <button
                    onClick={handleConfirmReset}
                    className="py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-extrabold shadow-md"
                  >
                    {t.settings.resetConfirmYes}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
