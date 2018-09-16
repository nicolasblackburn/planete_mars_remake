import { Gate } from '../objects/Gate';
import { applyTransform, rectangleToNumberArray } from '../geom';
import { Main } from '../scenes/Main';
import { Game } from './Game';

export class MapParser {
    public game: Game;

    constructor(game: Game) {
        this.game = game;
    }

    public loadMapData(key: string, mainState: Main) {
        const mapData = this.game.cache.getTilemapData(key).data;

        for (const tileset of mapData.tilesets) {
            mainState.topRoom.map.addTilesetImage(tileset.name);
        }

        for (const layerData of mapData.layers) {
            let layer;
            if (layerData.name) {
                switch (layerData.type) {
                    case "tilelayer":
                        layer = mainState.topRoom.map.createLayer(
                            layerData.name,
                            null,
                            null,
                            mainState.topRoom.layers
                        );

                        layer.smoothed = false;
                        layer.setScale(this.game.pixelScale);
                        layer.resizeWorld();
                        break;

                    case "objectgroup":
                        switch (layerData.name) {
                            case "collisions":
                                for (const data of layerData.objects) {
                                    const x = data.x * this.game.pixelScale;
                                    const y = data.y * this.game.pixelScale;
                                    const shape = applyTransform(
                                        new Phaser.Matrix().scale(
                                            this.game.pixelScale,
                                            this.game.pixelScale
                                        ),
                                        this.parseShape({ ...data, x: 0, y: 0 })
                                    );
                                    let body;

                                    if (shape instanceof Phaser.Polygon) {
                                        body = this.game.physics.p2.createBody(
                                            x,
                                            y,
                                            0,
                                            true,
                                            null,
                                            shape.toNumberArray()
                                        );
                                    } else if (
                                        shape instanceof Phaser.Rectangle
                                    ) {
                                        body = this.game.physics.p2.createBody(
                                            x,
                                            y,
                                            0,
                                            true,
                                            null,
                                            rectangleToNumberArray(shape)
                                        );
                                    }

                                    body.setCollisionGroup(
                                        mainState.topRoom.collisions.get("walls")
                                    );
                                    body.collides([
                                        mainState.topRoom.collisions.get("player"),
                                        mainState.topRoom.collisions.get("enemies")
                                    ]);
                                    mainState.topRoom.walls.push(body);
                                }
                                break;

                            case "enemies":
                                for (const data of layerData.objects) {
                                    mainState.topRoom.addEnemy(
                                        data.type,
                                        data.x * this.game.pixelScale,
                                        data.y * this.game.pixelScale,
                                        data.name
                                    );
                                }
                                break;

                            case "player":
                                const data = layerData.objects[0];
                                mainState.topRoom.player.body.x =
                                    data.x * this.game.pixelScale;
                                    mainState.topRoom.player.body.y =
                                    data.y * this.game.pixelScale;
                                    mainState.topRoom.player.name = data.name;
                                break;

                            case "rooms":
                                for (const data of layerData.objects) {
                                    if (
                                        data.hasOwnProperty("x") &&
                                        data.hasOwnProperty("y") &&
                                        data.hasOwnProperty("width") &&
                                        data.hasOwnProperty("height")
                                    ) {
                                        const x = data.x * this.game.pixelScale;
                                        const y = data.y * this.game.pixelScale;
                                        const width = data.width * this.game.pixelScale;
                                        const height = data.height * this.game.pixelScale;

                                        mainState.rooms[data.name] =
                                            new Phaser.Rectangle(
                                                x,
                                                y,
                                                width,
                                                height
                                            );
                                    }
                                }
                                break;

                            case "triggers":
                                for (const data of layerData.objects) {
                                    switch (data.type) {
                                        case 'Gate':
                                            const shape = applyTransform(
                                                new Phaser.Matrix().scale(
                                                    this.game.pixelScale,
                                                    this.game.pixelScale
                                                ),
                                                this.parseShape(data)
                                            );
                                            if (shape instanceof Phaser.Rectangle) {
                                                const axis = JSON.parse(data.properties.axis);
                                                mainState.triggers.push(new Gate(shape, new Phaser.Point(axis[0], axis[1])));
                                            }

                                            break;
                                        
                                        case 'Pit':
                                            break;
                                    }
                                    /*
                                    mainState.addTrigger(shape, data.action);
                                    mainState.triggers.push([
                                        shape,

                                    ]);
                                    */
                                }
                                break;
                        }
                        break;
                }
            }
        }
    }

    protected parseShape(data: any) {
        const x = data.x || 0;
        const y = data.y || 0;
        if (data.polygon) {
            return new Phaser.Polygon(
                data.polygon.map((p: any) => {
                    return { x: p.x + x, y: p.y + y };
                })
            );
        } else if (
            data.hasOwnProperty("x") &&
            data.hasOwnProperty("y") &&
            data.hasOwnProperty("width") &&
            data.hasOwnProperty("height")
        ) {
            /*
          return new Phaser.Polygon([
            x, y, 
            x + data.width, y, 
            x + data.width, y + data.height, 
            x, y + data.height]);
          */
            return new Phaser.Rectangle(x, y, data.width, data.height);
        } else {
            return null;
        }
    }
}
