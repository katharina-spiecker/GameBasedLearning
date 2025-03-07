import Phaser from 'phaser';
import { sizes } from '../gameConfig';

/**
 * @class MainGame
 * Die Hauptszene des Spiels.
 */
class MainGame extends Phaser.Scene {
  constructor() {
    super("MainGame");
  }

  /**
   * Lädt alle benötigten Ressourcen für die Szene.
   */
  preload() {
    // Laden von Audio-Dateien für Soundeffekte
    this.load.audio("coinSound", "assets/audio/kenney_music_jingles/jingles_STEEL16.ogg");
    this.load.audio("winSound", "assets/audio/kenney_music_jingles/jingles_STEEL02.ogg");
    this.load.audio("gameOverSound", "assets/audio/kenney_music_jingles/jingles_PIZZI07.ogg");
    this.load.audio("backgroundMusic", "assets/audio/jdsherbert/cosmic-star.ogg");
    this.load.audio("wrongAnswerSound", "assets/audio/kenney_sci-fi-sounds/Audio/impactMetal_002.ogg");
    this.load.audio("alienLanding", "assets/audio/kenney_sci-fi-sounds/Audio/doorOpen_001.ogg");
    // Laden von Spritesheet mit Bildern der Spielobjekte
    this.load.spritesheet('itemsSpriteSheet', 'assets/kenney_pixel-platformer/Tilemap/tilemap_packed.png', {
      frameWidth: 18,
      frameHeight: 18
    });
    // Laden der Hintergrundbildern
    this.load.image('tilesBg', 'assets/kenney_pixel-platformer/Tilemap/tilemap-backgrounds_packed.png');
    // Laden der Avatar-Bilder
    this.load.spritesheet('spriteSheet', 'assets/kenney_pixel-platformer/Tilemap/tilemap-characters_packed.png', {
      frameWidth: 24, 
      frameHeight: 24
    });
    // Laden der Levelkarten im JSON-Format
    this.load.tilemapTiledJSON('level-1', 'assets/tilemaps/level-1.tmj');
    this.load.tilemapTiledJSON('level-2', 'assets/tilemaps/level-2.tmj');
    this.load.tilemapTiledJSON('level-3', 'assets/tilemaps/level-3.tmj');
  }

  /**
   * Initialisiert Szeneneigenschaften, erstellt Spielobjekte für die Szene.
   * Diese Methode wird einmal zu Beginn der Szene aufgerufen nachdem alle Assets geladen wurden.
   */
  create() {
    // Initialisierung des Spielstatus.
    this.registry.set("points", 0); // Speicherung der Punkteanzahl im registry damit Szenen übergreifender Zugriff
    this.lives = 3; // Lebenanzahl
    this.currentQuizIndex = 0; // Quiz Array wird von Anfang an durchlaufen
    this.tilemapKeys = ['level-1', 'level-2', 'level-3']; // Auswahl an drei Landschaften
    this.pointsDecreaseBlocked = false; // Flag Variable fürs Punkte abziehen

    // Audio-Effekte hinzufügen
    this.addSounds();
    this.backgroundMusic.play();

    // Player und Spiellandschaft hinzufügen
    this.addPlayer();
    this.addMap(); // Erstellt Spielwelt basierend auf Tilemap
    // verschiebe Player hinter den foregroundLayer
    this.children.moveTo(this.player, this.children.getIndex(this.foregroundLayer) - 1);

    // Quiz hinzufügen
    this.quizWrapperElement = document.getElementById("quiz");
    this.questionElement = document.getElementById("quiz-question");
    this.answersElement = document.getElementById("quiz-answers");
    this.quizWrapperElement.style.display = "block";
    // initialisiert das Quiz mit den Werten, die in der Startszene geladen wurden
    this.quiz = this.registry.get("quiz");
    // erstellt eine Gruppe für die statischen Antwortboxen im Spiel
    this.answerObjects = this.physics.add.staticGroup();
    // sorgt für Anzeige des Quizzes und Integration in den Antwortboxen
    this.updateQuiz();

    // auf User Eingaben zu hören
    this.cursor = this.input.keyboard.createCursorKeys();

    // Anzeige des Spielstatus
    this.livesDisplay = this.add.sprite(sizes.width - 30, 10, 'itemsSpriteSheet', 44).setOrigin(0.5, 0).setScale(2).setScrollFactor(0);
    this.diamondDisplay = this.add.sprite(sizes.width - 70, 10, 'itemsSpriteSheet', 67).setOrigin(0.5, 0).setScale(2).setScrollFactor(0);
    this.pointsDisplay = this.add.text(sizes.width - 100, 13, "0", {font: "28px Arial", fill: "#000000"}).setOrigin(0.5, 0).setScrollFactor(0);
    
    // Effekt wenn Punkte gesammelt
    this.diamondEmitter = this.add.particles(0, 0, 'itemsSpriteSheet', {
      frame: 67,
      speed: 100,
      gravity: 50,
      scale: 2,
      duration: 100,
      emitting: false
    });
    this.diamondEmitter.startFollow(this.player, 10, 10, true);

    // Kamera- und Spielfeldbegrenzungen festlegen
    this.cameras.main.setScroll(0, 0); // setze Anfangsposition von Kamera oben links damit das gesamte Spiel sichtbar ist
    this.cameras.main.startFollow(this.player, true, 1, 0, -150, 0);
    this.setCameraAndWorldBounds();
  }

