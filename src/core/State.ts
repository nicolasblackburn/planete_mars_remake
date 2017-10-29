import {Game} from 'core/Game';

export class State extends Phaser.State {
  public game2: Game;

  constructor(game: Game) {
    super();
    this.game2 = game;
  }
}
