import {fontStyles} from 'fontStyles';
import {Bullet} from 'objects/Bullet';
import {Game} from 'core/Game';
import {Player} from 'objects/Player';
import {Sprite} from 'core/Sprite';
import {State} from 'core/State';

const floor = Math.floor;

export class Main extends State {
  public mapLayers: Phaser.Group;
  public bullets: Phaser.Group;
  public enemies: Phaser.Group;
  public player: Player;
  protected cameraPadding: number = 8;
  public collisions: Map<string, Phaser.Physics.P2.CollisionGroup>;
  protected healthText: Phaser.Text;
  protected hud: Phaser.Group;
  protected lastScale: number = 1;
  protected map: Phaser.Tilemap;

  public addBullet(x: number, y: number, direction: Phaser.Point) {
    const bullet = this.game2.factory.bullet(x, y);
    this.game2.world.add(bullet);
    bullet.setDirection(direction);

    bullet.body.setCollisionGroup( this.collisions.get('bullets') );
    bullet.body.collides( this.collisions.get('enemies') );
    bullet.body.createGroupCallback( this.collisions.get('enemies'), this.onCollideBulletEnemy, this);

    return bullet;
  }

  public addEnemy(type: string, x: number, y: number) {
      const enemy = this.game2.factory.create(type, x, y);
      this.enemies.add(enemy);
      //enemy.exists = false;
      enemy.body.setCollisionGroup( this.collisions.get('enemies') );
      enemy.body.collides([
        this.collisions.get('walls'),
        this.collisions.get('bullets') ]);
  }

  public addPlayer(x: number, y: number) {
    const player = this.game2.factory.player(x, y);
    player.setState(this);
    this.player = player;
    this.game2.world.add(player);

    player.body.setCollisionGroup(this.collisions.get('player'));
    player.body.collides([
      this.collisions.get('walls'),
      this.collisions.get('enemies') ]);
    }

  public create() {
    this.collisions = new Map();
    this.collisions.set('player', this.physics.p2.createCollisionGroup());
    this.collisions.set('enemies', this.physics.p2.createCollisionGroup());
    this.collisions.set('bullets', this.physics.p2.createCollisionGroup());
    this.collisions.set('walls', this.physics.p2.createCollisionGroup());

    this.mapLayers = this.game2.add.group();
    this.enemies = this.game2.add.group();
    this.bullets = this.game2.add.group();

    this.enemies.updateOnlyExistingChildren = true;
    this.bullets.updateOnlyExistingChildren = true;

    this.map = new Phaser.Tilemap(this.game2, 'level1_intro');
    this.loadMapData('level1_intro');

    this.hud = this.game.add.group();
    this.healthText = this.game.add.text(0, 0, '0, 0', fontStyles.body, this.hud);

    this.resize();
  }

  public onCollideBulletEnemy(bullet: Phaser.Physics.P2.Body, enemy: Phaser.Physics.P2.Body, bulletShape: p2.Shape, enemyShape: p2.Shape) {
    bullet.sprite.kill();
    enemy.sprite.exists = false;
  }

  public resize() {
    const width = this.game.width;
    const height = this.game.height;
    const scale = height === 0 || width / height >= 1 ? height / 360 : width / 360;

    this.healthText.fontSize = floor(fontStyles.body.fontSize * scale);
    this.cameraPadding = floor(8 * scale);

    if (this.lastScale !== this.game2.pixelScale) {
      this.game.camera.x = floor(this.game.camera.x / this.lastScale * this.game2.pixelScale);
      this.game.camera.y = floor(this.game.camera.y / this.lastScale * this.game2.pixelScale);
      this.constrainCamera();
      this.lastScale = this.game2.pixelScale;
    }
  }

  public update() {
    const tileWidth = this.map.tileWidth / 2 * this.game2.pixelScale;
    const tileHeight = this.map.tileHeight / 2 * this.game2.pixelScale;

    this.game.camera.x = floor(this.player.x - this.camera.width / 2);
    this.game.camera.y = floor(this.player.y - this.camera.height / 2);

    this.constrainCamera();

    this.healthText.text = 'Énergie: 100%';
    this.healthText.text += '\nFPS: ' + this.game.time.fps;

    this.hud.position.set(
      this.game.camera.x + this.cameraPadding,
      this.game.camera.y + this.cameraPadding);
  }

  protected constrainCamera() {
    const tileWidth = this.map.tileWidth / 2 * this.game2.pixelScale;
    const tileHeight = this.map.tileHeight / 2 * this.game2.pixelScale;
    const maxX = this.game.world.width - this.camera.width - tileWidth;
    const maxY = this.game.world.height - this.camera.height - tileHeight;

    if (this.game.camera.x < tileWidth) {
      this.game.camera.x = floor(tileWidth);
    } else if (this.game.camera.x > maxX) {
      this.game.camera.x = floor(maxX);
    }

    if (this.game.camera.y < tileHeight) {
      this.game.camera.y = floor(tileHeight);
    } else if (this.game.camera.y > maxY) {
      this.game.camera.y = floor(maxY);
    }
  }

  protected loadMapData(key: string) {
    const factory = this.game2.factory;
    const mapData = this.game.cache.getTilemapData(key).data;

    for (const tileset of mapData.tilesets) {
      this.map.addTilesetImage(tileset.name);
    }

    for (const layerData of mapData.layers) {
      let layer;
    	if (layerData.name) {
  			switch (layerData.type) {
  				case 'tilelayer':
  					layer = this.map.createLayer(layerData.name, null, null, this.mapLayers);
            //layer.texture.baseTexture.scaleMode = PIXI.scaleModes.NEAREST;
            layer.smoothed = false;
            layer.setScale(this.game2.pixelScale);
            layer.resizeWorld();
  					break;

  				case 'objectgroup':
  					switch (layerData.name) {
  						case 'collisions':
                for (const data of layerData.objects) {
                  if (data.polygon) {
                    const polygon = new Phaser.Polygon(data.polygon);
                    const points = polygon.toNumberArray();
                    const scaledPoints = points.map((n) => { return n * this.game2.pixelScale; })
                    const body = this.game2.physics.p2.createBody(data.x * this.game2.pixelScale, data.y * this.game2.pixelScale, 0, true, null, scaledPoints);
                    body.setCollisionGroup(this.collisions.get('walls'));
                    body.collides([
                      this.collisions.get('player'),
                      this.collisions.get('enemies') ]);
                    //body.debug = true;
                  }
                }
  							break;

  						case 'enemies':
                for (const data of layerData.objects) {
                  this.addEnemy(data.type, data.x * this.game2.pixelScale, data.y * this.game2.pixelScale);
                }
  							break;

  						case 'player':
  							const data = layerData.objects[0];
                this.addPlayer(data.x * this.game2.pixelScale, data.y * this.game2.pixelScale);
  							break;
  					}
  					break;
  			}
  		}
    }
  }
}
