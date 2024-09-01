import Graphic from "./Graphic.js";
import SoundPool from "./SoundPool.js";
import StateMachine from "./StateMachine.js";

/**
 * We initialize our game by grabbing the `canvas` element from
 * the DOM located in `index.html` and getting the `context` object
 * from it.
 */
export const canvas = document.createElement('canvas');
export const context = canvas.getContext('2d') || new CanvasRenderingContext2D();
export const CANVAS_WIDTH = 432;
export const CANVAS_HEIGHT = 243;
export const keys = {};

export const images = {
	background: new Graphic('./images/background.png', CANVAS_WIDTH, CANVAS_HEIGHT),
};

export const sounds = {
	// paddleHit: new Audio('./sounds/paddle_hit.wav'),
	paddleHit: new SoundPool('./sounds/paddle_hit.wav', 5, 0.5),
};

export const stateMachine = new StateMachine();
