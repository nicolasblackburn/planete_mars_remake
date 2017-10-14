import {State} from '../core/State';
import {Debug} from '../core/Debug';
import * as geom from '../geometry';
import * as vec from '../vector';

Object.assign(window, {geom: geom, pixi: PIXI, vec: vec});

export class Boot extends State {
  public preload() {
    // Load assets for the loading screen
    this.game.load.atlas('loading', 'assets/atlas/loading.png', 'assets/atlas/loading.json', Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
  }

  public create() {
    Object.assign(window, {
      debug: new Debug(this.game),
      a: vec.translate([[0, 0], [8, 0], [8, 16], [0,16]], [0, 0]),
      b: vec.translate([[16, 0], [16, 16], [0, 16]], [0, 0])
    });
    (window as any).stage = this.game.stage;
		this.game.state.start('loading');
  }
}
