export class Body {
  public position: Phaser.Point;
  public velocity: Phaser.Point;
  public acceleration: Phaser.Point;
  public shape: Phaser.Point[] = [];

  constructor(shape: Phaser.Point[], x: number = 0, y: number = 0) {
    if (!shape.length) {
      throw new Error('Shape is an empty list of points');
    }

    this.position = new Phaser.Point(x, y);
    this.velocity = new Phaser.Point(0, 0);
    this.acceleration = new Phaser.Point(0, 0);

    for (const point of shape) {
      this.shape.push(new Phaser.Point(point.x, point.y));
    }
  }
}
