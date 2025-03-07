import Phaser from 'phaser';
import { sizes } from '../gameConfig';

/**
 * @class GameOver
 * Die GameOver-Szene wird angezeigt, wenn das Spiel aufgrund von Aufbrauchen der Leben beendet wird,
 * oder wenn Spielende alle Quizfragen durchgespielt haben.
 */
class GameOver extends Phaser.Scene {
  constructor() {
    super("GameOver");
  }

  /**
   * Lädt die benötigten Bilder für die Szene.
   */
  preload() {
    this.load.spritesheet('itemsSpriteSheet', 'assets/kenney_pixel-platformer/Tilemap/tilemap_packed.png', {
      frameWidth: 18,
      frameHeight: 18
    });
    this.load.image('background', 'assets/kenney_pixel-platformer/Tiles/Backgrounds/tile_0015.png');
  }

   /**
   * Erstellt die GameOver Ansicht, die von dem Spielerfolg abhängig ist.
   */
  create() {
    // Hintergrund hinzufügen
    this.add.image(0, 0, 'background').setOrigin(0, 0).setScale(sizes.width / 24, sizes.height / 24);
    const winText = this.add.text(sizes.width / 2, 30, '', {fontSize: "25px", fontFamily: "monospace", color: "#000000"}).setOrigin(0.5, 0.5);

    if (this.registry.get("quizCompleted")) {
      this.anims.create({
        key: 'finishFlag',
        frames: this.anims.generateFrameNumbers('itemsSpriteSheet', { start: 111, end: 112 }),
        frameRate: 3,
        repeat: -1
      });
  
      const flagPole = this.add.image(sizes.width - 100, sizes.height, 'itemsSpriteSheet', 131).setScale(5).setOrigin(0.5, 1);
      this.finishFlagAnim = this.add.sprite(sizes.width - 100, sizes.height - (flagPole.height * flagPole.scaleY), 'itemsSpriteSheet', 111).setScale(5);
      this.finishFlagAnim.play('finishFlag');

      winText.setText('Du hast gewonnen!');
    } else {
      this.anims.create({
        key: 'lives_lost',
        frames: this.anims.generateFrameNumbers('itemsSpriteSheet', { start: 44, end: 46 }),
        frameRate: 1 ,
        repeat: -1
      });
      // leeres Herz (Leben) anzeigen
      const livesLostAnimation = this.add.sprite(sizes.width / 2, 200, 'itemsSpriteSheet', 44).setScale(5).setOrigin(0.5, 1);
      livesLostAnimation.play('lives_lost');
      winText.setText('Game Over!');
    }
    
    const points = this.registry.get('points');
    const text = `Punkte: ${points > 0 ? points : 0}`;
    this.add.text(sizes.width / 2, 80, text, {fontFamily: "monospace", fontSize: "25px", color: "#000000"}).setOrigin(0.5, 0.5);

    // Zeige Spielcharacter Animation wie in GameStart Szene
    this.playerAnim = this.add.sprite(sizes.width / 2, sizes.height, 'spriteSheet', 4).setScale(5).setOrigin(0.5, 1);
    this.playerAnim.play('player_walk');

    const playAgain = this.add.text(sizes.width / 2, sizes.height / 2, "Nochmal spielen", {
      fontFamily: "Arial",
      fontSize: "25px",
      color: "#fff",
      backgroundColor: '#4248f5',
      padding: { x: 20, y: 10 },
      align: 'center'
    })
    .setOrigin(0.5, 0.5)
    .setInteractive()

    playAgain.on('pointerdown', () => {
      this.scene.start("MainGame");
    })

    const newGame = this.add.text(sizes.width / 2, sizes.height / 2 + 60, "Ein anderes Quiz spielen", {
      fontFamily: "Arial",
      fontSize: "25px",
      color: "#fff",
      backgroundColor: '#4248f5',
      padding: { x: 20, y: 10 },
      align: 'center'
    })
    .setOrigin(0.5, 0.5)
    .setInteractive()

    newGame.on('pointerdown', () => {
      this.scene.start("GameStart");
    })
  }
}

export default GameOver;