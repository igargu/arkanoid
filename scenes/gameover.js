import { RestartButton } from "../components/restartButton.js";

export class Gameover extends Phaser.Scene {
  constructor() {
    super({ key: "gameover" });
    this.restartButton = new RestartButton(this);
  }

  preload() {
    this.load.image("gameover", "images/gameover.png");
    this.load.audio("gameoversample", "sounds/gameover.mp3");
    this.restartButton.preload();
  }

  create() {
    this.add.image(410, 250, "background");
    this.gameOverSample = this.sound.add("gameoversample");
    this.restartButton.create();
    this.gameoverImage = this.add.image(400, 90, "gameover");
    this.gameOverSample.play();
  }
}
