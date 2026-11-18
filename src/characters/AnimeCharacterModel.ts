/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as THREE from 'three';
import { CharacterCustomization } from '../types';
import { CHARACTER_PRESETS } from '../data/constants';
import {
  createAnimeEyeTexture,
  createSunburstEmblemTexture,
  createToonGradientTexture,
} from '../core/ProceduralTextures';
import {
  attachPrettyAnimeFace,
  createSculptedAnimeHeadGeometry,
} from './AnimeFaceBuilder';

/**
 * Builds a feathered anime angel wing blade using beveled ExtrudeGeometry
 * so every silhouette reads clearly as sculpted Seraphim feathers.
 */
function createFeatheredWingMesh(
  upper: boolean,
  side: number,
  featherMat: THREE.Material,
  rimMat: THREE.Material
): THREE.Group {
  const wingGroup = new THREE.Group();

  const shape = new THREE.Shape();
  if (upper) {
    shape.moveTo(0, 0);
    shape.bezierCurveTo(side * 0.25, 0.22, side * 0.55, 0.62, side * 0.72, 1.08);
    shape.quadraticCurveTo(side * 0.62, 0.78, side * 0.52, 0.56);
    shape.lineTo(side * 0.64, 0.64);
    shape.quadraticCurveTo(side * 0.5, 0.38, side * 0.38, 0.26);
    shape.lineTo(side * 0.5, 0.28);
    shape.quadraticCurveTo(side * 0.34, 0.08, side * 0.14, -0.05);
    shape.closePath();
  } else {
    shape.moveTo(0, 0);
    shape.bezierCurveTo(side * 0.28, -0.08, side * 0.64, -0.35, side * 0.76, -0.88);
    shape.quadraticCurveTo(side * 0.58, -0.68, side * 0.44, -0.52);
    shape.lineTo(side * 0.55, -0.62);
    shape.quadraticCurveTo(side * 0.38, -0.44, side * 0.26, -0.32);
    shape.lineTo(side * 0.36, -0.42);
    shape.quadraticCurveTo(side * 0.18, -0.22, side * 0.06, -0.1);
    shape.closePath();
  }

  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: 0.032,
    bevelEnabled: true,
    bevelThickness: 0.012,
    bevelSize: 0.012,
    bevelSegments: 2,
  });
  geo.center();

  const mainMesh = new THREE.Mesh(geo, featherMat);
  mainMesh.position.set(side * 0.36, upper ? 0.46 : -0.36, -0.04);
  wingGroup.add(mainMesh);

  // Inner soft luminous feather tuft overlap
  const innerFeather = new THREE.Mesh(
    new THREE.ConeGeometry(0.11, 0.42, 6),
    rimMat
  );
  innerFeather.position.set(side * 0.2, upper ? 0.18 : -0.18, 0.01);
  innerFeather.rotation.z = side * (upper ? -0.95 : -2.25);
  wingGroup.add(innerFeather);

  return wingGroup;
}

export class AnimeCharacterModel {
  public group: THREE.Group;

  // Joints & limb references for procedural animation
  private headGroup: THREE.Group;
  private torsoGroup: THREE.Group;
  private leftArm: THREE.Group;
  private rightArm: THREE.Group;
  private leftLeg: THREE.Group;
  private rightLeg: THREE.Group;
  private hairGroup: THREE.Group;
  private backHairGroup: THREE.Group;
  private haloGroup: THREE.Group;
  private upperLeftWing: THREE.Group;
  private upperRightWing: THREE.Group;
  private lowerLeftWing: THREE.Group;
  private lowerRightWing: THREE.Group;
  private leftEyeMesh: THREE.Mesh;
  private rightEyeMesh: THREE.Mesh;
  private mouthMesh: THREE.Mesh;
  private scarfMesh?: THREE.Mesh;
  private tabardFlap?: THREE.Mesh;

  // Materials for live recoloring
  private hairMaterial: THREE.MeshToonMaterial;
  private outfitMaterial: THREE.MeshStandardMaterial;
  private secondaryMaterial: THREE.MeshToonMaterial;
  private skinMaterial: THREE.MeshToonMaterial;
  private leftEyeMaterial: THREE.MeshBasicMaterial;
  private rightEyeMaterial: THREE.MeshBasicMaterial;
  private goldMaterial: THREE.MeshStandardMaterial;
  private wingFeatherMaterial: THREE.MeshStandardMaterial;

