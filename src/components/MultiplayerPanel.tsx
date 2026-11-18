/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { multiplayerClient, MultiplayerSnapshot, normalizeLobbyId } from '../network/MultiplayerClient';
import { useGameStore } from '../state/useGameStore';
import { TRANSLATIONS, formatMsg } from '../data/i18n';
import { soundManager } from '../audio/SoundSynthesizer';
import { Users, Send, DoorOpen, X, Wifi, WifiOff, Copy, Check, Link2, PlusCircle, Crown, Server } from 'lucide-react';

interface MultiplayerPanelProps {
  snapshot: MultiplayerSnapshot;
  onClose: () => void;
}

export const MultiplayerPanel: React.FC<MultiplayerPanelProps> = ({ snapshot, onClose }) => {
  const { language, player } = useGameStore();
  const t = TRANSLATIONS[language];

  const [roomInput, setRoomInput] = useState('');
  const [chatInput, setChatInput] = useState('');
  const [copiedType, setCopiedType] = useState<'id' | 'link' | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [snapshot.chatMessages.length]);

  const totalPlayersInRoom = Math.min(snapshot.maxPlayers, snapshot.remotePlayers.length + (snapshot.playerId ? 1 : 0));

  const parsedError = snapshot.lastError?.startsWith('ROOM_FULL:')
    ? formatMsg(t.multiplayer.roomFullError, { roomId: snapshot.lastError.split(':')[1] || '' })
    : snapshot.lastError;

  const copyText = async (value: string, kind: 'id' | 'link') => {
    try {
      await navigator.clipboard.writeText(value);
      soundManager.playPickup();
      setCopiedType(kind);
      setTimeout(() => setCopiedType((cur) => (cur === kind ? null : cur)), 2000);
    } catch {
      // Fallback for restricted clipboard environments
      const textarea = document.createElement('textarea');
      textarea.value = value;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand('copy');
        soundManager.playPickup();
        setCopiedType(kind);
        setTimeout(() => setCopiedType((cur) => (cur === kind ? null : cur)), 2000);
      } catch {}
      document.body.removeChild(textarea);
    }
  };

  const handleJoinRoom = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = normalizeLobbyId(roomInput);
    if (!clean) return;
    soundManager.playClick();
    multiplayerClient.switchRoom(clean);
    setRoomInput('');
  };

  const handleCreateNewRoom = () => {
    soundManager.playClick();
    multiplayerClient.createShareableRoom();
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    soundManager.playClick();
    multiplayerClient.emitChat(chatInput);
    setChatInput('');
  };

  const displayRoomId = snapshot.roomId && snapshot.roomId !== 'auto' ? snapshot.roomId : 'VALWORLD-1';
  const isLocalHost = Boolean(snapshot.playerId && snapshot.hostId === snapshot.playerId);

  return (
    <div className="fixed top-16 right-3 md:right-6 z-40 w-[340px] sm:w-[390px] bg-[#0f0a24]/95 border-2 border-cyan-400/70 rounded-3xl p-4 shadow-2xl backdrop-blur-xl pointer-events-auto animate-scale-up flex flex-col gap-3 max-h-[82vh] overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-purple-800/70 pb-2.5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-400/50 flex items-center justify-center">
            <Users className="w-4 h-4 text-cyan-300" />
          </div>
          <div>
            <div className="font-display font-extrabold text-sm text-white flex items-center gap-2">
              <span>{t.multiplayer.title}</span>
              <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-200 text-[10px] font-bold">
                {formatMsg(t.multiplayer.playersCount, { count: totalPlayersInRoom })}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] font-semibold">
              {snapshot.status === 'connected' ? (
                <>
                  <Wifi className="w-3 h-3 text-emerald-400" />
                  <span className="text-emerald-300">{t.multiplayer.connected}</span>
                </>
              ) : snapshot.status === 'connecting' ? (
                <span className="text-amber-300">{t.multiplayer.connecting}</span>
              ) : (
                <>
                  <WifiOff className="w-3 h-3 text-rose-400" />
                  <span className="text-rose-300">{t.multiplayer.disconnected}</span>
                </>
              )}
              {snapshot.hostName && (
                <>
                  <span className="text-purple-400">·</span>
                  <span className="text-amber-300 flex items-center gap-0.5">
                    <Crown className="w-3 h-3" />
                    {snapshot.hostName}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
        <button
          onClick={() => {
            soundManager.playClick();
            onClose();
          }}
          className="w-7 h-7 rounded-lg bg-purple-900/70 hover:bg-purple-800 flex items-center justify-center text-purple-200"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Room Full / Error Alert */}
      {parsedError && (
        <div className="px-3 py-2 rounded-xl bg-rose-950/90 border border-rose-500 text-rose-200 text-xs font-bold">
          {parsedError}
        </div>
      )}

      {/* Shareable ID LOBBY Card */}
      <div className="bg-gradient-to-br from-cyan-950/80 via-purple-950/90 to-slate-950/90 border border-cyan-400/50 rounded-2xl p-3 space-y-2 shadow-inner">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[10px] uppercase tracking-wider text-cyan-300 font-bold">
              {t.multiplayer.lobbyIdLabel}
            </div>
            <div className="font-mono font-extrabold text-lg text-white tracking-widest select-text">
              {displayRoomId}
            </div>
          </div>

          {isLocalHost && (
            <span className="px-2 py-1 rounded-lg bg-amber-400/20 border border-amber-400/60 text-amber-300 text-[10px] font-extrabold flex items-center gap-1">
              <Crown className="w-3 h-3" />
              {t.multiplayer.youAreHost}
            </span>
          )}
        </div>

        <p className="text-[11px] text-slate-300 leading-snug">
          {t.multiplayer.shareHint}
        </p>

        {/* Share & Create Actions */}
        <div className="grid grid-cols-3 gap-1.5 pt-0.5">
          <button
            type="button"
            onClick={() => copyText(displayRoomId, 'id')}
            className="btn-3d px-2 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 border-b-2 border-cyan-800 text-slate-950 text-[11px] font-extrabold flex items-center justify-center gap-1"
          >
            {copiedType === 'id' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span className="truncate">{copiedType === 'id' ? t.multiplayer.copiedLobbyId : t.multiplayer.copyLobbyId}</span>
          </button>

          <button
            type="button"
            onClick={() => copyText(multiplayerClient.getInviteUrl(displayRoomId), 'link')}
            className="btn-3d px-2 py-1.5 rounded-xl bg-pink-500 hover:bg-pink-400 border-b-2 border-rose-800 text-white text-[11px] font-extrabold flex items-center justify-center gap-1"
          >
            {copiedType === 'link' ? <Check className="w-3.5 h-3.5" /> : <Link2 className="w-3.5 h-3.5" />}
            <span className="truncate">{copiedType === 'link' ? t.multiplayer.copiedInviteLink : t.multiplayer.copyInviteLink}</span>
          </button>

          <button
            type="button"
            onClick={handleCreateNewRoom}
            className="btn-3d px-2 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 border-b-2 border-amber-700 text-slate-950 text-[11px] font-extrabold flex items-center justify-center gap-1"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span className="truncate">{t.multiplayer.createRoomBtn}</span>
          </button>
        </div>
      </div>

      {/* Join by Owner's ID LOBBY */}
      <form onSubmit={handleJoinRoom} className="flex items-center gap-1.5">
        <div className="relative flex-1">
          <DoorOpen className="w-3.5 h-3.5 text-cyan-300 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={roomInput}
            onChange={(e) => setRoomInput(e.target.value.toUpperCase())}
            placeholder={t.multiplayer.joinRoomPlaceholder}
            maxLength={20}
            className="w-full pl-8 pr-2.5 py-1.5 rounded-xl bg-purple-900/70 border border-purple-700 focus:border-cyan-400 outline-none text-xs font-mono text-white placeholder-purple-400 font-bold uppercase"
          />
        </div>
        <button
          type="submit"
          className="btn-3d px-3 py-1.5 bg-cyan-500 border-b-2 border-cyan-700 text-slate-950 rounded-xl text-xs font-extrabold shrink-0"
        >
          {t.multiplayer.joinBtn}
        </button>
      </form>

      {/* Active Servers / Lobbies Directory */}
      {snapshot.rooms && snapshot.rooms.length > 0 && (
        <div className="bg-purple-950/70 border border-purple-800/60 rounded-2xl p-2.5">
          <div className="text-[10px] text-cyan-300 font-bold mb-1.5 flex items-center gap-1">
            <Server className="w-3 h-3" />
            <span>{t.multiplayer.activeServers}</span>
          </div>
          <div className="flex flex-col gap-1 max-h-[86px] overflow-y-auto">
            {snapshot.rooms.map((rm) => {
              const isCurrent = rm.roomId === displayRoomId;
              const isFull = rm.playerCount >= rm.maxPlayers;
              return (
                <button
                  key={rm.roomId}
                  type="button"
                  disabled={isCurrent || isFull}
                  onClick={() => {
                    soundManager.playClick();
                    multiplayerClient.switchRoom(rm.roomId);
                  }}
                  className={`flex items-center justify-between px-2.5 py-1.5 rounded-xl text-[11px] font-bold transition-all ${
                    isCurrent
                      ? 'bg-cyan-500/25 border border-cyan-400/70 text-cyan-100'
                      : 'bg-purple-900/50 hover:bg-purple-800/70 border border-purple-700/50 text-purple-100 disabled:opacity-50'
                  }`}
                >
                  <div className="flex items-center gap-1.5 truncate">
                    <span className="font-mono text-white">{rm.roomId}</span>
                    {rm.hostName && (
                      <span className="text-[10px] text-amber-300 truncate">· 👑 {rm.hostName}</span>
                    )}
                  </div>
                  <span className={`font-mono text-[10px] shrink-0 ${isFull ? 'text-rose-400' : 'text-cyan-300'}`}>
                    {rm.playerCount}/{rm.maxPlayers}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Active Players in Room (Max 6) */}
      <div className="bg-purple-950/80 border border-purple-800/60 rounded-2xl p-2.5">
        <div className="text-[10px] text-purple-300 font-bold mb-1.5">
          {t.multiplayer.maxPlayersNote}
        </div>
        <div className="flex flex-wrap gap-1.5">
          {/* Local Player */}
          <span className="px-2.5 py-1 rounded-xl bg-cyan-600/30 border border-cyan-400/60 text-cyan-100 text-[11px] font-bold inline-flex items-center gap-1">
            {isLocalHost && <Crown className="w-3 h-3 text-amber-300" />}
            <span>★ {player.playerName} ({t.common.you})</span>
          </span>
          {/* Remote Players */}
          {snapshot.remotePlayers.map((rp) => {
            const isRpHost = snapshot.hostId === rp.id;
            return (
              <span
                key={rp.id}
                className="px-2.5 py-1 rounded-xl bg-amber-500/20 border border-amber-400/50 text-amber-200 text-[11px] font-bold inline-flex items-center gap-1"
              >
                {isRpHost && <Crown className="w-3 h-3 text-amber-300" />}
                <span>{rp.playerName}</span>
              </span>
            );
          })}
        </div>
      </div>

      {/* Real-time Room Chat */}
      <div className="flex-1 min-h-[100px] max-h-[150px] overflow-y-auto bg-black/40 border border-purple-800/50 rounded-2xl p-2.5 space-y-1.5">
        {snapshot.chatMessages.length === 0 ? (
          <div className="text-[11px] text-purple-400 italic text-center py-4">
            {t.multiplayer.noMessages}
          </div>
        ) : (
          snapshot.chatMessages.map((m) => (
            <div key={m.id} className="text-xs leading-snug break-words">
              <span className={`font-bold mr-1.5 ${m.senderId === snapshot.playerId ? 'text-cyan-300' : 'text-amber-300'}`}>
                {m.senderName}:
              </span>
              <span className="text-slate-100">{m.text}</span>
            </div>
          ))
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Chat Input */}
      <form onSubmit={handleSendChat} className="flex items-center gap-1.5">
        <input
          type="text"
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          placeholder={t.multiplayer.chatPlaceholder}
          maxLength={140}
          className="flex-1 px-3 py-1.5 rounded-xl bg-purple-900/70 border border-purple-700 focus:border-pink-400 outline-none text-xs text-white placeholder-purple-400 font-semibold"
        />
        <button
          type="submit"
          className="btn-3d p-2 bg-pink-500 border-b-2 border-rose-700 text-white rounded-xl"
          title={t.common.send}
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
};
