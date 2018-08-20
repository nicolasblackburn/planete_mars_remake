import { Game } from '../core/Game';

export class Boot extends Phaser.State {
  public init() {
    const game = this.game as Game;
    game.init();
  }

  public preload() {
    // Load assets for the loading screen
    this.game.load.atlas('loading', 'assets/atlas/loading.png', 'assets/atlas/loading.json', Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
  }

  public create() {
    const game = this.game as Game;
		game.state.start('loading');
  }
}
