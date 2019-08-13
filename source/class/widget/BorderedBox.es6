const PIXI = require("pixi.js");
const Widget = require('./Widget.es6');

module.exports = class BorderedBox extends Widget {
	constructor (display, eventBus, props) {
		super(display, eventBus, props);
		this.addBox(0x000000, 0, 0, props.w, props.h);
		this.addBox(0x555555, 1, 1, props.w - 2, props.h - 2);
		this.addBox(0xAAAAAA, 2, 2, props.w - 4, props.h - 4);
		this.addBox(0xFFFFFF, 3, 3, props.w - 6, props.h - 6);
		this.addBox(0xAAAAAA, 5, 5, props.w - 10, props.h - 10);
		this.addBox(0x555555, 6, 6, props.w - 12, props.h - 12);
		this.addBox(0x000000, 7, 7, props.w - 14, props.h - 14);
		this.addBox(0xAAAAAA, 8, 8, props.w - 16, props.h - 16);
	}
}
