import { InputHandler } from './InputHandler';
import { State } from '../../statemachine/State';

const sqrt1_2 = Math.SQRT1_2;

export class MoveShootState extends State {
    protected input: InputHandler;

    constructor(input: InputHandler) {
        super();
        this.input = input;
    }

    public enter(previous: string) {
        this.input.onDelayedPointerUp.add(this.onMoveEnd, this);
        this.input.onShootStateTimeout.add(this.onShootStateTimeout, this);
        this.input.keys.shoot.onDown.add(this.onShootDown, this);
        this.input.onPointerDown.add(this.onShootDown, this);
        this.input.resetShootStateTimer();

        if (previous !== 'shoot') {
            this.input.onShoot.dispatch();
        }
    }

    public onMoveEnd() {
        this.input.state.set('idle');
    }

    public onShootDown() {
        this.input.onShoot.dispatch();
        this.input.resetShootStateTimer();
    }

    public onShootStateTimeout() {
        this.input.state.set('move');
    }

    public update() {
        const input = this.input;

        if (input.keys.up.isUp && input.keys.right.isUp && input.keys.down.isUp && input.keys.left.isUp && input.delayedPointerUp) {
            input.state.set('shoot');
        }
    }
}
