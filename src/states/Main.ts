import { MapParser } from "core/MapParser";
import { Sprite } from "core/Sprite";
import { Enemy } from "core/Enemy";
import { Bullet } from "objects/Bullet";
import { Game } from "core/Game";
import { Group } from "core/Group";
import { fontStyles } from "fontStyles";
import { Player } from "objects/player/Player";
import {
    applyTransform,
    Shape,
    intersects,
    rectangleToPolygon,
    rectangleToNumberArray
} from "geom";
import { Room } from "core/Room";

const floor = Math.floor;
const CAMERA_PADDING = 8;

export class Main extends Phaser.State {
    public topRoom: Room;
    public rooms: Map<string, Phaser.Rectangle>;
    public currentRoom: string;
    public triggers: Shape[];
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
        this.rooms = new Map();
    }

    public create() {
        const game = this.game as Game;
        this.mapParser = new MapParser(game);

        this.topRoom = new Room(game);
        this.topRoom.create();
        this.topRoom.setMap(new Phaser.Tilemap(game, "level1_intro"));
        this.mapParser.loadMapData("level1_intro", this);

        this.updateRoom();

        this.hud = game.add.group();
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
        return this.rooms.get(this.currentRoom);
    }

    public collideBulletEnemy(bullet: Bullet, enemy: Enemy) {
        bullet.kill();
        enemy.kill();
    }

    public collidePlayerEnemy(player: Player, enemy: Enemy) {
        player.hurt(enemy.damagePoints);
    }

    public resize() {
        const game = this.game as Game;
        const width = game.width;
        const height = game.height;
        const scale =
            height === 0 || width / height >= 1 ? height / 360 : width / 360;

        this.healthText.fontSize = floor(fontStyles.body.fontSize * scale);
        this.cameraPadding = floor(8 * scale);

        if (this.lastScale !== game.pixelScale) {
            game.camera.x = floor(
                game.camera.x / this.lastScale * game.pixelScale
            );
            game.camera.y = floor(
                game.camera.y / this.lastScale * game.pixelScale
            );
            this.constrainCamera();
            this.lastScale = game.pixelScale;
        }
    }

    public setCurrentRoom(key: string) {
        this.currentRoom = key;
    }

    public update() {
        this.updateRoom();
        this.updateCollisions();

        const game = this.game as Game;
        const room = this.getCurrentRoom();
        const player = this.topRoom.player;

        game.camera.x = floor(player.x - this.camera.width / 2);
        game.camera.y = floor(player.y - this.camera.height / 2);

        this.constrainCamera();

        this.healthText.text = "Énergie: " + player.health + "%";
        //this.healthText.text += "\nFPS: " + game.time.fps;

        this.hud.position.set(
            game.camera.x + this.cameraPadding,
            game.camera.y + this.cameraPadding
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
        const game = this.game as Game;
        const pixelScale = game.pixelScale;
        const player = this.topRoom.player;

        const bounds = applyTransform(
            new Phaser.Matrix()
                .scale(pixelScale, pixelScale)
                .translate(
                    player.x - player.anchor.x * player.width,
                    player.y - player.anchor.y * player.height
                ),
            Phaser.Rectangle.clone(player.collisionRectangle)
        ) as Phaser.Rectangle;

        (window as any).debug.clear().draw(bounds);

        for (const trigger of this.triggers) {
            (window as any).debug.draw(trigger);

            if (
                intersects(bounds, trigger) &&
                game.input.activePointer.isDown
            ) {
                console.log("Intersects!");
            }
        }

        for (const [key, room] of this.rooms.entries()) {
            if (key !== this.currentRoom) {
                if (room.contains(player.x, player.y)) {
                    this.setCurrentRoom(key);
                    break;
                }
            }
        }
    }

    protected constrainCamera() {
        const game = this.game as Game;
        const pixelScale = game.pixelScale;
        const tileWidth = this.topRoom.map.tileWidth / 4 * pixelScale;
        const tileHeight = this.topRoom.map.tileHeight / 4 * pixelScale;

        const room = this.getCurrentRoom();

        if (!room) {
            return;
        }

        const maxX = room.x + room.width - this.camera.width;
        const maxY = room.y + room.height - this.camera.height;

        if (game.camera.x < room.x) {
            game.camera.x = room.x;
        } else if (game.camera.x > maxX) {
            game.camera.x = maxX;
        }

        if (game.camera.y < room.y) {
            game.camera.y = room.y;
        } else if (game.camera.y > maxY) {
            game.camera.y = maxY;
        }
    }
}
