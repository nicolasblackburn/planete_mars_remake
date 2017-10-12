import Game from './Game';
import Sprite from './Sprite';

export default class Tilemap extends Phaser.Tilemap {
  public enemies: Sprite[] = [];
  public player: Sprite;
  protected game2: Game;
  protected solidTileCollisionShapes: (Phaser.Rectangle | Phaser.Polygon)[][]= [];
  protected overlapTileCollisionShapes: (Phaser.Rectangle | Phaser.Polygon)[][]= [];
  protected tilePhysics: any;

  constructor(game: Game, key: string) {
    super(game, key);
    this.game2 = game;
    this.loadMapData(key);
  }

  private loadMapData(key: string) {
    const pixelScale = this.game2.pixelScale;
    const factory = this.game2.factory;
    const mapData = this.game.cache.getTilemapData(key).data;

    this.tilePhysics = this.game.add.physicsGroup(Phaser.Physics.P2JS);

    for (const tileset of mapData.tilesets) {
      this.addTilesetImage(tileset.name);

      for (const key in tileset.tiles) {
        const tileIndex = parseInt(key);
        const tile = tileset.tiles[key];

        if (tile.objectgroup
          && tile.objectgroup.objects.length
          && tile.objectgroup.properties
          && tile.objectgroup.properties.solid) {

          this.solidTileCollisionShapes[tileIndex] = [];
          const shapes = this.solidTileCollisionShapes[tileIndex];

          for (const object of tile.objectgroup.objects) {
            if (object.polygon) {
              shapes.push(new Phaser.Polygon(object.polygon));
            } else if (object.polyline) {
              console.warn('Polyline collisions are not supported.');
            } else if (object.ellipse) {
              console.warn('Ellipse collisions are not supported.');
            } else {
              shapes.push(new Phaser.Rectangle(object.x, object.y, object.width, object.height));
            }
          }
        }
      }
    }
    console.log(this.solidTileCollisionShapes);

    for (const layerData of mapData.layers) {
      let layer;
    	if (layerData.name) {
  			switch (layerData.type) {
  				case 'tilelayer':
  					layer = this.createLayer(layerData.name);
            layer.texture.baseTexture.scaleMode = PIXI.scaleModes.NEAREST;
            layer.scale.set(pixelScale);
            layer.resizeWorld();

            if (layerData.properties && layerData.properties.collide) {
              for (const tile of layer.getTiles(0, 0, layer.width, layer.height)) {
                const solidShapes = this.solidTileCollisionShapes[tile.index - 1];
                if (solidShapes) {
                  for (const shape of solidShapes) {
                    if (shape instanceof Phaser.Polygon) {
                      const points = shape.toNumberArray().map((n) => { return n * pixelScale; });
                      const body = this.game.physics.p2.createBody(tile.worldX * pixelScale, tile.worldY * pixelScale, 0, true, null, points);
                      //body.debug = true;
                    } else if (shape instanceof Phaser.Rectangle) {
                      const points = [
                        shape.x * pixelScale, shape.y * pixelScale,
                        (shape.x + shape.width) * pixelScale, shape.y * pixelScale,
                        (shape.x + shape.width) * pixelScale, (shape.y + shape.height) * pixelScale,
                        shape.x * pixelScale, (shape.y + shape.height) * pixelScale ];
                      const body = this.game.physics.p2.createBody(tile.worldX * pixelScale, tile.worldY * pixelScale, 0, true, null, points);
                      //body.debug = true;
                    }
                  }
                }
              }
            }
  					break;

  				case 'objectgroup':
  					switch (layerData.name) {
  						case 'enemies':
                for (const data of layerData.objects) {
                  this.enemies.push(factory.create(data.type, data.x * pixelScale, data.y * pixelScale));
                }
  							break;

  						case 'player':
  							const data = layerData.objects[0];
  							this.player = factory.create(data.type, data.x * pixelScale, data.y * pixelScale);
  							break;
  					}
  					break;
  			}
  		}
    }
  }
}
