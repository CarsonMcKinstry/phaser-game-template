/**
 *
 * This plugin exposes an RxJS interface for WASD,
 * cursor keys, and gamepad input. This will start out with just 2 controller
 * mappings (PS4 and a Generic controller mapping), and expose a way to add
 * additional mappings.
 */
import { Plugins, Scene, Types, Input } from "phaser";
import { BehaviorSubject } from "rxjs";
import { throttleTime, tap } from "rxjs/operators";

export interface ButtonPresses {
  input?: string;
}

export interface ControllerMapping {
  A: string;
  B: string;
  X: string;
  Y: string;
  L1: string;
  L2: string;
  R1: string;
  R2: string;
}

export interface ControllerKeys {
  w: Input.Keyboard.Key; // dpad_up
  s: Input.Keyboard.Key; // dpad_down
  a: Input.Keyboard.Key; // dpad_left
  d: Input.Keyboard.Key; // dpad_right
  p: Input.Keyboard.Key; // apad_up
  space: Input.Keyboard.Key; // apad_down
  m: Input.Keyboard.Key; // apad_left
  c: Input.Keyboard.Key; // apad_right
  q: Input.Keyboard.Key; // l1
  e: Input.Keyboard.Key; // r1
  one: Input.Keyboard.Key; // l2
  three: Input.Keyboard.Key; // r2
}

export interface ControlerInfo {
  vendor?: string;
  product?: string;
}

export const DPAD_LEFT = "DPAD_left";
export const DPAD_UP = "DPAD_up";
export const DPAD_DOWN = "DPAD_down";
export const DPAD_RIGHT = "DPAD_right";
export const APAD_LEFT = "APAD_left";
export const APAD_UP = "APAD_up";
export const APAD_DOWN = "APAD_down";
export const APAD_RIGHT = "APAD_right";
export const L1 = "L1";
export const R1 = "R1";
export const L2 = "L2";
export const R2 = "R2";

export class ControllerPlugin extends Plugins.ScenePlugin {
  private _events: BehaviorSubject<ButtonPresses> = new BehaviorSubject({});
  private cursorKeys!: Types.Input.Keyboard.CursorKeys;
  private controllerKeys!: ControllerKeys;
  private pad?: Input.Gamepad.Gamepad;

  private controllerMapping?: ControllerMapping;
  private controllerMappings: Map<string, ControllerMapping> = new Map([
    [
      "Generic   USB  Joystick   (STANDARD GAMEPAD Vendor: 0079 Product: 0006)",
      {
        A: APAD_UP,
        B: APAD_RIGHT,
        X: APAD_DOWN,
        Y: APAD_LEFT,
        L1: L1,
        L2: L2,
        R1: R1,
        R2: R2
      }
    ],
    [
      "Wireless Controller (STANDARD GAMEPAD Vendor: 054c Product: 05c4)",
      {
        A: APAD_DOWN,
        B: APAD_RIGHT,
        X: APAD_LEFT,
        Y: APAD_UP,
        L1: L1,
        L2: L2,
        R1: R1,
        R2: R2
      }
    ]
  ]);

  constructor(scene: Scene, pluginManager: Plugins.PluginManager) {
    super(scene, pluginManager);
  }

  boot() {
    this.cursorKeys = this.scene.input.keyboard.createCursorKeys();

    this.controllerKeys = this.scene.input.keyboard.addKeys({
      w: Input.Keyboard.KeyCodes.W,
      s: Input.Keyboard.KeyCodes.S,
      a: Input.Keyboard.KeyCodes.A,
      d: Input.Keyboard.KeyCodes.D,
      m: Input.Keyboard.KeyCodes.M,
      p: Input.Keyboard.KeyCodes.P,
      q: Input.Keyboard.KeyCodes.Q,
      e: Input.Keyboard.KeyCodes.E,
      space: Input.Keyboard.KeyCodes.SPACE,
      c: Input.Keyboard.KeyCodes.C,
      one: Input.Keyboard.KeyCodes.ONE,
      three: Input.Keyboard.KeyCodes.THREE
    }) as ControllerKeys;

    // on each update we need to
    this.systems.events.on("update", () => {
      this.simulateDPAD();
      this.getPadMovement();
    });

    this.controllerKeys.p.on("down", this.mapToAction(APAD_UP)); // apad_up
    this.controllerKeys.space.on("down", this.mapToAction(APAD_DOWN)); // apad_down
    this.controllerKeys.m.on("down", this.mapToAction(APAD_LEFT)); // apad_left
    this.controllerKeys.c.on("down", this.mapToAction(APAD_RIGHT)); // apad_right
    this.controllerKeys.q.on("down", this.mapToAction(L1)); // l1
    this.controllerKeys.e.on("down", this.mapToAction(R1)); // r1
    this.controllerKeys.one.on("down", this.mapToAction(L2)); // l2
    this.controllerKeys.three.on("down", this.mapToAction(R2)); // r2

    this.scene.input.gamepad.on("connected", () => {
      this.pad = this.scene.input.gamepad.pad1;
      console.log(this.pad);
      this.controllerMapping = this.getControllerMapping(this.pad.id);

      this.scene.input.gamepad.on("down", this.simulateAPAD);
    });
  }

  private simulateDPAD() {
    if (this.cursorKeys.up!.isDown || this.controllerKeys.w.isDown) {
      this._events.next({
        input: DPAD_UP
      });
    }
    if (this.cursorKeys.down!.isDown || this.controllerKeys.s.isDown) {
      this._events.next({
        input: DPAD_DOWN
      });
    }
    if (this.cursorKeys.left!.isDown || this.controllerKeys.a.isDown) {
      this._events.next({
        input: DPAD_LEFT
      });
    }
    if (this.cursorKeys.right!.isDown || this.controllerKeys.d.isDown) {
      this._events.next({
        input: DPAD_RIGHT
      });
    }
  }

  private simulateAPAD = (e: any) => {
    if (this.controllerMapping) {
      if (e.A) {
        this._events.next({
          input: this.controllerMapping.A
        });
      } else if (e.B) {
        this._events.next({
          input: this.controllerMapping.B
        });
      } else if (e.X) {
        this._events.next({
          input: this.controllerMapping.X
        });
      } else if (e.Y) {
        this._events.next({
          input: this.controllerMapping.Y
        });
      }
    }
  };

  private mapToAction = (input: string) => {
    return () => {
      this._events.next({ input });
    };
  };

  private getPadMovement() {
    if (this.pad) {
      const up = this.pad.getButtonValue(12);
      const down = this.pad.getButtonValue(13);
      const left = this.pad.getButtonValue(14);
      const right = this.pad.getButtonValue(15);

      if (up) {
        this._events.next({ input: DPAD_UP });
      }
      if (down) {
        this._events.next({ input: DPAD_DOWN });
      }
      if (right) {
        this._events.next({ input: DPAD_RIGHT });
      }
      if (left) {
        this._events.next({ input: DPAD_LEFT });
      }
    }
  }

  private getControllerMapping(id: string) {
    const mapping = this.controllerMappings.get(id);

    return mapping ? mapping : undefined;
  }

  public addControllerMapping(id: string, mapping: ControllerMapping) {
    this.controllerMappings.set(id, mapping);
  }

  public getEvents(throttle?: 80) {
    if (throttle) {
      return this._events.pipe(throttleTime(throttle));
    }
    return this._events;
  }
}
