import { RestartButton } from "../components/restartButton.js";

export class Congratulations extends Phaser.Scene {
  constructor() {
    super({ key: "congratulations" });
    this.restartButton = new RestartButton(this);
  }

  preload() {
    this.load.image("congratulations", "images/congratulations.png");
    this.load.audio("winsample", "sounds/you-win.mp3");
    this.restartButton.preload();
  }

  create() {
    this.add.image(410, 250, "background");
    this.winSample = this.sound.add("winsample");
    this.restartButton.create();
    this.congratsImage = this.add.image(400, 90, "congratulations");
    this.winSample.play();
  }
}
