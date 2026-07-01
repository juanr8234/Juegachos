const TWO_PI = Math.PI * 2;

/** Normalizes an angle (radians) into the [0, 2PI) range. */
export function normalizeAngle(a: number): number {
  const wrapped = a % TWO_PI;
  return wrapped < 0 ? wrapped + TWO_PI : wrapped;
}

/**
 * Converts an orbit angle into XY coordinates. theta = 0 sits at the bottom
 * of the tunnel (-Y) and increases toward +X, matching "moving right".
 */
export function thetaToXY(theta: number, radius: number): [number, number] {
  return [radius * Math.sin(theta), -radius * Math.cos(theta)];
}
