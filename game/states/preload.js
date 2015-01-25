'use strict';
function Preload() {
  this.asset = null;
  this.ready = false;
}

Preload.prototype = {
  preload: function () {		
		var loadingLabel = this.add.text(this.game.world.centerX, 150, 'loading...', { font: '30px Arial', fill: '#ffffff' });
		loadingLabel.anchor.setTo(0.5, 0.5);

		// progress bar
		var progressBar = this.add.sprite(this.game.world.centerX, 200, 'progressBar');
		progressBar.anchor.setTo(0.5, 0.5);
		this.load.setPreloadSprite(progressBar);

		// Load all image assets
		this.load.spritesheet('mute', 'assets/muteButton.png', 28, 22);
		this.load.image('player', 'assets/player.png');
		this.load.image('pixel', 'assets/pixel.png');
		
		// Enemies
		this.load.spritesheet('enemy', 'assets/enemy.png', 56, 72);
		this.load.image('alienB1', 'assets/enemies/alienBlue_swim2.png');
		this.load.image('alienG1', 'assets/enemies/alienGreen_swim2.png');
		this.load.image('alienR1', 'assets/enemies/alienPink_swim2.png');
		this.load.image('alienB2', 'assets/enemies/enemyBlue2.png');
		this.load.image('alienG2', 'assets/enemies/enemyGreen2.png');
		this.load.image('alienR2', 'assets/enemies/enemyRed2.png');
		this.load.image('boss1', 'assets/enemies/alienYellow_jump.png');
		
		// Weapon Powerups - normal, star, bolt
		this.load.image('bonus', 'assets/bonus.png');
		this.load.image('powerupB1', 'assets/powerups/powerupBlue.png');
		this.load.image('powerupG1', 'assets/powerups/powerupGreen.png');
		this.load.image('powerupR1', 'assets/powerups/powerupRed.png');
		this.load.image('powerupB2', 'assets/powerups/powerupBlue_star.png');
		this.load.image('powerupG2', 'assets/powerups/powerupGreen_star.png');
		this.load.image('powerupR2', 'assets/powerups/powerupRed_star.png');
		this.load.image('powerupB3', 'assets/powerups/powerupBlue_bolt.png');
		this.load.image('powerupG3', 'assets/powerups/powerupGreen_bolt.png');
		this.load.image('powerupR3', 'assets/powerups/powerupRed_bolt.png');
		
		// Attack Powerups - star for speed
		this.load.image('speed1', 'assets/powerups/star_bronze.png');
		this.load.image('speed2', 'assets/powerups/star_silver.png');
		this.load.image('speed3', 'assets/powerups/star_gold.png');
		
		// Defense powers - shield for health and pills for extra life
		this.load.image('shieldBronze', 'assets/powerups/shield_bronze.png');
		this.load.image('shieldSilver', 'assets/powerups/shield_silver.png');
		this.load.image('shieldGold', 'assets/powerups/shield_gold.png');
		
		// Weapons
		this.load.image('laser', 'assets/weapons/laser.png');
		this.load.image('laserB1', 'assets/weapons/laserBlue08.png');
		this.load.image('laserR1', 'assets/weapons/laserRed08.png');
		this.load.image('laserG1', 'assets/weapons/laserGreen14.png');
		this.load.image('laserB2', 'assets/weapons/laserBlue02.png');
		this.load.image('laserR2', 'assets/weapons/laserRed02.png');
		this.load.image('laserG2', 'assets/weapons/laserGreen04.png');
		this.load.image('laserB3', 'assets/weapons/laserBlue14.png');
		this.load.image('laserR3', 'assets/weapons/laserRed12.png');
		this.load.image('laserG3', 'assets/weapons/laserGreen06.png');
		
		// pause button
		this.load.image('pauseMenu', 'assets/ui/pause-menu-6-btns.png');

		// Load all sound effects
		this.load.audio('takeBonus', ['assets/bonus.ogg', 'assets/bonus.mp3']);
		this.load.audio('fireSound', ['assets/bullet.ogg', 'assets/bullet.mp3']);
		this.load.audio('enemyDie', ['assets/die.ogg', 'assets/die.mp3']);
		this.load.audio('playerHit', ['assets/hit.ogg', 'assets/hit.mp3']);
	},

	create: function() { 
		this.game.state.start('menu');
	},
	
  update: function() {
    if(!!this.ready) { // if ready, start menu
      this.game.state.start('menu');
    }
  },
	
  onLoadComplete: function() {
    this.ready = true;
  }
};

module.exports = Preload;