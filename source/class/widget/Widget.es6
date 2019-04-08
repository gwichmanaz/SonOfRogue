import * as PIXI from 'pixi.js';

module.exports = class Widget {
	constructor (stage) {
		this.container = new PIXI.Container();
		stage.addChild(this.container);
	}
}


