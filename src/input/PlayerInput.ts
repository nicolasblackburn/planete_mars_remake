import {Game} from '../core/Game';
import {EventEmitter} from 'eventemitter3';

const Point = Phaser.Point;
const sqrt1_2 = Math.SQRT1_2;

export class PlayerInput {
  public animationKey: string;
  public state: StateMachine;
  public aimDirection: Phaser.Point;
  public direction: Phaser.Point;
  public lastNonDiagonalDirection: Phaser.Point;
  public keys: {[key: string]: Phaser.Key};
  public shootTimeout: number = 0;
  private game: Game;

  constructor(game: Game) {
    this.game = game;

    this.animationKey = 'idle_down';
    this.direction = new Phaser.Point(0, 0);
    this.aimDirection = new Phaser.Point(0, 1);
    this.lastNonDiagonalDirection = new Phaser.Point(0, 1);

    this.keys = {
      up: this.game.input.keyboard.addKey(Phaser.Keyboard.I),
      left: this.game.input.keyboard.addKey(Phaser.Keyboard.J),
      down: this.game.input.keyboard.addKey(Phaser.Keyboard.K),
      right: this.game.input.keyboard.addKey(Phaser.Keyboard.L),
      shoot: this.game.input.keyboard.addKey(Phaser.Keyboard.S)
    }

    this.state = new StateMachine();
    this.state.add('idle', new IdleState(this));
    this.state.add('move', new MoveState(this));
    this.state.add('shoot', new ShootState(this));
    this.state.add('move_shoot', new MoveShootState(this));
    this.state.set('idle');
  }

  public enter(direction: Phaser.Point) {
    this.direction = direction;
  }

  public update() {
    this.state.current().update();
  }
}

abstract class State {
  public event: EventEmitter;
  constructor() {
    this.event = new EventEmitter;
  }
  public enter(previous: string) {};
  public update() {};
  public exit(next: string) {};
}

class StateMachine {
  private states: {[key: string]: State} = {};
  private _current: string;
  public add(key: string, state: State) {
    this.states[key] = state;
  }
  public set(key: string) {
    if (this._current !== key) {
      let previous = this.key();
      if (this.current()) {
        this.current().event.emit('exit', previous, key);
        this.current().exit(key);
      }
      this._current = key;
      if (this.current()) {
        this.current().event.emit('enter', previous, key);
        this.current().enter(previous);
      }
    }
  }
  public current() {
    return this.states[this._current];
  }
  public key() {
    return this._current;
  }
  public has(key: string) {
    return this.states.hasOwnProperty(key);
  }
  public remove(key: string) {
    delete this.states[key];
  }
}

class IdleState extends State {
  private input: PlayerInput;

  constructor(input: PlayerInput) {
    super();
    this.input = input;
  }

  public update() {
    let input = this.input;
    if (input.keys.up.isDown && input.keys.right.isDown) {
      input.direction = new Point(sqrt1_2, -sqrt1_2);
      input.aimDirection = input.direction;
      input.lastNonDiagonalDirection = new Phaser.Point(0, -1);
      input.state.set('move');

    } else if (input.keys.right.isDown && input.keys.down.isDown) {
      input.direction = new Point(sqrt1_2, sqrt1_2);
      input.aimDirection = input.direction;
      input.lastNonDiagonalDirection = new Phaser.Point(1, 0);
      input.state.set('move');

    } else if (input.keys.down.isDown && input.keys.left.isDown) {
      input.direction = new Point(-sqrt1_2, sqrt1_2);
      input.aimDirection = input.direction;
      input.lastNonDiagonalDirection = new Phaser.Point(0, 1);
      input.state.set('move');

    } else if (input.keys.left.isDown && input.keys.up.isDown) {
      input.direction = new Point(-sqrt1_2, -sqrt1_2);
      input.aimDirection = input.direction;
      input.lastNonDiagonalDirection = new Phaser.Point(-1, 0);
      input.state.set('move');

    } else if (input.keys.up.isDown) {
      input.direction = new Point(0, -1);
      input.aimDirection = input.direction;
      input.lastNonDiagonalDirection = new Phaser.Point(0, -1);
      input.state.set('move');

    } else if (input.keys.right.isDown) {
      input.direction = new Point(1, 0);
      input.aimDirection = input.direction;
      input.lastNonDiagonalDirection = new Phaser.Point(1, 0);
      input.state.set('move');

    } else if (input.keys.down.isDown) {
      input.direction = new Point(0, 1);
      input.aimDirection = input.direction;
      input.lastNonDiagonalDirection = new Phaser.Point(0, 1);
      input.state.set('move');

    } else if (input.keys.left.isDown) {
      input.direction = new Point(-1, 0);
      input.aimDirection = input.direction;
      input.lastNonDiagonalDirection = new Phaser.Point(-1, 0);
      input.state.set('move');

    } else if (input.keys.shoot.isDown) {
      input.state.set('shoot');

    }
  }
}

