import { remote } from "electron";
import { Scene } from "phaser";

export default class BootScene extends Scene {
  constructor() {
    super("boot-scene");
  }

  preload() {
    this.load.setBaseURL(remote.app.getAppPath() + "assets");
    this.load.image("main_tiles", "tilesets/pipoya-rpg-32x32.png");
  }

  create() {
    this.add.text(20, 20, "Loading Game...");
  }
}
