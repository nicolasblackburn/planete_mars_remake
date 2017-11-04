import { Sprite } from 'core/Sprite';
import { Enemy } from 'core/Enemy';
import { Bullet } from 'objects/Bullet';
import { Game } from 'core/Game';
import { Group } from "core/Group";
import { fontStyles } from "fontStyles";
import { Player } from "objects/player/Player";
import { applyTransform } from 'geom/Transform';

const floor = Math.floor;
const CAMERA_PADDING = 8;

export class Main extends Phaser.State {
  public rooms: Map<string, Phaser.Rectangle>;
  public layers: Group<Sprite>;
  public bullets: Group<Bullet>;
  public enemies: Group<Enemy>;
  public player: Player;
  public currentRoom: string;
  public map: Phaser.Tilemap;
  protected cameraPadding: number;
  public collisions: Map<string, Phaser.Physics.P2.CollisionGroup>;
  protected healthText: Phaser.Text;
  protected hud: Phaser.Group;
  protected lastScale: number;

  public addBullet(x: number, y: number, direction: Phaser.Point) {
    const game = this.game as Game;
    const bullet = game.factory.bullet(x, y);
    bullet.name = "bullet";
    bullet.setDirection(direction);
    this.bullets.add(bullet);

    return bullet;
  }

  constructor() {
    super();
    this.cameraPadding = CAMERA_PADDING;
    this.lastScale = 1;
    this.rooms = new Map();
  }

  public addEnemy(type: string, x: number, y: number, name?: string) {
    const game = this.game as Game;
    const enemy = game.factory.create(
      type,
      x * game.pixelScale,
      y * game.pixelScale
    );
    this.enemies.add(enemy);

    if (name) {
      enemy.name = name;
    }

    enemy.body.setCollisionGroup(this.collisions.get("enemies"));
    enemy.body.collides(this.collisions.get("walls"));
  }

  public addPlayer(x: number, y: number, name?: string) {
    const game = this.game as Game;
    const player = game.factory.player(
      x * game.pixelScale,
      y * game.pixelScale
    );
    this.player = player;
    game.world.add(player);

    if (name) {
      player.name = name;
    }

    player.body.setCollisionGroup(this.collisions.get("player"));
    player.body.collides(this.collisions.get("walls"));
  }

