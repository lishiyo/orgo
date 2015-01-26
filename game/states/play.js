'use strict';

var Scoreboard = require('../prefabs/scoreboard');
var Player = require('../prefabs/player');
var EnemyGroup = require('../prefabs/enemyGroup');


function Play() {};

Play.prototype = {
	create: function() {
		/* --- Display the labels on the screen --- */
		this.displayLabels();
		
		/* --- Add all sprites/groups --- */

		// Create the enemy group
		this.enemies = new EnemyGroup({ key: 'enemy' }, this.game);
		this.game.add.existing(this.enemies);
		
		// Create the laser group with default laser
		this.lasers = this.game.add.group();
		this.lasers.enableBody = true;	
		this.lasers.createMultiple(50, 'laser');
		
		// Create the player
		this.player = new Player({ 
			arrowKeys: this.arrowKeys
		}, this.game, this.game.world.centerX, 450);
		this.game.add.existing(this.player);
		
		// Create default powerups
		this.powerups = this.game.add.group();
		this.powerups.enableBody = true;
		this.createPowerUps(1);

		/* --- Initialise emitters --- */

		// Add a starfield to the background of the game
		var startEmitter = this.game.add.emitter(this.game.world.centerX, 0, 200);
		startEmitter.alpha = 0.8;
		startEmitter.width = this.game.world.width;
		startEmitter.makeParticles('pixel');
		startEmitter.setYSpeed(100, 300);
		startEmitter.setXSpeed(0, 0);
		startEmitter.minParticleScale = 0.3;
		startEmitter.maxParticleScale = 0.8;
		startEmitter.minRotation = 0;
		startEmitter.maxRotation = 0;
		startEmitter.gravity = 0;
		startEmitter.start(false, 7000, 100, 0);	

		// Init emitter for enemy explosions
		this.explosionEmitter = this.game.add.emitter(0, 0, 50);
		this.explosionEmitter.makeParticles('pixel');
		this.explosionEmitter.setYSpeed(-150, 150);
		this.explosionEmitter.setXSpeed(-150, 150);
		this.explosionEmitter.gravity = 0;

		/* --- Initialise variables --- */

		// clicking mouse or pressing enter pauses game
		this.game.input.onDown.add(this.pauseGame, this);
		this.pauseKey = this.game.input.keyboard
			 .addKey(Phaser.Keyboard.ENTER);
		this.game.paused = false;
		
		// starting variables
		this.lives = this.game.global.lives;
		this.game.global.score = 0;
		this._nextLaserTime = 0;
		this._nextEnemyTime = 0;
		this._oldEnemyLevel = 1;
		this._currEnemyLevel = 1;
		this._colors = ["B", "G", "R"];
	
// 		this.bonus = 1;
		this._oldPowerLevel = 1;
		this._currPowerLevel = 1;
		
		// Add sounds
		this.bonusSound = this.game.add.audio('takeBonus');
		this.dieSound = this.game.add.audio('enemyDie');
		this.hitSound = this.game.add.audio('playerHit');

		// Create new powerup every 8 seconds
		this.game.physics.setBoundsToWorld();
		this.game.time.events.loop(8000, this.newPowerUp, this);
		
		// Initialize pause controls
		this.pauseGame();
},

	update: function() {
		if (!this.player.alive) { return; }

		// Check all collisions
		this.game.physics.arcade.overlap(this.player, this.enemies, this.playerHit, null, this);
		this.game.physics.arcade.collide(this.player, this.boss, this.playerHit, null, this);
		
		this.game.physics.arcade.overlap(this.enemies, this.lasers, this.enemyHit, null, this);
		this.game.physics.arcade.overlap(this.boss, this.lasers, this.enemyHit, null, this);
		
		this.game.physics.arcade.overlap(this.player, this.powerups, this.takePowerUp, null, this);

		// Player movement
		this.player.move();

		// Fire a laser when the spacebar is pressed
		if (this.arrowKeys.fire.isDown && this.game.time.now > this._nextLaserTime) {
			// Reset the timer
			this._nextLaserTime = this.game.time.now + 200; 
			this.player.fireWeapon(this._currPowerLevel, this.lasers);
		}

		this.createEnemies();
	},
	
	/* --- RECYCLE ENEMIES --- */

	createEnemies: function(){
		// Add a new enemy, freq increasing with the score
		// At start: one enemy per 1200ms
		// After 400 points: one enemy every 500ms
		if (this._nextEnemyTime < this.game.time.now) {
			var start = 1200, 
					end = 500, 
					score = 400;
			
			var delay = Math.max(start - (start - end) * this.game.global.score/score, end);
			
			if (this.game.global.score <= 10) {
				var enemyLevel = 1;
			} else {
				var enemyLevel = 2;
			}
			
			// add more enemies if you rose up a level
			if (enemyLevel !== this._currEnemyLevel){
				this._oldEnemyLevel = this._currEnemyLevel;
				this._currEnemyLevel = enemyLevel;
				
				this.enemies.addEnemies(enemyLevel);
				this.boss = this.enemies.genBoss(enemyLevel);
			}
			
			// instantiate a new enemy
			this.generateEnemy(enemyLevel);
			this._nextEnemyTime = this.game.time.now + delay;
		}
	},
	
	
	generateEnemy: function(enemyLevel) {
// 		var enemy = this.enemies.getFirstDead();
		var enemy = this.enemies.getRandom();
		if (!enemy) { return; } // all enemies still alive

		this.enemies.resetEnemy(enemy);
	},
	
	/* --- RECYCLE POWERUPS --- */
	
	// initialize this.powerups with 3 random powerups
	createPowerUps: function(level) {
		// empty out powerups
		this.powerups.removeAll(true);
	
		var keysL1 = ['powerupB1', 'powerupG1', 'powerupR1'],
				keysL2 = ['powerupB2', 'powerupG2', 'powerupR2'],
				keysL3 = ['powerupB3', 'powerupG3', 'powerupR3'];
		
		if (level === 1) {
			var keys = Phaser.Utils.shuffle(keysL1);
		} else if (level === 2) {
			var keys = Phaser.Utils.shuffle(keysL1.concat(keysL2));
		} else {
			var keys = Phaser.Utils.shuffle(keysL1.concat(keysL2).concat(keysL3));
		}
		
		for (var i = 0; i < keys.length; i++) {
			this.powerups.create(0, 0, keys[i], 1, false);
		}
		
		return this.powerups;
	},
	
	// generate next random powerup based on current power level
	newPowerUp: function() {	
		if (this._oldPowerLevel !== this._currPowerLevel) {		
			this.createPowerUps(this._currPowerLevel);		
		}

		var powerup = this.powerups.getFirstDead();				
		if (!powerup) { return; }
		
		// revive the powerup
		powerup.anchor.setTo(0.5, 0.5);
		powerup.reset(this.game.rnd.integerInRange(20, this.game.world.width-40), -powerup.height/2);
		powerup.body.velocity.y = 150;
		powerup.body.angularVelocity = 100;
		
		// tween for throbbing affect
		this.game.add.tween(powerup.scale).to({x: 1.2, y: 1.2}, 400, Phaser.Easing.Sinusoidal.InOut, true, 0, 100, true);
		
		powerup.checkWorldBounds = true;	
		powerup.outOfBoundsKill = true;	
	},
	
	/* --- UTILS --- */
	
	getPowerColor: function(key){
		console.log("getPowerColor", this._colors);
		
		for (var i = 0; i < this._colors.length; i++) {
			if (key.search(this._colors[i]) !== -1) {
				return this._colors[i];
			}
		}	
	},
	
	checkPowerLevel: function(key){
		var levels = ["1", "2", "3"];
		for (var i = 0; i < levels.length; i++) {
			if (key.search(levels[i]) !== -1) {
				return levels[i];
			}
		}	
	},
	
	// Player was hit
	playerHit: function(player, enemy) {
		if (enemy !== this.boss) {
			enemy.kill();
		} 
		
		this.hitSound.play();

		// Decrease power level by one, down to floor of 1
		if (this._currPowerLevel > 1) {
			this.swapPowerLevel(-1);
		}
		
		// Make the screen flash
		this.game.stage.backgroundColor = '#fff';
		this.game.time.events.add(30, this.resetBackground, this);
		
		// Decrease HP by amount depending on enemy strength
		this.player.health -= this.enemies.dealDamage(enemy);
		this.healthLabel.text = 'health: ' + this.player.health;
		
		
		if (this.player.health <= 0) {
			this.takePlayerLife();
		}
		
	},
	
	takePlayerLife: function(){
		// Update lives count - game over if 0 lives left
		this.lives -= 1;
		this.livesLabel.text = 'lives: ' + this.lives;
		this.player.health = this.game.global.health;
		
		if (this.lives <= 0) {
			// Kill the player
			this.player.kill();

			// Emit particles
			this.explosionEmitter.x = this.player.x;
			this.explosionEmitter.y = this.player.y;
			this.explosionEmitter.start(true, 800, null, 30);

			// Go to the menu in 1 second
			this.game.time.events.add(1000, this.startMenu, this);
		} 
	},
	
	takePowerUp: function(player, powerup) {
		// initialize to first taken powerup
		var newColor = this.getPowerColor(powerup.key);
		
		// if powerup is same color and >= level, go up one power level
		// if different color, reset power level to one
		if (this._currColor === undefined) { // first powerup 
			console.log("undefined currCol", this._currColor, newColor);
			this._currColor = newColor;
			this.swapPowerLevel(0);
			this.swapColor(newColor);
		} else if (this._currColor !== newColor) {
			this.swapPowerLevel(-(this._currPowerLevel-1));
			this.swapColor(newColor);
		} else {		
			this.colorLabel.text = 'color: ' + this._currColor;
			var newLevel = this.checkPowerLevel(powerup.key);
			if (newLevel >= this._currPowerLevel)	{
				this.swapPowerLevel(1);
			}
		}
		
		powerup.kill();
		this.increaseScore(this._currPowerLevel * 10);
		
		// Tween the player with sound
		this.game.add.tween(this.player.scale).to({x: 1.4, y: 1.4}, 50)
			.to({x: 1, y: 1}, 100).start();
		this.bonusSound.play();
	},

	enemyHit: function(enemy, laser) {
		// Recoil the enemy
		laser.kill();		
		
		enemy.y -= 10;

		// Reduce health based on power level
		enemy.health -= (this._currPowerLevel * 20);	
		
		// if no more health, kill the enemy
		if (enemy.health <= 0) {
			// Emit particles
			this.explosionEmitter.x = enemy.x;
			this.explosionEmitter.y = enemy.y;
			this.explosionEmitter.start(true, 600, null, 15);

			// Kill the enemy with sound
			enemy.kill();
			this.dieSound.play();

			// Inscrease score
			this.increaseScore(5);
		}
	},

	
	/*-- UI --- */
	
	increaseScore: function(x) {
		// Inscrease the score by 'x' and update the label
		this.game.global.score += x;
		this.scoreLabel.text = 'score: ' + this.game.global.score;
	},
	
	// swap weapon color 
	swapColor: function(color) {
		this._currColor = color;
		this.swapLaser();
		
		this.colorLabel.text = 'color: ' + this._currColor;
	},
	
	swapPowerLevel: function(dx) {
		this._oldPowerLevel = this._currPowerLevel;
		this._currPowerLevel += dx;
		this.swapLaser();
		
		this.powerLabel.text = 'power: ' + this._currPowerLevel;
	},
	
	swapLaser: function() {
		this.lasers.removeAll();
		
		var laserKey = "laser" + this._currColor + this._currPowerLevel;
		this.lasers.createMultiple(50, laserKey);
	},
	
	pauseGame: function(){
    var w = this.game.world.width,
				h = this.game.world.height;
		
    var pause_label = this.game.add.text(w-80, h-40, 'PAUSE', { font: '20px Lato', fill: '#ff0080' });
    pause_label.inputEnabled = true;
		
    pause_label.events.onInputUp.add(function () {
			this.game.paused = true;
			this.pauseMenu = this.game.add.sprite(w/2, h/2, 'pauseMenu');
      this.pauseMenu.anchor.setTo(0.5, 0.5);
			
      // label to illustrate which menu item was chosen. 
      this.choiceLabel = this.game.add.text(w/2, h-150, 'Click outside menu to continue', { font: '16px Lato', fill: '#fff' });
      this.choiceLabel.anchor.setTo(0.5, 0.5);
			
			this.game.input.onDown.add(this.unpause, this);
    }.bind(this));

	},
	
  unpause: function(event){
		var w = this.game.width,
				h = this.game.height,
				menuWidth = this.pauseMenu.width,
				menuHeight = this.pauseMenu.height;
		
		// Only act if paused
		if (this.game.paused) {
			// Calculate the corners of the menu
			var x1 = w/2 - menuWidth/2, x2 = w/2 + menuWidth/2,
					y1 = h/2 - menuHeight/2, y2 = h/2 + menuHeight/2;

			// Check if the click was inside the menu
			if (event.x > x1 && event.x < x2 && event.y > y1 && event.y < y2 ) {
				var choicemap = ['one', 'two', 'three', 'four', 'five', 'six'];
				// Get menu local coordinates for the click
				var x = event.x - x1,
						y = event.y - y1;

				// Calculate the choice 
				var choice = Math.floor(x / 90) + 3*Math.floor(y / 90);

				// Display the choice
				this.choiceLabel.text = 'You chose menu item: ' + choicemap[choice];
			} else {
				// Remove the menu and the label
				this.pauseMenu.destroy();
				this.choiceLabel.destroy();

				// Unpause the game
				this.game.paused = false;
			}
		}
	},

	displayLabels: function(){
		var w = this.game.world.width,
				h = this.game.world.height;
		
		// Display lives and health label in the top left
		this.livesLabel = this.game.add.text(20, 20, 'lives: 3', 
			{ font: '22px Lato', fill: '#C8F526' });
		this.healthLabel = this.game.add.text(20, 50, 'health: 100',  {font: '14px Lato', fill: '#ffffff' });

		// Display score label in the top right
		this.scoreLabel = this.game.add.text(w-20, 20, 'score: 0', { font: '22px Lato', fill: '#FCDC3B' });
		this.scoreLabel.anchor.setTo(1, 0);
		
		// Display current power level and color in top right
		this.colorLabel = this.game.add.text(w-20, 50, 'color: ', { font: '14px Lato', fill: '#ffffff' });
		this.colorLabel.anchor.setTo(1, 0);
		this.powerLabel = this.game.add.text(w-20, 70, 'power: ', { font: '14px Lato', fill: '#ffffff' });
		this.powerLabel.anchor.setTo(1, 0);
		

		// Capture and setup keys
		this.game.input.keyboard.addKeyCapture([Phaser.Keyboard.UP, Phaser.Keyboard.DOWN, Phaser.Keyboard.LEFT, Phaser.Keyboard.RIGHT, Phaser.Keyboard.SPACEBAR]);

		this.arrowKeys = {
			up: this.game.input.keyboard.addKey(Phaser.Keyboard.UP),
			down: this.game.input.keyboard.addKey(Phaser.Keyboard.DOWN),
			left: this.game.input.keyboard.addKey(Phaser.Keyboard.LEFT),
			right: this.game.input.keyboard.addKey(Phaser.Keyboard.RIGHT),
			fire: this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR)
		};
	},
	
	resetBackground: function() {
		// Set the background to its original color
		this.game.stage.backgroundColor = this.game.global.bg;
	},

	startMenu: function() {
		this.game.state.start('menu');
	},

};

module.exports = Play;