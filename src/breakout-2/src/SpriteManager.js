import { images, TILE_SIZE } from "./globals.js";
import Sprite from "./Sprite.js";

/**
 * This class is responsible for holding the functions to "cut up"
 * the sprite sheet into various quads that we'll need to render.
 */
export default class SpriteManager {
	/**
	 * Retrieves all sizes of paddle sprites from the sprite sheet.
	 *
	 * @returns An array of paddle sprites.
	 */
	static generatePaddleSprites() {
		const x = 0;
		let y = TILE_SIZE * 4;
		const sprites = [];

		for (let i = 0; i < 3; i++) {
			sprites.push(new Sprite(images.spriteSheet, x, y, TILE_SIZE * 2, TILE_SIZE)); // Small
			sprites.push(new Sprite(images.spriteSheet, x + TILE_SIZE * 2, y, TILE_SIZE * 4, TILE_SIZE)); // Medium
			sprites.push(new Sprite(images.spriteSheet, x + TILE_SIZE * 6, y, TILE_SIZE * 6, TILE_SIZE)); // Large
			sprites.push(new Sprite(images.spriteSheet, x, y + TILE_SIZE, TILE_SIZE * 8, TILE_SIZE)); // Huge

			y += TILE_SIZE * 2;
		}

		return sprites;
	}

	/**
	 * Retrieves all of ball sprites from the sprite sheet.
	 *
	 * @returns An array of ball sprites.
	 */
	static generateBallSprites() {
		let x = TILE_SIZE * 6;
		let y = TILE_SIZE * 3;
		const sprites = [];

		for (let i = 0; i < 3; i++) {
			sprites.push(new Sprite(images.spriteSheet, x, y, TILE_SIZE / 2, TILE_SIZE / 2));
			x += TILE_SIZE / 2;
		}

		x = TILE_SIZE * 6;
		y = TILE_SIZE * 3 + TILE_SIZE / 2;

		for (let i = 0; i < 2; i++) {
			sprites.push(new Sprite(images.spriteSheet, x, y, TILE_SIZE / 2, TILE_SIZE / 2));
			x += TILE_SIZE / 2;
		}

		return sprites;
	}
}