  /**
   * Wird kontinuierlich aufgerufen, um den Zustand des Spiels zu aktualisieren.
   * Aktualisiert die Bewegung des Spielers basierend auf den Benutzereingaben.
   */
  update() {
    if (this.cursor.up.isDown) {
      this.player.setVelocityY(-this.playerSpeedUp); // Bewegen nach oben
    } else if (this.cursor.down.isDown) {
      this.player.setVelocityY(this.playerSpeedDown); // Bewegen nach unten
    } else if (this.cursor.right.isDown) {
      this.player.setVelocityX(this.playerSpeedX); // nach rechts bewegen
    } else if (this.cursor.left.isDown) {
      this.player.setVelocityX(-this.playerSpeedX); // nach links bewegen
    } else {
       // falls Avatar im Wasser ist, treibe nach links
      if (this.player.y > sizes.height - 72) {
        this.player.setVelocityX(-50);
      } else {
        this.player.setVelocityX(this.player.body.velocity.x * 0.9); // langsames Anhalten
      }
    }
  }

  /**
   * Beendet das Spiel und wechselt zur die GameOver-Szene an.
   */
  gameOver() {
    if (this.registry.get("quizCompleted")) {
      this.winSound.play();
    } else {
      this.gameOverSound.play();
    }
    // Verzögert den Spielende-Prozess um 1 Sekunde
    this.time.delayedCall(1000, () => {
      // Leert und versteckt die Quizanzeige
      this.questionElement.innerText = "";
      this.answersElement.innerText = "";
      this.quizWrapperElement.style.display = "none";
      // stoppt Audio
      this.sound.stopAll();
      // wechselt zur GameOver-Szene
      this.scene.start('GameOver');
    }, [], this);
  }

  /**
   * Fügt Avatar hinzu und konfiguriert dessen Eigenschaften.
   */
  addPlayer() {
    // Definiert die Geschwindigkeit des Spielers in verschiedene Richtungen
    this.playerSpeedUp = 200;
    this.playerSpeedDown = 100;
    this.playerSpeedX = 150;

    // Erstellt den Avatar
    this.player = this.physics.add.sprite(sizes.width / 3, 0, 'spriteSheet', 4); // Extract character at frame 1
    this.player.setOrigin(0.5, 0.5).setScale(2);
    this.player.play('player_walk'); // Startet die Laufanimation
    this.player.setBounce(0.5); // wie stark Player zurückprallen (bounce) soll bei Zusammenstoß mit Objekten
    this.player.setImmovable(true); // verhindert, dass die Kollision den Avatar sobald Bounce vorbei ist bewegt
    this.player.setSize(20, 20); // macht Kollisionsbox kleiner als player
    
    // Begrenzt die Bewegung des Avatars auf die Spielwelt
    this.player.setCollideWorldBounds(true);
    this.physics.world.setBoundsCollision(true, true, false, true);
    // Musik abspielen, sobald Avatar hinzugefügt wurde
    this.alienLanding.play();
  }

  /**
   * Aktualisiert das angezeigt Quiz.
   */
  updateQuiz() {
    // die aktuelle Multiple-Choice-Frage des Quizzes
    const currentQuiz = this.quiz[this.currentQuizIndex];
    // setzt die Frage des aktuellen Quiz in das DOM-Element für die Frage
    this.questionElement.innerText = currentQuiz.question;
    // löscht vorherigen Inhalt der Antwortmöglichkeiten
    this.answersElement.innerText = "";
    // fügt die Antwortmöglichkeiten als Paragraphen (p-Elemente) in das DOM ein
    for (let i = 0; i < currentQuiz.answers.length; i++) {
      const pElement = document.createElement("p");
      pElement.innerText = `${i + 1}) ${currentQuiz.answers[i].text}`;
      this.answersElement.appendChild(pElement);
    }
    // erstelle die Antwortboxen
    this.addAnswerBoxes(currentQuiz.answers);
  }

