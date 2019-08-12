/**
 * Monster is an abstract superclass for all the denizens of the dungeon
 */

let Creature = require('../creature.es6');
module.exports = class Monster extends Creature {
	constructor(id = false, init={}) {
		super(id, init);
		this.thinkMode = this.wander.bind(this);
	}
	/**
	 * Generic think routine: fight, flight, or wander
	 */
	think() {
		this.thinkMode && this.thinkMode();
	}
	wander() {
		// First, check if I should stop wandering and switch to fight or flight (TODO)

		// No reason to fight or flee, so let's just wander, aimlessly.
	}
	fight() {
		// TODO
	}
	flight() {
		// TODO -- run away! run away!
	}
};
