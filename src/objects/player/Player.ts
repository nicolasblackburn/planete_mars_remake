import {Game} from 'core/Game';
import {Sprite} from 'core/Sprite';
import {InputHandler} from 'input/topdownaction/InputHandler';
import {Main} from 'states/Main';

export class Player extends Sprite {
  public health: number = 100;
  public maxVelocity: number = 40;
  public hurtVelocity: number = 100;
  public hurtState: boolean = false;
  public blinkingState: boolean = false;
  protected bulletCount: number = 0;
  protected inputHandler: InputHandler;
  protected gameState: Main;
  protected hurtTimer: Phaser.Timer;
  protected hurtDelay: number = 100;
  protected hurtDirection: Phaser.Point;
  protected blinkingTimer: Phaser.Timer;
  protected blinkingDelay: number = 3000;
  protected blinkingCounter: number;
  protected blinkingRate: number = 30;

  constructor(game: Game, x: number, y: number) {
    super(game, x, y, 'sprites', 'player_idle_down_00');

    this.inputHandler = new InputHandler(game, this);
    this.gameState = game.getMainState();

    this.game.physics.enable(this, Phaser.Physics.P2JS);
    this.body.fixedRotation = true;

    this.baseCollisionShape = new Phaser.Rectangle(0, 1, 8, 11);
    this.updateBody();

    //this.body.debug = true;

    this.addAnimations('player');

    this.inputHandler.onShoot.add(this.shoot, this);
  }

  public hurt(damage: number) {
    if (this.hurtState || this.blinkingState) {
      return;
    }

    if (this.hurtTimer) {
      this.hurtTimer.destroy();
    }
    this.hurtTimer = this.game.time.create();
    this.hurtTimer.add(this.hurtDelay, this.hurtTimeout, this);
    this.hurtTimer.start();
    this.hurtDirection = this.inputHandler.getDirection();
    this.hurtDirection.x *= -1;
    this.hurtDirection.y *= -1;
    this.hurtState = true;
    this.health -= damage;
  }

  public hurtTimeout() {
    this.hurtState = false;
    if (this.blinkingTimer) {
      this.blinkingTimer.destroy();
    }
    this.blinkingTimer = this.game.time.create();
    this.blinkingTimer.add(this.blinkingDelay, this.blinkingTimeout, this);
    this.blinkingTimer.start();
    this.blinkingState = true;
    this.blinkingCounter = 0;
  }

  public blinkingTimeout() {
    this.blinkingState = false;
    this.visible = true;
  }

  public shoot() {
    if (this.bulletCount < 3 && !this.hurtState) {
      this.bulletCount++;
      const bullet = this.gameState.addBullet(this.body.x, this.body.y, this.inputHandler.direction);
      bullet.events.onKilled.addOnce(() => {
        this.bulletCount--;
      });
    }
  }

  public update() {
    const game = this.game as Game;
    if (this.hurtState) {
      this.animations.currentAnim.stop(false, false);
      this.body.velocity.x = this.hurtDirection.x * this.hurtVelocity * this.game.time.elapsedMS * game.timeScale;
      this.body.velocity.y = this.hurtDirection.y * this.hurtVelocity * this.game.time.elapsedMS * game.timeScale;
      return;
    }

    if (this.blinkingState) {
      this.blinkingCounter += this.game.time.elapsedMS;
      if (this.blinkingCounter > this.blinkingRate) {
        this.visible = !this.visible;
        this.blinkingCounter = this.blinkingCounter - this.blinkingRate;
      }
    }

    const input = this.inputHandler;

    input.update();

    this.animations.play(this.currentAnimationKey(), null, true);

    if (['move', 'move_shoot'].includes(input.state.key())) {
      this.body.velocity.x = input.direction.x * this.maxVelocity * this.game.time.elapsedMS * game.timeScale;
      this.body.velocity.y = input.direction.y * this.maxVelocity * this.game.time.elapsedMS * game.timeScale;

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
}
