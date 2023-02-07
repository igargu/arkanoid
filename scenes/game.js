import { Scoreboard } from "../components/scoreboard.js";
import { LiveCounter } from "../components/livecounter.js";

export class Game extends Phaser.Scene {
  /**
   * Inicialización de los objetos de la case
   */
  constructor() {
    super({ key: "game" });
  }

  /**
   * Se ejecuta cada vez que iniciamos (por primera vez) o reiniciamos la escena
   */
  init() {
    this.scoreboard = new Scoreboard(this);
    this.liveCounter = new LiveCounter(this, 3);
  }

  /**
   * Precarga de todos los assets del juego (imágenes, sonidos, etc)
   */
  preload() {
    this.load.image("background", "images/background.png");
    this.load.image("platform", "images/platform.png");
    this.load.image("ball", "images/ball.png");
    this.load.image("brickBlue", "images/brickBlue.png");
    this.load.image("brickBlack", "images/brickBlack.png");
    this.load.image("brickGreen", "images/brickGreen.png");
    this.load.image("brickOrange", "images/brickOrange.png");

    this.load.audio("startgamesample", "sounds/start-game.mp3");
    this.load.audio("brickimpactsample", "sounds/brick-impact.mp3");
    this.load.audio("platformimpactsample", "sounds/platform-impact.mp3");
    this.load.audio("livelostsample", "sounds/live-lost.mp3");
  }

  /**
   * Colocar todos los elementos de la escena
   */
  create() {
    this.physics.world.setBoundsCollision(true, true, true, false);

    this.add.image(400, 250, "background");

    this.startGameSample = this.sound.add("startgamesample");
    this.brickImpactSample = this.sound.add("brickimpactsample");
    this.platformImpactSample = this.sound.add("platformimpactsample");

    this.scoreboard.create();

    this.liveCounter.create();
    this.liveLostSample = this.sound.add("livelostsample");

    this.bricks = this.physics.add.staticGroup({
      key: ["brickBlue", "brickOrange", "brickGreen", "brickBlack"],
      frameQuantity: 10,
      gridAlign: {
        width: 10,
        height: 4,
        cellWidth: 67,
        cellHeight: 34,
        x: 112,
        y: 100,
      },
    });

    this.platform = this.physics.add.image(400, 460, "platform").setImmovable();
    this.platform.body.allowGravity = false;
    this.platform.setCollideWorldBounds(true);

    this.ball = this.physics.add.image(400, 439, "ball");
    this.ball.setData("glue", true);
    this.ball.setCollideWorldBounds(true);

    this.physics.add.collider(
      this.ball,
      this.platform,
      this.platformImpact,
      null,
      this
    );

    this.physics.add.collider(
      this.ball,
      this.bricks,
      this.brickImpact,
      null,
      this
    );

    this.ball.setBounce(1);

    this.cursors = this.input.keyboard.createCursorKeys();
  }

  /**
   * Comportamiento al impactar la bola en un ladrillo
   * @param {*} ball
   * @param {*} brick
   */
  brickImpact(ball, brick) {
    brick.disableBody(true, true);
    this.scoreboard.incrementPoints(10);
    if (this.bricks.countActive() === 0) {
      this.showCongratulations();
    }
    this.brickImpactSample.play();
  }

  /**
   * Comportamiento al impactar la bola en la plataforma
   * @param {*} ball
   * @param {*} plataform
   */
  platformImpact(ball, plataform) {
    this.scoreboard.incrementPoints(1);
    let relativeImpact = ball.x - plataform.x;
    if (relativeImpact <= 0.1 && relativeImpact >= -0.1) {
      ball.setVelocityX(Phaser.Math.Between(-10, 10));
    } else {
      ball.setVelocityX(10 * relativeImpact);
    }
    this.platformImpactSample.play();
  }

  showGameOver() {
    this.scene.start("gameover");
  }

  showCongratulations() {
    this.scene.start("congratulations");
  }

  setInitialPlatformState() {
    this.liveLostSample.play();
    this.platform.x = 400;
    this.platform.y = 460;
    this.ball.setVelocity(0, 0);
    this.ball.x = 385;
    this.ball.y = 430;
    this.ball.setData("glue", true);
  }

  /**
   * Método que actualiza constantemente el juego
   */
  update() {
    if (this.cursors.left.isDown) {
      this.platform.setVelocityX(-500);
      if (this.ball.getData("glue")) {
        this.ball.setVelocityX(-500);
      }
    } else if (this.cursors.right.isDown) {
      this.platform.setVelocityX(500);
      if (this.ball.getData("glue")) {
        this.ball.setVelocityX(500);
      }
    } else {
      this.platform.setVelocityX(0);
      if (this.ball.getData("glue")) {
        this.ball.setVelocityX(0);
      }
    }

    if (this.ball.y > 500 && this.ball.active) {
      let gameNotFinished = this.liveCounter.liveLost();
      if (gameNotFinished) {
        this.setInitialPlatformState();
      }
    }

    if (this.cursors.up.isDown) {
      this.startGameSample.play();
      this.ball.setVelocity(-75, -300);
      this.ball.setData("glue", false);
    }
  }
}
