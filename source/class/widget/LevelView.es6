const PIXIUtils = require('../../object/PixiUtils.es6');
const Widget = require('./Widget.es6');

module.exports = class LevelView extends Widget {
	setLevel(level) {
		level.ready.then(() => {
			const {w, h} = level.getSize();
			for (let x = 0; x < w; x++) {
				for (let y = 0; y < h; y++) {
					const cell = level.getCellAt(x, y);
					const sprite = this.display.getSpriteForCell(cell);
					sprite.x = x * 16;
					sprite.y = y * 16;
					sprite.name = `${level.id}_${x}_${y}`;
					if (cell.interactive) {
						this.makeInteractive(cell, sprite, x, y);
					}
					this.container.addChild(sprite);
					cell.onStateChange(() => {
						this.cellStateChanged(cell, sprite);
					});
				}
			}
		});
	}
	makeInteractive(cell, sprite, x, y) {
		var display = this.display;
		sprite.interactive = true;
		sprite.mousedown = sprite.touchstart = function () {
			sprite.isDown = true;
		}
		sprite.mouseup = sprite.touchend = function () {
			console.log("Mouse up on", sprite);
			sprite.isDown = false;
			if (sprite.isOver) {
				cell.interact(display.event, x, y);
			}
		}
		sprite.mouseover = function () {
			this.isOver = true;
		}
		sprite.mouseout = function () { 
			this.isOver = false;
		}
	}
	cellStateChanged(cell, sprite) {
		sprite.setTexture(this.display.getTextureForCell(cell));
	}
}
