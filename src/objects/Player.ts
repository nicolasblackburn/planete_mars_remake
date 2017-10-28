import {Game} from '../core/Game';
import {Sprite} from '../core/Sprite';
import {InputHandler} from '../components/topDownAction/InputHandler';
import {Main} from '../states/Main';

export class Player extends Sprite {
  public maxVelocity: number = 40;
  protected bulletCount: number = 0;
  protected inputHandler: InputHandler;
  protected state: Main;

  constructor(game: Game, x: number, y: number) {
    super(game, x, y, 'sprites', 'player_idle_down_00');

    this.inputHandler = new InputHandler(this.game2, this);

    this.game.physics.enable(this, Phaser.Physics.P2JS);
    this.body.fixedRotation = true;

    this.baseCollisionRectangle = new Phaser.Rectangle(0, 1, 8, 11);
    this.updateBody();

    //this.body.debug = true;

    this.addAnimations();

    this.inputHandler.onShoot.add(this.onShoot, this);
  }

  public onShoot() {
    if (this.bulletCount < 3) {
      this.bulletCount++;
      const bullet = this.state.addBullet(this.body.x, this.body.y, this.inputHandler.direction);
      bullet.onBulletDestroyed.addOnce(() => {
        this.bulletCount--;
      });
    }
  }

  public setState(state: Main) {
    this.state = state;
  }

  public update() {
    const input = this.inputHandler;

    input.update();

    this.animations.play(this.currentAnimationKey(), null, true);

    if (['move', 'move_shoot'].includes(input.state.key())) {
      this.body.velocity.x = input.direction.x * this.maxVelocity * this.game.time.elapsedMS * this.game2.timeScale;
      this.body.velocity.y = input.direction.y * this.maxVelocity * this.game.time.elapsedMS * this.game2.timeScale;

    } else {
      this.body.velocity.x = 0;
      this.body.velocity.y = 0;

    }
  }

  protected currentAnimationKey() {
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

  protected addAnimations() {
    for (const animation of this.game2.animations.player) {
      const [key, frames, rate] = animation;
      this.animations.add(key as string, frames as string[], rate as number);
    }
  }
}
