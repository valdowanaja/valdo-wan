/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { inputManager } from '../core/InputManager';
import { useGameStore } from '../state/useGameStore';
import { TRANSLATIONS } from '../data/i18n';

interface VirtualControlsProps {
  onAction?: (action: 'jump' | 'interact') => void;
  interactionPrompt?: string | null;
}

export const VirtualControls: React.FC<VirtualControlsProps> = ({ onAction, interactionPrompt }) => {
  const [touchActive, setTouchActive] = useState(false);
  const [sprintToggle, setSprintToggle] = useState(false);
  const [knobPos, setKnobPos] = useState({ x: 0, y: 0 });
  const baseRef = useRef<HTMLDivElement>(null);
  const touchIdRef = useRef<number | null>(null);

  const { language } = useGameStore();
  const t = TRANSLATIONS[language];

  const maxRadius = 45;

  const handleTouchStart = (e: React.TouchEvent) => {
    if (touchIdRef.current !== null) return;
    const touch = e.changedTouches[0];
    touchIdRef.current = touch.identifier;
    setTouchActive(true);
    updateKnob(touch.clientX, touch.clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    for (let i = 0; i < e.changedTouches.length; i++) {
      if (e.changedTouches[i].identifier === touchIdRef.current) {
        updateKnob(e.changedTouches[i].clientX, e.changedTouches[i].clientY);
        break;
      }
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    for (let i = 0; i < e.changedTouches.length; i++) {
      if (e.changedTouches[i].identifier === touchIdRef.current) {
        touchIdRef.current = null;
        setTouchActive(false);
        setKnobPos({ x: 0, y: 0 });
        inputManager.setVirtualJoystick(0, 0);
        break;
      }
    }
  };

  const updateKnob = (clientX: number, clientY: number) => {
    if (!baseRef.current) return;
    const rect = baseRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const dx = clientX - centerX;
    const dy = clientY - centerY;
    const dist = Math.hypot(dx, dy);

    if (dist <= maxRadius) {
      setKnobPos({ x: dx, y: dy });
      inputManager.setVirtualJoystick(dx / maxRadius, dy / maxRadius);
    } else {
      const angle = Math.atan2(dy, dx);
      const clampedX = Math.cos(angle) * maxRadius;
      const clampedY = Math.sin(angle) * maxRadius;
      setKnobPos({ x: clampedX, y: clampedY });
      inputManager.setVirtualJoystick(Math.cos(angle), Math.sin(angle));
    }
  };

  const handleToggleSprint = () => {
    const next = !sprintToggle;
    setSprintToggle(next);
    inputManager.setVirtualSprint(next);
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-30 select-none">
      {/* Interaction helper banner on screen when active */}
      {interactionPrompt && (
        <div className="absolute top-28 left-1/2 -translate-x-1/2 pointer-events-auto">
          <button
            onClick={() => {
              inputManager.triggerAction('interact');
              onAction?.('interact');
            }}
            className="btn-3d px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-600 border-b-4 border-rose-800 text-white text-base md:text-lg shadow-xl shadow-pink-900/40 animate-bounce"
          >
            {interactionPrompt}
          </button>
        </div>
      )}

      {/* Virtual Joystick (Bottom Left) */}
      <div className="absolute bottom-6 left-6 pointer-events-auto block md:hidden">
        <div
          ref={baseRef}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onTouchCancel={handleTouchEnd}
          className={`w-32 h-32 rounded-full border-2 border-white/20 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center relative touch-none transition-colors ${
            touchActive ? 'border-pink-400 bg-pink-950/40' : ''
          }`}
        >
          {/* Inner Knob */}
          <div
            className="w-14 h-14 rounded-full bg-gradient-to-tr from-pink-500 to-rose-400 shadow-md border border-white/40 absolute transition-transform ease-out duration-75"
            style={{
              transform: `translate(${knobPos.x}px, ${knobPos.y}px)`,
            }}
          />
        </div>
      </div>

      {/* Action Buttons (Bottom Right) */}
      <div className="absolute bottom-6 right-6 pointer-events-auto flex items-end gap-2.5 block md:hidden">
        {/* Sprint Toggle Button */}
        <button
          onClick={handleToggleSprint}
          className={`btn-3d w-14 h-14 rounded-full border-b-4 font-bold text-xs shadow-lg active:translate-y-1 transition-all ${
            sprintToggle
              ? 'bg-amber-500 border-amber-700 text-slate-950 ring-2 ring-white'
              : 'bg-purple-900/90 border-purple-950 text-purple-200'
          }`}
        >
          ⚡ {t.virtualControls.sprintBtn}
        </button>

        {/* Interact Button */}
        <button
          onClick={() => {
            inputManager.triggerAction('interact');
            onAction?.('interact');
          }}
          className="btn-3d w-16 h-16 rounded-full bg-cyan-500 border-b-4 border-cyan-800 text-white font-bold text-xs shadow-lg shadow-cyan-950/40 active:translate-y-1"
        >
          {t.virtualControls.interactBtn}
        </button>

        {/* Jump Button */}
        <button
          onClick={() => {
            inputManager.triggerAction('jump');
            onAction?.('jump');
          }}
          className="btn-3d w-20 h-20 rounded-full bg-pink-500 border-b-4 border-pink-800 text-white font-bold text-sm shadow-lg shadow-pink-950/40 active:translate-y-1"
        >
          {t.virtualControls.jumpBtn}
        </button>
      </div>

      {/* Desktop Keyboard Controls Legend (Bottom-Right Quiet Badge) */}
      <div className="hidden md:flex absolute bottom-4 right-6 pointer-events-none items-center gap-2 text-xs font-semibold text-white/70 bg-black/45 px-3 py-1.5 rounded-lg border border-white/10 backdrop-blur-xs">
        <span>{t.virtualControls.legendMove}</span>
        <span>·</span>
        <span>{t.virtualControls.legendSprint}</span>
        <span>·</span>
        <span>{t.virtualControls.legendJump}</span>
        <span>·</span>
        <span>{t.virtualControls.legendInteract}</span>
      </div>
    </div>
  );
};
