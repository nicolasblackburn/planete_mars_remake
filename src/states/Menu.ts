import {State} from 'core/State';
import {fontStyles} from 'fontStyles';

export class Menu extends State {
  protected group: Phaser.Group;
  protected title: Phaser.Text;
  protected textClick: Phaser.Text;

  public create() {
    this.title = this.game.add.text(0, 0, 'PLANÈTE MARS', fontStyles.header);
    this.textClick = this.game.add.text(0, 0, 'Cliquer pour commencer', fontStyles.body);

    this.group = this.game.add.group();
    this.group.addMultiple([
      this.title,
      this.textClick]);

    this.resize();

    this.input.onDown.addOnce(() => {
        this.game.state.start('main');
    });

  }

  public resize() {
    const width = this.game.width;
    const height = this.game.height;
    const scale = height === 0 || width / height >= 1 ? height / 360 : width / 360;

    this.title.fontSize = fontStyles.header.fontSize * scale;
    this.textClick.fontSize = fontStyles.body.fontSize * scale;

    const titlePadding = fontStyles.header.lineHeight - fontStyles.header.fontSize;

    this.textClick.position.set(
      this.title.x + (this.title.width - this.textClick.width) / 2,
      this.title.y + this.title.height + titlePadding
    );

    this.group.position.set(
      (width - this.group.width) / 2,
      (height - this.group.height) / 2);
  }
}
