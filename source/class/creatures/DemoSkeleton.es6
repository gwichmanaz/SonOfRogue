{
  /**
   * Skeleton for Demo level
   * Uses Undead sprites
   */

	let Monster = require('./monster.es6');
	let demoValues = {
		stats: {
			STR: 16,
			DEX: 11,
			CON: 16,
			INT: 10,
			WIS: 14,
			CHA: 10
		},
		hp: 0,
		xp: 30,
		level: 1,
		race: "Skeleton",
		klass: "Fighter",
		alignment: "",
		inventory: [],
		position: {
			x: undefined,
			y: undefined,
		},
		destination: {
			x: undefined,
			y: undefined
		}
	};

	module.exports = class DemoSkeleton extends Monster {
		constructor(id = false, init = demoValues) {
			super(id, init);
		}
	};
}
