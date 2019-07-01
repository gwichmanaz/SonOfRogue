const PIXI = require("pixi.js");
const Viewport = require("pixi-viewport");

module.exports = class Widget {
	constructor (display, eventBus) {
		var stage = display.app.stage;
		this.display = display;
		this.container = new Viewport({ screenWidth: 500, screenHeight: 300 });
		this.container.drag().pinch().decelerate().bounce();
		this.container.x = 50;
		this.container.y = 50;
		this.event = eventBus;
		stage.addChild(this.container);
	}
}


