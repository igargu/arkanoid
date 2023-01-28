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
    // Precargamos dos imágenes
    // Params:          id asset,   ruta
    this.load.image("background", "assets/images/background.png");
    this.load.image("gameover", "assets/images/gameover.png");
  }

  /**
   * Colocar todos los elementos de la escena
   */
  create() {
    // Añadimos una imagen al juego
    // Las coordenadas parten de arriba a la izquierda y las imgs se colocan
    // según su centro
    //Params:     coorX, coorY, id imagen
    this.add.image(400, 250, "background");
  }
}
