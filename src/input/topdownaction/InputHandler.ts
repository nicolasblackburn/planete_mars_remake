import { MoveShootState } from './MoveShootState';
import { ShootState } from './ShootState';
import { MoveState } from './MoveState';
import { IdleState } from './IdleState';
import { Game } from '../../core/Game';
import { Sprite } from '../../core/Sprite';
import { State } from '../../statemachine/State';
import { StateMachine } from '../../statemachine/StateMachine';

const pi_8 = Math.PI / 8;
const tan_pi_8 = Math.tan(pi_8);
const tan_3pi_8 = Math.tan(3 * pi_8);
const sqrt1_2 = Math.SQRT1_2;
const abs = Math.abs;
const max = Math.max;

export class InputHandler {
    public state: StateMachine<State>;
    public target: Sprite;
    public direction: Phaser.Point;
    public keys: { [key: string]: Phaser.Key };
    public game: Game;
    public pointer: Phaser.Pointer;
    public delayedPointerdown: boolean = false;
    public delayedPointerUp: boolean = true;
    public onShoot: Phaser.Signal;
    public onShootStateTimeout: Phaser.Signal;
    public onDelayedPointerDown: Phaser.Signal;
    public onDelayedPointerUp: Phaser.Signal;
    public onPointerDown: Phaser.Signal;
    public onPointerUp: Phaser.Signal;
    public directionScale: number;
    protected shootStateTimer: Phaser.Timer;
    protected shootStateDelay: number = 300;
    protected pointerDownStartTime: number;
    protected delayedPointerDownDispatched: boolean = true;
    protected pointerUpStartTime: number;

    constructor(game: Game, target: Sprite) {
        this.game = game;
        this.target = target;
        this.direction = new Phaser.Point(0, 1);
        this.directionScale = 0

        this.keys = {
            up: this.game.input.keyboard.addKey(Phaser.Keyboard.I),
            left: this.game.input.keyboard.addKey(Phaser.Keyboard.J),
            down: this.game.input.keyboard.addKey(Phaser.Keyboard.K),
            right: this.game.input.keyboard.addKey(Phaser.Keyboard.L),
            shoot: this.game.input.keyboard.addKey(Phaser.Keyboard.S)
        }

        this.pointer = this.game.input.activePointer;

        this.onPointerDown = new Phaser.Signal();
        this.onPointerUp = new Phaser.Signal();
        this.onShoot = new Phaser.Signal();
        this.onShootStateTimeout = new Phaser.Signal();
        this.onDelayedPointerDown = new Phaser.Signal();
        this.onDelayedPointerUp = new Phaser.Signal();

        this.game.input.onDown.add(() => {
            this.onPointerDown.dispatch();
            this.delayedPointerUp = false;
        });

        this.game.input.onUp.add(() => {
            this.onPointerUp.dispatch();
            this.pointerUpStartTime = this.game.time.totalElapsedSeconds();
        });

        this.state = new StateMachine();
        this.state.onEnter.add(this.onEnter, this);
        this.state.onExit.add(this.onExit, this);
        this.state.add('idle', new IdleState(this));
        this.state.add('move', new MoveState(this));
        this.state.add('shoot', new ShootState(this));
        this.state.add('move_shoot', new MoveShootState(this));
        this.state.set('idle');
    }

    public onEnter(oldState: string, newState: string) {
    }

    public onExit() {
        this.keys.shoot.onDown.removeAll();
        this.onShootStateTimeout.removeAll();
        this.onDelayedPointerDown.removeAll();
        this.onDelayedPointerUp.removeAll();
        this.onPointerDown.removeAll();
        this.onPointerUp.removeAll();
    }

    protected isPointerInSmallRange() {
        const point = this.getRelativePointerCoordinates();
        const dx = point.x;
        const dy = point.y;

        if (abs(dx) < 8 && abs(dy) < 8) {
            return true;
        } else {
            return false;
        }
    }

