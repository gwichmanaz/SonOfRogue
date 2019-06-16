{
	/**
	 * Keep track of all the objects we are actively using
	 */
	let everything = {};
	let Persist = require('../class/Persist.es6');
	let Utils = require('./Utils.es6');

	/**
	 * return an array containing all the things
	 */
	function allTheThings() {
		return Factory.get(Object.keys(everything));
	}

	let Factory = {
		/**
		 * @return {Object|Promise}
		 * if we already have this object, return it.  Otherwise return a Promise that resolves when we have it
		 * @id object id or array of object ids
		 */
		get: function (id) {
			if (Array.isArray(id)) {
				return id.map((iid) => Factory.get(iid));
			}
			if (!everything[id]) {
				// Doesn't exist yet, need to build it
				console.log(id, "doesn't exist yet, building it");
				everything[id] = Persist.reconstitute(id).then((i) => {
					return everything[id] = i;
				});
			}
			return everything[id];
		},
		/**
		 * make sure the values in long-term storage are up-to-date
		 */
		persistAll: function () {
			Utils.ready(allTheThings()).then((things) => {
				things.forEach((i) => {
					i.persist();
				});
			});
		},
		forget: function (id) {
			var i = everything[id];
			delete everything[id];
			Utils.ready(i).then((j) => {
				j.forget();
			});
		},
		add: function (i) {
			everything[i.id] = i;
		}
	};
	module.exports = Factory;
}
