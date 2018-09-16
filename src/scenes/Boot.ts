import { GameState } from '../core/GameState';

/**
 * This state preloads the initial game assets.
 */
export class Boot extends GameState{
    public init() {
        this.game.init();
    }

    public preload() {
        // Load assets for the loading screen
        this.game.load.atlas('loading', 'assets/atlas/loading.png', 'assets/atlas/loading.json', Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
    }

    public create() {
        this.game.state.start('loading');
    }
}
