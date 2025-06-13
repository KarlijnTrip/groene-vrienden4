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
    const centerX = this.cameras.main.centerX;

    this.cameras.main.setBackgroundColor('#a0d8f0');

    this.add.text(this.scale.width / 2, 150, 'Dieren Vrienden', {
      fontFamily: 'Verdana',
      fontSize: '32px',
      fill: '#006400',
      fontStyle: 'bold',
    }).setOrigin(0.5);

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
      wordWrap: { width: 600 }
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

    startButton.on('pointerdown', () => {
      this.scene.start('NameScene'); // Pas dit eventueel aan naar 'GameScene'
    });

    const leaderboardButton = this.add.text(centerX, 650, 'Bekijk Leaderboard', {
      fontFamily: 'Verdana',
      fontSize: '18px',
      fill: '#000',
    }).setInteractive().setOrigin(0.5);

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

  preload() {
    // Laad dieren afbeeldingen, net als in GameScene
    for (let i = 1; i <= 23; i++) {
      this.load.image(`dier${i}`, `assets/images/dier${i}.png`);
    }
  }

  create() {
     const centerX = this.cameras.main.centerX; 
  this.cameras.main.setBackgroundColor('#a0d8f0');

   // <-- HIER direct na setBackgroundColor

  // Haal naam en geredde dieren op uit localStorage
  const naam = localStorage.getItem('naam') || 'Onbekend';
  const gereddeDieren = JSON.parse(localStorage.getItem('gereddeDieren') || '[]');

  // Toon voortgang bovenaan
  this.add.text(centerX, 50, `Voortgang: ${naam} heeft ${gereddeDieren.length} dieren gered`, {
    fontFamily: 'Verdana',
    fontSize: '20px',
    fill: '#000'
  }).setOrigin(0.5);

  // Eventuele instructietekst
  this.add.text(centerX, 20, 'Bereik het dier om het te redden!', {
    fontFamily: 'Verdana',
    fontSize: '20px',
    fill: '#000'
  }).setOrigin(0.5);

  this.add.text(centerX, 100, 'Leaderboard', {
    fontFamily: 'Verdana',
    fontSize: '28px',
    fill: '#000',
    fontStyle: 'bold'
  }).setOrigin(0.5);

  let leaderboard = JSON.parse(localStorage.getItem('leaderboard') || '[]');
  leaderboard.sort((a, b) => b.score - a.score);

  const maxToShow = 5;
  leaderboard.slice(0, maxToShow).forEach((entry, index) => {
    const y = 160 + index * 80;

    // Naam en score
    this.add.text(centerX - 100, y, `${index + 1}. ${entry.naam} - ${entry.score}`, {
      fontFamily: 'Verdana',
      fontSize: '20px',
      fill: '#000'
    }).setOrigin(0, 0.5);

    // Geredde dieren tonen, als array aanwezig
    if (entry.gereddeDieren && entry.gereddeDieren.length > 0) {
      entry.gereddeDieren.forEach((dierIndex, i) => {
        this.add.image(centerX + 50 + i * 40, y, `dier${dierIndex}`).setScale(0.3).setOrigin(0.5);
      });
    } else {
      this.add.text(centerX + 50, y, 'Geen dieren', { fontSize: '16px', fill: '#555' }).setOrigin(0, 0.5);
    }
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
  this.platforms.create(this.cameras.main.width * 0.9, this.cameras.main.height * 0.35, 'platform');

  // Speler op schaal
  this.speler = this.physics.add.sprite(this.cameras.main.width * 0.1, this.cameras.main.height * 0.75, 'spelerloopt');
  this.speler.setBounce(0.2 + this.moeilijkheid * 0.05);
  this.speler.setCollideWorldBounds(true);
  this.physics.add.collider(this.speler, this.platforms);

  this.physics.world.gravity.y = 800 + (this.moeilijkheid * 50);

  this.cursors = this.input.keyboard.createCursorKeys();
  this.isJumping = false;
  this.hasPlayedLanding = false;

  // Dier op schaal
  this.dierIndex = Phaser.Math.Between(1, 23);
  this.dier = this.physics.add.sprite(this.cameras.main.width * 0.9, this.cameras.main.height * 0.2, `dier${this.dierIndex}`).setScale(0.5);
  this.dier.setBounce(0.5);
  this.physics.add.collider(this.dier, this.platforms);

  // Overlap etc. hetzelfde
  this.physics.add.overlap(this.speler, this.dier, () => {
    
    this.scene.stop('GameScene');
    this.scene.start('MemoryScene', { dierIndex: this.dierIndex });
  }, null, this);

  // Volgers
  this.volgers = this.physics.add.group();
  gereddeDieren.forEach((index, i) => {
    const volger = this.physics.add.sprite(this.speler.x - (i + 1) * 50, this.speler.y, `dier${index}`).setScale(0.5);
    volger.setCollideWorldBounds(true);
    this.physics.add.collider(volger, this.platforms);
    this.volgers.add(volger);

    this.speler.on('animationcomplete', (anim) => {
  if (anim.key === 'spring_start' || anim.key === 'spring_mid') {
    this.speler.anims.play('spring_end');
  }
});

  });
}

  maakAnimaties() {
    this.anims.create({ key: 'stil', frames: this.anims.generateFrameNumbers('spelerloopt', { start: 0, end: 0 }), frameRate: 10, repeat: -1 });
    this.anims.create({ key: 'rechts', frames: this.anims.generateFrameNumbers('spelerloopt', { start: 1, end: 4 }), frameRate: 10, repeat: -1 });
    this.anims.create({ key: 'links', frames: this.anims.generateFrameNumbers('spelerloopt', { start: 1, end: 4 }), frameRate: 10, repeat: -1 });
    this.anims.create({ key: 'spring_start', frames: this.anims.generateFrameNumbers('spelerloopt', { start: 12, end: 13 }), frameRate: 20, repeat: 0 });
    this.anims.create({ key: 'spring_mid', frames: this.anims.generateFrameNumbers('spelerloopt', { start: 14, end: 15 }), frameRate: 20, repeat: 0 });
    this.anims.create({ key: 'spring_end', frames: this.anims.generateFrameNumbers('spelerloopt', { start: 15, end: 17 }), frameRate: 20, repeat: 0 });
  }

  gameOver() {
    localStorage.removeItem('gereddeDieren');

    const timerScene = this.scene.get('TimerScene');
    if (timerScene) {
      timerScene.stopTimer();
      this.scene.stop('TimerScene');
    }

  this.scene.start('GameOverScene');

  }
update() {
  const speler = this.speler;
  const cursors = this.cursors;
  const snelheid = 160;
  const opDeGrond = speler.body.blocked.down || speler.body.touching.down;
  const inDeLucht = !opDeGrond;

  

  // Reset jump count bij landing
 if (opDeGrond && this.jumpCount > 0) {
  this.jumpCount = 0;
  this.hasJumped = false; // 🆕 reset vlag als speler landt
}


  // Springen
 if (cursors.up.isDown && Phaser.Input.Keyboard.JustDown(cursors.up) && this.jumpCount < this.maxJumps) {
  speler.setVelocityY(-600);
  this.jumpCount++;
  this.hasJumped = true; // 🆕 speler is nu gesprongen

  if (this.jumpCount === 1) {
    speler.anims.play('spring_start', true);
  } else {
    speler.anims.play('spring_mid', true);
  }
  return;
}


  // Als in de lucht en aan het vallen → spring_end
if (inDeLucht && speler.body.velocity.y > 0 && this.hasJumped) {
  if (speler.anims.currentAnim?.key !== 'spring_end') {
    speler.anims.play('spring_end');
  }
  return;

  }

  // Links / Rechts bewegen (alleen op de grond)
  if (cursors.left.isDown) {
    speler.setVelocityX(-snelheid);
    speler.setFlipX(true);

    if (opDeGrond && speler.anims.currentAnim?.key !== 'links') {
      speler.anims.play('links');
    }
  } else if (cursors.right.isDown) {
    speler.setVelocityX(snelheid);
    speler.setFlipX(false);

    if (opDeGrond && speler.anims.currentAnim?.key !== 'rechts') {
      speler.anims.play('rechts');
    }
  } else {
    speler.setVelocityX(0);

    if (opDeGrond && speler.anims.currentAnim?.key !== 'stil') {
      speler.anims.play('stil');
    }
  }

  // Volgers mee laten bewegen
  if (this.volgers) {
    this.volgers.children.iterate((volger) => {
      const afstand = speler.x - volger.x;
      const snelheidVolger = 100;
      volger.setVelocityX(Math.abs(afstand) > 10 ? (afstand > 0 ? snelheidVolger : -snelheidVolger) : 0);
      volger.setFlipX(afstand < 0);
      volger.setVelocityY(speler.body.velocity.y);
    });
  }
}
}

class MemoryScene extends Phaser.Scene {
  constructor() {
    super('MemoryScene');
    this.cards = [];
    this.flipped = [];
  
  }
  preload() {
    for (let i = 1; i <= 6; i++) {
      this.load.image('kaart' + i, `assets/images/kaart${i}.png`);
    }
    this.load.image('achterkant', 'assets/images/achterkant.png');
  }
  create(data) {
    this.cameras.main.setBackgroundColor('#a8d5a2'); // lichtgroen, rustgevend

    this.dierIndex = data.dierIndex;

    this.add.text(this.cameras.main.centerX, 50, 'Vind alle paren om het dier te redden!Klik op de vierkantjes om de kaart om te draaien', {
  fontFamily: 'Verdana',
  fontSize: '22px',
  fill: '#000'
}).setOrigin(0.5);


  const moeilijkheid = JSON.parse(localStorage.getItem('gereddeDieren') || '[]').length;
let aantalParen = 3 + Math.min(moeilijkheid, 3);
const beschikbareKaarten = ['kaart1', 'kaart2', 'kaart3', 'kaart4', 'kaart5', 'kaart6'];
const gekozenKaarten = Phaser.Utils.Array.Shuffle(beschikbareKaarten).slice(0, aantalParen);
let kaarten = gekozenKaarten.concat(gekozenKaarten);this.aantalParen = aantalParen;
Phaser.Utils.Array.Shuffle(kaarten);

   const cols = 4;
const spacingX = 150;
const spacingY = 220;
const kaartBreedte = 100; // schatting
const kaartHoogte = 120;  // schatting

const totalWidth = (cols - 1) * spacingX + kaartBreedte;
const rows = Math.ceil(kaarten.length / cols);
const totalHeight = (rows - 1) * spacingY + kaartHoogte;

const startX = this.cameras.main.centerX - totalWidth / 2 + kaartBreedte / 2;
const startY = this.cameras.main.centerY - totalHeight / 2 + kaartHoogte / 2;

this.matchedCount = 0;

  kaarten.forEach((key, i) => {
  const x = startX + (i % cols) * spacingX;
  const y = startY + Math.floor(i / cols) * spacingY;
  const kaart = this.add.sprite(x, y, 'achterkant').setInteractive();
kaart.setScale(0.1);
  kaart.cardKey = key;
  kaart.isFlipped = false;
  this.cards.push(kaart);

  kaart.on('pointerdown', () => {
  if (this.flipped.length < 2 && !kaart.isFlipped) {
    this.flipCard(kaart);
  }
  });
});
  }

  update() {
  const timerScene = this.scene.get('TimerScene');
  if (timerScene && timerScene.tijdOver <= 0) {
    console.log('Tijd is op, game over!');
    this.scene.stop('TimerScene');
    this.scene.start('GameOverScene');
  }
}
flipCard(kaart) {
  kaart.setTexture(kaart.cardKey);
  kaart.setScale(1);   // hier op goede grootte
  kaart.isFlipped = true;
  this.flipped.push(kaart);

  if (this.flipped.length === 2) {
    this.time.delayedCall(1000, () => this.checkMatch());
  }
}


checkMatch() {
  const [kaart1, kaart2] = this.flipped;

  // Extra beveiliging
  if (!kaart1 || !kaart2) {
    console.warn('Er is een kaart niet beschikbaar bij match check');
    this.flipped = [];
    return;
  }

  if (kaart1.cardKey === kaart2.cardKey) {
    this.matchedCount++;
    kaart1.disableInteractive();
    kaart2.disableInteractive();

    if (this.matchedCount === this.aantalParen) {
      this.succes();
    }
  } else {
    kaart1.setTexture('achterkant');
    kaart1.setScale(0.1);
    kaart1.isFlipped = false;

    kaart2.setTexture('achterkant');
    kaart2.setScale(0.1);
    kaart2.isFlipped = false;
  }

  this.flipped = [];
}


succes() {
  console.log('Memory gehaald, naar ResultaatScene...');

  let gereddeDieren = JSON.parse(localStorage.getItem('gereddeDieren') || '[]');
  if (!Array.isArray(gereddeDieren)) gereddeDieren = [];

  if (typeof this.dierIndex === 'number') {
    gereddeDieren.push(this.dierIndex);
  }

  localStorage.setItem('gereddeDieren', JSON.stringify(gereddeDieren));

  // ✅ Stop de timer
 const timerScene = this.scene.get('TimerScene');
if (timerScene) {
  timerScene.stopTimer();
  this.scene.stop('TimerScene');
}


  // ✅ Ga direct naar ResultaatScene
  this.scene.start('ResultaatScene', { succes: true });
}
}


class GameOverScene extends Phaser.Scene {
  constructor() {
    super('GameOverScene');
  }

  create() {
    this.cameras.main.setBackgroundColor('#ffcccc');

        localStorage.setItem('gereddeDieren', JSON.stringify([])); // r

    const centerX = this.cameras.main.centerX;
    const centerY = this.cameras.main.centerY;

    this.add.text(centerX, centerY - 50, 'Game Over', {
      fontFamily: 'Verdana',
      fontSize: '48px',
      fill: '#900'
    }).setOrigin(0.5);

    this.add.text(centerX, centerY + 20, 'Klik om terug naar menu te gaan', {
      fontFamily: 'Verdana',
      fontSize: '24px',
      fill: '#000'
    }).setOrigin(0.5);

    this.input.once('pointerdown', () => {
      // reset globale score variabele
      window.score = 0;  // of waar je score ook staat opgeslagen
      this.scene.start('MenuScene');
    });
  }
}
class TussenScene extends Phaser.Scene {
  constructor() {
    super('TussenScene');
  }

  create() {
    this.cameras.main.setBackgroundColor('#a0d8f0');

    const centerX = this.cameras.main.centerX;
    const gereddeDieren = JSON.parse(localStorage.getItem('gereddeDieren') || '[]');
    const spelerNaam = localStorage.getItem('spelerNaam') || 'Onbekend';

    this.add.text(centerX, 150, `Je hebt nu ${gereddeDieren.length} dieren gered!`, {
      fontFamily: 'Verdana',
      fontSize: '26px',
      fill: '#000'
    }).setOrigin(0.5);

    let leaderboard = JSON.parse(localStorage.getItem('leaderboard') || '[]');
    const score = gereddeDieren.length;

    const bestaande = leaderboard.find(entry => entry.naam === spelerNaam);

    if (bestaande) {
      if (score > bestaande.score) {
        bestaande.score = score;
        bestaande.gereddeDieren = gereddeDieren; // ✅ voeg toe
      }
    } else {
      leaderboard.push({
        naam: spelerNaam,
        score: score,
        gereddeDieren: gereddeDieren // ✅ voeg toe
      });
    }

    // Sorteer op score (hoog naar laag)
    leaderboard.sort((a, b) => b.score - a.score);

    // ✅ Opslaan naar localStorage
    localStorage.setItem('leaderboard', JSON.stringify(leaderboard));

    // Knop om verder te gaan
    const doorgaan = this.add.text(centerX, 300, 'Ga verder', {
      fontFamily: 'Verdana',
      fontSize: '24px',
      fill: '#000',
      backgroundColor: '#fff',
      padding: { x: 10, y: 5 },
      borderRadius: 5
    }).setOrigin(0.5).setInteractive();

    doorgaan.on('pointerdown', () => {
      this.scene.start('GameScene'); // Volgende ronde
    });
  }
}

class ResultaatScene extends Phaser.Scene {
  constructor() {
    super('ResultaatScene');
  }

  create(data) {
    this.cameras.main.setBackgroundColor('#a0d8f0');
    const succes = data.succes;
    const centerX = this.cameras.main.centerX;

    if (succes) {
      const gereddeDieren = JSON.parse(localStorage.getItem('gereddeDieren') || '[]');
      const level = gereddeDieren.length;
      const spelerNaam = localStorage.getItem('spelerNaam') || 'de speler';

      this.add.text(centerX, 120, '🎉 Hoera! Je hebt een dier gered!', {
        fontFamily: 'Verdana',
        fontSize: '26px',
        fill: '#006400'
      }).setOrigin(0.5);

      this.add.text(centerX, 170, `Level ${level} bereikt!`, {
        fontFamily: 'Verdana',
        fontSize: '22px',
        fill: '#000'
      }).setOrigin(0.5);

      // ✅ Impacttekst tonen
      const impactTeksten = [
        `Dankzij jou, ${spelerNaam}, blijft de natuur in balans!`,
        `Fantastisch gedaan! Elk dier dat jij redt helpt de planeet.`,
        `Je maakt het verschil voor het ecosysteem, ${spelerNaam}!`,
        `Topper! Zonder dieren zoals deze raakt de natuur uit balans.`,
        `Elk gered dier helpt de biodiversiteit. Goed gedaan, ${spelerNaam}!`
      ];
      const gekozenImpact = Phaser.Utils.Array.GetRandom(impactTeksten);

      this.add.text(centerX, 210, gekozenImpact, {
        fontFamily: 'Verdana',
        fontSize: '20px',
        fill: '#000',
        align: 'center',
        wordWrap: { width: 600 }
      }).setOrigin(0.5);

      // Knop: volgende dier
      const verderKnop = this.add.text(centerX, 290, 'Volgende dier redden', {
        fontFamily: 'Verdana',
        fontSize: '22px',
        fill: '#000'
      }).setInteractive().setOrigin(0.5);

      verderKnop.on('pointerdown', () => {
        this.scene.start('TussenScene');
      });

    } else {
      // Als speler niet op tijd was
      this.add.text(this.scale.width / 2, 150, '😢 Helaas, je was niet op tijd!', {
        fontFamily: 'Verdana',
        fontSize: '26px',
        fill: '#ff0000'
      }).setOrigin(0.5);

      const opnieuwKnop = this.add.text(this.scale.width / 2, 280, 'Probeer opnieuw', {
        fontFamily: 'Verdana',
        fontSize: '22px',
        fill: '#000'
      }).setInteractive().setOrigin(0.5);

      opnieuwKnop.on('pointerdown', () => {
        this.scene.start('NameScene');
      });
    }

    // In beide gevallen: Stoppen-knop
    const stopKnop = this.add.text(this.scale.width / 2, 340, 'Stoppen', {
      fontFamily: 'Verdana',
      fontSize: '20px',
      fill: '#000'
    }).setInteractive().setOrigin(0.5);

    stopKnop.on('pointerdown', () => {
      this.scene.start('MenuScene');
    });
  }
}


const config = {
  type: Phaser.AUTO,
  scale: {
    mode: Phaser.Scale.RESIZE, // Maakt het scherm responsief
    autoCenter: Phaser.Scale.CENTER_BOTH // Centreert canvas
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 800 },
      debug: false
    }
  },
  scene: [
    BootScene, NameScene, MenuScene, GameScene, GameOverScene,
    MemoryScene, LeaderboardScene, TussenScene, TimerScene, ResultaatScene
  ],
  audio: {
    noAudio: true
  }
};

const game = new Phaser.Game(config);
