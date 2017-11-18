import { Enemy } from "../core/Enemy";
import { Game } from "../core/Game";

enum CrabState {
    sentry,
    seek
}

export class Crab extends Enemy {
    public damagePoints: number = 40;
    public spawnPoint: Phaser.Point;
    public state: CrabState = CrabState.sentry;
    public sentryTimer: Phaser.Timer;
    public sentryDirection: Phaser.Point;
    public sentryDuration: number = 2000;
    public directionsCache: Phaser.Point[];
    protected baseVelocity: number = 6;

    constructor(game: Game, x: number, y: number) {
        super(game, x, y, "sprites", "crab_00");

        this.body.fixedRotation = true;

        this.addAnimations("crab");

        this.directionsCache = [];

        for (let i = 0; i < 8; i++) {
            const v = new Phaser.Point(
                Math.round(Math.cos(i / 4 * Math.PI)),
                Math.round(Math.sin(i / 4 * Math.PI))
            );
            const abs = Math.sqrt(v.x * v.x + v.y * v.y);
            v.x /= abs;
            v.y /= abs;

            this.directionsCache[i] = v;
        }

        this.setSentryState();
    }

    public update() {
        switch (this.state) {
            case CrabState.sentry:
                this.updateSentry();
                break;
            case CrabState.seek:
                this.updateSeek();
                break;
        }
    }

    public setSentryState() {
        this.state = CrabState.sentry;
        this.sentryDirection = this.directionsCache[Math.floor(Math.random() * this.directionsCache.length)];
        this.sentryTimer = this.game.time.create(false);
        this.sentryTimer.loop(this.sentryDuration, () => {
            this.sentryDirection = this.directionsCache[Math.floor(Math.random() * this.directionsCache.length)];
        });
        this.sentryTimer.start();
    }
        
    public updateSentry() {
        const game = this.game as Game;
        const pixelScale = game.pixelScale;
        const baseVelocity = this.baseVelocity * pixelScale;
        const elapsedMS = game.time.elapsedMS * game.timeScale;

        this.animations.play("idle", null, true);

        this.body.velocity.x = baseVelocity * elapsedMS * this.sentryDirection.x;
        this.body.velocity.y = baseVelocity * elapsedMS * this.sentryDirection.y;
    }
    
    public updateSeek() {
        //this.animations.play("idle", null, true);
    }
}
