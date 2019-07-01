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
	let DemoFighter = require('./DemoFighter.es6');
	let EventBus = require('./EventBus.es6');

	let base = {
		// id's of all my levels
		levels: [],
		// id's of everyone in the party
		party: []
	};
	module.exports = class Game extends Persist {
		constructor(id, dflt) {
			super(id, dflt);
			this.clock = new Clock();
			this.event = new EventBus();
			this.createParty();
			this.event.on("setDestination", (p) => {
				if (this.party && this.party[this.hero]) {
					this.party[this.hero].setDestination(p);
				}
			});
		}
		/**
		 * Create the adventuring party.  For demo, just create the demo hero
		 * return a Promise so this can be replaced with a whole UI someday
		 */
		createParty () {
			if (!this.party) {
				this.party = [];
				this.party.push(new DemoFighter());
				this.hero = 0; // index of the party member who is currently being controlled
			}
			return Promise.resolve();
		}
		/**
		 * @return the current level in the game.  For now,
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
