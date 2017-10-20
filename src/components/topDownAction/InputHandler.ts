import {Game} from '../../core/Game';
import {State, StateMachine} from '../../core/StateMachine';
import {IdleState} from './IdleState';
import {MoveState} from './MoveState';
import {ShootState} from './ShootState';
import {MoveShootState} from './MoveShootState';

export class InputHandler {
  public animationKey: string;
  public state: StateMachine;
  public aimDirection: Phaser.Point;
  public direction: Phaser.Point;
  public lastNonDiagonalDirection: Phaser.Point;
  public keys: {[key: string]: Phaser.Key};
  public shootTimeout: number = 0;
  private game: Game;

  constructor(game: Game) {
    this.game = game;

    this.animationKey = 'idle_down';
    this.direction = new Phaser.Point(0, 0);
    this.aimDirection = new Phaser.Point(0, 1);
    this.lastNonDiagonalDirection = new Phaser.Point(0, 1);

    this.keys = {
      up: this.game.input.keyboard.addKey(Phaser.Keyboard.I),
      left: this.game.input.keyboard.addKey(Phaser.Keyboard.J),
      down: this.game.input.keyboard.addKey(Phaser.Keyboard.K),
      right: this.game.input.keyboard.addKey(Phaser.Keyboard.L),
      shoot: this.game.input.keyboard.addKey(Phaser.Keyboard.S)
    }

    this.state = new StateMachine();
    this.state.events.onShoot = new Phaser.Signal();
    this.state.add('idle', new IdleState(this));
    this.state.add('move', new MoveState(this));
    this.state.add('shoot', new ShootState(this));
    this.state.add('move_shoot', new MoveShootState(this));
    this.state.set('idle');
  }

  public enter(direction: Phaser.Point) {
    this.direction = direction;
  }

  public update() {
    this.state.current().update();
  }
}
