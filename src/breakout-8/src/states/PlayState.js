import {
	CANVAS_HEIGHT,
	CANVAS_WIDTH,
	context,
	keys,
	sounds,
	stateMachine,
	TILE_SIZE
} from "../globals.js";
import State from "./State.js";
import PowerUp from "../PowerUp.js";
import Ball from "../Ball.js";

/**
 * Represents the state of the game in which we are actively playing;
 * player should control the paddle, with the ball actively bouncing between
 * the bricks, walls, and the paddle. If the ball goes below the paddle, then
 * the player should lose one point of health and be taken either to the Game
 * Over screen if at 0 health or the Serve screen otherwise.
 */
export default class PlayState extends State {
	constructor() {
		super();

		this.baseScore = 10;
		this.balls = [];
		this.powerUps = [];
	}

	enter(parameters) {
		this.paddle = parameters.paddle;
		this.bricks = parameters.bricks;
		this.health = parameters.health;
		this.score = parameters.score;
		this.ball = parameters.ball;
		this.balls = [];
		this.balls.push(this.ball);
		this.userInterface = parameters.userInterface;
		this.level = parameters.level;
		this.powerUps = [];
	}

	checkVictory() {
		/**
		 * The every method executes the provided callback function once for
		 * each element present in the array until it finds the one where callback
		 * returns a falsy value. If such an element is found, the every method
		 * immediately returns false. Otherwise, if callback returns a truthy value
		 * for all elements, every returns true.
		 *
		 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/every
		 */
		return this.bricks.every(brick => !brick.inPlay);
	}

	update(dt) {
		if (this.paused) {
			if (keys.p) {
				keys.p = false;
				this.paused = false;
				sounds.pause.play();
			}
			else {
				return;
			}
		}
		else if (keys.p) {
			keys.p = false;
			this.paused = true;
			sounds.pause.play();
			return;
		}

		this.balls.forEach((ball) => {
			if (ball.didCollide(this.paddle)) {
				// Flip y velocity and reset position to on top of the paddle.
				ball.dy *= -1;
				ball.y = CANVAS_HEIGHT - TILE_SIZE * 2 - TILE_SIZE / 2;

				// Vary the angle of the ball depending on where it hit the paddle.
				ball.handlePaddleCollision(this.paddle);
				sounds.paddleHit.play();
			};

			this.bricks.forEach((brick) => {
				if (brick.inPlay && ball.didCollide(brick)) {
					this.score += this.baseScore * (brick.tier + 1);

					// Update the paddle size based on the new score
					this.paddle.updateSize(this.score);

					// Update the UI to reflect the new score
					this.userInterface.update(this.health, this.score);

					// Call the brick's hit function, which removes it from play.
					brick.hit();

					// Randomly spawn a power-up when brick is hit
					if (this.powerUps.length < 3 && Math.random() < 1) { // Limit to 3 active power-ups
						const newPowerUp = new PowerUp(brick.x, brick.y);
						this.powerUps.push(newPowerUp);
					}

					if (this.checkVictory()) {
						sounds.victory.play();

						stateMachine.change('victory', {
							level: this.level,
							paddle: this.paddle,
							health: this.health,
							score: this.score,
							ball: ball,
							userInterface: this.userInterface,
						});
					}

					this.ball.handleBrickCollision(brick);
				}
			});

		if(ball.didFall()){
			this.balls.splice(this.balls.indexOf(ball), 1);
		}

		if (ball.didFall() && this.balls.length < 1) {
			this.health--;
			this.userInterface.update(this.health, this.score);
			sounds.hurt.play();


			this.paddle.shrinkOnLifeLoss();

			if (this.health === 0) {
				stateMachine.change('game-over', {
					score: this.score,
				});
			}
			else {
				stateMachine.change('serve', {
					paddle: this.paddle,
					ball: ball,
					bricks: this.bricks,
					health: this.health,
					score: this.score,
					userInterface: this.userInterface,
					level: this.level,
				});
			}
		}
	});

		this.paddle.update(dt);
		this.balls.forEach((ball) => {
			ball.update(dt);
		});


		for (let i = this.powerUps.length - 1; i >= 0; i--) {
			const powerUp = this.powerUps[i];
			powerUp.update(dt); // Make the power-up fall

			// Check if the power-up collides with the paddle
			if (powerUp.didCollide(this.paddle)) {
				this.activatePowerUp(powerUp);
				this.powerUps.splice(i, 1);
			}

			// Power-up falls off the screen
			if (powerUp.didFall()) {
				this.powerUps.splice(i, 1);
			}
		}

		this.bricks.forEach((brick) => {
			brick.update(dt);
		});



	}

	activatePowerUp(powerUp) {
		if (powerUp.type === 'multi-ball') {
			const ball1 = new Ball();
			const ball2 = new Ball();
			ball1.x = this.ball.x;
			ball1.y = this.ball.y;

			ball1.x = this.ball.x;
			ball1.y = this.ball.y;

			// Add the new balls to the balls array
			this.balls.push(ball1, ball2);
		}
	}



	render() {
		this.userInterface.render();
		this.paddle.render();

		this.balls.forEach((ball) => {
			ball.render();
		});

		this.bricks.forEach((brick) => {
			brick.render();
		});

		this.powerUps.forEach((powerUp) => {
			powerUp.render();
		});

		if (this.paused) {
			context.save();
			context.font = "50px Joystix";
			context.fillStyle = "white";
			context.textBaseline = 'middle';
			context.textAlign = 'center';
			context.fillText(`⏸`, CANVAS_WIDTH * 0.5, CANVAS_HEIGHT * 0.5);
			context.restore();
		}
	}
}
