/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface InputState {
  forward: boolean;
  backward: boolean;
  left: boolean;
  right: boolean;
  sprint: boolean;
  virtualSprint: boolean;
  jump: boolean;
  interact: boolean;
  virtualX: number; // -1 to 1 from joystick
  virtualY: number; // -1 to 1 from joystick
}

class InputManager {
  private state: InputState = {
    forward: false,
    backward: false,
    left: false,
    right: false,
    sprint: false,
    virtualSprint: false,
    jump: false,
    interact: false,
    virtualX: 0,
    virtualY: 0,
  };

  private listenersAttached = false;
  private actionSubscribers: Array<(action: 'jump' | 'interact') => void> = [];

  // Pointer drag look state
  private isPointerDown = false;
  private activePointerId: number | null = null;
  private lastPointerX = 0;
  private lastPointerY = 0;
  private pointerDeltaX = 0;
  private pointerDeltaY = 0;
  private zoomDelta = 0;

  constructor() {
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.handlePointerDown = this.handlePointerDown.bind(this);
    this.handlePointerMove = this.handlePointerMove.bind(this);
    this.handlePointerUp = this.handlePointerUp.bind(this);
    this.handleWheel = this.handleWheel.bind(this);
  }

  public init() {
    if (this.listenersAttached || typeof window === 'undefined') return;
    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('keyup', this.handleKeyUp);
    window.addEventListener('blur', this.handleBlur);
    window.addEventListener('pointerdown', this.handlePointerDown, { passive: false });
    window.addEventListener('pointermove', this.handlePointerMove, { passive: false });
    window.addEventListener('pointerup', this.handlePointerUp);
    window.addEventListener('pointercancel', this.handlePointerUp);
    window.addEventListener('wheel', this.handleWheel, { passive: true });
    this.listenersAttached = true;
  }

  public destroy() {
    if (!this.listenersAttached || typeof window === 'undefined') return;
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('keyup', this.handleKeyUp);
    window.removeEventListener('blur', this.handleBlur);
    window.removeEventListener('pointerdown', this.handlePointerDown);
    window.removeEventListener('pointermove', this.handlePointerMove);
    window.removeEventListener('pointerup', this.handlePointerUp);
    window.removeEventListener('pointercancel', this.handlePointerUp);
    window.removeEventListener('wheel', this.handleWheel);
    this.listenersAttached = false;
  }

  private handlePointerDown(e: PointerEvent) {
    const target = e.target as HTMLElement | null;
    if (target) {
      if (
        ['BUTTON', 'INPUT', 'SELECT', 'TEXTAREA', 'A'].includes(target.tagName) ||
        target.closest('button') ||
        target.closest('input') ||
        target.closest('form') ||
        target.closest('[data-no-camera-drag]')
      ) {
        return;
      }
    }

    if (e.pointerType === 'mouse' && e.button !== 0 && e.button !== 2) {
      return;
    }

    if (e.pointerType === 'touch') {
      const isJoystickZone = e.clientX < 180 && e.clientY > window.innerHeight - 180;
      if (isJoystickZone) return;
    }

    this.isPointerDown = true;
    this.activePointerId = e.pointerId;
    this.lastPointerX = e.clientX;
    this.lastPointerY = e.clientY;
  }

  private handlePointerMove(e: PointerEvent) {
    if (!this.isPointerDown || e.pointerId !== this.activePointerId) return;
    const dx = e.clientX - this.lastPointerX;
    const dy = e.clientY - this.lastPointerY;
    this.lastPointerX = e.clientX;
    this.lastPointerY = e.clientY;

    this.pointerDeltaX += dx;
    this.pointerDeltaY += dy;
  }

  private handlePointerUp(e: PointerEvent) {
    if (e.pointerId === this.activePointerId) {
      this.isPointerDown = false;
      this.activePointerId = null;
    }
  }

  private handleWheel(e: WheelEvent) {
    this.zoomDelta += e.deltaY * 0.002;
  }

  public consumePointerDelta(): { dx: number; dy: number; isDragging: boolean } {
    const dx = this.pointerDeltaX;
    const dy = this.pointerDeltaY;
    const isDragging = this.isPointerDown;
    this.pointerDeltaX = 0;
    this.pointerDeltaY = 0;
    return { dx, dy, isDragging };
  }

