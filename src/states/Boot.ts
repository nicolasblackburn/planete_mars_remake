import {State} from '../core/State';
import {Debug} from '../core/Debug';

export class Boot extends State {
  public preload() {
    // Load assets for the loading screen
    this.game.load.atlas('loading', 'assets/atlas/loading.png', 'assets/atlas/loading.json', Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
  }

  public create() {
    this.game2.init();
		this.game.state.start('loading');
  }
}
