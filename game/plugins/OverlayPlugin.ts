import { Plugins, Game } from "phaser";

type Props = Record<string, any>;

class Overlay {
  private _component: any;

  constructor(
    private component: any,
    private overlayKey: Symbol,
    private overlayManager: OverlayPlugin,
    private game: Game
  ) {}

  public open(props?: Props) {
    this._component = new this.component(this.game.domContainer, {
      props
    });
  }

  public close() {
    this._component.$destroy();
  }

  public destroy() {
    this.overlayManager.remove(this.overlayKey);
  }

  public get context() {
    return this._component.$$.ctx;
  }

  public set props(props: Props) {
    this._component.$set(props);
  }
}

/**
 * Overlay Plugin
 *
 * This plugin handles the management of overlays.
 * Overlays are written in Svelte 3, and will be compiled
 * on creation. Simply import this module in the game config
 * and use it where you like.
 *
 *  @example
 *    import { OverlayPlugin } from '../plugins/OverlayPlugin';
 *    import { Scene } from 'phaser';
 *
 *    import Overlay from '../overlays/Overlay.svelte';
 *
 *    export class MyScene extends Scene {
 *
 *      // required by typescript to know what this.overlays is
 *      overlays!: OverlayPlugin;
 *
 *      overlay?: Symbol;
 *
 *      create() {
 *        // create an overlay by passing the svelte component into the `open` method
 *        this.overlay = this.overlays.create(Overlay);
 *
 *        this.overlay.open();
 *      }
 *
 *      destroy() {
 *        this.overlay.close();
 *      }
 *    }
 *
 */
export class OverlayPlugin extends Plugins.BasePlugin {
  private overlays: Map<Symbol, any> = new Map();

  constructor(pluginManager: Plugins.PluginManager) {
    super(pluginManager);
  }

  public create(component: any) {
    const key = Symbol();

    const overlay = new Overlay(component, key, this, this.game);

    this.overlays.set(key, overlay);

    return overlay;
  }

  public remove(key: Symbol) {
    this.overlays.delete(key);
  }
}
