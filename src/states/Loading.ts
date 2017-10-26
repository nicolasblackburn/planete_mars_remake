import {State} from '../core/State';
import {fontStyles} from '../fontStyles';

export class Loading extends State {
  protected title: Phaser.Text;

  public preload() {
    this.title = this.game.add.text(0 , 0, 'Loading...', <Phaser.PhaserTextStyle>fontStyles.header);
    this.resize();

    // Load initial game assets
    this.game.load.atlas('sprites', 'assets/atlas/sprites.png', 'assets/atlas/sprites.json', Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
    this.game.load.tilemap('level1_intro', './assets/maps/level1_intro.json', null, Phaser.Tilemap.TILED_JSON);
    //this.game.load.tilemap('mars', './assets/maps/mars.json', null, Phaser.Tilemap.TILED_JSON);
    this.game.load.image('mars', './assets/maps/mars.png');
  }

  public create() {
    this.game.state.start('menu');
  }

  public resize() {
    const width = this.game.width;
    const height = this.game.height;
    const scale = height === 0 || width / height >= 1 ? height / 360 : width / 360;

    this.title.fontSize = fontStyles.header.fontSize * scale;
    this.title.position.set(
      (width - this.title.width) / 2,
      (height - this.title.height) / 2);
  }
}
