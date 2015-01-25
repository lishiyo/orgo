(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

//global variables
window.onload = function () {
  var game = new Phaser.Game(1100, 630, Phaser.AUTO, 'orgo');

  // Game States
  game.state.add('boot', require('./states/boot'));
  game.state.add('bullet', require('./states/bullet'));
  game.state.add('gameover', require('./states/gameover'));
  game.state.add('menu', require('./states/menu'));
  game.state.add('play', require('./states/play'));
  game.state.add('preload', require('./states/preload'));
  

  game.state.start('boot');
};
},{"./states/boot":5,"./states/bullet":6,"./states/gameover":7,"./states/menu":8,"./states/play":9,"./states/preload":10}],2:[function(require,module,exports){
'use strict';

var EnemyGroup = function(opts, game, parent) {
	Phaser.Group.call(this, game, parent);
	
	this.enableBody = true;	
	this._currLevel = 1;
	this._bossTally= {};
	this._levels = { 1: "1", 2: "2", 3: "3"};
	
	this.addEnemies(1);
};


EnemyGroup.prototype = Object.create(Phaser.Group.prototype);
EnemyGroup.prototype.constructor = EnemyGroup;

EnemyGroup.prototype.update = function() {
  
};

EnemyGroup.prototype.dealDamage = function(enemy) {
	var level = this.getEnemyLevel(enemy.key);
	
	return this.game.global.enemyAttack[level];
};

EnemyGroup.prototype.genBoss = function(level) {
	if (this._bossTally[level]) { return; }
	// remain 1 for now
	var bossKey = 'boss' + 1;
	var boss = this.game.add.sprite(this.game.rnd.integerInRange(40, this.game.world.width - 80), 0, bossKey);
	
	boss.anchor.setTo(0.5, 1);
	this.game.physics.enable(boss, Phaser.Physics.ARCADE);

	// boss has different stats than normal enemy
	var startVelY = Math.max(100, level * 25),
			endVelY = Math.min(level * 200, 400),
			startVelX = Math.max(10, level * 5),
			endVelX = Math.min(level * 20, 50);
	
	boss.body.velocity.y = this.game.rnd.integerInRange(startVelY, endVelY);
	boss.body.velocity.x = this.game.rnd.integerInRange(startVelX, endVelX);

	boss.health = level * 500;
	boss.body.collideWorldBounds = true;
	boss.body.bounce.set(0.75);
	
	// only create one boss per level
	this._bossTally[level] = true;
	
	return boss;
};

EnemyGroup.prototype.addEnemies = function(level) {
	this.removeAll(true);
	this._currLevel = level;
	
	var keys = Phaser.Utils.shuffle(["alienB", "alienR", "alienG"]);
	
	for(var i = 1; i <= level; i++) {
		keys.forEach(function(key) {
			var keyLevel = key + i;
			this.createMultiple(5, keyLevel);
		}, this);
	}

	return this;
};


EnemyGroup.prototype.resetEnemy = function(enemy) {
	var level = this.getEnemyLevel(enemy.key);
	
	enemy.anchor.setTo(0.5, 1);
	enemy.reset(this.game.rnd.integerInRange(40, this.game.world.width - 80), 0);

	// Give a random velocity based on level
	var startVel = Math.max(75, level * 25),
			endVel = Math.min(level * 200, 300);
	enemy.body.velocity.y = this.game.rnd.integerInRange(startVel, endVel);

	// Create and start animation
// 	enemy.animations.add('attack', [0, 1], 4, true);
// 	enemy.animations.play('attack');

	// enemy health depends on its level
	enemy.health = this.game.global.enemyHealth[level];

	// Kill the enemy when out of the world
	enemy.checkWorldBounds = true;	
	enemy.outOfBoundsKill = true;	
	
	return enemy;
}


EnemyGroup.prototype.getEnemyLevel = function(key) {
	for (var i = 1; i <= 3; i++) {
		if (key.search(this._levels[i]) !== -1) {
			var level = i;
			break;
		}
	}
	return level;
};

module.exports = EnemyGroup;
},{}],3:[function(require,module,exports){
'use strict';

var Player = function(opts, game, x, y, frame) {
	// super call to Phaser.Sprite
  Phaser.Sprite.call(this, game, x, y, 'player', frame);
	
  this.anchor.setTo(0.5, 0.5);
	this.game.physics.arcade.enable(this);
	this.body.collideWorldBounds = true;
	
	this.alive = true;
	this.health = this.game.global.health; // starting HP

	this.arrowKeys = opts.arrowKeys;
	
	this.fireSound = this.game.add.audio('fireSound');
};

// inherits from Phaser.Sprite 
Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;

Player.prototype.update = function() {
  
};

// rotate if you hold down two keys at own
Player.prototype.move = function(){
	var up = this.arrowKeys.up,
			down = this.arrowKeys.down,
			left = this.arrowKeys.left,
			right = this.arrowKeys.right;
	var keys = [up, down, left, right];
	
	var tweenAngle = function(newAngle) {
		this.body.velocity.y = 0;
		this.body.velocity.x = 0;
		this.game.add.tween(this).to( { angle: newAngle }, 100, Phaser.Easing.Linear.None, true);	
	}.bind(this);
	
	var checkLateral = function(dir){
		
		if (left.isDown) {
			tweenAngle(this.angle + (dir * 45));
// 			this.body.velocity.y = 0;
// 			this.body.velocity.x = 0;
// 			this.game.add.tween(this).to( { angle: this.angle + (dir * 45) }, 100, Phaser.Easing.Linear.None, true);			
		} else if (right.isDown) {
			tweenAngle(this.angle - (dir * 45));
// 			this.body.velocity.y = 0;
// 			this.body.velocity.x = 0;
// 			this.game.add.tween(this).to( { angle: this.angle - (dir * 45) }, 100, Phaser.Easing.Linear.None, true);
		} else {
			this.body.velocity.y = dir * 350;
		}
	}.bind(this);
	
	
	var checkVertical = function(dir){
// 		this.body.velocity.y = 0;
// 		this.body.velocity.x = 0;
		if (up.isDown) {
			tweenAngle(this.angle + (dir * 45));
// 			this.body.velocity.y = 0;
// 			this.body.velocity.x = 0;
// 			this.game.add.tween(this).to( { angle: this.angle + (dir * 45) }, 100, Phaser.Easing.Linear.None, true);	
		} else if (down.isDown) {
			tweenAngle(this.angle - (dir * 45));
			
// 			this.body.velocity.y = 0;
// 			this.body.velocity.x = 0;
// 			this.game.add.tween(this).to( { angle: this.angle - (dir * 45) }, 100, Phaser.Easing.Linear.None, true);	
		} else {
			this.body.velocity.x = -(dir * 350);
		}
	}.bind(this);
		
	if (up.isDown) {
		checkLateral(-1);
	} else if (down.isDown) {
		checkLateral(1);
	} else if (left.isDown) {
		checkVertical(1);
	} else if (right.isDown) {
		checkVertical(-1);
	} else {
		this.body.velocity.x = 0;
		this.body.velocity.y = 0;
	}
	
	
// 	if (this.arrowKeys.left.isDown) {
// 		this.body.velocity.x = -350;
// 	} else if (this.arrowKeys.right.isDown) {
// 		this.body.velocity.x = 350;
// 	} else if (this.arrowKeys.up.isDown) {
// 		this.body.velocity.y = -350;
// 	} else if (this.arrowKeys.down.isDown) {
// 		this.body.velocity.y = 350;
// 	} else {
// 		// Stop the player
// 		this.body.velocity.x = 0;
// 		this.body.velocity.y = 0;
// 	}
};

// fire based on weapons level 1-3 and type
Player.prototype.fireWeapon = function(level, lasers) {
	this.lasers = lasers;
	
	// recoil animation
	var currY = this.y;
	this.game.add.tween(this).to({y: currY + 5}, 50).to({y: currY}, 50).start();
	
		if (level === 1) {
			this.fireLevelOne();
		} else if (level === 2) {
			this.fireLevelTwo();
		} else {
			this.fireLevelThree();
		}
	};

Player.prototype.fireLevelOne = function(color) {
		this.fireLaser(this.x);

		// Play sound with small volume
		this.fireSound.volume = 0.5;
		this.fireSound.play();
	};

Player.prototype.fireLevelTwo = function(color) {
		this.fireLaser(this.x - 10);
		this.fireLaser(this.x + 10);

		// Play sound with medium volume
		this.fireSound.volume = 0.8;
		this.fireSound.play();
	};

Player.prototype.fireLevelThree = function(color) {
		this.fireLaser(this.x-15);
		this.fireLaser(this.x);
		this.fireLaser(this.x+15);

		// Play sound with loud volume
		this.fireSound.volume = 1;
		this.fireSound.play();
	},

	// RECYCLE lasers
Player.prototype.fireLaser = function(x, color) {
	var laser = this.lasers.getFirstDead();
	if (!laser) { // first laser
		return;
	}

	// Set the collision area of the laser
	laser.body.setSize(laser.width, 5, 0, 0);

	// Initialize the laser
	laser.anchor.setTo(0.5, 1);
	laser.reset(x, this.y - this.height/2);

	// Laser follows angle and velocity of player
	laser.angle = this.angle;
	var rad = Phaser.Math.degToRad(this.angle);
	var dx = 300 * Math.sin(rad),
			dy = -300 * Math.cos(rad);
		
	laser.body.velocity.x = dx;
	laser.body.velocity.y = dy;
			
	// Kill the laser when out of the world
	laser.checkWorldBounds = true;	
	laser.outOfBoundsKill = true;
};


module.exports = Player;
},{}],4:[function(require,module,exports){
'use strict';

var Scoreboard = function(game) {
	
	var gameover;
	
  Phaser.Group.call(this, game);

  gameover = this.create(this.game.width/2, 100, 'gameover');
	gameover.anchor.setTo(0.5, 0.5);
	
  this.scoreboard = this.create(this.game.width/2, 200, 'scoreboard');
	this.scoreboard.anchor.setTo(0.5, 0.5);
	
	this.scoreText = this.game.add.bitmapText(this.scoreboard.width, 180, 'flappyfont', '', 18);
	this.add(this.scoreText);
	
	this.bestScoreText = this.game.add.bitmapText(this.scoreboard.width, 230, 'flappyfont', '', 18);
  this.add(this.bestScoreText);
	
	// add start button with a callback
	this.startButton = this.game.add.button(this.game.width/2, 300, 'startButton', this.startClick, this);
  this.startButton.anchor.setTo(0.5,0.5);
  this.add(this.startButton);

  this.y = this.game.height;
  this.x = 0;
};

Scoreboard.prototype = Object.create(Phaser.Group.prototype);
Scoreboard.prototype.constructor = Scoreboard;

Scoreboard.prototype.update = function() {
  
  // write your prefab's specific update code here
  
};

Scoreboard.prototype.show = function(score){
	var medal, bestScore;
	// update scoreText displayed by text object
	this.scoreText.setText(score.toString());
	
	if (!!localStorage) {
		// localStorage exists
		bestScore = localStorage.getItem('bestScore');
		// if no bestScore yet, or less than current bestScore, reset
		if (!bestScore || bestScore < score) {
			bestScore = score;
			console.log(bestScore);
			localStorage.setItem('bestScore', bestScore);
		}
	} else { // fallback
		bestScore = 'N/A'
	}
	
	this.bestScoreText.setText(bestScore.toString());
	
	// determine whether or not to show medal
	if (score >= 10 && score < 20)
		{
			// position medal relative to the scoreboard sprite origin
			medal = this.game.add.sprite(-65, 7, 'medals', 1);
			medal.anchor.setTo(0.5, 0.5);
			this.scoreboard.addChild(medal);
		} else if (score >= 20) {
			medal = this.game.add.sprite(-65, 7, 'medals', 0);
			medal.anchor.setTo(0.5, 0.5);
			this.scoreboard.addChild(medal);
		}
	
	if (medal) { // start a particle emitter to display 'shinies'
		// x position, y position, num of particles
		var emitter = this.game.add.emitter(medal.x, medal.y, 400);
		this.scoreboard.addChild(emitter);
		emitter.width = medal.width;
		emitter.height = medal.height;
		
		emitter.makeParticles('particle');
		emitter.setRotation(-100, 100);
		emitter.setXSpeed(0, 0);
		emitter.setYSpeed(0, 0);
		emitter.minParticleScale = 0.25;
		emitter.maxParticleScale = 0.5;
		emitter.setAll('body.allowGravity', false);
		
		// emitter.start(explode, lifespan, frequency, quantity)
		// don't emit everything at once, but 1 particle per second with lifespan of 1 second
		emitter.start(false, 1000, 1000);
		
	}
	// start at current value and tween to y: 0
	// duration, easing function, autoStart (default false)
	this.game.add.tween(this).to({y: 0}, 1000, Phaser.Easing.Bounce.Out, true);
};

// when start button is clicked, restart play state
Scoreboard.prototype.startClick = function(){
	this.game.state.start('play');
}

module.exports = Scoreboard;

},{}],5:[function(require,module,exports){
'use strict';

function Boot() {
}

Boot.prototype = {
  preload: function () {
		this.load.image('progressBar', 'assets/progressBar.png');
		
		// namespace global variables
		this.game.global = {
			score: 0,
			lives: 3,
			health: 100,
			enemyHealth: { 1: 100, 2: 150, 3: 250},
			enemyAttack: { 1: 20, 2: 50, 3: 100},
			bg: "#33b5e5"
		};
		
	},

	create: function() { 
		// Set background color and arcade system
		this.game.stage.backgroundColor = this.game.global.bg;
		this.game.physics.startSystem(Phaser.Physics.ARCADE);

		this.game.state.start('preload');
	}
	
};

module.exports = Boot;

},{}],6:[function(require,module,exports){

},{}],7:[function(require,module,exports){
'use strict';
function GameOver() {}

GameOver.prototype = {
  preload: function () {

  },
  create: function () {
    var style = { font: '65px Arial', fill: '#ffffff', align: 'center'};
    this.titleText = this.game.add.text(this.game.world.centerX,100, 'Game Over!', style);
    this.titleText.anchor.setTo(0.5, 0.5);

    this.congratsText = this.game.add.text(this.game.world.centerX, 200, 'You Win!', { font: '32px Arial', fill: '#ffffff', align: 'center'});
    this.congratsText.anchor.setTo(0.5, 0.5);

    this.instructionText = this.game.add.text(this.game.world.centerX, 300, 'Click To Play Again', { font: '16px Arial', fill: '#ffffff', align: 'center'});
    this.instructionText.anchor.setTo(0.5, 0.5);
  },
  update: function () {
    if(this.game.input.activePointer.justPressed()) {
      this.game.state.start('play');
    }
  }
};
module.exports = GameOver;

},{}],8:[function(require,module,exports){
'use strict';
function Menu() {}

Menu.prototype = {
  preload: function() {

  },
  create: function() { 
		// tween
		var nameLabel = this.game.add.text(this.game.world.centerX, 100, 'attack of the microbes', { font: '50px Lato', fill: '#fff' });
		nameLabel.anchor.setTo(0.5, 0.5);
		nameLabel.scale.setTo(0, 0);
		this.game.add
			.tween(nameLabel.scale).delay(200).to({x: 1, y: 1}, 1000)
			.easing(Phaser.Easing.Bounce.Out).start();

		// display score if any
// 		if (this.game.global.score > 0) {
// 			var scoreLabel = this.game.add.text(this.game.world.centerX, this.game.world.centerY, 'score: ' + this.game.global.score, { font: '25px Arial', fill: '#ffffff' });
// 			scoreLabel.anchor.setTo(0.5, 0.5);				
// 		}

		// instructions
		var startLabel = this.game.add.text(this.game.world.centerX, this.game.world.height-100, "Press the spacebar to start and fire! Use arrow keys for movement and rotation.", { font: '25px Lato', fill: '#f9f9f9' });
		startLabel.anchor.setTo(0.5, 0.5);	
		this.game.add
			.tween(startLabel).to({alpha: 0}, 500)
			.to({alpha: 1}, 1000).loop().start(); 

		// Add a mute button
		this.muteButton = this.game.add.button(20, 20, 'mute', this.toggleSound, this);
		this.muteButton.input.useHandCursor = true;
		if (this.game.sound.mute) {
			this.muteButton.frame = 1;
		}

		// Start the game when the spacebaris pressed
		var startKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
		startKey.onDown.addOnce(this.start, this);
	},

	toggleSound: function() {
		this.game.sound.mute = !this.game.sound.mute;
		this.muteButton.frame = this.game.sound.mute ? 1 : 0;	
	},

	start: function() {
		this.game.state.start('play');	
	},
	
//   update: function() {
//     if(this.game.input.activePointer.justPressed()) {
//       this.game.state.start('play');
//     }
//   }
};

module.exports = Menu;

},{}],9:[function(require,module,exports){
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
		this.game.physics.arcade.overlap(this.player, this.boss, this.playerHit, null, this);
		
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
		// At start: one enemy per 1000ms
		// After 400 points: one enemy every 500ms
		if (this._nextEnemyTime < this.game.time.now) {
			var start = 1000, 
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
		
		powerup.checkWorldBounds = true;	
		powerup.outOfBoundsKill = true;	
	},
	
	/* --- UTILS --- */
	
	getPowerColor: function(key){
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
		// remove the enemy with sound
		
		if (enemy !== this.boss) {
			enemy.kill();
		}
		
		this.hitSound.play();

		// Decrease power level by one, down to min of 1
		this._oldPowerLevel = this._currPowerLevel;
		this._currPowerLevel = Math.max(this._currPowerLevel-1, 1);

		// Make the screen flash
		this.game.stage.backgroundColor = '#fff';
		this.game.time.events.add(50, this.resetBackground, this);
		
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
		this._currColor = (this._currColor || newColor);
		
		// if powerup is same color and >= level, go up one power level
		// if different color, reset power level to one
		if (this._currColor !== newColor) {
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
	
	swapLaser: function(color) {
		this.lasers.removeAll();
		
		var laserKey = "laser" + this._currColor + this._currPowerLevel;
		this.lasers.createMultiple(50, laserKey);
	},
	
	swapPowerLevel: function(dx) {
		this._oldPowerLevel = this._currPowerLevel;
		this._currPowerLevel += dx;
		this.swapLaser();
		
		this.powerLabel.text = 'power: ' + this._currPowerLevel;
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
			{ font: '20px Lato', fill: '#fff' });
		this.healthLabel = this.game.add.text(20, 50, 'health: 100',  {font: '14px Lato', fill: '#ffffff' });

		// Display score label in the top right
		this.scoreLabel = this.game.add.text(w-20, 20, 'score: 0', { font: '20px Lato', fill: '#CC9900' });
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
},{"../prefabs/enemyGroup":2,"../prefabs/player":3,"../prefabs/scoreboard":4}],10:[function(require,module,exports){
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

},{}]},{},[1])