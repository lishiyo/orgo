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
			bg: "#333"
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
