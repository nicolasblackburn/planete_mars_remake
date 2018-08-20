import { PlayerState } from './PlayerState';

export class ControlledState extends PlayerState {
    public walkVelocity: number = 40;
    protected direction: Phaser.Point;
    protected condition: () => void;

    public enter(from: string, direction: Phaser.Point, condition: () => boolean) {
        this.direction = direction;
        this.condition = condition;
    }

    public update() {
        const player = this.player;

        if (!this.condition()) {
            player.state.set('normal');
        }

        const maxVelocity = this.walkVelocity;
        const elapsedMS = this.game.time.elapsedMS * this.game.timeScale;

        player.animations.play(player.animationKey('move', this.direction), null, true);

        player.body.velocity.x = this.direction.x * maxVelocity * elapsedMS;
        player.body.velocity.y = this.direction.y * maxVelocity * elapsedMS;
    }
}
