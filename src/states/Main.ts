import { Game } from '../core/Game';
import { Group } from "core/Group";
import { State } from "core/State";
import { fontStyles } from "fontStyles";
import { Player } from "objects/Player";

const floor = Math.floor;
const CAMERA_PADDING = 8;

export class Main extends State {
  public rooms: Map<string, Phaser.Rectangle>;
  public layers: Group;
  public bullets: Group;
  public enemies: Group;
  public player: Player;
  public currentRoom: string;
  protected cameraPadding: number;
  public collisions: Map<string, Phaser.Physics.P2.CollisionGroup>;
  protected healthText: Phaser.Text;
  protected hud: Phaser.Group;
  protected lastScale: number;
  protected map: Phaser.Tilemap;

  public addBullet(x: number, y: number, direction: Phaser.Point) {
    const bullet = this.game2.factory.bullet(x, y);
    bullet.name = "bullet";
    this.game2.world.add(bullet);
    bullet.setDirection(direction);

    return bullet;
  }

  constructor(game: Game) {
    super(game);
    this.cameraPadding = CAMERA_PADDING;
    this.lastScale = 1;
    this.rooms = new Map();
  }

  public addEnemy(type: string, x: number, y: number, name?: string) {
    const enemy = this.game2.factory.create(
      type,
      x * this.game2.pixelScale,
      y * this.game2.pixelScale
    );
    this.enemies.add(enemy);

    if (name) {
      enemy.name = name;
    }

    enemy.body.setCollisionGroup(this.collisions.get("enemies"));
    enemy.body.collides(this.collisions.get("walls"));
  }

  public addPlayer(x: number, y: number, name?: string) {
    const player = this.game2.factory.player(
      x * this.game2.pixelScale,
      y * this.game2.pixelScale
    );
    player.setState(this);
    this.player = player;
    this.game2.world.add(player);

    if (name) {
      player.name = name;
    }

    player.body.setCollisionGroup(this.collisions.get("player"));
    player.body.collides(this.collisions.get("walls"));
  }

