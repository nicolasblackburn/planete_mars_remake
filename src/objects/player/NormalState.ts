import { PlayerState } from './PlayerState';

export class NormalState extends PlayerState {
  public walkVelocity: number = 15;
  protected bulletCount: number = 0;
  
  public hurt(damage: number) {
    if (this.player.blinking) {
      return;
    }

    this.player.health -= damage;
    this.player.state.set('hurt');
  }
  
  public shoot() {
    if (this.bulletCount < 3) {
      this.bulletCount++;
      const x = this.player.body.x;
      const y = this.player.body.y;
      const direction = this.player.inputHandler.direction;
      const bullet = this.gameState.topRoom.addBullet(x, y, direction);
      bullet.events.onKilled.addOnce(() => {
        this.bulletCount--;
      });
    }
  }

  public update() {
    const input = this.player.inputHandler;
    const pixelScale = this.game.pixelScale;
    const maxVelocity = this.walkVelocity * pixelScale;
    const elapsedMS = this.game.time.elapsedMS * this.game.timeScale;

    input.update();

    this.player.animations.play(this.player.animationKey(), null, true);

    if (['move', 'move_shoot'].includes(input.state.key())) {
      this.player.body.velocity.x = input.direction.x * maxVelocity * elapsedMS;
      this.player.body.velocity.y = input.direction.y * maxVelocity * elapsedMS;

    } else {
      this.player.body.velocity.x = 0;
      this.player.body.velocity.y = 0;

    }
  }
}
