import {Game} from './Game';

export class Sprite extends Phaser.Sprite {
  protected game2: Game;

  constructor(game: Game, x: number, y: number, key?: string | Phaser.RenderTexture | Phaser.BitmapData | PIXI.Texture, frame?: string | number) {
    super(game, x, y, key, frame);
    this.game2 = game;
  }
}
