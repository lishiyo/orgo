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

Player.prototype.move = function(){
	if (this.arrowKeys.left.isDown) {
		this.body.velocity.x = -350;
	} else if (this.arrowKeys.right.isDown) {
		this.body.velocity.x = 350;
	} else if (this.arrowKeys.up.isDown) {
		this.body.velocity.y = -350;
	} else if (this.arrowKeys.down.isDown) {
		this.body.velocity.y = 350;
	} else {
		// Stop the player
		this.body.velocity.x = 0;
		this.body.velocity.y = 0;
	}
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
		laser.body.velocity.y = -400;

		// Kill the laser when out of the world
		laser.checkWorldBounds = true;	
		laser.outOfBoundsKill = true;
};


module.exports = Player;