  // Animation cycle variables
  private walkTime = 0;
  private idleTime = 0;
  private blinkTimer = 2.0;
  private cheerTime = 0;
  private baseScaleY = 1.0;

  // Emote state
  public activeEmote: string | null = null;
  private emoteTime = 0;

  constructor(customization: CharacterCustomization) {
    this.group = new THREE.Group();
    const preset = CHARACTER_PRESETS.find((p) => p.id === customization.archetypeId) || CHARACTER_PRESETS[0];
    const isChibi = preset.isChibi;

    const toonRamp = createToonGradientTexture(3);

    // Setup materials with varied PBR metalness/roughness vs anime toon shading
    this.skinMaterial = new THREE.MeshToonMaterial({
      color: preset.skinColor,
      gradientMap: toonRamp,
    });

    this.hairMaterial = new THREE.MeshToonMaterial({
      color: customization.hairColor,
      gradientMap: toonRamp,
    });

    // Silver-plated Valkyrie armor chest & greaves
    this.outfitMaterial = new THREE.MeshStandardMaterial({
      color: customization.outfitColor,
      metalness: 0.42,
      roughness: 0.28,
    });

    // Asymmetric white battle tabard & fabric trim
    this.secondaryMaterial = new THREE.MeshToonMaterial({
      color: customization.secondaryColor,
      gradientMap: toonRamp,
      side: THREE.DoubleSide,
    });

    this.goldMaterial = new THREE.MeshStandardMaterial({
      color: '#fde047',
      emissive: '#f59e0b',
      emissiveIntensity: 0.35,
      metalness: 0.65,
      roughness: 0.22,
    });

    this.wingFeatherMaterial = new THREE.MeshStandardMaterial({
      color: '#fef08a',
      emissive: '#fbbf24',
      emissiveIntensity: 0.45,
      roughness: 0.38,
      metalness: 0.15,
      transparent: true,
      opacity: 0.94,
      side: THREE.DoubleSide,
    });

    const underSuitMat = new THREE.MeshToonMaterial({
      color: '#1e1b2e',
      gradientMap: toonRamp,
    });

    const overallScale = isChibi ? 0.86 : 1.0;
    const headScale = isChibi ? 1.42 : 1.04;
    const bodyScaleY = isChibi ? 0.72 : 1.0;
    this.baseScaleY = bodyScaleY;

    // --- TORSO GROUP (Armored Valkyrie Cuirass + Sunburst Crest + Waist Corset + Tabard + 4 Wings) ---
    this.torsoGroup = new THREE.Group();
    this.torsoGroup.position.y = 1.06 * bodyScaleY;

    // 1. Dark undersuit neck & waist core
    const neckCollar = new THREE.Mesh(
      new THREE.CylinderGeometry(0.11, 0.14, 0.16 * bodyScaleY, 12),
      underSuitMat
    );
    neckCollar.position.y = 0.24 * bodyScaleY;
    this.torsoGroup.add(neckCollar);

    const gorgetTrim = new THREE.Mesh(
      new THREE.TorusGeometry(0.145, 0.022, 8, 18),
      this.outfitMaterial
    );
    gorgetTrim.rotation.x = Math.PI * 0.5;
    gorgetTrim.position.y = 0.2 * bodyScaleY;
    this.torsoGroup.add(gorgetTrim);

    // 2. Sculpted Silver Breastplate
    const chestGeo = new THREE.CylinderGeometry(0.24, 0.18, 0.32 * bodyScaleY, 14);
    chestGeo.scale(1.06, 1, 0.82);
    const chest = new THREE.Mesh(chestGeo, this.outfitMaterial);
    chest.position.y = 0.07 * bodyScaleY;
    chest.castShadow = true;
    this.torsoGroup.add(chest);

    // Subtle chest plate dome highlight for knight breastplate silhouette
    const frontPlate = new THREE.Mesh(
      new THREE.SphereGeometry(0.16, 14, 12),
      this.outfitMaterial
    );
    frontPlate.scale.set(1.25, 0.88 * bodyScaleY, 0.65);
    frontPlate.position.set(0, 0.1 * bodyScaleY, 0.11);
    frontPlate.castShadow = true;
    this.torsoGroup.add(frontPlate);

    // 3. Glowing Golden Sunburst Chest Emblem
    const emblemTex = createSunburstEmblemTexture('#facc15');
    const emblemPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(0.21, 0.21 * bodyScaleY),
      new THREE.MeshBasicMaterial({
        map: emblemTex,
        transparent: true,
        depthWrite: false,
      })
    );
    emblemPlane.position.set(0, 0.11 * bodyScaleY, 0.222);
    this.torsoGroup.add(emblemPlane);

