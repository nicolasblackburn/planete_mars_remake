import {Direction} from '../core/Direction';
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

    this.inputHandler = new InputHandler(this.game2);

    const pixelScale = this.game2.pixelScale;

    this.texture.baseTexture.scaleMode = PIXI.scaleModes.NEAREST;
    this.scale.set(pixelScale);

    this.game.physics.enable(this, Phaser.Physics.P2JS);
    this.body.fixedRotation = true;
    this.body.setRectangle(8 * pixelScale, 11 * pixelScale, 0, 1 * pixelScale);
    this.body.setCollisionGroup(this.game2.playerCollisionGroups);
    this.body.collides(this.game2.wallsCollisionGroups);
    //this.body.debug = true;

    this.addAnimations();
    this.inputHandler.state.events.onShoot.add(this.onShoot, this);
  }

  public onShoot() {
    const bullet = this.game2.factory.bullet(this.body.x, this.body.y);
    bullet.setDirection(this.inputHandler.aimDirection);
  }

  public update() {
    const input = this.inputHandler;

    input.update();

    const scale =  this.maxVelocity * this.game2.pixelScale;

    this.animations.play(this.currentAnimationKey(), null, true);

    this.body.velocity.x = input.direction.x * scale;
    this.body.velocity.y = input.direction.y * scale;
  }

  private currentAnimationKey() {
    const state = this.inputHandler.state.key();
    const vector = this.inputHandler.lastNonDiagonalDirection;
    if (vector.y < 0) {
      return state + '_up';
    } else if (vector.x > 0) {
      return state + '_right';
    } else if (vector.y > 0) {
      return state + '_down';
    } else if (vector.x < 0) {
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
