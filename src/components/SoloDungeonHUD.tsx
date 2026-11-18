/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { DUNGEON_LEVELS, DungeonLevelData } from '../games/dungeon/SoloDungeonGame';
import { soundManager } from '../audio/SoundSynthesizer';
import { inputManager } from '../core/InputManager';
import { TRANSLATIONS } from '../data/i18n';
import {
  ArrowLeft,
  Swords,
  Zap,
  Flame,
  ShieldAlert,
  Volume2,
  VolumeX,
  RotateCcw,
  Timer,
  Pause,
  Play,
  Sparkles,
  Users,
  Shield,
  ChevronsUp,
} from 'lucide-react';
import { useGameStore } from '../state/useGameStore';

interface SoloDungeonHUDProps {
  levelData: DungeonLevelData;
  levelIndex: number;
  playerHp: number;
  playerMaxHp: number;
  playerMp: number;
  playerMaxMp: number;
  bossHp: number;
  bossMaxHp: number;
  minionsKilled: number;
  isUltimateReady: boolean;
  isGameOver: boolean;
  comboCount?: number;
  elapsedTime?: number;
  onAttackSword: () => void;
  onCastMagic: () => void;
  onDash: () => void;
  onCastUltimate: () => void;
  onCastSkill1?: () => void;
  onCastSkill2?: () => void;
  onCastSkill3?: () => void;
  onSelectLevel: (idx: number) => void;
  onRetryLevel: () => void;
  onExitToLobby: () => void;
}