    // 4. Ribbed Silver Waist Corset & Tasset Plates
    const waistCorset = new THREE.Mesh(
      new THREE.CylinderGeometry(0.175, 0.205, 0.22 * bodyScaleY, 14),
      this.outfitMaterial
    );
    waistCorset.scale.set(1.04, 1, 0.8);
    waistCorset.position.y = -0.16 * bodyScaleY;
    waistCorset.castShadow = true;
    this.torsoGroup.add(waistCorset);

    // Ribbed vertical armor seams & chevron belt trim
    const beltChevron = new THREE.Mesh(
      new THREE.TorusGeometry(0.195, 0.018, 6, 18),
      underSuitMat
    );
    beltChevron.rotation.x = Math.PI * 0.5;
    beltChevron.scale.set(1.05, 0.82, 1);
    beltChevron.position.y = -0.24 * bodyScaleY;
    this.torsoGroup.add(beltChevron);

    // 5. Asymmetric White Side-Slit Battle Skirt / Tabard with Gold Border
    const skirtGeo = new THREE.CylinderGeometry(
      0.21,
      0.42,
      0.72 * bodyScaleY,
      20,
      1,
      true,
      Math.PI * 0.22,
      Math.PI * 1.48
    );
    const battleSkirt = new THREE.Mesh(skirtGeo, this.secondaryMaterial);
    battleSkirt.position.y = -0.55 * bodyScaleY;
    battleSkirt.castShadow = true;
    this.tabardFlap = battleSkirt;
    this.torsoGroup.add(battleSkirt);

    // Gold bottom hem trim on the battle skirt
    const skirtGoldHem = new THREE.Mesh(
      new THREE.TorusGeometry(0.415, 0.016, 6, 24, Math.PI * 1.48),
      this.goldMaterial
    );
    skirtGoldHem.rotation.x = Math.PI * 0.5;
    skirtGoldHem.rotation.z = -Math.PI * 0.28;
    skirtGoldHem.position.y = -0.9 * bodyScaleY;
    this.torsoGroup.add(skirtGoldHem);

    // 6. Four Radiant Golden Seraphim Wings (2 upper sweeping up, 2 lower sweeping down)
    const wingBaseZ = -0.18;
    const wingCoreMat = new THREE.MeshBasicMaterial({ color: '#fef9c3' });

    this.upperLeftWing = createFeatheredWingMesh(true, -1, this.wingFeatherMaterial, wingCoreMat);
    this.upperLeftWing.position.set(-0.14, 0.14 * bodyScaleY, wingBaseZ);
    this.upperLeftWing.rotation.y = 0.18;

    this.upperRightWing = createFeatheredWingMesh(true, 1, this.wingFeatherMaterial, wingCoreMat);
    this.upperRightWing.position.set(0.14, 0.14 * bodyScaleY, wingBaseZ);
    this.upperRightWing.rotation.y = -0.18;

    this.lowerLeftWing = createFeatheredWingMesh(false, -1, this.wingFeatherMaterial, wingCoreMat);
    this.lowerLeftWing.position.set(-0.12, -0.02 * bodyScaleY, wingBaseZ - 0.02);
    this.lowerLeftWing.rotation.y = 0.24;

    this.lowerRightWing = createFeatheredWingMesh(false, 1, this.wingFeatherMaterial, wingCoreMat);
    this.lowerRightWing.position.set(0.12, -0.02 * bodyScaleY, wingBaseZ - 0.02);
    this.lowerRightWing.rotation.y = -0.24;

    this.torsoGroup.add(
      this.upperLeftWing,
      this.upperRightWing,
      this.lowerLeftWing,
      this.lowerRightWing
    );

    this.group.add(this.torsoGroup);

