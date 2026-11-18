/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { GameInfo } from '../types';
import { soundManager } from '../audio/SoundSynthesizer';
import { Play, Sparkles, BookOpen, Target, Lightbulb } from 'lucide-react';

interface GuardianDialogModalProps {
  game: GameInfo;
  onStartGame: (game: GameInfo) => void;
  onClose: () => void;
}

export const GuardianDialogModal: React.FC<GuardianDialogModalProps> = ({
  game,
  onStartGame,
  onClose,
}) => {
  const g = game.guardian;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 select-none pointer-events-auto">
      <div className="bg-gradient-to-b from-purple-950 to-[#1e0a30] border-2 border-pink-400 rounded-3xl p-6 md:p-8 max-w-xl w-full shadow-2xl max-h-[90vh] overflow-y-auto animate-scale-up">
        {/* Top Header: Guardian Persona */}
        <div className="flex items-center justify-between pb-4 border-b border-purple-800/80">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-purple-900 border-2 border-pink-400 flex items-center justify-center text-3xl shadow-lg shrink-0">
              {g.avatar}
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-pink-500/20 text-pink-300 text-xs font-bold mb-0.5">
                <Sparkles className="w-3.5 h-3.5 text-pink-400" />
                Penjaga Gerbang {game.subject}
              </div>
              <div className="font-display font-extrabold text-2xl text-white">
                {g.name}
              </div>
              <div className="text-xs text-purple-200 font-semibold">{g.title}</div>
            </div>
          </div>
          <button
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="text-purple-300 hover:text-white font-bold text-sm"
          >
            ✕
          </button>
        </div>

        {/* Greeting quote */}
        <div className="my-4 bg-purple-900/40 border border-purple-700/50 p-3.5 rounded-2xl italic text-xs md:text-sm text-purple-100 font-medium">
          "{g.greeting}"
        </div>

        {/* Game Rules Section */}
        <div className="space-y-4 mb-6">
          <div className="bg-purple-900/50 border border-purple-700/60 rounded-2xl p-4">
            <div className="flex items-center gap-2 text-sm font-bold text-pink-300 mb-2.5">
              <BookOpen className="w-4 h-4 text-pink-400" />
              Peraturan Game: {game.title}
            </div>
            <ul className="space-y-2">
              {g.rules.map((rule, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs md:text-sm text-white/90">
                  <span className="w-5 h-5 rounded-full bg-pink-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span>{rule}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Learning Objectives */}
          <div className="bg-purple-900/30 border border-purple-800/50 rounded-2xl p-3.5">
            <div className="flex items-center gap-2 text-xs font-bold text-cyan-300 mb-1.5">
              <Target className="w-4 h-4 text-cyan-400" />
              Tujuan Pembelajaran
            </div>
            <div className="space-y-1">
              {g.objectives.map((obj, i) => (
                <div key={i} className="text-xs text-purple-200 flex items-start gap-1.5">
                  <span className="text-cyan-400">•</span>
                  <span>{obj}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Pro Tip */}
          <div className="bg-amber-950/40 border border-amber-500/40 rounded-2xl p-3 flex items-start gap-2.5">
            <Lightbulb className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-200 font-medium">
              <span className="font-bold text-amber-300">Tips Penjaga: </span>
              {g.proTip}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
          <button
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="btn-3d w-full sm:w-auto px-5 py-3 bg-purple-900 border-b-4 border-purple-950 text-white rounded-xl text-sm font-bold"
          >
            Nanti Dulu
          </button>
          <button
            onClick={() => {
              soundManager.playClick();
              onStartGame(game);
            }}
            className="btn-3d w-full sm:w-auto px-7 py-3 bg-gradient-to-r from-pink-500 to-rose-600 border-b-4 border-rose-800 text-white rounded-xl text-base font-extrabold shadow-lg shadow-pink-900/60 flex items-center justify-center gap-2"
          >
            <Play className="w-5 h-5 fill-current" />
            <span>Mulai Mainkan Sekarang!</span>
          </button>
        </div>
      </div>
    </div>
  );
};
