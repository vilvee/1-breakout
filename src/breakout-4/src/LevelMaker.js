import Brick from "./Brick.js";
import { CANVAS_WIDTH, TILE_SIZE } from "./globals.js";
import { getRandomPositiveNumber } from "./utils.js";

/**
 * Creates randomized levels for our Breakout game.
 * Returns an array of bricks that the game can render.
 */
export default class LevelMaker {
	static createMap() {
		const bricks = [];
		const numberOfRows = Math.floor(getRandomPositiveNumber(1, 5));
		const numberOfColumns = Math.floor(getRandomPositiveNumber(5, 10));
		const brickWidth = TILE_SIZE * 2;
		const brickHeight = TILE_SIZE;

		// Lay out bricks such that they touch each other and are centered horizontally.
		for (let y = 0; y < numberOfRows; y++) {
			for (let x = 0; x < numberOfColumns; x++) {
				const xOffset = (CANVAS_WIDTH - numberOfColumns * brickWidth) / 2;
				const yOffset = brickHeight * 2;

				bricks.push(new Brick(xOffset + (x * brickWidth), yOffset + (y * brickHeight)));
			}
		}

		return bricks;
	}
}
