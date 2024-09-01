import {
	CANVAS_HEIGHT,
	CANVAS_WIDTH,
	sounds,
	TILE_SIZE
} from "./globals.js";
import SpriteManager from "./SpriteManager.js";
import { getRandomNegativeNumber, getRandomNumber, getRandomPositiveNumber } from "./utils.js";

/**
 * Represents a ball which will bounce back and forth between the sides
 * of the world space, the player's paddle, and the bricks laid out above
 * the paddle. The ball can have a colour, which is chosen at random, just
 * for visual variety.
 */
export default class Ball {
	constructor() {
		this.x = CANVAS_WIDTH / 2 - TILE_SIZE / 4;
		this.y = CANVAS_HEIGHT - TILE_SIZE * 8;
		this.width = TILE_SIZE / 2;
		this.height = TILE_SIZE / 2;
		this.dx = getRandomNumber(0, 200);
		this.dy = getRandomNegativeNumber(90, 110);

		this.colour = Math.floor(getRandomPositiveNumber(0, 5));
		this.sprites = SpriteManager.generateBallSprites();
	}

	reset() {
		this.dx = 0;
		this.dy = 0;
		this.x = CANVAS_WIDTH / 2 - TILE_SIZE / 2;
		this.y = CANVAS_HEIGHT / 2 - TILE_SIZE / 2;
	}

	/**
	 * AABB collision detection that expects a target
	 * which will have an X, Y, width, and height values.
	 *
	 * @param {Object} target
	 * @returns Whether the ball collided with the target or not.
	 */
	didCollide(target) {
		/**
		 * First, check to see if the left edge of either is
		 * farther to the right than the right edge of the other.
		 * Then check to see if the bottom edge of either is
		 * higher than the top edge of the other.
		 */
		if (this.x + this.width >= target.x
			&& this.x <= target.x + target.width
			&& this.y + this.height >= target.y
			&& this.y <= target.y + target.height) {
			return true;
		}

		// If the above isn't true, they're overlapping.
		return false;
	}

	// Allows the ball to bounce off the walls and ceiling.
	checkEdges() {
		if (this.x <= 0) {
			this.x = 0;
			this.dx = -this.dx;
			sounds.wallHit.play();
		}

		if (this.x >= CANVAS_WIDTH - TILE_SIZE / 2) {
			this.x = CANVAS_WIDTH - TILE_SIZE / 2;
			this.dx = -this.dx;
			sounds.wallHit.play();
		}

		if (this.y <= 0) {
			this.y = 0;
			this.dy = -this.dy;
			sounds.wallHit.play();
		}
	}

	update(dt) {
		this.checkEdges();

		this.x += this.dx * dt;
		this.y += this.dy * dt;
	}

	render() {
		this.sprites[this.colour].render(this.x, this.y);
	}
}
