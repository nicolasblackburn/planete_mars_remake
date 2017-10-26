import {State} from '../../core/StateMachine';
import {InputHandler} from './InputHandler';

const sqrt1_2 = Math.SQRT1_2;

export class MoveState extends State {
  protected input: InputHandler;

  constructor(input: InputHandler) {
    super();
    this.input = input;
  }

  public enter(previous: string) {
    this.input.onDelayedPointerUp.add(this.onDelayedPointerUp, this);
    this.input.keys.shoot.onDown.add(this.onShootDown, this);
    this.input.onPointerDown.add(this.onShootDown, this);
  }

  public onDelayedPointerUp() {
    this.input.state.set('idle');
  }

  public onShootDown() {
    this.input.updateDirection();
    this.input.state.set('move_shoot');
  }

  public update() {
    let input = this.input;

    if (input.keys.up.isUp && input.keys.right.isUp && input.keys.down.isUp && input.keys.left.isUp && input.delayedPointerUp) {
      input.state.set('idle');

    }
  }
}
