/**
 * a control is a widget that shows the user something and may be interacted with
 */
const Widget = require('./Widget.es6');

module.exports = class Control extends Widget {
	constructor (type, display, eventBus, props, parent) {
		super(display, eventBus, props, parent);
		this.type = type;
		// TODO: create a box which will be the interactive area if there is one
		this.box = this.addBox();
		// TODO: based on type, make this interactive
		this.box.interactive = true;

		this.displayText = this.addText(props.w / 2, 0, { fontFamily: 'mainFont', fontSize: 16, centered: true});
	}
	setText(text) {
		this.displayText.text = text;
	}
	bindToKey(key) {
		// TODO: bind a key to this
	}
	interact() {
		// TODO: based on type -- pop a menu, toggle a state, or fire a command
	}
}
