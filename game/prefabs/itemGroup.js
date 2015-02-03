'use strict';

var recycleItem = function(item, game){
	item.anchor.setTo(0.5, 0.5);
	item.reset(game.rnd.integerInRange(20, game.world.width-40), -item.height/2);
	item.body.velocity.y = 150;
	item.body.angularVelocity = 100;
	item.checkWorldBounds = true;
	item.outOfBoundsKill = true;
	
	// tween for effect
	game.add.tween(item.scale).to({x: 1.25, y: 1.25}, 400, Phaser.Easing.Sinusoidal.InOut, true, 0, 100, true);

	return item;
};

var getLevel = function(key) {
	var levels = ["1", "2", "3"];
	for (var i = 0; i < levels.length; i++) {
		if (key.search(levels[i]) !== -1) {
			var level = i+1;
			break;
		}
	}
	return level;
};

/**--- PILLS ---**/

var PillGroup = function(game, parent) {
	Phaser.Group.call(this, game, parent);
	this.game = game;
	this.enableBody = true;	
	this._keys = ['pillB', 'pillG', 'pillR'];
};

PillGroup.prototype = Object.create(Phaser.Group.prototype);
PillGroup.prototype.constructor = PillGroup;

PillGroup.prototype.createPills = function() {	
	for (var i = 0; i < this._keys.length; i++) {
		this.create(0, 0, this._keys[i], 1, false);
	}
	
	return this;
};
	
// recycle random pill
PillGroup.prototype.newPill = function() {	
	var pill = this.getRandom();				
	if (!pill) { return; }
	
	recycleItem(pill, this.game);
};

// pill restores HP back to 100% for that level
PillGroup.prototype.takePill = function(player, pill, level) {
	player.boostHealth(level);
	pill.kill();
};


/**--- SHIELDS ---**/

var ShieldGroup = function(game, parent) {
	Phaser.Group.call(this, game, parent);
	this.game = game;
	this.enableBody = true;	
	this._keys = ['shield1', 'shield2', 'shield3'];
};

ShieldGroup.prototype = Object.create(Phaser.Group.prototype);
ShieldGroup.prototype.constructor = ShieldGroup;

ShieldGroup.prototype.createShields = function() {	
	var freq = 20; // 20 bronze, 12 silver, 4 gold
	for (var i = 0; i < this._keys.length; i++) {		
		this.createMultiple(freq, this._keys[i]);
		freq -= 8;
	}
	
	return this;
};
	
// recycle random shield
ShieldGroup.prototype.newShield = function() {	
	var shield = this.getRandom();				
	if (!shield) { return; }
	
	recycleItem(shield, this.game);
};

// shield raises player HP max
ShieldGroup.prototype.takeShield = function(player, shield, level) {
	var shieldLevel = getLevel(shield.key);	
	var shieldBoost = shieldLevel * 25;
	player.boostHealth(level, shieldBoost);
	
	shield.kill();
};


/**--- COINS ---**/

var CoinGroup = function(game, parent) {
	Phaser.Group.call(this, game, parent);
	this.game = game;
	this.enableBody = true;	
	this._keys = ['coin1', 'coin2', 'coin3'];
};

CoinGroup.prototype = Object.create(Phaser.Group.prototype);
CoinGroup.prototype.constructor = CoinGroup;

CoinGroup.prototype.createCoins = function() {	
	var freq = 20; // 20 bronze, 12 silver, 4 gold
	for (var i = 0; i < this._keys.length; i++) {		
		this.createMultiple(freq, this._keys[i]);
		freq -= 8;
	}
	
	return this;
};


// recycle random coin
CoinGroup.prototype.newCoin = function() {	
	var coin = this.getRandom();				
	if (!coin) { return; }
	
	coin.anchor.setTo(0.5, 0.5);
	coin.reset(this.game.rnd.integerInRange(20, this.game.world.width-40), -coin.height/2);
	coin.body.velocity.y = 150;
	coin.body.angularVelocity = 100;
	coin.checkWorldBounds = true;
	coin.outOfBoundsKill = true;
	
	return coin;
};

// shield raises player HP max
CoinGroup.prototype.takeCoin = function(player, coin) {
	var level = getLevel(coin.key);
	this.game.global.score += (level * 50);
	
	coin.kill();
};

var ItemGroup = {
	pills: PillGroup,
	shields: ShieldGroup,
	coins: CoinGroup
};


module.exports = ItemGroup;