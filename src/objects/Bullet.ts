import {Game} from '../core/Game';
import {Sprite} from '../core/Sprite';

const pi = Math.PI;
const pi_2 = Math.PI / 2;
const pi_4 = Math.PI / 4;
const sqrt1_2 = Math.SQRT1_2;

export class Bullet extends Sprite {
  private maxVelocity: number = 120;

  constructor(game: Game, x: number, y: number) {
    super(game, x, y, 'sprites', 'bullet_00');

    this.texture.baseTexture.scaleMode = PIXI.scaleModes.NEAREST;
    this.scale.set(this.game2.pixelScale);

    this.game.physics.enable(this, Phaser.Physics.P2JS);
    this.body.setCollisionGroup(this.game2.bulletsCollisionGroups);
    this.body.collides(this.game2.ennemiesCollisionGroups);
  }

  public setDirection(direction: Phaser.Point) {
    if (direction.x > 0 && direction.y < 0) {
      this.body.rotation = 3 * pi_4;
      this.body.velocity.x = this.maxVelocity * sqrt1_2;
      this.body.velocity.y = -this.maxVelocity * sqrt1_2;

    } else if (direction.x > 0 && direction.y > 0) {
      this.body.rotation = - 3 * pi_4;
      this.body.velocity.x = this.maxVelocity * sqrt1_2;
      this.body.velocity.y = this.maxVelocity * sqrt1_2;

    } else if (direction.x < 0 && direction.y > 0) {
      this.body.rotation = 3 * pi_4;
      this.body.velocity.x = -this.maxVelocity * sqrt1_2;
      this.body.velocity.y = this.maxVelocity * sqrt1_2;

    } else if (direction.x < 0 && direction.y < 0) {
      this.body.rotation = pi_4;
      this.body.velocity.x = -this.maxVelocity * sqrt1_2;
      this.body.velocity.y = -this.maxVelocity * sqrt1_2;

    } else if (direction.y < 0) {
      this.body.rotation = pi_2;
      this.body.velocity.x = 0;
      this.body.velocity.y = -this.maxVelocity;

    } else if (direction.x > 0) {
      this.body.rotation = 0;
      this.body.velocity.x = this.maxVelocity;
      this.body.velocity.y = 0;

    } else if (direction.y > 0) {
      this.body.rotation = pi_2;
      this.body.velocity.x = 0;
      this.body.velocity.y = this.maxVelocity;

    } else if (direction.x < 0) {
      this.body.rotation = pi;
      this.body.velocity.x = -this.maxVelocity;
      this.body.velocity.y = 0;

    }
  }

  public update() {
  }
}
