import Game from '../Game';
import Sprite from '../Sprite';
import State from '../State';
import Tilemap from '../Tilemap';
import fontStyles from '../fontStyles';

export default class Main extends State {
  private map: Tilemap;
  private player: Sprite;
  private cameraText: Phaser.Text;

  public create() {
	  this.game.physics.startSystem(Phaser.Physics.P2JS);
    this.map = new Tilemap(this.game2, 'level1_intro');
    this.player = this.map.player;
    this.cameraText = this.game.add.text(96, 96, '0, 0', <Phaser.PhaserTextStyle>fontStyles.subheader);
  }

  public update() {
    const pixelScale = this.game2.pixelScale;
    const tileWidth = this.map.tileWidth / 2 * pixelScale;
    const tileHeight = this.map.tileHeight / 2 * pixelScale;
    const maxX = this.game.world.width - this.camera.width - tileWidth;
    const maxY = this.game.world.height - this.camera.height - tileHeight;

    this.game.camera.x = this.player.x - (this.camera.width - this.player.width) / 2;
    this.game.camera.y = this.player.y - (this.camera.height - this.player.height) / 2;

    if (this.game.camera.x < tileWidth) {
      this.game.camera.x = tileWidth;
    } else if (this.game.camera.x > maxX) {
      this.game.camera.x = maxX;
    }

    if (this.game.camera.y < tileHeight) {
      this.game.camera.y = tileHeight;
    } else if (this.game.camera.y > maxY) {
      this.game.camera.y = maxY;
    }

    this.cameraText.text = '(' + this.player.x.toFixed(2) + ', ' + this.player.y.toFixed(2) + ')\n';
    this.cameraText.position.set(
      this.game.camera.x,
      this.game.camera.y);
  }
}
