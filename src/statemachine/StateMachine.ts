import { State } from './State';

export class StateMachine<T extends State> {
    public onEnter: Phaser.Signal;
    public onExit: Phaser.Signal;
    protected states: Map<string, T> = new Map();
    protected _current: string;

    constructor() {
        this.onEnter = new Phaser.Signal();
        this.onExit = new Phaser.Signal();
    }

    public add(key: string, state: T) {
        this.states.set(key, state);
    }

    public clear() {
        this.states.clear();
    }

    public entries() {
        return this.states.entries();
    }

    public forEach(callback: (...args: any[]) => void, ...args: any[]) {
        this.states.forEach.apply(null, [callback, ...args]);
    }

    public set(key: string, ...args: any[]) {
        if (!this.states.has(key)) {
            throw new Error('State `' + key + '` doesn\'t exists');
        }
        if (this._current !== key) {
            let previous = this.key();
            if (this.current()) {
                this.current().exit.apply(this.current(), [key, ...args]);
                this.onExit.dispatch.apply(this.onExit, [previous, key, ...args]);
            }
            this._current = key;
            if (this.current()) {
                this.current().enter.apply(this.current(), [previous, ...args]);
                this.onEnter.dispatch.apply(this.onEnter, [previous, key, ...args]);
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
