import {Game} from 'core/Game';
import {Sprite} from 'core/Sprite';
import {State} from 'statemachine/State';
import {StateMachine} from 'statemachine/StateMachine';
import {IdleState} from 'input/topdownaction/IdleState';
import {MoveState} from 'input/topdownaction/MoveState';
import {ShootState} from 'input/topdownaction/ShootState';
import {MoveShootState} from 'input/topdownaction/MoveShootState';

const pi_8 = Math.PI / 8;
const tan_pi_8 = Math.tan(pi_8);
const tan_3pi_8 = Math.tan(3 * pi_8);
const sqrt1_2 = Math.SQRT1_2;
const abs = Math.abs;
const max = Math.max;

export class InputHandler {
  public state: StateMachine;
  public target: Sprite;
  public direction: Phaser.Point;
  public keys: {[key: string]: Phaser.Key};
  public game: Game;
  public pointer: Phaser.Pointer;
  public delayedPointerdown: boolean = false;
  public delayedPointerUp: boolean = true;
  public onShoot: Phaser.Signal;
  public onShootTimeout: Phaser.Signal;
  public onDelayedPointerDown: Phaser.Signal;
  public onDelayedPointerUp: Phaser.Signal;
  public onPointerDown: Phaser.Signal;
  public onPointerUp: Phaser.Signal;
  protected shootDownStartTime: number;
  protected shootTimerStarted: boolean = false;
  protected pointerDownStartTime: number;
  protected delayedPointerDownDispatched: boolean = true;
  protected pointerUpStartTime: number;

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

    this.onPointerDown = new Phaser.Signal();
    this.onPointerUp = new Phaser.Signal();
    this.onShoot = new Phaser.Signal();
    this.onShootTimeout = new Phaser.Signal();
    this.onDelayedPointerDown = new Phaser.Signal();
    this.onDelayedPointerUp = new Phaser.Signal();

    this.game.input.onDown.add((pointer: Phaser.Pointer) => {
      this.pointer = pointer;
      this.onPointerDown.dispatch();
      this.delayedPointerUp = false;
    });

    this.game.input.onUp.add((pointer: Phaser.Pointer) => {
      this.pointer = pointer;
      this.onPointerUp.dispatch();
      this.pointerUpStartTime = this.game.time.totalElapsedSeconds();
    });

    this.state = new StateMachine();
    this.state.onEnter.add(this.onEnter, this);
    this.state.onExit.add(this.onExit, this);
    this.state.add('idle', new IdleState(this));
    this.state.add('move', new MoveState(this));
    this.state.add('shoot', new ShootState(this));
    this.state.add('move_shoot', new MoveShootState(this));
    this.state.set('idle');
  }

  public onEnter(oldState: string, newState: string) {
    //console.log(oldState + ' -> ' + newState);
  }

  public onExit() {
    this.onShootTimeout.removeAll();
    this.onDelayedPointerDown.removeAll();
    this.onDelayedPointerUp.removeAll();
    this.onPointerDown.removeAll();
    this.onPointerUp.removeAll();
  }

  public getDirection() {
    const keys = this.keys;
    const pointer = this.pointer;
    const defaultDirection = this.direction;

    if (pointer.isDown) {
      const point = this.getRelativePointerCoordinates();
      const dx = point.x;
      const dy = point.y;
      const tan = dx !== 0 ? abs(dy / dx) : 0;

      if (abs(dx) < 8 && abs(dy) < 8) {
        return defaultDirection;

      }

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

  public getRelativePointerCoordinates() {
    const dx = this.pointer.x - this.target.x + this.game.camera.x;
    const dy = this.pointer.y - this.target.y + this.game.camera.y;
    return new Phaser.Point(dx, dy);
  }

  public resetShootStateTimer() {
    this.shootTimerStarted = true;
    this.shootDownStartTime = this.game.time.totalElapsedSeconds();
  }

  public update() {
    this.updateDirection();

    if (this.shootTimerStarted) {
      const timeElapsed = this.game.time.totalElapsedSeconds() - this.shootDownStartTime;
      if (timeElapsed >= 0.3) {
        this.shootTimerStarted = false;
        this.onShootTimeout.dispatch();
      }
    }
    /*
    if (this.pointer.isDown && ! this.moveStartDispatched) {
      const timeElapsed = this.game.time.totalElapsedSeconds() - this.pointerDownStartTime;
      if (timeElapsed >= 0.05) {
        this.moveStartDispatched = true;
        this.moveEndDispatched = false;
        this.moveStarted = true;
        this.onMoveStart.dispatch();
      }
    }
    */
    //*
    if (this.pointer.isUp && ! this.delayedPointerUp) {
      const timeElapsed = this.game.time.totalElapsedSeconds() - this.pointerUpStartTime;
      if (timeElapsed >= 0.2) {
        this.delayedPointerUp = true;
        this.onDelayedPointerUp.dispatch();
      }
    }
    //*/
    this.state.current().update();
  }

  public updateDirection() {
    this.direction = this.getDirection();
  }
}
