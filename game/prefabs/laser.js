// 'use strict';

// var Bullet = function(opts, game, x, y, frame) {
// 	// super call to Phaser.Sprite
//   Phaser.Sprite.call(this, game, x, y, opts.currBulletType, frame);
// 	this.bulletSound = this.game.add.audio('fireBullet');
	
//   this.anchor.setTo(0.5, 1);
// 	this.body.setSize(this.width, 5, 0, 0);
// 	this.body.velocity.y = -400;
// 	this.game.physics.arcade.enableBody(this);
	
// 	this.checkWorldBounds = true;	
// 	this.outOfBoundsKill = true;
// };

// Bullet.prototype = Object.create(Phaser.Sprite.prototype);
// Bullet.prototype.constructor = Bullet;

// Bullet.prototype.update = function() {
  
// };

// Bullet.prototype.createSound = function(vol){
// 	this.bulletSound.volume = vol;
// 	this.bulletSound.play();
// };


// module.exports = Bullet;