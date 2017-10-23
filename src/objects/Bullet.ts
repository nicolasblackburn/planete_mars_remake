import {Game} from '../core/Game';
import {Sprite} from '../core/Sprite';

const pi = Math.PI;
const pi_2 = Math.PI / 2;
const pi_4 = Math.PI / 4;
const sqrt1_2 = Math.SQRT1_2;

export class Bullet extends Sprite {
  public onBulletDestroyed: Phaser.Signal;
  protected maxVelocity: number = 100;
  protected baseVelocity: Phaser.Point;
  protected aliveStartTime: number;

  constructor(game: Game, x: number, y: number) {
    super(game, x, y, 'sprites', 'bullet_00');

    this.game.physics.enable(this, Phaser.Physics.P2JS);

    this.body.setCollisionGroup(this.game2.collisionGroups.get('bullets'));
    this.body.collides(this.game2.collisionGroups.get('enemies'));

    this.baseVelocity = new Phaser.Point(0, 0);
    this.aliveStartTime = this.game.time.totalElapsedSeconds();
    this.onBulletDestroyed = new Phaser.Signal();
  }

  public setDirection(direction: Phaser.Point) {
    if (direction.x > 0 && direction.y < 0) {
      this.body.rotation = 3 * pi_4;
      this.baseVelocity.x = this.maxVelocity * sqrt1_2;
      this.baseVelocity.y = -this.maxVelocity * sqrt1_2;

    } else if (direction.x > 0 && direction.y > 0) {
      this.body.rotation = - 3 * pi_4;
      this.baseVelocity.x = this.maxVelocity * sqrt1_2;
      this.baseVelocity.y = this.maxVelocity * sqrt1_2;

    } else if (direction.x < 0 && direction.y > 0) {
      this.body.rotation = 3 * pi_4;
      this.baseVelocity.x = -this.maxVelocity * sqrt1_2;
      this.baseVelocity.y = this.maxVelocity * sqrt1_2;

    } else if (direction.x < 0 && direction.y < 0) {
      this.body.rotation = pi_4;
      this.baseVelocity.x = -this.maxVelocity * sqrt1_2;
      this.baseVelocity.y = -this.maxVelocity * sqrt1_2;

    } else if (direction.y < 0) {
      this.body.rotation = pi_2;
      this.baseVelocity.x = 0;
      this.baseVelocity.y = -this.maxVelocity;

    } else if (direction.x > 0) {
      this.body.rotation = 0;
      this.baseVelocity.x = this.maxVelocity;
      this.baseVelocity.y = 0;

    } else if (direction.y > 0) {
      this.body.rotation = pi_2;
      this.baseVelocity.x = 0;
      this.baseVelocity.y = this.maxVelocity;

    } else if (direction.x < 0) {
      this.body.rotation = pi;
      this.baseVelocity.x = -this.maxVelocity;
      this.baseVelocity.y = 0;

    }
  }

  public update() {
    const elapsedTime = this.game.time.totalElapsedSeconds() - this.aliveStartTime;
    if (elapsedTime >= 0.6) {
      this.exists = false;
      this.onBulletDestroyed.dispatch();
      return;
    }

    this.body.velocity.x = this.baseVelocity.x * this.game2.initialScale;
    this.body.velocity.y = this.baseVelocity.y * this.game2.initialScale;
  }
}
