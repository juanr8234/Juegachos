// Tunable values for Timber! — chop-the-tree reflex game.
// Tune here first before touching gameplay logic.

export const BEST_SCORE_KEY = "mg:timberman:best";

/** Colors (cartoon palette). */
export const SKY_TOP_COLOR = "#5bb8e8";
export const SKY_BOTTOM_COLOR = "#cdeef0";
export const GROUND_COLOR = "#7ac74f";
export const GROUND_EDGE_COLOR = "#8a5a34";
export const TRUNK_COLOR_A = "#a9743d";
export const TRUNK_COLOR_B = "#8f5f2f";
export const TRUNK_RING_COLOR = "#e7c48a";
export const BRANCH_COLOR = "#7c5127";
export const LEAF_COLORS = ["#66c14a", "#4fa838", "#84d05a"];

/** Geometry. */
export const TRUNK_RADIUS = 0.72;
export const SEG_HEIGHT = 1.15;
/** How many trunk segments are stacked/visible above the base at once. */
export const VISIBLE_SEGMENTS = 9;
/** X offset where the lumberjack stands on each side (world units). */
export const PLAYER_SIDE_X = 1.55;
/** Branch reaches out this far from the trunk center toward the player. */
export const BRANCH_LENGTH = 1.55;

/** How many bottom segments are guaranteed branch-free at run start. */
export const SAFE_START_SEGMENTS = 3;
/** Probability a freshly spawned top segment carries a branch. */
export const BRANCH_CHANCE = 0.58;
/** Never allow more than this many branches in a row on the same side. */
export const MAX_SAME_SIDE_RUN = 2;

/** Timer bar (0..1). Reaching 0 ends the run. */
export const TIMER_START = 1;
export const TIMER_MAX = 1;
/** Base drain per second when idle. */
export const TIMER_DRAIN_BASE = 0.3;
/** Extra drain per point of score (difficulty ramp). */
export const TIMER_DRAIN_RAMP = 0.002;
export const TIMER_DRAIN_MAX = 0.85;
/** Amount the bar refills on each successful chop. */
export const TIMER_GAIN = 0.11;

/** Chop juice. */
export const CHOP_ANIM_TIME = 0.12;
export const DROP_ANIM_TIME = 0.09;
export const CAMERA_SHAKE = 0.06;
