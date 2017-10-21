// States
import {animations} from '../animations';
import {Boot} from '../states/Boot';
import {Loading} from '../states/Loading';
import {Menu} from '../states/Menu';
import {Main} from '../states/Main';

// Factories
import {Factory} from './Factory';

export class Game extends Phaser.Game {
  public animations: {[key: string]: (string | number | string[])[][]} = animations;
  public factory: Factory;
  public playerCollisionGroups: Phaser.Physics.P2.CollisionGroup;
  public ennemiesCollisionGroups: Phaser.Physics.P2.CollisionGroup;
  public bulletsCollisionGroups: Phaser.Physics.P2.CollisionGroup;
  public wallsCollisionGroups: Phaser.Physics.P2.CollisionGroup;

  //private scaledCanvas: HTMLCanvasElement;
  //private scaledContext: CanvasRenderingContext2D;
  //private scaledWidth: number;
  //private scaledHeight: number;

  constructor() {
    super({
      width:960,
      height: 540,
      renderer: Phaser.AUTO });

    this.factory = new Factory(this);

    this.state.add('boot', Boot);
    this.state.add('loading', Loading);
    this.state.add('menu', Menu);
    this.state.add('main', Main);

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

    this.state.start('boot');
  }

  public init() {
    this.physics.startSystem(Phaser.Physics.P2JS);

    this.input.keyboard.addCallbacks(this, this.onKeyDown, this.onKeyUp, this.onKeyPress);

    this.playerCollisionGroups = this.physics.p2.createCollisionGroup();
    this.ennemiesCollisionGroups = this.physics.p2.createCollisionGroup();
    this.bulletsCollisionGroups = this.physics.p2.createCollisionGroup();
    this.wallsCollisionGroups = this.physics.p2.createCollisionGroup();
  }

  public onKeyDown(event: Event) {
  }

  public onKeyUp(event: Event) {
  }

  public onKeyPress(event: Event) {
  }
}
