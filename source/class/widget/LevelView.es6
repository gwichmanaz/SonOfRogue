const PIXIUtils = require('../../object/PixiUtils.es6');
const Widget = require('./Widget.es6');

const MAP_ZINDEX = 0;
const ARTIFACT_ZINDEX = 1;
const CREATURE_ZINDEX= 2;
const CELL_WIDTH = 16;
const CELL_HEIGHT = 16;

module.exports = class LevelView extends Widget {
	updatePosition(creature, sprite, pos) {
		pos = pos || creature.getPosition();
		sprite.x = pos.x * CELL_WIDTH;
		sprite.y = pos.y * CELL_HEIGHT;
		// TODO: don't call this unless we really mean it.
		// this.container.ensureVisible(sprite.x, sprite.y, CELL_WIDTH, CELL_HEIGHT);
	}
	// Makes sure this sprite is visible within the view
	scrollToSprite(sprite) {
		this.container.ensureVisible(sprite.x, sprite.y, CELL_WIDTH, CELL_HEIGHT);
	}
	setCreature(creature) {
		const sprite = this.display.getSpriteForCreature(creature);
		sprite.zIndex = CREATURE_ZINDEX;
		this.updatePosition(creature, sprite);
		creature.onPositionChange((pos) => {
			this.updatePosition(creature, sprite, pos);
		});
		creature.onDemise(() => {
			this.container.removeChild(sprite);
		});
		this.container.addChild(sprite);
	}
	setLevel(level) {
		const {w, h} = level.getSize();
		for (let x = 0; x < w; x++) {
			for (let y = 0; y < h; y++) {
				const cell = level.getCellAt(x, y);
				const sprite = this.display.getSpriteForCell(level, cell, x, y);
				sprite.x = x * CELL_WIDTH;
				sprite.y = y * CELL_HEIGHT;
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
		// Build sprites for all the creatures currently on the level
		level.getCreatures().forEach(this.setCreature.bind(this));

		// And build a new sprite for any new creature that might show up.
		level.bus.on("addCreature", this.setCreature.bind(this));
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
