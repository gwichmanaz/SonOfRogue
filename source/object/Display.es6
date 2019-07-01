import * as PIXI from 'pixi.js';
const LevelView = require('../class/widget/LevelView.es6');

const TEXTURES = [
	// DUNGEON SPRITES
	{ id: 'wall', file: 'asset/dungeonSprites/Stone.png'},
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

	getTextureForCell(cell) {
		var textureId = cell.cellType;
		var cellState = cell.getState();
		if (cellState) {
			textureId += "-" + cellState;
		}
		return PIXI.loader.resources[textureId].texture;
	},

	getSpriteForCell(cell) {
		return new PIXI.Sprite(this.getTextureForCell(cell));
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
