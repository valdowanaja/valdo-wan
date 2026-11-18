/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type AppLanguage = 'id' | 'en' | 'ja';

export type GameId = 
  | 'math'       // Kastil Angka
  | 'physics'    // Sakura Launch
  | 'design'     // Atelier Warna
  | 'ui'         // Neon Interface Rescue
  | 'ux'         // Kafe Pengguna
  | 'chemistry'  // Lab Bintang
  | 'code'       // Robo Labirin
  | 'biology'    // Hutan Sel
  | 'dungeon';   // Dungeon Solo Leveling (Gerbang Bayangan)

export type ActiveScene = 
  | 'title' 
  | 'customizer' 
  | 'lobby' 
  | 'game_math' 
  | 'game_physics' 
  | 'game_design' 
  | 'game_ui' 
  | 'game_ux' 
  | 'game_chemistry' 
  | 'game_code' 
  | 'game_biology'
  | 'game_dungeon';

export type CameraPerspective = 'tpp' | 'fpp';

export type EmoteType = 'cheer' | 'dance' | 'wave' | 'bow' | 'think';

export type CharacterArchetypeId = 
  | 'aoi' 
  | 'hana' 
  | 'kaede' 
  | 'ren' 
  | 'kaito' 
  | 'daichi' 
  | 'mimi' 
  | 'piko';

export interface CharacterPreset {
  id: CharacterArchetypeId;
  name: string;
  role: string;
  tagline: string;
  isChibi: boolean;
  defaultHairColor: string;
  defaultEyeColor: string;
  defaultOutfitColor: string;
  defaultSecondaryColor: string;
  skinColor: string;
  description: string;
}

export interface CharacterCustomization {
  archetypeId: CharacterArchetypeId;
  hairColor: string;
  eyeColor: string;
  outfitColor: string;
  secondaryColor: string;
}

export type GraphicQuality = 'low' | 'med' | 'high';

export interface GameLevelProgress {
  levelIndex: number;
  completed: boolean;
  stars: number; // 0 to 3
  highScore: number;
}

export interface PlayerProgress {
  totalXp: number;
  level: number;
  playerName: string;
  unlockedBadges: string[];
  gameProgress: Record<GameId, GameLevelProgress[]>;
}

export interface GameGuardian {
  name: string;
  title: string;
  avatar: string;
  outfitColor: string;
  accessoryColor: string;
  greeting: string;
  rules: string[];
  objectives: string[];
  proTip: string;
}

export interface GameInfo {
  id: GameId;
  title: string;
  subject: string;
  tagline: string;
  color: string;
  sceneName: ActiveScene;
  badgeName: string;
  icon: string;
  guardian: GameGuardian;
}

export interface DialogueOption {
  label: string;
  response: string;
  action?: 'start_game' | 'lore' | 'rules' | 'tip' | 'close';
}

export interface NpcEntity {
  id: string;
  name: string;
  title: string;
  avatar: string;
  region: string;
  outfitColor: string;
  accessoryColor: string;
  initialDialogue: string;
  options: DialogueOption[];
  gameId?: GameId;
  position: [number, number, number];
  rotationY?: number;
  wanderRadius?: number;
  quest?: {
    id: string;
    title: string;
    description: string;
    itemType: 'mana_crystal' | 'sheriff_badge';
    targetCount: number;
    rewardBadge: string;
    rewardXp: number;
  };
}

export interface ActiveQuest {
  id: string;
  npcId: string;
  npcName: string;
  title: string;
  description: string;
  itemType: 'mana_crystal' | 'sheriff_badge';
  targetCount: number;
  currentCount: number;
  isCompleted: boolean;
  rewardBadge: string;
  rewardXp: number;
}

export interface CollectibleItemData {
  id: string;
  type: 'mana_crystal' | 'sheriff_badge';
  position: [number, number, number];
  collected: boolean;
}

export interface DungeonLevelData {
  levelNumber: number;
  title: string;
  rank: 'E-Rank' | 'D-Rank' | 'C-Rank' | 'B-Rank' | 'A-Rank' | 'S-Rank' | 'Monarch';
  bossName: string;
  bossTitle: string;
  bossHp: number;
  bossAttack: number;
  bossColor: string;
  minionHp: number;
  description: string;
}

export interface RemotePlayerState {
  id: string;
  playerName: string;
  character: CharacterCustomization;
  position: [number, number, number];
  rotationY: number;
  isMoving: boolean;
  isSprinting: boolean;
  isJumping: boolean;
  activeEmote: EmoteType | null;
  scene: string;
}

export interface RoomSummary {
  roomId: string;
  playerCount: number;
  maxPlayers: number;
  hostId?: string | null;
  hostName?: string | null;
}

export interface MultiplayerChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: number;
}
