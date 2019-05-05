/**
 * The Game class models a particular game of Son Of Rogue
 * Provides a top-level container for all of the persistent objects that make up the game
 * Keeps track of the current state of the game
 */
{
	let Clock = require('./Clock.es6');
	let Persist = require('./Persist.es6');
	let RNG = require('./RNG.es6');

	module.exports = class Game extends Persist {
		constructor() {
		},
		restore () {
		},
		save () {
		}
	};
}
