import {State} from 'core/State';
import {Debug} from 'core/Debug';

export class Boot extends State {
  public init() {
    this.game2.init();
  }

  public preload() {
    // Load assets for the loading screen
    this.game.load.atlas('loading', 'assets/atlas/loading.png', 'assets/atlas/loading.json', Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
  }

  public create() {
    (window as any).debug = new Debug(this.game2);
		this.game2.state.start('loading');
  }
}
