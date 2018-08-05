import { State } from "../../statemachine/State";
import { Player } from "./Player";
import { Main } from "../../states/Main";
import { Game } from "../../core/Game";

export class PlayerState extends State {
  protected player: Player;
  protected gameState: Main;
  protected game: Game;

  constructor(player: Player) {
    super();
    this.player = player;
    this.game = this.player.game as Game;
    this.gameState = this.player.gameState;
  }

  public hurt(damage: number) {}

  public shoot() {}
}
