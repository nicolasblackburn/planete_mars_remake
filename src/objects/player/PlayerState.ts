import { State } from 'statemachine/State';
import { Player } from 'objects/player/Player';
import {Main} from 'states/Main';
import { Game } from 'core/Game';

export class PlayerState extends State {
  protected player: Player;
  protected gameState: Main;
  protected game: Game;

  constructor(player: Player) {
    super();
    this.player = player;
    this.game = this.player.game2;
    this.gameState = this.player.gameState;
  }

  public hurt(damage: number) {}

  public shoot() {}
}
