import { fontStyles } from '../fontStyles';
import { GameState } from '../core/GameState';

export class Menu extends GameState {
    protected mainGroup: Phaser.Group;
    protected title: Phaser.Text;
    protected buttonContinue: Phaser.Text;
    protected buttonOptions: Phaser.Text;
    protected optionsGroup: Phaser.Group;

    public create() {
        this.title = this.game.add.text(0, 0, 'PLANÈTE MARS', fontStyles.header);

        this.buttonContinue = this.game.add.text(0, 0, 'Continuer', fontStyles.body);
        this.buttonContinue.inputEnabled = true;
        this.buttonContinue.input.useHandCursor = true;

        this.buttonOptions = this.game.add.text(0, 0, 'Options', fontStyles.body);
        this.buttonOptions.inputEnabled = true;
        this.buttonOptions.input.useHandCursor = true;

        this.optionsGroup = this.game.add.group();
        this.mainGroup = this.game.add.group();

        this.optionsGroup.addMultiple([this.buttonContinue, this.buttonOptions]);

        this.mainGroup.addMultiple([
            this.title,
            this.optionsGroup
        ]);

        this.resize();

        this.buttonContinue.events.onInputDown.add(() => {
            this.game.state.start('loadmenu');
        });

        this.buttonOptions.events.onInputDown.add(() => {
            this.game.state.start('optionsmenu');
        });

    }

    public resize() {
        const width = this.game.width;
        const height = this.game.height;
        const scale = height === 0 || width / height >= 1 ? height / 360 : width / 360;
        const lineHeight = fontStyles.body.lineHeight * scale;

        this.title.fontSize = fontStyles.header.fontSize * scale;
        let i = 0;
        this.optionsGroup.forEach((button: Phaser.Text) => {
            button.fontSize = fontStyles.body.fontSize * scale;
            button.y = i * lineHeight * 1.5;
            i++;
        });

        const titlePadding = fontStyles.header.lineHeight - fontStyles.header.fontSize;

        this.optionsGroup.position.set(
            this.title.x + (this.title.width - this.optionsGroup.width) / 2,
            this.title.y + this.title.height + titlePadding
        );

        this.mainGroup.position.set(
            (width - this.mainGroup.width) / 2,
            (height - this.mainGroup.height) / 2);
    }
}
