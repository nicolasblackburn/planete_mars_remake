import Game from '../Game';
import Sprite from '../Sprite';

export default class Crab extends Sprite {
  private cursors: Phaser.CursorKeys;
  private maxVelocity: number = 4;

  constructor(game: Game, x: number, y: number) {
    super(game, x, y, 'sprites', 'crab-00');

    const pixelScale = this.game2.pixelScale;

    this.texture.baseTexture.scaleMode = PIXI.scaleModes.NEAREST;
    this.scale.set(pixelScale);

    this.game.physics.enable(this, Phaser.Physics.ARCADE);
    this.body.immovable = true;
  }

  public update() {
  }
}
