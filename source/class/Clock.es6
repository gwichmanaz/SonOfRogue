var Event = require('./Event.es6');
module.exports = class Clock extends Event {
	constructor({resolution = 1000, eventName = "tick", running = true} = {}) {
		super();
		var count = 0;
		Object.assign(this, { resolution, eventName, running });
		setInterval(() => {
			if (this.running) {
				this.fire(this.eventName, count++);
			}
		}, this.resolution);
	}
	tick (handler) {
		this.on(this.eventName, handler);
	}
	run (bool) {
		this.running = bool;
	}
	start () {
		this.running = true;
	}
	stop () {
		this.running = false;
	}
}
