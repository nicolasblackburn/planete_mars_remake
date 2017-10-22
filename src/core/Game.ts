// States
import {animations} from '../animations';
import {Boot} from '../states/Boot';
import {Loading} from '../states/Loading';
import {Menu} from '../states/Menu';
import {Main} from '../states/Main';

// Factories
import {Factory} from './Factory';

export class Game extends Phaser.Game {
  public animations: {[key: string]: (string | number | string[])[][]};
  public factory: Factory;
  public playerCollisionGroups: Phaser.Physics.P2.CollisionGroup;
  public ennemiesCollisionGroups: Phaser.Physics.P2.CollisionGroup;
  public bulletsCollisionGroups: Phaser.Physics.P2.CollisionGroup;
  public wallsCollisionGroups: Phaser.Physics.P2.CollisionGroup;
  public pixelScale: number;
  //*
  public pixel: { scale: number, canvas: HTMLCanvasElement, context: CanvasRenderingContext2D, width: number, height: number };
  //*/

  constructor() {
    //const width = 240;
    //const height = 135;
    //let scale = 4;
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
    this.pixel = { scale: 4, canvas: null, context: null, width: 0, height: 0 };

    this.animations = animations;

    this.factory = new Factory(this);

    this.state.add('boot', Boot);
    this.state.add('loading', Loading);
    this.state.add('menu', Menu);
    this.state.add('main', Main);

    this.state.start('boot');

  }

  public init() {
    this.renderer.renderSession.roundPixels = true;

    this.scale.pageAlignHorizontally = true;
    this.scale.pageAlignVertically = true;
    this.scale.setResizeCallback(this.resize, this);

    /*
    this.canvas.style.display = 'none';
    this.pixel.canvas = Phaser.Canvas.create(document.body as HTMLDivElement, this.width * this.pixel.scale, this.height * this.pixel.scale);
    this.pixel.context = this.pixel.canvas.getContext('2d');
    Phaser.Canvas.addToDOM(this.pixel.canvas, null);
    Phaser.Canvas.setSmoothingEnabled(this.pixel.context, false);
    //*/

    this.physics.startSystem(Phaser.Physics.P2JS);

    this.playerCollisionGroups = this.physics.p2.createCollisionGroup();
    this.ennemiesCollisionGroups = this.physics.p2.createCollisionGroup();
    this.bulletsCollisionGroups = this.physics.p2.createCollisionGroup();
    this.wallsCollisionGroups = this.physics.p2.createCollisionGroup();
  }

  public resize() {
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

    this.scale.setGameSize(width, height);

    this.state.getCurrentState().resize(width, height);
    //*/
  }

  public render() {
    /*
    this.pixel.context.drawImage(this.canvas, 0, 0, this.width, this.height, 0, 0, this.pixel.canvas.width, this.pixel.canvas.height);
    //*/
  }
}
