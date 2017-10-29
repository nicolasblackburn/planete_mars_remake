import { Sprite } from 'core/Sprite';
import { Game } from 'core/Game';

export class Group extends Phaser.Group {
  public game2: Game;
  public updateOnlyAwakeChildren: boolean;

  constructor(game: Game) {
    super(game);
    this.game2 = game;
    this.updateOnlyExistingChildren = true;
    this.updateOnlyAwakeChildren = true;
  }

  public update() {
    //  Goes in reverse, because it's highly likely the child will destroy itself in `update`
    var i = this.children.length;

    while (i--)
    {
      var len = this.children.length;

      if (i >= len) { i = len - 1; }

      var child = this.children[i];

      if (child instanceof Sprite) {
        if (
          (! this.updateOnlyExistingChildren || child.exists) &&
          (! this.updateOnlyAwakeChildren || child.awake) ) {

          child.update();
        }
      }
    }
  }
}
