import React, { useState, useEffect, useRef } from 'react';
import { GameInfo, DialogueOption } from '../types';
import { soundManager } from '../audio/SoundSynthesizer';
import { speechSynthesizer, VoicePersona } from '../audio/SpeechSynthesizer';
import { useGameStore } from '../state/useGameStore';
import { LOCALIZED_GAMES, TRANSLATIONS, formatMsg } from '../data/i18n';
import { Sparkles, Play, ChevronRight, MessageSquare } from 'lucide-react';

interface GenshinDialogueOverlayProps {
  target: {
    name: string;
    title: string;
    avatar: string;
    region?: string;
    outfitColor?: string;
    accessoryColor?: string;
    initialDialogue: string;
    options: DialogueOption[];
    game?: GameInfo;
  };
  onStartGame?: (game: GameInfo) => void;
  onClose: () => void;
}

export const GenshinDialogueOverlay: React.FC<GenshinDialogueOverlayProps> = ({
  target,
  onStartGame,
  onClose,
}) => {
  const { language } = useGameStore();
  const t = TRANSLATIONS[language];

  const [currentText, setCurrentText] = useState(target.initialDialogue);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const textIndexRef = useRef(0);

  useEffect(() => {
    setCurrentText(target.initialDialogue);
  }, [target]);

  const getPersona = (): VoicePersona => {
    const n = (target.name + ' ' + target.title).toLowerCase();
    if (n.includes('zephyr') || n.includes('penyihir') || n.includes('archmage') || target.avatar === '🧙‍♂️') return 'wizard';
    if (n.includes('morgan') || n.includes('koboi') || n.includes('sheriff') || target.avatar === '🤠') return 'cowboy';
    if (n.includes('zero') || n.includes('robot') || n.includes('turing') || target.avatar === '🤖') return 'robot';
    if (n.includes('hana') || n.includes('mimi') || n.includes('chibi')) return 'chibi';
    if (n.includes('jin-woo') || n.includes('monarch')) return 'male';
    return 'scholar';
  };

  // Typewriter effect + Real Speech Output
  useEffect(() => {
    setDisplayedText('');
    setIsTyping(true);
    textIndexRef.current = 0;

    speechSynthesizer.speak(currentText, getPersona());

    let charIdx = 0;
    const interval = setInterval(() => {
      charIdx++;
      if (charIdx <= currentText.length) {
        setDisplayedText(currentText.slice(0, charIdx));
        if (charIdx % 2 === 0) {
          soundManager.playSpeechBlip();
        }
      } else {
        setIsTyping(false);
        clearInterval(interval);
      }
    }, 22);

    return () => {
      clearInterval(interval);
      speechSynthesizer.stop();
    };
  }, [currentText]);

  const handleFastForwardOrNext = () => {
    if (isTyping) {
      setDisplayedText(currentText);
      setIsTyping(false);
    }
  };

  const handleSelectOption = (opt: DialogueOption) => {
    soundManager.playInteract();

    if (opt.action === 'start_game' && target.game && onStartGame) {
      onStartGame(target.game);
      onClose();
      return;
    }

    if (opt.action === 'close') {
      onClose();
      return;
    }

    setCurrentText(opt.response);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'Enter') {
        if (isTyping) {
          handleFastForwardOrNext();
        }
      } else if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isTyping, currentText]);

  const hasGame = !!target.game && !!onStartGame;
  const locGameTitle = target.game ? LOCALIZED_GAMES[language][target.game.id]?.title || target.game.title : '';

  return (
    <div
      className="fixed inset-0 z-50 pointer-events-auto select-none flex flex-col justify-between overflow-hidden"
      onClick={handleFastForwardOrNext}
    >
      {/* 1. Genshin Cinematic Letterbox Bars (Top & Bottom) */}
      <div className="w-full h-12 md:h-16 bg-gradient-to-b from-black/85 to-transparent pointer-events-none flex items-center justify-between px-6">
        <div className="flex items-center gap-2 text-amber-300 text-xs font-serif tracking-widest uppercase opacity-80">
          <span>◆</span>
          <span>{t.dialogue.headerTag}</span>
          <span>◆</span>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            soundManager.playClick();
            onClose();
          }}
          className="pointer-events-auto text-xs text-white/60 hover:text-white bg-black/40 hover:bg-black/70 px-3 py-1 rounded-full border border-white/20 transition-all font-sans"
        >
          {t.dialogue.escClose}
        </button>
      </div>

      {/* Middle interaction zone */}
      <div className="flex-1 flex items-center justify-end p-6 md:p-12 pointer-events-none">
        {!isTyping && (
          <div
            className="flex flex-col gap-2.5 max-w-sm w-full pointer-events-auto animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            {hasGame && (
              <button
                onClick={() => {
                  soundManager.playInteract();
                  onStartGame!(target.game!);
                  onClose();
                }}
                className="group flex items-center justify-between gap-3 px-5 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500/90 via-pink-600/90 to-rose-600/90 hover:from-amber-400 hover:to-rose-500 text-white font-display font-extrabold text-sm md:text-base border-2 border-amber-300 shadow-2xl shadow-amber-950/80 transition-all transform hover:scale-[1.03] active:scale-[0.98]"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-amber-200 text-base">◆</span>
                  <span>{formatMsg(t.dialogue.startChallenge, { title: locGameTitle })}</span>
                </div>
                <Play className="w-4 h-4 fill-current text-white shrink-0 group-hover:translate-x-1 transition-transform" />
              </button>
            )}

            {target.options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectOption(opt)}
                className="group flex items-center justify-between gap-3 px-4 py-2.5 rounded-xl bg-slate-900/85 hover:bg-slate-800/95 border border-amber-400/40 hover:border-amber-300 text-left text-xs md:text-sm text-slate-100 font-medium shadow-xl backdrop-blur-md transition-all transform hover:translate-x-1"
              >
                <div className="flex items-center gap-2">
                  <span className="text-amber-400 font-serif text-sm">◆</span>
                  <span className="group-hover:text-amber-200 transition-colors">{opt.label}</span>
                </div>
                <ChevronRight className="w-4 h-4 text-amber-400/60 group-hover:text-amber-300 shrink-0" />
              </button>
            ))}

            <button
              onClick={() => {
                soundManager.playClick();
                onClose();
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-black/50 hover:bg-black/75 border border-white/20 text-xs text-white/70 hover:text-white transition-all w-fit self-end mt-1"
            >
              <span>◆</span>
              <span>{t.dialogue.closeChat}</span>
            </button>
          </div>
        )}
      </div>

      {/* 2. Genshin Impact Bottom Dialogue Box */}
      <div
        className="w-full max-w-4xl mx-auto mb-4 md:mb-6 px-4 pointer-events-auto"
        onClick={(e) => {
          e.stopPropagation();
          handleFastForwardOrNext();
        }}
      >
        <div className="relative bg-[#0d1322]/95 border-2 border-amber-400/60 rounded-3xl p-5 md:p-6 shadow-2xl backdrop-blur-xl">
          <div className="absolute -top-2.5 -left-2.5 w-5 h-5 bg-amber-400 rotate-45 border-2 border-slate-900 shadow-md" />
          <div className="absolute -top-2.5 -right-2.5 w-5 h-5 bg-amber-400 rotate-45 border-2 border-slate-900 shadow-md" />
          <div className="absolute -bottom-2.5 -left-2.5 w-5 h-5 bg-amber-400 rotate-45 border-2 border-slate-900 shadow-md" />
          <div className="absolute -bottom-2.5 -right-2.5 w-5 h-5 bg-amber-400 rotate-45 border-2 border-slate-900 shadow-md" />

          <div className="absolute -top-5 left-8 flex items-center gap-2.5 bg-gradient-to-r from-[#1c1829] via-[#2a1e3b] to-[#1c1829] border-2 border-amber-400 px-4 py-1 rounded-2xl shadow-lg">
            <span className="text-xl">{target.avatar}</span>
            <div className="flex items-center gap-2">
              <span className="font-display font-extrabold text-sm md:text-base text-amber-300">
                {target.name}
              </span>
              <span className="text-amber-400/50">|</span>
              <span className="text-[11px] font-semibold text-slate-300">
                {target.title}
              </span>
            </div>
            {target.region && (
              <span className="text-[10px] bg-amber-500/20 text-amber-200 border border-amber-400/40 px-2 py-0.5 rounded-full ml-1">
                {target.region}
              </span>
            )}
          </div>

          <div className="pt-2 min-h-[72px] md:min-h-[84px] flex flex-col justify-between">
            <p className="text-sm md:text-base text-slate-100 font-sans leading-relaxed tracking-wide selection:bg-amber-500 selection:text-black">
              {displayedText}
              {isTyping && <span className="inline-block w-2 h-4 bg-amber-400 ml-1 animate-pulse" />}
            </p>

            <div className="flex items-center justify-between text-[11px] text-amber-300/70 pt-2 border-t border-white/10 mt-2">
              <div className="flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
                <span>{t.dialogue.fastForwardHint}</span>
              </div>
              <div className="flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-white/60">{t.dialogue.footerBrand}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
