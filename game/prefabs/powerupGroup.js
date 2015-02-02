'use strict';

var PowerUpGroup = function(game, parent) {
	Phaser.Group.call(this, game, parent);
	this.game = game;
	this.enableBody = true;	
	this.colorLevels = {
		'R': 0,
		'G': 0,
		'B': 0
	};
	this.w = this.game.world.width;
	this.h = this.game.world.height;
	this.startX = this.w - 120;
	this.startY = {
		'R': this.h - 75,
		'G': this.h - 50,
		'B': this.h - 25
	}
};

PowerUpGroup.prototype = Object.create(Phaser.Group.prototype);
PowerUpGroup.prototype.constructor = PowerUpGroup;

PowerUpGroup.prototype.update = function() {
  
};

/* --- RECYCLE POWERUPS --- */
	
	// initialize this.powerups with 3 random powerups
PowerUpGroup.prototype.createPowerUps = function(level) {
	console.log("refab createPowerUps with level:", level);
	
	// empty out powerups
	this.removeAll(true);

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
		this.create(0, 0, keys[i], 1, false);
	}

	return this;
};
	
	// generate next random powerup based on current power level
PowerUpGroup.prototype.newPowerUp = function(oldLevel, currLevel) {	
	console.log("refab newPowerUp", oldLevel, currLevel);
	
	if (oldLevel !== currLevel) {		
		this.createPowerUps(currLevel);	// refresh powerups array
	}

	var powerup = this.getFirstDead();				
	if (!powerup) { return; }

	// revive the powerup
	powerup.anchor.setTo(0.5, 0.5);
	powerup.reset(this.game.rnd.integerInRange(20, this.game.world.width-40), -powerup.height/2);
	powerup.body.velocity.y = 150;
	powerup.body.angularVelocity = 100;

	// tween for throbbing effect
	this.game.add.tween(powerup.scale).to({x: 1.2, y: 1.2}, 400, Phaser.Easing.Sinusoidal.InOut, true, 0, 100, true);

	powerup.checkWorldBounds = true;
	powerup.outOfBoundsKill = true;
	
	return powerup;
};

PowerUpGroup.prototype.updateColorLvl = function(color){
	if (this.colorLevels[color] > 3) {
		return;
	} else if (this.colorLevels[color] === 3) {
		this.finishColorLvl(color)
	}
	
	this.colorLevels[color] += 1
	this.renderColorLvl(color);
};

PowerUpGroup.prototype.renderColorLvl = function(color){
	var dx = this.startX + ((this.colorLevels[color] - 1) * 40);
	var gemSprite = 'gem' + color;
	
	var gem = this.game.add.sprite(dx, this.startY[color], gemSprite);
  gem.anchor.setTo(0.5, 0.5);
};

PowerUpGroup.prototype.finishColorLvl = function(color){
	console.log("finished");
};

module.exports = PowerUpGroup;