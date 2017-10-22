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
  private cameraPadding: number = 8;
  private lastScale: number = 1;

  public create() {
    this.map = new Tilemap(this.game2, 'level1_intro');

    this.player = this.map.player;

    this.hud = this.game.add.group();
    this.healthText = this.game.add.text(0, 0, '0, 0', fontStyles.subheader, this.hud);

    this.resize();
  }

  public update() {
    const tileWidth = this.map.tileWidth / 2 * this.game2.pixelScale;
    const tileHeight = this.map.tileHeight / 2 * this.game2.pixelScale;

    this.game.camera.x = this.player.x - (this.camera.width - this.player.width) / 2;
    this.game.camera.y = this.player.y - (this.camera.height - this.player.height) / 2;

    this.constrainCamera();

    this.healthText.text = 'Énergie: 100%';

    this.hud.position.set(
      this.game.camera.x + this.cameraPadding,
      this.game.camera.y + this.cameraPadding);
  }

  public resize() {
    const width = this.game.width;
    const height = this.game.height;
    const scale = height === 0 || width / height >= 1 ? height / 360 : width / 360;

    this.healthText.fontSize = fontStyles.subheader.fontSize * scale;
    this.cameraPadding = 8 * scale;

    for (const layer of this.map.tilemapLayers) {
      layer.setScale(this.game2.pixelScale);
    }

    if (this.lastScale !== this.game2.pixelScale) {
      this.game.camera.x /= this.lastScale * this.game2.pixelScale;
      this.game.camera.y /= this.lastScale * this.game2.pixelScale;
      this.constrainCamera();
      this.lastScale = this.game2.pixelScale;
    }
  }

  private constrainCamera() {
    const tileWidth = this.map.tileWidth / 2 * this.game2.pixelScale;
    const tileHeight = this.map.tileHeight / 2 * this.game2.pixelScale;
    const maxX = this.game.world.width - this.camera.width - tileWidth;
    const maxY = this.game.world.height - this.camera.height - tileHeight;

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
  }
}
