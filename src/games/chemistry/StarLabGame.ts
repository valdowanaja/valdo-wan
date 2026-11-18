/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as THREE from 'three';
import { soundManager } from '../../audio/SoundSynthesizer';
import { CameraPerspective } from '../../types';

export interface ChemLevelData {
  levelNumber: number;
  title: string;
  formula: string;
  requiredAtoms: Record<string, number>;
  availableAtoms: Array<'H' | 'O' | 'C' | 'N'>;
  description: string;
}

export const CHEM_LEVELS: ChemLevelData[] = [
  { levelNumber: 1, title: 'Gas Hidrogen', formula: 'H₂', requiredAtoms: { H: 2 }, availableAtoms: ['H', 'O'], description: 'Dua atom hidrogen berbagi sepasang elektron membentuk ikatan kovalen tunggal.' },
  { levelNumber: 2, title: 'Gas Oksigen', formula: 'O₂', requiredAtoms: { O: 2 }, availableAtoms: ['H', 'O', 'C'], description: 'Dua atom oksigen membentuk ikatan kovalen rangkap dua (O=O) yang kita hirup setiap saat.' },
  { levelNumber: 3, title: 'Molekul Air', formula: 'H₂O', requiredAtoms: { H: 2, O: 1 }, availableAtoms: ['H', 'O', 'C'], description: 'Satu atom oksigen mengikat dua atom hidrogen dengan sudut ikatan 104.5° polar.' },
  { levelNumber: 4, title: 'Karbon Dioksida', formula: 'CO₂', requiredAtoms: { C: 1, O: 2 }, availableAtoms: ['C', 'O', 'H'], description: 'Atom karbon di pusat berikatan rangkap dua dengan dua atom oksigen linear.' },
  { levelNumber: 5, title: 'Gas Metana', formula: 'CH₄', requiredAtoms: { C: 1, H: 4 }, availableAtoms: ['C', 'H', 'O'], description: 'Hidrokarbon paling sederhana dengan geometri molekul tetrahedral simetris.' },
  { levelNumber: 6, title: 'Gas Amonia', formula: 'NH₃', requiredAtoms: { N: 1, H: 3 }, availableAtoms: ['N', 'H', 'O'], description: 'Satu atom nitrogen berikatan dengan tiga hidrogen membentuk piramida trigonal.' },
  { levelNumber: 7, title: 'Gas Ozon Pelindung Bumi', formula: 'O₃', requiredAtoms: { O: 3 }, availableAtoms: ['O', 'N', 'C'], description: 'Alotrop oksigen dengan tiga atom yang menyerap radiasi ultraviolet berbahaya di stratosfer.' },
  { levelNumber: 8, title: 'Karbon Monoksida', formula: 'CO', requiredAtoms: { C: 1, O: 1 }, availableAtoms: ['C', 'O', 'H'], description: 'Gas tak berwarna berikatan kovalen koordinasi rangkap tiga antara karbon dan oksigen.' },
  { levelNumber: 9, title: 'Hidrogen Peroksida', formula: 'H₂O₂', requiredAtoms: { H: 2, O: 2 }, availableAtoms: ['H', 'O', 'C'], description: 'Cairan pengoksidasi kuat dengan ikatan peroksida tunggal (-O-O-).' },
  { levelNumber: 10, title: 'Gas Dinitrogen Monoksida', formula: 'N₂O', requiredAtoms: { N: 2, O: 1 }, availableAtoms: ['N', 'O', 'H'], description: 'Gas gelak yang digunakan dalam anestesi medis dan pendorong roket.' },
  { levelNumber: 11, title: 'Formaldehida', formula: 'CH₂O', requiredAtoms: { C: 1, H: 2, O: 1 }, availableAtoms: ['C', 'H', 'O'], description: 'Senyawa aldehida paling sederhana yang merupakan prekursor polimer industri.' },
  { levelNumber: 12, title: 'Asam Format Semut', formula: 'CH₂O₂', requiredAtoms: { C: 1, H: 2, O: 2 }, availableAtoms: ['C', 'H', 'O'], description: 'Asam karboksilat alami yang disemprotkan semut sebagai mekanisme pertahanan.' },
  { levelNumber: 13, title: 'Gas Etilena', formula: 'C₂H₄', requiredAtoms: { C: 2, H: 4 }, availableAtoms: ['C', 'H', 'O'], description: 'Alkena dengan ikatan rangkap dua karbon-karbon yang mematangkan buah di alam.' },
  { levelNumber: 14, title: 'Gas Asetilena', formula: 'C₂H₂', requiredAtoms: { C: 2, H: 2 }, availableAtoms: ['C', 'H', 'O'], description: 'Gas las suhu tinggi dengan ikatan kovalen rangkap tiga (C≡C) berenergi besar.' },
  { levelNumber: 15, title: 'Metanol Bahan Bakar', formula: 'CH₄O', requiredAtoms: { C: 1, H: 4, O: 1 }, availableAtoms: ['C', 'H', 'O'], description: 'Alkohol paling sederhana yang digunakan sebagai pelarut dan bahan bakar terbarukan.' },
  { levelNumber: 16, title: 'Urea Pupuk Tanaman', formula: 'CH₄N₂O', requiredAtoms: { C: 1, H: 4, N: 2, O: 1 }, availableAtoms: ['C', 'H', 'N', 'O'], description: 'Senyawa organik pertama yang berhasil disintesis Friedrich Wöhler pada tahun 1828.' },
  { levelNumber: 17, title: 'Asam Sianida', formula: 'HCN', requiredAtoms: { H: 1, C: 1, N: 1 }, availableAtoms: ['H', 'C', 'N'], description: 'Senyawa gas dengan ikatan rangkap tiga karbon-nitrogen yang sangat reaktif.' },
  { levelNumber: 18, title: 'Gas Etana', formula: 'C₂H₆', requiredAtoms: { C: 2, H: 6 }, availableAtoms: ['C', 'H', 'O'], description: 'Alkana rantai tunggal hidrokarbon jenuh komponen gas alam.' },
  { levelNumber: 19, title: 'Etanol Biofuel', formula: 'C₂H₆O', requiredAtoms: { C: 2, H: 6, O: 1 }, availableAtoms: ['C', 'H', 'O'], description: 'Molekul bio-etanol ramah lingkungan hasil fermentasi glukosa oleh ragi.' },
  { levelNumber: 20, title: 'Master Sintesis Molekul Kosmik', formula: 'C₃H₈O (Propanol)', requiredAtoms: { C: 3, H: 8, O: 1 }, availableAtoms: ['C', 'H', 'O'], description: 'Puncak sintesis kimia laboratorium bintang! Penguasaan penuh stoikiometri dan valensi.' },
];

