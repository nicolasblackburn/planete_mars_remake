import { fontStyles } from "../fontStyles";
import { GameData } from "../objects/GameData";

export class LoadMenu extends Phaser.State {
    protected title: Phaser.Text;
    protected entriesGroup: Phaser.Group;
    protected mainGroup: Phaser.Group;
    protected savedGameTexts: Phaser.Text[] = [];
    protected gameData: GameData[] = [];
    protected gameDataLoaded: boolean = false;
    
    public create() {
        if (!this.gameDataLoaded) {
            this.gameDataLoaded = true;
            this.loadGames();
        }

        this.title = this.game.add.text(0, 0, 'Charger une partie', fontStyles.title);
        this.mainGroup = this.game.add.group();

        for (let i = 0; i < 3; i++) {     
            if(this.gameData[i]) {
                let entryName = this.gameData[i].name;
                this.savedGameTexts[i] = this.game.add.text(0, 0, (i + 1) + '. ' + entryName, fontStyles.body);
                this.savedGameTexts[i].events.onInputDown.add(() => {
                    this.game.state.start('main');
                });    
            } else {
                this.savedGameTexts[i] = this.game.add.text(0, 0, (i + 1) + '. [Nouveau]', fontStyles.body);
                this.savedGameTexts[i].events.onInputDown.add(() => {
                    this.game.state.start('newgame', true, false, this.gameData, i);
                }); 
            }
            this.savedGameTexts[i].inputEnabled = true;
            this.savedGameTexts[i].input.useHandCursor = true;
        }

        this.entriesGroup = this.game.add.group();
        this.entriesGroup.addMultiple(this.savedGameTexts);
        
        this.mainGroup.add(this.title);
        this.mainGroup.add(this.entriesGroup);

        this.resize();
    }

    protected loadGames() {
        const gameData = JSON.parse(localStorage.getItem('gameData'));
        this.gameData = gameData ? gameData : [];
    }

    public resize() {
        const width = this.game.width;
        const height = this.game.height;
        const scale = height === 0 || width / height >= 1 ? height / 360 : width / 360;
        const lineHeight = fontStyles.body.lineHeight * scale;
        const titleLineHeight = fontStyles.title.lineHeight * scale;

        this.title.fontSize = fontStyles.title.fontSize * scale;
        
        this.savedGameTexts.forEach((text, i) => {
            text.fontSize = fontStyles.body.fontSize * scale; 
            text.y = i * lineHeight * 1.5;
        });

        this.entriesGroup.x = this.mainGroup.width/2 - this.entriesGroup.width/2;
        this.entriesGroup.y = titleLineHeight * 2;

        this.mainGroup.x = width/2 - this.mainGroup.width/2;
        this.mainGroup.y = height/2 - this.mainGroup.height/2;
    }
}