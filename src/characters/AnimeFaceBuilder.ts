/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as THREE from 'three';
import {
  createAnimeBlushTexture,
  createAnimeEyebrowTexture,
  createAnimeEyeTexture,
  createAnimeMouthTexture,
} from '../core/ProceduralTextures';

export interface AnimeFaceRig {
  leftEyeMesh: THREE.Mesh;
  rightEyeMesh: THREE.Mesh;
  leftEyeMat: THREE.MeshBasicMaterial;
  rightEyeMat: THREE.MeshBasicMaterial;
  mouthMesh: THREE.Mesh;
}

function clamp01(v: number): number {
  return Math.max(0, Math.min(1, v));
}

function smoothstep01(t: number): number {
  const c = clamp01(t);
  return c * c * (3 - 2 * c);
}

/**
 * Shared vertex deformation shaping a smooth sphere into a soft, feminine
 * anime V-line / heart-oval head with plump cheeks and a delicate chin.
 */
function deformAnimeHeadVertex(
  vx: number,
  vy: number,
  vz: number,
  radius: number
): [number, number, number] {
  const nx = vx / radius;
  const ny = vy / radius;
  const nz = vz / radius;

  // 1. Taper lower jaw into a graceful, dainty anime chin
  const jawT = smoothstep01((-ny - 0.15) / 0.85);
  const xJawScale = 1.0 - 0.36 * jawT;
  const zJawScale = nz < 0 ? 1.0 - 0.34 * jawT : 1.0 - 0.19 * jawT;

  // 2. Soft cute cheek fullness on front-sides
  const cheekBell = Math.exp(-Math.pow((ny + 0.18) / 0.24, 2));
  const frontFactor = Math.max(0, nz);
  const xCheekBoost = 1.0 + 0.058 * cheekBell * frontFactor;
  const zCheekBoost = 1.0 + 0.032 * cheekBell * (1 - Math.abs(nx) * 0.45) * frontFactor;

  // 3. Softly flatten front eye/forehead plane so large anime eyes sit flush
  const faceFlat = Math.max(0, (nz - 0.35) / 0.65) * smoothstep01((ny + 0.35) / 0.55);

  // 4. Delicate chin point contour
  const chinPull = clamp01((-ny - 0.58) / 0.42) * frontFactor;

  const outX = vx * 0.99 * xJawScale * xCheekBoost;
  const outY = vy * 1.06 - 0.042 * radius * chinPull;
  const outZ =
    vz * 0.93 * zJawScale * zCheekBoost -
    0.042 * radius * faceFlat +
    0.024 * radius * chinPull;

  return [outX, outY, outZ];
}

/**
 * Samples the exact front-surface point on the sculpted anime head at normalized (nx, ny)
 * so facial features sit cleanly on the cheek/jaw curve without floating or clipping.
 */
function sampleSculptedFrontSurface(
  nx: number,
  ny: number,
  radius: number
): THREE.Vector3 {
  const r2 = Math.max(0.01, 1 - nx * nx - ny * ny);
  const nz = Math.sqrt(r2);
  const [sx, sy, sz] = deformAnimeHeadVertex(nx * radius, ny * radius, nz * radius, radius);
  return new THREE.Vector3(sx, sy, sz);
}

/**
 * Builds a high-subdivision sculpted anime head BufferGeometry (no plain round sphere).
 */
export function createSculptedAnimeHeadGeometry(radius = 0.285): THREE.BufferGeometry {
  const geo = new THREE.SphereGeometry(radius, 32, 24);
  const pos = geo.attributes.position as THREE.BufferAttribute;

  for (let i = 0; i < pos.count; i++) {
    const vx = pos.getX(i);
    const vy = pos.getY(i);
    const vz = pos.getZ(i);
    const [ox, oy, oz] = deformAnimeHeadVertex(vx, vy, vz, radius);
    pos.setXYZ(i, ox, oy, oz);
  }

  pos.needsUpdate = true;
  geo.computeVertexNormals();
  geo.computeBoundingSphere();
  return geo;
}

export interface AttachPrettyFaceOptions {
  headRadius: number;
  eyeColor: string;
  pupilColor?: string;
  browColor?: string;
  blushColor?: string;
  skinColor?: string;
  expression?: 'smile' | 'cheer';
}

/**
 * Attaches mirrored luminous anime eyes, arched eyebrows, soft radial cheek blush,
 * delicate sculpted anime nose, and a sweet smiling mouth onto `headGroup`.
 */
