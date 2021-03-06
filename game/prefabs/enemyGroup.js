'use strict';

var EnemyGroup = function(opts, game, parent) {
	Phaser.Group.call(this, game, parent);
	this.game = game;
	this.enableBody = true;	
	this._currLevel = 1;
	this._levels = ["1", "2", "3"];
	
	// Initialize enemies at level one
	this.addEnemies(1);
};


EnemyGroup.prototype = Object.create(Phaser.Group.prototype);
EnemyGroup.prototype.constructor = EnemyGroup;

EnemyGroup.prototype.update = function() {
  
};

EnemyGroup.prototype.dealDamage = function(enemy) {
	var level = this.getEnemyLevel(enemy.key);	
	console.log("deal damage", level, this.game.global.enemyAttack[level]);
	return this.game.global.enemyAttack[level];
};

EnemyGroup.prototype.genBoss = function(level) {
	// levels 1-3
	var bossKey = 'boss' + level;
	var boss = this.game.add.sprite(this.game.rnd.integerInRange(40, this.game.world.width - 80), 0, bossKey);
	
	boss.anchor.setTo(0.5, 1);
	this.game.physics.enable(boss, Phaser.Physics.ARCADE);

	// boss has different stats than normal enemy
	var startVelY = Math.max(200, level * 25),
			endVelY = Math.min(level * 250, 500),
			startVelX = Math.max(100, level * 5),
			endVelX = Math.min(level * 150, 300);
	
	boss.body.velocity.y = this.game.rnd.integerInRange(startVelY, endVelY);
	boss.body.velocity.x = this.game.rnd.integerInRange(startVelX, endVelX);

	boss.health = level * 500;
	boss.body.collideWorldBounds = true;
	boss.body.bounce.set(1);
	
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
	var startVel = Math.max(200, level * 50),
			endVel = Math.min(level * 200, 450);
	enemy.body.velocity.y = this.game.rnd.integerInRange(startVel, endVel);
		
	// enemy health depends on its own level
	enemy.health = this.game.global.enemyHealth[level];

	// Kill the enemy when out of the world
	enemy.checkWorldBounds = true;	
	enemy.outOfBoundsKill = true;	
	
	return enemy;
}

EnemyGroup.prototype.getEnemyLevel = function(key) {
	for (var i = 0; i < this._levels.length; i++) {
		if (key.search(this._levels[i]) !== -1) {
			var level = i+1;
			break;
		}
	}
	return level;
};

module.exports = EnemyGroup;