  public consumeZoomDelta(): number {
    const z = this.zoomDelta;
    this.zoomDelta = 0;
    return z;
  }

  public isDraggingLook(): boolean {
    return this.isPointerDown;
  }

  private handleKeyDown(e: KeyboardEvent) {
    const tag = (e.target as HTMLElement)?.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA') return;

    if (['ArrowUp', 'KeyW'].includes(e.code)) this.state.forward = true;
    if (['ArrowDown', 'KeyS'].includes(e.code)) this.state.backward = true;
    if (['ArrowLeft', 'KeyA'].includes(e.code)) this.state.left = true;
    if (['ArrowRight', 'KeyD'].includes(e.code)) this.state.right = true;
    if (e.code === 'ShiftLeft' || e.code === 'ShiftRight' || e.shiftKey) {
      this.state.sprint = true;
    }

    if (e.code === 'Space' && !e.repeat) {
      this.state.jump = true;
      this.notifyAction('jump');
    }

    if (e.code === 'KeyE' && !e.repeat) {
      this.state.interact = true;
      this.notifyAction('interact');
    }
  }

  private handleKeyUp(e: KeyboardEvent) {
    if (['ArrowUp', 'KeyW'].includes(e.code)) this.state.forward = false;
    if (['ArrowDown', 'KeyS'].includes(e.code)) this.state.backward = false;
    if (['ArrowLeft', 'KeyA'].includes(e.code)) this.state.left = false;
    if (['ArrowRight', 'KeyD'].includes(e.code)) this.state.right = false;
    if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') {
      this.state.sprint = false;
    }
    if (e.code === 'Space') this.state.jump = false;
    if (e.code === 'KeyE') this.state.interact = false;
  }

  private handleBlur() {
    this.state.forward = false;
    this.state.backward = false;
    this.state.left = false;
    this.state.right = false;
    this.state.sprint = false;
    this.state.virtualSprint = false;
    this.state.jump = false;
    this.state.interact = false;
    this.state.virtualX = 0;
    this.state.virtualY = 0;
    this.isPointerDown = false;
    this.activePointerId = null;
  }

  public setVirtualJoystick(x: number, y: number) {
    this.state.virtualX = x;
    this.state.virtualY = y;
  }

  public setVirtualSprint(active: boolean) {
    this.state.virtualSprint = active;
  }

  public isSprinting(): boolean {
    return this.state.sprint || this.state.virtualSprint;
  }

  public triggerAction(action: 'jump' | 'interact') {
    if (action === 'jump') {
      this.state.jump = true;
      setTimeout(() => { this.state.jump = false; }, 150);
    } else if (action === 'interact') {
      this.state.interact = true;
      setTimeout(() => { this.state.interact = false; }, 150);
    }
    this.notifyAction(action);
  }

  public subscribeAction(cb: (action: 'jump' | 'interact') => void) {
    this.actionSubscribers.push(cb);
    return () => {
      this.actionSubscribers = this.actionSubscribers.filter(fn => fn !== cb);
    };
  }

  private notifyAction(action: 'jump' | 'interact') {
    this.actionSubscribers.forEach(cb => cb(action));
  }

  /**
   * Returns normalized movement vector [x, z] where z is forward (+1 forward, -1 back)
   */
  public getMovementVector(): { x: number; z: number; isMoving: boolean } {
    let x = 0;
    let z = 0;

    if (this.state.forward) z += 1;
    if (this.state.backward) z -= 1;
    if (this.state.left) x -= 1;
    if (this.state.right) x += 1;

    if (Math.abs(this.state.virtualX) > 0.05 || Math.abs(this.state.virtualY) > 0.05) {
      x += this.state.virtualX;
      z += -this.state.virtualY;
    }

    const len = Math.hypot(x, z);
    if (len > 0.01) {
      const scale = Math.min(len, 1.0) / len;
      return { x: x * scale, z: z * scale, isMoving: true };
    }

    return { x: 0, z: 0, isMoving: false };
  }

  public isJumping(): boolean {
    return this.state.jump;
  }

  public isInteracting(): boolean {
    return this.state.interact;
  }
}

export const inputManager = new InputManager();
