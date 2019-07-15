{
  /**
   * Demo Character is a Level 1 Human Fighter
   * Ability Scores: STR 16, DEX 11, CON 16, INT 10, WIS 14, CHA 10
   * Equipment: Chainmail, Longsword, Shield
   * Include infrastructure for carrying unequipped items
   * Proficiencies: Strength, Constitution, Athletics, Perception, Survival, Thieves’ Tools
   * Class Features: Second Wind, Fighting Style (Dueling)
   * Uses Armor heroSprites
   * Sprite animation is low priority but should eventually be included in the Demo
   * Include infrastructure for characters with other race, class, level, sprite, etc.
   * Leave room for earning exp and leveling up, but those things can wait until later versions
   */

	let Creature = require('./creature.es6');
	let demoFighterValues = {
		stats: {
			STR: 16,
			DEX: 11,
			CON: 16,
			INT: 10,
			WIS: 14,
			CHA: 10
		},
		hp: 0,
		xp: 0,
		level: 1,
		race: "Human",
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

	module.exports = class DemoFighter extends Creature {
		constructor(id = false, init = demoFighterValues) {
			super(id, init);
		}
	};
}
