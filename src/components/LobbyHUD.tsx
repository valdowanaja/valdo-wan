/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { useGameStore } from '../state/useGameStore';
import { GateTrigger } from '../scenes/LobbyScene';
import { soundManager } from '../audio/SoundSynthesizer';
import { GameInfo, NpcEntity } from '../types';
import { WORLD_REGIONS, WorldRegion } from '../data/constants';
import { LOCALIZED_GAMES, LOCALIZED_NPCS, LOCALIZED_REGIONS, TRANSLATIONS, formatMsg } from '../data/i18n';
import { multiplayerClient, MultiplayerSnapshot } from '../network/MultiplayerClient';
import { EmoteBar } from './EmoteBar';
import { MultiplayerPanel } from './MultiplayerPanel';
import {
  Trophy,
  Settings,
  Volume2,
  VolumeX,
  Home,
  Star,
  Eye,
  MessageSquare,
  MapPin,
  Compass,
  Navigation,
  Users,
  Zap,
  Copy,
  Check,
} from 'lucide-react';

interface LobbyHUDProps {
  nearestGate: GateTrigger | null;
  nearestGuardian: GameInfo | null;
  nearestWorldNpc: NpcEntity | null;
  currentRegion: WorldRegion;
  isSprinting?: boolean;
  onEnterGame: (gate: GateTrigger) => void;
  onInteractNpcOrGuardian: () => void;
  onFastTravel: (region: WorldRegion) => void;
  onOpenSettings: () => void;
  onOpenLeaderboard: () => void;
}

