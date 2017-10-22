import {Game} from './Game';

export class Tilemap extends Phaser.Tilemap {
  public tilemapLayers: Phaser.TilemapLayer[] = [];
  protected game2: Game;

  constructor(game: Game, key: string) {
    super(game, key);
    this.game2 = game;
    this.loadMapData(key);
  }

  private loadMapData(key: string) {
    const factory = this.game2.factory;
    const mapData = this.game.cache.getTilemapData(key).data;

    for (const tileset of mapData.tilesets) {
      this.addTilesetImage(tileset.name);
    }

    for (const layerData of mapData.layers) {
      let layer;
    	if (layerData.name) {
  			switch (layerData.type) {
  				case 'tilelayer':
  					layer = this.createLayer(layerData.name);
            layer.texture.baseTexture.scaleMode = PIXI.scaleModes.NEAREST;
            layer.setScale(this.game2.pixelScale);
            this.tilemapLayers.push(layer);
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
                    const body = this.game.physics.p2.createBody(data.x * this.game2.pixelScale, data.y * this.game2.pixelScale, 0, true, null, scaledPoints);
                    body.setCollisionGroup(this.game2.collisionGroups.get('walls'));
                    body.collides([
                      this.game2.collisionGroups.get('player'),
                      this.game2.collisionGroups.get('enemies') ]);
                    //body.debug = true;
                  }
                }
  							break;

  						case 'enemies':
                for (const data of layerData.objects) {
                  this.game2.enemies.push(factory.create(data.type, data.x * this.game2.pixelScale, data.y * this.game2.pixelScale));
                }
  							break;

  						case 'player':
  							const data = layerData.objects[0];
  							this.game2.player = factory.player(data.x * this.game2.pixelScale, data.y * this.game2.pixelScale);
  							break;
  					}
  					break;
  			}
  		}
    }
  }
}
