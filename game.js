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
   * Precarga de todos los assets del juego (imágenes, sonidos, etc)
   * La precarga se realiza de manera asíncrona mediante AJAX (buscar info de AJAX),
   * por lo que necesitaremos un servidor
   * Cuando está todo precargado se invoca create()
   */
  preload() {
    // Precargamos las imágenes
    // Params:          id asset,   ruta
    this.load.image("background", "assets/images/background.png");
    this.load.image("gameover", "assets/images/gameover.png");
    this.load.image("platform", "assets/images/platform.png");
    this.load.image("ball", "assets/images/ball.png");
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
    //Params:     coorX, coorY, id imagen
    this.add.image(400, 250, "background");
    this.gameoverImage = this.add.image(400, 90, "gameover"); // Guardamos la imagen en un obj
    this.gameoverImage.visible = false; // Ocultamos el gameover

    // Sistema de físicas, lo usamos cuando colocamos un asset que le afecta las físicas
    this.platform = this.physics.add.image(400, 460, "platform").setImmovable(); // Hacemos la plataforma inmovible
    // Platform no es afectado por la gravedad
    this.platform.body.allowGravity = false;
    this.platform.setCollideWorldBounds(true);

    this.ball = this.physics.add.image(400, 30, "ball");

    // Generemos velocidad random multiplicando 100 * nº entre 1.3 y 2
    let velocity = 100 * Phaser.Math.Between(1.3, 2);
    if (Phaser.Math.Between(0, 10) > 5) {
      // Aleatoriamente la velocidad será left o right, cambiando el signo
      velocity = 0 - velocity;
    }
    // Seteamos la velocidad random en la coorX, además de una en la coorY
    this.ball.setVelocity(velocity, 10);
    // La bola rebotará en los bordes con colisiones
    this.ball.setCollideWorldBounds(true);

    // Añadimos colisión entre la bola y la plataforma
    this.physics.add.collider(this.ball, this.platform);

    // Cuando la bola impacte rebotará con la misma fuerza, ya que el param es 1
    this.ball.setBounce(1);

    // Accedemos a las teclas
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  /**
   * Método que actualiza constantemente el juego
   */
  update() {
    if (this.cursors.left.isDown) {
      this.platform.setVelocityX(-500); // Velocidad al platform en la coorX
    } else if (this.cursors.right.isDown) {
      this.platform.setVelocityX(500);
    } else {
      this.platform.setVelocityX(0);
    }

    // Si la bola sale del mapa, gameover y pausamos la escena
    if (this.ball.y > 500) {
      this.gameoverImage.visible = true;
      this.scene.pause();
    }
  }
}
