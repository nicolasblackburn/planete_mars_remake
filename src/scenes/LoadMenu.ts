export class LoadMenu extends Phaser.State {
    protected savedGames: Phaser.Text[];

    public create() {
        for (let i = 0; i <= 3; i++) {
            this.savedGames[i] = this.game.add.text(0, 0, (i + 1) + '. [New]');
        }
    }
}