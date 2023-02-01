/**
 * Archivo con la configuración del juego
 */
import { Game } from "./game.js";

const config = {
  type: Phaser.AUTO, // Permite que el navegador use webgl o canvas según el soporte que tenga
  width: 800, // Ancho del juego
  height: 500, // Alto del juego
  scene: [Game], // Escena del juego (pantallas dentro del juego)
  physics: {
    // Definición del sistema de físicas que utilizamos
    default: "arcade", // Sistema por defecto: arcade
    arcade: {
      // Propiedades del sistema arcade
      debug: false, // Buscar en docs sobre esto
    },
  },
};

// Instanciamos el juego
var game = new Phaser.Game(config);
