import "./styles/styles.scss";
import { AUTO, Game, Types } from "phaser";

import BootScene from "./scenes/BootScene";

export const gameConfig: Types.Core.GameConfig = {
  type: AUTO,
  width: Number(process.env.GAME_WIDTH) || 800,
  height: Number(process.env.GAME_HEIGHT) || 600,
  physics: {
    default: "arcade",
    arcade: {
      debug: process.env.GAME_ENV === "debug"
    }
  },
  backgroundColor: "#000000",
  scene: [BootScene]
};

const game = new Game(gameConfig);
