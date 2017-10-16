import {Direction} from '../core/Direction';
import {Game} from '../core/Game';
import {Sprite} from '../core/Sprite';

export class Bullet extends Sprite {
  private maxVelocity: number = 120;

  constructor(game: Game, x: number, y: number) {
    super(game, x, y, 'sprites', 'bullet_00');

    const pixelScale = this.game2.pixelScale;

    this.texture.baseTexture.scaleMode = PIXI.scaleModes.NEAREST;
    this.scale.set(pixelScale);

    this.game.physics.enable(this, Phaser.Physics.P2JS);
    this.body.setCollisionGroup(this.game2.bulletsCollisionGroups);
    this.body.collides(this.game2.ennemiesCollisionGroups);
  }

  public setDirection(direction: Direction) {
    switch (direction) {
      case Direction.up:
        this.body.rotation = Math.PI / 2;
        this.body.velocity.x = 0;
        this.body.velocity.y = -this.maxVelocity * this.game2.pixelScale;
        break;
      case Direction.upRight:
        this.body.rotation = 3 * Math.PI / 4;
        this.body.velocity.x = this.maxVelocity * this.game2.pixelScale * 0.707;
        this.body.velocity.y = -this.maxVelocity * this.game2.pixelScale * 0.707;
        break;
      case Direction.right:
        this.body.rotation = 0;
        this.body.velocity.x = this.maxVelocity * this.game2.pixelScale;
        this.body.velocity.y = 0;
        break;
      case Direction.rightDown:
        this.body.rotation = - 3 * Math.PI / 4;
        this.body.velocity.x = this.maxVelocity * this.game2.pixelScale * 0.707;
        this.body.velocity.y = this.maxVelocity * this.game2.pixelScale * 0.707;
        break;
      case Direction.down:
        this.body.rotation = Math.PI / 2;
        this.body.velocity.x = 0;
        this.body.velocity.y = this.maxVelocity * this.game2.pixelScale;
        break;
      case Direction.downLeft:
        this.body.rotation = 3 * Math.PI / 4;
        this.body.velocity.x = -this.maxVelocity * this.game2.pixelScale * 0.707;
        this.body.velocity.y = this.maxVelocity * this.game2.pixelScale * 0.707;
        break;
      case Direction.left:
        this.body.rotation = Math.PI;
        this.body.velocity.x = -this.maxVelocity * this.game2.pixelScale;
        this.body.velocity.y = 0;
        break;
      case Direction.leftUp:
        this.body.rotation = Math.PI / 4;
        this.body.velocity.x = -this.maxVelocity * this.game2.pixelScale * 0.707;
        this.body.velocity.y = -this.maxVelocity * this.game2.pixelScale * 0.707;
        break;
    }
  }

  public update() {
    this.angle += 1;
  }
}
