'use strict';
function Menu() {}

Menu.prototype = {
  preload: function() {

  },
  create: function() { 
		// tween
		var nameLabel = this.game.add.text(this.game.world.centerX, 100, 'attack of the molecules', { font: '50px Lato', fill: '#C8F526' });
		nameLabel.anchor.setTo(0.5, 0.5);
		nameLabel.scale.setTo(0, 0);
		this.game.add
			.tween(nameLabel.scale).delay(200).to({x: 1, y: 1}, 1000)
			.easing(Phaser.Easing.Bounce.Out).start();

		// instructions
		var startLabel = this.game.add.text(this.game.world.centerX, this.game.world.height-320, "Press ARROW KEYS to move", { font: '30px Lato', fill: '#f9f9f9', fontWeight: 'bold' });
		var startLabel2 = this.game.add.text(this.game.world.centerX, this.game.world.height-270, "Hold down two at the same time to rotate", { font: '30px Lato', fill: '#f9f9f9', fontWeight: 'bold' });
		var startLabel3 = this.game.add.text(this.game.world.centerX, this.game.world.height-220, "Press SPACEBAR to fire", { font: '30px Lato', fill: '#f9f9f9', fontWeight: 'bold' });
		
		var startLabel4 = this.game.add.text(this.game.world.centerX, this.game.world.height-100, "Press SPACEBAR to begin", { font: '30px Lato', fill: '#FCDC3B', fontWeight: 'bold' });
		startLabel.anchor.setTo(0.5, 0.5);	
		startLabel2.anchor.setTo(0.5, 0.5);	
		startLabel3.anchor.setTo(0.5, 0.5);	
		startLabel4.anchor.setTo(0.5, 0.5);	
		
		this.game.add
			.tween(startLabel4).to({alpha: 0}, 500)
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
