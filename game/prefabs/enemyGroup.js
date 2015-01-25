'use strict';

var EnemyGroup = function(opts, game, parent) {
	Phaser.Group.call(this, game, parent);
	
	this.enableBody = true;	
	this._currLevel = 1;
	this._bossGenerated = {};
	this._levels = { 1: "1", 2: "2", 3: "3"};
	
	
	this.addEnemies(1);
	window.eg = this;
};


EnemyGroup.prototype = Object.create(Phaser.Group.prototype);
EnemyGroup.prototype.constructor = EnemyGroup;

EnemyGroup.prototype.update = function() {
  
};

EnemyGroup.prototype.dealDamage = function(enemy) {
	var level = this.getEnemyLevel(enemy.key);
	return 20 * level;
};

EnemyGroup.prototype.genBoss = function(level) {
	if (this._bossGenerated[level]) { return; }
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

	boss.health = level * 200;
	boss.body.collideWorldBounds = true;
	boss.body.bounce.set(0.75);
	
	// only create one boss per level
	this._bossGenerated[level] = true;
	
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