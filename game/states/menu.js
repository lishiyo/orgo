'use strict';
function Menu() {}

Menu.prototype = {
  preload: function() {

  },
  create: function() { 
		// tween
		var nameLabel = this.game.add.text(this.game.world.centerX, 100, 'attack of the molecules', { font: '50px Lato', fill: '#fff' });
		nameLabel.anchor.setTo(0.5, 0.5);
		nameLabel.scale.setTo(0, 0);
		this.game.add
			.tween(nameLabel.scale).delay(200).to({x: 1, y: 1}, 1000)
			.easing(Phaser.Easing.Bounce.Out).start();

		// display score if any
		if (this.game.global.score > 0) {
			var scoreLabel = this.game.add.text(this.game.world.centerX, this.game.world.centerY, 'score: ' + this.game.global.score, { font: '25px Lato', fill: '#ffffff' });
			scoreLabel.anchor.setTo(0.5, 0.5);				
		}

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
