import {State} from '../../core/StateMachine';
import {InputHandler} from './InputHandler';

const sqrt1_2 = Math.SQRT1_2;

export class MoveState extends State {
  private input: InputHandler;

  constructor(input: InputHandler) {
    super();
    this.input = input;
  }

  public update() {
    let input = this.input;

    if (input.keys.shoot.isDown) {
      input.state.set('move_shoot');
      return;
    }

    input.direction = input.getDirection();

    if (input.keys.up.isUp && input.keys.right.isUp && input.keys.down.isUp && input.keys.left.isUp && input.pointer.isUp) {
      input.state.set('idle');

    }
  }
}
