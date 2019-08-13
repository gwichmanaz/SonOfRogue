/**
 * Monster is an abstract superclass for all the denizens of the dungeon
 */

let Creature = require('../Creature.es6');
module.exports = class Monster extends Creature {
	constructor(id = false, init={}) {
		super(id, init);
		this.thinkMode = this.wander.bind(this);
	}
	/**
	 * Generic think routine: fight, flight, or wander
	 */
	think(tick, level) {
		this.thinkMode && this.thinkMode(tick, level);
	}
	wander(tick, level) {
		// First, check if I should stop wandering and switch to fight or flight (TODO)

		// No reason to fight or flee, so let's just wander, aimlessly.
		// Wanderers never leave the room they are in
		var status = this.getMovingStatus(tick);
		if (status == "stuck" || status == "resting") {
			// pick a completely random spot and move toward it, until I either get there
			// or run into an obstacle, at which point I will pick a new random spot
			let size = level.getSize();
			let x = this.between(0, size.w - 1);
			let y = this.between(0, size.h - 1);
			this.setDestination({x, y});
		}
		// TODO: wanderers should not go through a door
	}
	fight(tick, level) {
		// TODO
	}
	flight(tick, level) {
		// TODO -- run away! run away!
	}
};