export const SoloDungeonHUD: React.FC<SoloDungeonHUDProps> = ({
  levelData,
  levelIndex,
  playerHp,
  playerMaxHp,
  playerMp,
  playerMaxMp,
  bossHp,
  bossMaxHp,
  minionsKilled,
  isUltimateReady,
  isGameOver,
  comboCount = 0,
  elapsedTime = 0,
  onAttackSword,
  onCastMagic,
  onDash,
  onCastUltimate,
  onCastSkill1,
  onCastSkill2,
  onCastSkill3,
  onSelectLevel,
  onRetryLevel,
  onExitToLobby,
}) => {
  const [showLevelSelect, setShowLevelSelect] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const { isMuted, toggleMute, player, language } = useGameStore();
  const t = TRANSLATIONS[language];

  // Interactive Virtual Joystick State
  const joyBaseRef = useRef<HTMLDivElement>(null);
  const touchIdRef = useRef<number | null>(null);
  const [knobOffset, setKnobOffset] = useState({ x: 0, y: 0 });
  const maxJoyRadius = 38;

  const updateJoystick = (clientX: number, clientY: number) => {
    if (!joyBaseRef.current) return;
    const rect = joyBaseRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = clientX - cx;
    const dy = clientY - cy;
    const dist = Math.hypot(dx, dy);

    if (dist <= maxJoyRadius) {
      setKnobOffset({ x: dx, y: dy });
      inputManager.setVirtualJoystick(dx / maxJoyRadius, dy / maxJoyRadius);
    } else {
      const ang = Math.atan2(dy, dx);
      setKnobOffset({ x: Math.cos(ang) * maxJoyRadius, y: Math.sin(ang) * maxJoyRadius });
      inputManager.setVirtualJoystick(Math.cos(ang), Math.sin(ang));
    }
  };

  const bossHpPercent = Math.max(0, Math.min(100, (bossHp / Math.max(1, bossMaxHp)) * 100));
  const playerHpPercent = Math.max(0, Math.min(100, (playerHp / Math.max(1, playerMaxHp)) * 100));
  const playerMpPercent = Math.max(0, Math.min(100, (playerMp / Math.max(1, playerMaxMp)) * 100));

  const dungeonProgress = player.gameProgress.dungeon || [];

  const formatTimer = (totalSeconds: number) => {
    const safe = Math.max(0, totalSeconds);
    const mins = Math.floor(safe / 60);
    const secs = Math.floor(safe % 60);
    const ms = Math.floor((safe % 1) * 1000);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(3, '0')}`;
  };

  const timerText = formatTimer(elapsedTime);

  return (
    <div className="fixed inset-0 z-30 pointer-events-none select-none flex flex-col justify-between p-2 md:p-5">
      {/* 1. TOP HEADER */}
      <div className="flex flex-col gap-2 w-full pointer-events-auto">
        <div className="flex items-start justify-between w-full">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/60 border border-white/20 text-white font-mono text-[11px] font-bold shadow-md">
              <Swords className="w-3.5 h-3.5 text-white" />
              <span className="tracking-wider">MANUAL</span>
            </div>
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/60 border border-white/20 text-white font-mono text-[11px] font-bold shadow-md">
              <Users className="w-3.5 h-3.5 text-white" />
              <span className="tracking-wider">MANUAL</span>
            </div>
          </div>

          {/* Top Center: Grand Solo Leveling Boss Bar */}
          <div className="flex-1 max-w-xl mx-2 md:mx-6 flex flex-col items-center">
            <div className="flex items-center gap-2 font-display font-black text-xs md:text-sm text-red-500 tracking-wide drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
              <span>LV.{levelData.rank === 'Monarch' ? 90 : 35 + levelIndex * 3}</span>
              <span className="text-white drop-shadow">{levelData.bossName}</span>
            </div>

            <div className="w-full relative mt-1">
              <div className="w-full h-4 md:h-5 rounded-md bg-[#130d22] border-2 border-red-700/80 overflow-hidden relative shadow-2xl flex items-center">
                <div className="absolute inset-0 bg-gradient-to-r from-amber-600 to-yellow-500 opacity-60" />
                <div
                  className="h-full bg-gradient-to-r from-purple-700 via-pink-600 to-rose-500 transition-all duration-150 relative z-10"
                  style={{ width: `${bossHpPercent}%` }}
                >
                  <div className="w-full h-full opacity-35 bg-[repeating-linear-gradient(90deg,transparent,transparent_16px,#000_16px,#000_18px)]" />
                </div>
                <div className="absolute inset-0 z-20 flex items-center justify-center font-mono font-extrabold text-[10px] md:text-xs text-white drop-shadow">
                  {bossHpPercent.toFixed(2)}%
                </div>
              </div>

              <div className="absolute -right-9 -top-0.5 font-display font-black text-xs md:text-sm text-white drop-shadow flex items-center">
                <span className="text-[10px] text-amber-400 mr-0.5">✕</span>
                <span className="text-amber-300 font-bold">15</span>
              </div>

              <div className="w-full h-1.5 rounded-full bg-slate-900 border border-white/20 mt-1 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-400 to-white transition-all duration-150"
                  style={{ width: `${Math.min(100, bossHpPercent * 1.15)}%` }}
                />
              </div>

              <div className="absolute -right-8 top-6 flex items-center gap-1">
                <div className="w-4 h-4 rounded bg-cyan-900 border border-cyan-400 flex items-center justify-center">
                  <ChevronsUp className="w-3 h-3 text-cyan-300" />
                </div>
                <div className="w-4 h-4 rounded bg-amber-900 border border-amber-400 flex items-center justify-center">
                  <Shield className="w-3 h-3 text-amber-300" />
                </div>
              </div>
            </div>
          </div>

          {/* Top Right: Stopwatch Timer & Action Controls */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/70 border border-white/25 text-white shadow-lg">
              <Timer className="w-3.5 h-3.5 text-white animate-spin-slow" />
              <span className="font-mono text-xs md:text-sm font-black tabular-nums tracking-wider text-slate-100">
                {timerText}
              </span>
            </div>

            <button
              onClick={() => {
                soundManager.playClick();
                setIsPaused(!isPaused);
                setShowLevelSelect(!showLevelSelect);
              }}
              className="w-8 h-8 rounded-xl bg-black/70 border border-white/25 flex items-center justify-center text-white hover:bg-white/20 shadow-lg"
              title={t.games.dungeon.selectRankTitle}
            >
              {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
            </button>

            <button
              onClick={() => {
                soundManager.init();
                toggleMute();
              }}
              className="w-8 h-8 rounded-xl bg-black/70 border border-white/25 flex items-center justify-center text-white hover:bg-white/20 shadow-lg"
              title={t.common.muteAudio}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-cyan-300" />}
            </button>

            <button
              onClick={() => {
                soundManager.playMenuTransition();
                onExitToLobby();
              }}
              className="px-2.5 py-1.5 bg-slate-900 border border-purple-500/50 text-white rounded-xl text-xs font-bold hover:bg-slate-800 shadow-md hidden sm:flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-purple-400" />
              <span>{t.common.exit}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. MIDDLE ZONE: Real Hits Combo Counter */}
      <div className="flex items-center justify-between w-full pointer-events-none my-auto">
        {comboCount > 0 && (
          <div className="relative pl-2 md:pl-6 pointer-events-none">
            <div className="relative flex items-center animate-pulse">
              <div className="absolute -left-3 -top-1 w-36 md:w-48 h-10 md:h-12 bg-gradient-to-r from-red-600 via-rose-700 to-transparent skew-x-[-24deg] opacity-80 blur-[1px]" />
              <div className="relative z-10 flex items-baseline gap-1 font-display italic font-black text-white drop-shadow-[0_4px_8px_rgba(0,0,0,0.9)]">
                <span className="text-3xl md:text-5xl text-white tracking-tighter">
                  {comboCount}
                </span>
                <span className="text-xl md:text-3xl text-red-300 font-extrabold tracking-widest uppercase">
                  HITS
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 3. BOTTOM BAR */}
      <div className="flex items-end justify-between w-full pointer-events-auto gap-3">
        {/* Bottom Left: Interactive Touch Joystick */}
        <div
          ref={joyBaseRef}
          onTouchStart={(e) => {
            if (touchIdRef.current !== null) return;
            const touch = e.changedTouches[0];
            touchIdRef.current = touch.identifier;
            updateJoystick(touch.clientX, touch.clientY);
          }}
          onTouchMove={(e) => {
            for (let i = 0; i < e.changedTouches.length; i++) {
              if (e.changedTouches[i].identifier === touchIdRef.current) {
                updateJoystick(e.changedTouches[i].clientX, e.changedTouches[i].clientY);
                break;
              }
            }
          }}
          onTouchEnd={(e) => {
            for (let i = 0; i < e.changedTouches.length; i++) {
              if (e.changedTouches[i].identifier === touchIdRef.current) {
                touchIdRef.current = null;
                setKnobOffset({ x: 0, y: 0 });
                inputManager.setVirtualJoystick(0, 0);
                break;
              }
            }
          }}
          onTouchCancel={() => {
            touchIdRef.current = null;
            setKnobOffset({ x: 0, y: 0 });
            inputManager.setVirtualJoystick(0, 0);
          }}
          className="w-24 h-24 md:w-32 md:h-32 rounded-full border-2 border-white/30 bg-black/35 backdrop-blur-sm flex items-center justify-center relative shadow-2xl touch-none"
        >
          <div
            className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-cyan-400/35 border border-cyan-300/70 flex items-center justify-center absolute transition-transform duration-75 ease-out"
            style={{ transform: `translate(${knobOffset.x}px, ${knobOffset.y}px)` }}
          >
            <div className="w-3 h-3 rounded-full bg-cyan-300 shadow-[0_0_10px_#00f0ff]" />
          </div>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
            <div className="w-full h-[1px] bg-white" />
            <div className="h-full w-[1px] bg-white absolute" />
          </div>
        </div>

        {/* Bottom Center: Futuristic Player HP/MP Bracket */}
        <div className="flex-1 max-w-sm md:max-w-md mx-auto mb-1">
          <div className="bg-[#0b0c16]/90 border border-cyan-500/40 rounded-2xl p-2.5 backdrop-blur-md shadow-2xl relative">
            <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-cyan-400 rounded-tl-lg" />
            <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-cyan-400 rounded-tr-lg" />
            <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-cyan-400 rounded-bl-lg" />
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-cyan-400 rounded-br-lg" />

            <div className="flex items-center gap-3">
              <div className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-700 font-display font-black text-xs md:text-sm text-white shadow-md">
                LV.{Math.max(player.level, 40)}
              </div>

              <div className="flex-1 flex flex-col gap-1.5">
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-3 rounded-full bg-slate-900 border border-green-500/40 overflow-hidden relative shadow-inner">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-green-400 transition-all duration-150"
                      style={{ width: `${playerHpPercent}%` }}
                    />
                  </div>
                  <span className="font-mono text-[11px] text-green-300 font-bold tabular-nums min-w-[75px] text-right">
                    {Math.round(playerHp)}/{playerMaxHp}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 rounded-full bg-slate-900 border border-cyan-500/40 overflow-hidden relative shadow-inner">
                    <div
                      className="h-full bg-gradient-to-r from-blue-600 to-cyan-400 transition-all duration-150"
                      style={{ width: `${playerMpPercent}%` }}
                    />
                  </div>
                  <span className="font-mono text-[10px] text-cyan-300 font-semibold tabular-nums min-w-[75px] text-right">
                    {Math.round(playerMp)}/{playerMaxMp}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Right: Circular Combat Action Dock */}
        <div className="relative flex items-end justify-end pointer-events-auto">
          <div className="grid grid-cols-3 gap-2.5 items-end">
            <button
              onClick={onCastSkill1 || onCastMagic}
              className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-[#111326]/90 border-2 border-white/40 flex items-center justify-center text-white hover:border-cyan-400 hover:scale-105 active:scale-95 transition-all shadow-xl backdrop-blur-md"
              title="Skill 1 [1]"
            >
              <Zap className="w-5 h-5 text-cyan-300" />
            </button>

            <button
              onClick={onCastSkill2 || onAttackSword}
              className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-[#111326]/90 border-2 border-white/40 flex items-center justify-center text-white hover:border-pink-400 hover:scale-105 active:scale-95 transition-all shadow-xl backdrop-blur-md"
              title="Skill 2 [2]"
            >
              <Sparkles className="w-5 h-5 text-pink-300" />
            </button>

            <button
              onClick={onCastSkill3 || onCastMagic}
              className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-[#111326]/90 border-2 border-white/40 flex items-center justify-center text-white hover:border-purple-400 hover:scale-105 active:scale-95 transition-all shadow-xl backdrop-blur-md"
              title="Skill 3 [3]"
            >
              <Flame className="w-5 h-5 text-purple-300" />
            </button>

            <button
              onClick={onCastUltimate}
              className={`w-14 h-14 md:w-16 md:h-16 rounded-2xl border-2 flex flex-col items-center justify-center transition-all shadow-2xl relative ${
                isUltimateReady
                  ? 'bg-gradient-to-tr from-purple-700 via-pink-600 to-amber-400 border-amber-300 scale-105 animate-pulse shadow-[0_0_20px_#a855f7]'
                  : 'bg-[#0f0e24]/90 border-purple-500/40 text-purple-400 opacity-80'
              }`}
              title="ARISE! [Q]"
            >
              <Flame className={`w-7 h-7 ${isUltimateReady ? 'text-white' : 'text-purple-400'}`} />
              <span className="text-[9px] font-display font-black text-white tracking-wider mt-0.5">
                {isUltimateReady ? 'ARISE!' : `${minionsKilled}/3`}
              </span>
            </button>

            <button
              onClick={onDash}
              className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-[#0d122b]/95 border-2 border-cyan-400 flex items-center justify-center text-white hover:bg-cyan-900/60 hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-cyan-950/80"
              title="Dash [Space]"
            >
              <Zap className="w-7 h-7 text-cyan-300" />
            </button>

            <button
              onClick={onAttackSword}
              className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-tr from-slate-900 via-indigo-950 to-slate-800 border-3 border-cyan-300 flex items-center justify-center text-white hover:scale-105 active:scale-95 transition-all shadow-[0_0_25px_rgba(6,182,212,0.6)]"
              title="Attack [J]"
            >
              <Swords className="w-8 h-8 md:w-10 md:h-10 text-cyan-200" />
            </button>
          </div>
        </div>
      </div>

      {/* Level Selector Modal (1 to 20) */}
      {showLevelSelect && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 pointer-events-auto z-50">
          <div className="bg-[#0f0924] border-2 border-purple-400 rounded-3xl p-6 max-w-lg w-full shadow-2xl animate-scale-up">
            <div className="flex items-center justify-between mb-4 border-b border-purple-900 pb-3">
              <div>
                <div className="font-display font-black text-lg text-white">
                  {t.games.dungeon.selectRankTitle}
                </div>
                <div className="text-xs text-purple-300">
                  {t.games.dungeon.selectRankSub}
                </div>
              </div>
              <button
                onClick={() => {
                  setShowLevelSelect(false);
                  setIsPaused(false);
                }}
                className="text-purple-300 hover:text-white font-bold text-sm bg-purple-900/60 px-3 py-1 rounded-xl"
              >
                {t.common.close}
              </button>
            </div>

            <div className="grid grid-cols-5 gap-2 max-h-[55vh] overflow-y-auto p-1">
              {DUNGEON_LEVELS.map((lvl, idx) => {
                const prog = dungeonProgress[idx];
                const isCurrent = idx === levelIndex;
                const isCompleted = prog?.completed;

                return (
                  <button
                    key={idx}
                    onClick={() => {
                      soundManager.playLevelSwitch();
                      onSelectLevel(idx);
                      setShowLevelSelect(false);
                      setIsPaused(false);
                    }}
                    className={`p-2.5 rounded-2xl flex flex-col items-center justify-center font-display font-bold transition-all ${
                      isCurrent
                        ? 'bg-purple-600 text-white ring-2 ring-cyan-400 scale-105 shadow-lg'
                        : isCompleted
                        ? 'bg-purple-900 text-purple-100 hover:bg-purple-800'
                        : 'bg-slate-900 text-purple-400 hover:bg-slate-800'
                    }`}
                  >
                    <span className="text-sm md:text-base">{lvl.levelNumber}</span>
                    <span className="text-[9px] text-amber-300 opacity-90">{lvl.rank.slice(0, 3)}</span>
                    <div className="text-[10px] text-amber-300 min-h-[14px]">
                      {isCompleted ? '⭐'.repeat(prog?.stars || 1) : '·'}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Game Over Screen */}
      {isGameOver && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 pointer-events-auto z-50">
          <div className="bg-gradient-to-b from-rose-950/90 to-black border-2 border-rose-500 rounded-3xl p-6 md:p-8 max-w-md w-full text-center shadow-2xl animate-scale-up">
            <ShieldAlert className="w-14 h-14 text-rose-500 mx-auto mb-3 animate-bounce" />
            <div className="font-display font-black text-2xl text-white mb-2">
              {t.games.dungeon.hunterEliminated}
            </div>
            <p className="text-xs text-rose-200 mb-6">
              {t.games.dungeon.eliminatedDesc}
            </p>
            <div className="flex gap-3">
              <button
                onClick={onExitToLobby}
                className="btn-3d flex-1 py-3 bg-slate-900 border-b-4 border-slate-950 text-white font-bold rounded-xl text-sm"
              >
                {t.games.dungeon.toLobby}
              </button>
              <button
                onClick={onRetryLevel}
                className="btn-3d flex-1 py-3 bg-gradient-to-r from-rose-600 to-purple-700 border-b-4 border-rose-900 text-white font-extrabold rounded-xl text-sm flex items-center justify-center gap-2 shadow-lg"
              >
                <RotateCcw className="w-4 h-4" />
                <span>{t.common.retryLevel}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
