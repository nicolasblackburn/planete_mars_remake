import { fontStyles } from "../fontStyles";
import { GameState } from "../core/GameState";

export class OptionsMenu extends GameState {
    protected title: Phaser.Text;
    protected mainGroup: Phaser.Group;
    protected optionsGroup: Phaser.Group;
    protected buttonsGroup: Phaser.Group;
    protected inputs: HTMLInputElement[];
    protected okButton: Phaser.Text;
    
    public create() {
        this.mainGroup = this.game.add.group();
        this.optionsGroup = this.game.add.group();
        this.buttonsGroup = this.game.add.group();
        this.inputs = [];

        this.title = this.game.add.text(0, 0, 'Contrôles', fontStyles.title);

        const inputsConfig: {[key: string]: {label: string, key: string}} = {
            up: {label: 'Haut', key: 'i'},
            down: {label: 'Bas', key: 'k'},
            left: {label: 'Gauche', key: 'j'},
            right: {label: 'Droite', key: 'l'},
            fire: {label: 'Feu', key: 's'},
        };
        
        for (const [inputKey, {label, key}] of Object.entries(inputsConfig)) {
            const labelText = this.game.add.text(0, 0, label, fontStyles.body);
            const inputSprite = this.game.add.sprite();
            const gr = this.game.add.graphics();
            gr.beginFill(0xff9900, 0.5);
            gr.drawRect(0, 0, 32, 32);
            gr.endFill();
            inputSprite.addChild(gr);
            const input = document.createElement('input');
            document.body.appendChild(input);
            Object.entries({
                type: 'text',
                value: key,
                size: '1'
            }).forEach(([key, value]) => {
                input.setAttribute(key, value);
            });
    
            input.style.position = 'absolute';
            this.inputs.push(input);
            this.optionsGroup.addMultiple([labelText, inputSprite]);
            input.addEventListener('onchange', () => {
                inputsConfig[inputKey].key = input.value.slice(0, 1);
            });
        }

        this.okButton = this.game.add.text(0, 0, 'Ok', fontStyles.body);
        this.okButton.inputEnabled = true;
        this.okButton.input.useHandCursor = true;
        this.okButton.events.onInputDown.add(() => {
            this.inputs.forEach(input => input.remove());
            this.game.state.start('menu');
        }); 

        this.buttonsGroup.addMultiple([this.okButton]);
        this.mainGroup.addMultiple([this.title, this.optionsGroup, this.buttonsGroup]);

        this.update();
    }

    public update() {
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

        this.optionsGroup.y = titleLineHeight * 2;

        (() => {
            let i = 0;
            this.optionsGroup.children.forEach((object: any) => {
                if (object instanceof Phaser.Text) {
                    object.fontSize = fontStyles.body.fontSize * scale; 
                } else if (object instanceof Phaser.Sprite) {
                    const input = this.inputs[i];
                    input.style.fontSize = fontStyles.body.fontSize * scale / canvasScale + 'px'; 
                    object.width = input.getBoundingClientRect().width * canvasScale;
                    object.height = input.getBoundingClientRect().height * canvasScale;
                    i++;
                }
            });
        })();

        let gridWidth = this.optionsGroup.children
        .reduce((r, x) => (x instanceof PIXI.DisplayObjectContainer ? Math.max(r, x.width) : r), 0);
        this.optionsGroup.align(2, -1, 2 * gridWidth, 2 * lineHeight);

        (() => {
            let i = 0;
            this.optionsGroup.children.forEach((object: any) => {
                if (object instanceof Phaser.Text) {
                } else if (object instanceof Phaser.Sprite) {
                    const input = this.inputs[i];
                    input.style.left = object.getBounds().x / canvasScale + canvasOffset.x + 'px';
                    input.style.top = object.getBounds().y / canvasScale + canvasOffset.y + 'px';
                    i++;
                }
            });
        })();

        let x = 0;
        this.buttonsGroup.forEach((text: Phaser.Text) => {
            text.fontSize = fontStyles.body.fontSize * scale; 
            text.x = x;
            x = text.width + lineHeight / 2;
        });

        this.buttonsGroup.x = this.mainGroup.width - this.buttonsGroup.width;
        this.buttonsGroup.y = this.optionsGroup.y + this.optionsGroup.height + lineHeight / 2
        
        this.mainGroup.x = width/2 - this.mainGroup.width/2;
        this.mainGroup.y = height/2 - this.mainGroup.height/2;
    }

    public resize() {
        this.update();
    }
}