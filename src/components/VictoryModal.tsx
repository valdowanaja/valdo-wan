/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { soundManager } from '../audio/SoundSynthesizer';
import { useGameStore } from '../state/useGameStore';
import { TRANSLATIONS, formatMsg } from '../data/i18n';
import { Star, ArrowRight, Home, Sparkles, BookOpen } from 'lucide-react';

interface VictoryModalProps {
  title: string;
  explanation: string;
  starsEarned: number;
  xpEarned: number;
  isLastLevel: boolean;
  onNextLevel: () => void;
  onExitLobby: () => void;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({
  title,
  explanation,
  starsEarned,
  xpEarned,
  isLastLevel,
  onNextLevel,
  onExitLobby,
}) => {
  const { language } = useGameStore();
  const t = TRANSLATIONS[language];

  useEffect(() => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#ec4899', '#f43f5e', '#facc15', '#38bdf8'],
      });
    } catch {}
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 select-none">
      <div className="bg-gradient-to-b from-purple-950 to-[#220d38] border-2 border-pink-400 rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl text-center animate-scale-up">
        {/* Victory Tag */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500/20 border border-pink-400 text-pink-300 text-xs font-bold mb-3">
          <Sparkles className="w-4 h-4 text-pink-400" />
          {t.victory.tag}
        </div>

        <h2 className="font-display font-extrabold text-3xl md:text-4xl text-white mb-2">
          {t.victory.greatJob}
        </h2>
        <p className="text-purple-200 text-sm font-semibold mb-6">
          {t.victory.solvedPrefix} <span className="text-white font-bold">{title}</span>
        </p>

        {/* 3 Stars Animation */}
        <div className="flex justify-center items-center gap-3 mb-6">
          {[1, 2, 3].map((starIdx) => (
            <div
              key={starIdx}
              className={`transition-all duration-500 transform ${
                starIdx <= starsEarned
                  ? 'text-amber-300 scale-110 drop-shadow-[0_0_12px_rgba(251,191,36,0.8)]'
                  : 'text-purple-900/60 scale-90'
              }`}
            >
              <Star className="w-12 h-12 fill-current" />
            </div>
          ))}
        </div>

        {/* Educational Rationale Box */}
        <div className="bg-purple-900/50 border border-purple-600/40 rounded-2xl p-4 text-left mb-6">
          <div className="flex items-center gap-2 text-xs font-bold text-pink-300 mb-1.5">
            <BookOpen className="w-4 h-4" />
            {t.victory.whyTitle}
          </div>
          <p className="text-xs md:text-sm text-purple-100 leading-relaxed font-medium">
            {explanation}
          </p>
        </div>

        {/* XP Reward Badge */}
        <div className="inline-block bg-pink-500/20 border border-pink-400/50 px-4 py-1.5 rounded-full text-pink-300 font-display font-bold text-sm mb-6">
          {formatMsg(t.victory.xpEarned, { xp: xpEarned })}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => {
              soundManager.playClick();
              onExitLobby();
            }}
            className="btn-3d w-full sm:w-auto px-5 py-3 bg-purple-900 border-b-4 border-purple-950 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4 text-pink-300" />
            {t.common.backToLobby}
          </button>

          {!isLastLevel && (
            <button
              onClick={() => {
                soundManager.playClick();
                onNextLevel();
              }}
              className="btn-3d w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-600 border-b-4 border-rose-800 text-white rounded-xl text-base font-extrabold shadow-lg shadow-pink-900/50 flex items-center justify-center gap-2"
            >
              <span>{t.common.nextLevel}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
