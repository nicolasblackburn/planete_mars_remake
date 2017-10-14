import {Game} from '../core/Game';
import {Sprite} from '../core/Sprite';

export class Player extends Sprite {
  private cursors: Phaser.CursorKeys;
  private maxVelocity: number = 60;
  private body2: p2.Body;

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
      this.body.velocity.y = -1;
    } else if (this.cursors.up.isDown) {
      this.body.velocity.y = -1;
    } else if (this.cursors.down.isDown) {
      this.body.velocity.y = 1;
    }

    if (this.cursors.left.isUp && this.cursors.right.isUp) {
      this.body.velocity.x = 0;
    } else if (this.cursors.right.isDown) {
      this.body.velocity.x = 1;
    } else if (this.cursors.left.isDown) {
      this.body.velocity.x = -1;
    }

    const {x, y} = this.body.velocity;
    const norm = Math.sqrt(x * x + y * y);
    if (norm) {
      this.body.velocity.x *= this.maxVelocity * pixelScale / norm ;
      this.body.velocity.y *= this.maxVelocity * pixelScale / norm;
    }
  }
}
