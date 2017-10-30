import {State} from 'statemachine/State';
import {InputHandler} from 'input/topdownaction/InputHandler';

const sqrt1_2 = Math.SQRT1_2;
const abs = Math.abs;
const max = Math.max;

export class IdleState extends State {
  protected input: InputHandler;

  constructor(input: InputHandler) {
    super();
    this.input = input;
  }

  public enter() {
    this.input.onPointerDown.add(this.onPointerDown, this);
    this.input.keys.shoot.onDown.add(this.onShootDown, this);
  }

  public onPointerDown() {
    const point = this.input.getRelativePointerCoordinates();
    const tresh = max(this.input.target.width, this.input.target.height);
    
    this.input.updateDirection();
    this.input.state.set('move_shoot');

    /*
    if (abs(point.x) >= tresh || abs(point.y) >= tresh) {
      this.input.updateDirection();
      this.input.state.set('move_shoot');

    } else {
      this.input.updateDirection();
      this.input.state.set('shoot');

    }
    */

  }

  public onShootDown() {
    this.input.state.set('shoot');
  }

  public update() {
    let input = this.input;

    if (input.keys.up.isDown || input.keys.right.isDown || input.keys.down.isDown || input.keys.left.isDown) {
      input.state.set('move');

    }
  }
}
