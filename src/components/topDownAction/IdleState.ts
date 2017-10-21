import {State} from '../../core/StateMachine';
import {InputHandler} from './InputHandler';

const sqrt1_2 = Math.SQRT1_2;

export class IdleState extends State {
  private input: InputHandler;

  constructor(input: InputHandler) {
    super();
    this.input = input;
  }

  public update() {
    let input = this.input;

    input.direction = input.getDirection();

    if (input.keys.up.isDown || input.keys.right.isDown || input.keys.down.isDown || input.keys.left.isDown || input.pointer.isDown) {
      input.state.set('move');

    } else if (input.keys.shoot.isDown) {
      input.state.set('shoot');

    }
  }
}
