import * as PIXI from 'pixi.js';
const PIXIUtils = require('./PixiUtils.es6');

const SPRITES = [
	{ id: 'wall', file: 'asset/dungeonSprites/Stone.png'},
	{ id: 'floor', file: 'asset/dungeonSprites/Gravel.png'},
	{ id: 'void', file: 'asset/dungeonSprites/Void.png'},
];

module.exports = {
	init() {
		this.app = new PIXI.Application({width: 800, height: 600});
		document.body.appendChild(this.app.view);
		return this.__loadSprites().then(() => this.__initUI());
	},

	__loadSprites() {
		SPRITES.forEach(s => PIXI.loader.add(s.id, s.file));
		return new Promise(r => {
			PIXI.loader.load(r);
		});
	},

	__initUI () {
		this.levelMapContainer = new PIXI.Container();
		this.app.stage.addChild(this.levelMapContainer);
	},

	setLevel(level) {
		// this.levelMapContainer.clear();
		const {w, h} = level.getSize();
		for (let x = 0; x < w; x++) {
			for (let y = 0; y < h; y++) {
				const cell = level.getCell(x, y);
				const sprite = PIXIUtils.createSprite(cell.spriteId);
				sprite.x = x * 16;
				sprite.y = y * 16;
				this.levelMapContainer.addChild(sprite);
			}
		}
	}
}