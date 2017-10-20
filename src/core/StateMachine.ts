export abstract class State {
  public enter(previous: string) { };
  public update() { };
  public exit(next: string) { };
}

export class StateMachine {
  private states: Map<string, State> = new Map();
  private _current: string;
  public events: {[key: string]: Phaser.Signal} = {};
  constructor() {
    this.events.onEnter = new Phaser.Signal();
    this.events.onExit = new Phaser.Signal();
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
    if (this._current !== key) {
      let previous = this.key();
      if (this.current()) {
        this.events.onExit.dispatch(previous, key);
        this.current().exit(key);
      }
      this._current = key;
      if (this.current()) {
        this.events.onEnter.dispatch(previous, key);
        this.current().enter(previous);
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
