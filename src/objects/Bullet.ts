import { Game } from '../core/Game';
import { Sprite } from '../core/Sprite';

const pi = Math.PI;
const pi_2 = Math.PI / 2;
const pi_4 = Math.PI / 4;
const sqrt1_2 = Math.SQRT1_2;

export class Bullet extends Sprite {
    protected maxVelocity: number = 8;
    protected baseVelocity: Phaser.Point;
    protected aliveTimer: Phaser.Timer;
    protected killDelay: number = 600;

    constructor(game: Game, x: number, y: number) {
        super(game, x, y, 'sprites', 'bullet_00');

        this.baseVelocity = new Phaser.Point(0, 0);
        this.aliveTimer = this.game.time.create();
        this.aliveTimer.add(this.killDelay, this.kill, this);
        this.aliveTimer.start();
    }

    public setDirection(direction: Phaser.Point) {
        if (direction.x > 0 && direction.y < 0) {
            this.body.rotation = 3 * pi_4;
            this.baseVelocity.x = this.maxVelocity * sqrt1_2;
            this.baseVelocity.y = -this.maxVelocity * sqrt1_2;

        } else if (direction.x > 0 && direction.y > 0) {
            this.body.rotation = - 3 * pi_4;
            this.baseVelocity.x = this.maxVelocity * sqrt1_2;
            this.baseVelocity.y = this.maxVelocity * sqrt1_2;

        } else if (direction.x < 0 && direction.y > 0) {
            this.body.rotation = 3 * pi_4;
            this.baseVelocity.x = -this.maxVelocity * sqrt1_2;
            this.baseVelocity.y = this.maxVelocity * sqrt1_2;

        } else if (direction.x < 0 && direction.y < 0) {
            this.body.rotation = pi_4;
            this.baseVelocity.x = -this.maxVelocity * sqrt1_2;
            this.baseVelocity.y = -this.maxVelocity * sqrt1_2;

        } else if (direction.y < 0) {
            this.body.rotation = pi_2;
            this.baseVelocity.x = 0;
            this.baseVelocity.y = -this.maxVelocity;

        } else if (direction.x > 0) {
            this.body.rotation = 0;
            this.baseVelocity.x = this.maxVelocity;
            this.baseVelocity.y = 0;

        } else if (direction.y > 0) {
            this.body.rotation = pi_2;
            this.baseVelocity.x = 0;
            this.baseVelocity.y = this.maxVelocity;

        } else if (direction.x < 0) {
            this.body.rotation = pi;
            this.baseVelocity.x = -this.maxVelocity;
            this.baseVelocity.y = 0;

        }
    }

    public update() {
        this.body.velocity.x = this.baseVelocity.x * this.game.pixelScale * this.game.time.elapsedMS * this.game.timeScale;
        this.body.velocity.y = this.baseVelocity.y * this.game.pixelScale * this.game.time.elapsedMS * this.game.timeScale;
    }
}
