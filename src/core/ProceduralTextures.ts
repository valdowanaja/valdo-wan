/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as THREE from 'three';

// Cache generated textures to save memory and avoid canvas regeneration
const textureCache = new Map<string, THREE.Texture>();

/**
 * Creates 3-tone or 4-tone ramp texture for MeshToonMaterial.gradientMap
 */
export function createToonGradientTexture(steps = 3): THREE.CanvasTexture {
  const cacheKey = `toon_ramp_${steps}`;
  if (textureCache.has(cacheKey)) return textureCache.get(cacheKey) as THREE.CanvasTexture;

  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 1;
  const ctx = canvas.getContext('2d')!;

  const colors = steps === 3 
    ? ['#555555', '#aaaaaa', '#ffffff']
    : ['#333333', '#777777', '#bbbbbb', '#ffffff'];

  const stepWidth = canvas.width / colors.length;
  colors.forEach((c, i) => {
    ctx.fillStyle = c;
    ctx.fillRect(i * stepWidth, 0, stepWidth, 1);
  });

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.NearestFilter;
  texture.magFilter = THREE.NearestFilter;
  texture.generateMipmaps = false;

  textureCache.set(cacheKey, texture);
  return texture;
}

/**
 * Generates an expressive, pretty Anime Eye Texture with curved almond sclera,
 * upper-lid iris shading, luminous gradient, star sparkle, and flared outer lashes.
 * `side` ensures the outer lash wing flares outward on both left and right eyes
 * while keeping light highlights consistently angled.
 */
