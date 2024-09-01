import State from "./State.js";
import Paddle from "../Paddle.js";
import {
	CANVAS_HEIGHT,
	CANVAS_WIDTH,
	context,
	images,
	keys,
	sounds,
} from "../globals.js";

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
		this.paddle = new Paddle();
	}

	update(dt) {
		/**
		 * In short, "pausing" a game simply means to not run the
		 * update part of the game loop since we don't want any game
		 * logic to run while the game is paused. This is what the
		 * return statements are for below.
		 */
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

		this.paddle.update(dt);
	}

	render() {
		images.background.render(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
		this.paddle.render();

		if (this.paused) {
			context.save();
			context.font = "50px Joystix";
			context.fillStyle = "white";
			context.textBaseline = 'middle';
			context.textAlign = 'center';
			context.fillText(`PAUSED`, CANVAS_WIDTH * 0.5, CANVAS_HEIGHT * 0.5);
			context.restore();
		}
	}
}
