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

export function add(pointsA: number[], pointsB: number[]) {
    const result = [];
    for (let i = 0; i < pointsA.length && i < pointsB.length; i ++) {
        result.push(pointsA[i] + pointsB[i]);
    }
    return result;
}

export function sub(pointsA: number[], pointsB: number[]) {
    const result = [];
    for (let i = 0; i < pointsA.length && i < pointsB.length; i ++) {
        result.push(pointsA[i] - pointsB[i]);
    }
    return result;
}

export function scale(scalar: number, points: number[]) {
    const result = [];
    for (let i = 0; i < points.length; i ++) {
        result.push(scalar * points[i]);
    }
    return result;
}

export function dot(pointsA: number[], pointsB: number[]) {
    let result = 0;
    for (let i = 0; i < pointsA.length && i < pointsB.length; i ++) {
        result += pointsA[i] * pointsB[i];
    }
    return result;
}

/**
 * Let A and B be two segments with end points A1, A2 and B1, B2.
 * We solve the linear equation A1 + s(A2 - A1) = B1 + t(B2 - B1) for 0 <= s < |A2 - A1| and 0 <= t < |B2 - B1|.
 * 
 * A segment from point P_1 to point P_2 is represented by an array of 4 numbers: 
 *     array[0] = x coordinate of P_1 
 *     array[1] = y coordinate of P_1
 *     array[2] = x coordinate of P_2
 *     array[3] = y coordinate of P_2
 * 
 * The end point (P_2) of a segment is open.
 * 
 * If the third parameter is passed, the solution to the equation, if it exists will be stored in it.
 */
export function intersectsSegmentSegment(segmentA: number[], segmentB: number[], solutionRef?: number[]) {
    const a11 = segmentA[2] - segmentA[0];
    const a12 = segmentB[0] - segmentB[2];
    const a21 = segmentA[3] - segmentA[1];
    const a22 = segmentB[1] - segmentB[3];
    const y1 = segmentB[0] - segmentA[0];
    const y2 = segmentB[1] - segmentA[1];

    const detA = a11 * a22 - a12 * a21;
    let solution = solutionRef ? solutionRef: [];

    if (detA === 0) {
        // The segments are parallel which means [a21 a22] is a scalar multiple of [a11 a12]
        if (a11 * y2 - a21 * y1 !== 0) {
            // The segments are not confounded, so there are no solutions
            return false;

        } else if (a11 === 0 && a12 === 0) {

            if (y1 === 0) {
                // Degenerate case where both segments reduce to confounded points
                solution[0] = 0;
                solution[1] = 0;
                return true;

            } else {
                // Degenerate case where both segments reduce to different points, no solution
                return false;

            }


        } else if (a11 === 0) {
            // Degenerate case where segment A is a point
            const s = 0;
            const t = y1 / a12;

            if (0 <= t && t <= 1) {
                // Point is on segment B
                solution[0] = s;
                solution[1] = t;
                return true;
                
            } else {
                // Point is not on segment B
                return false;
                
            }

        } else if (a12 === 0) {
            // Degenerate case where segment B is a point
            const s = y1 / a11;
            const t = 0;

            if (0 <= s && s <= 1) {
                // Point is on segment A
                solution[0] = s;
                solution[1] = t;
                return true;
                
            } else {
                // Point is not on segment A
                return false;
                
            }
        
        } else {
            // Find the solution interval:
            // We have 
            //         a11 * s + a12 * t = y1
            //         0 <= s <= 1 
            // and     0 <= t <= 1.
            // Then t = y1 / a12 - a11 / a12 * s
            // and 0 <= y1 / a12 - a11 /a12 * s <= 1,
            // implying -y1 / a12 <= -a11 / a12 * s <= 1 - y1 / a12
            //           y1 / a12 >= a11 / a12 * s >= y1 / a12 - 1
            //           y1 / a11 >= s >= y1 / a11 - a12 / a11
            //           y1 / a11 - a12 / a11 <= s <= y1 / a11.
            // We find as solution
            // s in [b, B]
            // where b = max(0, y1 / a11 - a12 / a11)
            // and B = min(1, y1 / a11)
            // with conditions 0 <= b <= B <= 1
            const b = Math.max(0, y1 / a11 - a12 / a11);
            const B = Math.min(1, y1 / a11);

            if (b > B || 1 < b || B < 0) {
                // Segments don't overlap
                return false;

            } else  {
                // Segments overlap
                const s = b; 
                const t = y1 / a12 - a11 / a12 * s;

                solution[0] = b;
                solution[1] = t;

                return true;

            }

        }

    } else {
        const s = (a22 * y1 - a12 * y2) / detA;
        const t = (a11 * y2 - a21 * y1) / detA;
        const absASquare = a11 * a11 + a21 * a21;
        const absBSquare = a12 * a12 + a22 * a22;

        
        solution[0] = s;
        solution[1] = t;
        return 0 <= s && s * s <= absASquare && 0 <= t && t * t <= absBSquare;
    }
}

/**
 * Solve A1 + s * (A2 - A1) + u * dr = B1 + t * (B2 - B1)
 * equiv. s * (A2 - A1) + t * (B1 - B2) + u * dr = B1 - A1
 * [ a11 a12 a13 |   [ s |   [ y1 |
 * | a21 a22 a23 ] * | t | = | y2 ]
 *                   | u ]
 * Where:
 *    a11 = A2
 * 
 * @param segmentA: number[]
 * @param dr: number[] 
 * @param segmentB: number[]
 */
export function intersectsMovingSegmentSegment(segmentA: number[], dr: number[], segmentB: number[]) {
    const a11 = segmentA[2] - segmentA[0];
    const a12 = segmentB[0] - segmentB[2];
    const a13 = dr[0];
    const a21 = segmentA[3] - segmentA[1];
    const a22 = segmentB[1] - segmentB[3];
    const a23 = dr[1];
    const y1 = segmentB[0] - segmentA[0];
    const y2 = segmentB[1] - segmentA[1];
}