// States
import {Boot} from '../states/Boot';
import {Loading} from '../states/Loading';
import {Menu} from '../states/Menu';
import {Main} from '../states/Main';

// Factories
import {Factory} from './Factory';

export class Game extends Phaser.Game {
  public factory: Factory;
  private scaledCanvas: HTMLCanvasElement;
  public pixelScale: number = 4;
  private scaledContext: CanvasRenderingContext2D;
  private scaledWidth: number;
  private scaledHeight: number;
  public world2: p2.World;

  constructor() {
    super({
      width:960,
      height: 540,
      renderer: Phaser.AUTO });

    this.factory = new Factory(this);
    this.world2 = new p2.World({gravity: [0, 0]});

    //this.scale.pageAlignHorizontally = true;
    //this.scale.pageAlignVertically = true;
    //this.scale.scaleMode = Phaser.ScaleManager.RESIZE;

    //this.canvas.style.display = 'none';
    //this.scaledCanvas = Phaser.Canvas.create(this.game.width * this.pixelScale, this.game.height * this.pixelScale);
    //this.scaledContext = this.scaledCanvas.getContext('2d');
    //Phaser.Canvas.addToDOM(this.scaledCanvas);
    //Phaser.Canvas.setSmoothingEnabled(this.scaledContext, false);
    //this.scaledWidth = this.scaledCanvas.width;
    //this.scaledHeight = this.scaledCanvas.height;

    this.state.add('boot', Boot);
    this.state.add('loading', Loading);
    this.state.add('menu', Menu);
    this.state.add('main', Main);
    this.state.start('boot');
  }
}
