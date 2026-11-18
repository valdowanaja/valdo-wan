/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as THREE from 'three';
import { NpcEntity } from '../types';
import {
  createSunburstEmblemTexture,
  createToonGradientTexture,
} from '../core/ProceduralTextures';
import {
  attachPrettyAnimeFace,
  createSculptedAnimeHeadGeometry,
} from './AnimeFaceBuilder';

const _tempDir = new THREE.Vector3();

export class WorldNPC {
  public group: THREE.Group;
  public entity: NpcEntity;
  private homePosition: THREE.Vector3;
  private wanderRadius: number;
  private wanderTarget: THREE.Vector3;
  private wanderPauseTimer = Math.random() * 2.5;
  private wanderWalkTime = 0;

  private headGroup: THREE.Group;
  private rightArm: THREE.Group;
  private leftArm: THREE.Group;
  private leftLeg: THREE.Group;
  private rightLeg: THREE.Group;
  private haloGroup: THREE.Group;
  private leftWing: THREE.Mesh;
  private rightWing: THREE.Mesh;
  private leftEyeMesh: THREE.Mesh;
  private rightEyeMesh: THREE.Mesh;
  private blinkTimer = 1.8 + Math.random() * 2.8;
  private idleTime = Math.random() * 5;
  public isPlayerNear = false;
  private isSocializing = false;
  private socialPartnerPos: THREE.Vector3 | null = null;
  private socialCooldown = 0;

  private billboardMesh: THREE.Mesh;
  private chatBubbleMesh: THREE.Mesh;

