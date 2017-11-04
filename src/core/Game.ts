// States
import {animations} from 'animations';
import {Boot} from 'states/Boot';
import {Loading} from 'states/Loading';
import {Main} from 'states/Main';
import {Menu} from 'states/Menu';
import { Polygon } from 'geom/Polygon';
import {Debug} from 'core/Debug';

// Factories
import {Factory} from './Factory';

export class Game extends Phaser.Game {
  public animations: {[key: string]: (string | number | string[])[][]};
  public factory: Factory;
  public pixelScale: number;
  public timeScale: number;

  constructor() {
    const baseWidth = 256;
    const baseHeight = 144;
    //const baseWidth = 192;
    //const baseHeight = 108;
    const ratio  = 16/9;

    let scale;
    let width;
    let height;

    scale = Math.floor(window.innerWidth / baseWidth) || 1;
    width = baseWidth * scale;
    height = width / ratio;

    if (height > window.innerHeight) {
      scale =  Math.floor(window.innerHeight / baseHeight) || 1;
      height = baseHeight * scale;
      width = height * ratio;
    }

    super({
      width: width,
      height: height,
      renderer: Phaser.CANVAS });

    this.pixelScale = scale;
    this.timeScale = this.pixelScale * 0.06;

    this.animations = animations;

    this.factory = new Factory(this);

    this.state.add('boot', Boot);
    this.state.add('loading', Loading);
    this.state.add('menu', Menu);
    this.state.add('main', Main);

    this.state.start('boot');

  }

  public getMainState() {
    return this.state.states['main'];
  }

  public init() {
	  this.time.advancedTiming = true;
    this.scale.pageAlignHorizontally = true;
    this.scale.pageAlignVertically = true;
    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    //this.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
    //this.scale.setResizeCallback(this.resize, this);

    this.physics.startSystem(Phaser.Physics.P2JS);
    this.physics.p2.setImpactEvents(true);

    Object.assign(window, {
      tri: new Polygon([100, 100, 200, 100, 200, 200]),
      quad: new Polygon([110, 160, 210, 170, 240, 240, 99, 200]),
      Polygon: Polygon,
      debug: new Debug(this)
    });
  }

  /*
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
  }
  */
}
