import { Sprite } from '../core/Sprite';
import { Shape, dot, getBounds } from '../geom';
import { Trigger } from '../core/Trigger';

export class Gate extends Trigger {
    public bounds: Phaser.Rectangle
    public axis: Phaser.Point;

    constructor(shape: Phaser.Rectangle, axis: Phaser.Point) {
        super(shape);
        this.axis = axis;
    }

    public action(sprite: Sprite, shape: Shape, ...args: any[]) {
        if (this.axis.x === 0 && this.axis.y !== 0) {
            // First find the direction
            const velocity = new Phaser.Point(sprite.body.velocity.x, sprite.body.velocity.y);
            const shapeBounds = getBounds(shape);
    
            const dir = dot(velocity, this.axis);
            if (dir < 0) {
                const dy = -(shapeBounds.y + shapeBounds.height - this.bounds.y) - 1;
                sprite.body.y += dy;
    
            } else {
                const dy = this.bounds.y + this.bounds.height - shapeBounds.y + 1;
                sprite.body.y += dy;
            }

        } else if (this.axis.x !== 0 && this.axis.y === 0) {
            // First find the direction
            const velocity = new Phaser.Point(sprite.body.velocity.x, sprite.body.velocity.y);
            const shapeBounds = getBounds(shape);
    
            const dir = dot(velocity, this.axis);
            if (dir < 0) {
                const dx = -(shapeBounds.x + shapeBounds.width - this.bounds.x) - 1;
                sprite.body.x += dx;
    
            } else {
                const dx = this.bounds.x + this.bounds.width - shapeBounds.x + 1;
                sprite.body.x += dx;
            }

        }
    }
}