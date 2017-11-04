type SimpleShape = Phaser.Point | Phaser.Rectangle | Phaser.Polygon;
type Shape = SimpleShape | SimpleShape[];

export function applyTransform(transform: Phaser.Matrix, shape: Shape): Shape {
    if (shape instanceof Phaser.Point) {
        return transform.apply(shape);

    } else if (shape instanceof Phaser.Rectangle) {
        const p1 = new Phaser.Point(shape.x, shape.y);
        const p2 = new Phaser.Point(shape.x + shape.width, shape.y + shape.height); 
        const pointsImage = [p1, p2].map(p => transform.apply(p)); 
        return new Phaser.Rectangle(p1.x, p1.y, p2.x - p1.x, p2.y - p1.y);

    } else if (shape instanceof Phaser.Polygon) {
        const flatPoints = shape.toNumberArray();
        const points = [];
        for (let i = 0; i < flatPoints.length / 2; i++) {
            points.push(new Phaser.Point(flatPoints[2 * i], flatPoints[2 * i + 1]));
        }
        const pointsImage = points.map(p => transform.apply(p)); 
        return new Phaser.Polygon(pointsImage);
        
    } else if (shape instanceof Array) {
        const shapes = [];
        for (const simpleShape of shape) {
            shapes.push(applyTransform(transform, simpleShape));
        }
        return shapes as SimpleShape[];
    }
}