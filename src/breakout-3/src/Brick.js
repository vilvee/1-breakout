import { sounds, TILE_SIZE } from "./globals.js";
import SpriteManager from "./SpriteManager.js";
import { getRandomPositiveNumber } from "./utils.js";

export default class Brick {
	/**
	 * Represents a brick in the world space that the ball can collide with;
	 * differently coloured bricks have different point values. On collision,
	 * the ball will bounce away depending on the angle of collision. When all
	 * bricks are cleared in the current map, the player should be taken to a new
	 * layout of bricks.
	 *
	 * @param {Number} x
	 * @param {Number} y
	 */
	constructor(x, y) {
		this.x = x;
		this.y = y;
		this.width = TILE_SIZE * 2;
		this.height = TILE_SIZE;

		// Used to determine whether this brick should be rendered.
		this.inPlay = true;

		this.numberOfColours = 5;
		this.colour = Math.floor(getRandomPositiveNumber(0, this.numberOfColours - 1));
		this.sprites = SpriteManager.generateBrickSprites();
	}

	hit() {
		sounds.brickHit.play();
		this.inPlay = false;
	}

	render() {
		this.sprites[this.colour * (this.numberOfColours - 1)].render(this.x, this.y);
	}
}
