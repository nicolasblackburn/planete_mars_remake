import { Game } from './Game';

export class Sprite extends Phaser.Sprite {
    public collisionRectangle: Phaser.Rectangle;
    public collisionRectangleOffset: Phaser.Point;
    public awake: boolean;
    public game: Game;

    constructor(
        game: Game,
        x: number,
        y: number,
        key: string | Phaser.RenderTexture | Phaser.BitmapData | PIXI.Texture,
        frame: string | number
    ) {

        super(game, x, y, key, frame);

        this.collisionRectangle = new Phaser.Rectangle(
            0,
            0,
            this.width,
            this.height
        );

        this.smoothed = false;
        this.scale.set(game.pixelScale);

        this.game.physics.enable(this, Phaser.Physics.P2JS);
        this.body.immovable = true;

        this.awake = false;
    }

    /**
     * Returns the bounds of the sprite as a Phaser.Rectangle.
     */
    public getBoundsAsRectangle() {
        const bounds = this.getBounds();
        return new Phaser.Rectangle(
            bounds.x,
            bounds.y,
            bounds.width,
            bounds.height);
    }

    public preUpdate() {
        if (!super.preUpdate()) {
            return false;
        }
        if (!this.awake && this.inCamera) {
            this.awake = true;
        }
        return true;
    }

    public updateBody() {
        if (this.body) {
            const x = this.collisionRectangle.x * this.game.pixelScale;
            const y = this.collisionRectangle.y * this.game.pixelScale;
            const width = this.collisionRectangle.width * this.game.pixelScale;
            const height = this.collisionRectangle.height * this.game.pixelScale;

            // The physics body offset coordinates are relative to the center of mass
            // so we apply a transform to the top/left rectangle coordinates
            const offsetX = x + (width - this.width) / 2;
            const offsetY = y + (height - this.height) / 2;

            this.body.setRectangle(
                width,
                height,
                offsetX,
                offsetY
            );
        }
    }

    protected addAnimations(groupKey: string) {
        for (const animation of this.game.animations[groupKey]) {
            const [key, frames, rate] = animation;
            this.animations.add(key as string, frames as string[], rate as number);
        }
    }
}
