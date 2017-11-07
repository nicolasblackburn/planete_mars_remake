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
export function intersectsSegmentSegment(segmentA: number[], segmentB: number[], solution?: number[]) {
    const a11 = segmentA[2] - segmentA[0];
    const a12 = segmentB[0] - segmentB[2];
    const a21 = segmentA[3] - segmentA[1];
    const a22 = segmentB[1] - segmentB[3];
    const y1 = segmentB[0] - segmentA[0];
    const y2 = segmentB[1] - segmentA[1];

    const detA = a11 * a22 - a12 * a21;

    if (detA === 0) {
        // The segments are parallel which means [a21 a22] is a scalar multiple of [a11 a12]
        if (a11 * y2 - a21 * y1 !== 0) {
            // The segments are not confounded, so there are no solutions
            return false;

        } else {
            // We find the interval intersection on the x axis
            let a1 = segmentA[0];
            let a2 = segmentA[2];
            let b1 = segmentB[0];
            let b2 = segmentB[2];

            if (a1 === a2 && a2 === b1 && b1 === b2) {
                // Degenerate case where both segments reduce to a point

                if (solution) {
                    solution[0] = 0;
                    solution[1] = 0;
                }
                
                return true;

            }

            if (segmentA[0] !== segmentA[2]) {
                // We find the interval intersection on the y axis because the x axis have no variation
                a1 = segmentA[1];
                a2 = segmentA[3];
                b1 = segmentB[1];
                b2 = segmentB[3];
            }

            if (a1 > a2) {
                const swap = a2;
                a2 = a1;
                a1 = swap;
            }

            if (b1 > b2) {
                const swap = b2;
                b2 = b1;
                b1 = swap;
            }

            if (b2 < a1) {
                return false;

            } else if (a1 === a2 && a2 <= b1) {
                // Degenerate case where the first segment reduce to a point
                
                if (solution) {
                    solution[0] = 0;
                    solution[1] = 0;
                }

                return true;
            
            } else if (a2 <= b1) {
                return false;

            } else if (a1 <= b1) {
                
                if (solution) {
                    solution[0] = (segmentB[0] - segmentA[0]) / (segmentA[2] - segmentA[0]);
                    solution[1] = 0;
                }
                
                return true;

            } else {
                
                if (solution) {
                    solution[0] = 0;
                    solution[1] = (segmentA[0] - segmentB[0]) / (segmentB[2] - segmentB[0]);
                }

                return true;
            } 

        }

    } else {
        const s = (a22 * y1 - a12 * y2) / detA;
        const t = (a11 * y2 - a21 * y1) / detA;
        const absASquare = a11 * a11 + a21 * a21;
        const absBSquare = a12 * a12 + a22 * a22;

        if (solution) {
            solution[0] = s;
            solution[1] = t;
        }

        return 0 <= s && s * s < absASquare && 0 <= t && t * t < absBSquare;
    }
}