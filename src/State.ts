import Game from './Game';

export default class State extends Phaser.State {
  protected game2: Game;

  constructor(game: Game) {
    super();
    this.game2 = game;
  }
}
