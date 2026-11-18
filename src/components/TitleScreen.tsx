/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useGameStore } from '../state/useGameStore';
import { soundManager } from '../audio/SoundSynthesizer';
import { multiplayerClient, normalizeLobbyId } from '../network/MultiplayerClient';
import { TRANSLATIONS, formatMsg } from '../data/i18n';
import { Sparkles, User, Play, Settings, Trophy, Volume2, VolumeX, DoorOpen, PlusCircle, Hash } from 'lucide-react';

interface TitleScreenProps {
  onOpenSettings: () => void;
  onOpenLeaderboard: () => void;
}

export const TitleScreen: React.FC<TitleScreenProps> = ({ onOpenSettings, onOpenLeaderboard }) => {
  const { player, setScene, isMuted, toggleMute, language } = useGameStore();
  const t = TRANSLATIONS[language];

  const invitedLobbyId = multiplayerClient.getInitialInvitedLobbyId();
  const [lobbyCodeInput, setLobbyCodeInput] = useState(invitedLobbyId || '');

  const handleStartGame = () => {
    soundManager.init();
    soundManager.playClick();
    soundManager.startBGM('lobby');
    const clean = normalizeLobbyId(lobbyCodeInput);
    if (clean) {
      multiplayerClient.setPreferredLobbyId(clean);
    }
    setScene('lobby');
  };

  const handleCreateShareableRoom = () => {
    soundManager.init();
    soundManager.playClick();
    soundManager.startBGM('lobby');
    multiplayerClient.queueCreateShareableRoom();
    setScene('lobby');
  };

  const handleJoinByLobbyId = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = normalizeLobbyId(lobbyCodeInput);
    if (!clean) return;
    soundManager.init();
    soundManager.playClick();
    soundManager.startBGM('lobby');
    multiplayerClient.setPreferredLobbyId(clean);
    setScene('lobby');
  };

  const handleOpenCustomizer = () => {
    soundManager.init();
    soundManager.playClick();
    soundManager.startBGM('customizer');
    setScene('customizer');
  };

  return (
    <div className="fixed inset-0 z-20 flex flex-col justify-between p-6 md:p-10 pointer-events-none">
      {/* Top Bar: Player profile & Audio/Settings toggles */}
      <div className="flex items-center justify-between w-full pointer-events-auto">
        {/* Player Profile Badge */}
        <div className="flex items-center gap-3 bg-purple-950/70 border border-purple-400/30 px-4 py-2 rounded-2xl backdrop-blur-md shadow-lg">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-pink-500 to-purple-600 flex items-center justify-center font-bold text-white shadow-inner">
            {player.level}
          </div>
          <div>
            <div className="font-display font-bold text-sm text-white tracking-wide">
              {player.playerName}
            </div>
            <div className="flex items-center gap-2 text-xs text-pink-300 font-semibold">
              <span>{t.common.level} {player.level}</span>
              <span>·</span>
              <span className="tabular-nums">{player.totalXp} XP</span>
            </div>
          </div>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              soundManager.init();
              toggleMute();
            }}
            className="w-11 h-11 rounded-xl bg-purple-950/70 border border-purple-400/30 flex items-center justify-center text-white hover:bg-purple-900/80 transition-colors shadow-md"
            title={t.common.muteAudio}
          >
            {isMuted ? <VolumeX className="w-5 h-5 text-rose-400" /> : <Volume2 className="w-5 h-5 text-pink-300" />}
          </button>
          <button
            onClick={onOpenLeaderboard}
            className="w-11 h-11 rounded-xl bg-purple-950/70 border border-purple-400/30 flex items-center justify-center text-white hover:bg-purple-900/80 transition-colors shadow-md"
            title={t.common.achievements}
          >
            <Trophy className="w-5 h-5 text-yellow-300" />
          </button>
          <button
            onClick={onOpenSettings}
            className="w-11 h-11 rounded-xl bg-purple-950/70 border border-purple-400/30 flex items-center justify-center text-white hover:bg-purple-900/80 transition-colors shadow-md"
            title={t.common.settings}
          >
            <Settings className="w-5 h-5 text-purple-200" />
          </button>
        </div>
      </div>

      {/* Center Title Lockup */}
      <div className="text-center my-auto flex flex-col items-center pointer-events-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-500/20 border border-pink-400/40 text-pink-300 text-xs md:text-sm font-bold tracking-wider uppercase mb-3">
          <Sparkles className="w-4 h-4 text-pink-400" />
          {t.title.badge}
        </div>

        <h1 className="font-display font-extrabold text-5xl md:text-8xl tracking-tight text-white drop-shadow-[0_6px_0_#be185d]">
          Val<span className="text-pink-400 drop-shadow-[0_6px_0_#9d174d]">world3D</span>
        </h1>

        <p className="mt-3 text-base md:text-xl font-bold text-purple-100 max-w-xl mx-auto drop-shadow-md">
          {t.title.subtitle}
        </p>

        {/* Invited Lobby Pill (when opened via ?lobby=XXXX) */}
        {invitedLobbyId && (
          <div className="mt-3 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/25 border border-cyan-400/70 text-cyan-200 text-xs font-extrabold shadow-lg">
            <Hash className="w-3.5 h-3.5 text-cyan-300" />
            <span>{formatMsg(t.title.invitedToLobby, { id: invitedLobbyId })}</span>
          </div>
        )}

        {/* Primary CTA Buttons */}
        <div className="mt-6 flex flex-col sm:flex-row items-center gap-4">
          <button
            onClick={handleStartGame}
            className="btn-3d px-8 py-4 bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 border-b-4 border-rose-800 text-white text-xl font-extrabold shadow-2xl shadow-pink-900/60 hover:brightness-110 active:translate-y-1"
          >
            <Play className="w-6 h-6 mr-2 fill-current" />
            {t.title.startAdventure}
          </button>

          <button
            onClick={handleOpenCustomizer}
            className="btn-3d px-6 py-4 bg-purple-800/80 hover:bg-purple-700/80 border-b-4 border-purple-950 text-white text-lg font-bold shadow-xl border border-purple-400/30"
          >
            <User className="w-5 h-5 mr-2 text-pink-300" />
            {t.title.customizeCharacter}
          </button>
        </div>

        {/* Shareable ID LOBBY Join / Create Bar */}
        <div className="mt-5 w-full max-w-xl bg-purple-950/80 border border-cyan-400/40 rounded-2xl p-3 backdrop-blur-md shadow-xl">
          <form onSubmit={handleJoinByLobbyId} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <div className="relative flex-1">
              <Hash className="w-4 h-4 text-cyan-300 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={lobbyCodeInput}
                onChange={(e) => setLobbyCodeInput(e.target.value.toUpperCase())}
                placeholder={t.title.lobbyIdPlaceholder}
                maxLength={20}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-950/70 border border-purple-600/60 focus:border-cyan-400 outline-none text-xs md:text-sm font-mono font-bold text-white placeholder-purple-300/60 tracking-wider uppercase"
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                type="submit"
                disabled={!normalizeLobbyId(lobbyCodeInput)}
                className="btn-3d flex-1 sm:flex-initial px-4 py-2.5 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-45 border-b-4 border-cyan-800 text-slate-950 rounded-xl text-xs md:text-sm font-extrabold flex items-center justify-center gap-1.5"
              >
                <DoorOpen className="w-4 h-4" />
                <span>{t.title.joinLobbyBtn}</span>
              </button>

              <button
                type="button"
                onClick={handleCreateShareableRoom}
                className="btn-3d flex-1 sm:flex-initial px-4 py-2.5 bg-amber-400 hover:bg-amber-300 border-b-4 border-amber-700 text-slate-950 rounded-xl text-xs md:text-sm font-extrabold flex items-center justify-center gap-1.5"
              >
                <PlusCircle className="w-4 h-4" />
                <span>{t.title.createLobbyBtn}</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Footer Info */}
      <div className="flex flex-col md:flex-row items-center justify-between text-xs text-purple-300/70 font-semibold">
        <div>{t.title.footerLeft}</div>
        <div className="flex gap-4 mt-2 md:mt-0">
          <span>{t.title.miniGamesCount}</span>
          <span>·</span>
          <span>{t.title.animeCharsCount}</span>
          <span>·</span>
          <span>{t.title.proceduralLabel}</span>
        </div>
      </div>
    </div>
  );
};
