/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as THREE from 'three';
import { GameGuardian } from '../types';
import {
  createSunburstEmblemTexture,
  createToonGradientTexture,
} from '../core/ProceduralTextures';
import {
  attachPrettyAnimeFace,
  createSculptedAnimeHeadGeometry,
} from './AnimeFaceBuilder';

export class GuardianNPC {
  public group: THREE.Group;
  public guardian: GameGuardian;
  private headGroup: THREE.Group;
  private rightArm: THREE.Group;
  private leftArm: THREE.Group;
  private haloGroup: THREE.Group;
  private leftWing: THREE.Mesh;
  private rightWing: THREE.Mesh;
  private leftEyeMesh: THREE.Mesh;
  private rightEyeMesh: THREE.Mesh;
  private blinkTimer = 2.0 + Math.random() * 2.5;
  private idleTime = 0;
  private isPlayerNear = false;

  constructor(guardian: GameGuardian) {
    this.guardian = guardian;
    this.group = new THREE.Group();

    const toonRamp = createToonGradientTexture(3);

    const armorMat = new THREE.MeshStandardMaterial({
      color: guardian.outfitColor,
      metalness: 0.42,
      roughness: 0.3,
    });
    const tabardMat = new THREE.MeshToonMaterial({
      color: '#f8fafc',
      gradientMap: toonRamp,
      side: THREE.DoubleSide,
    });
    const accentMat = new THREE.MeshToonMaterial({
      color: guardian.accessoryColor,
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
      emissiveIntensity: 0.32,
      metalness: 0.65,
      roughness: 0.25,
    });

    // 1. Armored Knight Torso + Chest Crest + Waist Corset
    const chest = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.18, 0.36, 14), armorMat);
    chest.position.y = 1.12;
    chest.castShadow = true;
    this.group.add(chest);

    const waist = new THREE.Mesh(new THREE.CylinderGeometry(0.175, 0.205, 0.22, 14), armorMat);
    waist.position.y = 0.88;
    waist.castShadow = true;
    this.group.add(waist);

    // Sunburst Chest Emblem
    const crestTex = createSunburstEmblemTexture(guardian.accessoryColor || '#facc15');
    const crest = new THREE.Mesh(
      new THREE.PlaneGeometry(0.21, 0.21),
      new THREE.MeshBasicMaterial({ map: crestTex, transparent: true, depthWrite: false })
    );
    crest.position.set(0, 1.15, 0.232);
    this.group.add(crest);

    // Asymmetric Battle Skirt / Tabard revealing armored legs
    const skirt = new THREE.Mesh(
      new THREE.CylinderGeometry(0.21, 0.41, 0.72, 18, 1, true, Math.PI * 0.22, Math.PI * 1.48),
      tabardMat
    );
    skirt.position.y = 0.5;
    skirt.castShadow = true;
    this.group.add(skirt);

    // Legs with silver greaves & knee guards
    [-0.13, 0.13].forEach((lx) => {
      const thigh = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.07, 0.3, 8), underSuitMat);
      thigh.position.set(lx, 0.6, 0);
      const knee = new THREE.Mesh(new THREE.SphereGeometry(0.075, 8, 8), armorMat);
      knee.position.set(lx, 0.44, 0.03);
      const shin = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.058, 0.36, 8), armorMat);
      shin.position.set(lx, 0.22, 0);
      const boot = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.09, 0.18), armorMat);
      boot.position.set(lx, 0.045, 0.03);
      this.group.add(thigh, knee, shin, boot);
    });

    // Guardian Angelic Wings behind back
    const wingMat = new THREE.MeshStandardMaterial({
      color: guardian.accessoryColor || '#fde047',
      emissive: guardian.outfitColor,
      emissiveIntensity: 0.3,
      roughness: 0.35,
      transparent: true,
      opacity: 0.88,
      side: THREE.DoubleSide,
    });
    const wingGeo = new THREE.ConeGeometry(0.24, 0.85, 5);
    wingGeo.scale(0.18, 1, 0.8);
    this.leftWing = new THREE.Mesh(wingGeo, wingMat);
    this.leftWing.position.set(-0.34, 1.28, -0.2);
    this.leftWing.rotation.set(-0.15, 0.25, 0.62);
    this.rightWing = new THREE.Mesh(wingGeo, wingMat);
    this.rightWing.position.set(0.34, 1.28, -0.2);
    this.rightWing.rotation.set(-0.15, -0.25, -0.62);
    this.group.add(this.leftWing, this.rightWing);

    // 2. Head Group (Sculpted V-Line Anime Face + Pretty Expressive Features)
    this.headGroup = new THREE.Group();
    this.headGroup.position.y = 1.6;

    const headGeo = createSculptedAnimeHeadGeometry(0.28);
    const head = new THREE.Mesh(headGeo, skinMat);
    head.castShadow = true;
    this.headGroup.add(head);

    const faceRig = attachPrettyAnimeFace(this.headGroup, {
      headRadius: 0.28,
      eyeColor: guardian.accessoryColor || '#facc15',
      pupilColor: '#92400e',
      browColor: '#64748b',
      blushColor: '#fb7185',
      skinColor: '#ffe4d6',
      expression: 'smile',
    });
    this.leftEyeMesh = faceRig.leftEyeMesh;
    this.rightEyeMesh = faceRig.rightEyeMesh;

    // Layered Hair Cap + Swept Forehead Bangs + Back Hair Cape
    const hairCap = new THREE.Mesh(
      new THREE.SphereGeometry(0.302, 16, 16, 0, Math.PI * 2, 0, Math.PI * 0.62),
      accentMat
    );
    hairCap.position.y = 0.025;
    this.headGroup.add(hairCap);

    [-0.14, -0.04, 0.06, 0.15].forEach((bx, idx) => {
      const bang = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.19, 6), accentMat);
      bang.rotation.x = Math.PI + 0.28;
      bang.rotation.z = idx < 2 ? 0.24 : -0.24;
      bang.position.set(bx, 0.175, 0.245);
      this.headGroup.add(bang);
    });

    const backCape = new THREE.Mesh(new THREE.ConeGeometry(0.3, 0.78, 8), accentMat);
    backCape.scale.set(1.1, 1, 0.45);
    backCape.position.set(0, -0.28, -0.2);
    backCape.rotation.x = 0.2;
    this.headGroup.add(backCape);

    // Floating Guardian Halo
    this.haloGroup = new THREE.Group();
    this.haloGroup.position.set(0, 0.43, -0.02);
    const haloRing = new THREE.Mesh(new THREE.TorusGeometry(0.22, 0.022, 8, 24), goldMat);
    haloRing.rotation.x = Math.PI * 0.5;
    this.haloGroup.add(haloRing);
    this.headGroup.add(this.haloGroup);

    this.group.add(this.headGroup);

    // 3. Arms (Silver Pauldrons + Dark sleeves + Silver Vambraces)
    const buildArm = (side: number) => {
      const armGrp = new THREE.Group();
      const pauldron = new THREE.Mesh(
        new THREE.SphereGeometry(0.105, 10, 8, 0, Math.PI * 2, 0, Math.PI * 0.6),
        armorMat
      );
      pauldron.position.set(side * 0.015, 0.01, 0);
      const sleeve = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.055, 0.18, 8), underSuitMat);
      sleeve.position.y = -0.1;
      const vambrace = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.052, 0.18, 8), armorMat);
      vambrace.position.y = -0.24;
      const glove = new THREE.Mesh(new THREE.SphereGeometry(0.05, 8, 8), underSuitMat);
      glove.position.y = -0.35;
      armGrp.add(pauldron, sleeve, vambrace, glove);
      return armGrp;
    };

    this.leftArm = buildArm(-1);
    this.leftArm.position.set(-0.31, 1.24, 0);
    this.leftArm.rotation.z = 0.2;
    this.group.add(this.leftArm);

    this.rightArm = buildArm(1);
    this.rightArm.position.set(0.31, 1.24, 0);
    this.rightArm.rotation.z = -0.2;
    this.group.add(this.rightArm);

    // 4. Floating 3D Overhead Name Billboard
    const tagMesh = this.createNameBillboard();
    tagMesh.position.y = 2.52;
    this.group.add(tagMesh);
  }

  private createNameBillboard(): THREE.Mesh {
    const canvas = document.createElement('canvas');
    canvas.width = 384;
    canvas.height = 120;
    const ctx = canvas.getContext('2d')!;

    ctx.fillStyle = 'rgba(24, 10, 42, 0.9)';
    ctx.beginPath();
    ctx.roundRect(8, 8, 368, 104, 20);
    ctx.fill();

    ctx.strokeStyle = this.guardian.outfitColor;
    ctx.lineWidth = 6;
    ctx.stroke();

    ctx.fillStyle = this.guardian.accessoryColor;
    ctx.font = 'bold 22px "Fredoka", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`${this.guardian.avatar} ${this.guardian.title.toUpperCase()}`, 192, 44);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 36px "Fredoka", sans-serif';
    ctx.fillText(this.guardian.name, 192, 88);

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;

    const plane = new THREE.Mesh(
      new THREE.PlaneGeometry(2.0, 0.65),
      new THREE.MeshBasicMaterial({ map: texture, transparent: true, side: THREE.DoubleSide })
    );
    return plane;
  }

  public setPlayerNear(isNear: boolean) {
    this.isPlayerNear = isNear;
  }

  public update(delta: number, playerPos?: THREE.Vector3) {
    this.idleTime += delta;

    // Natural eye blinking
    this.blinkTimer -= delta;
    if (this.blinkTimer <= 0) {
      this.leftEyeMesh.scale.y = 0.08;
      this.rightEyeMesh.scale.y = 0.08;
      if (this.blinkTimer <= -0.12) {
        this.leftEyeMesh.scale.y = 1.0;
        this.rightEyeMesh.scale.y = 1.0;
        this.blinkTimer = 2.6 + Math.random() * 3.5;
      }
    }

    // Idle breathing + halo rotation + gentle wing sway
    this.headGroup.position.y = 1.6 + Math.sin(this.idleTime * 2) * 0.02;
    this.haloGroup.rotation.y += delta * 0.55;
    this.haloGroup.position.y = 0.43 + Math.sin(this.idleTime * 3) * 0.015;
    const flap = Math.sin(this.idleTime * 2.5) * 0.08;
    this.leftWing.rotation.y = 0.25 + flap;
    this.rightWing.rotation.y = -0.25 - flap;

    if (this.isPlayerNear && playerPos) {
      const dx = playerPos.x - this.group.position.x;
      const dz = playerPos.z - this.group.position.z;
      const angle = Math.atan2(dx, dz);
      this.group.rotation.y = THREE.MathUtils.damp(this.group.rotation.y, angle, 6, delta);

      // Friendly wave gesture
      this.rightArm.rotation.x = Math.PI * 0.65;
      this.rightArm.rotation.z = -0.3 + Math.sin(this.idleTime * 4) * 0.35;
    } else {
      this.rightArm.rotation.x = THREE.MathUtils.damp(this.rightArm.rotation.x, 0, 4, delta);
      this.rightArm.rotation.z = THREE.MathUtils.damp(this.rightArm.rotation.z, -0.2, 4, delta);
    }
  }
}
