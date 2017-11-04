import { BlinkingTimer } from 'objects/player/BlinkingTimer';
import { NormalState } from 'objects/player/NormalState';
import {Game} from 'core/Game';
import {Sprite} from 'core/Sprite';
import {InputHandler} from 'input/topdownaction/InputHandler';
import {Main} from 'states/Main';
import { StateMachine } from 'statemachine/StateMachine';
import { PlayerState } from 'objects/player/PlayerState';
import { HurtState } from 'objects/player/HurtState';

export class Player extends Sprite {
  public health: number = 100;
  public blinking: boolean = false;
  public inputHandler: InputHandler;
  public state: StateMachine<PlayerState>;
  public gameState: Main;
  protected blinkingTimer: BlinkingTimer;

  constructor(game: Game, x: number, y: number) {
    super(game, x, y, 'sprites', 'player_idle_down_00');

    this.gameState = game.getMainState();
    this.inputHandler = new InputHandler(game, this);

    this.game.physics.enable(this, Phaser.Physics.P2JS);
    this.body.fixedRotation = true;

    this.collisionRectangle = new Phaser.Rectangle(4, 4, 8, 11);
    this.updateBody();

    //this.body.debug = true;

    this.addAnimations('player');

    this.inputHandler.onShoot.add(this.shoot, this);

    this.state = new StateMachine();
    this.state.add('normal', new NormalState(this));
    this.state.add('hurt', new HurtState(this));
    this.state.set('normal');
  }

  public currentAnimationKey() {
    const state = this.inputHandler.state.key();
    const direction = this.inputHandler.direction;
    if (direction.y < 0) {
      return state + '_up';
    } else if (direction.x > 0) {
      return state + '_right';
    } else if (direction.y > 0) {
      return state + '_down';
    } else if (direction.x < 0) {
      return state + '_left';
    } else {
      return '';
    }
  }

  public hurt(damage: number) {
    this.state.current().hurt(damage);
  }

  public shoot() {
    this.state.current().shoot();
  }
  
  public startBlinking() {
    this.blinking = true;
    if (this.blinkingTimer) {
      this.blinkingTimer.destroy();
    }
    this.blinkingTimer = new BlinkingTimer(this);
  }

  public stopBlinking() {
    this.blinking = false;
    this.visible = true;
  }

  public update() {
    this.state.current().update();
  }
}
