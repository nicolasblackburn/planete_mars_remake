import {State} from '../../core/StateMachine';
import {InputHandler} from './InputHandler';

const sqrt1_2 = Math.SQRT1_2;
const abs = Math.abs;
const max = Math.max;

export class IdleState extends State {
  private input: InputHandler;

  constructor(input: InputHandler) {
    super();
    this.input = input;
  }

  public enter() {
    this.input.onPointerDown.add(this.onPointerDown, this);
  }

  public onPointerDown() {
    const point = this.input.getRelativePointerCoordinates();
    const tresh = max(this.input.target.width, this.input.target.height);

    if (abs(point.x) >= tresh || abs(point.y) >= tresh) {
      this.input.updateDirection();
      this.input.state.set('move_shoot');

    } else {
      this.input.updateDirection();
      this.input.state.set('shoot');

    }

  }

  public update() {
    let input = this.input;

    if (input.keys.up.isDown || input.keys.right.isDown || input.keys.down.isDown || input.keys.left.isDown) {
      input.state.set('move');

    } else if (input.keys.shoot.isDown) {
      input.state.set('shoot');

    }
  }
}
