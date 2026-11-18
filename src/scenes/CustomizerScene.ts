/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as THREE from 'three';
import { AnimeCharacterModel } from '../characters/AnimeCharacterModel';
import { CharacterCustomization } from '../types';

export class CustomizerScene {
  public scene: THREE.Scene;
  public camera: THREE.PerspectiveCamera;
  public playerModel: AnimeCharacterModel;
  private turntableGroup: THREE.Group;
  private autoRotate = true;
  private currentAngle = 0;

  constructor(customization: CharacterCustomization) {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color('#1c0f2b');

    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
    this.camera.position.set(0, 1.4, 4.2);
    this.camera.lookAt(new THREE.Vector3(0, 1.1, 0));

    this.turntableGroup = new THREE.Group();
    this.scene.add(this.turntableGroup);

    // Studio Stage Podium
    const stageGeo = new THREE.CylinderGeometry(1.6, 1.8, 0.25, 32);
    const stageMat = new THREE.MeshStandardMaterial({
      color: '#3b1d55',
      roughness: 0.3,
      metalness: 0.2,
    });
    const stage = new THREE.Mesh(stageGeo, stageMat);
    stage.position.y = -0.125;
    stage.receiveShadow = true;
    this.turntableGroup.add(stage);

    // Glowing Golden Ring on Stage Edge
    const ringGeo = new THREE.TorusGeometry(1.65, 0.04, 12, 32);
    const ringMat = new THREE.MeshBasicMaterial({ color: '#fde047' });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI * 0.5;
    ring.position.y = 0.02;
    this.turntableGroup.add(ring);

    this.playerModel = new AnimeCharacterModel(customization);
    this.turntableGroup.add(this.playerModel.group);

    this.setupLighting();
  }

  private setupLighting() {
    // Key Light
    const keyLight = new THREE.DirectionalLight('#fffbeb', 1.85);
    keyLight.position.set(4, 6, 5);
    this.scene.add(keyLight);

    // Fill Light (Warm Golden-Amber)
    const fillLight = new THREE.DirectionalLight('#fbbf24', 1.1);
    fillLight.position.set(-4, 3, 3);
    this.scene.add(fillLight);

    // Back / Rim Light (Cyan Highlight)
    const rimLight = new THREE.DirectionalLight('#38bdf8', 1.6);
    rimLight.position.set(0, 5, -5);
    this.scene.add(rimLight);

    const amb = new THREE.AmbientLight('#c084fc', 0.65);
    this.scene.add(amb);
  }

  public setCustomization(customization: CharacterCustomization) {
    this.turntableGroup.remove(this.playerModel.group);
    this.playerModel = new AnimeCharacterModel(customization);
    this.turntableGroup.add(this.playerModel.group);
  }

  public rotateManual(deltaX: number) {
    this.autoRotate = false;
    this.currentAngle += deltaX * 0.01;
    this.turntableGroup.rotation.y = this.currentAngle;
  }

  public resumeAutoRotate() {
    this.autoRotate = true;
  }

  public update(delta: number) {
    if (this.autoRotate) {
      this.currentAngle += delta * 0.5;
      this.turntableGroup.rotation.y = this.currentAngle;
    }
    this.playerModel.update(delta, false, false, false);
  }
}
