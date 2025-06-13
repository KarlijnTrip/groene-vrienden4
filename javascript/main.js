class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  create() {
    this.scene.start('MenuScene');
  }
}



class NameScene extends Phaser.Scene {
  constructor() {
    super('NameScene');
  }

  create() {
    this.events.on('shutdown', this.shutdown, this);
this.events.on('destroy', this.destroy, this);
    this.cameras.main.setBackgroundColor('#a0d8f0'); // lichtblauwe achtergrond voor NameScene

 const tekst = this.add.text(0, 200, 'Voer je naam in:', {
  fontFamily: 'Verdana',
  fontSize: '24px',
  fill: '#000'
});
tekst.x = this.cameras.main.centerX - tekst.width / 2;
this.inputElement = document.createElement('input');
this.inputElement.type = 'text';
this.inputElement.placeholder = 'Naam';

this.inputElement.style.position = 'absolute';
this.inputElement.style.left = '50%';
this.inputElement.style.top = '50%';
this.inputElement.style.transform = 'translate(-50%, -50%)';
this.inputElement.style.fontSize = '20px';
this.inputElement.style.padding = '10px';
this.inputElement.style.borderRadius = '8px';
this.inputElement.style.border = '1px solid #ccc';
this.inputElement.style.zIndex = 10;

document.body.appendChild(this.inputElement);

    this.inputElement.style.fontSize = '20px';
this.inputElement.style.zIndex = 10;
this.inputElement.style.transform = 'translate(-50%, -50%)';
 const centerX = this.cameras.main.width / 2;
const origineleY = 500; // Of een andere vaste y-waarde die je wil behouden

const startKnop = this.add.text(centerX, origineleY, 'Doorgaan', {
  fontFamily: 'Verdana',
  fontSize: '24px',
  fill: '#000'
}).setInteractive().setOrigin(0.5, 0);  // Horizontaal centreren, bovenkant als y-origin
  


    startKnop.on('pointerdown', () => {
      const naam = this.inputElement.value.trim();
      if (naam.length > 0) {
        localStorage.setItem('spelerNaam', naam);
        this.inputElement.remove();

      

        this.scene.start("GameScene"); // Start direct met GameScene
      }
    });
  }

  // Verwijder input als scene wordt verlaten (voor veiligheid)
  shutdown() {
    if (this.inputElement) {
      this.inputElement.remove();
    }
  }
  // Ook evt. bij scene stoppen
  destroy() {
    if (this.inputElement) {
      this.inputElement.remove();
    }
  }
}

class MenuScene extends Phaser.Scene {
  constructor() {
    super('MenuScene');
  }
  create() {
       this.cameras.main.setBackgroundColor('#a0d8f0'); 
    this.add.text(this.scale.width / 2, 150, 'Dieren Vrienden',{
      fontFamily: 'Verdana',
      fontSize: '32px',
      fill: '#006400',
      fontStyle: 'bold',
    }).setOrigin(0.5);

   const centerX = this.cameras.main.centerX;

const naam = localStorage.getItem('spelerNaam') || 'Onbekend';
const uitlegTekst = `Welkom ${naam}! 

Om dit spel te spelen moet jij een dier zien te redden. 
Als je het dier hebt gevonden, moet je ook nog binnen de tijd het memoryspel oplossen. 
Daarna wordt het spel steeds moeilijker.

Zorg dat jij zo veel mogelijk dieren redt en probeer de highscore te halen!`;

this.add.text(centerX, 200, uitlegTekst, {
  fontFamily: 'Verdana',
  fontSize: '20px',
  fill: '#000',
  align: 'center',
  wordWrap: { width: 600 } // 👈 pas breedte aan aan jouw canvas
}).setOrigin(0.5, 0);


const highScore = this.getHighScore();
this.add.text(centerX, 480, `High score: ${highScore} dieren gered`, {
  fontFamily: 'Verdana',
  fontSize: '20px',
  fill: '#000'
}).setOrigin(0.5);

const startButton = this.add.text(centerX, 550, 'Start Spel', {
  fontFamily: 'Verdana',
  fontSize: '24px',
  fill: '#000',
}).setInteractive().setOrigin(0.5);

const leaderboardButton = this.add.text(centerX, 650, 'Bekijk Leaderboard', {
  fontFamily: 'Verdana',
  fontSize: '18px',
  fill: '#000',
}).setInteractive().setOrigin(0.5);


    startButton.on('pointerdown', () => {
      this.scene.start('NameScene'); // Start direct met NameScene
    });

    leaderboardButton.on('pointerdown', () => {
      this.scene.start('LeaderboardScene');
    });
  }

  getHighScore() {
    const dieren = JSON.parse(localStorage.getItem('gereddeDieren') || '[]');
    return dieren.length;
  }
}

