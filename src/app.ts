import 'pixi';
import 'p2';
import 'phaser';

if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  const game = new Phaser.Game('100%', '100%', Phaser.AUTO, '', {
    preload: () => { return; },
    create: () => {
      game.scale.pageAlignHorizontally = true;
      game.scale.pageAlignVertically = true;
      game.scale.scaleMode = Phaser.ScaleManager.RESIZE;

      var text = "Hello World!";
      var style = { font: "65px Arial", fill: "#ff0000", align: "center" };
      game.add.text(0, 0, text, style);
    },
    update: () => { return; }
  });
}
