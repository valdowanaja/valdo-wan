/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useGameStore } from '../state/useGameStore';
import { BADGE_DETAILS, GAME_CATALOG } from '../data/constants';
import { LOCALIZED_BADGES, LOCALIZED_GAMES, TRANSLATIONS, formatMsg } from '../data/i18n';
import { soundManager } from '../audio/SoundSynthesizer';
import { Trophy, Star, Medal, Award } from 'lucide-react';

interface LeaderboardModalProps {
  onClose: () => void;
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({ onClose }) => {
  const { player, language } = useGameStore();
  const t = TRANSLATIONS[language];

  const getRankTitle = (lvl: number) => {
    if (lvl >= 10) return t.leaderboard.ranks.master;
    if (lvl >= 6) return t.leaderboard.ranks.architect;
    if (lvl >= 3) return t.leaderboard.ranks.explorer;
    return t.leaderboard.ranks.apprentice;
  };

  const totalStars = Object.values(player.gameProgress)
    .flat()
    .reduce((sum, item) => sum + item.stars, 0);

  // Deduplicate legacy 'Langkah Pertama EduVerse' vs 'Langkah Pertama Valworld3D'
  const badgeEntries = Object.entries(BADGE_DETAILS).filter(
    ([key]) => key !== 'Langkah Pertama EduVerse'
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 select-none pointer-events-auto">
      <div className="bg-purple-950 border-2 border-purple-400 rounded-3xl p-6 md:p-8 max-w-xl w-full shadow-2xl max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-purple-800">
          <div className="flex items-center gap-2">
            <Trophy className="w-6 h-6 text-yellow-300" />
            <div className="font-display font-extrabold text-2xl text-white">{t.leaderboard.title}</div>
          </div>
          <button
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="text-purple-300 hover:text-white font-bold text-sm"
          >
            {t.common.close}
          </button>
        </div>

        {/* Player Rank Header */}
        <div className="my-5 bg-gradient-to-r from-purple-900 to-pink-950 border border-purple-500/40 p-4 rounded-2xl flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-pink-300 uppercase tracking-wider">{t.leaderboard.currentRank}</div>
            <div className="font-display font-extrabold text-2xl text-white mt-0.5">
              {getRankTitle(player.level)}
            </div>
            <div className="text-xs text-purple-200 mt-1 font-semibold">
              {t.common.level} {player.level} · {player.totalXp} XP
            </div>
          </div>
          <div className="flex items-center gap-2 bg-purple-950/80 px-4 py-2 rounded-xl border border-amber-400/50 text-amber-300 font-display font-bold">
            <Star className="w-5 h-5 fill-current" />
            <span className="text-lg tabular-nums">{totalStars}</span>
          </div>
        </div>

        {/* Badges Grid */}
        <div className="mb-6">
          <div className="text-sm font-bold text-pink-300 mb-3 flex items-center gap-1.5">
            <Medal className="w-4 h-4" />
            <span>{formatMsg(t.leaderboard.badgesCollection, { count: player.unlockedBadges.length })}</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {badgeEntries.map(([badgeKey, details]) => {
              const isUnlocked =
                player.unlockedBadges.includes(badgeKey) ||
                (badgeKey === 'Langkah Pertama Valworld3D' &&
                  player.unlockedBadges.includes('Langkah Pertama EduVerse'));
              const locBadge = LOCALIZED_BADGES[language][badgeKey];

              return (
                <div
                  key={badgeKey}
                  className={`p-3 rounded-2xl border flex items-start gap-3 transition-all ${
                    isUnlocked
                      ? 'bg-purple-900/60 border-pink-400/60 text-white shadow-md'
                      : 'bg-purple-950/40 border-purple-900/60 text-purple-500 opacity-60'
                  }`}
                >
                  <div className="text-2xl p-2 rounded-xl bg-purple-950/80 border border-white/10 shrink-0">
                    {details.icon}
                  </div>
                  <div>
                    <div className="font-display font-bold text-xs md:text-sm text-pink-200">
                      {locBadge?.title || details.title}
                    </div>
                    <div className="text-[11px] text-purple-300/80 mt-0.5 leading-snug">
                      {locBadge?.desc || details.desc}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 9 Subjects Stars Progress (20 levels * 3 = 60 max stars each) */}
        <div>
          <div className="text-sm font-bold text-pink-300 mb-3 flex items-center gap-1.5">
            <Award className="w-4 h-4" /> {t.leaderboard.subjectsProgress}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {GAME_CATALOG.map((g) => {
              const stars = (player.gameProgress[g.id] || []).reduce((a, b) => a + b.stars, 0);
              const locGameTitle = LOCALIZED_GAMES[language][g.id]?.title || g.title;
              return (
                <div key={g.id} className="bg-purple-900/40 p-2.5 rounded-xl border border-purple-800/40 text-center">
                  <div className="text-xs font-bold text-purple-200 truncate">{locGameTitle}</div>
                  <div className="flex items-center justify-center gap-1 text-amber-300 text-xs font-bold mt-1">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span className="tabular-nums">{stars} / 60</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
