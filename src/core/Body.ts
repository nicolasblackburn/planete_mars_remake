export class Body {
    public geometry: (Phaser.Polygon | Phaser.Rectangle | Phaser.Circle)[];
    public position: Phaser.Point;
    public velocity: Phaser.Point;
    public acceleration: Phaser.Point;
    public angle: number;
    public angularVelocity: number;
}