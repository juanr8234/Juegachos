/** Reads keyboard, mouse and touch input and exposes a single -1..1 steering direction. */
export class InputController {
  private readonly target: HTMLElement;
  private leftHeld = false;
  private rightHeld = false;
  private pointerDirection = 0;
  private pointerActive = false;

  constructor(target: HTMLElement) {
    this.target = target;
    window.addEventListener("keydown", this.onKeyDown);
    window.addEventListener("keyup", this.onKeyUp);
    target.addEventListener("pointerdown", this.onPointerDown);
    window.addEventListener("pointerup", this.onPointerUp);
    window.addEventListener("pointercancel", this.onPointerUp);
  }

  get direction(): number {
    if (this.pointerActive) return this.pointerDirection;
    if (this.leftHeld === this.rightHeld) return 0;
    return this.leftHeld ? -1 : 1;
  }

  dispose(): void {
    window.removeEventListener("keydown", this.onKeyDown);
    window.removeEventListener("keyup", this.onKeyUp);
    this.target.removeEventListener("pointerdown", this.onPointerDown);
    window.removeEventListener("pointerup", this.onPointerUp);
    window.removeEventListener("pointercancel", this.onPointerUp);
  }

  private onKeyDown = (e: KeyboardEvent): void => {
    if (e.code === "ArrowLeft" || e.code === "KeyA") this.leftHeld = true;
    if (e.code === "ArrowRight" || e.code === "KeyD") this.rightHeld = true;
  };

  private onKeyUp = (e: KeyboardEvent): void => {
    if (e.code === "ArrowLeft" || e.code === "KeyA") this.leftHeld = false;
    if (e.code === "ArrowRight" || e.code === "KeyD") this.rightHeld = false;
  };

  private onPointerDown = (e: PointerEvent): void => {
    this.pointerActive = true;
    this.pointerDirection = e.clientX < window.innerWidth / 2 ? -1 : 1;
  };

  private onPointerUp = (): void => {
    this.pointerActive = false;
    this.pointerDirection = 0;
  };
}
