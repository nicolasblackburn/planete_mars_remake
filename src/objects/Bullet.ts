import {Direction} from '../core/Direction';
import {Game} from '../core/Game';
import {Sprite} from '../core/Sprite';

export class Bullet extends Sprite {
  private maxVelocity: number = 120;

  constructor(game: Game, x: number, y: number) {
    super(game, x, y, 'sprites', 'bullet_00');

    const pixelScale = this.game2.pixelScale;

    this.texture.baseTexture.scaleMode = PIXI.scaleModes.NEAREST;
    this.scale.set(pixelScale);

    this.game.physics.enable(this, Phaser.Physics.P2JS);
    this.body.setCollisionGroup(this.game2.bulletsCollisionGroups);
    this.body.collides(this.game2.ennemiesCollisionGroups);
  }

  public setDirection(direction: Phaser.Point) {
    if (direction.x > 0 && direction.y < 0) {
      this.body.rotation = 3 * Math.PI / 4;
      this.body.velocity.x = this.maxVelocity * this.game2.pixelScale * 0.707;
      this.body.velocity.y = -this.maxVelocity * this.game2.pixelScale * 0.707;

    } else if (direction.x > 0 && direction.y > 0) {
      this.body.rotation = - 3 * Math.PI / 4;
      this.body.velocity.x = this.maxVelocity * this.game2.pixelScale * 0.707;
      this.body.velocity.y = this.maxVelocity * this.game2.pixelScale * 0.707;

    } else if (direction.x < 0 && direction.y > 0) {
      this.body.rotation = 3 * Math.PI / 4;
      this.body.velocity.x = -this.maxVelocity * this.game2.pixelScale * 0.707;
      this.body.velocity.y = this.maxVelocity * this.game2.pixelScale * 0.707;

    } else if (direction.x < 0 && direction.y < 0) {
      this.body.rotation = Math.PI / 4;
      this.body.velocity.x = -this.maxVelocity * this.game2.pixelScale * 0.707;
      this.body.velocity.y = -this.maxVelocity * this.game2.pixelScale * 0.707;

    } else if (direction.y < 0) {
      this.body.rotation = Math.PI / 2;
      this.body.velocity.x = 0;
      this.body.velocity.y = -this.maxVelocity * this.game2.pixelScale;

    } else if (direction.x > 0) {
      this.body.rotation = 0;
      this.body.velocity.x = this.maxVelocity * this.game2.pixelScale;
      this.body.velocity.y = 0;

    } else if (direction.y > 0) {
      this.body.rotation = Math.PI / 2;
      this.body.velocity.x = 0;
      this.body.velocity.y = this.maxVelocity * this.game2.pixelScale;

    } else if (direction.x < 0) {
      this.body.rotation = Math.PI;
      this.body.velocity.x = -this.maxVelocity * this.game2.pixelScale;
      this.body.velocity.y = 0;

    }
  }

  public update() {
  }
}
