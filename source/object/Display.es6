import * as PIXI from 'pixi.js';
const LevelView = require('../class/widget/LevelView.es6');
const MessageBar = require('../class/widget/MessageBar.es6');
const BorderedBox = require('../class/widget/BorderedBox.es6');
const DepthIndicator = require('../class/widget/DepthIndicator.es6');
import Config from './Config.es6';

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
		this.app = new PIXI.Application({width: Config.gameWidth, height: Config.gameHeight });
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
		this.widgets.levelView = new LevelView(this, this.event, {x: 0, y: 0, w: Config.gameWidth, h: Config.stackLayout.viewport});
		this.widgets.messageBar = new MessageBar(this, this.event, {x: 0, y: Config.stackLayout.viewport, w: Config.gameWidth, h: Config.stackLayout.messageBox});
		this.widgets.footer = new BorderedBox(this, this.event, {x: 0, y: Config.stackLayout.viewport + Config.stackLayout.messageBox, w: Config.gameWidth, h: Config.stackLayout.lowerBox});
		this.widgets.depthIndicator = new DepthIndicator(this, this.event, {x: (Config.gameWidth / 2) - 31, y: 24, w: 62, h: 15}, this.widgets.footer);
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