export const LobbyHUD: React.FC<LobbyHUDProps> = ({
  nearestGate,
  nearestGuardian,
  nearestWorldNpc,
  currentRegion,
  isSprinting = false,
  onEnterGame,
  onInteractNpcOrGuardian,
  onFastTravel,
  onOpenSettings,
  onOpenLeaderboard,
}) => {
  const { player, setScene, isMuted, toggleMute, cameraMode, toggleCameraMode, activeQuests, language } = useGameStore();
  const t = TRANSLATIONS[language];
  const [showWorldMap, setShowWorldMap] = useState(false);
  const [showMultiplayer, setShowMultiplayer] = useState(false);
  const [copiedId, setCopiedId] = useState(false);
  const [mpSnapshot, setMpSnapshot] = useState<MultiplayerSnapshot>(multiplayerClient.getSnapshot());

  useEffect(() => {
    return multiplayerClient.subscribe(setMpSnapshot);
  }, []);

  const totalStars = Object.values(player.gameProgress)
    .flat()
    .reduce((sum, item) => sum + item.stars, 0);

  // Keyboard shortcut V to toggle TPP / FPP, M for World Map
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;
      if (e.key === 'v' || e.key === 'V') {
        soundManager.playClick();
        toggleCameraMode();
      } else if (e.key === 'm' || e.key === 'M') {
        soundManager.playClick();
        setShowWorldMap((m) => !m);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleCameraMode]);

  const handleReturnTitle = () => {
    soundManager.playMenuTransition();
    setScene('title');
  };

  const locRegion = LOCALIZED_REGIONS[language][currentRegion.id];
  const mpCount = Math.min(mpSnapshot.maxPlayers, mpSnapshot.remotePlayers.length + (mpSnapshot.playerId ? 1 : 0));
  const currentLobbyId = mpSnapshot.roomId && mpSnapshot.roomId !== 'auto' ? mpSnapshot.roomId : 'VALWORLD-1';

  const handleQuickCopyLobbyId = async () => {
    try {
      await navigator.clipboard.writeText(currentLobbyId);
      soundManager.playPickup();
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 1800);
    } catch {}
  };

  const locGuardian = nearestGuardian ? LOCALIZED_GAMES[language][nearestGuardian.id] : null;
  const locGateGame = nearestGate ? LOCALIZED_GAMES[language][nearestGate.game.id] : null;
  const locWorldNpc = nearestWorldNpc ? LOCALIZED_NPCS[language][nearestWorldNpc.id] : null;

  return (
    <div className="fixed inset-0 z-20 pointer-events-none select-none flex flex-col justify-between p-3 md:p-6">
      {/* Top Header: Profile, Open World Region Banner, Multiplayer, Map, Audio, Settings */}
      <div className="flex items-center justify-between w-full pointer-events-auto gap-2">
        {/* Left: Player Profile & Stars & Camera Mode */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2.5 bg-purple-950/85 border border-purple-400/40 px-3 py-1.5 rounded-2xl backdrop-blur-md shadow-lg">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-pink-500 to-purple-600 flex items-center justify-center font-display font-extrabold text-white text-sm shadow-inner">
              {player.level}
            </div>
            <div>
              <div className="font-display font-bold text-xs md:text-sm text-white truncate max-w-[100px] md:max-w-[140px]">
                {player.playerName}
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-pink-300 font-semibold">
                <span className="tabular-nums">{player.totalXp} XP</span>
                {isSprinting && (
                  <span className="px-1.5 py-0.2 bg-amber-400 text-slate-950 rounded-md text-[9px] font-black flex items-center gap-0.5">
                    <Zap className="w-2.5 h-2.5 fill-current" />
                    {t.lobby.sprintActive}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 bg-purple-950/85 border border-amber-400/40 px-2.5 py-2 rounded-2xl backdrop-blur-md shadow-lg text-amber-300 font-display font-bold text-xs md:text-sm">
            <Star className="w-4 h-4 fill-amber-300 text-amber-300" />
            <span className="tabular-nums">{totalStars}</span>
          </div>

          <button
            onClick={() => {
              soundManager.playClick();
              toggleCameraMode();
            }}
            className={`px-3 py-2 rounded-2xl border text-xs font-extrabold flex items-center gap-1.5 backdrop-blur-md shadow-md transition-all ${
              cameraMode === 'tpp'
                ? 'bg-pink-600 border-white text-white shadow-pink-900/50'
                : 'bg-purple-900 border-cyan-400 text-cyan-200'
            }`}
            title={t.settings.cameraLabel}
          >
            <Eye className="w-4 h-4" />
            <span>{cameraMode === 'tpp' ? 'TPP' : 'FPP'}</span>
          </button>
        </div>

        {/* Center: Open World Region Pill Banner */}
        <div className="hidden lg:flex items-center gap-2 bg-slate-950/85 border-2 border-amber-400/50 px-4 py-1.5 rounded-2xl backdrop-blur-md shadow-xl text-center">
          <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
          <div className="text-left">
            <div className="font-display font-extrabold text-xs md:text-sm text-amber-300">
              {locRegion?.name || currentRegion.name}
            </div>
            <div className="text-[10px] text-slate-300 font-medium">
              {locRegion?.theme || currentRegion.theme}
            </div>
          </div>
        </div>

        {/* Right Tools: Multiplayer (6 max), World Map, Audio, Leaderboard, Settings, Home */}
        <div className="flex items-center gap-1.5 md:gap-2">
          {/* Quick Shareable ID LOBBY Copy Pill */}
          <button
            onClick={handleQuickCopyLobbyId}
            className="hidden sm:flex px-2.5 py-2 rounded-xl border border-cyan-400/50 bg-slate-950/85 hover:bg-cyan-950/80 text-cyan-200 font-mono font-extrabold text-[11px] items-center gap-1.5 backdrop-blur-md shadow-md transition-all"
            title={t.multiplayer.copyLobbyId}
          >
            <span className="text-cyan-400/80 font-sans text-[10px]">{t.multiplayer.lobbyIdLabel}:</span>
            <span className="text-white tracking-wider">{currentLobbyId}</span>
            {copiedId ? (
              <Check className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <Copy className="w-3.5 h-3.5 text-cyan-300" />
            )}
          </button>

          {/* Multiplayer Room Button */}
          <button
            onClick={() => {
              soundManager.playClick();
              setShowMultiplayer((v) => !v);
            }}
            className={`px-2.5 md:px-3 py-2 rounded-xl border font-display font-bold text-xs flex items-center gap-1.5 backdrop-blur-md shadow-md transition-all ${
              showMultiplayer
                ? 'bg-cyan-600 border-white text-white'
                : 'bg-cyan-950/80 hover:bg-cyan-900/80 border-cyan-400/60 text-cyan-200'
            }`}
            title={t.multiplayer.title}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                mpSnapshot.status === 'connected'
                  ? 'bg-emerald-400'
                  : mpSnapshot.status === 'connecting'
                  ? 'bg-amber-400 animate-pulse'
                  : 'bg-rose-500'
              }`}
            />
            <Users className="w-4 h-4" />
            <span className="tabular-nums">{mpCount}/6</span>
          </button>

          {/* Fast Travel World Map Button */}
          <button
            onClick={() => {
              soundManager.playClick();
              setShowWorldMap(!showWorldMap);
            }}
            className="px-2.5 md:px-3 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/60 text-amber-300 font-display font-bold text-xs flex items-center gap-1.5 backdrop-blur-md shadow-md"
            title={t.lobby.worldMapBtn}
          >
            <Compass className="w-4 h-4 text-amber-400 animate-spin-slow" />
            <span className="hidden md:inline">{t.lobby.worldMapBtn}</span>
            <span className="text-[10px] opacity-70">[M]</span>
          </button>

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

          <button
            onClick={() => {
              soundManager.playMenuTransition();
              onOpenLeaderboard();
            }}
            className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-purple-950/80 border border-purple-400/30 flex items-center justify-center text-white hover:bg-purple-900 shadow-md"
            title={t.common.achievements}
          >
            <Trophy className="w-4 h-4 text-yellow-300" />
          </button>

          <button
            onClick={() => {
              soundManager.playMenuTransition();
              onOpenSettings();
            }}
            className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-purple-950/80 border border-purple-400/30 flex items-center justify-center text-white hover:bg-purple-900 shadow-md"
            title={t.common.settings}
          >
            <Settings className="w-4 h-4 text-purple-200" />
          </button>

          <button
            onClick={handleReturnTitle}
            className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-purple-950/80 border border-purple-400/30 flex items-center justify-center text-white hover:bg-purple-900 shadow-md"
            title={t.common.mainMenu}
          >
            <Home className="w-4 h-4 text-pink-300" />
          </button>
        </div>
      </div>

      {/* Multiplayer Drawer */}
      {showMultiplayer && (
        <MultiplayerPanel snapshot={mpSnapshot} onClose={() => setShowMultiplayer(false)} />
      )}

      {/* Quest Tracker Banner */}
      {activeQuests && activeQuests.length > 0 && (
        <div className="flex flex-col gap-1.5 pointer-events-auto max-w-[280px] md:max-w-[320px] self-start animate-fade-in">
          {activeQuests.map((q) => {
            const locNpcQuest = LOCALIZED_NPCS[language][q.npcId];
            const displayTitle = locNpcQuest?.questTitle || q.title;
            const displayDesc = locNpcQuest?.questDesc || q.description;
            const rewardLabel = locNpcQuest?.rewardBadge || q.rewardBadge;
            return (
              <div
                key={q.id}
                className={`p-2.5 rounded-2xl border backdrop-blur-md shadow-xl transition-all ${
                  q.isCompleted
                    ? 'bg-emerald-950/90 border-emerald-400/80 text-emerald-100'
                    : 'bg-[#0f0924]/90 border-purple-500/60 text-purple-200'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-display font-extrabold mb-0.5">
                  <span className="truncate pr-1 text-white">{displayTitle}</span>
                  <span
                    className={`tabular-nums font-mono text-[11px] px-1.5 py-0.5 rounded ${
                      q.isCompleted ? 'bg-emerald-600 text-white' : 'bg-purple-800 text-purple-200'
                    }`}
                  >
                    {q.isCompleted ? t.lobby.questCompleted : `${q.currentCount} / ${q.targetCount}`}
                  </span>
                </div>
                <div className="text-[11px] text-slate-300 leading-tight">
                  {q.isCompleted ? formatMsg(t.lobby.questDoneMsg, { badge: rewardLabel }) : displayDesc}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Emote Floating System */}
      <EmoteBar />

      {/* Interactive World Map / Fast Travel Modal */}
      {showWorldMap && (
        <div className="fixed inset-0 z-40 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 pointer-events-auto">
          <div className="bg-[#0f172a] border-2 border-amber-400/70 rounded-3xl p-6 max-w-2xl w-full shadow-2xl animate-scale-up">
            <div className="flex items-center justify-between pb-4 border-b border-slate-700">
              <div className="flex items-center gap-2">
                <Compass className="w-6 h-6 text-amber-400" />
                <div>
                  <div className="font-display font-extrabold text-lg text-white">
                    {t.lobby.worldMapTitle}
                  </div>
                  <div className="text-xs text-amber-300/80 font-medium">
                    {t.lobby.worldMapSubtitle}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setShowWorldMap(false)}
                className="text-slate-400 hover:text-white font-bold text-sm bg-slate-800 px-3 py-1 rounded-xl"
              >
                {t.common.close}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 my-4 max-h-[60vh] overflow-y-auto p-1">
              {WORLD_REGIONS.map((reg) => {
                const isCurrent = currentRegion.id === reg.id;
                const lr = LOCALIZED_REGIONS[language][reg.id];
                return (
                  <button
                    key={reg.id}
                    onClick={() => {
                      onFastTravel(reg);
                      setShowWorldMap(false);
                    }}
                    className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between transition-all transform hover:scale-[1.02] ${
                      isCurrent
                        ? 'bg-amber-500/20 border-amber-400 text-white shadow-lg'
                        : 'bg-slate-800/80 hover:bg-slate-700/80 border-slate-700 text-slate-200'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-display font-bold text-sm text-amber-300">
                          {lr?.name || reg.name}
                        </span>
                        {isCurrent && (
                          <span className="text-[10px] bg-amber-400 text-slate-900 font-extrabold px-1.5 py-0.5 rounded-full">
                            {t.lobby.youAreHere}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-300/90 leading-tight">
                        {lr?.theme || reg.theme}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 text-[11px] text-amber-400 font-bold mt-2">
                      <Navigation className="w-3 h-3" />
                      <span>{t.lobby.teleportHere}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Near Gate Interaction Card */}
      {nearestGate && !nearestGuardian && !nearestWorldNpc && (
        <div className="mx-auto max-w-lg w-full bg-purple-950/95 border-2 border-pink-400 rounded-3xl p-4 shadow-2xl backdrop-blur-md pointer-events-auto flex items-center justify-between gap-4 animate-scale-up">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-900 border border-pink-400 flex items-center justify-center text-2xl shadow-inner">
              {nearestGate.game.guardian.avatar}
            </div>
            <div>
              <div className="text-[11px] text-pink-300 font-bold">
                {formatMsg(t.lobby.gateSubtitle, { subject: locGateGame?.subject || nearestGate.game.subject })}
              </div>
              <div className="font-display font-extrabold text-base md:text-lg text-white">
                {locGateGame?.title || nearestGate.game.title}
              </div>
            </div>
          </div>
          <button
            onClick={() => onEnterGame(nearestGate)}
            className="btn-3d px-5 py-2.5 bg-gradient-to-r from-pink-500 to-rose-600 border-b-4 border-rose-800 text-white font-extrabold text-xs md:text-sm rounded-xl shadow-lg"
          >
            {t.lobby.enterGateBtn}
          </button>
        </div>
      )}

      {/* Near World NPC or Guardian Genshin Interaction Prompt */}
      {(nearestGuardian || nearestWorldNpc) && (
        <div className="mx-auto max-w-lg w-full bg-[#0d1322]/95 border-2 border-amber-400 rounded-3xl p-4 shadow-2xl backdrop-blur-md pointer-events-auto flex items-center justify-between gap-4 animate-scale-up">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-800 border-2 border-amber-400 flex items-center justify-center text-2xl shadow-inner">
              {nearestGuardian ? nearestGuardian.guardian.avatar : nearestWorldNpc?.avatar}
            </div>
            <div>
              <div className="text-[11px] text-amber-300 font-bold flex items-center gap-1">
                <span>◆</span>
                <span>
                  {nearestGuardian
                    ? locGuardian?.guardianTitle || nearestGuardian.guardian.title
                    : locWorldNpc?.title || nearestWorldNpc?.title}
                </span>
              </div>
              <div className="font-display font-extrabold text-base md:text-lg text-white">
                {nearestGuardian ? nearestGuardian.guardian.name : nearestWorldNpc?.name}
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              soundManager.playInteract();
              onInteractNpcOrGuardian();
            }}
            className="btn-3d px-5 py-2.5 bg-gradient-to-r from-amber-500 to-rose-600 border-b-4 border-amber-800 text-white font-extrabold text-xs md:text-sm rounded-xl shadow-lg flex items-center gap-1.5 animate-pulse"
          >
            <MessageSquare className="w-4 h-4 fill-current" />
            <span>{t.lobby.talkBtn}</span>
          </button>
        </div>
      )}

      {/* Floating Bottom Navigation Hints */}
      <div className="text-center text-xs font-semibold text-purple-300/85 pointer-events-none drop-shadow">
        {t.lobby.navHints}
      </div>
    </div>
  );
};
