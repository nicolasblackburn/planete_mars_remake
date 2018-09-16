import { Enemy } from "../core/Enemy";
import { Game } from "../core/Game";
import { Sprite } from '../core/Sprite';
import { Room } from "../core/Room";
import { Player } from "./player/Player";

enum CrabState {
    Sentry,
    Seek
}

enum Velocity {
    Sentry = 1,
    Seek = 2.8
}

export class Crab extends Enemy {
    public damagePoints: number = 40;
    public spawnPoint: Phaser.Point;
    public state: CrabState = CrabState.Sentry;
    public stateTimer: Phaser.Timer;
    public direction: Phaser.Point;
    public duration: number = 2000;
    public directionsCache: Phaser.Point[];
    protected velocity: number = Velocity.Sentry;
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
        this.direction = this.directionsCache[Math.floor(Math.random() * this.directionsCache.length)];
        this.velocity = Velocity.Sentry;
        this.stateTimer = this.game.time.create(false);
        this.stateTimer.loop(2000, () => {
            this.direction = this.directionsCache[Math.floor(Math.random() * this.directionsCache.length)];
        });
        this.stateTimer.start();
    }

    public setSeekState() {
        this.state = CrabState.Seek;
        this.stateTimer.stop();
        this.direction = new Phaser.Point(this.room.player.x - this.x, this.room.player.y - this.y);
        this.direction.normalize();
        this.velocity = Velocity.Seek;
        this.stateTimer = this.game.time.create(false);
        this.stateTimer.add(1500, () => {
            this.animations.getAnimation("idle").speed /= 1.5;
            this.setSentryState();
        });
        this.stateTimer.start();
        this.animations.getAnimation("idle").speed *= 1.5;
    }
        
    public updateSentry() {
        const velocity = this.velocity * this.game.pixelScale;
        const elapsedMS = this.game.time.elapsedMS * this.game.timeScale;

        this.animations.play("idle", null, true);

        this.body.velocity.x = velocity * elapsedMS * this.direction.x;
        this.body.velocity.y = velocity * elapsedMS * this.direction.y;

        if (this.canSee(this.room.player, this.room.walls)) {
            this.setSeekState();
        }
    }
    
    public updateSeek() {
        const velocity = this.velocity * this.game.pixelScale;
        const elapsedMS = this.game.time.elapsedMS * this.game.timeScale;

        this.animations.play("idle", null, true);

        this.direction = new Phaser.Point(this.room.player.x - this.x, this.room.player.y - this.y);
        this.direction.normalize();

        this.body.velocity.x = velocity * elapsedMS * this.direction.x;
        this.body.velocity.y = velocity * elapsedMS * this.direction.y;
    }

    protected canSee(sprite: Player, walls: Phaser.Physics.P2.Body[]) {
        const distanceSquared = 
              Math.pow(sprite.x - this.x, 2) 
            + Math.pow(sprite.y - this.y, 2);

        if (distanceSquared < Math.pow(64 * this.game.pixelScale, 2)) {
            return true;
        } else {
            return false;
        }
    }
}
