import { Sprite } from 'core/Sprite';
import { Game } from 'core/Game';

export class Group<T extends Sprite> extends Phaser.Group {
  constructor(game: Game) {
    super(game);
    this.updateOnlyExistingChildren = true;
  }

  [Symbol.iterator]() {
    let index = 0;
    let children = this.children;
    return {
      next(): IteratorResult<T> {
        if (index < children.length) {
          return {
            done: false,
            value: children[index++] as T
          }
        } else {
          return {
            done: true,
            value: null
          }
        }
      }
    };
  }
}
