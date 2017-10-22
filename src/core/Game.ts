// States
import {animations} from '../animations';
import {Boot} from '../states/Boot';
import {Loading} from '../states/Loading';
import {Main} from '../states/Main';
import {Menu} from '../states/Menu';
import {Sprite} from './Sprite';
import {Bullet} from '../objects/Bullet';
import {Player} from '../objects/Player';

// Factories
import {Factory} from './Factory';

export interface IGameOptions {

}

export class Game extends Phaser.Game {
  public animations: {[key: string]: (string | number | string[])[][]};
  public bullets: Bullet[];
  public factory: Factory;
  public enemies: Sprite[];
  public player: Player;
  public playerCollisionGroup: Phaser.Physics.P2.CollisionGroup;
  public enemiesCollisionGroup: Phaser.Physics.P2.CollisionGroup;
  public bulletsCollisionGroup: Phaser.Physics.P2.CollisionGroup;
  public wallsCollisionGroup: Phaser.Physics.P2.CollisionGroup;
  public pixelScale: number;
  //public scaledCanvas: HTMLCanvasElement;
  //public scaledContext: CanvasRenderingContext2D;

  constructor(options?: IGameOptions) {
    //*
    const baseWidth = 240;
    const baseHeight = 135;
    const ratio  = 16/9;
    let scale = Math.floor(window.innerWidth / baseWidth) || 1;
    let width = baseWidth * scale;
    let height = width / ratio;

    if (height > window.innerHeight) {
      scale =  Math.floor(window.innerHeight / baseHeight) || 1;
      height = baseHeight * scale;
      width = height * ratio;
    }
    //*/

    super({
      width: width,
      height: height,
      renderer: Phaser.CANVAS });

    this.pixelScale = scale;

    this.animations = animations;

    this.factory = new Factory(this);

    this.bullets = [];
    this.enemies = [];

    this.state.add('boot', Boot);
    this.state.add('loading', Loading);
    this.state.add('menu', Menu);
    this.state.add('main', Main);

    this.state.start('boot');

  }

  public init() {
    //this.renderer.renderSession.roundPixels = true;
    this.scale.pageAlignHorizontally = true;
    this.scale.pageAlignVertically = true;
    this.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
    //this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.scale.setResizeCallback(this.resize, this);

    /*
    this.canvas.style.display = 'none';
    this.scaledCanvas = Phaser.Canvas.create(document.body as HTMLDivElement, this.width * this.pixelScale, this.height * this.pixelScale);
    this.scaledContext = this.scaledCanvas.getContext('2d');
    Phaser.Canvas.addToDOM(this.scaledCanvas, null);
    Phaser.Canvas.setSmoothingEnabled(this.scaledContext, false);
    //*/

    this.physics.startSystem(Phaser.Physics.P2JS);

    this.playerCollisionGroup = this.physics.p2.createCollisionGroup();
    this.enemiesCollisionGroup = this.physics.p2.createCollisionGroup();
    this.bulletsCollisionGroup = this.physics.p2.createCollisionGroup();
    this.wallsCollisionGroup = this.physics.p2.createCollisionGroup();
  }

  public resize() {
    //*
    const baseWidth = 240;
    const baseHeight = 135;
    const ratio  = baseWidth / baseHeight;
    let scale = Math.floor(window.innerWidth / baseWidth) || 1;
    let width = baseWidth * scale;
    let height = width / ratio;

    if (height > window.innerHeight) {
      scale =  Math.floor(window.innerHeight / baseHeight) || 1;
      height = baseHeight * scale;
      width = height * ratio;
    }

    if (scale === this.pixelScale) {
      return;
    }

    this.scale.setUserScale(width / this.width, height / this.height);
    this.pixelScale = scale;

    //this.scale.setUserScale(scale / this.pixelScale, scale / this.pixelScale);

    /*
    this.state.getCurrentState().resize(width, height);

    for (const bullet of this.bullets) {
      bullet.resize();
    }

    for (const enemy of this.enemies) {
      enemy.resize();
    }

    if (this.player) {
      this.player.resize();
    }

    //*/
  }

  public render() {
    /*
    this.scaledContext.drawImage(this.canvas, 0, 0, this.width, this.height, 0, 0, this.scaledCanvas.width, this.scaledCanvas.height);
    //*/
  }
}
