/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as THREE from 'three';
import { soundManager } from '../../audio/SoundSynthesizer';
import { CameraPerspective } from '../../types';

export interface DesignLevelData {
  levelNumber: number;
  title: string;
  rule: 'complementary' | 'analogous' | 'triadic';
  targetBaseHue: number;
  targetAccentHue: number;
  description: string;
}

export const DESIGN_LEVELS: DesignLevelData[] = [
  { levelNumber: 1, title: 'Komplementer Merah & Hijau', rule: 'complementary', targetBaseHue: 0, targetAccentHue: 180, description: 'Dua warna yang berseberangan 180° pada roda warna menghasilkan kontras maksimal.' },
  { levelNumber: 2, title: 'Komplementer Biru & Oranye', rule: 'complementary', targetBaseHue: 210, targetAccentHue: 30, description: 'Warna sejuk biru laut dipadukan dengan kehangatan oranye matahari senja.' },
  { levelNumber: 3, title: 'Komplementer Ungu & Kuning', rule: 'complementary', targetBaseHue: 270, targetAccentHue: 90, description: 'Pasangan warna royal klasik dengan daya tarik visual yang kuat.' },
  { levelNumber: 4, title: 'Analogus Hangat Sunset', rule: 'analogous', targetBaseHue: 10, targetAccentHue: 40, description: 'Warna-warna bertetangga selisih 30° menciptakan transisi lembut yang menenangkan.' },
  { levelNumber: 5, title: 'Analogus Samudera Sejuk', rule: 'analogous', targetBaseHue: 200, targetAccentHue: 230, description: 'Gradasi biru muda ke biru tua memberikan kesan profesional dan segar.' },
  { levelNumber: 6, title: 'Analogus Hutan Tropis', rule: 'analogous', targetBaseHue: 90, targetAccentHue: 120, description: 'Kombinasi hijau limau dan daun rimbun yang menyatu secara organik.' },
  { levelNumber: 7, title: 'Triadik Primer Enerjik', rule: 'triadic', targetBaseHue: 0, targetAccentHue: 120, description: 'Tiga warna membentuk segitiga sama sisi (120°) yang seimbang dan ceria.' },
  { levelNumber: 8, title: 'Triadik Pastel Manis', rule: 'triadic', targetBaseHue: 330, targetAccentHue: 90, description: 'Harmoni segitiga dengan nuansa permen kapas yang memikat.' },
  { levelNumber: 9, title: 'Triadik Cyber Neon', rule: 'triadic', targetBaseHue: 180, targetAccentHue: 300, description: 'Kombinasi sian, magenta, dan kuning untuk nuansa futuristik berkilau.' },
  { levelNumber: 10, title: 'Komplementer Magenta & Limau', rule: 'complementary', targetBaseHue: 320, targetAccentHue: 140, description: 'Kontras pop-art modern yang sangat populer di industri mode terkini.' },
  { levelNumber: 11, title: 'Analogus Lavender & Mawar', rule: 'analogous', targetBaseHue: 280, targetAccentHue: 310, description: 'Palet feminin elegan dengan ritme warna yang lembut.' },
  { levelNumber: 12, title: 'Triadik Emas Kerajaan', rule: 'triadic', targetBaseHue: 45, targetAccentHue: 165, description: 'Keseimbangan emas, zamrud, dan safir untuk busana agung.' },
  { levelNumber: 13, title: 'Komplementer Indigo & Amber', rule: 'complementary', targetBaseHue: 240, targetAccentHue: 60, description: 'Kontras kedalaman malam dan kilau permata amber.' },
  { levelNumber: 14, title: 'Analogus Fajar Pagi', rule: 'analogous', targetBaseHue: 50, targetAccentHue: 80, description: 'Perpaduan kuning hangat menuju hijau muda yang memberi energi positif.' },
  { levelNumber: 15, title: 'Triadik Bunga Sakura', rule: 'triadic', targetBaseHue: 340, targetAccentHue: 100, description: 'Harmoni triadik musim semi yang mempesona para perancang busana.' },
  { levelNumber: 16, title: 'Komplementer Toska & Karang', rule: 'complementary', targetBaseHue: 170, targetAccentHue: 350, description: 'Inspirasi terumbu karang tropis dengan kontras visual tinggi.' },
  { levelNumber: 17, title: 'Analogus Malam Aurora', rule: 'analogous', targetBaseHue: 150, targetAccentHue: 180, description: 'Cahaya utara misterius yang berpendar di langit Arktik.' },
  { levelNumber: 18, title: 'Triadik Retro 80-an', rule: 'triadic', targetBaseHue: 290, targetAccentHue: 50, description: 'Palet nostalgia bernuansa kaset disko dan lampu neon kota malam.' },
  { levelNumber: 19, title: 'Komplementer Safir & Emas Murni', rule: 'complementary', targetBaseHue: 220, targetAccentHue: 40, description: 'Kaidah kontras tertinggi untuk perhiasan dan busana karpet merah.' },
  { levelNumber: 20, title: 'Haute Couture: Master Harmoni Warna', rule: 'triadic', targetBaseHue: 300, targetAccentHue: 60, description: 'Puncak estetika desainer atelier! Penguasaan penuh seluruh harmoni warna 3D.' },
];

