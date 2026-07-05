import * as THREE from "three";
import { toon, outlined, flatGeo } from "./materials";
import { LEAF_COLORS } from "./constants";

const leafGeo = flatGeo(new THREE.IcosahedronGeometry(1, 0));
const rockGeo = flatGeo(new THREE.IcosahedronGeometry(0.4, 0));
const cloudGeo = flatGeo(new THREE.IcosahedronGeometry(1, 1));

/** Decorative backdrop: rolling hills, drifting clouds, bushes and stray rocks. */
export class Environment {
  readonly group = new THREE.Group();
  private readonly clouds: { mesh: THREE.Object3D; speed: number }[] = [];

  constructor() {
    this.buildHills();
    this.buildClouds();
    this.buildBushes();
    this.buildRocks();
    this.buildBackgroundTrees();
  }

  update(dt: number): void {
    for (const c of this.clouds) {
      c.mesh.position.x += c.speed * dt;
      if (c.mesh.position.x > 22) c.mesh.position.x = -22;
    }
  }

  private buildHills(): void {
    const tones = ["#5fa63c", "#6fb84a", "#7cc656"];
    const specs = [
      { x: -10, z: -16, s: 11, t: 0 },
      { x: 12, z: -18, s: 13, t: 0 },
      { x: 2, z: -22, s: 16, t: 1 },
      { x: -16, z: -13, s: 8, t: 2 },
    ];
    for (const h of specs) {
      const hill = new THREE.Mesh(
        new THREE.SphereGeometry(h.s, 24, 16),
        toon(tones[h.t]),
      );
      hill.position.set(h.x, -h.s + 1.2, h.z);
      hill.scale.y = 0.55;
      hill.receiveShadow = true;
      this.group.add(hill);
    }
  }

  private buildClouds(): void {
    const white = toon("#ffffff");
    const specs = [
      { x: -8, y: 9, z: -12, s: 1.5 },
      { x: 6, y: 11, z: -14, s: 1.9 },
      { x: 14, y: 8, z: -10, s: 1.3 },
      { x: -15, y: 12, z: -16, s: 1.7 },
    ];
    for (const c of specs) {
      const cloud = new THREE.Group();
      const offs = [
        [0, 0, 0, 1],
        [-1.1, -0.2, 0.2, 0.75],
        [1.1, -0.1, -0.2, 0.8],
        [0.3, 0.5, 0.1, 0.65],
      ];
      for (const o of offs) {
        const puff = new THREE.Mesh(cloudGeo, white);
        puff.position.set(o[0] * c.s, o[1] * c.s, o[2] * c.s);
        puff.scale.setScalar(o[3] * c.s);
        cloud.add(puff);
      }
      cloud.position.set(c.x, c.y, c.z);
      this.group.add(cloud);
      this.clouds.push({ mesh: cloud, speed: 0.25 + Math.random() * 0.3 });
    }
  }

  private buildBushes(): void {
    const specs = [
      { x: -3.6, z: 1.8, s: 0.9 },
      { x: 3.9, z: 1.2, s: 1.1 },
      { x: -2.4, z: -2.6, s: 0.8 },
      { x: 3.2, z: -2.4, s: 0.75 },
    ];
    for (const b of specs) {
      const bush = new THREE.Group();
      for (let i = 0; i < 3; i++) {
        const blob = outlined(leafGeo, toon(LEAF_COLORS[i % LEAF_COLORS.length]), 1.06);
        blob.scale.setScalar((0.5 + Math.random() * 0.2) * b.s);
        blob.position.set((Math.random() - 0.5) * b.s, 0.1 * b.s, (Math.random() - 0.5) * b.s);
        bush.add(blob);
      }
      bush.position.set(b.x, 0.1, b.z);
      this.group.add(bush);
    }
  }

  private buildRocks(): void {
    const rock = toon("#9aa0a6");
    const specs = [
      { x: -4.5, z: 0.2, s: 0.7 },
      { x: 4.4, z: -0.6, s: 0.55 },
      { x: 2.6, z: 2.8, s: 0.5 },
      { x: -3.1, z: 3.0, s: 0.6 },
    ];
    for (const r of specs) {
      const mesh = outlined(rockGeo, rock, 1.08);
      mesh.scale.setScalar(r.s);
      mesh.position.set(r.x, r.s * 0.25, r.z);
      mesh.rotation.set(Math.random(), Math.random(), Math.random());
      this.group.add(mesh);
    }
  }

  private buildBackgroundTrees(): void {
    const trunkMat = toon("#8f5f2f");
    const specs = [
      { x: -8, z: -6, s: 1.2 },
      { x: 8.5, z: -7, s: 1.4 },
      { x: -12, z: -9, s: 1.0 },
    ];
    for (const t of specs) {
      const tree = new THREE.Group();
      const trunk = outlined(new THREE.CylinderGeometry(0.4, 0.5, 3, 10), trunkMat);
      trunk.position.y = 1.5;
      const crown = outlined(leafGeo, toon(LEAF_COLORS[1]), 1.05);
      crown.scale.setScalar(1.8);
      crown.position.y = 3.8;
      tree.add(trunk, crown);
      tree.position.set(t.x, 0, t.z);
      tree.scale.setScalar(t.s);
      this.group.add(tree);
    }
  }
}