  constructor(entity: NpcEntity) {
    this.entity = entity;
    this.group = new THREE.Group();
    this.group.position.set(entity.position[0], entity.position[1], entity.position[2]);
    if (entity.rotationY !== undefined) {
      this.group.rotation.y = entity.rotationY;
    }

    this.homePosition = new THREE.Vector3(entity.position[0], entity.position[1], entity.position[2]);
    this.wanderRadius = entity.wanderRadius ?? 5.0;
    this.wanderTarget = this.homePosition.clone();

    const toonRamp = createToonGradientTexture(3);

    const armorMat = new THREE.MeshStandardMaterial({
      color: entity.outfitColor,
      metalness: 0.38,
      roughness: 0.32,
    });
    const tabardMat = new THREE.MeshToonMaterial({
      color: '#f8fafc',
      gradientMap: toonRamp,
      side: THREE.DoubleSide,
    });
    const accentMat = new THREE.MeshToonMaterial({
      color: entity.accessoryColor,
      gradientMap: toonRamp,
    });
    const skinMat = new THREE.MeshToonMaterial({
      color: '#ffe4d6',
      gradientMap: toonRamp,
    });
    const underSuitMat = new THREE.MeshToonMaterial({
      color: '#1e1b2e',
      gradientMap: toonRamp,
    });
    const goldMat = new THREE.MeshStandardMaterial({
      color: '#fde047',
      emissive: '#f59e0b',
      emissiveIntensity: 0.3,
      metalness: 0.6,
      roughness: 0.25,
    });

    // 1. Armored Knight Torso + Chest Crest + Side-Slit Battle Skirt
    const chest = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.17, 0.35, 12), armorMat);
    chest.position.y = 1.1;
    chest.castShadow = true;
    this.group.add(chest);

    const waist = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.195, 0.2, 12), armorMat);
    waist.position.y = 0.87;
    waist.castShadow = true;
    this.group.add(waist);

    const emblemTex = createSunburstEmblemTexture(entity.accessoryColor || '#facc15');
    const crest = new THREE.Mesh(
      new THREE.PlaneGeometry(0.19, 0.19),
      new THREE.MeshBasicMaterial({ map: emblemTex, transparent: true, depthWrite: false })
    );
    crest.position.set(0, 1.12, 0.215);
    this.group.add(crest);

    const skirt = new THREE.Mesh(
      new THREE.CylinderGeometry(0.195, 0.38, 0.66, 16, 1, true, Math.PI * 0.22, Math.PI * 1.48),
      tabardMat
    );
    skirt.position.y = 0.52;
    skirt.castShadow = true;
    this.group.add(skirt);

    // Subtle Angelic Wings on WorldNPCs to match hero aesthetic
    const wingMat = new THREE.MeshStandardMaterial({
      color: entity.accessoryColor || '#fef08a',
      emissive: entity.outfitColor,
      emissiveIntensity: 0.22,
      roughness: 0.4,
      transparent: true,
      opacity: 0.82,
      side: THREE.DoubleSide,
    });
    const wingGeo = new THREE.ConeGeometry(0.2, 0.72, 5);
    wingGeo.scale(0.18, 1, 0.8);
    this.leftWing = new THREE.Mesh(wingGeo, wingMat);
    this.leftWing.position.set(-0.3, 1.24, -0.18);
    this.leftWing.rotation.set(-0.15, 0.25, 0.65);
    this.rightWing = new THREE.Mesh(wingGeo, wingMat);
    this.rightWing.position.set(0.3, 1.24, -0.18);
    this.rightWing.rotation.set(-0.15, -0.25, -0.65);
    this.group.add(this.leftWing, this.rightWing);

    // 2. Legs (Dark Tights + Silver Knee Guard + Silver Greave + Boot)
    const makeLeg = () => {
      const leg = new THREE.Group();
      const thigh = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.068, 0.26, 8), underSuitMat);
      thigh.position.y = -0.13;
      const knee = new THREE.Mesh(new THREE.SphereGeometry(0.068, 8, 8), armorMat);
      knee.position.set(0, -0.28, 0.03);
      const shin = new THREE.Mesh(new THREE.CylinderGeometry(0.068, 0.055, 0.26, 8), armorMat);
      shin.position.y = -0.43;
      const boot = new THREE.Mesh(new THREE.BoxGeometry(0.105, 0.08, 0.16), armorMat);
      boot.position.set(0, -0.57, 0.025);
      leg.add(thigh, knee, shin, boot);
      return leg;
    };

    this.leftLeg = makeLeg();
    this.leftLeg.position.set(-0.12, 0.62, 0);
    this.rightLeg = makeLeg();
    this.rightLeg.position.set(0.12, 0.62, 0);
    this.group.add(this.leftLeg, this.rightLeg);

    // 3. Head Group (Sculpted V-Line Anime Face + Pretty Expressive Features + Special Hats)
    this.headGroup = new THREE.Group();
    this.headGroup.position.y = 1.56;

    const headGeo = createSculptedAnimeHeadGeometry(0.27);
    const head = new THREE.Mesh(headGeo, skinMat);
    head.castShadow = true;
    this.headGroup.add(head);

    const faceRig = attachPrettyAnimeFace(this.headGroup, {
      headRadius: 0.27,
      eyeColor: entity.accessoryColor || '#facc15',
      pupilColor: '#92400e',
      browColor: '#64748b',
      blushColor: '#fb7185',
      skinColor: '#ffe4d6',
      expression: 'smile',
    });
    this.leftEyeMesh = faceRig.leftEyeMesh;
    this.rightEyeMesh = faceRig.rightEyeMesh;

    // Base Layered Anime Hair
    const hairCap = new THREE.Mesh(
      new THREE.SphereGeometry(0.292, 14, 14, 0, Math.PI * 2, 0, Math.PI * 0.62),
      accentMat
    );
    hairCap.position.y = 0.025;
    this.headGroup.add(hairCap);

    [-0.135, -0.035, 0.055, 0.14].forEach((bx, idx) => {
      const bang = new THREE.Mesh(new THREE.ConeGeometry(0.056, 0.18, 6), accentMat);
      bang.rotation.x = Math.PI + 0.28;
      bang.rotation.z = idx < 2 ? 0.24 : -0.24;
      bang.position.set(bx, 0.165, 0.235);
      this.headGroup.add(bang);
    });

    const backCape = new THREE.Mesh(new THREE.ConeGeometry(0.28, 0.72, 8), accentMat);
    backCape.scale.set(1.05, 1, 0.45);
    backCape.position.set(0, -0.26, -0.19);
    backCape.rotation.x = 0.2;
    this.headGroup.add(backCape);

    // Role-specific signature hats for Wizard & Cowboy
    if (entity.id === 'wizard') {
      const brim = new THREE.Mesh(new THREE.CylinderGeometry(0.46, 0.46, 0.04, 16), armorMat);
      brim.position.y = 0.22;
      const cone = new THREE.Mesh(new THREE.ConeGeometry(0.25, 0.54, 12), accentMat);
      cone.position.y = 0.48;
      this.headGroup.add(brim, cone);
    } else if (entity.id === 'cowboy') {
      const brim = new THREE.Mesh(new THREE.CylinderGeometry(0.48, 0.48, 0.04, 16), armorMat);
      brim.position.y = 0.2;
      const crown = new THREE.Mesh(new THREE.CylinderGeometry(0.21, 0.24, 0.22, 12), armorMat);
      crown.position.y = 0.31;
      const band = new THREE.Mesh(new THREE.CylinderGeometry(0.23, 0.24, 0.05, 12), goldMat);
      band.position.y = 0.24;
      this.headGroup.add(brim, crown, band);
    }

    // Subtle Halo on Sky Sanctuary Citizens
    this.haloGroup = new THREE.Group();
    this.haloGroup.position.set(0, 0.42, -0.02);
    if (entity.id !== 'wizard' && entity.id !== 'cowboy') {
      const haloRing = new THREE.Mesh(new THREE.TorusGeometry(0.2, 0.018, 8, 20), goldMat);
      haloRing.rotation.x = Math.PI * 0.5;
      this.haloGroup.add(haloRing);
    }
    this.headGroup.add(this.haloGroup);

    this.group.add(this.headGroup);

    // 4. Arms (Silver Pauldron + Dark Sleeve + Silver Vambrace)
    const buildArm = (side: number) => {
      const armGrp = new THREE.Group();
      const pauldron = new THREE.Mesh(
        new THREE.SphereGeometry(0.098, 10, 8, 0, Math.PI * 2, 0, Math.PI * 0.6),
        armorMat
      );
      pauldron.position.set(side * 0.015, 0.01, 0);
      const sleeve = new THREE.Mesh(new THREE.CylinderGeometry(0.058, 0.052, 0.17, 8), underSuitMat);
      sleeve.position.y = -0.1;
      const vambrace = new THREE.Mesh(new THREE.CylinderGeometry(0.066, 0.05, 0.17, 8), armorMat);
      vambrace.position.y = -0.23;
      const glove = new THREE.Mesh(new THREE.SphereGeometry(0.048, 8, 8), underSuitMat);
      glove.position.y = -0.34;
      armGrp.add(pauldron, sleeve, vambrace, glove);
      return armGrp;
    };

    this.leftArm = buildArm(-1);
    this.leftArm.position.set(-0.29, 1.22, 0);
    this.group.add(this.leftArm);

    this.rightArm = buildArm(1);
    this.rightArm.position.set(0.29, 1.22, 0);
    this.group.add(this.rightArm);

    // 5. Overhead Name Billboard
    this.billboardMesh = this.createNameBillboard(this.entity.title, this.entity.name);
    this.billboardMesh.position.y = 2.48;
    this.group.add(this.billboardMesh);

    // 6. Floating Chat Bubble Icon when socializing with another NPC
    this.chatBubbleMesh = this.createChatBubble();
    this.chatBubbleMesh.position.set(0.55, 2.05, 0);
    this.chatBubbleMesh.visible = false;
    this.group.add(this.chatBubbleMesh);
  }

  private createNameBillboard(titleText: string, nameText: string): THREE.Mesh {
    const canvas = document.createElement('canvas');
    canvas.width = 440;
    canvas.height = 128;
    const ctx = canvas.getContext('2d')!;

    ctx.fillStyle = 'rgba(16, 24, 39, 0.92)';
    ctx.beginPath();
    ctx.roundRect(8, 8, 424, 112, 24);
    ctx.fill();

    ctx.strokeStyle = this.entity.outfitColor || '#f59e0b';
    ctx.lineWidth = 6;
    ctx.stroke();

    ctx.fillStyle = this.entity.accessoryColor || '#38bdf8';
    ctx.font = 'bold 21px "Fredoka", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`${this.entity.avatar} ${titleText.toUpperCase()}`, 220, 44);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 34px "Fredoka", sans-serif';
    ctx.fillText(nameText, 220, 88);

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;

    return new THREE.Mesh(
      new THREE.PlaneGeometry(2.15, 0.65),
      new THREE.MeshBasicMaterial({ map: texture, transparent: true, side: THREE.DoubleSide })
    );
  }

  private createChatBubble(): THREE.Mesh {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d')!;

    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
    ctx.beginPath();
    ctx.roundRect(14, 24, 100, 72, 26);
    ctx.fill();

    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 6;
    ctx.stroke();

    ctx.fillStyle = '#ec4899';
    ctx.font = 'bold 42px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('💬', 64, 62);

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;

    return new THREE.Mesh(
      new THREE.PlaneGeometry(0.55, 0.55),
      new THREE.MeshBasicMaterial({ map: tex, transparent: true, side: THREE.DoubleSide })
    );
  }

  public updateLocalizedBillboard(localizedTitle: string) {
    const newMesh = this.createNameBillboard(localizedTitle, this.entity.name);
    const oldMat = this.billboardMesh.material as THREE.MeshBasicMaterial;
    const newMat = newMesh.material as THREE.MeshBasicMaterial;
    if (oldMat.map) oldMat.map.dispose();
    oldMat.map = newMat.map;
    oldMat.needsUpdate = true;
    newMesh.geometry.dispose();
  }

  public setPlayerNear(isNear: boolean) {
    this.isPlayerNear = isNear;
  }

  public setSocialInteraction(partnerPos: THREE.Vector3 | null) {
    this.isSocializing = !!partnerPos;
    this.socialPartnerPos = partnerPos;
  }

  private pickNewWanderTarget() {
    const angle = Math.random() * Math.PI * 2;
    const dist = 1.5 + Math.random() * Math.max(1, this.wanderRadius - 1.5);
    this.wanderTarget.set(
      this.homePosition.x + Math.cos(angle) * dist,
      this.homePosition.y,
      this.homePosition.z + Math.sin(angle) * dist
    );
  }

  public update(delta: number, playerPos?: THREE.Vector3, cameraQuaternion?: THREE.Quaternion) {
    this.idleTime += delta;
    if (this.socialCooldown > 0) this.socialCooldown -= delta;

    // Natural eye blinking
    this.blinkTimer -= delta;
    if (this.blinkTimer <= 0) {
      this.leftEyeMesh.scale.y = 0.08;
      this.rightEyeMesh.scale.y = 0.08;
      if (this.blinkTimer <= -0.12) {
        this.leftEyeMesh.scale.y = 1.0;
        this.rightEyeMesh.scale.y = 1.0;
        this.blinkTimer = 2.4 + Math.random() * 3.5;
      }
    }

    this.headGroup.position.y = 1.56 + Math.sin(this.idleTime * 2) * 0.02;
    this.haloGroup.rotation.y += delta * 0.5;
    const flap = Math.sin(this.idleTime * 2.8) * 0.08;
    this.leftWing.rotation.y = 0.25 + flap;
    this.rightWing.rotation.y = -0.25 - flap;

    if (cameraQuaternion) {
      this.billboardMesh.quaternion.copy(cameraQuaternion);
      this.chatBubbleMesh.quaternion.copy(cameraQuaternion);
    }

    let isWalking = false;

    if (this.isPlayerNear && playerPos) {
      this.chatBubbleMesh.visible = false;
      _tempDir.subVectors(playerPos, this.group.position);
      const angle = Math.atan2(_tempDir.x, _tempDir.z);
      let diff = angle - this.group.rotation.y;
      while (diff < -Math.PI) diff += Math.PI * 2;
      while (diff > Math.PI) diff -= Math.PI * 2;
      this.group.rotation.y += diff * Math.min(delta * 8, 1);

      this.rightArm.rotation.x = Math.PI * 0.65;
      this.rightArm.rotation.z = -0.3 + Math.sin(this.idleTime * 4) * 0.35;
      this.leftArm.rotation.x = THREE.MathUtils.damp(this.leftArm.rotation.x, 0, 5, delta);
    } else if (this.isSocializing && this.socialPartnerPos) {
      this.chatBubbleMesh.visible = true;
      this.chatBubbleMesh.position.y = 2.05 + Math.sin(this.idleTime * 4) * 0.08;

      _tempDir.subVectors(this.socialPartnerPos, this.group.position);
      const angle = Math.atan2(_tempDir.x, _tempDir.z);
      let diff = angle - this.group.rotation.y;
      while (diff < -Math.PI) diff += Math.PI * 2;
      while (diff > Math.PI) diff -= Math.PI * 2;
      this.group.rotation.y += diff * Math.min(delta * 6, 1);

      this.rightArm.rotation.x = 0.55 + Math.sin(this.idleTime * 6) * 0.25;
      this.rightArm.rotation.z = -0.2;
      this.leftArm.rotation.x = 0.4 + Math.cos(this.idleTime * 5) * 0.2;
      this.headGroup.rotation.x = Math.sin(this.idleTime * 3.5) * 0.1;
    } else {
      this.chatBubbleMesh.visible = false;
      this.headGroup.rotation.x = THREE.MathUtils.damp(this.headGroup.rotation.x, 0, 6, delta);

      if (this.wanderPauseTimer > 0) {
        this.wanderPauseTimer -= delta;
        if (this.wanderPauseTimer <= 0) {
          this.pickNewWanderTarget();
        }
      } else {
        _tempDir.subVectors(this.wanderTarget, this.group.position);
        _tempDir.y = 0;
        const dist = _tempDir.length();
        if (dist < 0.35) {
          this.wanderPauseTimer = 2.0 + Math.random() * 3.5;
        } else {
          isWalking = true;
          _tempDir.normalize();
          const walkSpeed = 1.45;
          this.group.position.addScaledVector(_tempDir, walkSpeed * delta);

          const targetRot = Math.atan2(_tempDir.x, _tempDir.z);
          let diff = targetRot - this.group.rotation.y;
          while (diff < -Math.PI) diff += Math.PI * 2;
          while (diff > Math.PI) diff -= Math.PI * 2;
          this.group.rotation.y += diff * Math.min(delta * 6, 1);
        }
      }
    }

    if (isWalking) {
      this.wanderWalkTime += delta * 6.5;
      const swing = Math.sin(this.wanderWalkTime) * 0.48;
      this.leftLeg.rotation.x = swing;
      this.rightLeg.rotation.x = -swing;
      this.leftArm.rotation.x = -swing * 0.65;
      this.rightArm.rotation.x = swing * 0.65;
      this.rightArm.rotation.z = THREE.MathUtils.damp(this.rightArm.rotation.z, -0.15, 5, delta);
    } else {
      this.leftLeg.rotation.x = THREE.MathUtils.damp(this.leftLeg.rotation.x, 0, 8, delta);
      this.rightLeg.rotation.x = THREE.MathUtils.damp(this.rightLeg.rotation.x, 0, 8, delta);
      if (!this.isPlayerNear && !this.isSocializing) {
        this.leftArm.rotation.x = THREE.MathUtils.damp(this.leftArm.rotation.x, 0, 5, delta);
        this.rightArm.rotation.x = THREE.MathUtils.damp(this.rightArm.rotation.x, 0, 5, delta);
        this.rightArm.rotation.z = THREE.MathUtils.damp(this.rightArm.rotation.z, -0.18, 5, delta);
      }
    }
  }
}
