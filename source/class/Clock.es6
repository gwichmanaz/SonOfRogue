var Event = require('./Event.es6');
module.exports = class Clock extends Event {
	constructor({resolution = 1000, eventName = "tick", running = false} = {}) {
		super();
		var count = 0;
		Object.assign(this, { resolution, eventName, running });
		setInterval(() => {
			if (this.running) {
				this.fire(this.eventName, count++);
			}
		}, this.resolution);
	}
	/**
	 * call this handler every time the clock ticks
	 */
	tick (handler) {
		this.on(this.eventName, handler);
	}
	/**
	 * set the running state of the clock (clock only ticks when it is running
	 */
	run (bool) {
		this.running = bool;
	}
	start () {
		this.running = true;
	}
	stop () {
		this.running = false;
	}
	/**
	 * return a Promise that resolves when a particular point has been reached
	 *
	 * clock.at(100).then(() => { console.log("clock reached 100 seconds"); });
	 */
	at (tick) {
		return new Promise((resolve, reject) => {
			var checktick = (count) => {
				if (count >= tick) {
					resolve(count);
					this.off(this.eventName, checktick);
				}
			};
			this.on(this.eventName, checktick);
		});
	}
}
