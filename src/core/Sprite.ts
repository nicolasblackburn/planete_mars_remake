import { Game } from "core/Game";

export class Sprite extends Phaser.Sprite {
  public baseCollisionShape: Phaser.Rectangle;

  constructor(
    game: Game,
    x: number,
    y: number,
    key: string | Phaser.RenderTexture | Phaser.BitmapData | PIXI.Texture,
    frame: string | number
  ) {
    
    super(game, x, y, key, frame);

    this.baseCollisionShape = new Phaser.Rectangle(
      0,
      0,
      this.getBounds().width,
      this.getBounds().height
    );

    this.smoothed = false;
    this.scale.set(game.pixelScale);

    this.game.physics.enable(this, Phaser.Physics.P2JS);
    this.body.immovable = true;

    this.exists = false;
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
    if (!this.exists && this.inCamera) {
      this.exists = true;
    }
    return super.preUpdate();
  }

  public updateBody() {
    if (this.body) {
      const game = this.game as Game;
      this.body.setRectangle(
        this.baseCollisionShape.width * game.pixelScale,
        this.baseCollisionShape.height * game.pixelScale,
        this.baseCollisionShape.x * game.pixelScale,
        this.baseCollisionShape.y * game.pixelScale
      );
    }
  }

  protected addAnimations(groupKey: string) {
    const game = this.game as Game;
    for (const animation of game.animations[groupKey]) {
      const [key, frames, rate] = animation;
      this.animations.add(key as string, frames as string[], rate as number);
    }
  }
}
