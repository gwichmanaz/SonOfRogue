/**
 * This will be the main application.  For now, just require all our pieces for browserify
 */

const Clock = require('./class/Clock.es6');
const Event = require('./class/Event.es6');
const RNG = require('./class/RNG.es6');
const Persist = require('./class/Persist.es6');
const Creature = require('./class/Creature.es6');
const LevelGenerator = require('./object/LevelGenerator.es6');
const Display = require('./object/Display.es6');

console.log("App.js setting module exports");
var rng = new RNG();
console.log(rng.roll("3d6"));

function load() {
	const level = LevelGenerator.generateLevel();
	console.log(level);
	Display.init().then(() => {
		console.log('init complete');
		Display.setLevel(level);
	});
}

module.exports = { Clock, Event, RNG, Persist, load };

// Not sure if browserify has some way of getting at this?
if (typeof window != "undefined") {
	window.App = module.exports;
}

