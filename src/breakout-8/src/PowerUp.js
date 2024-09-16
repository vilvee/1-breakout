import {
	CANVAS_HEIGHT,
	CANVAS_WIDTH,
	keys,
	TILE_SIZE
} from "./globals.js";
import SpriteManager from "./SpriteManager.js";


export default class PowerUp {
	constructor(x, y) {
		this.x = x;
		this.y = y;
		this.width = TILE_SIZE;
		this.height = TILE_SIZE;
		this.dy = 50;
		this.sprites = SpriteManager.generatePowerUpSprites();
		this.collected = false;
		this.type = 'multi-ball';
	}

	update(dt) {
		this.y += this.dy * dt;
	}

	render() {
		this.sprites[0].render(this.x, this.y);
	}

	didCollide(paddle) {
		if (this.x + this.width >= paddle.x &&
			this.x <= paddle.x + paddle.width &&
			this.y + this.height >= paddle.y &&
			this.y <= paddle.y + paddle.height) {
			return true;
		}
		return false;
	}

	didFall() {
		return this.y > CANVAS_HEIGHT;
	}
}
