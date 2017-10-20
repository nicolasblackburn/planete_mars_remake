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
    if (input.keys.up.isDown && input.keys.right.isDown) {
      input.direction = new Phaser.Point(sqrt1_2, -sqrt1_2);
      input.aimDirection = input.direction;
      input.lastNonDiagonalDirection = new Phaser.Point(0, -1);

    } else if (input.keys.right.isDown && input.keys.down.isDown) {
      input.direction = new Phaser.Point(sqrt1_2, sqrt1_2);
      input.aimDirection = input.direction;
      input.lastNonDiagonalDirection = new Phaser.Point(1, 0);

    } else if (input.keys.down.isDown && input.keys.left.isDown) {
      input.direction = new Phaser.Point(-sqrt1_2, sqrt1_2);
      input.aimDirection = input.direction;
      input.lastNonDiagonalDirection = new Phaser.Point(0, 1);

    } else if (input.keys.left.isDown && input.keys.up.isDown) {
      input.direction = new Phaser.Point(-sqrt1_2, -sqrt1_2);
      input.aimDirection = input.direction;
      input.lastNonDiagonalDirection = new Phaser.Point(-1, 0);

    } else if (input.keys.up.isDown) {
      input.direction = new Phaser.Point(0, -1);
      input.aimDirection = input.direction;
      input.lastNonDiagonalDirection = new Phaser.Point(0, -1);

    } else if (input.keys.right.isDown) {
      input.direction = new Phaser.Point(1, 0);
      input.aimDirection = input.direction;
      input.lastNonDiagonalDirection = new Phaser.Point(1, 0);

    } else if (input.keys.down.isDown) {
      input.direction = new Phaser.Point(0, 1);
      input.aimDirection = input.direction;
      input.lastNonDiagonalDirection = new Phaser.Point(0, 1);

    } else if (input.keys.left.isDown) {
      input.direction = new Phaser.Point(-1, 0);
      input.aimDirection = input.direction;
      input.lastNonDiagonalDirection = new Phaser.Point(-1, 0);

    } else {
      input.direction = new Phaser.Point(0, 0);
      input.state.set('shoot');
    }
  }
}
