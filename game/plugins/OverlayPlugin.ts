import { Plugins } from "phaser";

type Props = Record<string, any>;

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
 *        this.overlay = this.overlays.open(Overlay, {});
 *      }
 *
 *      destroy() {
 *        if (this.overlay) {
 *            this.overlays.destroy(this.overlay);
 *        }
 *      }
 *    }
 *
 */
export class OverlayPlugin extends Plugins.BasePlugin {
  private overlays: Map<Symbol, any> = new Map();

  constructor(pluginManager: Plugins.PluginManager) {
    super(pluginManager);
  }

  public open(component: any, props?: Props) {
    const key = Symbol();
    const overlay = new component({
      target: this.game.domContainer,
      props
    });
    this.overlays.set(key, overlay);

    return key;
  }

  public close(key: Symbol) {
    const overlay = this.overlays.get(key);
    if (overlay) {
      overlay.$destroy();
      this.overlays.delete(key);
    }
  }

  public getContext(key: Symbol) {
    const overlay = this.overlays.get(key);
    if (overlay) {
      return overlay.$$.ctx;
    }
  }

  public setProps(key: Symbol, props: Props) {
    const overlay = this.overlays.get(key);
    if (overlay) {
      return overlay.$set(props);
    }
  }
}
