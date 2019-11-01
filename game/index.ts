import "./styles/styles.scss";
import { AUTO, Game, Types } from "phaser";

import BootScene from "./scenes/BootScene";
import { OverlayPlugin } from "./plugins/OverlayPlugin";
import { ControllerPlugin } from "./plugins/ControllerPlugin";

export const gameConfig: Types.Core.GameConfig = {
  type: AUTO,
  width: 800,
  height: 600,
  physics: {
    default: "arcade",
    arcade: {
      debug: process.env.GAME_ENV === "debug"
    }
  },
  parent: "game",
  dom: {
    createContainer: true
  },
  input: {
    gamepad: true
  },
  plugins: {
    scene: [
      {
        key: "OverlayPlugin",
        plugin: OverlayPlugin,
        start: true,
        mapping: "overlays"
      },
      {
        key: "ControllerPlugin",
        plugin: ControllerPlugin,
        start: true,
        mapping: "controller"
      }
    ]
  },
  backgroundColor: "#000000",
  scene: [BootScene]
};

const game = new Game(gameConfig);
