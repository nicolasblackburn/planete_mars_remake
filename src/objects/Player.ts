import {Game} from '../core/Game';
import {Sprite} from '../core/Sprite';

enum Dir { up, upRight, right, rightDown, down, downLeft, left, leftUp }

export class Player extends Sprite {
  private cursors: Phaser.CursorKeys;
  private maxVelocity: number = 60;
  private body2: p2.Body;
  private precalcVelocity: Phaser.Point[] = Array(4);
  private lastNonDiagonalDirection: number = Dir.down;

  constructor(game: Game, x: number, y: number) {
    super(game, x, y, 'sprites', 'player_idle_down_00');

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

    this.animations.add('idle_up', ['player_idle_up_00']);
    this.animations.add('idle_right', ['player_idle_right_00']);
    this.animations.add('idle_down', ['player_idle_down_00']);
    this.animations.add('idle_left', ['player_idle_left_00']);
    this.animations.add('move_up',
      ['player_move_up_00', 'player_move_up_01', 'player_move_up_02', 'player_move_up_03'], 10);
    this.animations.add('move_right',
      ['player_move_right_00', 'player_move_right_01', 'player_move_right_02', 'player_move_right_03'], 10);
    this.animations.add('move_down',
      ['player_move_down_00', 'player_move_down_01', 'player_move_down_02', 'player_move_down_03'], 10);
    this.animations.add('move_left',
      ['player_move_left_00', 'player_move_left_01', 'player_move_left_02', 'player_move_left_03'], 10);
    this.animations.add('shoot_up',
      ['player_shoot_up_00', 'player_shoot_up_01', 'player_shoot_up_02', 'player_shoot_up_03'], 10);
    this.animations.add('shoot_right',
      ['player_shoot_right_00', 'player_shoot_right_01', 'player_shoot_right_02', 'player_shoot_right_03'], 10);
    this.animations.add('shoot_down',
      ['player_shoot_down_00', 'player_shoot_down_01', 'player_shoot_down_02', 'player_shoot_down_03'], 10);
    this.animations.add('shoot_left',
      ['player_shoot_left_00', 'player_shoot_left_01', 'player_shoot_left_02', 'player_shoot_left_03'], 10);
    this.animations.add('move_shoot_up',
      ['player_move_shoot_up_00', 'player_move_shoot_up_01', 'player_move_shoot_up_02', 'player_move_shoot_up_03'], 10);
    this.animations.add('move_shoot_right',
      ['player_move_shoot_right_00', 'player_move_shoot_right_01', 'player_move_shoot_right_02', 'player_move_shoot_right_03'], 10);
    this.animations.add('move_shoot_down',
      ['player_move_shoot_down_00', 'player_move_shoot_down_01', 'player_move_shoot_down_02', 'player_move_shoot_down_03'], 10);
    this.animations.add('move_shoot_left',
      ['player_move_shoot_left_00', 'player_move_shoot_left_01', 'player_move_shoot_left_02', 'player_move_shoot_left_03'], 10);
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
      this.animations.play('move_up', null, true);
      this.lastNonDiagonalDirection = Dir.up;

    } else if (upIsDown && rightIsDown) {
      ({x, y} = this.precalcVelocity[Dir.upRight]);

    } else if (rightIsDown && ! upIsDown && ! downIsDown) {
      ({x, y} = this.precalcVelocity[Dir.right]);
      this.animations.play('move_right', null, true);

      this.lastNonDiagonalDirection = Dir.right;
    } else if (rightIsDown && downIsDown) {
      ({x, y} = this.precalcVelocity[Dir.rightDown]);

    } else if (downIsDown && ! rightIsDown && ! leftIsDown) {
      ({x, y} = this.precalcVelocity[Dir.down]);
      this.animations.play('move_down', null, true);
      this.lastNonDiagonalDirection = Dir.down;

    } else if (downIsDown && leftIsDown) {
      ({x, y} = this.precalcVelocity[Dir.downLeft]);

    } else if (leftIsDown && ! upIsDown && ! downIsDown) {
      ({x, y} = this.precalcVelocity[Dir.left]);
      this.animations.play('move_left', null, true);
      this.lastNonDiagonalDirection = Dir.left;

    } else if (leftIsDown && upIsDown) {
      ({x, y} = this.precalcVelocity[Dir.leftUp]);
    
    } else if (! upIsDown && ! rightIsDown && ! downIsDown && ! leftIsDown) {
      switch (this.lastNonDiagonalDirection) {
        case Dir.up:
          this.animations.play('idle_up', null, true);
          break;

        case Dir.right:
          this.animations.play('idle_right', null, true);
          break;

        case Dir.down:
          this.animations.play('idle_down', null, true);
          break;

        case Dir.left:
          this.animations.play('idle_left', null, true);
          break;
      }
    }

    this.body.velocity.x = x;
    this.body.velocity.y = y;
  }
}
