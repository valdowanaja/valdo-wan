/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { GameInfo } from '../types';
import { soundManager } from '../audio/SoundSynthesizer';
import { ArrowLeft, Play, RotateCcw, Volume2, VolumeX, Sparkles, HelpCircle } from 'lucide-react';
import { useGameStore } from '../state/useGameStore';
import { LOCALIZED_GAMES, TRANSLATIONS, formatMsg } from '../data/i18n';

interface MiniGameHUDProps {
  game: GameInfo;
  onExit: () => void;
  currentLevelIdx: number;
  totalLevels?: number;
  levelTitle?: string;
  levelDescription?: string;
  onSelectLevel: (idx: number) => void;

  physicsData?: {
    angle: number;
    power: number;
    gravity: number;
    wind: number;
    targetsHit: number;
    totalTargets: number;
    planetName?: string;
    onSetAngle: (a: number) => void;
    onSetPower: (p: number) => void;
    onSetGravity: (g: number) => void;
    onLaunch: () => void;
  };
  designData?: {
    baseHue: number;
    accentHue: number;
    rule: string;
    targetRule: 'complementary' | 'analogous' | 'triadic';
    targetBaseHue: number;
    score: number;
    onSetBase: (h: number) => void;
    onSetAccent: (h: number) => void;
    onSetRule: (r: 'complementary' | 'analogous' | 'triadic') => void;
  };
  uiData?: {
    alignments: number[];
    cardLabels?: string[];
    onNudge: (idx: number, delta: number) => void;
  };
  uxData?: {
    steps: string[];
    persona?: string;
    satisfaction: number;
    options: Array<{ label: string; isGood: boolean; picked: boolean }>;
    onToggleFix: (idx: number) => void;
  };
  chemData?: {
    atoms: string[];
    formula?: string;
    targetMolecule?: string;
    requiredAtoms?: Record<string, number>;
    overloadMessage?: string | null;
    onAddAtom: (sym: 'H' | 'O' | 'C' | 'N') => void;
    onReset: () => void;
  };
  codeData?: {
    commands: string[];
    onAddCommand: (c: string) => void;
    onClear: () => void;
    onExecute: () => void;
  };
  bioData?: {
    collected: number;
    targetCount: number;
    organelle?: string;
    nodes: Array<{ id: number; kind: 'photon' | 'ros'; collected: boolean }>;
    onCollect: (id: number) => void;
  };
}

