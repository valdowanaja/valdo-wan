/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useGameStore } from '../state/useGameStore';
import { soundManager } from '../audio/SoundSynthesizer';
import { EmoteType } from '../types';
import { TRANSLATIONS } from '../data/i18n';
import { multiplayerClient } from '../network/MultiplayerClient';
import { Smile, Sparkles, MessageSquare } from 'lucide-react';

interface EmoteBaseItem {
  id: EmoteType;
  icon: string;
  key: string;
  command: string;
}

const EMOTE_LIST: EmoteBaseItem[] = [
  { id: 'cheer', icon: '👏', key: '1', command: '/cheer' },
  { id: 'dance', icon: '💃', key: '2', command: '/dance' },
  { id: 'wave', icon: '👋', key: '3', command: '/wave' },
  { id: 'bow', icon: '🙇', key: '4', command: '/bow' },
  { id: 'think', icon: '🤔', key: '5', command: '/think' },
];

export const EmoteBar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [showChatBox, setShowChatBox] = useState(false);
  const { activeEmote, triggerEmote, language } = useGameStore();
  const t = TRANSLATIONS[language];

  const handlePlayEmote = (e: EmoteType) => {
    soundManager.playCorrect();
    triggerEmote(e);
    multiplayerClient.emitEmote(e);
  };

  // Keyboard shortcut listener for 1-5 or slash
  useEffect(() => {
    const handleKeyDown = (ev: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((ev.target as HTMLElement)?.tagName)) return;

      if (ev.key === '1') handlePlayEmote('cheer');
      if (ev.key === '2') handlePlayEmote('dance');
      if (ev.key === '3') handlePlayEmote('wave');
      if (ev.key === '4') handlePlayEmote('bow');
      if (ev.key === '5') handlePlayEmote('think');
      if (ev.key === '/') {
        ev.preventDefault();
        setShowChatBox(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = chatInput.trim().toLowerCase();
    const matched = EMOTE_LIST.find(
      (em) =>
        em.command === cmd ||
        t.emote.labels[em.id].toLowerCase() === cmd ||
        em.id === cmd
    );
    if (matched) {
      handlePlayEmote(matched.id);
    }
    setChatInput('');
    setShowChatBox(false);
  };

  return (
    <>
      {/* Floating Overhead Emote Bubble over active emote */}
      {activeEmote && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-40 pointer-events-none animate-bounce">
          <div className="bg-purple-950/95 border-2 border-pink-400 px-4 py-2 rounded-2xl shadow-2xl flex items-center gap-2 backdrop-blur-md">
            <span className="text-2xl">
              {EMOTE_LIST.find((e) => e.id === activeEmote)?.icon}
            </span>
            <span className="font-display font-extrabold text-white text-sm">
              {t.emote.labels[activeEmote]}!
            </span>
            <Sparkles className="w-4 h-4 text-pink-400" />
          </div>
        </div>
      )}

      {/* Floating Emote Bar Drawer on Left Edge */}
      <div className="fixed bottom-24 left-6 z-30 pointer-events-auto flex flex-col items-start gap-2 select-none">
        {/* Toggle Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              soundManager.playClick();
              setIsOpen(!isOpen);
            }}
            className={`btn-3d px-3.5 py-2.5 rounded-2xl border flex items-center gap-2 text-xs font-extrabold shadow-lg transition-all ${
              isOpen
                ? 'bg-pink-600 border-white text-white shadow-pink-900/60'
                : 'bg-purple-950/80 border-purple-400/40 text-purple-200 hover:bg-purple-900'
            }`}
            title={t.emote.tooltip}
          >
            <Smile className="w-4 h-4 text-pink-400" />
            <span className="hidden sm:inline">{t.emote.btnLabel}</span>
          </button>

          {/* Slash Command Prompt Button */}
          <button
            onClick={() => {
              soundManager.playClick();
              setShowChatBox(!showChatBox);
            }}
            className="w-10 h-10 rounded-2xl bg-purple-950/80 border border-purple-400/40 flex items-center justify-center text-purple-200 hover:bg-purple-900 shadow-md"
            title={t.emote.cmdTooltip}
          >
            <MessageSquare className="w-4 h-4 text-cyan-300" />
          </button>
        </div>

        {/* Emote Buttons Palette */}
        {isOpen && (
          <div className="flex flex-col gap-1.5 p-2 bg-purple-950/90 border-2 border-pink-400/60 rounded-2xl shadow-2xl backdrop-blur-md animate-scale-up">
            {EMOTE_LIST.map((item) => (
              <button
                key={item.id}
                onClick={() => handlePlayEmote(item.id)}
                className="px-3 py-2 rounded-xl bg-purple-900/60 hover:bg-pink-600/80 border border-purple-700/50 hover:border-white text-white text-xs font-bold flex items-center justify-between gap-3 transition-colors active:scale-95"
              >
                <div className="flex items-center gap-2">
                  <span className="text-base">{item.icon}</span>
                  <span>{t.emote.labels[item.id]}</span>
                </div>
                <kbd className="px-1.5 py-0.5 rounded bg-black/40 text-[10px] text-pink-300 font-mono">
                  [{item.key}]
                </kbd>
              </button>
            ))}
          </div>
        )}

        {/* Command Input Box */}
        {showChatBox && (
          <form
            onSubmit={handleCommandSubmit}
            className="flex items-center gap-2 p-2 bg-purple-950/95 border-2 border-cyan-400 rounded-2xl shadow-2xl backdrop-blur-md animate-scale-up"
          >
            <input
              type="text"
              autoFocus
              placeholder={t.emote.cmdPlaceholder}
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-purple-900 text-white placeholder-purple-400 text-xs font-bold outline-none border border-purple-700 focus:border-cyan-400 w-52"
            />
            <button
              type="submit"
              className="btn-3d px-3 py-1.5 bg-cyan-500 border-b-2 border-cyan-700 text-white rounded-xl text-xs font-bold"
            >
              {t.common.send}
            </button>
          </form>
        )}
      </div>
    </>
  );
};
