import {Game} from './Game';
import {Sprite} from './Sprite';

export class Tilemap extends Phaser.Tilemap {
  public enemies: Sprite[] = [];
  public player: Sprite;
  public tilemapLayers: Phaser.TilemapLayer[] = [];
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
    const factory = this.game2.factory;
    const mapData = this.game.cache.getTilemapData(key).data;

    this.tilePhysics = this.game.add.physicsGroup(Phaser.Physics.P2JS);

    for (const tileset of mapData.tilesets) {
      this.addTilesetImage(tileset.name);
    }

    for (const layerData of mapData.layers) {
      let layer;
    	if (layerData.name) {
  			switch (layerData.type) {
  				case 'tilelayer':
  					layer = this.createLayer(layerData.name);
            layer.resizeWorld();
            this.tilemapLayers.push(layer);
  					break;

  				case 'objectgroup':
  					switch (layerData.name) {
  						case 'collisions':
                for (const data of layerData.objects) {
                  if (data.polygon) {
                    const polygon = new Phaser.Polygon(data.polygon);
                    const points = polygon.toNumberArray();
                    const body = this.game.physics.p2.createBody(data.x, data.y, 0, true, null, points);
                    body.setCollisionGroup(this.game2.wallsCollisionGroups);
                    body.collides(this.game2.playerCollisionGroups);
                    //body.debug = true;
                  }
                }
  							break;

  						case 'enemies':
                for (const data of layerData.objects) {
                  this.enemies.push(factory.create(data.type, data.x, data.y));
                }
  							break;

  						case 'player':
  							const data = layerData.objects[0];
  							this.player = factory.create(data.type, data.x, data.y);
  							break;
  					}
  					break;
  			}
  		}
    }
  }
}
