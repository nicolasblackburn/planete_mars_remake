type SimpleShape = Phaser.Rectangle | Phaser.Polygon;
export type Shape = SimpleShape | SimpleShape[];

export function intersects(shapeA: Shape, shapeB: Shape): boolean {
    if (shapeA instanceof Phaser.Rectangle) {
        return intersects(rectangleToPolygon(shapeA), shapeB);
    } else if (shapeB instanceof Phaser.Rectangle) {
        return intersects(shapeA, rectangleToPolygon(shapeB));
    } else if (shapeA instanceof Phaser.Polygon && shapeB instanceof Phaser.Polygon) {
        return intersectsPolygonPolygon(shapeA, shapeB);
    }
}

export function intersectsPolygonPolygon(polygonA: Phaser.Polygon, polygonB: Phaser.Polygon) {
    const pointsA = polygonA.toNumberArray();
    const pointsB = polygonB.toNumberArray();
    for (let i = 0; i < 2; i++) {
        const points = i ? pointsB : pointsA;

        for (let j = 0; j < points.length - 3; j += 4) {
            const normX = points[j + 3] - points[j + 1];
            const normY = points[j] - points[j + 2];

            const intervalA = new Phaser.Point(Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY);
            const intervalB = new Phaser.Point(Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY);

            let n = Math.max(pointsA.length, pointsB.length);
            for (let i = 0; i < n - 1; i += 2) {
                if (i < pointsA.length - 1) {
                    const m = pointsA[i] * normX + pointsA[i + 1] * normY;
                    intervalA.x = Math.min(m , intervalA.x);
                    intervalA.y = Math.max(m, intervalA.y);
                }
                if (i < pointsB.length - 1) {
                    const m = pointsB[i] * normX + pointsB[i + 1] * normY;
                    intervalB.x = Math.min(m , intervalB.x);
                    intervalB.y = Math.max(m, intervalB.y);
                }
            }
            
            const a = intervalB.x - intervalA.y;
            const b = intervalB.y - intervalA.x; 
            if ( (a > 0 || b < 0 ) && (a < 0 || b > 0) ) {
                return false;
            }
        }
    }

    return true;
}

export function rectangleToPolygon(rect: Phaser.Rectangle) {
    return new Phaser.Polygon(rectangleToNumberArray(rect));
}

export function rectangleToNumberArray(rect: Phaser.Rectangle) {
    return [
        rect.x, rect.y,
        rect.x + rect.width, rect.y,
        rect.x + rect.width, rect.y + rect.height,
        rect.x, rect.y + rect.height
    ];
}

export function getPolygonBounds(polygon: Phaser.Polygon) {
    const bounds = new Phaser.Rectangle(
        Number.POSITIVE_INFINITY, 
        Number.POSITIVE_INFINITY, 
        Number.NEGATIVE_INFINITY,  
        Number.NEGATIVE_INFINITY);

    const points = polygon.toNumberArray();
    for (let i = 0; i < points.length - 1; i += 2) {
        const x = points[i];
        const y = points[i + 1];

        bounds.x = Math.min(bounds.x, x);
        bounds.y = Math.min(bounds.y, y);
        bounds.width = Math.max(bounds.width, x);
        bounds.height = Math.max(bounds.height, y);
    }

    bounds.width -= bounds.x;
    bounds.height -= bounds.y;

    return bounds;
}

export function applyTransform(transform: Phaser.Matrix, shape: Shape): Shape {
    if (shape instanceof Phaser.Rectangle) {
        const p1 = new Phaser.Point(shape.x, shape.y);
        const p2 = new Phaser.Point(shape.x + shape.width, shape.y + shape.height); 
        const [q1, q2] = [p1, p2].map(p => transform.apply(p)); 
        return new Phaser.Rectangle(q1.x, q1.y, q2.x - q1.x, q2.y - q1.y);

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
        return shapes as Shape;
    }
}