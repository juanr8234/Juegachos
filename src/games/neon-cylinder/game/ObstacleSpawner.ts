import * as THREE from "three";
import { Obstacle } from "./Obstacle";
import {
  COLLISION_TOLERANCE,
  GAP_ANGLE_MIN,
  GAP_ANGLE_START,
  GAP_SHRINK_PER_POINT,
  NEON_COLORS,
  OBSTACLE_ACTIVE_COUNT,
  OBSTACLE_DESPAWN_MARGIN,
  OBSTACLE_SPACING_MAX,
  OBSTACLE_SPACING_MIN,
  OBSTACLE_SPAWN_START_Z,
  PLAYER_ORBIT_RADIUS,
  PLAYER_RADIUS,
} from "./constants";
import { normalizeAngle } from "./mathUtils";

export type ObstacleEvent = "hit" | "passed";

const PLAYER_HALF_WIDTH = Math.asin(PLAYER_RADIUS / PLAYER_ORBIT_RADIUS);

/** Owns the lifecycle of obstacles: spawning ahead, scrolling, and resolving passes/hits. */
export class ObstacleSpawner {
  private readonly scene: THREE.Scene;
  private readonly obstacles: Obstacle[] = [];
  private nextSpawnZ = OBSTACLE_SPAWN_START_Z;
  private colorIndex = 0;

  constructor(scene: THREE.Scene) {
    this.scene = scene;
  }

  reset(): void {
    for (const obstacle of this.obstacles) {
      this.scene.remove(obstacle.group);
      obstacle.dispose();
    }
    this.obstacles.length = 0;
    this.nextSpawnZ = OBSTACLE_SPAWN_START_Z;
    this.colorIndex = 0;
  }

  update(dt: number, dz: number, playerAngle: number, playerZ: number, score: number): ObstacleEvent[] {
    const events: ObstacleEvent[] = [];

    for (const obstacle of this.obstacles) {
      obstacle.update(dt, dz);

      if (!obstacle.resolved && obstacle.z >= playerZ) {
        obstacle.resolved = true;
        events.push(this.isSafe(playerAngle, obstacle) ? "passed" : "hit");
      }
    }

    for (let i = this.obstacles.length - 1; i >= 0; i--) {
      const obstacle = this.obstacles[i];
      if (obstacle.z > playerZ + OBSTACLE_DESPAWN_MARGIN) {
        this.scene.remove(obstacle.group);
        obstacle.dispose();
        this.obstacles.splice(i, 1);
      }
    }

    while (this.obstacles.length < OBSTACLE_ACTIVE_COUNT) {
      this.spawnNext(score);
    }

    return events;
  }

  private isSafe(playerAngle: number, obstacle: Obstacle): boolean {
    const relLow = normalizeAngle(playerAngle - PLAYER_HALF_WIDTH - obstacle.gapStart);
    const relHigh = normalizeAngle(playerAngle + PLAYER_HALF_WIDTH - obstacle.gapStart);
    const limit = obstacle.gapSize + COLLISION_TOLERANCE;
    return relLow <= limit && relHigh <= limit;
  }

  private spawnNext(score: number): void {
    const gapSize = Math.max(GAP_ANGLE_MIN, GAP_ANGLE_START - score * GAP_SHRINK_PER_POINT);
    const gapStart = Math.random() * Math.PI * 2;
    const spins = Math.random() < 0.35;
    const spinSpeed = spins ? (Math.random() < 0.5 ? -1 : 1) * (0.4 + Math.random() * 0.6) : 0;
    const color = NEON_COLORS[this.colorIndex % NEON_COLORS.length];
    this.colorIndex++;

    const obstacle = new Obstacle({ z: this.nextSpawnZ, gapStart, gapSize, color, spinSpeed });
    this.obstacles.push(obstacle);
    this.scene.add(obstacle.group);
    const spacing = OBSTACLE_SPACING_MIN + Math.random() * (OBSTACLE_SPACING_MAX - OBSTACLE_SPACING_MIN);
    this.nextSpawnZ -= spacing;
  }
}
