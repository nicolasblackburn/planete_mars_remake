import { Sprite } from './Sprite';
import { Shape } from '../geom';

export class Trigger {
    public shape: Shape;
    public action: (sprite: Sprite, shape: Shape, ...args: any[]) => void;
    public context: any;

    constructor(
        shape: Shape, 
        action: (sprite: Sprite, shape: Shape, ...args: any[]) => void,
        context?: any
    ) {
        this.shape = shape;
        this.action = action;
        this.context = context;
    }


}