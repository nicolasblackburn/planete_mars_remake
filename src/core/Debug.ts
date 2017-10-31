export class Debug {
  private game: Phaser.Game;
  private objects: PIXI.DisplayObject[] = [];

  constructor(game: Phaser.Game) {
    this.game = game;
  }

  public rect(x: number, y: number, width: number, height: number, color: number = 0xffffff) {
    const gr = this.game.add.graphics();
    gr.lineStyle(1, color, 1);
    gr.drawRect(x, y, width, height);
    this.objects.push(gr);
    return gr;
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
    return gr;
  }

  public clear() {
    for (const object of this.objects) {
      object.parent.removeChild(object);
    }
    this.objects = [];
  }
}
