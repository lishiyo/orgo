'use strict';

var EnemyGroup = function(opts, game, parent) {
	Phaser.Group.call(this, game, parent);
	this.game = game;
	this.enableBody = true;	
	this._currLevel = 1;
	this._bossTally= {};
	this._levels = { 1: "1", 2: "2", 3: "3"};
	
	// Initialize enemies at level one
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
	// if boss for this level already exists, return
	if (this._bossTally[level]) { return; }
	
	// levels 1-3
	var bossKey = 'boss' + level;
	var boss = this.game.add.sprite(this.game.rnd.integerInRange(40, this.game.world.width - 80), 0, bossKey);
	
	boss.anchor.setTo(0.5, 1);
	this.game.physics.enable(boss, Phaser.Physics.ARCADE);

	// boss has different stats than normal enemy
	var startVelY = Math.max(100, level * 25),
			endVelY = Math.min(level * 200, 450),
			startVelX = Math.max(50, level * 5),
			endVelX = Math.min(level * 20, 100);
	
	boss.body.velocity.y = this.game.rnd.integerInRange(startVelY, endVelY);
	boss.body.velocity.x = this.game.rnd.integerInRange(startVelX, endVelX);

	boss.health = level * 500;
	boss.body.collideWorldBounds = true;
	boss.body.bounce.set(1);
	
	// only create one boss per level
	this._bossTally[level] = true;
	
	return boss;
};

EnemyGroup.prototype.addEnemies = function(level) {
	this.removeAll(true);
	this._currLevel = level;
	this.enableBody = true;
	
	var keys = Phaser.Utils.shuffle(["alienB", "alienR", "alienG"]);
	for(var i = 1; i <= level; i++) {
		keys.forEach(function(key) {
			var keyLevel = key + i;
			this.createMultiple(10, keyLevel);
		}, this);
	}

	return this;
};


EnemyGroup.prototype.resetEnemy = function(enemy) {
	var level = this.getEnemyLevel(enemy.key);
	
	enemy.anchor.setTo(0.5, 1);
	enemy.reset(this.game.rnd.integerInRange(40, this.game.world.width - 80), 0);

	// Give a random velocity based on level between 100-500
	var startVel = Math.max(150, level * 50),
			endVel = Math.min(level * 200, 500);
	enemy.body.velocity.y = this.game.rnd.integerInRange(startVel, endVel);
		
	// for spritesheets
// 	enemy.animations.add('attack', [0, 1], 4, true);
// 	enemy.animations.play('attack');

	// enemy health depends on its own level
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