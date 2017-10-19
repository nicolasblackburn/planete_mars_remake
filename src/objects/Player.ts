import {Direction} from '../core/Direction';
import {Game} from '../core/Game';
import {Sprite} from '../core/Sprite';
import {PlayerInput} from '../input/PlayerInput';

export class Player extends Sprite {
  public maxVelocity: number = 60;
  private isMoving: boolean = false;
  private spaceKeyIsDown: boolean = false;
  private playerInput: PlayerInput;

  constructor(game: Game, x: number, y: number) {
    super(game, x, y, 'sprites', 'player_idle_down_00');

    this.playerInput = new PlayerInput(this.game2);

    const pixelScale = this.game2.pixelScale;

    this.texture.baseTexture.scaleMode = PIXI.scaleModes.NEAREST;
    this.scale.set(pixelScale);

    this.game.physics.enable(this, Phaser.Physics.P2JS);
    this.body.fixedRotation = true;
    this.body.setRectangle(8 * pixelScale, 11 * pixelScale, 0, 1 * pixelScale);
    this.body.setCollisionGroup(this.game2.playerCollisionGroups);
    this.body.collides(this.game2.wallsCollisionGroups);
    //this.body.debug = true;

    this.defineAnimations();
    //this.input.get('shoot').on('enter', (last) => { this.onEnterShoot(last); });
    //this.input.get('move_shoot').on('enter', (last) => { this.onEnterMoveShoot(last); });
  }

  public update() {
    const input = this.playerInput;

    input.update();

    const scale =  this.maxVelocity * this.game2.pixelScale;

    const animationKey = input.state.key() + '_' + this.vecToString(input.lastNonDiagonalDirection);
    this.animations.play(animationKey, null, true);

    this.body.velocity.x = input.direction.x * scale;
    this.body.velocity.y = input.direction.y * scale;
  }

  private vecToString(vector: Phaser.Point) {
    if (vector.y < 0) {
      return 'up';
    } else if (vector.x > 0) {
      return 'right';
    } else if (vector.y > 0) {
      return 'down';
    } else if (vector.x < 0) {
      return 'left';
    } else {
      return '';
    }
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
