/**
 * This will be the main application.  For now, just require all our pieces for browserify
 */

var Clock = require('./class/Clock.es6');
var Event = require('./class/Event.es6');
var RNG = require('./class/RNG.es6');
var Persist = require('./class/Persist.es6');

console.log("App.js setting module exports");
var rng = new RNG();
console.log(rng.roll("3d6"));

module.exports = { Clock, Event, RNG, Persist };

// Not sure if browserify has some way of getting at this?
if (typeof window != "undefined") {
	window.App = module.exports;
}

const LevelGenerator = require('./class/LevelGenerator.es6');
const level = LevelGenerator.generateLevel();

console.log(level);