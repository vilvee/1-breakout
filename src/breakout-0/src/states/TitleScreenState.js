import {
	CANVAS_HEIGHT,
	CANVAS_WIDTH,
	context,
	images,
	keys,
	sounds
} from "../globals.js";
import State from "./State.js";

/**
 * Represents the state the game is in when we've just started; should
 * simply display "Breakout" in large text, as well as a menu to select
 * either "Start" or "High Scores".
 */
export default class TitleScreenState extends State {
	constructor() {
		super();
		this.highlighted = 1;
	}

	update(dt) {
		if (keys.w || keys.s) {
			keys.w = false;
			keys.s = false;
			this.highlighted = this.highlighted === 1 ? 2 : 1;
			sounds.paddleHit.play();
		}
	}

	render() {
		images.background.render(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

		context.save();
		context.font = "40px Joystix";
		context.fillStyle = "white";
		context.textBaseline = 'middle';
		context.textAlign = 'center';
		context.fillText(`BREAKOUT`, CANVAS_WIDTH * 0.5, CANVAS_HEIGHT * 0.5);
		context.font = "20px Joystix";

		// Set the fill style based on which option is highlighted.
		context.fillStyle = this.highlighted === 1 ? "cornflowerblue" : "white";
		context.fillText(`START`, CANVAS_WIDTH * 0.5, CANVAS_HEIGHT * 0.8);
		context.fillStyle = this.highlighted === 2 ? "cornflowerblue" : "white";
		context.fillText(`HIGH SCORES`, CANVAS_WIDTH * 0.5, CANVAS_HEIGHT * 0.9);
		context.restore();
	}
}
