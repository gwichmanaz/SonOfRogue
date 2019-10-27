const Viewport = require("pixi-viewport");
const PIXIUtils = require('../../object/PixiUtils.es6');
const Widget = require('./Widget.es6');
const Config = require('../../object/Config.es6');

const MAP_ZINDEX = 0;
const ARTIFACT_ZINDEX = 1;
const CREATURE_ZINDEX= 2;
const CELL_WIDTH = 16;
const CELL_HEIGHT = 16;

module.exports = class LevelView extends Widget {
	constructor (display, eventBus, props) {
		super(display, eventBus, props);
		this.viewport = new Viewport({
			screenWidth: props.w,
			screenHeight: props.h,
			worldWidth: 1000,
			worldHeight: 1000
		});
		this.viewport.drag().pinch().decelerate().bounce();
		this.container.addChild(this.viewport);
	}

	updatePosition(creature, sprite, pos) {
		pos = pos || creature.getPosition();
		sprite.x = pos.x * CELL_WIDTH;
		sprite.y = pos.y * CELL_HEIGHT;
	}
	// Makes sure this sprite is visible within the view
	scrollToSprite(sprite) {
		this.viewport.ensureVisible(sprite.x, sprite.y, CELL_WIDTH, CELL_HEIGHT);
	}
	// Puts this sprite as close to center of view as possible
	centerSprite(sprite) {
		var halfWidth = (this.viewport.right - this.viewport.left - CELL_WIDTH) / 2,
			halfHeight = (this.viewport.bottom - this.viewport.top - CELL_HEIGHT) / 2;
		this.viewport.left = Math.max(0, sprite.x - halfWidth);
		this.viewport.top = Math.max(0, sprite.y - halfHeight);
	}
	setCreature(creature) {
		const sprite = this.display.getSpriteForCreature(creature);
		sprite.zIndex = CREATURE_ZINDEX;
		this.updatePosition(creature, sprite);
		creature.onPositionChange((pos) => {
			this.updatePosition(creature, sprite, pos);
		});
		creature.onRequestFocus(() => {
			this.centerSprite(sprite);
		});
		creature.onDemise(() => {
			this.viewport.removeChild(sprite);
		});
		this.viewport.addChild(sprite);
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
				this.viewport.addChild(sprite);
				cell.onStateChange(() => {
					this.cellStateChanged(level, cell, x, y, sprite);
				});
			}
		}
		this.viewport.worldWidth = w * CELL_WIDTH;
		this.viewport.worldHeight = h * CELL_HEIGHT;
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
