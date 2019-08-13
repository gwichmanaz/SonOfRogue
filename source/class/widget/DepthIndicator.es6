const Widget = require('./Widget.es6');

module.exports = class DepthIndicator extends Widget {
	constructor (display, eventBus, props, parent) {
		super(display, eventBus, props, parent);
		this.addBox(0xFFFFFF, 0, 0, props.w, props.h);
		this.depthText = this.addText(props.w / 2, 0, { fontFamily: 'mainFont', fontSize: 16, centered: true})
		this.depthText.text = '50ft';
	}
}
