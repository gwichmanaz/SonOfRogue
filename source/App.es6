/**
 * This will be the main application.  For now, just require all our pieces for browserify
 */

const Clock = require('./class/Clock.es6');
const RNG = require('./class/RNG.es6');
const Persist = require('./class/Persist.es6');
const Creature = require('./class/Creature.es6');
const Level = require('./class/Level.es6');
const Game = require('./class/Game.es6');
const Display = require('./object/Display.es6');
const SoundManager = require('./object/SoundManager.es6');

console.log("App.js setting module exports");
var rng = new RNG();
console.log(rng.roll("3d6"));

function initialize() {
	return Promise.all([
		Display.init(),
		SoundManager.init()
	]);
}

function load() {
	initialize().then(() => {
		console.log('init complete');
		const game = new Game();
		SoundManager.setGame(game);
		Display.setGame(game);
	});
}

module.exports = { Clock, RNG, Persist, Display, load };

// Not sure if browserify has some way of getting at this?
if (typeof window != "undefined") {
	window.App = module.exports;
}

