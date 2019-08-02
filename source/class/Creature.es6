{
	const REST_DELTA = {
		x: 0,
		y: 0
	};
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
		// Creature's current position on the map
		position: {
			facing: "front", // front, back, left, right
			x: undefined,
			y: undefined,
		},
		// Creature's desired ultimate destination
		destination: {
			x: undefined,
			y: undefined
		}
	};
	let Persist = require('./Persist.es6');
	let RNG = require('./RNG.es6');
	let EventBus = require('./EventBus.es6');
	module.exports = class Creature extends Persist {
		constructor(id = false, init={}) {
			super(id, init, base);
			this.event = new EventBus();
			// Creature's next position on the map
			this.movingTo = null;
			this.step = 0;
		}
		/**
		 * doing dice by composition rather than mixin, lazy-instantiate a die and roll it.
		 */
		roll(dice, sides) {
			this.rng = this.rng || new RNG();
			return this.rng.roll(dice, sides);
		}
		/**
		 * @return the direction this creature is facing: left, right, front, back
		 */
		facing() {
			let facing = "front";
			// TODO: Make this change depending on what the creature's next move would be
			return facing;
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
		setDestination(d) {
			console.log("CREATURE DEST BEING SET TO", d);
			this.persistent.destination.x = d.x;
			this.persistent.destination.y = d.y;
		}
		clearDestination() {
			this.persistent.destination.x = undefined;
			this.persistent.destination.y = undefined;
		}
		setMovingTo(delta) {
			console.log("CREATURE MOVING TO BEING SET TO", delta);
			// TODO: sanity check that we are in a ready to move state
			var diagonal = delta.x != 0 && delta.y != 0;
			this.movingTo = delta;
			this.stepsNeeded = diagonal ? 6 : 4;
			this.stepsTaken = 0;
			this.takeStep();
		}
		takeStep(tick) {
			this.stepsTaken += 1;
			let distance = this.stepsTaken / this.stepsNeeded;
			var newPos = {
				x: this.persistent.position.x + this.movingTo.x * distance,
				y: this.persistent.position.y + this.movingTo.y * distance
			};
			if (distance == 1) {
				this.setPosition(newPos);
			} else {
				this.event.fire("positionChange", newPos);
			}
		}
		setPosition(d) {
			console.log("CREATURE LOC BEING SET TO", d);
			// TODO: generalize observables!
			if (d.x == this.persistent.position.x && d.y == this.persistent.position.y) {
				return;
			}
			this.persistent.position.x = d.x;
			this.persistent.position.y = d.y;
			if (this.persistent.position.x === this.persistent.destination.x && this.persistent.position.y === this.persistent.destination.y) {
				console.log("I GOT WHERE I WAS GOING");
				this.clearDestination();
			}
			this.movingTo = null;
			this.stepsTaken = this.stepsNeeded = 0;
			this.event.fire("positionChange", this.persistent.position);
		}
		onPositionChange(handler) {
			this.event.on("positionChange", handler);
		}
		// Return true if we are ready to start moving into a new cell
		getMovingStatus(tick) {
			if (this.movingTo) {
				return "moving";
			}
			if (this.getDestination() && this.movingTo == null) {
				return "ready";
			}
			return "resting";
		}
		getCreatureType() {
			return this.persistent.race;
		}
		getPosition() {
			return this.persistent.position;
		}
		getDestination() {
			if (this.persistent.destination.x !== undefined) {
				return this.persistent.destination;
			}
			return null;
		}
	};
}
