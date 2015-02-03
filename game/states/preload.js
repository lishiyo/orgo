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
		this.load.image('player', 'assets/spaceships/playerShip1_orange.png');
		
		// Enemies
		this.load.spritesheet('enemy', 'assets/enemy.png', 56, 72);
		this.load.image('alienB1', 'assets/enemies/alienBlue_swim2.png');
		this.load.image('alienG1', 'assets/enemies/alienGreen_swim2.png');
		this.load.image('alienR1', 'assets/enemies/alienPink_swim2.png');
		this.load.image('alienB2', 'assets/enemies/enemyBlue2.png');
		this.load.image('alienG2', 'assets/enemies/enemyGreen2.png');
		this.load.image('alienR2', 'assets/enemies/enemyRed2.png');
		this.load.image('boss1', 'assets/enemies/boss/caffeine_pink_lg.png');
		this.load.image('boss2', 'assets/enemies/boss/aspirin_aqua.png');
		this.load.image('boss3', 'assets/enemies/boss/penicillin_yellow.png');
		
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
			
		// Defense Powers - shields for health and pills for additional life
		this.load.image('shield1', 'assets/powerups/defense/shield_bronze.png');
		this.load.image('shield2', 'assets/powerups/defense/shield_silver.png');
		this.load.image('shield3', 'assets/powerups/defense/shield_gold.png');
		this.load.image('pillB', 'assets/powerups/defense/pill_blue.png');
		this.load.image('pillG', 'assets/powerups/defense/pill_green.png');
		this.load.image('pillR', 'assets/powerups/defense/pill_red.png');
		
		// Weapons
		this.load.image('laser', 'assets/weapons/laser.png');
		this.load.image('laserB1', 'assets/weapons/laserBlue05.png');
		this.load.image('laserR1', 'assets/weapons/laserRed05.png');
		this.load.image('laserG1', 'assets/weapons/laserGreen09.png');
		this.load.image('laserB2', 'assets/weapons/laserBlue02.png');
		this.load.image('laserR2', 'assets/weapons/laserRed02.png');
		this.load.image('laserG2', 'assets/weapons/laserGreen04.png');
		this.load.image('laserB3', 'assets/weapons/laserBlue14.png');
		this.load.image('laserR3', 'assets/weapons/laserRed12.png');
		this.load.image('laserG3', 'assets/weapons/laserGreen06.png');
		
		// UI
		this.load.image('restartMenu', 'assets/ui/restart_metal.png');
		this.load.image('startButton', 'assets/ui/buttonStart.png');
		this.load.image('pauseButton', 'assets/ui/buttonPause_sm.png');
		this.load.image('scoreboard', 'assets/ui/glassPanel_100.png');
		this.load.image('gameover', 'assets/ui/gameover.png');
		this.load.image('starBasic', 'assets/misc/star.png');
		this.load.image('starBronze', 'assets/misc/starBronze_20.png');
		this.load.image('starSilver', 'assets/misc/starSilver_20.png');
		this.load.image('starGold', 'assets/misc/starGold_20.png');
		this.load.image('starDiamond', 'assets/misc/starDiamond.png');
		this.load.image('heart', 'assets/ui/hud_heartFull_small.png');
		this.load.image('pixel', 'assets/pixel.png');
		this.load.image('medalBronze', 'assets/ui/medalBronze_sm.png');
		this.load.image('medalSilver', 'assets/ui/medalSilver_sm.png');
		this.load.image('medalGold', 'assets/ui/medalGold_sm.png');
		
		// ITEMS/ACCESSORIES
		this.load.image('coin1', 'assets/items/coinBronze.png');
		this.load.image('coin2', 'assets/items/coinSilver.png');
		this.load.image('coin3', 'assets/items/coinGold.png');
		this.load.image('gemR1', 'assets/items/gemRed1.png');
		this.load.image('gemR2', 'assets/items/gemRed2.png');
		this.load.image('gemR3', 'assets/items/gemRed3.png');
		this.load.image('gemG1', 'assets/items/gemGreen1.png');
		this.load.image('gemG2', 'assets/items/gemGreen2.png');
		this.load.image('gemG3', 'assets/items/gemGreen3.png');
		this.load.image('gemB1', 'assets/items/gemBlue1.png');
		this.load.image('gemB2', 'assets/items/gemBlue2.png');
		this.load.image('gemB3', 'assets/items/gemBlue3.png');
		
		// Load sound effects
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
