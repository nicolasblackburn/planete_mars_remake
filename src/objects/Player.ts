import {Game} from '../core/Game';
import {Sprite} from '../core/Sprite';

enum Dir { up, upRight, right, rightDown, down, downLeft, left, leftUp }

export class Player extends Sprite {
  private cursors: Phaser.CursorKeys;
  private maxVelocity: number = 60;
  private body2: p2.Body;
  private precalcVelocity: Phaser.Point[] = Array(4);

  constructor(game: Game, x: number, y: number) {
    super(game, x, y, 'sprites', 'player-standing-down-00');

    const pixelScale = this.game2.pixelScale;

    this.texture.baseTexture.scaleMode = PIXI.scaleModes.NEAREST;
    this.scale.set(pixelScale);

    this.game.physics.enable(this, Phaser.Physics.P2JS);
    this.body.fixedRotation = true;
    this.body.setRectangle(8 * pixelScale, 11 * pixelScale, 0, 1 * pixelScale);
    //this.body.debug = true;

    this.cursors = this.game.input.keyboard.createCursorKeys();

    const sqrtOf2 = Math.sqrt(2);
    const v = this.maxVelocity * pixelScale;
    const vDivBySqrtOf2 = v / sqrtOf2;

    this.precalcVelocity[Dir.up] = new Phaser.Point(0, -v);
    this.precalcVelocity[Dir.upRight] = new Phaser.Point(vDivBySqrtOf2, -vDivBySqrtOf2);
    this.precalcVelocity[Dir.right] = new Phaser.Point(v, 0);
    this.precalcVelocity[Dir.rightDown] = new Phaser.Point(vDivBySqrtOf2, vDivBySqrtOf2);
    this.precalcVelocity[Dir.down] = new Phaser.Point(0, v);
    this.precalcVelocity[Dir.downLeft] = new Phaser.Point(-vDivBySqrtOf2, vDivBySqrtOf2);
    this.precalcVelocity[Dir.left] = new Phaser.Point(-v, 0);
    this.precalcVelocity[Dir.leftUp] = new Phaser.Point(-vDivBySqrtOf2, -vDivBySqrtOf2);
  }

  public update() {
    const pixelScale = this.game2.pixelScale;
    let upIsDown = false;
    let rightIsDown = false;
    let downIsDown = false;
    let leftIsDown = false;

    if (this.cursors.up.isUp && this.cursors.down.isUp) {
      this.body.velocity.y = 0;
    } else if (this.cursors.up.isDown) {
      upIsDown = true;
    } else if (this.cursors.down.isDown) {
      downIsDown = true;
    }

    if (this.cursors.left.isUp && this.cursors.right.isUp) {
      this.body.velocity.x = 0;
    } else if (this.cursors.right.isDown) {
      rightIsDown = true;
    } else if (this.cursors.left.isDown) {
      leftIsDown = true;
    }

    let x = 0;
    let y = 0;

    if (upIsDown && ! rightIsDown && ! leftIsDown) {
      ({x, y} = this.precalcVelocity[Dir.up]);
    } else if (upIsDown && rightIsDown) {
      ({x, y} = this.precalcVelocity[Dir.upRight]);
    } else if (rightIsDown && ! upIsDown && ! downIsDown) {
      ({x, y} = this.precalcVelocity[Dir.right]);
    } else if (rightIsDown && downIsDown) {
      ({x, y} = this.precalcVelocity[Dir.rightDown]);
    } else if (downIsDown && ! rightIsDown && ! leftIsDown) {
      ({x, y} = this.precalcVelocity[Dir.down]);
    } else if (downIsDown && leftIsDown) {
      ({x, y} = this.precalcVelocity[Dir.downLeft]);
    } else if (leftIsDown && ! upIsDown && ! downIsDown) {
      ({x, y} = this.precalcVelocity[Dir.left]);
    } else if (leftIsDown && upIsDown) {
      ({x, y} = this.precalcVelocity[Dir.leftUp]);
    }

    this.body.velocity.x = x;
    this.body.velocity.y = y;
  }
}
