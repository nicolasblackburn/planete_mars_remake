import {Game} from './Game';

export class Sprite extends Phaser.Sprite {
  public game2: Game;
  protected baseCollisionRectangle: Phaser.Rectangle;
  protected collisionGroup: Phaser.Physics.P2.CollisionGroup;

  constructor(game: Game, x: number, y: number, key: string | Phaser.RenderTexture | Phaser.BitmapData | PIXI.Texture, frame: string | number/*, collisionGroup: string, collisionRectangle: Phaser.Rectangle*/) {
    super(game, x, y, key, frame);
    this.game2 = game;

    this.baseCollisionRectangle = new Phaser.Rectangle(0, 0, this.getBounds().width, this.getBounds().height);
    //this.collisionGroup = this.game2.collisionGroups.get(collisionGroup);

    this.texture.baseTexture.scaleMode = PIXI.scaleModes.NEAREST;
    this.scale.set(this.game2.pixelScale);
  }

  public updateBody() {
    if (this.body) {
        this.body.setRectangle(
          this.baseCollisionRectangle.width * this.game2.pixelScale,
          this.baseCollisionRectangle.height * this.game2.pixelScale,
          this.baseCollisionRectangle.x * this.game2.pixelScale,
          this.baseCollisionRectangle.y * this.game2.pixelScale);

        if (this.collisionGroup) {
          this.body.setCollisionGroup(this.collisionGroup);
        }
    }
  }
}
