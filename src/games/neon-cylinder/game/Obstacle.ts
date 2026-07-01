import * as THREE from "three";
import { LineMaterial } from "three/examples/jsm/lines/LineMaterial.js";
import { LineSegments2 } from "three/examples/jsm/lines/LineSegments2.js";
import { LineSegmentsGeometry } from "three/examples/jsm/lines/LineSegmentsGeometry.js";
import {
  CYLINDER_RADIUS,
  OBSTACLE_EDGE_WIDTH,
  OBSTACLE_FILL_COLOR,
  OBSTACLE_FILL_OPACITY,
  OBSTACLE_THICKNESS,
} from "./constants";
import { thetaToXY } from "./mathUtils";

export interface ObstacleOptions {
  z: number;
  gapStart: number;
  gapSize: number;
  color: number;
  spinSpeed: number;
}

/** A circular "pizza" wall obstacle with one missing slice to fly through. */
export class Obstacle {
  readonly group: THREE.Group;
  gapStart: number;
  readonly gapSize: number;
  private readonly spinSpeed: number;

  private readonly fillMesh: THREE.Mesh;
  private readonly edges: LineSegments2;

  resolved = false;

  constructor(opts: ObstacleOptions) {
    this.gapStart = opts.gapStart;
    this.gapSize = opts.gapSize;
    this.spinSpeed = opts.spinSpeed;

    const outerRadius = CYLINDER_RADIUS + 0.15;
    const segments = 40;
    const solidAngle = Math.PI * 2 - opts.gapSize;
    const startTheta = opts.gapStart + opts.gapSize;

    const shape = new THREE.Shape();
    shape.moveTo(0, 0);
    for (let i = 0; i <= segments; i++) {
      const theta = startTheta + (solidAngle * i) / segments;
      const [x, y] = thetaToXY(theta, outerRadius);
      shape.lineTo(x, y);
    }
    shape.lineTo(0, 0);

    const geometry = new THREE.ExtrudeGeometry(shape, {
      depth: OBSTACLE_THICKNESS,
      bevelEnabled: false,
      curveSegments: 1,
    });
    geometry.translate(0, 0, -OBSTACLE_THICKNESS / 2);

    // Light, translucent fill shared by every obstacle so overlapping shapes
    // never blend into a confusing mixed color — only the edge marks identity.
    const fillMaterial = new THREE.MeshBasicMaterial({
      color: OBSTACLE_FILL_COLOR,
      transparent: true,
      opacity: OBSTACLE_FILL_OPACITY,
      side: THREE.DoubleSide,
      depthWrite: false,
      fog: true,
    });
    this.fillMesh = new THREE.Mesh(geometry, fillMaterial);

    // Bold, fully opaque outline (screen-space fat line) so the silhouette
    // of the gap always reads clearly regardless of what's behind it.
    const edgesGeometry = new THREE.EdgesGeometry(geometry, 1);
    const lineGeometry = new LineSegmentsGeometry();
    lineGeometry.setPositions(edgesGeometry.attributes.position.array as Float32Array);
    edgesGeometry.dispose();

    const edgeMaterial = new LineMaterial({
      color: opts.color,
      linewidth: OBSTACLE_EDGE_WIDTH,
      transparent: false,
      depthWrite: true,
      fog: true,
    });
    edgeMaterial.resolution.set(window.innerWidth, window.innerHeight);
    this.edges = new LineSegments2(lineGeometry, edgeMaterial);

    this.group = new THREE.Group();
    this.group.add(this.fillMesh, this.edges);
    this.group.position.z = opts.z;
  }

  update(dt: number, dz: number): void {
    this.group.position.z += dz;
    if (this.spinSpeed !== 0) {
      this.gapStart += this.spinSpeed * dt;
      this.group.rotation.z += this.spinSpeed * dt;
    }
  }

  get z(): number {
    return this.group.position.z;
  }

  dispose(): void {
    this.fillMesh.geometry.dispose();
    (this.fillMesh.material as THREE.Material).dispose();
    this.edges.geometry.dispose();
    (this.edges.material as THREE.Material).dispose();
  }
}
