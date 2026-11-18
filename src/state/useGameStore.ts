/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { create } from 'zustand';
import {
  ActiveQuest,
  ActiveScene,
  AppLanguage,
  CameraPerspective,
  CharacterArchetypeId,
  CharacterCustomization,
  EmoteType,
  GameId,
  GameInfo,
  GameLevelProgress,
  GraphicQuality,
  PlayerProgress,
} from '../types';
import { CHARACTER_PRESETS } from '../data/constants';

interface GameState {
  // Localization
  language: AppLanguage;
  setLanguage: (lang: AppLanguage) => void;

  // Navigation
  activeScene: ActiveScene;
  previousScene: ActiveScene;
  setScene: (scene: ActiveScene) => void;

  // Quests & Missions
  activeQuests: ActiveQuest[];
  startQuest: (quest: ActiveQuest) => void;
  progressQuest: (itemType: 'mana_crystal' | 'sheriff_badge') => void;
  isQuestCompleted: (questId: string) => boolean;

  // Camera Perspective (TPP vs FPP)
  cameraMode: CameraPerspective;
  setCameraMode: (mode: CameraPerspective) => void;
  toggleCameraMode: () => void;

  // Emotes
  activeEmote: EmoteType | null;
  triggerEmote: (emote: EmoteType) => void;

  // Guardian Dialog Interaction
  selectedGuardianGame: GameInfo | null;
  setSelectedGuardianGame: (game: GameInfo | null) => void;

  // Player Profile & Progress
  player: PlayerProgress;
  setPlayerName: (name: string) => void;
  addXp: (amount: number) => void;
  completeLevel: (gameId: GameId, levelIndex: number, stars: number, score: number) => void;
  unlockBadge: (badgeName: string) => void;

  // Character Customization
  character: CharacterCustomization;
  updateCharacter: (partial: Partial<CharacterCustomization>) => void;
  selectPreset: (archetypeId: CharacterArchetypeId) => void;

  // Settings
  quality: GraphicQuality;
  bgmVolume: number;
  sfxVolume: number;
  isMuted: boolean;
  highContrast: boolean;
  reducedMotion: boolean;
  setQuality: (quality: GraphicQuality) => void;
  setBgmVolume: (v: number) => void;
  setSfxVolume: (v: number) => void;
  toggleMute: () => void;
  toggleHighContrast: () => void;
  toggleReducedMotion: () => void;

  // Transient In-Game State
  activeDialog: { speaker: string; text: string; options?: string[] } | null;
  setActiveDialog: (dialog: { speaker: string; text: string; options?: string[] } | null) => void;
  isPaused: boolean;
  setIsPaused: (paused: boolean) => void;

  currentMathLevel: number;
  setCurrentMathLevel: (lvl: number) => void;
  gameLevelIndices: Record<GameId, number>;
  setGameLevelIndex: (gid: GameId, lvl: number) => void;

  // Storage reset
  resetVersion: number;
  resetAllProgress: () => void;
}

const STORAGE_KEY = 'eduverse_save_data_v1';

const defaultCustomization: CharacterCustomization = {
  archetypeId: 'aoi',
  hairColor: '#f1f5f9',
  eyeColor: '#facc15',
  outfitColor: '#cbd5e1',
  secondaryColor: '#ffffff',
};

const defaultInitialGameProgress = (): Record<GameId, GameLevelProgress[]> => {
  const games: GameId[] = ['math', 'physics', 'design', 'ui', 'ux', 'chemistry', 'code', 'biology', 'dungeon'];
  const res: Partial<Record<GameId, GameLevelProgress[]>> = {};
  games.forEach((gid) => {
    res[gid] = Array.from({ length: 20 }, (_, i) => ({
      levelIndex: i,
      completed: false,
      stars: 0,
      highScore: 0,
    }));
  });
  return res as Record<GameId, GameLevelProgress[]>;
};

const defaultPlayerProgress = (): PlayerProgress => ({
  totalXp: 0,
  level: 1,
  playerName: 'Penjelajah Bintang',
  unlockedBadges: [],
  gameProgress: defaultInitialGameProgress(),
});

