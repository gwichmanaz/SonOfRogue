{
	/**
	 * defines the schema for all of the persistent information about a creature,
	 * i.e. everything that needs to be saved when the game is saved
	 * any information that can be derived from more basic information should not be included here
	 * but should be calculated when needed
	 * position indicates where the creature is on the current level map
	 * destination represents where the creature WANTS TO BE on the current level map
	 * Any time a creature is allowed to move they will move to get closer to their destination.
	 * destination may change asynchronously to actual movement.
	 */
	let base = {
		stats: {
			STR: 0,
			DEX: 0,
			CON: 0,
			INT: 0,
			WIS: 0,
			CHA: 0
		},
		hp: 0,
		xp: 0,
		level: 1,
		race: "",
		klass: "",
		alignment: "",
		inventory: [],
		position: {
			x: 0,
			y: 0,
		},
		destination: {
			x: 0,
			y: 0
		}
	};
	let Persist = require('./Persist.es6');
	let RNG = require('./RNG.es6');
	module.exports = class Creature extends Persist {
		constructor(id = false, init={}) {
			super(id, init, base);
		}
		/**
		 * doing dice by composition rather than mixin, lazy-instantiate a die and roll it.
		 */
		roll(dice, sides) {
			this.rng = this.rng || new RNG();
			return this.rng.roll(dice, sides);
		}
		/**
		 * make a check against a stat
		 * @stat {STR|DEX|CON|INT|WIS|CHA}
		 * @threshold {number?} if present, represents a threshold which must be reached
		 * @return {number|boolean} if threshold is passed, return true/false if you make it.
		 *   otherwise return the modified roll.
		 *
		 * TODO: do I need to be able to pass in extra modifiers?
		 */
		check(stat, threshold) {
			var pips = this.roll(1, 20);
			// Special case for natural 1, natural 20
			if (pips == 1 || pips == 20) {
				if (threshold) {
					// this roll is either a natural 1 (automatic fail) or natural 20 (automatic success)
					return pips == 20;
				}
			}
			// Now we add in any modifers
			pips += this.modifier(stat);
			// If there is a threshold, return a boolean
			if (threshold) {
				return pips >= threshold;
			}
			// If we get all the way here, then they want a number
			return pips;
		}
		/**
		 * @return {number} my bonus/penalty for a particular stat
		 * TODO: how do I figure this out?
		 */
		modifier(stat) {
			return 0;
		}
	};
}