    // --- HEAD GROUP (Sculpted V-Line Anime Face + Pretty Luminous Eyes + Halo + Layered Hair) ---
    this.headGroup = new THREE.Group();
    this.headGroup.position.y = 1.48 * bodyScaleY;
    this.headGroup.scale.set(headScale, headScale, headScale);

    const headGeo = createSculptedAnimeHeadGeometry(0.285);
    const head = new THREE.Mesh(headGeo, this.skinMaterial);
    head.castShadow = true;
    this.headGroup.add(head);

    const faceRig = attachPrettyAnimeFace(this.headGroup, {
      headRadius: 0.285,
      eyeColor: customization.eyeColor,
      pupilColor: '#b45309',
      browColor: '#64748b',
      blushColor: '#fb7185',
      skinColor: preset.skinColor,
      expression: 'smile',
    });
    this.leftEyeMesh = faceRig.leftEyeMesh;
    this.rightEyeMesh = faceRig.rightEyeMesh;
    this.leftEyeMaterial = faceRig.leftEyeMat;
    this.rightEyeMaterial = faceRig.rightEyeMat;
    this.mouthMesh = faceRig.mouthMesh;

    // Floating Spiked Golden Halo above Crown
    this.haloGroup = new THREE.Group();
    this.haloGroup.position.set(0, 0.44, -0.02);
    this.haloGroup.rotation.x = 0.12;

    const haloRing = new THREE.Mesh(
      new THREE.TorusGeometry(0.24, 0.024, 10, 28),
      this.goldMaterial
    );
    haloRing.rotation.x = Math.PI * 0.5;
    this.haloGroup.add(haloRing);

    // 4 Cardinal Sunburst Spikes around the halo (like reference art!)
    const spikeGeo = new THREE.ConeGeometry(0.036, 0.125, 5);
    [
      [0, 0, 0.26, Math.PI * 0.5, 0],
      [0, 0, -0.26, -Math.PI * 0.5, 0],
      [-0.28, 0, 0, 0, Math.PI * 0.5],
      [0.28, 0, 0, 0, -Math.PI * 0.5],
    ].forEach(([sx, sy, sz, rx, rz]) => {
      const spike = new THREE.Mesh(spikeGeo, this.goldMaterial);
      spike.position.set(sx, sy, sz);
      spike.rotation.set(rx, 0, rz);
      this.haloGroup.add(spike);
    });
    this.headGroup.add(this.haloGroup);

    // Layered Hair & Archetype Signature Accessories
    this.hairGroup = new THREE.Group();
    this.backHairGroup = new THREE.Group();
    this.buildCharacterHair(preset.id);
    this.hairGroup.add(this.backHairGroup);
    this.headGroup.add(this.hairGroup);

    this.group.add(this.headGroup);

    // --- ARMS (Silver Pauldron + Dark Undersuit + Flared Silver Vambrace + Black Glove) ---
    this.leftArm = this.createArm(-1, underSuitMat);
    this.leftArm.position.set(-0.31, 1.2 * bodyScaleY, 0);

    this.rightArm = this.createArm(1, underSuitMat);
    this.rightArm.position.set(0.31, 1.2 * bodyScaleY, 0);

    this.group.add(this.leftArm, this.rightArm);

    // --- LEGS (Dark Tights + Silver Knee Guard + Silver Shin Greaves + Armored Boots) ---
    this.leftLeg = this.createLeg(-1, bodyScaleY, underSuitMat);
    this.leftLeg.position.set(-0.13, 0.72 * bodyScaleY, 0);

    this.rightLeg = this.createLeg(1, bodyScaleY, underSuitMat);
    this.rightLeg.position.set(0.13, 0.72 * bodyScaleY, 0);

    this.group.add(this.leftLeg, this.rightLeg);

