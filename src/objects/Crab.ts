import {Game} from '../core/Game';
import {Sprite} from '../core/Sprite';

export class Crab extends Sprite {
  private cursors: Phaser.CursorKeys;
  private maxVelocity: number = 4;

  constructor(game: Game, x: number, y: number) {
    super(game, x, y, 'sprites', 'crab_00');

    const pixelScale = this.game2.pixelScale;

    this.texture.baseTexture.scaleMode = PIXI.scaleModes.NEAREST;
    this.scale.set(pixelScale);

    this.game.physics.enable(this, Phaser.Physics.ARCADE);
    this.body.immovable = true;
  }

  public update() {
  }
}
