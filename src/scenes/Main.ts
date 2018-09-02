import { Enemy } from '../core/Enemy';
import { Game } from '../core/Game';
import { MapParser } from '../core/MapParser';
import { Room } from '../core/Room';
import { Trigger } from '../core/Trigger';
import { fontStyles } from '../fontStyles';
import { applyTransform, intersects } from '../geom';
import { Bullet } from '../objects/Bullet';
import { Player } from '../objects/player/Player';
import { GameState } from '../core/GameState';

const floor = Math.floor;
const CAMERA_PADDING = 8;

export class Main extends GameState {
    public topRoom: Room;
    public rooms: {[name: string]: Phaser.Rectangle};
    public currentRoom: string;
    public triggers: Trigger[];
    protected cameraPadding: number;
    protected healthText: Phaser.Text;
    protected hud: Phaser.Group;
    protected lastScale: number;
    protected mapParser: MapParser;

    constructor() {
        super();
        this.triggers = [];
        this.cameraPadding = CAMERA_PADDING;
        this.lastScale = 1;
        this.rooms = {};
    }

    public create() {
        this.mapParser = new MapParser(this.game);

        this.topRoom = new Room(this.game);
        this.topRoom.create();
        this.topRoom.setMap(new Phaser.Tilemap(this.game, "level1_intro"));
        this.mapParser.loadMapData("level1_intro", this);

        this.updateRoom();

        this.hud = this.game.add.group();
        this.healthText = this.game.add.text(
            0,
            0,
            "0, 0",
            fontStyles.body,
            this.hud
        );

        this.resize();
    }

    public getCurrentRoom() {
        return this.rooms[this.currentRoom];
    }

    public collideBulletEnemy(bullet: Bullet, enemy: Enemy) {
        bullet.kill();
        enemy.kill();
    }

    public collidePlayerEnemy(player: Player, enemy: Enemy) {
        player.hurt(enemy.damagePoints);
    }

    public resize() {
        const width = this.game.width;
        const height = this.game.height;
        const scale =
            height === 0 || width / height >= 1 ? height / 360 : width / 360;

        this.healthText.fontSize = floor(fontStyles.body.fontSize * scale);
        this.cameraPadding = floor(8 * scale);

        if (this.lastScale !== this.game.pixelScale) {
            this.game.camera.x = floor(
                this.game.camera.x / this.lastScale * this.game.pixelScale
            );
            this.game.camera.y = floor(
                this.game.camera.y / this.lastScale * this.game.pixelScale
            );
            this.constrainCamera();
            this.lastScale = this.game.pixelScale;
        }
    }

    public setCurrentRoom(key: string) {
        this.currentRoom = key;
    }

    public update() {
        this.updateRoom();
        this.updateCollisions();

        const player = this.topRoom.player;

        this.game.camera.x = floor(player.x - this.camera.width / 2);
        this.game.camera.y = floor(player.y - this.camera.height / 2);

        this.constrainCamera();

        this.healthText.text = "Énergie: " + player.health + "%";
        //this.healthText.text += "\nFPS: " + game.time.fps;

        this.hud.position.set(
            this.game.camera.x + this.cameraPadding,
            this.game.camera.y + this.cameraPadding
        );
    }

    protected updateCollisions() {
        this.topRoom.enemies.forEachExists((enemy: Enemy) => {
            const enemyRect = enemy.getBoundsAsRectangle();

            this.topRoom.bullets.forEachExists((bullet: Bullet) => {
                const bulletRect = bullet.getBoundsAsRectangle();

                if (bulletRect.intersects(enemyRect, 0)) {
                    this.collideBulletEnemy(bullet as Bullet, enemy as Enemy);
                }
            });

            if (enemy.exists) {
                const playerRect = this.topRoom.player.getBoundsAsRectangle();

                if (playerRect.intersects(enemyRect, 0)) {
                    this.collidePlayerEnemy(
                        this.topRoom.player as Player,
                        enemy as Enemy
                    );
                }
            }
        });
    }

    protected updateRoom() {
        const player = this.topRoom.player;

        const bounds = applyTransform(
            new Phaser.Matrix()
                .scale(this.game.pixelScale, this.game.pixelScale)
                .translate(
                    player.body.x - player.anchor.x * player.width,
                    player.body.y - player.anchor.y * player.height
                ),
            Phaser.Rectangle.clone(player.collisionRectangle)
        ) as Phaser.Rectangle;

        for (const trigger of this.triggers) {
            if (
                intersects(bounds, trigger.bounds)
            ) {
                trigger.action(player, bounds);
            }
        }

        for (const [key, room] of Object.entries(this.rooms)) {
            if (key !== this.currentRoom) {
                if (room.contains(player.x, player.y)) {
                    this.setCurrentRoom(key);
                    break;
                }
            }
        }
    }

    protected constrainCamera() {
        const room = this.getCurrentRoom();

        if (!room) {
            return;
        }

        const maxX = room.x + room.width - this.camera.width;
        const maxY = room.y + room.height - this.camera.height;

        if (this.game.camera.x < room.x) {
            this.game.camera.x = room.x;
        } else if (this.game.camera.x > maxX) {
            this.game.camera.x = maxX;
        }

        if (this.game.camera.y < room.y) {
            this.game.camera.y = room.y;
        } else if (this.game.camera.y > maxY) {
            this.game.camera.y = maxY;
        }
    }
}
