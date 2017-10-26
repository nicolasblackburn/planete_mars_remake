export abstract class State {
  public enter(previous: string) { };
  public update() { };
  public exit(next: string) { };
}

export class StateMachine {
  public onEnter: Phaser.Signal;
  public onExit: Phaser.Signal;
  protected states: Map<string, State> = new Map();
  protected _current: string;

  constructor() {
    this.onEnter = new Phaser.Signal();
    this.onExit = new Phaser.Signal();
  }

  public add(key: string, state: State) {
    this.states.set(key, state);
  }

  public clear() {
    this.states.clear();
  }

  public entries() {
    return this.states.entries();
  }

  public forEach(callback: (...args: any[]) => void, ...args:any[]) {
    this.states.forEach.apply(null, [callback, ...args]);
  }

  public set(key: string) {
    if (! this.states.has(key)) {
      throw new Error('State `' + key + '` doesn\'t exists');
    }
    if (this._current !== key) {
      let previous = this.key();
      if (this.current()) {
        this.current().exit(key);
        this.onExit.dispatch(previous, key);
      }
      this._current = key;
      if (this.current()) {
        this.current().enter(previous);
        this.onEnter.dispatch(previous, key);
      }
    }
  }

  public keys() {
    return this.states.keys();
  }

  public values() {
    return this.states.values();
  }

  public get(key: string) {
    return this.states.get(key);
  }

  public current() {
    return this.states.get(this._current);
  }

  public key() {
    return this._current;
  }

  public has(key: string) {
    return this.states.has(key);
  }

  public remove(state: string) {
    this.states.delete(state as string);
  }

  public [Symbol.iterator]() {
    return this.states[Symbol.iterator]();
  }
}
