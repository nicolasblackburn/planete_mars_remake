import {Game} from '../core/Game';
import {Sprite} from '../core/Sprite';
import {State} from '../core/State';
import {Tilemap} from '../core/Tilemap';
import {fontStyles} from '../fontStyles';

const floor = Math.floor;

export class Main extends State {
  protected map: Tilemap;
  protected hud: Phaser.Group;
  protected healthText: Phaser.Text;
  protected cameraPadding: number = 8;
  protected lastScale: number = 1;

  public create() {
    this.map = new Tilemap(this.game2, 'level1_intro');

    this.hud = this.game.add.group();
    this.healthText = this.game.add.text(0, 0, '0, 0', fontStyles.body, this.hud);

    this.resize();
  }

  public update() {
    const tileWidth = this.map.tileWidth / 2 * this.game2.pixelScale;
    const tileHeight = this.map.tileHeight / 2 * this.game2.pixelScale;

    this.game.camera.x = floor(this.game2.player.x - this.camera.width / 2);
    this.game.camera.y = floor(this.game2.player.y - this.camera.height / 2);

    this.constrainCamera();

    this.healthText.text = 'Énergie: 100%';
    this.healthText.text += '\nFPS: ' + this.game.time.fps;

    this.hud.position.set(
      this.game.camera.x + this.cameraPadding,
      this.game.camera.y + this.cameraPadding);
  }

  public resize() {
    const width = this.game.width;
    const height = this.game.height;
    const scale = height === 0 || width / height >= 1 ? height / 360 : width / 360;

    this.healthText.fontSize = floor(fontStyles.body.fontSize * scale);
    this.cameraPadding = floor(8 * scale);

    if (this.lastScale !== this.game2.pixelScale) {
      this.game.camera.x = floor(this.game.camera.x / this.lastScale * this.game2.pixelScale);
      this.game.camera.y = floor(this.game.camera.y / this.lastScale * this.game2.pixelScale);
      this.constrainCamera();
      this.lastScale = this.game2.pixelScale;
    }
  }

  protected constrainCamera() {
    const tileWidth = this.map.tileWidth / 2 * this.game2.pixelScale;
    const tileHeight = this.map.tileHeight / 2 * this.game2.pixelScale;
    const maxX = this.game.world.width - this.camera.width - tileWidth;
    const maxY = this.game.world.height - this.camera.height - tileHeight;

    if (this.game.camera.x < tileWidth) {
      this.game.camera.x = floor(tileWidth);
    } else if (this.game.camera.x > maxX) {
      this.game.camera.x = floor(maxX);
    }

    if (this.game.camera.y < tileHeight) {
      this.game.camera.y = floor(tileHeight);
    } else if (this.game.camera.y > maxY) {
      this.game.camera.y = floor(maxY);
    }
  }
}
