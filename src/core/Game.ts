import { Debug } from './Debug';
import { Main } from '../scenes/Main';
import { Menu } from '../scenes/Menu';
import { Loading } from '../scenes/Loading';
import { Boot } from '../scenes/Boot';
import { animations } from '../animations';
import { Factory } from './Factory';
import { LoadMenu } from '../scenes/LoadMenu';
import { NewGame } from '../scenes/NewGame';

const BASE_WIDTH = 192;
const BASE_HEIGHT = 108;

export class Game extends Phaser.Game {
    public animations: { [key: string]: (string | number | string[])[][] };
    public factory: Factory;
    public pixelScale: number;
    public timeScale: number;

    constructor() {
        let scale;
        let width;
        let height;

        scale = 6;
        width = BASE_WIDTH * scale;
        height = BASE_HEIGHT * scale;

        super({
            width: width,
            height: height,
            renderer: Phaser.CANVAS
        });

        this.pixelScale = scale;
        this.timeScale = 1 //this.pixelScale * 0.06;

        this.animations = animations;

        this.factory = new Factory(this);

        this.state.add('boot', Boot);
        this.state.add('loading', Loading);
        this.state.add('menu', Menu);
        this.state.add('main', Main);
        this.state.add('loadmenu', LoadMenu);
        this.state.add('newgame', NewGame);
        this.state.start('boot');

    }

    public getMainState() {
        return this.state.states['main'];
    }

    public init() {
        Object.assign(window, {
            debug: new Debug(this),
            game: this
        });

        this.time.advancedTiming = true;
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.scale.setResizeCallback(this.resize, this);

        this.physics.startSystem(Phaser.Physics.P2JS);
        this.physics.p2.setImpactEvents(true);
    }

    public resize() {
        this.state.getCurrentState().resize(this.width, this.height);
        /*
        let scale = window.innerWidth / BASE_WIDTH / this.pixelScale;
        let width = window.innerWidth;
        let height = BASE_HEIGHT * this.pixelScale * scale;
        if (height > window.innerHeight) {
            scale = window.innerHeight / BASE_HEIGHT / this.pixelScale;
            height = window.innerHeight;
            width = BASE_WIDTH * this.pixelScale * scale;
        }
        console.log(scale);
        this.canvas.style.width = width + 'px';
        this.canvas.style.height = height + 'px';
        */
    /*
        const baseWidth = 240;
        const baseHeight = 135;
        const ratio  = baseWidth / baseHeight;
        let scale = Math.floor(window.innerWidth / baseWidth) || 1;
        let width = baseWidth * scale;
        let height = width / ratio;

        if (height > window.innerHeight) {
        scale =  Math.floor(window.innerHeight / baseHeight) || 1;
        height = baseHeight * scale;
        width = height * ratio;
        }

        if (scale === this.pixelScale) {
        return;
        }

        this.scale.setUserScale(width / this.width, height / this.height);
    */
    }
}
