const PIXIUtils = require('../../object/PixiUtils.es6');
const Widget = require('./Widget.es6');

const MAP_ZINDEX = 0;
const ARTIFACT_ZINDEX = 1;
const CREATURE_ZINDEX= 2;

module.exports = class LevelView extends Widget {
	setParty(party) {
		party.forEach((member) => {
			const sprite = this.display.getSpriteForCreature(member);
			sprite.zIndex = CREATURE_ZINDEX;
			this.updatePosition(member, sprite);
			member.onPositionChange(() => {
				this.updatePosition(member, sprite);
			});
			this.container.addChild(sprite);
		});
	}
	updatePosition(creature, sprite) {
		console.log("PLACING CREATURE SPRITE AT", creature.getPosition());
		sprite.x = creature.getPosition().x * 16;
		sprite.y = creature.getPosition().y * 16;
		// TODO: don't call this unless we really mean it.
		this.container.ensureVisible(sprite.x, sprite.y, 16, 16);
	}
	setLevel(level) {
		const {w, h} = level.getSize();
		for (let x = 0; x < w; x++) {
			for (let y = 0; y < h; y++) {
				const cell = level.getCellAt(x, y);
				const sprite = this.display.getSpriteForCell(level, cell, x, y);
				sprite.x = x * 16;
				sprite.y = y * 16;
				sprite.name = `${level.id}_${x}_${y}`;
				sprite.zIndex = MAP_ZINDEX;
				if (cell.interactive) {
					this.makeInteractive(cell, sprite, x, y);
				}
				this.container.addChild(sprite);
				cell.onStateChange(() => {
					this.cellStateChanged(level, cell, x, y, sprite);
				});
			}
		}
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
				cell.interact(display.game, x, y);
			}
		}
		sprite.mouseover = function () {
			this.isOver = true;
		}
		sprite.mouseout = function () {
			this.isOver = false;
		}
	}
	cellStateChanged(level, cell, x, y, sprite) {
		sprite.texture = this.display.getTextureForCell(level, cell, x, y);
	}
}
