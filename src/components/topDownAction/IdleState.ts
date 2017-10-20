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
    if (input.keys.up.isDown && input.keys.right.isDown) {
      input.direction = new Phaser.Point(sqrt1_2, -sqrt1_2);
      input.aimDirection = input.direction;
      input.lastNonDiagonalDirection = new Phaser.Point(0, -1);
      input.state.set('move');

    } else if (input.keys.right.isDown && input.keys.down.isDown) {
      input.direction = new Phaser.Point(sqrt1_2, sqrt1_2);
      input.aimDirection = input.direction;
      input.lastNonDiagonalDirection = new Phaser.Point(1, 0);
      input.state.set('move');

    } else if (input.keys.down.isDown && input.keys.left.isDown) {
      input.direction = new Phaser.Point(-sqrt1_2, sqrt1_2);
      input.aimDirection = input.direction;
      input.lastNonDiagonalDirection = new Phaser.Point(0, 1);
      input.state.set('move');

    } else if (input.keys.left.isDown && input.keys.up.isDown) {
      input.direction = new Phaser.Point(-sqrt1_2, -sqrt1_2);
      input.aimDirection = input.direction;
      input.lastNonDiagonalDirection = new Phaser.Point(-1, 0);
      input.state.set('move');

    } else if (input.keys.up.isDown) {
      input.direction = new Phaser.Point(0, -1);
      input.aimDirection = input.direction;
      input.lastNonDiagonalDirection = new Phaser.Point(0, -1);
      input.state.set('move');

    } else if (input.keys.right.isDown) {
      input.direction = new Phaser.Point(1, 0);
      input.aimDirection = input.direction;
      input.lastNonDiagonalDirection = new Phaser.Point(1, 0);
      input.state.set('move');

    } else if (input.keys.down.isDown) {
      input.direction = new Phaser.Point(0, 1);
      input.aimDirection = input.direction;
      input.lastNonDiagonalDirection = new Phaser.Point(0, 1);
      input.state.set('move');

    } else if (input.keys.left.isDown) {
      input.direction = new Phaser.Point(-1, 0);
      input.aimDirection = input.direction;
      input.lastNonDiagonalDirection = new Phaser.Point(-1, 0);
      input.state.set('move');

    } else if (input.keys.shoot.isDown) {
      input.state.set('shoot');

    }
  }
}
