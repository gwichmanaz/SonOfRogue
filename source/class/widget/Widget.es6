const PIXI = require("pixi.js");

module.exports = class Widget {
	constructor (display, eventBus, props, parent) {
		var stage = display.app.stage;
		this.display = display;
		this.x = props.x;
		this.y = props.y;

		if (parent) {
			// Children widgets share parent container
			this.container = parent.container;
			this.x += parent.x;
			this.y += parent.y;
		} else {
			this.container = new PIXI.Container();
			const graphics = new PIXI.Graphics();
			graphics.beginFill(0xFF3300);
			graphics.drawRect(props.x, props.y, props.w, props.h);
			graphics.endFill();
			this.container.mask = graphics;
			stage.addChild(this.container);
		}
		this.event = eventBus;
	}

	addChild (child, x, y, container) {
		const targetContainer = container || this.container;
		targetContainer.addChild(child);
		child.x = this.x + x;
		child.y = this.y + y;
	}

	addBox (color, x, y, w, h, container) {
		const box = new PIXI.Graphics();
		box.beginFill(color);
		box.drawRect(0, 0, w, h);
		box.endFill();
		this.addChild(box, x, y, container);
		return box;
	}

	addText (x, y, styleObject, container) {
		const style = new PIXI.TextStyle(styleObject);
		const text = new PIXI.Text('', style);
		this.addChild(text, x, y, container);
		if (styleObject.centered) {
			text.anchor.set(0.5, 0);
		}
		return text;
	}
}
