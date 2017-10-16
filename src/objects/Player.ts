import {Direction} from '../core/Direction';
import {Game} from '../core/Game';
import {Sprite} from '../core/Sprite';

export class Player extends Sprite {
  private cursors: Phaser.CursorKeys;
  private spaceKey: Phaser.Key;
  private maxVelocity: number = 60;
  private body2: p2.Body;
  private precalcVelocity: Phaser.Point[] = Array(4);
  private lastNonDiagonalDirection: number = Direction.down;
  private aimDirection: Direction = Direction.down;
  private isMoving: boolean = false;
  private spaceKeyIsDown: boolean = false;

  constructor(game: Game, x: number, y: number) {
    super(game, x, y, 'sprites', 'player_idle_down_00');

    const pixelScale = this.game2.pixelScale;

    this.texture.baseTexture.scaleMode = PIXI.scaleModes.NEAREST;
    this.scale.set(pixelScale);

    this.game.physics.enable(this, Phaser.Physics.P2JS);
    this.body.fixedRotation = true;
    this.body.setRectangle(8 * pixelScale, 11 * pixelScale, 0, 1 * pixelScale);
    this.body.setCollisionGroup(this.game2.playerCollisionGroups);
    this.body.collides(this.game2.wallsCollisionGroups);
    //this.body.debug = true;

    this.precalcVelocities();

    this.defineAnimations();

    this.cursors = this.game.input.keyboard.createCursorKeys();
    this.spaceKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
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
      ({x, y} = this.precalcVelocity[Direction.up]);
      this.animations.play('move_up', null, true);
      this.lastNonDiagonalDirection = Direction.up;
      this.isMoving = true;
      this.aimDirection = Direction.up;

    } else if (upIsDown && rightIsDown) {
      ({x, y} = this.precalcVelocity[Direction.upRight]);
      if (! this.isMoving) {
        this.animations.play('move_up', null, true);
        this.lastNonDiagonalDirection = Direction.up;
      }
      this.isMoving = true;
      this.aimDirection = Direction.upRight;

    } else if (rightIsDown && ! upIsDown && ! downIsDown) {
      ({x, y} = this.precalcVelocity[Direction.right]);
      this.animations.play('move_right', null, true);
      this.lastNonDiagonalDirection = Direction.right;
      this.isMoving = true;
      this.aimDirection = Direction.right;

    } else if (rightIsDown && downIsDown) {
      ({x, y} = this.precalcVelocity[Direction.rightDown]);
      if (! this.isMoving) {
        this.animations.play('move_right', null, true);
        this.lastNonDiagonalDirection = Direction.right;
      }
      this.isMoving = true;
      this.aimDirection = Direction.rightDown;

    } else if (downIsDown && ! rightIsDown && ! leftIsDown) {
      ({x, y} = this.precalcVelocity[Direction.down]);
      this.animations.play('move_down', null, true);
      this.lastNonDiagonalDirection = Direction.down;
      this.isMoving = true;
      this.aimDirection = Direction.down;

    } else if (downIsDown && leftIsDown) {
      ({x, y} = this.precalcVelocity[Direction.downLeft]);
      if (! this.isMoving) {
        this.animations.play('move_down', null, true);
        this.lastNonDiagonalDirection = Direction.down;
      }
      this.isMoving = true;
      this.aimDirection = Direction.downLeft;

    } else if (leftIsDown && ! upIsDown && ! downIsDown) {
      ({x, y} = this.precalcVelocity[Direction.left]);
      this.animations.play('move_left', null, true);
      this.isMoving = true;
      this.aimDirection = Direction.left;

    } else if (leftIsDown && upIsDown) {
      ({x, y} = this.precalcVelocity[Direction.leftUp]);
      this.lastNonDiagonalDirection = Direction.left;
      if (! this.isMoving) {
        this.animations.play('move_left', null, true);
        this.lastNonDiagonalDirection = Direction.left;
      }
      this.isMoving = true;
      this.aimDirection = Direction.leftUp;

    } else if (! upIsDown && ! rightIsDown && ! downIsDown && ! leftIsDown) {
      switch (this.lastNonDiagonalDirection) {
        case Direction.up:
          this.animations.play('idle_up', null, true);
          break;

        case Direction.right:
          this.animations.play('idle_right', null, true);
          break;

        case Direction.down:
          this.animations.play('idle_down', null, true);
          break;

        case Direction.left:
          this.animations.play('idle_left', null, true);
          break;
      }
      this.isMoving = false;
    }

    this.body.velocity.x = x;
    this.body.velocity.y = y;

    if (this.spaceKey.isDown && ! this.spaceKeyIsDown) {
      const bullet = this.game2.factory.bullet(this.body.x, this.body.y);
      bullet.setDirection(this.aimDirection);
      bullet.body.velocity.x += this.body.velocity.x;
      bullet.body.velocity.y += this.body.velocity.y;
      this.spaceKeyIsDown = true;
    } else if (this.spaceKey.isUp) {
      this.spaceKeyIsDown = false;
    }
  }

  private precalcVelocities() {
    const v = this.maxVelocity * this.game2.pixelScale;
    const vDivBySqrtOf2 = v * 0.707;

    this.precalcVelocity[Direction.up] = new Phaser.Point(0, -v);
    this.precalcVelocity[Direction.upRight] = new Phaser.Point(vDivBySqrtOf2, -vDivBySqrtOf2);
    this.precalcVelocity[Direction.right] = new Phaser.Point(v, 0);
    this.precalcVelocity[Direction.rightDown] = new Phaser.Point(vDivBySqrtOf2, vDivBySqrtOf2);
    this.precalcVelocity[Direction.down] = new Phaser.Point(0, v);
    this.precalcVelocity[Direction.downLeft] = new Phaser.Point(-vDivBySqrtOf2, vDivBySqrtOf2);
    this.precalcVelocity[Direction.left] = new Phaser.Point(-v, 0);
    this.precalcVelocity[Direction.leftUp] = new Phaser.Point(-vDivBySqrtOf2, -vDivBySqrtOf2);
  }

  private defineAnimations() {
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
}