  /**
   * Verknüpft Antwortmöglichkeiten mit Antwortboxen.
   * Erstellt maximal vier Boxen basierend auf den vorgegeben Stellen des Object-Layers der Tilemap.
   * 
   * @param {Array} answerOptions Antwortmöglichkeiten als Array aus Objekten
   */
  addAnswerBoxes(answerOptions) {
    // holt die Objekte aus der Objekt-Schicht der Map, die ID === 10 haben
    let boxesArr = this.map.getObjectLayer('Objects').objects.filter(object => object.gid === 10);

    // Definiert den Index des ersten Bildes auf dem Spritesheet (für die Zahl 1)
    let imageIndex = 161;

    // Geht durch die Antwortmöglichkeiten des aktuellen Quiz und erstellt Boxen für jede Antwort
    for (let i = 0; i < answerOptions.length; i++) {
        let currentBox = boxesArr[i];
        // x muss verschoben werden um Endless-Runner-Effekt zu erhalten
        let xPosition = (sizes.width * this.currentQuizIndex) + currentBox.x * 2;
        let yPosition = currentBox.y * 2;
        // erstelle Boxinhalt je nachdem ob richtige oder falsche Antwort
        let bomb = null;
        let answerIsCorrect = answerOptions[i].correct;
        if (!answerIsCorrect) {
          // Frame 8 enthält Bild der Bombe
          bomb = this.answerObjects.create(xPosition, yPosition, 'spriteSheet', 8).setOrigin(0, 1).setScale(1.5);
        } 
        // erstelle Antwortbox
        const answerBox = this.answerObjects
          .create(xPosition, yPosition, "itemsSpriteSheet", 9) // Frame 9 enthält Box
          .setOrigin(0, 1)
          .setScale(2)
          .setSize(32, 32)
          .setOffset(8, -26);
        // fügt Zahlbild hinzu
        const answerOption = this.answerObjects.create(xPosition, yPosition, 'itemsSpriteSheet', imageIndex).setOrigin(0, 1).setScale(2);
        // nächste Antwort kriegt nächstes Bild (sind in dem Spritesheet aufsteigend sortiert)
        imageIndex++;
        // fügt Overlap Erkennung mit Avatar hinzu
        this.physics.add.overlap(this.player, answerBox, () => this.onCollideWithAnswer(answerBox, answerIsCorrect, answerOption, bomb), null, this);
    }
  }

  /**
   * Funktion wird Zusammenstoß von Avatar mit Antwortbox aufgerufen.
   * Sie überprüft ob es die richtige oder falsche Antwortbox war und aktualisiert
   * Punktestand und Lebenanzahl entsprechend.
   * darauf Logik aus.
   * 
   * @param {Object} answerBox Spielobjekt, welches ein Bild der Box darstellt.
   * @param {boolean} answerIsCorrect Sagt aus, ob Antwortoption korrekt ist.
   * @param {Object} answerOption Spielobjekt, welches ein Bild der Zahl darstellt.
   * @param {Object | null} bomb Spielobjekt, welches ein Bild einer Bombe anzeigt.
   */
  onCollideWithAnswer(answerBox, answerIsCorrect, answerOption, bomb) {
    if (answerIsCorrect) {
      // lösche alle Antwortboxen
      this.answerObjects.clear(true, true);
      // signalisiere Erfolg mit Musik und Emitter Effekt
      this.diamondEmitter.explode(10);
      this.coinSound.play();

      // erhöhe den Punktestand
      let newPoints = this.registry.get("points") + 5;
      this.registry.set("points", newPoints);
      this.pointsDisplay.setText(newPoints);

      // erhöhe den Quiz-Index
      this.currentQuizIndex++;
      // Quiz durchgespielt ?
      if (this.currentQuizIndex < this.quiz.length) {
        this.transitionToNewLevel();
      } else {
        this.registry.set("quizCompleted", true);
        this.gameOver();
      }
    } else {
      const newLivesCount = this.lives - 1;
      this.lives = newLivesCount;
      if (newLivesCount == 2) {
        this.livesDisplay.setTexture('itemsSpriteSheet', 45);
      } else if (newLivesCount == 1) {
        this.livesDisplay.setTexture('itemsSpriteSheet', 46);
      }
      if (newLivesCount === 0) {
        this.registry.set("quizCompleted", false);
        this.gameOver();
      }
      // verstecke das Sprite sobald animation fertig
      this.wrongAnswerSound.play();
      // lösche falsche Antwortbox und Zahl, Bombe bleibt in der Spielwelt
      answerOption.destroy();
      answerBox.destroy();
      // falls Avatar Bombe nochmal berührt: Punktabzug
      this.physics.add.overlap(this.player, bomb, this.losePoints, null, this);
    }
  }

