/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as THREE from 'three';

export class EduBotMascot {
  public group: THREE.Group;
  private faceCanvas: HTMLCanvasElement;
  private faceTexture: THREE.CanvasTexture;
  private faceCtx: CanvasRenderingContext2D;
  private leftHand: THREE.Mesh;
  private rightHand: THREE.Mesh;
  private antennaLight: THREE.PointLight;
  private hoverTime = 0;
  private mood: 'happy' | 'thinking' | 'excited' = 'happy';

  constructor() {
    this.group = new THREE.Group();

    // Floating body (smooth rounded shape)
    const bodyGeo = new THREE.SphereGeometry(0.38, 24, 24);
    bodyGeo.scale(1, 1.15, 0.95);
    const bodyMat = new THREE.MeshToonMaterial({
      color: '#ffffff',
    });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.castShadow = true;
    this.group.add(body);

    // Cyan accent ring
    const ringGeo = new THREE.TorusGeometry(0.37, 0.035, 8, 24);
    const ringMat = new THREE.MeshStandardMaterial({
      color: '#06b6d4',
      emissive: '#0891b2',
      emissiveIntensity: 0.6,
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI * 0.5;
    ring.position.y = -0.1;
    this.group.add(ring);

    // Screen visor face
    const screenGeo = new THREE.PlaneGeometry(0.42, 0.26);
    this.faceCanvas = document.createElement('canvas');
    this.faceCanvas.width = 256;
    this.faceCanvas.height = 160;
    this.faceCtx = this.faceCanvas.getContext('2d')!;
    this.faceTexture = new THREE.CanvasTexture(this.faceCanvas);

    const screenMat = new THREE.MeshBasicMaterial({
      map: this.faceTexture,
      transparent: true,
    });
    const screen = new THREE.Mesh(screenGeo, screenMat);
    screen.position.set(0, 0.08, 0.36);
    this.group.add(screen);

    // Floating robotic hands
    const handGeo = new THREE.SphereGeometry(0.09, 12, 12);
    handGeo.scale(0.8, 1.2, 0.8);
    const handMat = new THREE.MeshToonMaterial({ color: '#f8fafc' });

    this.leftHand = new THREE.Mesh(handGeo, handMat);
    this.leftHand.position.set(-0.55, 0, 0.1);
    this.rightHand = new THREE.Mesh(handGeo, handMat);
    this.rightHand.position.set(0.55, 0, 0.1);
    this.group.add(this.leftHand, this.rightHand);

    // Little cute antenna
    const antPole = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.16), new THREE.MeshStandardMaterial({ color: '#64748b' }));
    antPole.position.set(0, 0.5, 0);
    this.group.add(antPole);

    const antTip = new THREE.Mesh(new THREE.SphereGeometry(0.06, 12, 12), new THREE.MeshBasicMaterial({ color: '#ec4899' }));
    antTip.position.set(0, 0.6, 0);
    this.group.add(antTip);

    this.antennaLight = new THREE.PointLight('#ec4899', 1, 2);
    this.antennaLight.position.set(0, 0.6, 0);
    this.group.add(this.antennaLight);

    // Bottom thruster ring
    const thrusterGeo = new THREE.TorusGeometry(0.12, 0.04, 8, 16);
    const thrusterMat = new THREE.MeshBasicMaterial({ color: '#38bdf8' });
    const thruster = new THREE.Mesh(thrusterGeo, thrusterMat);
    thruster.rotation.x = Math.PI * 0.5;
    thruster.position.y = -0.42;
    this.group.add(thruster);

    this.drawFace();
  }

  public setMood(mood: 'happy' | 'thinking' | 'excited') {
    this.mood = mood;
    this.drawFace();
  }

  private drawFace() {
    const ctx = this.faceCtx;
    ctx.clearRect(0, 0, 256, 160);

    // Visor dark background with rounded corners
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.roundRect(10, 10, 236, 140, 30);
    ctx.fill();

    // Glowing cyan eyes
    ctx.strokeStyle = '#38bdf8';
    ctx.fillStyle = '#38bdf8';
    ctx.lineWidth = 10;
    ctx.lineCap = 'round';

    if (this.mood === 'happy' || this.mood === 'excited') {
      // Inverted U happy curved eyes (^_^)
      ctx.beginPath();
      ctx.arc(80, 75, 26, Math.PI * 1.15, Math.PI * 1.85);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(176, 75, 26, Math.PI * 1.15, Math.PI * 1.85);
      ctx.stroke();

      // Cheerful mouth
      ctx.beginPath();
      ctx.arc(128, 92, 18, 0.1, Math.PI - 0.1);
      ctx.fill();
    } else if (this.mood === 'thinking') {
      // One round eye, one flat inquisitive eye
      ctx.beginPath();
      ctx.arc(80, 68, 20, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(150, 68);
      ctx.lineTo(200, 68);
      ctx.stroke();
    }

    this.faceTexture.needsUpdate = true;
  }

  public update(delta: number) {
    this.hoverTime += delta * 2.5;

    // Hover bobbing
    this.group.position.y = 1.35 + Math.sin(this.hoverTime) * 0.12;

    // Hand waving animation
    this.rightHand.position.y = Math.sin(this.hoverTime * 1.5) * 0.08;
    this.leftHand.position.y = Math.cos(this.hoverTime * 1.5) * 0.08;
    this.rightHand.rotation.z = Math.sin(this.hoverTime * 3) * 0.25;

    // Subtle tilting
    this.group.rotation.z = Math.sin(this.hoverTime * 0.8) * 0.04;
  }
}