export class StarLabGame {
  public scene: THREE.Scene;
  public camera: THREE.PerspectiveCamera;

  // Level State
  public currentLevelIdx = 0;
  public currentLevelData = CHEM_LEVELS[0];

  // Molecular state
  public targetMolecule = CHEM_LEVELS[0].title;
  public requiredAtoms = CHEM_LEVELS[0].requiredAtoms;
  public selectedAtoms: string[] = [];
  public isSynthesized = false;
  public isLevelFinished = false;
  public overloadMessage: string | null = null;

  private atomMeshes: THREE.Mesh[] = [];
  private moleculePreviewGroup = new THREE.Group();
  private orbitalRings: THREE.Mesh[] = [];
  private chamberLight!: THREE.PointLight;
  private overloadFlashTimer = 0;

  constructor(initialLevel = 0) {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color('#0a192f');

    this.camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
    this.camera.position.set(0, 1.6, 5);
    this.camera.lookAt(new THREE.Vector3(0, 1.2, 0));

    this.scene.add(this.moleculePreviewGroup);
    this.moleculePreviewGroup.position.set(0, 1.35, 0);

    this.setupLighting();
    this.setupReactionChamber();
    this.setupFloatingAtoms();

    this.loadLevel(initialLevel);
  }

  public loadLevel(levelIdx: number) {
    this.currentLevelIdx = Math.max(0, Math.min(levelIdx, CHEM_LEVELS.length - 1));
    this.currentLevelData = CHEM_LEVELS[this.currentLevelIdx];
    this.targetMolecule = `${this.currentLevelData.title} (${this.currentLevelData.formula})`;
    this.requiredAtoms = this.currentLevelData.requiredAtoms;
    this.selectedAtoms = [];
    this.isSynthesized = false;
    this.isLevelFinished = false;
    this.overloadMessage = null;
    this.overloadFlashTimer = 0;
    if (this.chamberLight) {
      this.chamberLight.color.set('#10b981');
    }
    this.rebuildMoleculePreview();
  }

