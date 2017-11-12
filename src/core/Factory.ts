import { Player } from '../objects/player/Player';
import { Group } from './Group';
import { Bullet } from '../objects/Bullet';
import { Crab } from '../objects/Crab';
import { Game } from './Game';

export class Factory {
    protected game: Game;

    constructor(game: Game) {
        this.game = game;
    }

    public create(type: string, x: number, y: number) {
        switch (type) {
            case "Crab":
                return new Crab(this.game, x, y);
        }
    }

    public bullet(x: number, y: number) {
        const sprite = new Bullet(this.game, x, y);
        return sprite;
    }

    public crab(x: number, y: number) {
        return new Crab(this.game, x, y);
    }

    public group() {
        return new Group(this.game);
    }

    public player(x: number, y: number) {
        return new Player(this.game, x, y);
    }
}
