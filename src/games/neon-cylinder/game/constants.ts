export const CYLINDER_RADIUS = 6;
export const TUNNEL_LENGTH = 400;

export const PLAYER_RADIUS = 0.32;
export const PLAYER_ORBIT_RADIUS = CYLINDER_RADIUS - PLAYER_RADIUS - 0.05;
export const PLAYER_ROTATE_SPEED = Math.PI * 1.15; // rad/s

export const CAMERA_Z = 10;
export const PLAYER_Z = 0;

export const BACKGROUND_COLOR = 0x05000a;
export const FOG_NEAR = 18;
export const FOG_FAR = 165;

export const BASE_SPEED = 17; // units/s obstacles travel toward the player
export const MAX_SPEED = 80;
export const SPEED_RAMP_PER_SEC = 1.6;

export const OBSTACLE_SPACING_MIN = 14;
export const OBSTACLE_SPACING_MAX = 20;
export const OBSTACLE_THICKNESS = 0.55;
export const OBSTACLE_SPAWN_START_Z = -60;
// Obstacles are removed shortly after passing the player rather than the
// camera — letting a large disc drift right up to/through the camera makes
// it balloon across the whole screen and blows out the bloom.
export const OBSTACLE_DESPAWN_MARGIN = 4;
export const OBSTACLE_ACTIVE_COUNT = 9;

export const OBSTACLE_FILL_COLOR = 0xeaf6ff; // shared light tint, keeps overlapping obstacles legible
export const OBSTACLE_FILL_OPACITY = 0.1;
export const OBSTACLE_EDGE_WIDTH = 2.5; // px, rendered via LineMaterial (fat lines)

export const GAP_ANGLE_START = Math.PI / 2.4; // ~75deg
export const GAP_ANGLE_MIN = Math.PI / 3.6; // ~50deg
export const GAP_SHRINK_PER_POINT = 0.012;

export const COLLISION_TOLERANCE = 0.045; // rad, forgiveness at gap edges

export const NEON_COLORS = [0xff00e6, 0x00fff2, 0x7b2ff7, 0xff2975, 0x00ff85, 0xffe600];

export const BEST_SCORE_KEY = "neon-cylinder-best";