  private setupLighting() {
    const key = new THREE.DirectionalLight('#38bdf8', 1.8);
    key.position.set(3, 4, 4);
    this.scene.add(key);

    this.chamberLight = new THREE.PointLight('#10b981', 1.8, 7);
    this.chamberLight.position.set(0, 1.8, 0.5);
    this.scene.add(this.chamberLight);

    this.scene.add(new THREE.AmbientLight('#0f172a', 0.6));
  }

  private setupReactionChamber() {
    // Space-station holo pedestal & spinning electron orbital rings
    const pad = new THREE.Mesh(
      new THREE.CylinderGeometry(1.4, 1.6, 0.2, 32),
      new THREE.MeshStandardMaterial({ color: '#0f172a', metalness: 0.7, roughness: 0.25 })
    );
    pad.position.set(0, 0.05, 0);
    this.scene.add(pad);

    for (let i = 0; i < 2; i++) {
      const orb = new THREE.Mesh(
        new THREE.TorusGeometry(1.15 + i * 0.25, 0.025, 8, 48),
        new THREE.MeshBasicMaterial({
          color: i === 0 ? '#38bdf8' : '#10b981',
          transparent: true,
          opacity: 0.6,
        })
      );
      orb.position.set(0, 1.35, 0);
      orb.rotation.x = i === 0 ? 0.65 : -0.65;
      this.orbitalRings.push(orb);
      this.scene.add(orb);
    }
  }

  private setupFloatingAtoms() {
    const atoms = [
      { sym: 'H', color: '#f8fafc', pos: new THREE.Vector3(-2.3, 2.0, -1.2) },
      { sym: 'H', color: '#f8fafc', pos: new THREE.Vector3(-1.9, 0.8, -0.8) },
      { sym: 'O', color: '#ef4444', pos: new THREE.Vector3(2.2, 1.9, -1.0) },
      { sym: 'C', color: '#475569', pos: new THREE.Vector3(-2.0, 2.4, -1.6) },
      { sym: 'N', color: '#3b82f6', pos: new THREE.Vector3(2.1, 0.9, -1.3) },
    ];

    atoms.forEach((a) => {
      const geo = new THREE.SphereGeometry(a.sym === 'H' ? 0.16 : 0.25, 16, 16);
      const mat = new THREE.MeshStandardMaterial({
        color: a.color,
        roughness: 0.2,
        metalness: 0.2,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.copy(a.pos);
      this.atomMeshes.push(mesh);
      this.scene.add(mesh);
    });
  }

  private rebuildMoleculePreview() {
    while (this.moleculePreviewGroup.children.length > 0) {
      const child = this.moleculePreviewGroup.children[0] as THREE.Mesh;
      this.moleculePreviewGroup.remove(child);
      if (child.geometry) child.geometry.dispose();
    }

    if (this.selectedAtoms.length === 0) return;

    const colorMap: Record<string, string> = {
      H: '#f8fafc',
      O: '#ef4444',
      C: '#475569',
      N: '#3b82f6',
    };
    const radiusMap: Record<string, number> = {
      H: 0.17,
      O: 0.27,
      C: 0.30,
      N: 0.26,
    };

    // Place heavier core atom first, rest bonded radially around it
    const sorted = [...this.selectedAtoms].sort((a, b) => (radiusMap[b] || 0.2) - (radiusMap[a] || 0.2));
    const corePos = new THREE.Vector3(0, 0, 0);

    sorted.forEach((sym, idx) => {
      const r = radiusMap[sym] || 0.22;
      const mat = new THREE.MeshStandardMaterial({
        color: colorMap[sym] || '#ffffff',
        emissive: colorMap[sym] || '#ffffff',
        emissiveIntensity: 0.2,
        roughness: 0.2,
      });
      const sphere = new THREE.Mesh(new THREE.SphereGeometry(r, 16, 16), mat);

      if (idx === 0) {
        sphere.position.copy(corePos);
      } else {
        const ang = ((idx - 1) / Math.max(1, sorted.length - 1)) * Math.PI * 2;
        const dist = 0.62;
        const pos = new THREE.Vector3(Math.cos(ang) * dist, Math.sin(ang) * dist * 0.65, Math.sin(ang * 2) * 0.25);
        sphere.position.copy(pos);

        // Covalent Bond Cylinder connecting to core
        const bondLen = pos.length();
        const bond = new THREE.Mesh(
          new THREE.CylinderGeometry(0.045, 0.045, bondLen, 8),
          new THREE.MeshStandardMaterial({ color: '#bae6fd', emissive: '#38bdf8', emissiveIntensity: 0.4 })
        );
        bond.position.copy(pos).multiplyScalar(0.5);
        bond.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), pos.clone().normalize());
        this.moleculePreviewGroup.add(bond);
      }
      this.moleculePreviewGroup.add(sphere);
    });
  }

