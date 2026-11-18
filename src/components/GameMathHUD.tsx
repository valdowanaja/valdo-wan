/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { MathLevelData, MATH_LEVELS } from '../games/math/MathCastleGame';
import { soundManager } from '../audio/SoundSynthesizer';
import { ArrowLeft, HelpCircle, Sparkles, Volume2, VolumeX, CheckCircle } from 'lucide-react';
import { useGameStore } from '../state/useGameStore';
import { TRANSLATIONS } from '../data/i18n';

interface GameMathHUDProps {
  levelData: MathLevelData;
  levelIndex: number;
  placedBlocks: (string | null)[];
  isBridgeOpen: boolean;
  interactionPrompt: string | null;
  onSelectLevel: (idx: number) => void;
  onExitToLobby: () => void;
  onTriggerInteract: () => void;
}

export const GameMathHUD: React.FC<GameMathHUDProps> = ({
  levelData,
  levelIndex,
  isBridgeOpen,
  interactionPrompt,
  onSelectLevel,
  onExitToLobby,
  onTriggerInteract,
}) => {
  const [showHint, setShowHint] = useState(false);
  const [showLevelSelect, setShowLevelSelect] = useState(false);
  const { isMuted, toggleMute, player, language } = useGameStore();
  const t = TRANSLATIONS[language];

  return (
    <div className="fixed inset-0 z-20 pointer-events-none select-none flex flex-col justify-between p-4 md:p-6">
      {/* Top Header: Navigation, Level Info, Hint & Sound */}
      <div className="flex items-center justify-between w-full pointer-events-auto">
        <button
          onClick={() => {
            soundManager.playClick();
            onExitToLobby();
          }}
          className="btn-3d px-3.5 py-2 bg-purple-950/80 border-b-4 border-purple-950 text-white rounded-xl flex items-center gap-2 border border-purple-400/30 text-xs md:text-sm font-bold shadow-md"
        >
          <ArrowLeft className="w-4 h-4 text-pink-400" />
          <span className="hidden sm:inline">{t.common.backToLobby}</span>
          <span className="sm:hidden">{t.common.lobby}</span>
        </button>

        {/* Center: Equation & Level Title */}
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-2 bg-purple-950/80 border border-purple-400/30 px-4 py-1 rounded-full text-xs text-pink-300 font-bold backdrop-blur-md mb-1.5">
            <Sparkles className="w-3.5 h-3.5 text-pink-400" />
            <button
              onClick={() => setShowLevelSelect(!showLevelSelect)}
              className="hover:underline flex items-center gap-1"
            >
              <span>{t.common.level} {levelIndex + 1} / {MATH_LEVELS.length}: {levelData.title}</span>
              <span className="text-white/40">▾</span>
            </button>
          </div>

          <div
            className={`px-6 py-2.5 rounded-2xl border-2 backdrop-blur-md shadow-xl transition-all ${
              isBridgeOpen
                ? 'bg-emerald-950/90 border-emerald-400 text-emerald-200 shadow-emerald-900/50 scale-105'
                : 'bg-purple-950/90 border-pink-400/80 text-white shadow-pink-950/50'
            }`}
          >
            <div className="font-display font-extrabold text-2xl md:text-3xl tracking-wider text-center">
              {levelData.equationDisplay}
            </div>
          </div>
        </div>

        {/* Right Tools: Hint & Sound */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              soundManager.playClick();
              setShowHint(!showHint);
            }}
            className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-colors shadow-md ${
              showHint
                ? 'bg-amber-500 border-amber-300 text-slate-900'
                : 'bg-purple-950/80 border-purple-400/30 text-amber-300 hover:bg-purple-900'
            }`}
            title={t.games.math.edubotHint}
          >
            <HelpCircle className="w-5 h-5" />
          </button>

          <button
            onClick={() => {
              soundManager.init();
              toggleMute();
            }}
            className="w-10 h-10 rounded-xl bg-purple-950/80 border border-purple-400/30 flex items-center justify-center text-white hover:bg-purple-900 shadow-md"
            title={t.common.muteAudio}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-pink-300" />}
          </button>
        </div>
      </div>

      {/* Level Selector Dropdown Modal */}
      {showLevelSelect && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 pointer-events-auto z-40">
          <div className="bg-purple-950 border-2 border-purple-400 rounded-3xl p-6 max-w-lg w-full shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <div className="font-display font-extrabold text-xl text-white">{t.games.math.pickLevelTitle}</div>
              <button
                onClick={() => setShowLevelSelect(false)}
                className="text-purple-300 hover:text-white font-bold text-sm"
              >
                {t.common.close}
              </button>
            </div>

            <div className="grid grid-cols-5 gap-2.5">
              {MATH_LEVELS.map((lvl, idx) => {
                const prog = player.gameProgress.math[idx];
                const isCurrent = idx === levelIndex;
                return (
                  <button
                    key={lvl.levelNumber}
                    onClick={() => {
                      soundManager.playClick();
                      onSelectLevel(idx);
                      setShowLevelSelect(false);
                    }}
                    className={`p-3 rounded-2xl flex flex-col items-center justify-center font-display font-bold transition-all ${
                      isCurrent
                        ? 'bg-pink-500 text-white ring-2 ring-white scale-105'
                        : prog?.completed
                        ? 'bg-purple-800 text-purple-200 hover:bg-purple-700'
                        : 'bg-purple-900/60 text-purple-400 hover:bg-purple-800/60'
                    }`}
                  >
                    <span className="text-lg">{lvl.levelNumber}</span>
                    <div className="flex text-amber-300 text-xs mt-0.5">
                      {prog?.completed ? '⭐'.repeat(prog.stars || 1) : ''}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Hint Dialog Overlay */}
      {showHint && (
        <div className="mx-auto max-w-md w-full bg-slate-900/95 border-2 border-amber-400 rounded-3xl p-4 shadow-2xl backdrop-blur-md pointer-events-auto animate-scale-up">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-400 flex items-center justify-center text-xl shrink-0">
              💡
            </div>
            <div>
              <div className="font-display font-bold text-sm text-amber-300">{t.games.math.edubotHint}</div>
              <p className="text-xs text-white/90 font-medium mt-1 leading-relaxed">
                {levelData.hint}
              </p>
              <button
                onClick={() => setShowHint(false)}
                className="mt-2 text-xs font-bold text-pink-400 hover:text-pink-300"
              >
                {t.common.understand}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Notification Banner when bridge rises */}
      {isBridgeOpen && (
        <div className="mx-auto bg-emerald-950/90 border-2 border-emerald-400 px-6 py-3 rounded-2xl shadow-2xl backdrop-blur-md pointer-events-auto flex items-center gap-3 animate-bounce">
          <CheckCircle className="w-6 h-6 text-emerald-400" />
          <div>
            <div className="font-display font-bold text-emerald-300 text-sm md:text-base">
              {t.games.math.bridgeOpenTitle}
            </div>
            <div className="text-xs text-emerald-100 font-medium">
              {t.games.math.bridgeOpenDesc}
            </div>
          </div>
        </div>
      )}

      {/* Bottom Center Interaction CTA */}
      <div className="text-center pointer-events-auto">
        {interactionPrompt && (
          <button
            onClick={() => {
              soundManager.playClick();
              onTriggerInteract();
            }}
            className="btn-3d px-6 py-3.5 bg-gradient-to-r from-pink-500 to-rose-600 border-b-4 border-rose-800 text-white font-extrabold text-base md:text-lg rounded-2xl shadow-xl shadow-pink-900/60 animate-pulse"
          >
            {interactionPrompt}
          </button>
        )}
      </div>
    </div>
  );
};
