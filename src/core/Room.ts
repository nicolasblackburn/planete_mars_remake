import { Player } from '../objects/player/Player';
import { Group } from './Group';
import { Game } from './Game';

export class Room {
    public game: Game;
    public layers: Group;
    public bullets: Group;
    public enemies: Group;
    public player: Player;
    public collisions: Map<string, Phaser.Physics.P2.CollisionGroup>;
    public map: Phaser.Tilemap;
    public walls: Phaser.Physics.P2.Body[];

    constructor(game: Game) {
        this.game = game;
    }

    public create() {
        this.collisions = new Map();
        this.collisions.set(
            "player",
            this.game.physics.p2.createCollisionGroup()
        );
        this.collisions.set(
            "enemies",
            this.game.physics.p2.createCollisionGroup()
        );
        this.collisions.set(
            "bullets",
            this.game.physics.p2.createCollisionGroup()
        );
        this.collisions.set(
            "walls",
            this.game.physics.p2.createCollisionGroup()
        );
        this.collisions.set(
            "rooms",
            this.game.physics.p2.createCollisionGroup()
        );

        this.layers = this.game.factory.group();
        this.enemies = this.game.factory.group();
        this.addPlayer(0, 0, "player");
        this.bullets = this.game.factory.group();
        this.walls = [];
    }

    public addBullet(x: number, y: number, direction: Phaser.Point) {
        const bullet = this.game.factory.bullet(x, y);
        bullet.name = "bullet";
        bullet.setDirection(direction);
        bullet.body.setCollisionGroup(this.collisions.get("bullets"));
        this.bullets.add(bullet);

        return bullet;
    }

    public addEnemy(type: string, x: number, y: number, name?: string) {
        const enemy = this.game.factory.create(type, x, y);
        this.enemies.add(enemy);

        if (name) {
            enemy.name = name;
        }

        enemy.body.setCollisionGroup(this.collisions.get("enemies"));
        enemy.body.collides(this.collisions.get("walls"));
    }

    public addPlayer(x: number, y: number, name?: string) {
        const player = this.game.factory.player(x, y);
        this.player = player;
        this.game.world.add(player);

        if (name) {
            player.name = name;
        }

        player.body.setCollisionGroup(this.collisions.get("player"));
        player.body.collides(this.collisions.get("walls"));
    }

    public setMap(map: Phaser.Tilemap) {
        this.map = map;
    }
}
