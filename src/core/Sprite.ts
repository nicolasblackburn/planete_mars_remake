import {Game} from './Game';

export class Sprite extends Phaser.Sprite {
  public game2: Game;
  protected unscaledCollisionBody: Phaser.Rectangle;
  protected collisionGroup: Phaser.Physics.P2.CollisionGroup;

  constructor(game: Game, x: number, y: number, key?: string | Phaser.RenderTexture | Phaser.BitmapData | PIXI.Texture, frame?: string | number) {
    super(game, x, y, key, frame);
    this.game2 = game;

    this.unscaledCollisionBody = new Phaser.Rectangle(0, 0, this.getBounds().width, this.getBounds().height);

    this.texture.baseTexture.scaleMode = PIXI.scaleModes.NEAREST;
    this.scale.set(this.game2.pixelScale);
  }

  public resize() {
    this.scale.set(this.game2.pixelScale);
    this.updateBody();
  }

  public updateBody() {
    if (this.body) {
        this.body.setRectangle(
          this.unscaledCollisionBody.width * this.game2.pixelScale,
          this.unscaledCollisionBody.height * this.game2.pixelScale,
          this.unscaledCollisionBody.x * this.game2.pixelScale,
          this.unscaledCollisionBody.y * this.game2.pixelScale);

        if (this.collisionGroup) {
          this.body.setCollisionGroup(this.collisionGroup);
        }
    }
  }
}