  public addAtom(type: 'H' | 'O' | 'C' | 'N') {
    if (this.isLevelFinished) return;

    const currentCount = this.selectedAtoms.filter((s) => s === type).length;
    const needed = this.requiredAtoms[type] || 0;

    // Strict valence / stoichiometry check: adding wrong or excess atom destabilizes molecule!
    if (needed === 0 || currentCount + 1 > needed) {
      soundManager.playError();
      this.overloadMessage = `${type} overload!`;
      this.overloadFlashTimer = 0.6;
      if (this.chamberLight) {
        this.chamberLight.color.set('#ef4444');
      }
      this.selectedAtoms = [];
      this.rebuildMoleculePreview();
      return;
    }

    this.overloadMessage = null;
    soundManager.playPickup();
    this.selectedAtoms.push(type);
    this.rebuildMoleculePreview();

    const counts: Record<string, number> = {};
    this.selectedAtoms.forEach((sym) => {
      counts[sym] = (counts[sym] || 0) + 1;
    });

    const isMatch =
      Object.keys(this.requiredAtoms).every((sym) => counts[sym] === this.requiredAtoms[sym]) &&
      Object.keys(counts).every((sym) => counts[sym] === this.requiredAtoms[sym]);

    if (isMatch && !this.isLevelFinished) {
      this.isSynthesized = true;
      this.isLevelFinished = true;
      soundManager.playCorrect();
      soundManager.playLevelVictory();
    }
  }

  public resetAtoms() {
    this.selectedAtoms = [];
    this.isSynthesized = false;
    this.overloadMessage = null;
    this.rebuildMoleculePreview();
  }

  public update(delta: number, _cameraMode: CameraPerspective = 'tpp') {
    if (this.overloadFlashTimer > 0) {
      this.overloadFlashTimer -= delta;
      if (this.overloadFlashTimer <= 0 && this.chamberLight) {
        this.chamberLight.color.set('#10b981');
      }
    }

    this.moleculePreviewGroup.rotation.y += delta * 0.9;
    this.orbitalRings.forEach((ring, i) => {
      ring.rotation.z += delta * (i === 0 ? 0.7 : -0.55);
      ring.rotation.y += delta * 0.35;
    });
    this.atomMeshes.forEach((mesh, idx) => {
      mesh.position.y += Math.sin(Date.now() * 0.002 + idx) * 0.0015;
      mesh.rotation.y += delta * 0.5;
    });
  }
}
