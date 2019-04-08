const PIXIUtils = require('../../object/PixiUtils.es6');
const Widget = require('./Widget.es6');

module.exports = class LevelView extends Widget {
	setLevel(level) {
		const {w, h} = level.getSize();
		for (let x = 0; x < w; x++) {
			for (let y = 0; y < h; y++) {
				const cell = level.getCell(x, y);
				const sprite = PIXIUtils.createSprite(cell.spriteId);
				sprite.x = x * 16;
				sprite.y = y * 16;
				this.container.addChild(sprite);
			}
		}
	}
}