export class ColorAtelierGame {
  public scene: THREE.Scene;
  public camera: THREE.PerspectiveCamera;

  // Level State
  public currentLevelIdx = 0;
  public currentLevelData = DESIGN_LEVELS[0];

  // Selected colors
  public baseHue = 330;
  public accentHue = 150;
  public currentHarmonyRule: 'complementary' | 'analogous' | 'triadic' = 'complementary';
  public harmonyScore = 95;
  public isLevelFinished = false;

  private mannequinTorso!: THREE.Mesh;
  private mannequinSkirt!: THREE.Mesh;
  private backgroundPanel!: THREE.Mesh;
  private colorWheelRing!: THREE.Group;

  constructor(initialLevel = 0) {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color('#241133');

    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
    this.camera.position.set(0, 1.6, 5);
    this.camera.lookAt(new THREE.Vector3(0, 1.2, 0));

    this.setupLighting();
    this.setupStudio();
    this.setupMannequin();

    this.loadLevel(initialLevel);
  }

  public loadLevel(levelIdx: number) {
    this.currentLevelIdx = Math.max(0, Math.min(levelIdx, DESIGN_LEVELS.length - 1));
    this.currentLevelData = DESIGN_LEVELS[this.currentLevelIdx];

    // Rotate starting harmony rule on level >= 2 so player must identify the brief rule
    const rules: Array<'complementary' | 'analogous' | 'triadic'> = ['complementary', 'analogous', 'triadic'];
    const targetIdx = rules.indexOf(this.currentLevelData.rule);
    this.currentHarmonyRule =
      this.currentLevelIdx >= 1 ? rules[(targetIdx + 1) % 3] : this.currentLevelData.rule;

    // Start off-target for both baseHue and accentHue
    this.baseHue = (this.currentLevelData.targetBaseHue + 70 + ((levelIdx * 23) % 120)) % 360;
    this.accentHue = (this.currentLevelData.targetAccentHue + 95 + ((levelIdx * 19) % 110)) % 360;
    this.isLevelFinished = false;

    this.evaluateHarmony();
    this.updateMaterials();
  }

  private setupLighting() {
    const key = new THREE.DirectionalLight('#ffffff', 1.8);
    key.position.set(4, 5, 4);
    this.scene.add(key);

    const fill = new THREE.DirectionalLight('#c084fc', 0.9);
    fill.position.set(-4, 3, 3);
    this.scene.add(fill);

    const rim = new THREE.DirectionalLight('#38bdf8', 1.5);
    rim.position.set(0, 5, -4);
    this.scene.add(rim);

    this.scene.add(new THREE.AmbientLight('#a855f7', 0.5));
  }

  private setupStudio() {
    // Pedestal
    const stageGeo = new THREE.CylinderGeometry(1.8, 2.0, 0.3, 32);
    const stageMat = new THREE.MeshStandardMaterial({ color: '#38164f', roughness: 0.3, metalness: 0.2 });
    const stage = new THREE.Mesh(stageGeo, stageMat);
    stage.position.y = -0.15;
    this.scene.add(stage);

    const stageRing = new THREE.Mesh(
      new THREE.TorusGeometry(1.82, 0.04, 8, 48),
      new THREE.MeshBasicMaterial({ color: '#facc15' })
    );
    stageRing.rotation.x = Math.PI / 2;
    stageRing.position.y = 0.01;
    this.scene.add(stageRing);

    // Fashion Backdrop Screen
    const panelGeo = new THREE.PlaneGeometry(6, 4.5);
    const panelMat = new THREE.MeshStandardMaterial({ color: '#2a123d', roughness: 0.8 });
    this.backgroundPanel = new THREE.Mesh(panelGeo, panelMat);
    this.backgroundPanel.position.set(0, 2.25, -2.2);
    this.scene.add(this.backgroundPanel);

    // 3D Floating Color Wheel Halo behind mannequin
    this.colorWheelRing = new THREE.Group();
    this.colorWheelRing.position.set(0, 1.55, -1.6);
    for (let i = 0; i < 12; i++) {
      const segAngle = (i / 12) * Math.PI * 2;
      const hue = Math.round((i / 12) * 360);
      const gem = new THREE.Mesh(
        new THREE.OctahedronGeometry(0.16, 0),
        new THREE.MeshStandardMaterial({
          color: `hsl(${hue}, 85%, 60%)`,
          emissive: `hsl(${hue}, 85%, 45%)`,
          emissiveIntensity: 0.65,
        })
      );
      gem.position.set(Math.cos(segAngle) * 1.45, Math.sin(segAngle) * 1.45, 0);
      this.colorWheelRing.add(gem);
    }
    this.scene.add(this.colorWheelRing);
  }

