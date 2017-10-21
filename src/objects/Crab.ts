import {Game} from '../core/Game';
import {Sprite} from '../core/Sprite';

export class Crab extends Sprite {
  private cursors: Phaser.CursorKeys;
  private maxVelocity: number = 4;

  constructor(game: Game, x: number, y: number) {
    super(game, x, y, 'sprites', 'crab_00');

    this.game.physics.enable(this, Phaser.Physics.ARCADE);
    this.body.immovable = true;
  }

  public update() {
  }
}
