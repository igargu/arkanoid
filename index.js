/**
 * Archivo con la configuración del juego
 */
import { Game } from "./scenes/game.js";
import { Gameover } from "./scenes/gameover.js";
import { Congratulations } from "./scenes/congratulations.js";

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 500,
  scene: [Game, Gameover, Congratulations],
  physics: {
    default: "arcade",
    arcade: {
      debug: false,
    },
  },
};

var game = new Phaser.Game(config);