export const MiniGameHUD: React.FC<MiniGameHUDProps> = ({
  game,
  onExit,
  currentLevelIdx,
  totalLevels = 20,
  levelTitle,
  levelDescription,
  onSelectLevel,
  physicsData,
  designData,
  uiData,
  uxData,
  chemData,
  codeData,
  bioData,
}) => {
  const { isMuted, toggleMute, player, language } = useGameStore();
  const t = TRANSLATIONS[language];
  const locGame = LOCALIZED_GAMES[language][game.id];
  const gameTitle = locGame?.title || game.title;

  const [showLevelSelect, setShowLevelSelect] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const gameProgressList = player.gameProgress[game.id] || [];

  const getLocalizedCodeCmd = (rawCmd: string) => {
    if (rawCmd === 'Maju') return t.games.code.cmdForward;
    if (rawCmd === 'Kiri') return t.games.code.cmdLeft;
    if (rawCmd === 'Kanan') return t.games.code.cmdRight;
    return rawCmd;
  };

  return (
    <div className="fixed inset-0 z-20 pointer-events-none select-none flex flex-col justify-between p-3 md:p-6">
      {/* Top Bar: Return, Title, Level Selector, Audio */}
      <div className="flex items-center justify-between w-full pointer-events-auto gap-2">
        <button
          onClick={() => {
            soundManager.playClick();
            onExit();
          }}
          className="btn-3d px-3.5 py-2 bg-purple-950/80 border-b-4 border-purple-950 text-white rounded-xl flex items-center gap-2 border border-purple-400/30 text-xs md:text-sm font-bold shadow-md shrink-0"
        >
          <ArrowLeft className="w-4 h-4 text-pink-400" />
          <span className="hidden sm:inline">{t.common.backToLobby}</span>
          <span className="sm:hidden">{t.common.lobby}</span>
        </button>

        {/* Center Game Title & Level Selector Badge */}
        <div className="flex flex-col items-center max-w-md text-center">
          <div className="flex items-center gap-2 bg-purple-950/90 border border-pink-400/60 px-4 py-1.5 rounded-2xl backdrop-blur-md shadow-xl">
            <Sparkles className="w-4 h-4 text-pink-400 shrink-0" />
            <div className="text-left">
              <div className="font-display font-extrabold text-xs md:text-sm text-white flex items-center gap-1.5">
                <span>{gameTitle}</span>
                <span className="text-pink-400">·</span>
                <button
                  onClick={() => setShowLevelSelect(!showLevelSelect)}
                  className="bg-pink-600/60 hover:bg-pink-500 text-pink-100 px-2 py-0.5 rounded-lg text-[11px] font-bold inline-flex items-center gap-1 transition-colors"
                >
                  <span>{t.common.level} {currentLevelIdx + 1} / {totalLevels}</span>
                  <span className="text-[10px]">▾</span>
                </button>
              </div>
              {levelTitle && (
                <div className="text-[10px] md:text-[11px] text-pink-200 font-semibold truncate max-w-[220px] md:max-w-[320px]">
                  {levelTitle}
                </div>
              )}
            </div>
          </div>

          {game.id === 'physics' && (
            <div className="mt-2 px-3 py-1 rounded-full bg-black/55 border border-pink-400/40 text-[10px] md:text-xs text-pink-100 font-semibold backdrop-blur-sm">
              {t.games.physics.cameraHint}
            </div>
          )}
        </div>

        {/* Right Tools: Hint & Sound */}
        <div className="flex items-center gap-2 shrink-0">
          {levelDescription && (
            <button
              onClick={() => {
                soundManager.playClick();
                setShowHint(!showHint);
              }}
              className={`w-9 h-9 md:w-10 md:h-10 rounded-xl border flex items-center justify-center transition-colors shadow-md ${
                showHint
                  ? 'bg-amber-500 border-amber-300 text-slate-900'
                  : 'bg-purple-950/80 border-purple-400/30 text-amber-300 hover:bg-purple-900'
              }`}
              title={levelTitle || gameTitle}
            >
              <HelpCircle className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={() => {
              soundManager.init();
              toggleMute();
            }}
            className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-purple-950/80 border border-purple-400/30 flex items-center justify-center text-white hover:bg-purple-900 shadow-md"
            title={t.common.muteAudio}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-pink-300" />}
          </button>
        </div>
      </div>

      {/* Level Selector Dropdown Modal (1 to 20) */}
      {showLevelSelect && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 pointer-events-auto z-40">
          <div className="bg-purple-950 border-2 border-purple-400 rounded-3xl p-5 md:p-6 max-w-lg w-full shadow-2xl animate-scale-up">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="font-display font-extrabold text-lg md:text-xl text-white">
                  {formatMsg(t.games.selectLevelTitle, { title: gameTitle })}
                </div>
                <div className="text-xs text-pink-300 font-medium">
                  {t.games.twentyStages}
                </div>
              </div>
              <button
                onClick={() => setShowLevelSelect(false)}
                className="text-purple-300 hover:text-white font-bold text-sm bg-purple-900/60 px-3 py-1 rounded-xl"
              >
                {t.common.close}
              </button>
            </div>

            <div className="grid grid-cols-5 gap-2 md:gap-2.5 max-h-[60vh] overflow-y-auto p-1">
              {Array.from({ length: totalLevels }, (_, idx) => {
                const prog = gameProgressList[idx];
                const isCurrent = idx === currentLevelIdx;
                const isCompleted = prog?.completed;

                return (
                  <button
                    key={idx}
                    onClick={() => {
                      soundManager.playClick();
                      onSelectLevel(idx);
                      setShowLevelSelect(false);
                    }}
                    className={`p-2.5 md:p-3 rounded-2xl flex flex-col items-center justify-center font-display font-bold transition-all ${
                      isCurrent
                        ? 'bg-pink-500 text-white ring-2 ring-white scale-105 shadow-lg'
                        : isCompleted
                        ? 'bg-purple-800 text-purple-100 hover:bg-purple-700'
                        : 'bg-purple-900/60 text-purple-300 hover:bg-purple-800/60'
                    }`}
                  >
                    <span className="text-base md:text-lg">{idx + 1}</span>
                    <div className="flex text-amber-300 text-[10px] md:text-xs mt-0.5 min-h-[14px]">
                      {isCompleted ? '⭐'.repeat(prog?.stars || 1) : <span className="opacity-40 text-purple-400">·</span>}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Educational Concept Hint Overlay */}
      {showHint && levelDescription && (
        <div className="mx-auto max-w-md w-full bg-slate-900/95 border-2 border-amber-400 rounded-3xl p-4 shadow-2xl backdrop-blur-md pointer-events-auto animate-scale-up my-auto">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-400 flex items-center justify-center text-xl shrink-0">
              💡
            </div>
            <div>
              <div className="font-display font-bold text-sm text-amber-300">
                {formatMsg(t.games.scienceConcept, { title: levelTitle || gameTitle })}
              </div>
              <p className="text-xs text-white/90 font-medium mt-1 leading-relaxed">
                {levelDescription}
              </p>
              <button
                onClick={() => setShowHint(false)}
                className="mt-2 text-xs font-bold text-pink-400 hover:text-pink-300"
              >
                {t.games.gotItContinue}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Interactive Control Dock */}
      <div className="w-full max-w-xl mx-auto bg-purple-950/95 border-2 border-pink-400/80 rounded-3xl p-4 md:p-5 shadow-2xl backdrop-blur-md pointer-events-auto">
        {/* 1. Physics: Sakura Launch */}
        {game.id === 'physics' && physicsData && (
          <div className="space-y-3">
            <div className="flex flex-wrap justify-between items-center gap-2 text-xs font-bold text-pink-300">
              <span>{t.games.physics.angle}: {physicsData.angle}°</span>
              <span>{t.games.physics.power}: {physicsData.power} m/s</span>
              <span className={Math.abs(physicsData.wind) > 0.05 ? 'text-cyan-300' : ''}>
                {t.games.physics.windLabel}:{' '}
                {Math.abs(physicsData.wind) < 0.05
                  ? '0 m/s²'
                  : `${physicsData.wind > 0 ? '→ +' : '← '}${physicsData.wind.toFixed(1)} m/s²`}
              </span>
              <span>
                {t.games.physics.targetsLabel}: {physicsData.targetsHit}/{physicsData.totalTargets}
              </span>
            </div>
            <div className="text-[11px] font-semibold text-purple-200 flex justify-between">
              <span>
                {t.games.physics.field}: {physicsData.planetName || (physicsData.gravity === 9.8 ? t.games.physics.earthLabel : t.games.physics.moonLabel)} ({physicsData.gravity} m/s²)
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] text-purple-200 font-semibold block mb-1">{t.games.physics.elevationLabel}</label>
                <input
                  type="range"
                  min="15"
                  max="75"
                  value={physicsData.angle}
                  onChange={(e) => physicsData.onSetAngle(Number(e.target.value))}
                  className="w-full accent-pink-500 cursor-pointer"
                />
              </div>
              <div>
                <label className="text-[10px] text-purple-200 font-semibold block mb-1">{t.games.physics.springPowerLabel}</label>
                <input
                  type="range"
                  min="10"
                  max="28"
                  value={physicsData.power}
                  onChange={(e) => physicsData.onSetPower(Number(e.target.value))}
                  className="w-full accent-pink-500 cursor-pointer"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => physicsData.onSetGravity(physicsData.gravity === 9.8 ? 1.6 : 9.8)}
                className="btn-3d flex-1 py-2 bg-purple-900 border-b-2 border-purple-950 text-white text-xs font-bold rounded-xl"
              >
                {formatMsg(t.games.physics.switchGravity, {
                  mode: physicsData.gravity === 9.8 ? t.games.physics.moonLabel : t.games.physics.earthLabel,
                })}
              </button>
              <button
                onClick={physicsData.onLaunch}
                className="btn-3d flex-1 py-2.5 bg-gradient-to-r from-pink-500 to-rose-600 border-b-4 border-rose-800 text-white font-extrabold text-sm rounded-xl shadow-lg"
              >
                {t.games.physics.launchBtn}
              </button>
            </div>
          </div>
        )}

        {/* 2. Design: Color Atelier */}
        {game.id === 'design' && designData && (
          <div className="space-y-3">
            <div className="flex flex-wrap justify-between items-center gap-2 text-xs font-bold text-pink-300">
              <span>{t.games.design.harmonyScore}: {designData.score}%</span>
              <span className="inline-flex items-center gap-1.5 text-amber-300">
                <span>Target:</span>
                <span
                  className="inline-block w-3.5 h-3.5 rounded-full border border-white/70"
                  style={{ backgroundColor: `hsl(${designData.targetBaseHue}, 85%, 60%)` }}
                />
                <span>
                  {designData.targetRule === 'complementary'
                    ? t.games.design.complementary
                    : designData.targetRule === 'analogous'
                    ? t.games.design.analogous
                    : t.games.design.triadic}
                </span>
              </span>
            </div>
            <div className="flex gap-2">
              {(['complementary', 'analogous', 'triadic'] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => designData.onSetRule(r)}
                  className={`btn-3d flex-1 py-1.5 rounded-xl text-xs font-bold capitalize ${
                    designData.rule === r ? 'bg-pink-600 text-white' : 'bg-purple-900 text-purple-300'
                  }`}
                >
                  {r === 'complementary'
                    ? t.games.design.complementary
                    : r === 'analogous'
                    ? t.games.design.analogous
                    : t.games.design.triadic}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] text-purple-200 font-semibold block mb-1">
                  {t.games.design.baseHue} ({designData.baseHue}°)
                </label>
                <input
                  type="range"
                  min="0"
                  max="360"
                  value={designData.baseHue}
                  onChange={(e) => designData.onSetBase(Number(e.target.value))}
                  className="w-full accent-pink-500 cursor-pointer"
                />
              </div>
              <div>
                <label className="text-[10px] text-purple-200 font-semibold block mb-1">
                  {t.games.design.accentHue} ({designData.accentHue}°)
                </label>
                <input
                  type="range"
                  min="0"
                  max="360"
                  value={designData.accentHue}
                  onChange={(e) => designData.onSetAccent(Number(e.target.value))}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
              </div>
            </div>
          </div>
        )}

        {/* 3. UI Design: Neon Interface */}
        {game.id === 'ui' && uiData && (
          <div className="space-y-2.5 text-center">
            <div className="text-xs font-bold text-cyan-300">
              {t.games.ui.instruction}
            </div>
            <div className="text-[11px] text-cyan-200/80 font-medium">
              {t.games.ui.toleranceHint}
            </div>
            <div className="space-y-1.5">
              {uiData.alignments.map((offset, i) => {
                const label = uiData.cardLabels?.[i] || `Card ${i + 1}`;
                const isDone = Math.abs(offset) <= 0.05;
                return (
                  <div
                    key={i}
                    className={`flex items-center justify-between gap-2 px-3 py-1.5 rounded-xl border ${
                      isDone
                        ? 'bg-emerald-950/60 border-emerald-400/70 text-emerald-200'
                        : 'bg-slate-900/70 border-cyan-500/40 text-cyan-100'
                    }`}
                  >
                    <button
                      onClick={() => uiData.onNudge(i, -0.2)}
                      disabled={isDone}
                      className="btn-3d px-2.5 py-1 rounded-lg bg-cyan-700 disabled:opacity-40 text-white text-xs font-extrabold"
                    >
                      ◀ -0.2
                    </button>
                    <div className="text-xs font-bold truncate flex-1">
                      {isDone ? formatMsg(t.games.ui.aligned, { label }) : `${label} (${offset > 0 ? '+' : ''}${offset.toFixed(2)})`}
                    </div>
                    <button
                      onClick={() => uiData.onNudge(i, 0.2)}
                      disabled={isDone}
                      className="btn-3d px-2.5 py-1 rounded-lg bg-cyan-700 disabled:opacity-40 text-white text-xs font-extrabold"
                    >
                      +0.2 ▶
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 4. UX Design: User Cafe */}
        {game.id === 'ux' && uxData && (
          <div className="space-y-2.5">
            <div className="flex justify-between items-center text-xs font-bold text-amber-300">
              <span>{t.games.ux.satisfaction}: {uxData.satisfaction}%</span>
              <span>{t.games.ux.persona}: {uxData.persona || 'Guest'}</span>
            </div>
            <div className="text-[11px] font-semibold text-amber-100/90">
              {t.games.ux.chooseFixes}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {uxData.options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => uxData.onToggleFix(i)}
                  className={`btn-3d px-3 py-2 rounded-xl text-xs font-bold text-left border transition-colors ${
                    opt.picked
                      ? opt.isGood
                        ? 'bg-emerald-700 border-emerald-400 text-white'
                        : 'bg-rose-800 border-rose-400 text-rose-100'
                      : 'bg-purple-900/90 border-purple-600 text-purple-100 hover:bg-purple-800'
                  }`}
                >
                  {opt.picked ? (opt.isGood ? '✓ ' : '✗ ') : '+ '}
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 5. Chemistry: Star Lab */}
        {game.id === 'chemistry' && chemData && (
          <div className="space-y-3 text-center">
            <div className="text-xs font-bold text-emerald-300">
              {t.games.chemistry.targetPrefix}: {chemData.targetMolecule || 'Molecule'} ({chemData.formula || 'H₂O'})
            </div>
            {chemData.overloadMessage && (
              <div className="text-xs font-extrabold text-rose-300 bg-rose-950/70 border border-rose-400/60 px-3 py-1 rounded-xl inline-block">
                ⚠️ {chemData.overloadMessage}
              </div>
            )}
            {chemData.requiredAtoms && (
              <div className="flex justify-center gap-2 text-xs text-purple-200 flex-wrap">
                <span>{t.games.chemistry.needLabel}</span>
                {Object.entries(chemData.requiredAtoms).map(([sym, count]) => {
                  const currentCount = chemData.atoms.filter((a) => a === sym).length;
                  const isDone = currentCount === count;
                  return (
                    <span
                      key={sym}
                      className={`px-2 py-0.5 rounded-md font-bold ${
                        isDone ? 'bg-emerald-800 text-emerald-200' : 'bg-purple-900 text-pink-300'
                      }`}
                    >
                      {sym}: {currentCount}/{count}
                    </span>
                  );
                })}
              </div>
            )}
            <div className="flex flex-wrap gap-2 justify-center items-center">
              <button
                onClick={() => chemData.onAddAtom('H')}
                className="btn-3d px-3.5 py-1.5 bg-slate-200 text-slate-900 border-b-4 border-slate-400 font-extrabold text-xs rounded-xl"
              >
                {formatMsg(t.games.chemistry.addAtom, { sym: 'H' })}
              </button>
              <button
                onClick={() => chemData.onAddAtom('O')}
                className="btn-3d px-3.5 py-1.5 bg-rose-500 text-white border-b-4 border-rose-800 font-extrabold text-xs rounded-xl"
              >
                {formatMsg(t.games.chemistry.addAtom, { sym: 'O' })}
              </button>
              <button
                onClick={() => chemData.onAddAtom('C')}
                className="btn-3d px-3.5 py-1.5 bg-slate-700 text-white border-b-4 border-slate-950 font-extrabold text-xs rounded-xl"
              >
                {formatMsg(t.games.chemistry.addAtom, { sym: 'C' })}
              </button>
              <button
                onClick={() => chemData.onAddAtom('N')}
                className="btn-3d px-3.5 py-1.5 bg-blue-500 text-white border-b-4 border-blue-800 font-extrabold text-xs rounded-xl"
              >
                {formatMsg(t.games.chemistry.addAtom, { sym: 'N' })}
              </button>
              <button
                onClick={chemData.onReset}
                className="btn-3d p-2 bg-purple-900 text-purple-300 border-b-2 border-purple-950 rounded-xl"
                title="Reset"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* 6. Code: Robo Maze (internal command strings remain 'Maju'/'Kiri'/'Kanan') */}
        {game.id === 'code' && codeData && (
          <div className="space-y-3">
            <div className="flex justify-between items-center text-xs font-bold text-blue-300">
              <span>{formatMsg(t.games.code.linesLabel, { count: codeData.commands.length })}</span>
              <span className="text-purple-300">{t.games.code.targetLabel}</span>
            </div>
            <div className="flex flex-wrap gap-1 min-h-[28px] bg-purple-900/40 p-1.5 rounded-xl border border-purple-800">
              {codeData.commands.length === 0 ? (
                <span className="text-[11px] text-purple-400 italic">{t.games.code.emptyPrompt}</span>
              ) : (
                codeData.commands.map((cmd, i) => (
                  <span key={i} className="px-2 py-0.5 rounded bg-blue-600 text-white text-[11px] font-mono">
                    {getLocalizedCodeCmd(cmd)}
                  </span>
                ))
              )}
            </div>
            <div className="flex gap-1.5">
              {(
                [
                  { raw: 'Maju', label: t.games.code.cmdForward },
                  { raw: 'Kiri', label: t.games.code.cmdLeft },
                  { raw: 'Kanan', label: t.games.code.cmdRight },
                ] as const
              ).map((item) => (
                <button
                  key={item.raw}
                  onClick={() => codeData.onAddCommand(item.raw)}
                  className="btn-3d flex-1 py-1.5 bg-blue-700 text-white text-xs font-bold rounded-lg border-b-2 border-blue-900"
                >
                  +{item.label}
                </button>
              ))}
              <button
                onClick={codeData.onClear}
                className="btn-3d px-2.5 py-1.5 bg-purple-900 text-purple-300 rounded-lg text-xs"
              >
                {t.games.code.clearBtn}
              </button>
              <button
                onClick={codeData.onExecute}
                className="btn-3d px-4 py-1.5 bg-emerald-500 border-b-2 border-emerald-700 text-white text-xs font-extrabold rounded-lg flex items-center gap-1"
              >
                <Play className="w-3.5 h-3.5 fill-current" /> {t.games.code.runBtn}
              </button>
            </div>
          </div>
        )}

        {/* 7. Biology: Cell Forest */}
        {game.id === 'biology' && bioData && (
          <div className="space-y-2.5 text-center">
            <div className="text-xs font-bold text-lime-300 flex justify-between items-center">
              <span>{t.games.biology.organelleLabel}: {bioData.organelle || 'Chloroplast'}</span>
              <span>{t.games.biology.photonsLabel}: {bioData.collected} / {bioData.targetCount}</span>
            </div>
            <div className="text-[11px] font-semibold text-amber-200">
              {t.games.biology.rosWarning}
            </div>
            <div className="flex flex-wrap gap-2 justify-center">
              {bioData.nodes.map((node, idx) => (
                <button
                  key={node.id}
                  onClick={() => bioData.onCollect(node.id)}
                  className={`btn-3d px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    node.kind === 'ros'
                      ? 'bg-rose-700 hover:bg-rose-600 text-rose-100 border-b-4 border-rose-950'
                      : node.collected
                      ? 'bg-lime-600 text-white border-b-4 border-lime-800'
                      : 'bg-yellow-400 hover:bg-yellow-300 text-slate-900 border-b-4 border-yellow-700'
                  }`}
                >
                  {node.kind === 'ros'
                    ? '☠️ ROS'
                    : node.collected
                    ? formatMsg(t.games.biology.photonCaught, { n: idx + 1 })
                    : formatMsg(t.games.biology.catchPhoton, { n: idx + 1 })}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
