export class LiveCounter {
  constructor(scene, initialLives) {
    this.relatedScene = scene;
    this.initialLives = initialLives;
  }

  create() {
    let displacement = 60;
    let firstPosition = 800 - this.initialLives * displacement;
    this.liveImages = this.relatedScene.physics.add.staticGroup({
      setScale: { x: 0.5, y: 0.5 },
      key: "platform",
      frameQuantity: this.initialLives,
      gridAlign: {
        width: this.initialLives,
        height: 1,
        cellWidth: displacement,
        cellHeight: 30,
        x: firstPosition,
        y: 30,
      },
    });
  }

  liveLost() {
    if (this.liveImages.countActive() <= 1) {
      this.relatedScene.showGameOver();
      return false;
    }
    let currentLiveLost = this.liveImages.getFirstAlive();
    currentLiveLost.disableBody(true, true);
    return true;
  }
}
