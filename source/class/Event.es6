/**
 * Basic event firing and listening functionality
 */
module.exports = class Event {
	constructor() {
		this.handlers = {};
		this.payloads = {};
	}
	/*
	 * given a function that may or may not return a promise,
	 * return a function that does return a promise
	 */
	static promisify(func) {
		return function () {
			var args = Array.prototype.slice.call(arguments);
			return Promise.resolve().then(()=> func.apply(func, args));
		};
	}
	/**
	 * take a handler and make it remove itself once it gets called
	 */
	static onceify(ev, eventName, func) {
		var oncefunc = function () {
			var args = Array.prototype.slice.call(arguments);
			var rval = func.apply(func, args);
			ev.off(eventName, oncefunc);
		};
		return oncefunc;
	}
	/**
	 * fire the named event, along with optional payload
	 * return a promise that resolves when all handlers have completed
	 */
	fire(eventName, payload) {
		this.payloads[eventName] = payload;
		if (!(this.handlers[eventName] && this.handlers[eventName].length)) {
			return Promise.resolve();
		}
		return Promise.all(this.handlers[eventName].map(handler => {
			handler = Event.promisify(handler);
			return handler(payload);
		}));
	}
	/**
	 * add a handler for an event
	 */
	on(eventName, handler) {
		// make sure we replace if called multiple
		this.off(eventName, handler);
		this.handlers[eventName] = this.handlers[eventName] || [];
		this.handlers[eventName].push(handler);
	}
	/**
	 * remove a handler for an event
	 */
	off(eventName, handler) {
		if (this.handlers[eventName]) {
			var position = this.handlers[eventName].indexOf(handler);
			if (position != -1) {
				this.handlers[eventName].splice(position, 1);
			}
		}
	}
	/*
	 * add a one-time handler for an event
	 */
	once(eventName, handler) {
		this.on(eventName, Event.onceify(this, eventName, handler));
	}
	/*
	 * replay the most recent firing of this event, or if it hasn't fired at all yet, wait for it
	 * (fixes "late listener" problems)
	 */
	last(eventName, handler) {
		var payload = this.payloads[eventName];
		if (payload) {
			return Promise.resolve().then(handler(payload));
		}
		return this.once(eventName, handler);
	}
}
