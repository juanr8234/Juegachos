import * as THREE from "three";
import { CYLINDER_RADIUS, TUNNEL_LENGTH } from "./constants";

function createGridTexture(): THREE.CanvasTexture {
  const size = 512;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;

  ctx.fillStyle = "#050014";
  ctx.fillRect(0, 0, size, size);

  const cells = 16;
  const step = size / cells;

  ctx.strokeStyle = "rgba(0, 255, 242, 0.35)";
  ctx.lineWidth = 2;
  ctx.shadowColor = "#00fff2";
  ctx.shadowBlur = 3;

  for (let i = 0; i <= cells; i++) {
    const p = i * step;
    ctx.beginPath();
    ctx.moveTo(p, 0);
    ctx.lineTo(p, size);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, p);
    ctx.lineTo(size, p);
    ctx.stroke();
  }

  ctx.strokeStyle = "rgba(255, 0, 230, 0.3)";
  ctx.lineWidth = 4;
  ctx.shadowColor = "#ff00e6";
  ctx.shadowBlur = 6;
  for (let i = 0; i <= cells; i += 4) {
    const p = i * step;
    ctx.beginPath();
    ctx.moveTo(0, p);
    ctx.lineTo(size, p);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(8, TUNNEL_LENGTH / 40);
  texture.anisotropy = 4;
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/** The endless neon tunnel the player travels through. */
export class Tunnel {
  readonly mesh: THREE.Mesh;
  private readonly texture: THREE.CanvasTexture;

  constructor() {
    this.texture = createGridTexture();

    const geometry = new THREE.CylinderGeometry(
      CYLINDER_RADIUS,
      CYLINDER_RADIUS,
      TUNNEL_LENGTH,
      48,
      1,
      true,
    );
    geometry.rotateX(Math.PI / 2);

    const material = new THREE.MeshBasicMaterial({
      map: this.texture,
      side: THREE.BackSide,
      fog: true,
    });

    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.position.z = -TUNNEL_LENGTH / 2 + 40;
  }

  /** Scrolls the grid texture to sell the illusion of forward motion. */
  scroll(distance: number): void {
    this.texture.offset.y -= distance * 0.05;
  }
}
