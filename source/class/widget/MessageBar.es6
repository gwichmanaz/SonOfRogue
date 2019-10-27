const Widget = require('./Widget.es6');

module.exports = class MessageBar extends Widget {
	constructor (display, eventBus, props) {
		super(display, eventBus, props);
		this.addBox(0x000000, 0, 0, props.w, props.h);
		this.addBox(0xAAAAAA, 1, 1, props.w - 2, props.h - 2);
		this.addBox(0xFFFFFF, 2, 2, props.w - 4, props.h - 4);
		this.messageText = this.addText(3, 2, { fontFamily: 'mainFont', fontSize: 16 })
		this.messageText.text = 'Welcome to the Dungeons of Doooom!';
		this.event.on("message", (text) => {
			// TODO: need to keep all the old messages and make it so we can open/close
			this.messageText.text = text;
		});
	}
}
