import * as PIXI from 'pixi.js';
const LevelView = require('../class/widget/LevelView.es6');

const TEXTURES = [
	// DUNGEON SPRITES
	{ id: 'wall', file: 'asset/dungeonSprites/Wall-X.png'},
	{ id: 'wall-', file: 'asset/dungeonSprites/Wall-X.png'},
	{ id: 'wall-b', file: 'asset/dungeonSprites/Wall-b.png'},
	{ id: 'wall-br', file: 'asset/dungeonSprites/Wall-br.png'},
	{ id: 'wall-l', file: 'asset/dungeonSprites/Wall-l.png'},
	{ id: 'wall-lb', file: 'asset/dungeonSprites/Wall-lb.png'},
	{ id: 'wall-lbr', file: 'asset/dungeonSprites/Wall-lbr.png'},
	{ id: 'wall-lr', file: 'asset/dungeonSprites/Wall-lr.png'},
	{ id: 'wall-r', file: 'asset/dungeonSprites/Wall-r.png'},
	{ id: 'wall-t', file: 'asset/dungeonSprites/Wall-t.png'},
	{ id: 'wall-tb', file: 'asset/dungeonSprites/Wall-tb.png'},
	{ id: 'wall-tbr', file: 'asset/dungeonSprites/Wall-tbr.png'},
	{ id: 'wall-tl', file: 'asset/dungeonSprites/Wall-tl.png'},
	{ id: 'wall-tlb', file: 'asset/dungeonSprites/Wall-tlb.png'},
	{ id: 'wall-tlbr', file: 'asset/dungeonSprites/Wall-tlbr.png'},
	{ id: 'wall-tlr', file: 'asset/dungeonSprites/Wall-tlr.png'},
	{ id: 'wall-tr', file: 'asset/dungeonSprites/Wall-tr.png'},
	{ id: 'floor', file: 'asset/dungeonSprites/Gravel.png'},
	{ id: 'void', file: 'asset/dungeonSprites/Void.png'},
	{ id: 'door-closed', file: 'asset/dungeonSprites/Door-Closed.png'},
	{ id: 'door-open', file: 'asset/dungeonSprites/Door-Open.png'},

	// HERO SPRITES -- TODO: lots to make this animatable
	{ id: 'Human', file: 'asset/heroSprites/standin.png'},

	// CREATURE SPRITES
];

module.exports = {
	init() {
		this.widgets = {};
		this.app = new PIXI.Application({width: 600, height: 400 });
		document.body.appendChild(this.app.view);
		return this.__loadTextures().then(() => this.__initUI());
	},

	__loadTextures() {
		TEXTURES.forEach(s => PIXI.loader.add(s.id, s.file));
		return new Promise(r => {
			PIXI.loader.load(r);
		});
	},

	__initUI () {
		this.widgets.levelView = new LevelView(this, this.event);
	},

	getTextureForCell(level, cell, x, y) {
		var textureId = cell.cellType;
		var cellState = cell.getState(level, x, y);
		if (cellState) {
			textureId += "-" + cellState;
		}
		if (PIXI.loader.resources[textureId]) {
			return PIXI.loader.resources[textureId].texture;
		}
		throw new Error(`No texture loaded for ${textureId}`);
	},

	getSpriteForCell(level, cell, x, y) {
		return new PIXI.Sprite(this.getTextureForCell(level, cell, x, y));
	},

	getTextureForCreature(creature) {
		var textureId = creature.getCreatureType();
		// TODO: more detail, ultimately a creature might consist of multiple sprites
		return PIXI.loader.resources[textureId].texture;
	},

	getSpriteForCreature(creature) {
		return new PIXI.Sprite(this.getTextureForCreature(creature));
	},

	setGame(game) {
		this.game = game;
		this.event = game.event;
		this.event.on("gameReady", () => {
			this.setLevel(game.getLevel());
			this.setParty(game.getParty());
		});
	},

	setLevel(level) {
		this.widgets.levelView.setLevel(level);
	},

	setParty(party) {
		this.widgets.levelView.setParty(party);
	},
}