class MoveState extends State {
  private input: PlayerInput;

  constructor(input: PlayerInput) {
    super();
    this.input = input;
  }

  public update() {
    let input = this.input;

    if (input.keys.shoot.isDown) {
      input.state.set('move_shoot');
      return;
    }

    if (input.keys.up.isDown && input.keys.right.isDown) {
      input.direction = new Point(sqrt1_2, -sqrt1_2);
      input.aimDirection = input.direction;
      input.lastNonDiagonalDirection = new Phaser.Point(0, -1);

    } else if (input.keys.right.isDown && input.keys.down.isDown) {
      input.direction = new Point(sqrt1_2, sqrt1_2);
      input.aimDirection = input.direction;
      input.lastNonDiagonalDirection = new Phaser.Point(1, 0);

    } else if (input.keys.down.isDown && input.keys.left.isDown) {
      input.direction = new Point(-sqrt1_2, sqrt1_2);
      input.aimDirection = input.direction;
      input.lastNonDiagonalDirection = new Phaser.Point(0, 1);

    } else if (input.keys.left.isDown && input.keys.up.isDown) {
      input.direction = new Point(-sqrt1_2, -sqrt1_2);
      input.aimDirection = input.direction;
      input.lastNonDiagonalDirection = new Phaser.Point(-1, 0);

    } else if (input.keys.up.isDown) {
      input.direction = new Point(0, -1);
      input.aimDirection = input.direction;
      input.lastNonDiagonalDirection = new Phaser.Point(0, -1);

    } else if (input.keys.right.isDown) {
      input.direction = new Point(1, 0);
      input.aimDirection = input.direction;
      input.lastNonDiagonalDirection = new Phaser.Point(1, 0);

    } else if (input.keys.down.isDown) {
      input.direction = new Point(0, 1);
      input.aimDirection = input.direction;
      input.lastNonDiagonalDirection = new Phaser.Point(0, 1);

    } else if (input.keys.left.isDown) {
      input.direction = new Point(-1, 0);
      input.aimDirection = input.direction;
      input.lastNonDiagonalDirection = new Phaser.Point(-1, 0);

    } else {
      input.direction = new Phaser.Point(0, 0);
      input.state.set('idle');

    }
  }
}

class ShootState extends State {
  private input: PlayerInput;

  constructor(input: PlayerInput) {
    super();
    this.input = input;
  }

  public enter(previous: string) {
    if (previous !== 'move_shoot') {
      this.input.shootTimeout = 0;
    }
  }

