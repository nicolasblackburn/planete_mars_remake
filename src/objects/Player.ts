import {Game} from '../core/Game';
import {Sprite} from '../core/Sprite';
import {InputHandler} from '../components/topDownAction/InputHandler';

export class Player extends Sprite {
  public maxVelocity: number = 200;
  protected inputHandler: InputHandler;
  protected bulletCount: number = 0;

  constructor(game: Game, x: number, y: number) {
    super(game, x, y, 'sprites', 'player_idle_down_00');

    this.inputHandler = new InputHandler(this.game2, this);

    this.game.physics.enable(this, Phaser.Physics.P2JS);
    this.body.fixedRotation = true;

    this.baseCollisionRectangle = new Phaser.Rectangle(0, 1, 8, 11);
    this.collisionGroup = this.game2.collisionGroups.get('player');
    this.updateBody();

    this.body.collides([
      this.game2.collisionGroups.get('walls'),
      this.game2.collisionGroups.get('enemies') ]);

    //this.body.debug = true;

    this.addAnimations();

    this.inputHandler.onShoot.add(this.onShoot, this);
  }

  public onShoot() {
    if (this.bulletCount < 3) {
      this.bulletCount++;
      const bullet = this.game2.factory.bullet(this.body.x, this.body.y);
      bullet.onBulletDestroyed.addOnce(() => { this.bulletCount--; });
      this.game2.bullets.push(bullet);
      bullet.setDirection(this.inputHandler.direction);
    }
  }

  public update() {
    const input = this.inputHandler;

    input.update();

    this.animations.play(this.currentAnimationKey(), null, true);

    if (['move', 'move_shoot'].includes(input.state.key())) {
      this.body.velocity.x = input.direction.x * this.maxVelocity;
      this.body.velocity.y = input.direction.y * this.maxVelocity;

    } else {
      this.body.velocity.x = 0;
      this.body.velocity.y = 0;

    }
  }

  private currentAnimationKey() {
    const state = this.inputHandler.state.key();
    const direction = this.inputHandler.direction;
    if (direction.y < 0) {
      return state + '_up';
    } else if (direction.x > 0) {
      return state + '_right';
    } else if (direction.y > 0) {
      return state + '_down';
    } else if (direction.x < 0) {
      return state + '_left';
    } else {
      return '';
    }
  }

  private addAnimations() {
    for (const animation of this.game2.animations.player) {
      const [key, frames, rate] = animation;
      this.animations.add(key as string, frames as string[], rate as number);
    }
  }
}