  public create() {
    this.collisions = new Map();
    this.collisions.set("player", this.physics.p2.createCollisionGroup());
    this.collisions.set("enemies", this.physics.p2.createCollisionGroup());
    this.collisions.set("bullets", this.physics.p2.createCollisionGroup());
    this.collisions.set("walls", this.physics.p2.createCollisionGroup());
    this.collisions.set("rooms", this.physics.p2.createCollisionGroup());

    this.layers = this.game2.factory.group();
    this.enemies = this.game2.factory.group();
    this.bullets = this.game2.factory.group();

    this.enemies.updateOnlyExistingChildren = true;
    this.bullets.updateOnlyExistingChildren = true;

    this.map = new Phaser.Tilemap(this.game2, "level1_intro");
    this.loadMapData("level1_intro");

    this.updateRoom();

    this.hud = this.game2.add.group();
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

  public onCollideBulletEnemy(
    bullet: Phaser.Physics.P2.Body,
    enemy: Phaser.Physics.P2.Body,
    bulletShape: p2.Shape,
    enemyShape: p2.Shape
  ) {
    bullet.sprite.kill();
    enemy.sprite.exists = false;
  }

  public onCollidePlayerRoom(
    player: Phaser.Physics.P2.Body,
    room: Phaser.Physics.P2.Body,
    playerShape: p2.Shape,
    roomShape: p2.Shape
  ) {
    console.log('Collide room `' + (room as any).name + '`');
  }

  public resize() {
    const width = this.game2.width;
    const height = this.game2.height;
    const scale =
      height === 0 || width / height >= 1 ? height / 360 : width / 360;

    this.healthText.fontSize = floor(fontStyles.body.fontSize * scale);
    this.cameraPadding = floor(8 * scale);

    if (this.lastScale !== this.game2.pixelScale) {
      this.game2.camera.x = floor(
        this.game2.camera.x / this.lastScale * this.game2.pixelScale
      );
      this.game2.camera.y = floor(
        this.game2.camera.y / this.lastScale * this.game2.pixelScale
      );
      this.constrainCamera();
      this.lastScale = this.game2.pixelScale;
    }
  }

  public update() {
    const pixelScale = this.game2.pixelScale;
    const tileWidth = this.map.tileWidth / 2 * pixelScale;
    const tileHeight = this.map.tileHeight / 2 * pixelScale;

    this.updateRoom();

    const room = this.getCurrentRoom();

    this.game2.camera.x = floor(this.player.x - this.camera.width / 2);
    this.game2.camera.y = floor(this.player.y - this.camera.height / 2);

    this.constrainCamera();

    this.healthText.text = "Énergie: 100%";
    //this.healthText.text += "\nFPS: " + this.game2.time.fps;

    this.hud.position.set(
      this.game2.camera.x + this.cameraPadding,
      this.game2.camera.y + this.cameraPadding
    );
  }

  protected updateRoom() {
    const playerX = this.player.x;
    const playerY = this.player.y;

    for (const [key, room] of this.rooms.entries()) {
      if (key !== this.currentRoom && room.contains(playerX, playerY)) {
        this.setCurrentRoom(key);
        break;
      }
    }
  }

  public setCurrentRoom(key: string) {
    this.currentRoom = key;
  }

  protected constrainCamera() {
    const room = this.getCurrentRoom();
    const maxX = room.x + room.width - this.camera.width;
    const maxY = room.y + room.height - this.camera.height;

    if (this.game2.camera.x < room.x) {
      this.game2.camera.x = floor(room.x);
    } else if (this.game2.camera.x > maxX) {
      this.game2.camera.x = floor(maxX);
    }

    if (this.game2.camera.y < room.y) {
      this.game2.camera.y = floor(room.y);
    } else if (this.game2.camera.y > maxY) {
      this.game2.camera.y = floor(maxY);
    }
  }

  protected loadMapData(key: string) {
    const pixelScale = this.game2.pixelScale;
    const factory = this.game2.factory;
    const mapData = this.game2.cache.getTilemapData(key).data;

    for (const tileset of mapData.tilesets) {
      this.map.addTilesetImage(tileset.name);
    }

    for (const layerData of mapData.layers) {
      let layer;
      if (layerData.name) {
        switch (layerData.type) {
          case "tilelayer":
            layer = this.map.createLayer(
              layerData.name,
              null,
              null,
              this.layers
            );
            
            layer.smoothed = false;
            layer.setScale(pixelScale);
            layer.resizeWorld();
            break;

          case "objectgroup":
            switch (layerData.name) {
              case "rooms":
                for (const data of layerData.objects) {
                  if (
                    data.hasOwnProperty("x") &&
                    data.hasOwnProperty("y") &&
                    data.hasOwnProperty("width") &&
                    data.hasOwnProperty("height")
                  ) {
                    const x = data.x * pixelScale;
                    const y = data.y * pixelScale;
                    const width = data.width * pixelScale;
                    const height = data.height * pixelScale;

                    this.rooms.set(data.name, new Phaser.Rectangle(x, y, width, height));
                  }
                }
                break;

              case "collisions":
                for (const data of layerData.objects) {
                  if (data.polygon) {
                    const x = data.x * pixelScale;
                    const y = data.y * pixelScale;
                    const points = data.polygon.reduce(
                      (points: number[], point: { x: number; y: number }) => {
                        const x = point.x * pixelScale;
                        const y = point.y * pixelScale;
                        return points.concat(x, y);
                      },
                      []
                    );
                    const body = this.game2.physics.p2.createBody(
                      x,
                      y,
                      0,
                      true,
                      null,
                      points
                    );

                    body.setCollisionGroup(this.collisions.get("walls"));
                    body.collides([
                      this.collisions.get("player"),
                      this.collisions.get("enemies")
                    ]);
                  }
                }
                break;

              case "enemies":
                for (const data of layerData.objects) {
                  this.addEnemy(data.type, data.x, data.y, data.name);
                }
                break;

              case "player":
                const data = layerData.objects[0];
                this.addPlayer(data.x, data.y, data.name);
                break;
            }
            break;
        }
      }
    }
  }
}
