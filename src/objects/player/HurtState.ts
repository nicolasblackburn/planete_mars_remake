import { PlayerState } from './PlayerState';

export class HurtState extends PlayerState {
  public hurtVelocity: number = 100;
  protected hurtTimer: Phaser.Timer;
  protected hurtDelay: number = 100;
  protected hurtDirection: Phaser.Point;

  public enter() {
    if (this.hurtTimer) {
      this.hurtTimer.destroy();
    }
    this.hurtTimer = this.game.time.create();
    this.hurtTimer.add(this.hurtDelay, this.hurtTimeout, this);
    this.hurtTimer.start();
    this.hurtDirection = this.player.inputHandler.direction;
    this.hurtDirection.x *= -1;
    this.hurtDirection.y *= -1;
  }
  
  public hurtTimeout() {
    this.player.startBlinking();
    this.player.state.set('normal');
  }

  public update() {
    const hurtVelocity = this.hurtVelocity;
    const elapsedMS = this.game.time.elapsedMS * this.game.timeScale;

    this.player.animations.currentAnim.stop(false, false);
    this.player.body.velocity.x = this.hurtDirection.x * hurtVelocity * elapsedMS;
    this.player.body.velocity.y = this.hurtDirection.y * hurtVelocity * elapsedMS;
  }
}
