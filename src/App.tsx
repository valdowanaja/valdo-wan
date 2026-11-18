/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useCallback, useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useGameStore } from './state/useGameStore';
import { inputManager } from './core/InputManager';
import { soundManager } from './audio/SoundSynthesizer';
import { AnimeCharacterModel } from './characters/AnimeCharacterModel';
import { LobbyScene, GateTrigger } from './scenes/LobbyScene';
import { CustomizerScene } from './scenes/CustomizerScene';
import { multiplayerClient } from './network/MultiplayerClient';

// 9 Interactive Game Engines & 20-Level Data Sets
import { MathCastleGame } from './games/math/MathCastleGame';
import { SakuraLaunchGame, PHYSICS_LEVELS } from './games/physics/SakuraLaunchGame';
import { ColorAtelierGame, DESIGN_LEVELS } from './games/design/ColorAtelierGame';
import { NeonInterfaceGame, UI_LEVELS } from './games/ui/NeonInterfaceGame';
import { UserCafeGame, UX_LEVELS } from './games/ux/UserCafeGame';
import { StarLabGame, CHEM_LEVELS } from './games/chemistry/StarLabGame';
import { RoboMazeGame, CODE_LEVELS } from './games/code/RoboMazeGame';
import { CellForestGame, BIO_LEVELS } from './games/biology/CellForestGame';
import { SoloDungeonGame } from './games/dungeon/SoloDungeonGame';

// UI Components
import { TitleScreen } from './components/TitleScreen';
import { CustomizerUI } from './components/CustomizerUI';
import { LobbyHUD } from './components/LobbyHUD';
import { GameMathHUD } from './components/GameMathHUD';
import { MiniGameHUD } from './components/MiniGameHUD';
import { SoloDungeonHUD } from './components/SoloDungeonHUD';
import { VirtualControls } from './components/VirtualControls';
import { VictoryModal } from './components/VictoryModal';
import { SettingsModal } from './components/SettingsModal';
import { LeaderboardModal } from './components/LeaderboardModal';
import { GenshinDialogueOverlay } from './components/GenshinDialogueOverlay';
import { GAME_CATALOG, WORLD_REGIONS, WorldRegion } from './data/constants';
import { LOCALIZED_GAMES, LOCALIZED_NPCS, TRANSLATIONS, formatMsg } from './data/i18n';
import { DialogueOption, GameId, GameInfo, NpcEntity } from './types';

