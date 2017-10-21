import {State} from '../../core/StateMachine';
import {InputHandler} from './InputHandler';

const sqrt1_2 = Math.SQRT1_2;

export class MoveShootState extends State {
  private input: InputHandler;
  private shootIsDown: boolean = true;

  constructor(input: InputHandler) {
    super();
    this.input = input;
  }

  public enter(previous: string) {
    if (previous !== 'shoot') {
      this.input.shootTimeout = 0;
    }
  }

  public update() {
    const input = this.input;

    if (input.keys.shoot.isDown) {
      input.shootTimeout = 0;
      if (! this.shootIsDown) {
        this.shootIsDown = true;
        input.state.events.onShoot.dispatch();
      }
    } else {
      this.shootIsDown = false;
    }

    if (input.shootTimeout >= 10) {
      input.state.set('move');
      return;
    }

    input.shootTimeout++;

    input.direction = input.getDirection();

    if (input.keys.up.isUp && input.keys.right.isUp && input.keys.down.isUp && input.keys.left.isUp && input.pointer.isUp) {
      input.state.set('shoot');
    }
  }
}
