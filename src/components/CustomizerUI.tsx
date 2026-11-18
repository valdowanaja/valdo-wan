/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useGameStore } from '../state/useGameStore';
import { CHARACTER_PRESETS } from '../data/constants';
import { LOCALIZED_PRESETS, TRANSLATIONS } from '../data/i18n';
import { CharacterArchetypeId } from '../types';
import { soundManager } from '../audio/SoundSynthesizer';
import { multiplayerClient } from '../network/MultiplayerClient';
import { RotateCw, ArrowLeft } from 'lucide-react';

interface CustomizerUIProps {
  onBack: () => void;
  onEnterLobby: () => void;
  onRotateTurntable: (deltaX: number) => void;
}

export const CustomizerUI: React.FC<CustomizerUIProps> = ({ onBack, onEnterLobby, onRotateTurntable }) => {
  const { character, selectPreset, updateCharacter, language, player } = useGameStore();
  const t = TRANSLATIONS[language];
  const currentPreset = CHARACTER_PRESETS.find((p) => p.id === character.archetypeId) || CHARACTER_PRESETS[0];
  const locPreset = LOCALIZED_PRESETS[language][currentPreset.id];

  const handleSelectPreset = (id: CharacterArchetypeId) => {
    soundManager.playClick();
    selectPreset(id);
    const updated = useGameStore.getState().character;
    multiplayerClient.emitCustomize(player.playerName, updated);
  };

  const handleColorChange = (key: 'hairColor' | 'eyeColor' | 'outfitColor' | 'secondaryColor', val: string) => {
    soundManager.playClick();
    updateCharacter({ [key]: val });
    const updated = useGameStore.getState().character;
    multiplayerClient.emitCustomize(player.playerName, updated);
  };

  // Color Swatches
  const hairPalette = ['#f1f5f9', '#38bdf8', '#f472b6', '#d97706', '#fbbf24', '#1e293b', '#78350f', '#10b981', '#a855f7'];
  const outfitPalette = ['#cbd5e1', '#ffffff', '#ec4899', '#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#06b6d4', '#1e293b'];
  const eyePalette = ['#facc15', '#0284c7', '#9d174d', '#451a03', '#b45309', '#059669', '#7c3aed', '#0f172a'];

  return (
    <div className="fixed inset-0 z-20 flex flex-col justify-between p-4 md:p-8 pointer-events-none select-none">
      {/* Top Header */}
      <div className="flex items-center justify-between w-full pointer-events-auto">
        <button
          onClick={() => {
            soundManager.playClick();
            onBack();
          }}
          className="btn-3d px-4 py-2.5 bg-purple-900/80 border-b-4 border-purple-950 text-white rounded-xl flex items-center gap-2 border border-purple-400/30 text-sm font-bold shadow-md"
        >
          <ArrowLeft className="w-4 h-4 text-pink-400" />
          {t.common.back}
        </button>

        <div className="text-center">
          <div className="font-display font-extrabold text-xl md:text-2xl text-white drop-shadow-md">
            {t.customizer.headerTitle}
          </div>
          <div className="text-xs text-pink-300 font-semibold flex items-center justify-center gap-1">
            <RotateCw className="w-3.5 h-3.5 animate-spin" /> {t.customizer.dragHint}
          </div>
        </div>

        <button
          onClick={() => {
            soundManager.playClick();
            onEnterLobby();
          }}
          className="btn-3d px-6 py-2.5 bg-gradient-to-r from-pink-500 to-rose-600 border-b-4 border-rose-800 text-white rounded-xl text-sm md:text-base font-extrabold shadow-lg shadow-pink-900/50"
        >
          {t.customizer.saveAndEnter}
        </button>
      </div>

      {/* Center Interactive Drag Area for Turntable */}
      <div
        className="my-auto h-72 md:h-96 w-full pointer-events-auto cursor-grab active:cursor-grabbing flex items-center justify-center"
        onMouseDown={(e) => {
          const startX = e.clientX;
          const handleMouseMove = (moveE: MouseEvent) => {
            const dx = moveE.clientX - startX;
            onRotateTurntable(dx);
          };
          const handleMouseUp = () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
          };
          window.addEventListener('mousemove', handleMouseMove);
          window.addEventListener('mouseup', handleMouseUp);
        }}
        onTouchStart={(e) => {
          let lastX = e.touches[0].clientX;
          const handleTouchMove = (touchE: TouchEvent) => {
            const currentX = touchE.touches[0].clientX;
            const dx = currentX - lastX;
            lastX = currentX;
            onRotateTurntable(dx * 2);
          };
          const handleTouchEnd = () => {
            window.removeEventListener('touchmove', handleTouchMove);
            window.removeEventListener('touchend', handleTouchEnd);
          };
          window.addEventListener('touchmove', handleTouchMove);
          window.addEventListener('touchend', handleTouchEnd);
        }}
      >
        {/* Invisible touch catcher over 3D model */}
      </div>

      {/* Bottom Panel: Character selector & Color swatches */}
      <div className="w-full max-w-4xl mx-auto bg-purple-950/85 border border-purple-500/30 rounded-3xl p-4 md:p-6 backdrop-blur-md shadow-2xl pointer-events-auto">
        {/* Active Character Bio Strip */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-3 mb-4 border-b border-purple-800/60 gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-extrabold text-2xl text-white">{currentPreset.name}</span>
              <span className="px-2.5 py-0.5 rounded-full bg-pink-500/30 border border-pink-400/40 text-pink-300 text-xs font-bold">
                {locPreset?.role || currentPreset.role}
              </span>
              {currentPreset.isChibi && (
                <span className="px-2 py-0.5 rounded-full bg-amber-500/30 border border-amber-400/40 text-amber-300 text-xs font-bold">
                  {t.customizer.chibiTag}
                </span>
              )}
            </div>
            <div className="text-xs text-purple-200 mt-1 italic font-medium">
              "{locPreset?.tagline || currentPreset.tagline}"
            </div>
          </div>
          <div className="text-xs text-purple-300/80 max-w-sm hidden md:block">
            {locPreset?.description || currentPreset.description}
          </div>
        </div>

        {/* 8 Character Preset Tabs */}
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 mb-4">
          {CHARACTER_PRESETS.map((p) => {
            const isSelected = p.id === character.archetypeId;
            return (
              <button
                key={p.id}
                onClick={() => handleSelectPreset(p.id)}
                className={`flex flex-col items-center p-2 rounded-2xl border transition-all text-xs font-bold ${
                  isSelected
                    ? 'bg-pink-600 border-white text-white shadow-lg shadow-pink-900/60 scale-105'
                    : 'bg-purple-900/50 border-purple-700/50 text-purple-200 hover:bg-purple-800/60'
                }`}
              >
                <div
                  className="w-7 h-7 rounded-full mb-1 border-2 border-white/40 shadow-sm"
                  style={{ backgroundColor: p.defaultHairColor }}
                />
                <span>{p.name}</span>
              </button>
            );
          })}
        </div>

        {/* Color Customization Sliders / Swatches */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          {/* Hair Color */}
          <div className="bg-purple-900/40 p-2.5 rounded-2xl border border-purple-800/40">
            <span className="text-xs font-bold text-pink-300 block mb-1.5">{t.customizer.hairColor}</span>
            <div className="flex flex-wrap gap-1.5">
              {hairPalette.map((c) => (
                <button
                  key={c}
                  onClick={() => handleColorChange('hairColor', c)}
                  className={`w-6 h-6 rounded-full border border-white/40 transition-transform ${
                    character.hairColor === c ? 'ring-2 ring-white scale-110' : 'hover:scale-105'
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          {/* Outfit Color */}
          <div className="bg-purple-900/40 p-2.5 rounded-2xl border border-purple-800/40">
            <span className="text-xs font-bold text-pink-300 block mb-1.5">{t.customizer.outfitColor}</span>
            <div className="flex flex-wrap gap-1.5">
              {outfitPalette.map((c) => (
                <button
                  key={c}
                  onClick={() => handleColorChange('outfitColor', c)}
                  className={`w-6 h-6 rounded-full border border-white/40 transition-transform ${
                    character.outfitColor === c ? 'ring-2 ring-white scale-110' : 'hover:scale-105'
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          {/* Eye Color */}
          <div className="bg-purple-900/40 p-2.5 rounded-2xl border border-purple-800/40">
            <span className="text-xs font-bold text-pink-300 block mb-1.5">{t.customizer.eyeColor}</span>
            <div className="flex flex-wrap gap-1.5">
              {eyePalette.map((c) => (
                <button
                  key={c}
                  onClick={() => handleColorChange('eyeColor', c)}
                  className={`w-6 h-6 rounded-full border border-white/40 transition-transform ${
                    character.eyeColor === c ? 'ring-2 ring-white scale-110' : 'hover:scale-105'
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
