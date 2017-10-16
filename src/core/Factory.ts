import {Game} from './Game';
import {Bullet} from '../objects/Bullet';
import {Crab} from '../objects/Crab';
import {Player} from '../objects/Player';

export class Factory {
  private game: Game;

  constructor(game: Game) {
  	this.game = game;
  }

  public create(type: string, x: number, y: number) {
    switch (type) {
      case 'Bullet':
        return this.bullet(x, y);

      case 'Crab':
        return this.crab(x, y);

      case 'Player':
        return this.player(x, y);
    }
  }

  public bullet(x: number, y: number) {
  	const sprite = new Bullet(this.game, x, y);
    this.game.add.existing(sprite);
    return sprite;
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
