import { Shape } from '../geom';

export class Debug {
  private game: Phaser.Game;
  private objects: PIXI.DisplayObject[] = [];

  constructor(game: Phaser.Game) {
    this.game = game;
  }

  public draw(shape: Shape, color: number = 0xffffff) {
    if (shape instanceof Phaser.Rectangle) {
      this.rect(shape.x, shape.y ,shape.width, shape.height, color);
    } else if (shape instanceof Phaser.Polygon) {
      this.poly(shape.toNumberArray(), color);
    }
  }

  public rect(x: number, y: number, width: number, height: number, color: number = 0xffffff) {
    const gr = this.game.add.graphics();
    gr.lineStyle(1, color, 1);
    gr.drawRect(x, y, width, height);
    this.objects.push(gr);
    return this;
  }

  public poly(points: number[], color: number = 0xffffff) {
    if (points.length < 2) {
      throw new Error('Not enough points');
    }

    const gr = this.game.add.graphics();
    gr.lineStyle(1, color, 1);
    const x = points[0];
    const y = points[1];
    gr.moveTo(x, y);
    for (let i = 2; i < points.length - 1; i += 2) {
      const x = points[i];
      const y = points[i + 1];
      gr.lineTo(x, y);
    }
    gr.lineTo(x, y);
    this.objects.push(gr);
    return this;
  }

  public clear() {
    for (const object of this.objects) {
      object.parent.removeChild(object);
    }
    this.objects = [];
    return this;
  }
}
