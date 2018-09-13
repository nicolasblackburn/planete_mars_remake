import { fontStyles } from "../fontStyles";
import { GameData } from "../objects/GameData";

export class NewGame extends Phaser.State {
    protected title: Phaser.Text;
    protected entriesGroup: Phaser.Group;
    protected mainGroup: Phaser.Group;
    protected gameData: GameData[];
    
    public create() {
        this.title = this.game.add.text(0, 0, 'Créer une partie', fontStyles.title);
        this.mainGroup = this.game.add.group();

        this.mainGroup.add(this.title);

        this.resize();
    }

    public resize() {
        const width = this.game.width;
        const height = this.game.height;
        const scale = height === 0 || width / height >= 1 ? height / 360 : width / 360;
        const lineHeight = fontStyles.body.lineHeight * scale;
        const titleLineHeight = fontStyles.title.lineHeight * scale;

        this.title.fontSize = fontStyles.title.fontSize * scale;
        
        this.mainGroup.x = width/2 - this.mainGroup.width/2;
        this.mainGroup.y = height/2 - this.mainGroup.height/2;
    }
}