  public create() {
    const game = this.game as Game;

    this.collisions = new Map();
    this.collisions.set("player", this.physics.p2.createCollisionGroup());
    this.collisions.set("enemies", this.physics.p2.createCollisionGroup());
    this.collisions.set("bullets", this.physics.p2.createCollisionGroup());
    this.collisions.set("walls", this.physics.p2.createCollisionGroup());
    this.collisions.set("rooms", this.physics.p2.createCollisionGroup());

    this.layers = game.factory.group();
    this.enemies = game.factory.group() as Group<Enemy>;
    this.addPlayer(0, 0, 'player');
    this.bullets = game.factory.group() as Group<Bullet>;

    this.enemies.updateOnlyExistingChildren = true;
    this.bullets.updateOnlyExistingChildren = true;

    this.map = new Phaser.Tilemap(game, "level1_intro");
    this.loadMapData("level1_intro");

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

  public collideBulletEnemy(
    bullet: Bullet,
    enemy: Enemy
  ) {
    bullet.kill();
    enemy.kill();
  }
  
  public collidePlayerEnemy(
    player: Player,
    enemy: Enemy
  ) {
    player.hurt(enemy.damagePoints);
  }

  public collidePlayerRoom(
    player: Phaser.Physics.P2.Body,
    room: Phaser.Physics.P2.Body,
    playerShape: p2.Shape,
    roomShape: p2.Shape
  ) {
    console.log('Collide room `' + (room as any).name + '`');
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

    game.camera.x = floor(this.player.x - this.camera.width / 2);
    game.camera.y = floor(this.player.y - this.camera.height / 2);

    this.constrainCamera();

    this.healthText.text = "Énergie: " + this.player.health + "%";
    //this.healthText.text += "\nFPS: " + game.time.fps;

    this.hud.position.set(
      game.camera.x + this.cameraPadding,
      game.camera.y + this.cameraPadding
    );
  }

  protected updateCollisions() {
    for (const enemy of this.enemies) {
      if (enemy.exists) {
        const enemyRect = enemy.getBoundsAsRectangle();

        for (const bullet of this.bullets) {
          if (bullet.exists) {
      
            const bulletRect = bullet.getBoundsAsRectangle();
              
            if (bulletRect.intersects(enemyRect, 0)) {
              this.collideBulletEnemy(bullet as Bullet, enemy as Enemy);
            }
    
          }
        }

        if (enemy.exists) {
          const playerRect = this.player.getBoundsAsRectangle();

          if (playerRect.intersects(enemyRect, 0)) {
            this.collidePlayerEnemy(this.player as Player, enemy as Enemy);
          }
        }
      }
    }

  }

  protected updateRoom() {
    const game = this.game as Game;
    const pixelScale = game.pixelScale;
    const player = this.player;
    const treshold = 16 * pixelScale;

    const bounds = new Phaser.Rectangle(0, 0, 0, 0);
    player.baseCollisionShape.clone(bounds);
    bounds.width *= pixelScale;
    bounds.height *= pixelScale;
    bounds.x += player.x - player.anchor.x * bounds.width - treshold;
    bounds.y += player.y - player.anchor.y * bounds.height - treshold;
    bounds.width += 2 * treshold;
    bounds.height += 2 * treshold;

    for (const [key, room] of this.rooms.entries()) {
      if (key !== this.currentRoom) {
        if (room.contains(player.x, player.y)) {
          this.setCurrentRoom(key);
          break;
        } else if (room.intersects(bounds, 0) && game.input.activePointer.isDown) {
          // trigger the next room animation
          //break;
        }
      }
    }
  }

  protected constrainCamera() {
    const game = this.game as Game;
    const pixelScale = game.pixelScale;
    const tileWidth = this.map.tileWidth / 4 * pixelScale;
    const tileHeight = this.map.tileHeight / 4 * pixelScale;

    const room = this.getCurrentRoom();
    
    if (! room) {
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

  protected loadMapData(key: string) {
    const game = this.game as Game;
    const pixelScale = game.pixelScale;
    const factory = game.factory;
    const mapData = game.cache.getTilemapData(key).data;

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
                    const body = game.physics.p2.createBody(
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
                this.player.body.x = data.x * pixelScale;
                this.player.body.y = data.y * pixelScale;
                this.player.name = data.name;
                break;

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

              case "triggers":
              for (const data of layerData.objects) {
                const shape = this.parseShape(data);
                if (shape instanceof Phaser.Polygon) {
                  console.log(shape.constructor, shape);
                  const poly = applyTransform(
                    new Phaser.Matrix(pixelScale, 0, 0, pixelScale, 0, 0),
                    shape  
                  ) as Phaser.Polygon;
                  (window as any).debug.poly(poly.toNumberArray());
                }
              }
              break;
            }
            break;
        }
      }
    }
  }

  protected parseShape(data: any) {
    if (data.polygon) {
      return new Phaser.Polygon(data.polygon.map((p: any) => { 
        return {x: p.x + data.x, y: p.y + data.y};
      }));
    } else if (
      data.hasOwnProperty("x") &&
      data.hasOwnProperty("y") &&
      data.hasOwnProperty("width") &&
      data.hasOwnProperty("height")
    ) {
      return new Phaser.Polygon([
        data.x, data.y, 
        data.x + data.width, data.y, 
        data.x + data.width, data.y + data.height, 
        data.x, data.y + data.height]);
      //return new Phaser.Rectangle(data.x, data.y, data.width, data.height);
    } else {
      return null;
    }
  }
}
