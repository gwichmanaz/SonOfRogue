/**
 * Base class for any persistent object
 */
{
	let uuid = require('../lib/uuid.js');
	/*
	 * if we are not in a browser, get ourselves some local storage
	 */
	if (typeof localStorage == "undefined") {
		var Storage = require("../lib/localStorage.js");
		var localStorage = new Storage("./persist.txt"); // TODO: some way to configure
	}
	/*
	 * Default persister.  Persister is a singleton that can save/restore/delete
	 * a string to long-term storage.
	 */
	let persister = {
		/**
		 * given an @id {String} and a @value {String}, return a {Promise} that fulfills
		 * when the value has been successfully saved to long term storage
		 */
		setItem: function (id, value) {
			localStorage.setItem(id, value);
			return Promise.resolve(value);
		},
		/**
		 * given an @id {String}, return a {Promise<String>} resolved with the value of the ID
		 * if it is in storage.
		 *
		 * If it is NOT in storage, and dflt {String} is defined, then store the default and return that
		 *
		 * If it is NOT in storage, ad dflt is NOT defined, @return rejected promise
		 */
		getItem: function (id, dflt) {
			if (localStorage.hasOwnProperty(id)) {
				return Promise.resolve(localStorage.getItem(id));
			}
			if (typeof dflt == "string") {
				return persister.setItem(id, dflt);
			}
			return Promise.reject(new Error("storage has no item " + id));
		},
		/**
		 * given an @id {String}, remove item from storage with that id, if it exists.
		 * return {Promise<boolean>} that resolves when item has been removed.  resolves false
		 * if the item was not in storage
		 */
		removeItem: function (id) {
			var removed = false;
			if (localStorage.hasOwnProperty(id)) {
				localStorage.removeItem(id);
				removed = true;
			}
			return Promise.resolve(removed);
		},
		/**
		 * given an @id {String} @return {boolean} true if the id exists in storage
		 */
		hasItem: function (id) {
			return localStorage.hasOwnProperty(id);
		},
		/**
		 * generate an @id {String} that does not already exist in local storage
		 */
		generateId: function () {
			var id = uuid();
			// Astronomically small chance of collision but here for completeness
			return persister.hasItem(id) ? persister.generateId() : id;
		}
	};

	module.exports = class Persist {
		static setPersister(ps) {
			// TODO: Sanity check that this is a valid persister
			// TODO: Throw an error if anything has been persisted already (or else implement re-persist)
			persister = ps;
		}
		/**
		 * create a new persistent object. @id {String} must be globally unique
		 * @dflt {Object} initial values if this object is not in storage
		 */
		constructor(id = false, dflt = {}) {
			if (typeof id == 'object') {
				dflt = id;
				id = false;
			}
			id = id || uuid();
			Object.defineProperty(this, 'id', {
				value: id,
				writable: false,
				enumerable: false
			});
			this.ready = persister.getItem(id, this.serialize(dflt)).then((r) => {
				return this.persistent = this.deserialize(r);
			});
		}
		/**
		 * turn our persistent values into a string.  Done as a public member function so subclasses
		 * can override if they want to do it a different way
		 */
		serialize(obj) {
			return JSON.stringify(obj);
		}
		deserialize(str) {
			return JSON.parse(str);
		}
		/**
		 * persist our current values to long-term storage
		 * @return {Promise} that resolves when we are saved.
		 */
		persist() {
			return this.ready.then(() => {
				persister.setItem(this.id, this.serialize(this.persistent));
			});
		}
	}
}
