# Timber!

Timberman clone in Three.js (cartoon 3D). The player is a lumberjack at the base of an
endlessly growing trunk. Each input **chops from one side** (left or right): the bottom log
flies off, the whole trunk drops one segment, and a fresh segment spawns on top. Branches
stick out of some segments on the left or right — if the log at the lumberjack's height has a
branch on the **side he chops from**, the branch hits him and the run ends. A **timer bar**
drains continuously (faster as the score climbs) and refills a chunk on every chop, so you
must keep talando fast. Score = number of logs chopped.

Controls: Left/Right arrows or A/D, or tap the left/right half of the screen. Each is a
discrete chop toward that side.

## Module layout

- `main.ts` — entry point, mounts `Game` into `#app`.
- `game/Game.ts` — scene/camera/renderer, ACESFilmic tone mapping + an `EffectComposer` with a
  subtle bloom pass, lights + soft shadows, sky-gradient background + fog, the ground, the
  state machine (`ready` / `countdown` / `playing` / `gameover`), timer logic, chop handling
  and the render loop (`tick`, which calls `composer.render()`). Also holds the camera-shake juice.
- `game/materials.ts` — the shared cartoon look: a cached `toon(color)` (MeshToonMaterial with a
  4-step gradient map), `outlined(geo, mat, scale)` which wraps a mesh with an inverted-hull
  (back-side, dark, scaled-up) outline, and `flatGeo(geo)` which splits vertices so a geometry
  renders as low-poly facets (MeshToonMaterial has no `flatShading`). Everything visual uses these.
- `game/Environment.ts` — decorative backdrop group (rolling hills, drifting low-poly clouds,
  bushes, rocks, background trees); `update(dt)` drifts the clouds. Pure eye-candy, no gameplay.
- `game/Tree.ts` — the stacked trunk: builds/recycles segment groups, generates branches
  (with `SAFE_START_SEGMENTS` branch-free at the base and a same-side run cap), the drop
  animation, and the flying chopped-log pieces. `bottomBranch` is the branch at the
  lumberjack's height (the death check reads it before `chop()` shifts the stack).
- `game/Lumberjack.ts` — cartoon lumberjack from primitives; `setSide` mirrors the model with
  `scale.x` so the axe always faces the trunk; `chop()` triggers the axe swing.
- `game/InputController.ts` — keyboard + pointer input queued as discrete chop sides, drained
  once per frame by the loop.
- `game/Hud.ts` — DOM overlay: score, best, the timer bar (`setTimer(0..1)`, hue green->red),
  start/game-over screens, and the countdown label.
- `game/SoundEffects.ts` — synthesized Web Audio effects: countdown tick, woody chop, crash.
- `game/constants.ts` — all tunable values (geometry, branch odds, timer drain/gain, juice).
  **Tune here first.**

## Non-obvious gotchas

**Chop / death ordering:** in `Game.processInput` the death check is `tree.bottomBranch === side`
**before** calling `tree.chop(side)`. `bottomBranch` is the branch on the log currently at the
lumberjack's height; `chop()` then removes that log and shifts the stack. Reversing the order
would test the wrong segment. The input queue is drained fully each frame (fast tapping is
responsive), but the loop `return`s the moment a chop is fatal.

**Segment recycling:** `Tree.chop()` reuses the shifted-off bottom `THREE.Group` as the new
top segment (re-skinned by `applySegment`) instead of allocating — the visible count stays
`VISIBLE_SEGMENTS`. Each segment group is `[trunk, ring, (branch, leaf)?]`; `applySegment`
rebuilds only the branch children.

**Lumberjack mirroring:** `setSide` sets `group.scale.x = -dir` so the same model faces the
trunk from either side. Don't add left/right-specific meshes expecting a fixed orientation.

**Branch generation fairness:** every segment carries at most one branch (never both sides, so
there is no unavoidable death), and `MAX_SAME_SIDE_RUN` caps consecutive same-side branches.
The bottom `SAFE_START_SEGMENTS` are branch-free on reset so you are never killed on the first
chop.

**Enter-to-start countdown:** mandatory shared pattern. From start/game-over, Enter/Space
(wired in `Hud`) or a tap enters the `countdown` state showing 3 / 2 / 1 / YA
(`COUNTDOWN_LABELS`, `COUNTDOWN_STEP`s each, in `Game.ts`) with a 750 Hz tick per label, then
play begins. The timer bar is shown full during the countdown.

## Room mode (multiplayer)

Wired to the shared party mode: the constructor calls
`initRoomMode("timberman", { getScore: () => this.score, onStart: () => this.beginCountdown() })`
(see root `CLAUDE.md`, "Salas"). With `?room=` the game-over reports the score to the room
instead of the global ranking and the restart input is blocked (one run per round). `getScore`
returns the live chop count for the timeout partial. Default scoring (higher is better), so
`meta.ts` declares no `scoring` block.

## Possible upgrades

The lumberjack and tree are procedural primitives so the game works with zero assets. A nicer
lumberjack could be modeled in Blender and exported to glTF (see the `blender-web-pipeline`
skill), then loaded with `GLTFLoader` in place of `Lumberjack`'s primitive build — keep the
`setSide` / `chop` interface so `Game.ts` is untouched.
