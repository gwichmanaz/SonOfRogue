{
	let Utils = {
		/**
		 * given an array of objects, which are either usable objects or promises that resolve to usable
		 * objects, return a Promise that resolves when all promises are resolved and thus all objects
		 * are usable.
		 * Also works with a single object.
		 */
		ready: function (a) {
			if (!Array.isArray(a)) {
				return Promise.resolve(a);
			}
			return Promise.all(a.map((b) => Promise.resolve(b)));
		}
	};

	module.exports = Utils;
}
