import { Scoreboard } from "../components/scoreboard.js";

/**
 * Escena del juego, es una clase que extienda la clase de Phaser
 * para crear una escena (buscar sobre extends)
 */
export class Game extends Phaser.Scene {
  /**
   * Inicialización de los objetos de la case
   */
  constructor() {
    super({ key: "game" }); // Inicializamos la escena del juego con una key única
  }

  // Métodos del ciclo de vida de una escena

  /**
   * Se ejecuta cada vez que iniciamos (por primera vez) o reiniciamos la escena
   */
  init() {
    this.scoreboard = new Scoreboard(this);
  }

  /**
   * Precarga de todos los assets del juego (imágenes, sonidos, etc)
   * La precarga se realiza de manera asíncrona mediante AJAX (buscar info de AJAX),
   * por lo que necesitaremos un servidor
   * Cuando está todo precargado se invoca create()
   */
  preload() {
    // Precargamos las imágenes
    // Params:          id asset,   ruta
    this.load.image("background", "images/background.png");
    this.load.image("platform", "images/platform.png");
    this.load.image("ball", "images/ball.png");
    this.load.image("brickBlue", "images/brickBlue.png");
    this.load.image("brickBlack", "images/brickBlack.png");
    this.load.image("brickGreen", "images/brickGreen.png");
    this.load.image("brickOrange", "images/brickOrange.png");
  }

  /**
   * Colocar todos los elementos de la escena
   */
  create() {
    // Establecemos colisiones en los bordes del mapa, excepto en el inferior
    this.physics.world.setBoundsCollision(true, true, true, false);

    // Añadimos una imagen al juego
    // Las coordenadas parten de arriba a la izquierda y las imgs se colocan
    // según su centro
    //Params: coorX, coorY, id imagen
    this.add.image(400, 250, "background");

    this.scoreboard.create();

    // Creamos un grupo para los ladrillos
    this.bricks = this.physics.add.staticGroup({
      key: ["brickBlue", "brickOrange", "brickGreen", "brickBlack"], // Elementos del grupo
      frameQuantity: 10, // Cantidad de cada uno de los elementos
      gridAlign: {
        // Colocamos los elementos en un sistema de rejilla
        width: 10, // Ancho de la rejilla
        height: 4, // Alto de la rejilla
        cellWidth: 67, // Ancho de las celdas de la rejilla
        cellHeight: 34, // Alto de las celdas de la rejilla
        x: 112, // CoorX del primer elemento de la rejilla
        y: 100, // CoordY del primer elemento de la rejilla
      },
    });

    // Sistema de físicas, lo usamos cuando colocamos un asset que le afecta las físicas
    this.platform = this.physics.add.image(400, 460, "platform").setImmovable(); // Hacemos la plataforma inmovible
    // Platform no es afectado por la gravedad
    this.platform.body.allowGravity = false;
    this.platform.setCollideWorldBounds(true);

    this.ball = this.physics.add.image(400, 439, "ball");
    // Guardmos un dato en un elemento
    this.ball.setData("glue", true);
    // La bola rebotará en los bordes con colisiones
    this.ball.setCollideWorldBounds(true);

    // Añadimos colisión entre la bola y la plataforma
    this.physics.add.collider(
      this.ball,
      this.platform,
      this.platformImpact, // Comportamiento a realizar cada vez que se produzca una colisión
      null, // Callback para indicar cuando hay colisión
      this // Contexto
    );

    // Añadimos colisión entre la bola y los ladrillos
    this.physics.add.collider(
      this.ball,
      this.bricks,
      this.brickImpact,
      null,
      this
    );

    // Cuando la bola impacte rebotará con la misma fuerza, ya que el param es 1
    this.ball.setBounce(1);

    // Accedemos a las teclas
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  /**
   * Comportamiento al impactar la bola en un ladrillo
   * @param {*} ball
   * @param {*} brick
   */
  brickImpact(ball, brick) {
    // Deshabilitamos el obj, Escondemos el objs
    brick.disableBody(true, true);
    this.scoreboard.incrementPoints(10);
    // Comprobamos si quedan elementos en el grupo
    if (this.bricks.countActive() === 0) {
      this.showCongratulations();
    }
  }

  /**
   * Comportamiento al impactar la bola en la plataforma
   * @param {*} ball
   * @param {*} plataform
   */
  platformImpact(ball, plataform) {
    this.scoreboard.incrementPoints(1);
    // Cambiamos la velocidad de la bola según la zona de colisión respecto a la plataforma para redirigirla
    let relativeImpact = ball.x - plataform.x;
    if (relativeImpact <= 0.1 && relativeImpact >= -0.1) {
      ball.setVelocityX(Phaser.Math.Between(-10, 10));
    } else {
      ball.setVelocityX(10 * relativeImpact);
    }
  }

  showGameOver() {
    this.scene.start("gameover");
  }

  showCongratulations() {
    this.scene.start("congratulations");
  }

  /**
   * Método que actualiza constantemente el juego
   */
  update() {
    if (this.cursors.left.isDown) {
      this.platform.setVelocityX(-500); // Velocidad al platform en la coorX
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

    // Si la bola sale del mapa, gameover y pausamos la escena
    if (this.ball.y > 500) {
      this.showGameOver();
    }

    if (this.cursors.up.isDown) {
      this.ball.setVelocity(-75, -300);
      this.ball.setData("glue", false);
    }
  }
}
