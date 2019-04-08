import * as PIXI from 'pixi.js';

module.exports = {
	createSprite(spriteId) {
		return new PIXI.Sprite(PIXI.loader.resources[spriteId].texture);
	}
}
