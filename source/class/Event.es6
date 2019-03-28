module.exports = class Event {
	constructor() {
		this.handlers = {};
	}
	static promisify(func) {
		return function () {
			var args = Array.prototype.slice.call(arguments);
			return Promise.resolve().then(()=> func.apply(func, args));
		};
	}
	// TODO
	static onceify(func) {
	}
	/**
	 * fire the named event, along with optional payload
	 * return a promise that resolves when all handlers have completed
	 */
	fire(eventName, payload) {
		if (!(this.handlers[eventName] && this.handlers[eventName].length)) {
			return Promise.resolve();
		}
		return Promise.all(this.handlers[eventName].map(handler => {
			return handler(payload);
		}));
	}
	/**
	 * add a hander for an event
	 */
	on(eventName, handler) {
		// make sure we replace if called multiple
		this.off(eventName, handler);
		this.handlers[eventName] = this.handlers[eventName] || [];
		this.handlers[eventName].push(Event.promisify(handler));
	}
	off(eventName, handler) {
		if (this.handlers[eventName]) {
			var position = this.handlers.indexOf(handler);
			if (position != -1) {
				this.handlers.splice(position, 1);
			}
		}
	}
	once(eventName, handler) {
	}
}