export function createAnimeEyeTexture(
  irisColor = '#facc15',
  pupilColor = '#b45309',
  side: 'left' | 'right' = 'right'
): THREE.CanvasTexture {
  const cacheKey = `anime_eye_v3_${irisColor}_${pupilColor}_${side}`;
  if (textureCache.has(cacheKey)) return textureCache.get(cacheKey) as THREE.CanvasTexture;

  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  ctx.clearRect(0, 0, 256, 256);

  const isLeft = side === 'left';

  // 1. Soft curved almond sclera
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(28, 140);
  ctx.bezierCurveTo(44, 58, 212, 58, 228, 140);
  ctx.bezierCurveTo(212, 224, 44, 224, 28, 140);
  ctx.closePath();
  const scleraGrad = ctx.createLinearGradient(128, 60, 128, 220);
  scleraGrad.addColorStop(0, '#f3ede6');
  scleraGrad.addColorStop(0.26, '#fffdf9');
  scleraGrad.addColorStop(1, '#ffffff');
  ctx.fillStyle = scleraGrad;
  ctx.fill();
  ctx.clip();

  // 2. Large luminous oval iris
  const baseCol = new THREE.Color(irisColor);
  const brightCol = baseCol.clone().lerp(new THREE.Color('#ffffff'), 0.68);
  const midCol = baseCol.clone().lerp(new THREE.Color('#fef08a'), 0.25);
  const deepCol = baseCol.clone().lerp(new THREE.Color(pupilColor), 0.55);

  ctx.save();
  ctx.beginPath();
  ctx.ellipse(128, 138, 68, 79, 0, 0, Math.PI * 2);
  ctx.clip();

  const irisGrad = ctx.createLinearGradient(128, 56, 128, 220);
  irisGrad.addColorStop(0, `#${deepCol.getHexString()}`);
  irisGrad.addColorStop(0.36, `#${baseCol.getHexString()}`);
  irisGrad.addColorStop(0.75, `#${midCol.getHexString()}`);
  irisGrad.addColorStop(1, `#${brightCol.getHexString()}`);
  ctx.fillStyle = irisGrad;
  ctx.fillRect(50, 52, 156, 174);

  // Subtle lower luminous crescent bounce inside iris
  const lowerGlow = ctx.createRadialGradient(128, 182, 6, 128, 176, 56);
  lowerGlow.addColorStop(0, 'rgba(255, 255, 255, 0.92)');
  lowerGlow.addColorStop(0.65, `rgba(${Math.round(brightCol.r * 255)}, ${Math.round(brightCol.g * 255)}, ${Math.round(brightCol.b * 255)}, 0.48)`);
  lowerGlow.addColorStop(1, 'rgba(255, 255, 255, 0)');
  ctx.fillStyle = lowerGlow;
  ctx.beginPath();
  ctx.ellipse(128, 172, 52, 34, 0, 0, Math.PI * 2);
  ctx.fill();

  // Soft glowing jewel pupil core
  const pupilGrad = ctx.createRadialGradient(128, 136, 4, 128, 136, 36);
  pupilGrad.addColorStop(0, 'rgba(255, 255, 255, 0.96)');
  pupilGrad.addColorStop(0.45, `rgba(${Math.round(brightCol.r * 255)}, ${Math.round(brightCol.g * 255)}, ${Math.round(brightCol.b * 255)}, 0.65)`);
  pupilGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
  ctx.fillStyle = pupilGrad;
  ctx.beginPath();
  ctx.ellipse(128, 136, 36, 44, 0, 0, Math.PI * 2);
  ctx.fill();

  // Upper eyelid soft shadow cast across top of iris
  const lidShadow = ctx.createLinearGradient(128, 56, 128, 112);
  lidShadow.addColorStop(0, 'rgba(92, 42, 14, 0.42)');
  lidShadow.addColorStop(1, 'rgba(92, 42, 14, 0)');
  ctx.fillStyle = lidShadow;
  ctx.fillRect(50, 52, 156, 62);

  ctx.restore(); // end iris clip
  ctx.restore(); // end sclera clip

  // Delicate iris rim outline
  ctx.strokeStyle = `#${deepCol.getHexString()}`;
  ctx.lineWidth = 3.5;
  ctx.beginPath();
  ctx.ellipse(128, 138, 68, 79, 0, 0, Math.PI * 2);
  ctx.stroke();

  // Specular Highlights (kept unified top-left across both eyes)
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.ellipse(95, 96, 20, 23, -0.32, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.arc(154, 168, 8.5, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.arc(114, 180, 4.5, 0, Math.PI * 2);
  ctx.fill();

  // Soft lower lash hint
  ctx.strokeStyle = 'rgba(124, 45, 18, 0.48)';
  ctx.lineWidth = 4;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(64, 202);
  ctx.quadraticCurveTo(128, 224, 192, 202);
  ctx.stroke();

  // Graceful Winged Upper Eyelash (mirrored per eye side)
  ctx.save();
  if (isLeft) {
    ctx.translate(256, 0);
    ctx.scale(-1, 1);
  }

  // Main upper lash sweep (tapered & curved gracefully upward toward outer corner)
  ctx.fillStyle = '#6b2710';
  ctx.beginPath();
  ctx.moveTo(26, 132);
  ctx.bezierCurveTo(64, 52, 182, 48, 224, 108);
  ctx.quadraticCurveTo(244, 92, 252, 74); // outer upturned wing tip
  ctx.quadraticCurveTo(234, 114, 218, 126);
  ctx.bezierCurveTo(176, 70, 68, 72, 34, 140);
  ctx.closePath();
  ctx.fill();

  // Delicate secondary outer lash feather
  ctx.beginPath();
  ctx.moveTo(212, 112);
  ctx.quadraticCurveTo(236, 112, 248, 98);
  ctx.quadraticCurveTo(232, 122, 214, 124);
  ctx.closePath();
  ctx.fill();

  // Warm amber-gold shimmer line inside upper lash
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 4;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(42, 118);
  ctx.bezierCurveTo(82, 64, 174, 62, 216, 106);
  ctx.stroke();

  ctx.restore();

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.generateMipmaps = true;

  textureCache.set(cacheKey, texture);
  return texture;
}

/**
 * Creates delicate arched anime eyebrow texture (mirrored per side).
 */
export function createAnimeEyebrowTexture(
  browColor = '#64748b',
  side: 'left' | 'right' = 'right'
): THREE.CanvasTexture {
  const cacheKey = `anime_brow_v1_${browColor}_${side}`;
  if (textureCache.has(cacheKey)) return textureCache.get(cacheKey) as THREE.CanvasTexture;

  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 64;
  const ctx = canvas.getContext('2d')!;

  ctx.save();
  if (side === 'left') {
    ctx.translate(128, 0);
    ctx.scale(-1, 1);
  }

  ctx.fillStyle = browColor;
  ctx.beginPath();
  ctx.moveTo(14, 40);
  ctx.quadraticCurveTo(56, 16, 114, 34);
  ctx.quadraticCurveTo(60, 26, 16, 46);
  ctx.closePath();
  ctx.fill();

  ctx.restore();

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  textureCache.set(cacheKey, texture);
  return texture;
}

/**
 * Soft radial rosy anime cheek blush with delicate highlight streaks.
 */
export function createAnimeBlushTexture(blushColor = '#fb7185'): THREE.CanvasTexture {
  const cacheKey = `anime_blush_v1_${blushColor}`;
  if (textureCache.has(cacheKey)) return textureCache.get(cacheKey) as THREE.CanvasTexture;

  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 64;
  const ctx = canvas.getContext('2d')!;

  const c = new THREE.Color(blushColor);
  const rgb = `${Math.round(c.r * 255)}, ${Math.round(c.g * 255)}, ${Math.round(c.b * 255)}`;

  const grad = ctx.createRadialGradient(64, 32, 4, 64, 32, 54);
  grad.addColorStop(0, `rgba(${rgb}, 0.62)`);
  grad.addColorStop(0.55, `rgba(${rgb}, 0.28)`);
  grad.addColorStop(1, `rgba(${rgb}, 0)`);

  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.ellipse(64, 32, 56, 26, 0, 0, Math.PI * 2);
  ctx.fill();

  // Delicate anime diagonal blush strokes
  ctx.strokeStyle = 'rgba(255, 241, 242, 0.52)';
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';
  [44, 64, 84].forEach((bx) => {
    ctx.beginPath();
    ctx.moveTo(bx - 4, 38);
    ctx.lineTo(bx + 5, 24);
    ctx.stroke();
  });

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  textureCache.set(cacheKey, texture);
  return texture;
}

/**
 * Pretty, expressive anime mouth / gentle smile texture with soft rose lip sheen.
 */
export function createAnimeMouthTexture(expression: 'smile' | 'cheer' = 'smile'): THREE.CanvasTexture {
  const cacheKey = `anime_mouth_v1_${expression}`;
  if (textureCache.has(cacheKey)) return textureCache.get(cacheKey) as THREE.CanvasTexture;

  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 64;
  const ctx = canvas.getContext('2d')!;

  if (expression === 'cheer') {
    // Open cute happy smile
    ctx.fillStyle = '#fb7185';
    ctx.beginPath();
    ctx.moveTo(30, 22);
    ctx.quadraticCurveTo(64, 28, 98, 22);
    ctx.quadraticCurveTo(88, 52, 64, 52);
    ctx.quadraticCurveTo(40, 52, 30, 22);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = '#9f1239';
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    ctx.stroke();
  } else {
    // Soft rosy lower lip tint
    const lipGlow = ctx.createRadialGradient(64, 38, 2, 64, 38, 24);
    lipGlow.addColorStop(0, 'rgba(251, 113, 133, 0.42)');
    lipGlow.addColorStop(1, 'rgba(251, 113, 133, 0)');
    ctx.fillStyle = lipGlow;
    ctx.beginPath();
    ctx.ellipse(64, 38, 26, 12, 0, 0, Math.PI * 2);
    ctx.fill();

    // Sweet dainty curved smile line
    ctx.strokeStyle = '#be185d';
    ctx.lineWidth = 5.5;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(34, 24);
    ctx.quadraticCurveTo(64, 42, 94, 24);
    ctx.stroke();

    // Subtle gloss highlight on lower lip
    ctx.fillStyle = 'rgba(255, 255, 255, 0.68)';
    ctx.beginPath();
    ctx.ellipse(64, 41, 10, 3, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  textureCache.set(cacheKey, texture);
  return texture;
}

/**
 * Generates the glowing golden sunburst chest crest texture on silver armor.
 */
export function createSunburstEmblemTexture(accentHex = '#facc15'): THREE.CanvasTexture {
  const cacheKey = `sunburst_emblem_${accentHex}`;
  if (textureCache.has(cacheKey)) return textureCache.get(cacheKey) as THREE.CanvasTexture;

  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  ctx.clearRect(0, 0, 256, 256);

  // Soft outer aura
  const glow = ctx.createRadialGradient(128, 128, 20, 128, 128, 118);
  glow.addColorStop(0, 'rgba(254, 240, 138, 0.95)');
  glow.addColorStop(0.55, 'rgba(250, 204, 21, 0.45)');
  glow.addColorStop(1, 'rgba(250, 204, 21, 0)');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, 256, 256);

  // 8-point sunburst star rays
  ctx.fillStyle = accentHex;
  ctx.strokeStyle = '#fef9c3';
  ctx.lineWidth = 5;
  ctx.beginPath();
  const points = 8;
  for (let i = 0; i < points * 2; i++) {
    const r = i % 2 === 0 ? 105 : 44;
    const ang = (i / (points * 2)) * Math.PI * 2 - Math.PI / 2;
    const x = 128 + Math.cos(ang) * r;
    const y = 128 + Math.sin(ang) * r;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Inner bright sun ring
  ctx.fillStyle = '#fffbeb';
  ctx.beginPath();
  ctx.arc(128, 128, 30, 0, Math.PI * 2);
  ctx.fill();

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  textureCache.set(cacheKey, texture);
  return texture;
}


/**
 * Creates cartoon cobblestone texture for sky island paths
 */
export function createCobblestoneTexture(): THREE.CanvasTexture {
  const cacheKey = 'cobblestone_toon';
  if (textureCache.has(cacheKey)) return textureCache.get(cacheKey) as THREE.CanvasTexture;

  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#583c6c';
  ctx.fillRect(0, 0, 512, 512);

  // Draw irregular stones
  const stones = [
    { x: 80, y: 80, rx: 65, ry: 45, c: '#7e5c94' },
    { x: 230, y: 70, rx: 70, ry: 50, c: '#8e6ca6' },
    { x: 390, y: 90, rx: 75, ry: 55, c: '#755489' },
    { x: 130, y: 200, rx: 80, ry: 55, c: '#86649d' },
    { x: 300, y: 190, rx: 75, ry: 50, c: '#7e5c94' },
    { x: 440, y: 220, rx: 60, ry: 50, c: '#8e6ca6' },
    { x: 70, y: 320, rx: 60, ry: 50, c: '#755489' },
    { x: 220, y: 320, rx: 75, ry: 55, c: '#8e6ca6' },
    { x: 370, y: 330, rx: 65, ry: 48, c: '#86649d' },
    { x: 150, y: 440, rx: 80, ry: 55, c: '#7e5c94' },
    { x: 320, y: 440, rx: 75, ry: 50, c: '#755489' },
    { x: 460, y: 430, rx: 50, ry: 45, c: '#8e6ca6' },
  ];

  stones.forEach(s => {
    // Drop shadow
    ctx.fillStyle = '#3a204d';
    ctx.beginPath();
    ctx.ellipse(s.x + 3, s.y + 4, s.rx, s.ry, 0, 0, Math.PI * 2);
    ctx.fill();

    // Stone base
    ctx.fillStyle = s.c;
    ctx.beginPath();
    ctx.ellipse(s.x, s.y, s.rx, s.ry, 0, 0, Math.PI * 2);
    ctx.fill();

    // Top highlight rim
    ctx.fillStyle = 'rgba(255, 255, 255, 0.18)';
    ctx.beginPath();
    ctx.ellipse(s.x - 2, s.y - 4, s.rx * 0.75, s.ry * 0.6, 0, 0, Math.PI * 2);
    ctx.fill();
  });

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 4);
  texture.colorSpace = THREE.SRGBColorSpace;

  textureCache.set(cacheKey, texture);
  return texture;
}

/**
 * Creates texture for number/math blocks
 */
export function createNumberBlockTexture(text: string, bgColor = '#ec4899', textColor = '#ffffff'): THREE.CanvasTexture {
  const cacheKey = `math_block_${text}_${bgColor}_${textColor}`;
  if (textureCache.has(cacheKey)) return textureCache.get(cacheKey) as THREE.CanvasTexture;

  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  // Background gradient
  const grad = ctx.createLinearGradient(0, 0, 0, 256);
  grad.addColorStop(0, bgColor);
  grad.addColorStop(1, '#9d174d');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 256, 256);

  // Bevel border
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
  ctx.lineWidth = 12;
  ctx.strokeRect(10, 10, 236, 236);

  ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
  ctx.lineWidth = 8;
  ctx.strokeRect(22, 22, 212, 212);

  // Decorative corner dots
  ctx.fillStyle = '#fde047';
  [
    [26, 26], [230, 26], [26, 230], [230, 230]
  ].forEach(([cx, cy]) => {
    ctx.beginPath();
    ctx.arc(cx, cy, 6, 0, Math.PI * 2);
    ctx.fill();
  });

  // Main text / numeral
  ctx.fillStyle = textColor;
  ctx.font = 'bold 110px "Fredoka", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Text shadow
  ctx.shadowColor = 'rgba(0, 0, 0, 0.45)';
  ctx.shadowBlur = 10;
  ctx.shadowOffsetY = 6;

  ctx.fillText(text, 128, 128);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;

  textureCache.set(cacheKey, texture);
  return texture;
}
