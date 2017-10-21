import {Game} from '../../core/Game';
import {Sprite} from '../../core/Sprite';
import {State, StateMachine} from '../../core/StateMachine';
import {IdleState} from './IdleState';
import {MoveState} from './MoveState';
import {ShootState} from './ShootState';
import {MoveShootState} from './MoveShootState';

const pi_8 = Math.PI / 8;
const tan_pi_8 = Math.tan(pi_8);
const tan_3pi_8 = Math.tan(3 * pi_8);
const sqrt1_2 = Math.SQRT1_2;
const abs = Math.abs;

export class InputHandler {
  public state: StateMachine;
  public target: Sprite;
  public direction: Phaser.Point;
  public keys: {[key: string]: Phaser.Key};
  public shootTimeout: number = 0;
  public game: Game;
  public pointer: Phaser.Pointer;

  constructor(game: Game, target: Sprite) {
    this.game = game;
    this.target = target;
    this.direction = new Phaser.Point(0, 1);

    this.keys = {
      up: this.game.input.keyboard.addKey(Phaser.Keyboard.I),
      left: this.game.input.keyboard.addKey(Phaser.Keyboard.J),
      down: this.game.input.keyboard.addKey(Phaser.Keyboard.K),
      right: this.game.input.keyboard.addKey(Phaser.Keyboard.L),
      shoot: this.game.input.keyboard.addKey(Phaser.Keyboard.S)
    }

    this.pointer = this.game.input.pointer1;

    this.game.input.onDown.add((pointer: Phaser.Pointer) => {
      this.pointer = pointer;
    });

    this.game.input.onUp.add((pointer: Phaser.Pointer) => {
      this.pointer = pointer;
    });

    this.state = new StateMachine();
    this.state.events.onShoot = new Phaser.Signal();
    this.state.add('idle', new IdleState(this));
    this.state.add('move', new MoveState(this));
    this.state.add('shoot', new ShootState(this));
    this.state.add('move_shoot', new MoveShootState(this));
    this.state.set('idle');
  }

  public getDirection() {
    const keys = this.keys;
    const pointer = this.pointer;
    const defaultDirection = this.direction;

    if (pointer.isDown) {
      const dx = pointer.x - this.target.x + this.game.camera.x;
      const dy = pointer.y - this.target.y + this.game.camera.y;
      const tan = dx !== 0 ? abs(dy / dx) : 0;

      if (dx === 0 && dy < 0) {
        return new Phaser.Point(0, -1);

      } else if (dx > 0 && dy === 0) {
        return new Phaser.Point(1, 0);

      } else if (dx === 0 && dy > 0) {
        return new Phaser.Point(0, 1);

      } else if (dx < 0 && dy === 0) {
        return new Phaser.Point(1, 0);

      } else if (dx > 0 && dy < 0) {
        if (tan < tan_pi_8) {
          return new Phaser.Point(1, 0);
        } else if (tan <= tan_3pi_8) {
          return new Phaser.Point(sqrt1_2, -sqrt1_2);
        } else {
          return new Phaser.Point(0, -1);
        }

      } else if (dx > 0 && dy > 0) {
        if (tan < tan_pi_8) {
          return new Phaser.Point(1, 0);
        } else if (tan <= tan_3pi_8) {
          return new Phaser.Point(sqrt1_2, sqrt1_2);
        } else {
          return new Phaser.Point(0, 1);
        }

      } else if (dx < 0 && dy > 0) {
        if (tan < tan_pi_8) {
          return new Phaser.Point(-1, 0);
        } else if (tan <= tan_3pi_8) {
          return new Phaser.Point(-sqrt1_2, sqrt1_2);
        } else {
          return new Phaser.Point(0, 1);
        }

      } else if (dx < 0 && dy < 0) {
        if (tan < tan_pi_8) {
          return new Phaser.Point(-1, 0);
        } else if (tan <= tan_3pi_8) {
          return new Phaser.Point(-sqrt1_2, -sqrt1_2);
        } else {
          return new Phaser.Point(0, -1);
        }
      }
    }

    if (keys.up.isDown && keys.right.isDown) {
      return new Phaser.Point(sqrt1_2, -sqrt1_2);

    } else if (keys.right.isDown && keys.down.isDown) {
      return new Phaser.Point(sqrt1_2, sqrt1_2);

    } else if (keys.down.isDown && keys.left.isDown) {
      return new Phaser.Point(-sqrt1_2, sqrt1_2);

    } else if (keys.left.isDown && keys.up.isDown) {
      return new Phaser.Point(-sqrt1_2, -sqrt1_2);

    } else if (keys.up.isDown) {
      return new Phaser.Point(0, -1);

    } else if (keys.right.isDown) {
      return new Phaser.Point(1, 0);

    } else if (keys.down.isDown) {
      return new Phaser.Point(0, 1);

    } else if (keys.left.isDown) {
      return new Phaser.Point(-1, 0);

    }

    return defaultDirection;

  }

  public update() {
    this.state.current().update();
  }
}
