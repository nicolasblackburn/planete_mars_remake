import { Game } from 'core/Game';
import { Enemy } from 'core/Enemy';

export class Crab extends Enemy {
  public damagePoints: number = 40;
  protected cursors: Phaser.CursorKeys;
  protected maxVelocity: number = 4;
  public spawnPoint: Phaser.Point;

  constructor(game: Game, x: number, y: number) {
    super(game, x, y, 'sprites', 'crab_00');

    this.body.fixedRotation = true;

    this.addAnimations('crab');
  }

  public update() {
    this.animations.play('idle', null, true);
  }
}
