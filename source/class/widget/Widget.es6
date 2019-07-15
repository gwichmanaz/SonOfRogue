const PIXI = require("pixi.js");
const Viewport = require("pixi-viewport");

module.exports = class Widget {
	constructor (display, eventBus) {
		var stage = display.app.stage;
		this.display = display;
		this.container = new Viewport({ screenWidth: 600, screenHeight: 400 });
		this.container.drag().pinch().decelerate().bounce();
		this.event = eventBus;
		stage.addChild(this.container);
	}
}


