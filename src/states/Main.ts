import {Game} from '../core/Game';
import {Sprite} from '../core/Sprite';
import {State} from '../core/State';
import {Tilemap} from '../core/Tilemap';
import {fontStyles} from '../fontStyles';

export class Main extends State {
  private map: Tilemap;
  private player: Sprite;
  private hud: Phaser.Group;
  private healthText: Phaser.Text;

  public create() {
    this.map = new Tilemap(this.game2, 'level1_intro');

    this.player = this.map.player;

    this.hud = this.game.add.group();
    this.healthText = this.game.add.text(0, 0, '0, 0', fontStyles.subheader, this.hud);
  }

  public update() {
    const tileWidth = this.map.tileWidth / 2;
    const tileHeight = this.map.tileHeight / 2;
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

    this.healthText.text = 'Énergie: 100%';

    this.hud.position.set(
      this.game.camera.x + 8,
      this.game.camera.y + 8);
  }
}