  private setupMannequin() {
    const mannequinGroup = new THREE.Group();

    const rod = new THREE.Mesh(
      new THREE.CylinderGeometry(0.04, 0.04, 1.2, 8),
      new THREE.MeshStandardMaterial({ color: '#cbd5e1', metalness: 0.8, roughness: 0.2 })
    );
    rod.position.y = 0.6;
    mannequinGroup.add(rod);

    const torsoGeo = new THREE.CylinderGeometry(0.26, 0.18, 0.7, 16);
    this.mannequinTorso = new THREE.Mesh(torsoGeo, new THREE.MeshToonMaterial());
    this.mannequinTorso.position.y = 1.35;
    mannequinGroup.add(this.mannequinTorso);

    const skirtGeo = new THREE.ConeGeometry(0.42, 0.6, 16);
    this.mannequinSkirt = new THREE.Mesh(skirtGeo, new THREE.MeshToonMaterial());
    this.mannequinSkirt.position.y = 0.85;
    mannequinGroup.add(this.mannequinSkirt);

    const hat = new THREE.Mesh(
      new THREE.CylinderGeometry(0.35, 0.35, 0.08, 16),
      new THREE.MeshStandardMaterial({ color: '#1e1b4b' })
    );
    hat.position.y = 1.85;
    mannequinGroup.add(hat);

    this.scene.add(mannequinGroup);
  }

  public setBaseHue(hue: number) {
    this.baseHue = hue;
    this.evaluateHarmony();
    this.updateMaterials();
  }

  public setAccentHue(hue: number) {
    this.accentHue = hue;
    this.evaluateHarmony();
    this.updateMaterials();
  }

  public setHarmonyRule(rule: 'complementary' | 'analogous' | 'triadic') {
    this.currentHarmonyRule = rule;
    this.evaluateHarmony();
    this.updateMaterials();
  }

  private circularHueDiff(a: number, b: number): number {
    let diff = Math.abs(a - b) % 360;
    if (diff > 180) diff = 360 - diff;
    return diff;
  }

  private evaluateHarmony() {
    const pairDiff = this.circularHueDiff(this.baseHue, this.accentHue);

    let targetDiff = 180;
    if (this.currentHarmonyRule === 'analogous') targetDiff = 30;
    if (this.currentHarmonyRule === 'triadic') targetDiff = 120;

    const pairError = Math.abs(pairDiff - targetDiff);
    const baseError = this.circularHueDiff(this.baseHue, this.currentLevelData.targetBaseHue);
    const rulePenalty = this.currentHarmonyRule === this.currentLevelData.rule ? 0 : 40;

    const rawScore = 100 - (pairError / 180) * 80 - (baseError / 180) * 40 - rulePenalty;
    this.harmonyScore = Math.max(15, Math.min(100, Math.round(rawScore)));

    const ruleMatches = this.currentHarmonyRule === this.currentLevelData.rule;
    if (ruleMatches && baseError <= 18 && this.harmonyScore >= 95 && !this.isLevelFinished) {
      this.isLevelFinished = true;
      soundManager.playCorrect();
      soundManager.playLevelVictory();
    }
  }

  private updateMaterials() {
    const baseColor = new THREE.Color(`hsl(${this.baseHue}, 85%, 60%)`);
    const accentColor = new THREE.Color(`hsl(${this.accentHue}, 85%, 60%)`);

    (this.mannequinTorso.material as THREE.MeshToonMaterial).color = baseColor;
    (this.mannequinSkirt.material as THREE.MeshToonMaterial).color = accentColor;
  }

  public update(delta: number, _cameraMode: CameraPerspective = 'tpp') {
    this.mannequinTorso.rotation.y += delta * 0.4;
    this.mannequinSkirt.rotation.y += delta * 0.4;
    if (this.colorWheelRing) {
      this.colorWheelRing.rotation.z += delta * 0.25;
    }
  }
}