    this.group.scale.set(overallScale, overallScale, overallScale);
  }

  private createArm(side: number, underSuitMat: THREE.Material): THREE.Group {
    const arm = new THREE.Group();

    // 1. Rounded Silver Shoulder Pauldron + Circular Rivet
    const pauldronGeo = new THREE.SphereGeometry(0.11, 12, 10, 0, Math.PI * 2, 0, Math.PI * 0.62);
    const pauldron = new THREE.Mesh(pauldronGeo, this.outfitMaterial);
    pauldron.position.set(side * 0.015, 0.01, 0);
    pauldron.rotation.z = side * -0.25;
    pauldron.castShadow = true;
    arm.add(pauldron);

    const rivet = new THREE.Mesh(
      new THREE.CylinderGeometry(0.022, 0.022, 0.025, 10),
      this.secondaryMaterial
    );
    rivet.rotation.z = Math.PI * 0.5;
    rivet.position.set(side * 0.09, 0.02, 0.04);
    arm.add(rivet);

    // 2. Dark Fitted Upper Sleeve
    const upperSleeve = new THREE.Mesh(
      new THREE.CylinderGeometry(0.062, 0.056, 0.19, 10),
      underSuitMat
    );
    upperSleeve.position.y = -0.11;
    upperSleeve.castShadow = true;
    arm.add(upperSleeve);

    // 3. Flared Silver Forearm Vambrace (Gauntlet Cuff)
    const vambrace = new THREE.Mesh(
      new THREE.CylinderGeometry(0.072, 0.052, 0.19, 10),
      this.outfitMaterial
    );
    vambrace.position.y = -0.25;
    vambrace.castShadow = true;
    arm.add(vambrace);

    // 4. Black Gloved Hand
    const glove = new THREE.Mesh(new THREE.SphereGeometry(0.055, 10, 10), underSuitMat);
    glove.scale.set(0.95, 1.15, 0.85);
    glove.position.y = -0.37;
    arm.add(glove);

    return arm;
  }

  private createLeg(side: number, bodyScaleY: number, underSuitMat: THREE.Material): THREE.Group {
    const leg = new THREE.Group();

    // 1. Dark Fitted Thigh
    const thigh = new THREE.Mesh(
      new THREE.CylinderGeometry(0.085, 0.072, 0.3 * bodyScaleY, 10),
      underSuitMat
    );
    thigh.position.y = -0.15 * bodyScaleY;
    thigh.castShadow = true;
    leg.add(thigh);

    // 2. Rounded Silver Knee Guard
    const kneeGuard = new THREE.Mesh(
      new THREE.SphereGeometry(0.078, 10, 10),
      this.outfitMaterial
    );
    kneeGuard.scale.set(0.95, 1.15, 0.85);
    kneeGuard.position.set(0, -0.31 * bodyScaleY, 0.032);
    kneeGuard.castShadow = true;
    leg.add(kneeGuard);

    // 3. Silver Shin Greave
    const greave = new THREE.Mesh(
      new THREE.CylinderGeometry(0.076, 0.058, 0.28 * bodyScaleY, 10),
      this.outfitMaterial
    );
    greave.position.y = -0.46 * bodyScaleY;
    greave.castShadow = true;
    leg.add(greave);

    // 4. Sleek Armored Boot
    const boot = new THREE.Mesh(
      new THREE.CylinderGeometry(0.058, 0.076, 0.14 * bodyScaleY, 10),
      this.outfitMaterial
    );
    boot.scale.set(1.0, 1.0, 1.45);
    boot.position.set(0, -0.64 * bodyScaleY, 0.035);
    boot.castShadow = true;
    leg.add(boot);

    const sole = new THREE.Mesh(
      new THREE.BoxGeometry(0.115, 0.035 * bodyScaleY, 0.2),
      underSuitMat
    );
    sole.position.set(0, -0.71 * bodyScaleY, 0.035);
    leg.add(sole);

    return leg;
  }

  private buildCharacterHair(id: string) {
    // Sculpted base hair crown
    const capGeo = new THREE.SphereGeometry(0.308, 18, 18, 0, Math.PI * 2, 0, Math.PI * 0.62);
    const cap = new THREE.Mesh(capGeo, this.hairMaterial);
    cap.position.y = 0.025;
    this.hairGroup.add(cap);

    // Swept asymmetrical Valkyrie forehead bangs framing the brow cleanly
    const bangSpecs: Array<[number, number, number, number, number]> = [
      [-0.175, 0.165, 0.24, 0.22, 0.34],
      [-0.085, 0.185, 0.25, 0.32, 0.22],
      [0.055, 0.185, 0.25, 0.34, -0.25],
      [0.165, 0.165, 0.24, 0.22, -0.36],
    ];
    bangSpecs.forEach(([x, y, z, rx, rz]) => {
      const bangGeo = new THREE.ConeGeometry(0.064, 0.21, 7);
      bangGeo.rotateX(Math.PI);
      const bang = new THREE.Mesh(bangGeo, this.hairMaterial);
      bang.position.set(x, y, z);
      bang.rotation.set(rx, 0, rz);
      this.hairGroup.add(bang);
    });

    // Flared side ear-tufts & face-framing curved locks (matching reference art)
    [-1, 1].forEach((side) => {
      const cheekLock = new THREE.Mesh(
        new THREE.ConeGeometry(0.068, 0.34, 7),
        this.hairMaterial
      );
      cheekLock.position.set(side * 0.255, -0.05, 0.14);
      cheekLock.rotation.z = side * -0.18;
      cheekLock.rotation.x = Math.PI + 0.15;
      this.hairGroup.add(cheekLock);

      const flaredTuft = new THREE.Mesh(
        new THREE.ConeGeometry(0.06, 0.22, 6),
        this.hairMaterial
      );
      flaredTuft.position.set(side * 0.34, 0.08, -0.02);
      flaredTuft.rotation.z = side * -1.05;
      this.hairGroup.add(flaredTuft);
    });

    // Billowing Waist-Length Layered Back Hair Cape (signature reference silhouette!)
    const centerCape = new THREE.Mesh(
      new THREE.ConeGeometry(0.32, 0.96, 10),
      this.hairMaterial
    );
    centerCape.scale.set(1.15, 1, 0.45);
    centerCape.position.set(0, -0.36, -0.22);
    centerCape.rotation.x = 0.22;
    this.backHairGroup.add(centerCape);

    [-0.24, 0.24].forEach((lx) => {
      const sideCurl = new THREE.Mesh(
        new THREE.ConeGeometry(0.14, 0.72, 8),
        this.hairMaterial
      );
      sideCurl.position.set(lx * 1.12, -0.34, -0.16);
      sideCurl.rotation.z = lx < 0 ? 0.36 : -0.36;
      sideCurl.rotation.x = 0.18;
      this.backHairGroup.add(sideCurl);
    });

    // Subtle secondary archetype signatures for non-default presets
    if (id === 'hana') {
      [-0.28, 0.28].forEach((sideX) => {
        const ribbon = new THREE.Mesh(new THREE.SphereGeometry(0.055, 8, 8), this.secondaryMaterial);
        ribbon.position.set(sideX, 0.18, -0.1);
        this.hairGroup.add(ribbon);

        const tail = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.52, 8), this.hairMaterial);
        tail.position.set(sideX * 1.18, -0.12, -0.12);
        tail.rotation.z = sideX < 0 ? -0.3 : 0.3;
        this.hairGroup.add(tail);
      });
    } else if (id === 'kaede') {
      const glassMat = new THREE.MeshStandardMaterial({ color: '#ef4444', roughness: 0.2 });
      [-0.108, 0.108].forEach((gx) => {
        const rim = new THREE.Mesh(new THREE.TorusGeometry(0.062, 0.011, 6, 16), glassMat);
        rim.position.set(gx, 0.02, 0.29);
        this.headGroup.add(rim);
      });
      const bridge = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.08), glassMat);
      bridge.rotation.z = Math.PI * 0.5;
      bridge.position.set(0, 0.02, 0.29);
      this.headGroup.add(bridge);
    } else if (id === 'ren') {
      const spikeGeo = new THREE.ConeGeometry(0.075, 0.32, 5);
      [
        [0, 0.34, 0, 0],
        [-0.18, 0.28, 0, 0.4],
        [0.18, 0.28, 0, -0.4],
      ].forEach(([x, y, z, rz]) => {
        const spike = new THREE.Mesh(spikeGeo, this.hairMaterial);
        spike.position.set(x, y, z);
        spike.rotation.z = rz;
        this.hairGroup.add(spike);
      });
    } else if (id === 'kaito') {
      const scarfGeo = new THREE.BoxGeometry(0.36, 0.08, 0.34);
      const scarfMat = new THREE.MeshToonMaterial({ color: '#38bdf8' });
      this.scarfMesh = new THREE.Mesh(scarfGeo, scarfMat);
      this.scarfMesh.position.set(0, -0.28, -0.04);
      this.headGroup.add(this.scarfMesh);
    } else if (id === 'mimi') {
      const earGeo = new THREE.ConeGeometry(0.095, 0.2, 4);
      earGeo.scale(1, 1, 0.6);
      const innerEarMat = new THREE.MeshBasicMaterial({ color: '#f43f5e' });
      [-0.17, 0.17].forEach((ex) => {
        const catEar = new THREE.Mesh(earGeo, this.hairMaterial);
        catEar.position.set(ex, 0.34, 0.05);
        catEar.rotation.z = ex < 0 ? 0.35 : -0.35;
        const innerEar = new THREE.Mesh(new THREE.ConeGeometry(0.055, 0.14, 4), innerEarMat);
        innerEar.position.set(0, 0, 0.025);
        catEar.add(innerEar);
        this.hairGroup.add(catEar);
      });
    } else if (id === 'piko') {
      const dome = new THREE.Mesh(
        new THREE.SphereGeometry(0.36, 16, 16),
        new THREE.MeshPhysicalMaterial({
          color: '#bae6fd',
          transparent: true,
          opacity: 0.42,
          roughness: 0.1,
        })
      );
      dome.position.y = 0.04;
      this.headGroup.add(dome);
    }
  }

  public applyCustomization(customization: CharacterCustomization) {
    this.hairMaterial.color.set(customization.hairColor);
    this.outfitMaterial.color.set(customization.outfitColor);
    this.secondaryMaterial.color.set(customization.secondaryColor);

    this.leftEyeMaterial.map = createAnimeEyeTexture(customization.eyeColor, '#b45309', 'left');
    this.leftEyeMaterial.needsUpdate = true;

    this.rightEyeMaterial.map = createAnimeEyeTexture(customization.eyeColor, '#b45309', 'right');
    this.rightEyeMaterial.needsUpdate = true;
  }

  public setFppMode(isFpp: boolean) {
    this.headGroup.visible = !isFpp;
  }

  public setEmote(emote: string | null) {
    this.activeEmote = emote;
    this.emoteTime = 0;
  }

  public update(delta: number, isMoving: boolean, isJumping: boolean, isCheering: boolean, isSprinting = false) {
    this.idleTime += delta;

    // Blink timer logic
    this.blinkTimer -= delta;
    if (this.blinkTimer <= 0) {
      this.leftEyeMesh.scale.y = 0.08;
      this.rightEyeMesh.scale.y = 0.08;
      if (this.blinkTimer <= -0.12) {
        this.leftEyeMesh.scale.y = 1.0;
        this.rightEyeMesh.scale.y = 1.0;
        this.blinkTimer = 2.5 + Math.random() * 3.5;
      }
    }

    // Gentle Valkyrie breathing + halo hover + 4-wing seraphim flutter + hair sway
    const breath = Math.sin(this.idleTime * 2.5) * 0.018;
    this.torsoGroup.position.y = 1.06 * this.baseScaleY + breath;
    this.headGroup.position.y = 1.48 * this.baseScaleY + breath * 1.4;

    this.haloGroup.position.y = 0.44 + Math.sin(this.idleTime * 3.0) * 0.02;
    this.haloGroup.rotation.y += delta * 0.6;

    const wingSpeed = isSprinting ? 10 : isMoving ? 5.5 : 2.6;
    const wingAmp = isSprinting ? 0.24 : 0.1;
    const flap = Math.sin(this.idleTime * wingSpeed) * wingAmp;
    this.upperLeftWing.rotation.y = 0.2 + flap;
    this.upperRightWing.rotation.y = -0.2 - flap;
    this.lowerLeftWing.rotation.y = 0.25 - flap * 0.7;
    this.lowerRightWing.rotation.y = -0.25 + flap * 0.7;

    this.backHairGroup.rotation.x =
      (isSprinting ? 0.32 : isMoving ? 0.16 : 0.04) + Math.sin(this.idleTime * (isSprinting ? 11 : 3.2)) * 0.05;

    if (this.tabardFlap) {
      this.tabardFlap.rotation.x = isSprinting ? 0.16 : isMoving ? 0.07 : 0;
    }

    if (this.scarfMesh) {
      this.scarfMesh.rotation.y = Math.sin(this.idleTime * (isSprinting ? 11 : 5)) * 0.15;
    }

    // --- EMOTE ANIMATIONS ---
    if (this.activeEmote) {
      this.emoteTime += delta * 5;
      if (this.activeEmote === 'dance') {
        this.torsoGroup.rotation.y = Math.sin(this.emoteTime) * 0.35;
        this.torsoGroup.rotation.z = Math.cos(this.emoteTime) * 0.15;
        this.leftArm.rotation.x = Math.sin(this.emoteTime) * 0.8 + 0.5;
        this.rightArm.rotation.x = -Math.sin(this.emoteTime) * 0.8 + 0.5;
        this.leftLeg.rotation.x = Math.sin(this.emoteTime * 2) * 0.3;
        this.rightLeg.rotation.x = -Math.sin(this.emoteTime * 2) * 0.3;
        return;
      } else if (this.activeEmote === 'wave') {
        this.rightArm.rotation.x = Math.PI * 0.85;
        this.rightArm.rotation.z = -0.3 + Math.sin(this.emoteTime * 2.5) * 0.45;
        this.leftArm.rotation.x = 0;
        this.headGroup.rotation.y = -0.15;
        return;
      } else if (this.activeEmote === 'bow') {
        this.torsoGroup.rotation.x = 0.55;
        this.headGroup.rotation.x = 0.35;
        this.leftArm.rotation.x = 0.3;
        this.rightArm.rotation.x = 0.3;
        this.leftArm.rotation.z = 0.2;
        this.rightArm.rotation.z = -0.2;
        return;
      } else if (this.activeEmote === 'think') {
        this.rightArm.rotation.x = Math.PI * 0.65;
        this.rightArm.rotation.z = -0.4;
        this.headGroup.rotation.z = 0.2;
        this.headGroup.rotation.y = -0.15;
        return;
      } else if (this.activeEmote === 'cheer') {
        isCheering = true;
      }
    }

    if (isCheering) {
      this.cheerTime += delta * 8;
      this.leftArm.rotation.x = Math.PI * 0.85 + Math.sin(this.cheerTime) * 0.2;
      this.rightArm.rotation.x = Math.PI * 0.85 + Math.cos(this.cheerTime) * 0.2;
      this.headGroup.rotation.y = Math.sin(this.cheerTime * 0.5) * 0.2;
      return;
    }

    if (isJumping) {
      this.leftLeg.rotation.x = -0.45;
      this.rightLeg.rotation.x = -0.25;
      this.leftArm.rotation.x = 0.75;
      this.rightArm.rotation.x = 0.75;
      return;
    }

    if (isMoving) {
      this.walkTime += delta * (isSprinting ? 15.5 : 9.0);
      const maxSwing = isSprinting ? 0.88 : 0.62;
      const legAngle = Math.sin(this.walkTime) * maxSwing;
      const armAngle = -legAngle * 0.75;

      this.leftLeg.rotation.x = legAngle;
      this.rightLeg.rotation.x = -legAngle;

      this.leftArm.rotation.x = armAngle;
      this.rightArm.rotation.x = -armAngle;
      this.leftArm.rotation.z = 0.14;
      this.rightArm.rotation.z = -0.14;

      this.torsoGroup.rotation.x = isSprinting ? 0.16 : 0;
      this.torsoGroup.rotation.y = Math.sin(this.walkTime) * 0.08;
      this.torsoGroup.rotation.z = Math.cos(this.walkTime) * 0.04;
      this.headGroup.rotation.x = isSprinting ? 0.12 : 0.06;
    } else {
      this.leftLeg.rotation.x = THREE.MathUtils.damp(this.leftLeg.rotation.x, 0, 10, delta);
      this.rightLeg.rotation.x = THREE.MathUtils.damp(this.rightLeg.rotation.x, 0, 10, delta);
      this.leftArm.rotation.x = THREE.MathUtils.damp(this.leftArm.rotation.x, 0, 10, delta);
      this.rightArm.rotation.x = THREE.MathUtils.damp(this.rightArm.rotation.x, 0, 10, delta);
      this.leftArm.rotation.z = THREE.MathUtils.damp(this.leftArm.rotation.z, 0.24, 10, delta);
      this.rightArm.rotation.z = THREE.MathUtils.damp(this.rightArm.rotation.z, -0.24, 10, delta);
      this.torsoGroup.rotation.set(0, 0, 0);
      this.headGroup.rotation.set(0, 0, 0);
    }
  }
}
