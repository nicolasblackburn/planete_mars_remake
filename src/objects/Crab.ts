import { Enemy } from "../core/Enemy";
import { Game } from "../core/Game";
import { Sprite } from '../core/Sprite';
import { Room } from "../core/Room";
import { Player } from "./player/Player";

enum CrabState {
    Sentry,
    Seek
}

export class Crab extends Enemy {
    public damagePoints: number = 40;
    public spawnPoint: Phaser.Point;
    public state: CrabState = CrabState.Sentry;
    public sentryTimer: Phaser.Timer;
    public sentryDirection: Phaser.Point;
    public sentryDuration: number = 2000;
    public directionsCache: Phaser.Point[];
    protected baseVelocity: number = 6;
    protected target: Sprite;
    protected room: Room;

    constructor(game: Game, x: number, y: number, room: Room) {
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

        this.room = room;
    }

    public update() {
        switch (this.state) {
            case CrabState.Sentry:
                this.updateSentry();
                break;
            case CrabState.Seek:
                this.updateSeek();
                break;
        }
    }

    public setSentryState() {
        this.state = CrabState.Sentry;
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

        if (this.canSee(this.room.player, this.room.walls)) {
            this.state = CrabState.Seek;
        }
    }
    
    public updateSeek() {
        //this.animations.play("idle", null, true);
    }

    protected canSee(sprite: Player, walls: Phaser.Physics.P2.Body[]) {
        return false;
    }
}
