import {State} from 'statemachine/State';
import {InputHandler} from 'input/topdownaction/InputHandler';

const sqrt1_2 = Math.SQRT1_2;
const abs = Math.abs;
const max = Math.max;

export class ShootState extends State {
  protected input: InputHandler;

  constructor(input: InputHandler) {
    super();
    this.input = input;
  }

  public enter(previous: string) {
    this.input.onShootStateTimeout.add(this.onShootStateTimeout, this);
    this.input.keys.shoot.onDown.add(this.onShootDown, this);
    this.input.onPointerDown.add(this.onShootDown, this);
    this.input.resetShootStateTimer();

    if (previous !== 'move_shoot') {
      this.input.onShoot.dispatch();
    }
  }

  public onShootDown() {
    this.input.onShoot.dispatch();
    this.input.resetShootStateTimer();
  }

  public onShootStateTimeout() {
    this.input.state.set('idle');
  }

  public update() {
    const input = this.input;

    if (input.keys.up.isDown || input.keys.right.isDown || input.keys.down.isDown || input.keys.left.isDown) {
      input.state.set('move_shoot');
    }
  }
}