const loadInitialState = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed?.player?.gameProgress) {
      const games: GameId[] = ['math', 'physics', 'design', 'ui', 'ux', 'chemistry', 'code', 'biology', 'dungeon'];
      games.forEach((gid) => {
        const cur = parsed.player.gameProgress[gid] || [];
        if (cur.length < 20) {
          const filled = Array.from({ length: 20 }, (_, i) => {
            return (
              cur[i] || {
                levelIndex: i,
                completed: false,
                stars: 0,
                highScore: 0,
              }
            );
          });
          parsed.player.gameProgress[gid] = filled;
        }
      });
    }
    return parsed;
  } catch {
    return null;
  }
};

const saved = loadInitialState();

function persistFullState(state: GameState) {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        language: state.language,
        player: state.player,
        character: state.character,
        quality: state.quality,
        cameraMode: state.cameraMode,
        activeQuests: state.activeQuests,
        bgmVolume: state.bgmVolume,
        sfxVolume: state.sfxVolume,
        isMuted: state.isMuted,
        highContrast: state.highContrast,
        reducedMotion: state.reducedMotion,
      })
    );
  } catch {}
}

export const useGameStore = create<GameState>((set, get) => ({
  language: (saved?.language as AppLanguage) || 'id',
  setLanguage: (language: AppLanguage) => {
    set({ language });
    persistFullState(get());
  },

  activeScene: 'title',
  previousScene: 'title',
  setScene: (scene: ActiveScene) => {
    set((state) => ({
      previousScene: state.activeScene,
      activeScene: scene,
      isPaused: false,
      activeDialog: null,
      selectedGuardianGame: null,
    }));
  },

  activeQuests: saved?.activeQuests || [],
  startQuest: (quest: ActiveQuest) => {
    set((state) => {
      const exists = state.activeQuests.find((q) => q.id === quest.id);
      if (exists) return state;
      return { activeQuests: [...state.activeQuests, quest] };
    });
    persistFullState(get());
  },
  progressQuest: (itemType: 'mana_crystal' | 'sheriff_badge') => {
    let changed = false;
    set((state) => {
      const updated = state.activeQuests.map((q) => {
        if (q.itemType === itemType && !q.isCompleted) {
          changed = true;
          const nextCount = Math.min(q.targetCount, q.currentCount + 1);
          const completed = nextCount >= q.targetCount;
          if (completed) {
            setTimeout(() => {
              get().unlockBadge(q.rewardBadge);
              get().addXp(q.rewardXp);
            }, 50);
          }
          return {
            ...q,
            currentCount: nextCount,
            isCompleted: completed,
          };
        }
        return q;
      });
      return changed ? { activeQuests: updated } : state;
    });
    if (changed) persistFullState(get());
  },
  isQuestCompleted: (questId: string) => {
    return get().activeQuests.find((q) => q.id === questId)?.isCompleted ?? false;
  },

  cameraMode: (saved?.cameraMode as CameraPerspective) || 'tpp',
  setCameraMode: (cameraMode) => {
    set({ cameraMode });
    persistFullState(get());
  },
  toggleCameraMode: () => {
    const next = get().cameraMode === 'tpp' ? 'fpp' : 'tpp';
    set({ cameraMode: next });
    persistFullState(get());
  },

  activeEmote: null,
  triggerEmote: (emote) => {
    set({ activeEmote: emote });
    setTimeout(() => {
      if (get().activeEmote === emote) {
        set({ activeEmote: null });
      }
    }, 2800);
  },

  selectedGuardianGame: null,
  setSelectedGuardianGame: (game) => set({ selectedGuardianGame: game }),

  player: saved?.player || defaultPlayerProgress(),
  setPlayerName: (name: string) => {
    set((state) => ({
      player: { ...state.player, playerName: name.trim() || 'Penjelajah' },
    }));
    persistFullState(get());
  },

  addXp: (amount: number) => {
    set((state) => {
      const newXp = state.player.totalXp + amount;
      const newLevel = Math.max(1, Math.floor(newXp / 250) + 1);
      return {
        player: {
          ...state.player,
          totalXp: newXp,
          level: newLevel,
        },
      };
    });
    persistFullState(get());
  },

  completeLevel: (gameId: GameId, levelIndex: number, stars: number, score: number) => {
    set((state) => {
      const currentList = state.player.gameProgress[gameId] || [];
      const updatedList = [...currentList];
      const existing = updatedList[levelIndex] || {
        levelIndex,
        completed: false,
        stars: 0,
        highScore: 0,
      };

      updatedList[levelIndex] = {
        levelIndex,
        completed: true,
        stars: Math.max(existing.stars, stars),
        highScore: Math.max(existing.highScore, score),
      };

      const xpEarned = stars * 40 + (existing.completed ? 10 : 80);
      const newTotalXp = state.player.totalXp + xpEarned;
      const newLevel = Math.max(1, Math.floor(newTotalXp / 250) + 1);

      const totalStars = Object.values({ ...state.player.gameProgress, [gameId]: updatedList })
        .flat()
        .reduce((sum, item) => sum + item.stars, 0);

      const badges = [...state.player.unlockedBadges];
      if (totalStars >= 10 && !badges.includes('Bintang Cendekia')) {
        badges.push('Bintang Cendekia');
      }

      const updatedPlayer: PlayerProgress = {
        ...state.player,
        totalXp: newTotalXp,
        level: newLevel,
        unlockedBadges: badges,
        gameProgress: {
          ...state.player.gameProgress,
          [gameId]: updatedList,
        },
      };

      return { player: updatedPlayer };
    });
    persistFullState(get());
  },

  unlockBadge: (badgeName: string) => {
    set((state) => {
      if (state.player.unlockedBadges.includes(badgeName)) return state;
      return {
        player: {
          ...state.player,
          unlockedBadges: [...state.player.unlockedBadges, badgeName],
          totalXp: state.player.totalXp + 100,
        },
      };
    });
    persistFullState(get());
  },

  character: saved?.character || defaultCustomization,
  updateCharacter: (partial: Partial<CharacterCustomization>) => {
    set((state) => ({
      character: { ...state.character, ...partial },
    }));
    persistFullState(get());
  },

  selectPreset: (archetypeId: CharacterArchetypeId) => {
    const preset = CHARACTER_PRESETS.find((p) => p.id === archetypeId);
    if (!preset) return;
    set({
      character: {
        archetypeId,
        hairColor: preset.defaultHairColor,
        eyeColor: preset.defaultEyeColor,
        outfitColor: preset.defaultOutfitColor,
        secondaryColor: preset.defaultSecondaryColor,
      },
    });
    persistFullState(get());
  },

  quality: saved?.quality || 'high',
  bgmVolume: saved?.bgmVolume ?? 0.65,
  sfxVolume: saved?.sfxVolume ?? 0.8,
  isMuted: saved?.isMuted ?? false,
  highContrast: saved?.highContrast ?? false,
  reducedMotion: saved?.reducedMotion ?? false,

  setQuality: (quality: GraphicQuality) => {
    set({ quality });
    persistFullState(get());
  },

  setBgmVolume: (v: number) => {
    set({ bgmVolume: Math.max(0, Math.min(1, v)) });
    persistFullState(get());
  },
  setSfxVolume: (v: number) => {
    set({ sfxVolume: Math.max(0, Math.min(1, v)) });
    persistFullState(get());
  },
  toggleMute: () => {
    set((s) => ({ isMuted: !s.isMuted }));
    persistFullState(get());
  },
  toggleHighContrast: () => {
    set((s) => ({ highContrast: !s.highContrast }));
    persistFullState(get());
  },
  toggleReducedMotion: () => {
    set((s) => ({ reducedMotion: !s.reducedMotion }));
    persistFullState(get());
  },

  activeDialog: null,
  setActiveDialog: (dialog) => set({ activeDialog: dialog }),
  isPaused: false,
  setIsPaused: (isPaused) => set({ isPaused }),

  currentMathLevel: 0,
  setCurrentMathLevel: (lvl) => set({ currentMathLevel: lvl }),
  gameLevelIndices: {
    math: 0,
    physics: 0,
    design: 0,
    ui: 0,
    ux: 0,
    chemistry: 0,
    code: 0,
    biology: 0,
    dungeon: 0,
  },
  setGameLevelIndex: (gid, lvl) =>
    set((s) => ({
      gameLevelIndices: { ...s.gameLevelIndices, [gid]: lvl },
    })),

  resetVersion: 0,
  resetAllProgress: () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
    set((s) => ({
      player: defaultPlayerProgress(),
      character: { ...defaultCustomization },
      currentMathLevel: 0,
      gameLevelIndices: {
        math: 0,
        physics: 0,
        design: 0,
        ui: 0,
        ux: 0,
        chemistry: 0,
        code: 0,
        biology: 0,
        dungeon: 0,
      },
      cameraMode: 'tpp',
      activeQuests: [],
      selectedGuardianGame: null,
      activeDialog: null,
      resetVersion: s.resetVersion + 1,
    }));
  },
}));