class LeaderboardScene extends Phaser.Scene {
  constructor() {
    super('LeaderboardScene');
  }

 create() {
  this.cameras.main.setBackgroundColor('#a0d8f0');
  const centerX = this.cameras.main.centerX;

  this.add.text(centerX, 100, 'Leaderboard', {
    fontFamily: 'Verdana',
    fontSize: '28px',
    fill: '#000',
    fontStyle: 'bold'
  }).setOrigin(0.5);

  const leaderboard = JSON.parse(localStorage.getItem('leaderboard') || '[]');
  leaderboard.sort((a, b) => b.score - a.score);

  leaderboard.slice(0, 5).forEach((entry, index) => {
    this.add.text(centerX, 160 + index * 30, `${index + 1}. ${entry.naam} - ${entry.score}`, {
      fontFamily: 'Verdana',
      fontSize: '20px',
      fill: '#000'
    }).setOrigin(0.5);
  });

  this.input.once('pointerdown', () => {
    this.scene.start('MenuScene');
  });
}
}


class TimerScene extends Phaser.Scene {
  constructor() {
    super({ key: 'TimerScene' });
    this.tijdLimiet = 60;
    this.tijdOver = this.tijdLimiet;
  }

  create() {
    const padding = 20;
    this.tijdTekst = this.add.text(this.cameras.main.width - padding, padding, `Tijd: ${this.tijdOver}`, {
      fontFamily: 'Verdana',
      fontSize: '32px',
      fill: '#ff0000',
      align: 'right'
    }).setOrigin(1, 0).setScrollFactor(0);

    this.timerEvent = this.time.addEvent({
      delay: 1000,
      callback: this.updateTimer,
      callbackScope: this,
      loop: true
    });
  }

  updateTimer() {
    this.tijdOver--;
    console.log('Timer:', this.tijdOver);
    this.tijdTekst.setText(`Tijd: ${this.tijdOver}`);

    if (this.tijdOver <= 0) {
      console.log('Tijd is op, game over!');
      this.timerEvent.remove(false);

      // Stop GameScene en TimerScene
      this.scene.stop('GameScene');
      this.scene.stop('TimerScene');

      // Start GameOverScene
      this.scene.start('GameOverScene');
    }
  }

  resetTimer() {
    this.tijdOver = this.tijdLimiet;
    if (this.tijdTekst) this.tijdTekst.setText(`Tijd: ${this.tijdOver}`);
  }

  stopTimer() {
    if (this.timerEvent) {
      this.timerEvent.remove(false);
    }
  }
}


class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene');
    this.tijdLimiet = 60;
    this.jumpCount = 0;
    this.maxJumps = 3;
    this.animatiesAangemaakt = false;  // Flag om animaties maar één keer aan te maken
  this.hasJumped = false; // 👉 houdt bij of speler sprong

  }

  preload() {
    this.load.image('achtergrond', 'assets/images/background.png');
    this.load.image('platform', 'assets/images/platform.png');
    this.load.spritesheet('spelerloopt', 'assets/images/nieuwspeler.png', {
      frameWidth: 126,
      frameHeight: 130
    });

    for (let i = 1; i <= 23; i++) {
      this.load.image(`dier${i}`, `assets/images/dier${i}.png`);
    }
  }

create() {
  if (!this.animatiesAangemaakt) {
    this.maakAnimaties();
    this.animatiesAangemaakt = true;
  }

  const gereddeDieren = JSON.parse(localStorage.getItem('gereddeDieren') || '[]');
  this.moeilijkheid = gereddeDieren.length;

  this.scene.launch('TimerScene');
  this.scene.bringToTop('TimerScene');

  this.time.delayedCall(100, () => {
    const timerScene = this.scene.get('TimerScene');
    if (timerScene && timerScene.resetTimer) {
      timerScene.resetTimer();
    }
  });

  // Achtergrond met schaal
  const bg = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'achtergrond');
  bg.setDisplaySize(this.cameras.main.width, this.cameras.main.height);

  // Platformen op schaal
  this.platforms = this.physics.add.staticGroup();
const platform = this.platforms.create(
  this.cameras.main.width / 2,
  this.cameras.main.height - 20, // of 95% als je dat mooier vindt
  'platform'
);

// Breedte van canvas en originele platformbreedte
const canvasWidth = this.cameras.main.width;
const originalWidth = platform.displayWidth / platform.scaleX;

// Dynamisch schalen zodat het past
const scaleX = canvasWidth / originalWidth;

platform.setScale(scaleX, 1).refreshBody();

  this.platforms.create(this.cameras.main.width * 0.75, this.cameras.main.height * 0.65, 'platform');
  this.platforms.create(this.cameras.main.width * 0.15, this.cameras.main.height * 0.5, 'platform');
  this.platforms.create(this.cameras.main.width * 0.9, this.cameras.main.height