    public getDirection() {
        const keys = this.keys;
        const pointer = this.pointer;
        const defaultDirection = this.direction;

        if (pointer.isDown) {
            const point = this.getRelativePointerCoordinates();
            const dx = point.x;
            const dy = point.y;
            const tan = dx !== 0 ? abs(dy / dx) : 0;

            if (abs(dx) < 8 && abs(dy) < 8) {
                return defaultDirection;
            }

            if (dx === 0 && dy < 0) {
                return new Phaser.Point(0, -1);

            } else if (dx > 0 && dy === 0) {
                return new Phaser.Point(1, 0);

            } else if (dx === 0 && dy > 0) {
                return new Phaser.Point(0, 1);

            } else if (dx < 0 && dy === 0) {
                return new Phaser.Point(1, 0);

            } else if (dx > 0 && dy < 0) {
                if (tan < tan_pi_8) {
                    return new Phaser.Point(1, 0);
                } else if (tan <= tan_3pi_8) {
                    return new Phaser.Point(sqrt1_2, -sqrt1_2);
                } else {
                    return new Phaser.Point(0, -1);
                }

            } else if (dx > 0 && dy > 0) {
                if (tan < tan_pi_8) {
                    return new Phaser.Point(1, 0);
                } else if (tan <= tan_3pi_8) {
                    return new Phaser.Point(sqrt1_2, sqrt1_2);
                } else {
                    return new Phaser.Point(0, 1);
                }

            } else if (dx < 0 && dy > 0) {
                if (tan < tan_pi_8) {
                    return new Phaser.Point(-1, 0);
                } else if (tan <= tan_3pi_8) {
                    return new Phaser.Point(-sqrt1_2, sqrt1_2);
                } else {
                    return new Phaser.Point(0, 1);
                }

            } else if (dx < 0 && dy < 0) {
                if (tan < tan_pi_8) {
                    return new Phaser.Point(-1, 0);
                } else if (tan <= tan_3pi_8) {
                    return new Phaser.Point(-sqrt1_2, -sqrt1_2);
                } else {
                    return new Phaser.Point(0, -1);
                }
            }
        }

        if (keys.up.isDown && keys.right.isDown) {
            return new Phaser.Point(sqrt1_2, -sqrt1_2);

        } else if (keys.right.isDown && keys.down.isDown) {
            return new Phaser.Point(sqrt1_2, sqrt1_2);

        } else if (keys.down.isDown && keys.left.isDown) {
            return new Phaser.Point(-sqrt1_2, sqrt1_2);

        } else if (keys.left.isDown && keys.up.isDown) {
            return new Phaser.Point(-sqrt1_2, -sqrt1_2);

        } else if (keys.up.isDown) {
            return new Phaser.Point(0, -1);

        } else if (keys.right.isDown) {
            return new Phaser.Point(1, 0);

        } else if (keys.down.isDown) {
            return new Phaser.Point(0, 1);

        } else if (keys.left.isDown) {
            return new Phaser.Point(-1, 0);

        }

        return defaultDirection;

    }

    public getRelativePointerCoordinates() {
        const dx = this.pointer.x - this.target.x + this.game.camera.x;
        const dy = this.pointer.y - this.target.y + this.game.camera.y;
        return new Phaser.Point(dx, dy);
    }

    public resetShootStateTimer() {
        if (this.shootStateTimer) {
            this.shootStateTimer.destroy();
        }
        this.shootStateTimer = this.game.time.create();
        this.shootStateTimer.add(this.shootStateDelay, this.exitShootState, this);
        this.shootStateTimer.start();
    }

    public stopShootStateTimer() {
        if (this.shootStateTimer) {
            this.shootStateTimer.destroy();
        }
    }

    public update() {
        this.updateDirection();

        if (this.isPointerInSmallRange()) {
            this.directionScale = 0;
        } else {
            this.directionScale = 1;
        }

        if (this.pointer.isUp && !this.delayedPointerUp) {
            const timeElapsed = this.game.time.totalElapsedSeconds() - this.pointerUpStartTime;
            if (timeElapsed >= 0.2) {
                this.delayedPointerUp = true;
                this.onDelayedPointerUp.dispatch();
            }
        }

        this.state.current().update();
    }

    public exitShootState() {
        this.onShootStateTimeout.dispatch();
    }

    public updateDirection() {
        this.direction = this.getDirection();
    }
}
