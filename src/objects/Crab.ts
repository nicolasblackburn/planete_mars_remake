import {Game} from '../core/Game';
import {Sprite} from '../core/Sprite';

export class Crab extends Sprite {
  protected cursors: Phaser.CursorKeys;
  protected maxVelocity: number = 4;

  constructor(game: Game, x: number, y: number) {
    super(game, x, y, 'sprites', 'crab_00');

  }
}
