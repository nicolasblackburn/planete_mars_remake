import { PlayerState } from './PlayerState';

export class NormalState extends PlayerState {
    public walkVelocity: number = 40;
    protected bulletCount: number = 0;
    protected previousMovementAnimationKey: string;
    protected lastAnimationKeyChangeElapsedTime: number = -1

    public hurt(damage: number) {
        if (this.player.blinking) {
            return;
        }

        this.player.health -= damage;
        this.player.state.set('hurt');
    }

    public shoot() {
        if (this.bulletCount < 3) {
            this.bulletCount++;
            const x = this.player.body.x;
            const y = this.player.body.y;
            const direction = this.player.inputHandler.direction;
            const bullet = this.gameState.topRoom.addBullet(x, y, direction);
            bullet.events.onKilled.addOnce(() => {
                this.bulletCount--;
            });
        }
    }


    public update() {
        const input = this.player.inputHandler;
        const maxVelocity = this.walkVelocity;
        const elapsedMS = this.game.time.elapsedMS * this.game.timeScale;

        input.update();

        const animationKey = this.player.animationKey();

        if (this.isMovementState(input.state.key())) {

            if (this.lastAnimationKeyChangeElapsedTime < 0) {
                this.previousMovementAnimationKey = animationKey;
                this.player.animations.play(animationKey, null, true);
                this.lastAnimationKeyChangeElapsedTime = 0;
            } else {
                this.lastAnimationKeyChangeElapsedTime += elapsedMS;
                const minDelay = 100 * this.game.timeScale;

                if (animationKey !== this.previousMovementAnimationKey && this.lastAnimationKeyChangeElapsedTime > minDelay) {
                    this.previousMovementAnimationKey = animationKey;
                    this.player.animations.play(animationKey, null, true);
                    this.lastAnimationKeyChangeElapsedTime = 0;
                }
            }

            this.player.body.velocity.x = input.direction.x * maxVelocity * elapsedMS * input.directionScale;
            this.player.body.velocity.y = input.direction.y * maxVelocity * elapsedMS * input.directionScale;

        } else {
            this.lastAnimationKeyChangeElapsedTime = -1;
            this.previousMovementAnimationKey = null;
            this.player.animations.play(animationKey, null, true);
            this.player.body.velocity.x = 0;
            this.player.body.velocity.y = 0;

        }
    }

    protected isMovementState(state: string) {
        return ['move', 'move_shoot'].includes(state);
    }
}
