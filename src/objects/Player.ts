import {Game} from '../core/Game';
import {Sprite} from '../core/Sprite';
import {InputHandler} from '../components/topDownAction/InputHandler';

export class Player extends Sprite {
  public maxVelocity: number = 60;
  private isMoving: boolean = false;
  private spaceKeyIsDown: boolean = false;
  private inputHandler: InputHandler;

  constructor(game: Game, x: number, y: number) {
    super(game, x, y, 'sprites', 'player_idle_down_00');

    this.inputHandler = new InputHandler(this.game2, this);

    this.game.physics.enable(this, Phaser.Physics.P2JS);
    this.body.fixedRotation = true;
    this.body.setRectangle(8, 11, 0, 1);
    this.body.setCollisionGroup(this.game2.playerCollisionGroups);
    this.body.collides(this.game2.wallsCollisionGroups);
    //this.body.debug = true;

    this.addAnimations();
    this.inputHandler.state.events.onShoot.add(this.onShoot, this);
  }

  public onShoot() {
    const bullet = this.game2.factory.bullet(this.body.x, this.body.y);
    bullet.setDirection(this.inputHandler.direction);
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
