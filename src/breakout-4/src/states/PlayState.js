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
	}

	enter(parameters) {
		this.paddle = parameters.paddle;
		this.bricks = parameters.bricks;
		this.health = parameters.health;
		this.score = parameters.score;
		this.ball = parameters.ball;
		this.userInterface = parameters.userInterface;
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

		if (this.ball.didCollide(this.paddle)) {
			// Flip y velocity and reset position to on top of the paddle.
			this.ball.dy *= -1;
			this.ball.y = CANVAS_HEIGHT - TILE_SIZE * 2 - TILE_SIZE / 2;

			// Vary the angle of the ball depending on where it hit the paddle.
			this.ball.handlePaddleCollision(this.paddle);

			sounds.paddleHit.play();
		}

		this.bricks.forEach((brick) => {
			if (brick.inPlay && this.ball.didCollide(brick)) {
				this.score += this.baseScore;

				// Call the brick's hit function, which removes it from play.
				brick.hit();

				this.ball.handleBrickCollision(brick);
			}
		});

		if (this.ball.didFall()) {
			this.health--;
			sounds.hurt.play();

			if (this.health === 0) {
				stateMachine.change('game-over', {
					score: this.score,
				});
			}
			else {
				stateMachine.change('serve', {
					paddle: this.paddle,
					ball: this.ball,
					bricks: this.bricks,
					health: this.health,
					score: this.score,
					userInterface: this.userInterface,
				});
			}
		}

		this.paddle.update(dt);
		this.ball.update(dt);
		this.userInterface.update(this.health, this.score);
	}

	render() {
		this.userInterface.render();
		this.paddle.render();
		this.ball.render();

		this.bricks.forEach((brick) => {
			if (brick.inPlay) {
				brick.render();
			}
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
