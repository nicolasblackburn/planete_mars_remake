import Game from './Game';

// Objects
import Crab from './objects/Crab';
import Player from './objects/Player';

export default class Factory {
  private game: Game;

  constructor(game: Game) {
  	this.game = game;
  }

  public create(type: string, x: number, y: number) {
    switch (type) {
      case 'Crab':
        return this.crab(x, y);

      case 'Player':
        return this.player(x, y);
    }
  }

  public crab(x: number, y: number) {
  	const sprite = new Crab(this.game, x, y);
    this.game.add.existing(sprite);
    return sprite;
  }

  public player(x: number, y: number) {
  	const sprite = new Player(this.game, x, y);
    this.game.add.existing(sprite);
    return sprite;

  }
}
