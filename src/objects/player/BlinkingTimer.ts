import { Player } from 'objects/player/Player';

export class BlinkingTimer extends Phaser.Timer {
  protected player: Player;
  protected blinkingDelay: number = 3000;
  protected blinkingCounter: number = 0;
  protected blinkingRate: number = 30;
  
  constructor(player: Player) {
    super(player.game, true);

    this.player = player;
    this.game.time.add(this);
    this.add(this.blinkingDelay, this.timeoutAction, this);
    this.start();
  }

  public timeoutAction(player: Player) {
    this.player.stopBlinking();
  }
  
  public update(time: number) {
    this.blinkingCounter += this.game.time.elapsedMS;
    if (this.blinkingCounter > this.blinkingRate) {
      this.player.visible = !this.player.visible;
      this.blinkingCounter = this.blinkingCounter - this.blinkingRate;
    }
    return super.update(time);
  }
}
