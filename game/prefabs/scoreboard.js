'use strict';

var Scoreboard = function(game, won) {	
  Phaser.Group.call(this, game);
	this.game = game;
	var w = this.game.world.width,
			h = this.game.world.height;
	
	if (won) {
		var gameover = this.game.add.text(w/2, 100, 'YOU WON!!', { font: '50px Lato', fill: '#FCDC3B', fontWeight: 'bold italic'});
	} else {
		var gameover = this.game.add.text(w/2, 100, 'GAME OVER', { font: '50px Lato', fill: '#FCDC3B', fontWeight: 'bold italic'});
	}
	gameover.anchor.setTo(0.5, 0.5);
	this.add(gameover);
	
	this.scoreText = this.game.add.text(w/2, 230, '', { font: '28px Lato', fill: '#fff', fontWeight: 'bold'});
	this.scoreText.anchor.setTo(0.5, 0.5);
	this.add(this.scoreText);
	
	this.bestScoreText = this.game.add.text(w/2, 280, '', { font: '28px Lato', fill: '#fff', fontWeight: 'bold'});
	this.bestScoreText.anchor.setTo(0.5, 0.5);
  this.add(this.bestScoreText);
	
	// add start button with a callback
	this.startButton = this.game.add.button(w/2, 350, 'startButton', this.startClick, this);
  this.startButton.anchor.setTo(0.5,0.5);
  this.add(this.startButton);

  this.y = this.game.height;
  this.x = 0;
};

Scoreboard.prototype = Object.create(Phaser.Group.prototype);
Scoreboard.prototype.constructor = Scoreboard;

Scoreboard.prototype.show = function(score){
	var w = this.game.world.width,
			h = this.game.world.height;
	var medal, bestScore;
	this.scoreText.setText('NEW SCORE: ' + score.toString());
	
	if (!!localStorage) {
		// localStorage exists
		bestScore = localStorage.getItem('bestScore');
		// if no bestScore yet, or less than current bestScore, reset
		if (!bestScore || bestScore < score) {
			bestScore = score;
			localStorage.setItem('bestScore', bestScore);
		}
	} else { // fallback
		bestScore = 'N/A'
	}
	
	this.bestScoreText.setText('BEST SCORE: ' + bestScore.toString());
	
	// determine whether or not to show medal
	if (score >= 10 && score < 20)
		{
			medal = this.game.add.sprite(w/2, 165, 'medalBronze');
		} else if (score >= 20 && score < 30) {
			medal = this.game.add.sprite(w/2, 165, 'medalSilver');
		} else {
			medal = this.game.add.sprite(w/2, 165, 'medalGold');
		}
	
	if (medal) { // start a particle emitter to display 'shinies'
		medal.anchor.setTo(0.5, 0.5);
		this.addChild(medal);
		
		var emitter = this.game.add.emitter(medal.x, medal.y, 400);
		this.addChild(emitter);
		emitter.width = medal.width;
		emitter.height = medal.height;
		
		emitter.makeParticles('pixel');
		emitter.setRotation(-100, 100);
		emitter.setXSpeed(0, 0);
		emitter.setYSpeed(0, 0);
		emitter.minParticleScale = 0.25;
		emitter.maxParticleScale = 0.5;
		emitter.setAll('body.allowGravity', false);
		
		// emitter.start(explode, lifespan, frequency, quantity)
		emitter.start(false, 1000, 1000);
		
	}
	// start at current value and tween to y: 0
	// duration, easing function, autoStart (default false)
	this.game.add.tween(this).to({y: 0}, 1000, Phaser.Easing.Bounce.Out, true);

};

// when start button is clicked, restart play state
Scoreboard.prototype.startClick = function(){
	this.game.state.start('play');
};

module.exports = Scoreboard;
