import { fontStyles } from "../fontStyles";
import { GameData } from "../objects/GameData";
import { GameState } from "../core/GameState";

export class NewGameMenu extends GameState {
    protected title: Phaser.Text;
    protected entriesGroup: Phaser.Group;
    protected mainGroup: Phaser.Group;
    protected textInputSprite: Phaser.Sprite;
    protected textInput: HTMLInputElement;
    protected cancelButton: Phaser.Text;
    protected okButton: Phaser.Text;
    protected buttonsGroup: Phaser.Group;
    protected gameData: GameData[];
    protected dataIndex: number;

    public init(gameData: GameData[], dataIndex: number) {
        this.gameData = gameData;
        this.dataIndex = dataIndex;
    }
    
    public create() {
        this.mainGroup = this.game.add.group();
        this.buttonsGroup = this.game.add.group();

        this.title = this.game.add.text(0, 0, 'Créer une partie', fontStyles.title);

        this.textInput = document.createElement('input');
        document.body.appendChild(this.textInput);
        Object.entries({
            type: 'text',
            placeholder: 'Entrez votre nom:'
        }).forEach(([key, value]) => {
            this.textInput.setAttribute(key, value);
        });

        this.textInput.style.position = 'absolute';
        this.textInputSprite = this.game.add.sprite();

        const canvasScale = this.game.canvas.height / this.game.canvas.clientHeight;
        this.textInputSprite.width = this.textInput.getBoundingClientRect().width * canvasScale;
        this.textInputSprite.height = this.textInput.getBoundingClientRect().height * canvasScale;

        this.cancelButton = this.game.add.text(0, 0, 'Annuler', fontStyles.body);
        this.cancelButton.inputEnabled = true;
        this.cancelButton.input.useHandCursor = true;
        this.cancelButton.events.onInputDown.add(() => {
            this.textInput.style.display = 'none';
            this.game.state.start('loadmenu');
        }); 

        this.okButton = this.game.add.text(0, 0, 'Ok', fontStyles.body);
        this.okButton.inputEnabled = true;
        this.okButton.input.useHandCursor = true;
        this.okButton.events.onInputDown.add(() => {
            const value = this.textInput.value;
            if (value.trim() !== '') {
                this.gameData.push({
                    name: value.trim()
                });
            }
            localStorage.setItem('gameData', JSON.stringify(this.gameData));
            this.textInput.remove();
            this.game.state.start('loadmenu');
        }); 

        this.buttonsGroup.addMultiple([this.cancelButton, this.okButton]);
        this.mainGroup.addMultiple([this.title, this.textInputSprite, this.buttonsGroup]);

        this.resize();
    }

    public resize() {
        const width = this.game.width;
        const height = this.game.height;
        const canvasScale = this.game.canvas.height / this.game.canvas.clientHeight;
        const canvasOffset = new Phaser.Point(
            this.game.canvas.getBoundingClientRect().left,
            this.game.canvas.getBoundingClientRect().top
        );
        const scale = height === 0 || width / height >= 1 ? height / 360 : width / 360;
        const lineHeight = fontStyles.body.lineHeight * scale;
        const titleLineHeight = fontStyles.title.lineHeight * scale;

        this.title.fontSize = fontStyles.title.fontSize * scale;
        this.textInput.style.fontSize = fontStyles.body.fontSize * scale / canvasScale + 'px';
        this.textInputSprite.width = this.textInput.getBoundingClientRect().width * canvasScale;
        this.textInputSprite.height = this.textInput.getBoundingClientRect().height * canvasScale;
        this.textInputSprite.y = titleLineHeight * 2; 

        let x = 0;
        this.buttonsGroup.forEach((text: Phaser.Text) => {
            text.fontSize = fontStyles.body.fontSize * scale; 
            text.x = x;
            x = text.width + lineHeight / 2;
        });
        this.buttonsGroup.x = this.mainGroup.width - this.buttonsGroup.width;
        this.buttonsGroup.y = this.textInputSprite.y + this.textInputSprite.height + lineHeight / 2;
        
        this.mainGroup.x = width/2 - this.mainGroup.width/2;
        this.mainGroup.y = height/2 - this.mainGroup.height/2;

        this.textInput.style.left = (this.mainGroup.x + this.textInputSprite.x) / canvasScale + canvasOffset.x + 'px';
        this.textInput.style.top = (this.mainGroup.y + this.textInputSprite.y) / canvasScale + canvasOffset.y + 'px';
    }
}