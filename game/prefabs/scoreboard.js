'use strict';

var Scoreboard = function(game) {
	
	var gameover;
	
  Phaser.Group.call(this, game);

  gameover = this.create(this.game.width/2, 100, 'gameover');
	gameover.anchor.setTo(0.5, 0.5);
	
  this.scoreboard = this.create(this.game.width/2, 200, 'scoreboard');
	this.scoreboard.anchor.setTo(0.5, 0.5);
	
	this.scoreText = this.game.add.bitmapText(this.scoreboard.width, 180, 'flappyfont', '', 18);
	this.add(this.scoreText);
	
	this.bestScoreText = this.game.add.bitmapText(this.scoreboard.width, 230, 'flappyfont', '', 18);
  this.add(this.bestScoreText);
	
	// add start button with a callback
	this.startButton = this.game.add.button(this.game.width/2, 300, 'startButton', this.startClick, this);
  this.startButton.anchor.setTo(0.5,0.5);
  this.add(this.startButton);

  this.y = this.game.height;
  this.x = 0;
};

Scoreboard.prototype = Object.create(Phaser.Group.prototype);
Scoreboard.prototype.constructor = Scoreboard;

Scoreboard.prototype.update = function() {
  
  // write your prefab's specific update code here
  
};

Scoreboard.prototype.show = function(score){
	var medal, bestScore;
	// update scoreText displayed by text object
	this.scoreText.setText(score.toString());
	
	if (!!localStorage) {
		// localStorage exists
		bestScore = localStorage.getItem('bestScore');
		// if no bestScore yet, or less than current bestScore, reset
		if (!bestScore || bestScore < score) {
			bestScore = score;
			console.log(bestScore);
			localStorage.setItem('bestScore', bestScore);
		}
	} else { // fallback
		bestScore = 'N/A'
	}
	
	this.bestScoreText.setText(bestScore.toString());
	
	// determine whether or not to show medal
	if (score >= 10 && score < 20)
		{
			// position medal relative to the scoreboard sprite origin
			medal = this.game.add.sprite(-65, 7, 'medals', 1);
			medal.anchor.setTo(0.5, 0.5);
			this.scoreboard.addChild(medal);
		} else if (score >= 20) {
			medal = this.game.add.sprite(-65, 7, 'medals', 0);
			medal.anchor.setTo(0.5, 0.5);
			this.scoreboard.addChild(medal);
		}
	
	if (medal) { // start a particle emitter to display 'shinies'
		// x position, y position, num of particles
		var emitter = this.game.add.emitter(medal.x, medal.y, 400);
		this.scoreboard.addChild(emitter);
		emitter.width = medal.width;
		emitter.height = medal.height;
		
		emitter.makeParticles('particle');
		emitter.setRotation(-100, 100);
		emitter.setXSpeed(0, 0);
		emitter.setYSpeed(0, 0);
		emitter.minParticleScale = 0.25;
		emitter.maxParticleScale = 0.5;
		emitter.setAll('body.allowGravity', false);
		
		// emitter.start(explode, lifespan, frequency, quantity)
		// don't emit everything at once, but 1 particle per second with lifespan of 1 second
		emitter.start(false, 1000, 1000);
		
	}
	// start at current value and tween to y: 0
	// duration, easing function, autoStart (default false)
	this.game.add.tween(this).to({y: 0}, 1000, Phaser.Easing.Bounce.Out, true);
};

// when start button is clicked, restart play state
Scoreboard.prototype.startClick = function(){
	this.game.state.start('play');
}

module.exports = Scoreboard;
