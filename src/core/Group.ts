import { Sprite } from './Sprite';
import { Game } from './Game';

export class Group extends Phaser.Group {
  public updateOnlyAwakeChildren: boolean;

  constructor(game: Game) {
    super(game);
    this.updateOnlyExistingChildren = true;
    this.updateOnlyAwakeChildren = true;
  }

  /**
   * Basically identical to Phaser's Group.update() method but we also skip update
   * of non-awake sprites.
   */
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
