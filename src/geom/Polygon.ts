export class Polygon extends Phaser.Polygon {
    protected _bounds: Phaser.Rectangle;

    public intersects(polygon: Phaser.Polygon) {
        const pointsA = this.toNumberArray();
        const pointsB = polygon.toNumberArray();
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

    public getBounds() {
        if (!this._bounds) {
            this._bounds = new Phaser.Rectangle(
                Number.POSITIVE_INFINITY, 
                Number.POSITIVE_INFINITY, 
                Number.NEGATIVE_INFINITY,  
                Number.NEGATIVE_INFINITY);
    
            const points = this.toNumberArray();
            for (let i = 0; i < points.length - 1; i += 2) {
                const x = points[i];
                const y = points[i + 1];
    
                this._bounds.x = Math.min(this._bounds.x, x);
                this._bounds.y = Math.min(this._bounds.y, y);
                this._bounds.width = Math.max(this._bounds.width, x);
                this._bounds.height = Math.max(this._bounds.height, y);
            }
    
            this._bounds.width -= this._bounds.x;
            this._bounds.height -= this._bounds.y;
            
        }

        return this._bounds;
    }

    public translate(x: number | Phaser.Point, y?: number): Polygon {
        if (x instanceof Phaser.Point) {
            return this.translate(x.x, x.y);
        } else {
            const points = this.toNumberArray();
            for (let i = 0; i < points.length - 1; i += 2) {
                points[i] += x;
                points[i + 1] += y;
            }
            this.setTo(points);
            return this;
        }
    }

    public setTo(points: any) {
        super.setTo(points);
        this._bounds = null;
        return this;
    }
}