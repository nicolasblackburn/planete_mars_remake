import { Game } from 'core/Game';

export class Sprite extends Phaser.Sprite {
  public game2: Game;
  protected baseCollisionShape: Phaser.Rectangle;
  public awake: boolean;

  constructor(game: Game, x: number, y: number, key: string | Phaser.RenderTexture | Phaser.BitmapData | PIXI.Texture, frame: string | number) {
    super(game, x, y, key, frame);
    this.game2 = game;

    this.baseCollisionShape = new Phaser.Rectangle(0, 0, this.getBounds().width, this.getBounds().height);

    this.smoothed = false;
    this.scale.set(this.game2.pixelScale);

    this.game.physics.enable(this, Phaser.Physics.P2JS);
    this.body.immovable = true;

    this.awake = false;
  }

  public preUpdate() {
    if (! super.preUpdate()) {
      return false;
    }
    if (!this.awake && this.inCamera) {
      this.awake = true;
    }
    return true;
  }

  public updateBody() {
    if (this.body) {
      this.body.setRectangle(
        this.baseCollisionShape.width * this.game2.pixelScale,
        this.baseCollisionShape.height * this.game2.pixelScale,
        this.baseCollisionShape.x * this.game2.pixelScale,
        this.baseCollisionShape.y * this.game2.pixelScale);
    }
  }

  protected addAnimations(groupKey: string) {
    for (const animation of this.game2.animations[groupKey]) {
      const [key, frames, rate] = animation;
      this.animations.add(key as string, frames as string[], rate as number);
    }
  }
}