export function attachPrettyAnimeFace(
  headGroup: THREE.Group,
  options: AttachPrettyFaceOptions
): AnimeFaceRig {
  const {
    headRadius,
    eyeColor,
    pupilColor = '#92400e',
    browColor = '#64748b',
    blushColor = '#fb7185',
    skinColor = '#ffe4d6',
    expression = 'smile',
  } = options;

  const scale = headRadius / 0.285;

  // 1. Delicate Ears
  const earGeo = new THREE.SphereGeometry(0.048 * scale, 10, 10);
  earGeo.scale(0.42, 0.95, 0.72);
  const earMat = new THREE.MeshToonMaterial({ color: skinColor });
  const leftEar = new THREE.Mesh(earGeo, earMat);
  leftEar.position.set(-headRadius * 0.94, -0.015 * scale, -0.01 * scale);
  const rightEar = leftEar.clone();
  rightEar.position.x = headRadius * 0.94;
  headGroup.add(leftEar, rightEar);

  // 2. Side-mirrored Luminous Winged Anime Eyes
  const leftEyeTex = createAnimeEyeTexture(eyeColor, pupilColor, 'left');
  const rightEyeTex = createAnimeEyeTexture(eyeColor, pupilColor, 'right');

  const leftEyeMat = new THREE.MeshBasicMaterial({
    map: leftEyeTex,
    transparent: true,
    depthWrite: false,
  });
  const rightEyeMat = new THREE.MeshBasicMaterial({
    map: rightEyeTex,
    transparent: true,
    depthWrite: false,
  });

  const eyeGeo = new THREE.PlaneGeometry(0.132 * scale, 0.146 * scale);
  const leftEyePos = sampleSculptedFrontSurface(-0.37, 0.02, headRadius);
  const rightEyePos = sampleSculptedFrontSurface(0.37, 0.02, headRadius);

  const leftEyeMesh = new THREE.Mesh(eyeGeo, leftEyeMat);
  leftEyeMesh.position.set(leftEyePos.x, leftEyePos.y, leftEyePos.z + 0.014 * scale);
  leftEyeMesh.rotation.set(0.02, -0.22, 0.04);

  const rightEyeMesh = new THREE.Mesh(eyeGeo, rightEyeMat);
  rightEyeMesh.position.set(rightEyePos.x, rightEyePos.y, rightEyePos.z + 0.014 * scale);
  rightEyeMesh.rotation.set(0.02, 0.22, -0.04);

  headGroup.add(leftEyeMesh, rightEyeMesh);

  // 3. Soft Arched Eyebrows
  const browGeo = new THREE.PlaneGeometry(0.095 * scale, 0.042 * scale);
  const leftBrowMat = new THREE.MeshBasicMaterial({
    map: createAnimeEyebrowTexture(browColor, 'left'),
    transparent: true,
    depthWrite: false,
  });
  const rightBrowMat = new THREE.MeshBasicMaterial({
    map: createAnimeEyebrowTexture(browColor, 'right'),
    transparent: true,
    depthWrite: false,
  });

  const leftBrowPos = sampleSculptedFrontSurface(-0.36, 0.36, headRadius);
  const rightBrowPos = sampleSculptedFrontSurface(0.36, 0.36, headRadius);

  const leftBrow = new THREE.Mesh(browGeo, leftBrowMat);
  leftBrow.position.set(leftBrowPos.x, leftBrowPos.y, leftBrowPos.z + 0.018 * scale);
  leftBrow.rotation.set(-0.08, -0.2, 0.08);

  const rightBrow = new THREE.Mesh(browGeo, rightBrowMat);
  rightBrow.position.set(rightBrowPos.x, rightBrowPos.y, rightBrowPos.z + 0.018 * scale);
  rightBrow.rotation.set(-0.08, 0.2, -0.08);

  headGroup.add(leftBrow, rightBrow);

  // 4. Radial Rosy Cheek Blush
  const blushGeo = new THREE.PlaneGeometry(0.102 * scale, 0.052 * scale);
  const blushMat = new THREE.MeshBasicMaterial({
    map: createAnimeBlushTexture(blushColor),
    transparent: true,
    depthWrite: false,
  });
  const leftBlushPos = sampleSculptedFrontSurface(-0.5, -0.24, headRadius);
  const rightBlushPos = sampleSculptedFrontSurface(0.5, -0.24, headRadius);

  const leftBlush = new THREE.Mesh(blushGeo, blushMat);
  leftBlush.position.set(leftBlushPos.x, leftBlushPos.y, leftBlushPos.z + 0.011 * scale);
  leftBlush.rotation.set(0.06, -0.38, 0.05);

  const rightBlush = new THREE.Mesh(blushGeo, blushMat);
  rightBlush.position.set(rightBlushPos.x, rightBlushPos.y, rightBlushPos.z + 0.011 * scale);
  rightBlush.rotation.set(0.06, 0.38, -0.05);

  headGroup.add(leftBlush, rightBlush);

  // 5. Tiny Sculpted Anime Nose
  const noseTint = new THREE.Color(skinColor).lerp(new THREE.Color('#fda4af'), 0.24);
  const noseMat = new THREE.MeshToonMaterial({ color: noseTint });
  const noseGeo = new THREE.SphereGeometry(0.013 * scale, 10, 8);
  noseGeo.scale(0.78, 1.15, 0.92);
  const nosePos = sampleSculptedFrontSurface(0, -0.19, headRadius);
  const nose = new THREE.Mesh(noseGeo, noseMat);
  nose.position.set(0, nosePos.y, nosePos.z + 0.008 * scale);
  headGroup.add(nose);

  // 6. Sweet Smiling Anime Mouth
  const mouthGeo = new THREE.PlaneGeometry(0.086 * scale, 0.044 * scale);
  const mouthMat = new THREE.MeshBasicMaterial({
    map: createAnimeMouthTexture(expression),
    transparent: true,
    depthWrite: false,
  });
  const mouthPos = sampleSculptedFrontSurface(0, -0.44, headRadius);
  const mouthMesh = new THREE.Mesh(mouthGeo, mouthMat);
  mouthMesh.position.set(0, mouthPos.y, mouthPos.z + 0.012 * scale);
  mouthMesh.rotation.x = 0.14;
  headGroup.add(mouthMesh);

  return {
    leftEyeMesh,
    rightEyeMesh,
    leftEyeMat,
    rightEyeMat,
    mouthMesh,
  };
}
