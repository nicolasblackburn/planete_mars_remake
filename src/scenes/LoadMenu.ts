import { fontStyles } from "../fontStyles";
import { GameData } from "../objects/GameData";

export class LoadMenu extends Phaser.State {
    protected title: Phaser.Text;
    protected entriesGroup: Phaser.Group;
    protected mainGroup: Phaser.Group;
    protected savedGames: Phaser.Text[] = [];
    protected loadedGames: GameData[] = [];
    
    public create() {
        this.title = this.game.add.text(0, 0, 'Charger une partie', fontStyles.title);
        this.mainGroup = this.game.add.group();
        
        this.loadGames();

        for (let i = 0; i < 3; i++) {            
            if(this.loadedGames[i]) {
                let entryName = this.loadedGames[i].name;
                this.savedGames[i] = this.game.add.text(0, 0, (i + 1) + '. ' + entryName, fontStyles.body);
                this.savedGames[i].events.onInputDown.add(() => {
                    this.game.state.start('main');
                });    
            } else {
                this.savedGames[i] = this.game.add.text(0, 0, (i + 1) + '. [Nouveau]', fontStyles.body);
                this.savedGames[i].events.onInputDown.add(() => {
                    this.game.state.start('newgame');
                }); 
            }
            this.savedGames[i].inputEnabled = true;
            this.savedGames[i].input.useHandCursor = true;
        }

        this.entriesGroup = this.game.add.group();
        this.entriesGroup.addMultiple(this.savedGames);
        
        this.mainGroup.add(this.title);
        this.mainGroup.add(this.entriesGroup);

        this.resize();
    }

    protected loadGames() {
        this.loadedGames.push({
            name: "Laetitia"
        });
    }

    public resize() {
        const width = this.game.width;
        const height = this.game.height;
        const scale = height === 0 || width / height >= 1 ? height / 360 : width / 360;
        const lineHeight = fontStyles.body.lineHeight * scale;
        const titleLineHeight = fontStyles.title.lineHeight * scale;

        this.title.fontSize = fontStyles.title.fontSize * scale;
        
        this.savedGames.forEach((text, i) => {
            text.fontSize = fontStyles.body.fontSize * scale; 
            text.y = i * lineHeight * 1.5;
        });

        this.entriesGroup.x = this.mainGroup.width/2 - this.entriesGroup.width/2;
        this.entriesGroup.y = titleLineHeight * 2;

        this.mainGroup.x = width/2 - this.mainGroup.width/2;
        this.mainGroup.y = height/2 - this.mainGroup.height/2;
    }
}