  public update() {
    const input = this.input;

    if (input.keys.shoot.isDown) {
      input.shootTimeout = 0;
    }

    if (input.shootTimeout >= 10) {
      input.state.set('idle');
      return;
    }
    input.shootTimeout++;
    if (input.keys.up.isDown && input.keys.right.isDown) {
      input.direction = new Point(sqrt1_2, -sqrt1_2);
      input.aimDirection = input.direction;
      input.lastNonDiagonalDirection = new Phaser.Point(0, -1);
      input.state.set('move_shoot');

    } else if (input.keys.right.isDown && input.keys.down.isDown) {
      input.direction = new Point(sqrt1_2, sqrt1_2);
      input.aimDirection = input.direction;
      input.lastNonDiagonalDirection = new Phaser.Point(1, 0);
      input.state.set('move_shoot');

    } else if (input.keys.down.isDown && input.keys.left.isDown) {
      input.direction = new Point(-sqrt1_2, sqrt1_2);
      input.aimDirection = input.direction;
      input.lastNonDiagonalDirection = new Phaser.Point(0, 1);
      input.state.set('move_shoot');

    } else if (input.keys.left.isDown && input.keys.up.isDown) {
      input.direction = new Point(-sqrt1_2, -sqrt1_2);
      input.aimDirection = input.direction;
      input.lastNonDiagonalDirection = new Phaser.Point(-1, 0);
      input.state.set('move_shoot');

    } else if (input.keys.up.isDown) {
      input.direction = new Point(0, -1);
      input.aimDirection = input.direction;
      input.lastNonDiagonalDirection = new Phaser.Point(0, -1);
      input.state.set('move_shoot');

    } else if (input.keys.right.isDown) {
      input.direction = new Point(1, 0);
      input.aimDirection = input.direction;
      input.lastNonDiagonalDirection = new Phaser.Point(1, 0);
      input.state.set('move_shoot');

    } else if (input.keys.down.isDown) {
      input.direction = new Point(0, 1);
      input.aimDirection = input.direction;
      input.lastNonDiagonalDirection = new Phaser.Point(0, 1);
      input.state.set('move_shoot');

    } else if (input.keys.left.isDown) {
      input.direction = new Point(-1, 0);
      input.aimDirection = input.direction;
      input.lastNonDiagonalDirection = new Phaser.Point(-1, 0);
      input.state.set('move_shoot');

    }
  }
}

class MoveShootState extends State {
  private input: PlayerInput;

  constructor(input: PlayerInput) {
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
    }

    if (input.shootTimeout >= 10) {
      input.state.set('move');
      return;
    }
    input.shootTimeout++;
    if (input.keys.up.isDown && input.keys.right.isDown) {
      input.direction = new Point(sqrt1_2, -sqrt1_2);
      input.aimDirection = input.direction;
      input.lastNonDiagonalDirection = new Phaser.Point(0, -1);

    } else if (input.keys.right.isDown && input.keys.down.isDown) {
      input.direction = new Point(sqrt1_2, sqrt1_2);
      input.aimDirection = input.direction;
      input.lastNonDiagonalDirection = new Phaser.Point(1, 0);

    } else if (input.keys.down.isDown && input.keys.left.isDown) {
      input.direction = new Point(-sqrt1_2, sqrt1_2);
      input.aimDirection = input.direction;
      input.lastNonDiagonalDirection = new Phaser.Point(0, 1);

    } else if (input.keys.left.isDown && input.keys.up.isDown) {
      input.direction = new Point(-sqrt1_2, -sqrt1_2);
      input.aimDirection = input.direction;
      input.lastNonDiagonalDirection = new Phaser.Point(-1, 0);

    } else if (input.keys.up.isDown) {
      input.direction = new Point(0, -1);
      input.aimDirection = input.direction;
      input.lastNonDiagonalDirection = new Phaser.Point(0, -1);

    } else if (input.keys.right.isDown) {
      input.direction = new Point(1, 0);
      input.aimDirection = input.direction;
      input.lastNonDiagonalDirection = new Phaser.Point(1, 0);

    } else if (input.keys.down.isDown) {
      input.direction = new Point(0, 1);
      input.aimDirection = input.direction;
      input.lastNonDiagonalDirection = new Phaser.Point(0, 1);

    } else if (input.keys.left.isDown) {
      input.direction = new Point(-1, 0);
      input.aimDirection = input.direction;
      input.lastNonDiagonalDirection = new Phaser.Point(-1, 0);

    } else {
      input.direction = new Point(0, 0);
      input.state.set('shoot');
    }
  }
}
