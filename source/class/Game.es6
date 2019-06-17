/**
 * The Game class models a particular game of Son Of Rogue
 * Provides a top-level container for all of the persistent objects that make up the game
 * Keeps track of the current state of the game
 */
{
	let Clock = require('./Clock.es6');
	let Persist = require('./Persist.es6');
	let RNG = require('./RNG.es6');
	let Level = require('./Level.es6');

	let base = {
		// id's of all my levels
		levels: []
	};
	module.exports = class Game extends Persist {
		constructor(id, dflt) {
			super(id, dflt);
		}
		/**
		 * return the current level in the game.  For now,
		 * just one level
		 */
		getLevel (levelNumber) {
			this.level = this.level || new Level(false, {
				generatorType: "Classic"
			});
			return this.level;
		}
		restore () {
		}
		save () {
		}
	};
}