export default function App() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Store state
  const {
    language,
    player,
    activeScene,
    setScene,
    activeEmote,
    character,
    quality,
    bgmVolume,
    sfxVolume,
    isMuted,
    completeLevel,
    unlockBadge,
    startQuest,
    progressQuest,
    currentMathLevel,
    setCurrentMathLevel,
    gameLevelIndices,
    setGameLevelIndex,
    resetVersion,
  } = useGameStore();

  const t = TRANSLATIONS[language];

  // Active Three.js scene instances stored in ref
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const lobbySceneRef = useRef<LobbyScene | null>(null);
  const customizerSceneRef = useRef<CustomizerScene | null>(null);

  // Game Instances
  const mathGameRef = useRef<MathCastleGame | null>(null);
  const physicsGameRef = useRef<SakuraLaunchGame | null>(null);
  const designGameRef = useRef<ColorAtelierGame | null>(null);
  const uiGameRef = useRef<NeonInterfaceGame | null>(null);
  const uxGameRef = useRef<UserCafeGame | null>(null);
  const chemGameRef = useRef<StarLabGame | null>(null);
  const codeGameRef = useRef<RoboMazeGame | null>(null);
  const bioGameRef = useRef<CellForestGame | null>(null);
  const dungeonGameRef = useRef<SoloDungeonGame | null>(null);

  // React state for HUD updates
  const [nearestGate, setNearestGate] = useState<GateTrigger | null>(null);
  const [nearestGuardian, setNearestGuardian] = useState<GameInfo | null>(null);
  const [nearestWorldNpc, setNearestWorldNpc] = useState<NpcEntity | null>(null);
  const [currentRegion, setCurrentRegion] = useState<WorldRegion>(WORLD_REGIONS[0]);
  const [interactionPrompt, setInteractionPrompt] = useState<string | null>(null);
  const [isBridgeOpen, setIsBridgeOpen] = useState(false);
  const [showVictory, setShowVictory] = useState(false);
  const [victoryData, setVictoryData] = useState<{ title: string; desc: string } | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [fallToastVisible, setFallToastVisible] = useState(false);
  const [lobbySprinting, setLobbySprinting] = useState(false);

  // Refs synced with render loop to avoid stale closures inside requestAnimationFrame
  const showVictoryRef = useRef(false);
  const lobbySprintingRef = useRef(false);
  const fallToastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Genshin Impact Dialogue State
  const [activeGenshinDialogue, setActiveGenshinDialogue] = useState<{
    name: string;
    title: string;
    avatar: string;
    region?: string;
    initialDialogue: string;
    options: DialogueOption[];
    game?: GameInfo;
  } | null>(null);

  // Mini-game re-render triggers
  const [, setGameTick] = useState(0);

  useEffect(() => {
    showVictoryRef.current = showVictory;
  }, [showVictory]);

  // Initialize input and audio bindings
  useEffect(() => {
    inputManager.init();
    return () => {
      inputManager.destroy();
    };
  }, []);

  // Sync Audio Volumes with sound manager
  useEffect(() => {
    soundManager.setVolumes(bgmVolume, sfxVolume, isMuted);
  }, [bgmVolume, sfxVolume, isMuted]);

  // Connect / update Multiplayer WebSocket when entering Lobby or changing scene
  useEffect(() => {
    if (activeScene === 'lobby') {
      const lobby = lobbySceneRef.current;
      const p = lobby?.playerPosition;
      multiplayerClient.connect({
        playerName: player.playerName,
        character,
        position: p ? [p.x, p.y, p.z] : [0, 0, 4],
        rotationY: lobby?.playerRotation ?? 0,
        scene: 'lobby',
      });
    } else if (activeScene !== 'title' && activeScene !== 'customizer') {
      const lobby = lobbySceneRef.current;
      const p = lobby?.playerPosition;
      multiplayerClient.emitMove({
        position: p ? [p.x, p.y, p.z] : [0, 0, 4],
        rotationY: lobby?.playerRotation ?? 0,
        isMoving: false,
        isSprinting: false,
        isJumping: false,
        scene: activeScene,
      });
    }
  }, [activeScene, character, player.playerName]);

  // Main Three.js Engine Lifecycle
  useEffect(() => {
    if (!containerRef.current) return;

    // Detect software WebGL
    const glProbe = document.createElement('canvas').getContext('webgl2');
    const ext = glProbe?.getExtension('WEBGL_debug_renderer_info');
    const gpu = ext ? String(glProbe?.getParameter(ext.UNMASKED_RENDERER_WEBGL)) : '';
    glProbe?.getExtension('WEBGL_lose_context')?.loseContext();
    const isSoftwareGl = /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);

    // Create Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl && quality !== 'low',
      powerPreference: 'high-performance',
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(isSoftwareGl || quality === 'low' ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    renderer.shadowMap.enabled = !isSoftwareGl && quality === 'high';
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const initialStore = useGameStore.getState();

    // Initialize Models & Scenes with dedicated instances
    const lobbyPlayer = new AnimeCharacterModel(initialStore.character);
    lobbySceneRef.current = new LobbyScene(lobbyPlayer);
    lobbySceneRef.current.updateLocalization(initialStore.language, initialStore.player.playerName);
    customizerSceneRef.current = new CustomizerScene(initialStore.character);

    // Initialize all 9 Game engines (including Solo Leveling Action Dungeon)
    const mathPlayer = new AnimeCharacterModel(initialStore.character);
    mathGameRef.current = new MathCastleGame(mathPlayer, initialStore.currentMathLevel);
    physicsGameRef.current = new SakuraLaunchGame(initialStore.gameLevelIndices.physics || 0);
    designGameRef.current = new ColorAtelierGame(initialStore.gameLevelIndices.design || 0);
    uiGameRef.current = new NeonInterfaceGame(initialStore.gameLevelIndices.ui || 0);
    uxGameRef.current = new UserCafeGame(initialStore.gameLevelIndices.ux || 0);
    chemGameRef.current = new StarLabGame(initialStore.gameLevelIndices.chemistry || 0);
    codeGameRef.current = new RoboMazeGame(initialStore.gameLevelIndices.code || 0);
    bioGameRef.current = new CellForestGame(initialStore.gameLevelIndices.biology || 0);
    dungeonGameRef.current = new SoloDungeonGame(initialStore.gameLevelIndices.dungeon || 0);

    // Wire Item Pickup Collision & Void-Fall Respawn Callback in Open World
    if (lobbySceneRef.current) {
      lobbySceneRef.current.onCollectItemCallback = (type) => {
        progressQuest(type);
      };
      lobbySceneRef.current.onFallRespawnCallback = () => {
        setFallToastVisible(true);
        if (fallToastTimerRef.current) clearTimeout(fallToastTimerRef.current);
        fallToastTimerRef.current = setTimeout(() => {
          setFallToastVisible(false);
        }, 3500);
      };
    }

    // Clock
    const clock = new THREE.Clock();
    let frameId = 0;
    let lastDungeonHudTick = 0;
    let lastPhysicsTargetsHit = -1;
    let lastPhysicsSimulating = false;
    let lastChemOverload: string | null = null;
    let lastCodeExecuting = false;

    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      renderer.setSize(w, h);
      const aspect = w / h;

      [
        lobbySceneRef.current?.camera,
        customizerSceneRef.current?.camera,
        mathGameRef.current?.camera,
        physicsGameRef.current?.camera,
        designGameRef.current?.camera,
        uiGameRef.current?.camera,
        uxGameRef.current?.camera,
        chemGameRef.current?.camera,
        codeGameRef.current?.camera,
        bioGameRef.current?.camera,
        dungeonGameRef.current?.camera,
      ].forEach((cam) => {
        if (cam) {
          cam.aspect = aspect;
          cam.updateProjectionMatrix();
        }
      });
    };
    window.addEventListener('resize', handleResize);

    // Animation & Render Loop
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const delta = Math.min(clock.getDelta(), 0.05);

      const storeSnapshot = useGameStore.getState();
      const currentSceneType = storeSnapshot.activeScene;
      const currentCameraMode = storeSnapshot.cameraMode;
      const currentLang = storeSnapshot.language;

      if (currentSceneType === 'title' || currentSceneType === 'lobby') {
        const lobby = lobbySceneRef.current;
        if (lobby) {
          if (currentSceneType === 'title') {
            const time = clock.getElapsedTime() * 0.12;
            lobby.camera.position.set(Math.cos(time) * 18, 7, Math.sin(time) * 18);
            lobby.camera.lookAt(0, 1.8, 0);
            lobby.mascot.update(delta);
            lobby.playerModel.update(delta, false, false, false);
          } else {
            lobby.update(delta, currentCameraMode);

            // Sync remote multiplayer players in Lobby
            const activeRemote = multiplayerClient
              .getRemotePlayersList()
              .filter((rp) => rp.scene === 'lobby');
            lobby.syncRemotePlayers(activeRemote, delta);

            // Emit local player movement state (~20Hz throttled inside client)
            const mv = inputManager.getMovementVector();
            const pos = lobby.playerPosition;
            const floorY = lobby.getWalkableFloorHeight(pos.x, pos.z);
            const isAirborne = floorY === null ? true : pos.y > floorY + 0.15;
            multiplayerClient.emitMove({
              position: [pos.x, pos.y, pos.z],
              rotationY: lobby.playerRotation,
              isMoving: mv.isMoving && !lobby.isInDialogueMode,
              isSprinting: lobby.isCurrentlySprinting,
              isJumping: isAirborne,
              scene: 'lobby',
            });

            if (lobby.isCurrentlySprinting !== lobbySprintingRef.current) {
              lobbySprintingRef.current = lobby.isCurrentlySprinting;
              setLobbySprinting(lobby.isCurrentlySprinting);
            }

            setNearestGate(lobby.nearestGate);
            setNearestGuardian(lobby.nearestGuardian);
            setNearestWorldNpc(lobby.nearestWorldNpc);
            setCurrentRegion(lobby.currentRegion);
          }
          renderer.render(lobby.scene, lobby.camera);
        }
      } else if (currentSceneType === 'customizer') {
        const customizer = customizerSceneRef.current;
        if (customizer) {
          customizer.update(delta);
          renderer.render(customizer.scene, customizer.camera);
        }
      } else if (currentSceneType === 'game_math') {
        const mathGame = mathGameRef.current;
        if (mathGame) {
          mathGame.update(delta);
          setInteractionPrompt(mathGame.interactionPrompt);
          setIsBridgeOpen(mathGame.isBridgeOpen);

          if (mathGame.isLevelFinished && !showVictoryRef.current) {
            showVictoryRef.current = true;
            setShowVictory(true);
            setVictoryData({
              title: `Level ${mathGame.currentLevelIdx + 1}: ${mathGame.currentLevelData.title}`,
              desc: mathGame.currentLevelData.explanation,
            });
            completeLevel('math', mathGame.currentLevelIdx, 3, 100);
          }
          renderer.render(mathGame.scene, mathGame.camera);
        }
      } else if (currentSceneType === 'game_physics') {
        const g = physicsGameRef.current;
        if (g) {
          g.update(delta, currentCameraMode);
          if (g.targetsHit !== lastPhysicsTargetsHit || g.isSimulating !== lastPhysicsSimulating) {
            lastPhysicsTargetsHit = g.targetsHit;
            lastPhysicsSimulating = g.isSimulating;
            setGameTick((tick) => tick + 1);
          }
          if (g.isLevelFinished && !showVictoryRef.current) {
            showVictoryRef.current = true;
            setShowVictory(true);
            setVictoryData({
              title: `Level ${g.currentLevelIdx + 1}: ${g.currentLevelData.title}`,
              desc: g.currentLevelData.description,
            });
            completeLevel('physics', g.currentLevelIdx, 3, 100);
          }
          renderer.render(g.scene, g.camera);
        }
      } else if (currentSceneType === 'game_design') {
        const g = designGameRef.current;
        if (g) {
          g.update(delta, currentCameraMode);
          if (g.isLevelFinished && !showVictoryRef.current) {
            showVictoryRef.current = true;
            setShowVictory(true);
            setVictoryData({
              title: `Level ${g.currentLevelIdx + 1}: ${g.currentLevelData.title}`,
              desc: g.currentLevelData.description,
            });
            completeLevel('design', g.currentLevelIdx, 3, 100);
          }
          renderer.render(g.scene, g.camera);
        }
      } else if (currentSceneType === 'game_ui') {
        const g = uiGameRef.current;
        if (g) {
          g.update(delta, currentCameraMode);
          if (g.isLevelFinished && !showVictoryRef.current) {
            showVictoryRef.current = true;
            setShowVictory(true);
            setVictoryData({
              title: `Level ${g.currentLevelIdx + 1}: ${g.currentLevelData.title}`,
              desc: g.currentLevelData.description,
            });
            completeLevel('ui', g.currentLevelIdx, 3, 100);
          }
          renderer.render(g.scene, g.camera);
        }
      } else if (currentSceneType === 'game_ux') {
        const g = uxGameRef.current;
        if (g) {
          g.update(delta, currentCameraMode);
          if (g.isLevelFinished && !showVictoryRef.current) {
            showVictoryRef.current = true;
            setShowVictory(true);
            setVictoryData({
              title: `Level ${g.currentLevelIdx + 1}: ${g.currentLevelData.title}`,
              desc: g.currentLevelData.explanation,
            });
            completeLevel('ux', g.currentLevelIdx, 3, 100);
          }
          renderer.render(g.scene, g.camera);
        }
      } else if (currentSceneType === 'game_chemistry') {
        const g = chemGameRef.current;
        if (g) {
          g.update(delta, currentCameraMode);
          if (g.overloadMessage !== lastChemOverload) {
            lastChemOverload = g.overloadMessage;
            setGameTick((tick) => tick + 1);
          }
          if (g.isLevelFinished && !showVictoryRef.current) {
            showVictoryRef.current = true;
            setShowVictory(true);
            setVictoryData({
              title: `Level ${g.currentLevelIdx + 1}: ${g.currentLevelData.title}`,
              desc: g.currentLevelData.description,
            });
            completeLevel('chemistry', g.currentLevelIdx, 3, 100);
          }
          renderer.render(g.scene, g.camera);
        }
      } else if (currentSceneType === 'game_code') {
        const g = codeGameRef.current;
        if (g) {
          g.update(delta, currentCameraMode);
          if (g.isExecuting !== lastCodeExecuting) {
            lastCodeExecuting = g.isExecuting;
            setGameTick((tick) => tick + 1);
          }
          if (g.isLevelFinished && !showVictoryRef.current) {
            showVictoryRef.current = true;
            setShowVictory(true);
            setVictoryData({
              title: `Level ${g.currentLevelIdx + 1}: ${g.currentLevelData.title}`,
              desc: g.currentLevelData.description,
            });
            completeLevel('code', g.currentLevelIdx, 3, 100);
          }
          renderer.render(g.scene, g.camera);
        }
      } else if (currentSceneType === 'game_biology') {
        const g = bioGameRef.current;
        if (g) {
          g.update(delta, currentCameraMode);
          if (g.isLevelFinished && !showVictoryRef.current) {
            showVictoryRef.current = true;
            setShowVictory(true);
            setVictoryData({
              title: `Level ${g.currentLevelIdx + 1}: ${g.currentLevelData.title}`,
              desc: g.currentLevelData.description,
            });
            completeLevel('biology', g.currentLevelIdx, 3, 100);
          }
          renderer.render(g.scene, g.camera);
        }
      } else if (currentSceneType === 'game_dungeon') {
        const dg = dungeonGameRef.current;
        if (dg) {
          dg.update(delta, currentCameraMode);

          // Live HUD refresh at ~15Hz for timer, HP, MP, Boss HP, combo, & ultimate
          const now = performance.now();
          if (now - lastDungeonHudTick > 65) {
            lastDungeonHudTick = now;
            setGameTick((tick) => tick + 1);
          }

          if (dg.isLevelFinished && !showVictoryRef.current) {
            showVictoryRef.current = true;
            setShowVictory(true);
            const bossName = dg.currentLevelData.bossName;
            const localizedDungeonDesc =
              currentLang === 'en'
                ? `Victory! You defeated ${bossName} and absorbed the Shadow Monarch essence!`
                : currentLang === 'ja'
                ? `勝利！${bossName}を討伐し、影の君主の魔力を吸収した！`
                : `Selamat! Kamu menaklukkan ${bossName} dan menyerap kekuatan esensi bayangan!`;

            setVictoryData({
              title: `Level ${dg.currentLevelIdx + 1}: ${dg.currentLevelData.title}`,
              desc: localizedDungeonDesc,
            });
            completeLevel('dungeon', dg.currentLevelIdx, 3, 200);
            unlockBadge('Shadow Monarch Sovereign');
          }
          renderer.render(dg.scene, dg.camera);
        }
      }
    };

    animate();

    return () => {
      cancelAnimationFrame(frameId);
      if (fallToastTimerRef.current) clearTimeout(fallToastTimerRef.current);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, []);

  // Reset all 3D world state and 9 mini-game engines when user triggers Full Game Reset
  useEffect(() => {
    if (resetVersion === 0) return;
    const snap = useGameStore.getState();

    lobbySceneRef.current?.resetWorldState();
    lobbySceneRef.current?.playerModel.applyCustomization(snap.character);
    customizerSceneRef.current?.setCustomization(snap.character);
    mathGameRef.current?.playerModel.applyCustomization(snap.character);

    mathGameRef.current?.loadLevel(0);
    physicsGameRef.current?.loadLevel(0);
    designGameRef.current?.loadLevel(0);
    uiGameRef.current?.loadLevel(0);
    uxGameRef.current?.loadLevel(0);
    chemGameRef.current?.loadLevel(0);
    codeGameRef.current?.loadLevel(0);
    bioGameRef.current?.loadLevel(0);
    dungeonGameRef.current?.loadLevel(0);

    showVictoryRef.current = false;
    setShowVictory(false);
    setActiveGenshinDialogue(null);
    setGameTick((t) => t + 1);
  }, [resetVersion]);

  // Update Lobby 3D billboards & name tag when language or player name changes
  useEffect(() => {
    if (lobbySceneRef.current) {
      lobbySceneRef.current.updateLocalization(language, player.playerName);
    }
  }, [language, player.playerName]);

  // Update Character Model & sync Multiplayer when customization changes
  useEffect(() => {
    if (customizerSceneRef.current) {
      customizerSceneRef.current.setCustomization(character);
    }
    if (lobbySceneRef.current) {
      lobbySceneRef.current.playerModel.applyCustomization(character);
    }
    if (mathGameRef.current) {
      mathGameRef.current.playerModel.applyCustomization(character);
    }
    multiplayerClient.emitCustomize(player.playerName, character);
  }, [character, player.playerName]);

  // Update active emote on character models & broadcast to Multiplayer room
  useEffect(() => {
    if (lobbySceneRef.current) {
      lobbySceneRef.current.playerModel.setEmote(activeEmote);
    }
    if (mathGameRef.current) {
      mathGameRef.current.playerModel.setEmote(activeEmote);
    }
    multiplayerClient.emitEmote(activeEmote);
  }, [activeEmote]);

  // Enter a mini-game scene
  const handleEnterGame = useCallback(
    (game: GameInfo) => {
      soundManager.playMenuTransition();
      setActiveGenshinDialogue(null);
      lobbySceneRef.current?.exitDialogue();
      showVictoryRef.current = false;
      setShowVictory(false);

      const levelIdx = game.id === 'math' ? currentMathLevel : gameLevelIndices[game.id] || 0;

      if (game.id === 'math') {
        soundManager.startBGM('math');
        mathGameRef.current?.loadLevel(levelIdx);
        setScene('game_math');
      } else if (game.id === 'physics') {
        physicsGameRef.current?.loadLevel(levelIdx);
        physicsGameRef.current?.resetProjectile();
        setScene('game_physics');
      } else if (game.id === 'design') {
        designGameRef.current?.loadLevel(levelIdx);
        setScene('game_design');
      } else if (game.id === 'ui') {
        uiGameRef.current?.loadLevel(levelIdx);
        setScene('game_ui');
      } else if (game.id === 'ux') {
        uxGameRef.current?.loadLevel(levelIdx);
        setScene('game_ux');
      } else if (game.id === 'chemistry') {
        chemGameRef.current?.loadLevel(levelIdx);
        chemGameRef.current?.resetAtoms();
        setScene('game_chemistry');
      } else if (game.id === 'code') {
        codeGameRef.current?.loadLevel(levelIdx);
        codeGameRef.current?.clearCommands();
        setScene('game_code');
      } else if (game.id === 'biology') {
        bioGameRef.current?.loadLevel(levelIdx);
        setScene('game_biology');
      } else if (game.id === 'dungeon') {
        dungeonGameRef.current?.loadLevel(levelIdx);
        setScene('game_dungeon');
        soundManager.startBGM('dungeon');
      }
    },
    [currentMathLevel, gameLevelIndices, setScene]
  );

  // Unified Open World Interaction Handler (Guardians, World NPCs, Portal Gates)
  const handleOpenWorldInteract = useCallback(() => {
    const lang = useGameStore.getState().language;
    const dlgStrings = TRANSLATIONS[lang].dialogue;

    if (nearestGuardian) {
      const locGame = LOCALIZED_GAMES[lang][nearestGuardian.id];
      const guardianObj = lobbySceneRef.current?.guardians.find(
        (g) => g.guardian.name === nearestGuardian.guardian.name
      );
      const targetPos = guardianObj
        ? guardianObj.group.position.clone()
        : new THREE.Vector3(0, 0, 0);

      lobbySceneRef.current?.enterDialogue(targetPos);

      const rulesList = locGame?.guardianRules || nearestGuardian.guardian.rules;
      const objList = locGame?.guardianObjectives || nearestGuardian.guardian.objectives;
      const proTip = locGame?.guardianProTip || nearestGuardian.guardian.proTip;
      const greeting = locGame?.guardianGreeting || nearestGuardian.guardian.greeting;

      setActiveGenshinDialogue({
        name: nearestGuardian.guardian.name,
        title: locGame?.guardianTitle || nearestGuardian.guardian.title,
        avatar: nearestGuardian.guardian.avatar,
        region: locGame?.subject || nearestGuardian.subject,
        initialDialogue: greeting,
        options: [
          {
            label: dlgStrings.qRules,
            response: rulesList.map((r, i) => `${i + 1}. ${r}`).join(' '),
            action: 'rules',
          },
          {
            label: dlgStrings.qObjectives,
            response: objList.join(' • '),
            action: 'lore',
          },
          {
            label: dlgStrings.qTips,
            response: proTip,
            action: 'tip',
          },
          {
            label: dlgStrings.qStart,
            response: dlgStrings.qStartResponse,
            action: 'start_game',
          },
          {
            label: dlgStrings.qBye,
            response: dlgStrings.qByeResponse,
            action: 'close',
          },
        ],
        game: nearestGuardian,
      });
    } else if (nearestWorldNpc) {
      const locNpc = LOCALIZED_NPCS[lang][nearestWorldNpc.id];

      if (nearestWorldNpc.quest) {
        startQuest({
          id: nearestWorldNpc.quest.id,
          npcId: nearestWorldNpc.id,
          npcName: nearestWorldNpc.name,
          title: locNpc?.questTitle || nearestWorldNpc.quest.title,
          description: locNpc?.questDesc || nearestWorldNpc.quest.description,
          itemType: nearestWorldNpc.quest.itemType,
          targetCount: nearestWorldNpc.quest.targetCount,
          currentCount: 0,
          isCompleted: false,
          rewardBadge: nearestWorldNpc.quest.rewardBadge,
          rewardXp: nearestWorldNpc.quest.rewardXp,
        });
      }

      const npcInstance = lobbySceneRef.current?.worldNpcs.find((n) => n.entity.id === nearestWorldNpc.id);
      const npcPos = npcInstance
        ? npcInstance.group.position.clone()
        : new THREE.Vector3(nearestWorldNpc.position[0], 0, nearestWorldNpc.position[2]);

      lobbySceneRef.current?.enterDialogue(npcPos);
      setActiveGenshinDialogue({
        name: nearestWorldNpc.name,
        title: locNpc?.title || nearestWorldNpc.title,
        avatar: nearestWorldNpc.avatar,
        region: locNpc?.region || nearestWorldNpc.region,
        initialDialogue: locNpc?.initialDialogue || nearestWorldNpc.initialDialogue,
        options:
          locNpc?.options.map((opt, idx) => ({
            label: opt.label,
            response: opt.response,
            action: nearestWorldNpc.options[idx]?.action,
          })) || nearestWorldNpc.options,
      });
    } else if (nearestGate) {
      handleEnterGame(nearestGate.game);
    }
  }, [nearestGuardian, nearestWorldNpc, nearestGate, startQuest, handleEnterGame]);

  // Handle Input Action Subscriber for interact ([E])
  useEffect(() => {
    const unsub = inputManager.subscribeAction((action) => {
      if (action === 'interact') {
        soundManager.playInteract();

        if (activeScene === 'lobby') {
          handleOpenWorldInteract();
        } else if (activeScene === 'game_math' && mathGameRef.current) {
          mathGameRef.current.handleInteractAction();
        }
      }
    });
    return unsub;
  }, [activeScene, handleOpenWorldInteract]);

  // Keyboard combat bindings for Solo Leveling Dungeon
  useEffect(() => {
    if (activeScene !== 'game_dungeon') return;
    const handleCombatKey = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;
      if (e.key === 'j' || e.key === 'J') {
        dungeonGameRef.current?.attackSword();
        setGameTick((tick) => tick + 1);
      } else if (e.key === 'k' || e.key === 'K') {
        dungeonGameRef.current?.castMagic();
        setGameTick((tick) => tick + 1);
      } else if (e.code === 'Space') {
        e.preventDefault();
        dungeonGameRef.current?.dash();
        setGameTick((tick) => tick + 1);
      } else if (e.key === 'q' || e.key === 'Q') {
        dungeonGameRef.current?.castUltimate();
        setGameTick((tick) => tick + 1);
      } else if (e.key === '1') {
        dungeonGameRef.current?.castSkill1();
        setGameTick((tick) => tick + 1);
      } else if (e.key === '2') {
        dungeonGameRef.current?.castSkill2();
        setGameTick((tick) => tick + 1);
      } else if (e.key === '3') {
        dungeonGameRef.current?.castSkill3();
        setGameTick((tick) => tick + 1);
      }
    };
    window.addEventListener('keydown', handleCombatKey);
    return () => window.removeEventListener('keydown', handleCombatKey);
  }, [activeScene]);

  // Level Selection across all 9 games (1 to 20)
  const handleSelectGameLevel = (gameId: GameId, lvlIdx: number) => {
    soundManager.playLevelSwitch();
    setGameLevelIndex(gameId, lvlIdx);

    if (gameId === 'math') {
      setCurrentMathLevel(lvlIdx);
      mathGameRef.current?.loadLevel(lvlIdx);
    } else if (gameId === 'physics') {
      physicsGameRef.current?.loadLevel(lvlIdx);
    } else if (gameId === 'design') {
      designGameRef.current?.loadLevel(lvlIdx);
    } else if (gameId === 'ui') {
      uiGameRef.current?.loadLevel(lvlIdx);
    } else if (gameId === 'ux') {
      uxGameRef.current?.loadLevel(lvlIdx);
    } else if (gameId === 'chemistry') {
      chemGameRef.current?.loadLevel(lvlIdx);
    } else if (gameId === 'code') {
      codeGameRef.current?.loadLevel(lvlIdx);
    } else if (gameId === 'biology') {
      bioGameRef.current?.loadLevel(lvlIdx);
    } else if (gameId === 'dungeon') {
      dungeonGameRef.current?.loadLevel(lvlIdx);
    }

    setGameTick((tick) => tick + 1);
    showVictoryRef.current = false;
    setShowVictory(false);
  };

  // Advance to next level
  const handleNextLevel = () => {
    soundManager.playLevelSwitch();
    const currentMiniGame = GAME_CATALOG.find((g) => g.sceneName === activeScene);
    if (currentMiniGame) {
      const curIdx = currentMiniGame.id === 'math' ? currentMathLevel : gameLevelIndices[currentMiniGame.id] || 0;
      const nextIdx = curIdx + 1;
      if (nextIdx < 20) {
        handleSelectGameLevel(currentMiniGame.id, nextIdx);
      } else {
        // Mastered all 20 levels!
        setScene('lobby');
        soundManager.startBGM('lobby');
        soundManager.playLevelVictory();
        showVictoryRef.current = false;
        setShowVictory(false);
      }
    } else {
      setScene('lobby');
      soundManager.startBGM('lobby');
      showVictoryRef.current = false;
      setShowVictory(false);
    }
  };

  // Fast travel teleport in open world
  const handleFastTravel = (region: WorldRegion) => {
    if (lobbySceneRef.current) {
      lobbySceneRef.current.teleportPlayerTo(region.center[0], region.center[1]);
      setCurrentRegion(region);
    }
  };

  // Find active game info if in a mini-game
  const activeMiniGame = GAME_CATALOG.find((g) => g.sceneName === activeScene);

  // Helper for active level metadata
  const getActiveGameLevelData = () => {
    if (!activeMiniGame) return { title: '', desc: '' };
    const idx = gameLevelIndices[activeMiniGame.id] || 0;
    switch (activeMiniGame.id) {
      case 'physics':
        return { title: PHYSICS_LEVELS[idx]?.title, desc: PHYSICS_LEVELS[idx]?.description };
      case 'design':
        return { title: DESIGN_LEVELS[idx]?.title, desc: DESIGN_LEVELS[idx]?.description };
      case 'ui':
        return { title: UI_LEVELS[idx]?.title, desc: UI_LEVELS[idx]?.description };
      case 'ux':
        return { title: UX_LEVELS[idx]?.title, desc: UX_LEVELS[idx]?.explanation };
      case 'chemistry':
        return { title: CHEM_LEVELS[idx]?.title, desc: CHEM_LEVELS[idx]?.description };
      case 'code':
        return { title: CODE_LEVELS[idx]?.title, desc: CODE_LEVELS[idx]?.description };
      case 'biology':
        return { title: BIO_LEVELS[idx]?.title, desc: BIO_LEVELS[idx]?.description };
      default:
        return { title: '', desc: '' };
    }
  };

  const activeLevelMeta = getActiveGameLevelData();

  const lobbyInteractionPrompt = nearestGuardian
    ? formatMsg(t.lobby.speakPrompt, { name: nearestGuardian.guardian.name })
    : nearestWorldNpc
    ? formatMsg(t.lobby.speakPrompt, { name: nearestWorldNpc.name })
    : nearestGate
    ? formatMsg(t.lobby.enterPrompt, {
        title: LOCALIZED_GAMES[language][nearestGate.game.id]?.title || nearestGate.game.title,
      })
    : null;

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#150724] select-none">
      {/* 3D WebGL Canvas Viewport */}
      <div
        ref={containerRef}
        className="absolute inset-0 w-full h-full z-0 cursor-grab active:cursor-grabbing touch-none"
      />

      {/* Fall-from-island Safe Respawn Toast */}
      {fallToastVisible && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-rose-950/95 border-2 border-rose-400 text-rose-100 px-5 py-2.5 rounded-2xl shadow-2xl font-display font-bold text-xs md:text-sm backdrop-blur-md animate-scale-up pointer-events-none">
          ⚠️ {t.lobby.fallRespawnToast}
        </div>
      )}

      {/* Title Screen Overlay */}
      {activeScene === 'title' && (
        <TitleScreen
          onOpenSettings={() => {
            soundManager.playMenuTransition();
            setShowSettings(true);
          }}
          onOpenLeaderboard={() => {
            soundManager.playMenuTransition();
            setShowLeaderboard(true);
          }}
        />
      )}

      {/* Character Customizer Overlay */}
      {activeScene === 'customizer' && (
        <CustomizerUI
          onBack={() => {
            soundManager.playMenuTransition();
            setScene('title');
            soundManager.startBGM('lobby');
          }}
          onEnterLobby={() => {
            soundManager.playMenuTransition();
            setScene('lobby');
            soundManager.startBGM('lobby');
          }}
          onRotateTurntable={(deltaX) => {
            customizerSceneRef.current?.rotateManual(deltaX);
          }}
        />
      )}

      {/* Lobby Open World HUD Overlay */}
      {activeScene === 'lobby' && (
        <>
          <LobbyHUD
            nearestGate={nearestGate}
            nearestGuardian={nearestGuardian}
            nearestWorldNpc={nearestWorldNpc}
            currentRegion={currentRegion}
            isSprinting={lobbySprinting}
            onEnterGame={(gate) => handleEnterGame(gate.game)}
            onInteractNpcOrGuardian={handleOpenWorldInteract}
            onFastTravel={handleFastTravel}
            onOpenSettings={() => {
              soundManager.playMenuTransition();
              setShowSettings(true);
            }}
            onOpenLeaderboard={() => {
              soundManager.playMenuTransition();
              setShowLeaderboard(true);
            }}
          />
          <VirtualControls
            interactionPrompt={lobbyInteractionPrompt}
            onAction={(action) => {
              if (action === 'interact') {
                soundManager.playInteract();
                handleOpenWorldInteract();
              }
            }}
          />
        </>
      )}

      {/* Math Castle Game HUD Overlay */}
      {activeScene === 'game_math' && mathGameRef.current && (
        <>
          <GameMathHUD
            levelData={mathGameRef.current.currentLevelData}
            levelIndex={mathGameRef.current.currentLevelIdx}
            placedBlocks={mathGameRef.current.placedBlocks}
            isBridgeOpen={isBridgeOpen}
            interactionPrompt={interactionPrompt}
            onSelectLevel={(idx) => handleSelectGameLevel('math', idx)}
            onExitToLobby={() => {
              soundManager.playMenuTransition();
              setScene('lobby');
              soundManager.startBGM('lobby');
              showVictoryRef.current = false;
              setShowVictory(false);
            }}
            onTriggerInteract={() => {
              mathGameRef.current?.handleInteractAction();
            }}
          />
          <VirtualControls
            interactionPrompt={interactionPrompt}
            onAction={(action) => {
              if (action === 'interact') {
                mathGameRef.current?.handleInteractAction();
              }
            }}
          />
        </>
      )}

      {/* Other 7 Mini-Games HUD Overlay with 20 Levels */}
      {activeMiniGame && activeMiniGame.id !== 'math' && activeMiniGame.id !== 'dungeon' && (
        <MiniGameHUD
          game={activeMiniGame}
          currentLevelIdx={gameLevelIndices[activeMiniGame.id] || 0}
          totalLevels={20}
          levelTitle={activeLevelMeta.title}
          levelDescription={activeLevelMeta.desc}
          onSelectLevel={(idx) => handleSelectGameLevel(activeMiniGame.id, idx)}
          onExit={() => {
            soundManager.playMenuTransition();
            setScene('lobby');
            soundManager.startBGM('lobby');
            showVictoryRef.current = false;
            setShowVictory(false);
          }}
          physicsData={
            activeMiniGame.id === 'physics' && physicsGameRef.current
              ? {
                  angle: physicsGameRef.current.angleDegrees,
                  power: physicsGameRef.current.power,
                  gravity: physicsGameRef.current.gravity,
                  wind: physicsGameRef.current.windAcceleration,
                  targetsHit: physicsGameRef.current.targetsHit,
                  totalTargets: physicsGameRef.current.totalTargets,
                  planetName: physicsGameRef.current.currentLevelData.planet,
                  onSetAngle: (a) => {
                    physicsGameRef.current?.setAngle(a);
                    setGameTick((tick) => tick + 1);
                  },
                  onSetPower: (p) => {
                    physicsGameRef.current?.setPower(p);
                    setGameTick((tick) => tick + 1);
                  },
                  onSetGravity: (g) => {
                    physicsGameRef.current?.setGravity(g);
                    setGameTick((tick) => tick + 1);
                  },
                  onLaunch: () => {
                    physicsGameRef.current?.launch();
                    setGameTick((tick) => tick + 1);
                  },
                }
              : undefined
          }
          designData={
            activeMiniGame.id === 'design' && designGameRef.current
              ? {
                  baseHue: designGameRef.current.baseHue,
                  accentHue: designGameRef.current.accentHue,
                  rule: designGameRef.current.currentHarmonyRule,
                  targetRule: designGameRef.current.currentLevelData.rule,
                  targetBaseHue: designGameRef.current.currentLevelData.targetBaseHue,
                  score: designGameRef.current.harmonyScore,
                  onSetBase: (h) => {
                    designGameRef.current?.setBaseHue(h);
                    setGameTick((tick) => tick + 1);
                  },
                  onSetAccent: (h) => {
                    designGameRef.current?.setAccentHue(h);
                    setGameTick((tick) => tick + 1);
                  },
                  onSetRule: (r) => {
                    designGameRef.current?.setHarmonyRule(r);
                    setGameTick((tick) => tick + 1);
                  },
                }
              : undefined
          }
          uiData={
            activeMiniGame.id === 'ui' && uiGameRef.current
              ? {
                  alignments: uiGameRef.current.cardAlignments,
                  cardLabels: uiGameRef.current.currentLevelData.cards.map((c) => c.label),
                  onNudge: (idx, delta) => {
                    uiGameRef.current?.nudgeCard(idx, delta);
                    setGameTick((tick) => tick + 1);
                  },
                }
              : undefined
          }
          uxData={
            activeMiniGame.id === 'ux' && uxGameRef.current
              ? {
                  steps: uxGameRef.current.journeySteps,
                  persona: uxGameRef.current.currentLevelData.persona,
                  satisfaction: uxGameRef.current.satisfaction,
                  options: uxGameRef.current.uxOptions,
                  onToggleFix: (idx) => {
                    uxGameRef.current?.toggleFix(idx);
                    setGameTick((tick) => tick + 1);
                  },
                }
              : undefined
          }
          chemData={
            activeMiniGame.id === 'chemistry' && chemGameRef.current
              ? {
                  atoms: chemGameRef.current.selectedAtoms,
                  formula: chemGameRef.current.currentLevelData.formula,
                  targetMolecule: chemGameRef.current.currentLevelData.title,
                  requiredAtoms: chemGameRef.current.requiredAtoms,
                  overloadMessage: chemGameRef.current.overloadMessage,
                  onAddAtom: (sym) => {
                    chemGameRef.current?.addAtom(sym);
                    setGameTick((tick) => tick + 1);
                  },
                  onReset: () => {
                    chemGameRef.current?.resetAtoms();
                    setGameTick((tick) => tick + 1);
                  },
                }
              : undefined
          }
          codeData={
            activeMiniGame.id === 'code' && codeGameRef.current
              ? {
                  commands: codeGameRef.current.commandQueue,
                  onAddCommand: (c) => {
                    codeGameRef.current?.addCommand(c);
                    setGameTick((tick) => tick + 1);
                  },
                  onClear: () => {
                    codeGameRef.current?.clearCommands();
                    setGameTick((tick) => tick + 1);
                  },
                  onExecute: () => {
                    codeGameRef.current?.executeCode();
                    setGameTick((tick) => tick + 1);
                  },
                }
              : undefined
          }
          bioData={
            activeMiniGame.id === 'biology' && bioGameRef.current
              ? {
                  collected: bioGameRef.current.photonsCollected,
                  targetCount: bioGameRef.current.targetPhotons,
                  organelle: bioGameRef.current.currentLevelData.organelle,
                  nodes: bioGameRef.current.bioNodes,
                  onCollect: (id) => {
                    bioGameRef.current?.collectNode(id);
                    setGameTick((tick) => tick + 1);
                  },
                }
              : undefined
          }
        />
      )}

      {/* Solo Leveling 20-Level Action Dungeon HUD Overlay */}
      {activeScene === 'game_dungeon' && dungeonGameRef.current && (
        <SoloDungeonHUD
          levelData={dungeonGameRef.current.currentLevelData}
          levelIndex={gameLevelIndices.dungeon || 0}
          playerHp={dungeonGameRef.current.playerHp}
          playerMaxHp={dungeonGameRef.current.playerMaxHp}
          playerMp={dungeonGameRef.current.playerMp}
          playerMaxMp={dungeonGameRef.current.playerMaxMp}
          bossHp={dungeonGameRef.current.bossHp}
          bossMaxHp={dungeonGameRef.current.bossMaxHp}
          minionsKilled={dungeonGameRef.current.minionsKilled}
          isUltimateReady={dungeonGameRef.current.isUltimateReady}
          isGameOver={dungeonGameRef.current.isGameOver}
          comboCount={dungeonGameRef.current.comboCount}
          elapsedTime={dungeonGameRef.current.elapsedTime}
          onAttackSword={() => {
            dungeonGameRef.current?.attackSword();
            setGameTick((tick) => tick + 1);
          }}
          onCastMagic={() => {
            dungeonGameRef.current?.castMagic();
            setGameTick((tick) => tick + 1);
          }}
          onDash={() => {
            dungeonGameRef.current?.dash();
            setGameTick((tick) => tick + 1);
          }}
          onCastSkill1={() => {
            dungeonGameRef.current?.castSkill1();
            setGameTick((tick) => tick + 1);
          }}
          onCastSkill2={() => {
            dungeonGameRef.current?.castSkill2();
            setGameTick((tick) => tick + 1);
          }}
          onCastSkill3={() => {
            dungeonGameRef.current?.castSkill3();
            setGameTick((tick) => tick + 1);
          }}
          onCastUltimate={() => {
            dungeonGameRef.current?.castUltimate();
            setGameTick((tick) => tick + 1);
          }}
          onSelectLevel={(idx) => handleSelectGameLevel('dungeon', idx)}
          onRetryLevel={() => {
            dungeonGameRef.current?.retryLevel();
            setGameTick((tick) => tick + 1);
          }}
          onExitToLobby={() => {
            soundManager.playMenuTransition();
            setScene('lobby');
            soundManager.startBGM('lobby');
            showVictoryRef.current = false;
            setShowVictory(false);
          }}
        />
      )}

      {/* Level Victory Celebration Modal */}
      {showVictory && victoryData && (
        <VictoryModal
          title={victoryData.title}
          explanation={victoryData.desc}
          starsEarned={3}
          xpEarned={120}
          isLastLevel={
            activeScene === 'game_math'
              ? currentMathLevel >= 19
              : (gameLevelIndices[activeMiniGame?.id || 'physics'] || 0) >= 19
          }
          onNextLevel={handleNextLevel}
          onExitLobby={() => {
            soundManager.playMenuTransition();
            setScene('lobby');
            soundManager.startBGM('lobby');
            showVictoryRef.current = false;
            setShowVictory(false);
          }}
        />
      )}

      {/* Genshin Impact Interactive Dialogue Overlay */}
      {activeGenshinDialogue && (
        <GenshinDialogueOverlay
          target={activeGenshinDialogue}
          onStartGame={(g) => handleEnterGame(g)}
          onClose={() => {
            lobbySceneRef.current?.exitDialogue();
            setActiveGenshinDialogue(null);
          }}
        />
      )}

      {/* Settings Modal */}
      {showSettings && (
        <SettingsModal
          onClose={() => {
            soundManager.playClick();
            setShowSettings(false);
          }}
        />
      )}

      {/* Leaderboard & Badges Modal */}
      {showLeaderboard && (
        <LeaderboardModal
          onClose={() => {
            soundManager.playClick();
            setShowLeaderboard(false);
          }}
        />
      )}
    </div>
  );
}
