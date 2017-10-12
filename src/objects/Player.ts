import Game from '../Game';
import Sprite from '../Sprite';

export default class Player extends Sprite {
  private cursors: Phaser.CursorKeys;
  private maxVelocity: number = 60;

  constructor(game: Game, x: number, y: number) {
    super(game, x, y, 'sprites', 'player-standing-down-00');

    const pixelScale = this.game2.pixelScale;

    this.texture.baseTexture.scaleMode = PIXI.scaleModes.NEAREST;
    this.scale.set(pixelScale);

    this.game.physics.enable(this, Phaser.Physics.P2JS);
    this.body.fixedRotation = true;
    this.body.setRectangle(8 * pixelScale, 11 * pixelScale, 0, 1 * pixelScale);
    //this.body.debug = true;

    this.cursors = this.game.input.keyboard.createCursorKeys();
  }

  public update() {
    const pixelScale = this.game2.pixelScale;

    if (this.cursors.up.isUp && this.cursors.down.isUp) {
      this.body.velocity.y = 0;
    } else if (this.cursors.up.isDown) {
      this.body.velocity.y = -this.maxVelocity * pixelScale;
    } else if (this.cursors.down.isDown) {
      this.body.velocity.y = this.maxVelocity * pixelScale;
    }

    if (this.cursors.left.isUp && this.cursors.right.isUp) {
      this.body.velocity.x = 0;
    } else if (this.cursors.right.isDown) {
      this.body.velocity.x = this.maxVelocity * pixelScale;
    } else if (this.cursors.left.isDown) {
      this.body.velocity.x = -this.maxVelocity * pixelScale;
    }
  }
}
