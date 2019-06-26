const PIXIUtils = require('../../object/PixiUtils.es6');
const Widget = require('./Widget.es6');

module.exports = class LevelView extends Widget {
	setLevel(level) {
		level.ready.then(() => {
			const {w, h} = level.getSize();
			for (let x = 0; x < w; x++) {
				for (let y = 0; y < h; y++) {
					const cell = level.getCell(x, y);
					cell.getSprites().forEach((spriteId) => {
						const sprite = PIXIUtils.createSprite(spriteId);
						sprite.x = x * 16;
						sprite.y = y * 16;
						sprite.name = `${spriteId}_${x}_${y}`;
						this.container.addChild(sprite);
					});
				}
			}
		});
	}
}