  /**
   * Zieht Punkte ab und aktualisiert Punktestandanzeige.
   */
  losePoints() {
    this.wrongAnswerSound.play();
    // innerhalb der nächsten 3 Sekunden werden nur einmal Punkte abgezogen damit Spieler Zeit hat Position zu verändern
    if (!this.pointsDecreaseBlocked) {
      const newPoints = this.registry.get("points") - 2;
      this.registry.set("points", newPoints);
      this.pointsDisplay.setText(newPoints);
      this.pointsDecreaseBlocked = true;
      this.time.addEvent({
        delay: 3000, // 3 Sekunden
        callback: () => { this.pointsDecreaseBlocked = false }, // setzt Flagvariable
        callbackScope: this // callback scope
      });
    }
    
  }

  /**
   * Schaltet den nächsten Bereich der Spielwelt frei indem der Bereich wird neu erstellt.
   * Da der neue Bereich automatisch vor existierende Spielobjekte erscheint, werden die Layers neu angeordnet.
   */
  transitionToNewLevel() {
    this.addMap();
    // Da Layers neu hinzugefügt, sind sie jetzt alle vor Player
    this.children.moveTo(this.backgroundLayer, 0);
    this.children.moveTo(this.landscapeLayer, 1);
    this.children.moveTo(this.foregroundLayer, this.children.getIndex(this.player) + 1);

    this.updateQuiz();
    this.setCameraAndWorldBounds();
  }

   /**
   * Erstellt die Spiellandschaft bestehend aus Hintergrundlayer, Landschaftslayer, Vordergrundlayer und Stacheln
   * und fügt Kollisionserkennung hinzu. Spiellandschaft wird zufällig aus einer von drei vorhandenen Tilemaps ausgewählt.
   */
  addMap() {
    // wählt eine zufällige Landschaft aus
    const randomMapKey = this.tilemapKeys[Math.floor(Math.random() * this.tilemapKeys.length)];

    this.map = this.make.tilemap({key: randomMapKey});
    // Argumente: name der in Tiled verwendet wurde, key der in preload
    const tileset = this.map.addTilesetImage('tileset', 'itemsSpriteSheet');
    const backgroundTileset = this.map.addTilesetImage('background', 'tilesBg');

    const offsetX = this.currentQuizIndex * sizes.width;
    // erstellt Layers. 1. Argument ist der Name des Layers wie in Tiled
    this.backgroundLayer = this.map.createLayer("Background", backgroundTileset, offsetX).setScale(2);
    this.landscapeLayer = this.map.createLayer("Landscape", tileset, offsetX).setScale(2).setCollision([42, 43, 44, 48, 49, 50, 51, 61, 62, 63, 64], true);
    this.foregroundLayer = this.map.createLayer("Foreground", tileset, offsetX).setScale(2);
    // erstellt Stacheln
    this.spikeGroup = this.physics.add.group({immovable: true, allowGravity: false});
    this.map.getObjectLayer('Objects').objects.forEach(object => {
      if (object.gid === 69) {
        // berechne x und y position
        let xPosition = (sizes.width * this.currentQuizIndex) + object.x * 2;
        let yPosition = object.y * 2;

        this.spikeGroup
          .create(xPosition, yPosition, "itemsSpriteSheet", object.gid - 1) // ziehe 1 ab da frames 0 indexed
          .setOrigin(0, 1) 
          .setScale(2)
          .setSize(18, 8) // da Stacheln nicht die ganze Kachel füllen
          .setOffset(0, 10)
      }
    })

    // fügt eine Kollision zwischen Avatar und den Plattformen hinzu
    this.physics.add.collider(this.player, this.landscapeLayer);
    // fügt eine Überlappungserkennung zwischen dem Spieler und den Stacheln hinzu.
    this.physics.add.overlap(this.player, this.spikeGroup, this.losePoints, null, this);
  }

  /**
  * Setzt die Grenzen der Kamera und der Spielwelt basierend auf der aktuellen Quiz-Index-Position.
  */
  setCameraAndWorldBounds() {
    this.cameras.main.setBounds(0, 0, (this.currentQuizIndex + 1) * sizes.width, sizes.height);
    this.physics.world.setBounds(0, 0, sizes.width * (this.currentQuizIndex + 1), sizes.height - 15);
  }

  /**
   * Registriert die verschiedenen Soundeffekte zur Nutzung im Spiel.
   */
  addSounds() {
    this.coinSound = this.sound.add("coinSound");
    this.wrongAnswerSound = this.sound.add("wrongAnswerSound");
    this.alienLanding = this.sound.add("alienLanding");
    this.winSound = this.sound.add("winSound");
    this.backgroundMusic = this.sound.add("backgroundMusic", {loop: true});
    this.gameOverSound = this.sound.add("gameOverSound");
  }
}

export default MainGame;