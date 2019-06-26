/**
 * general purpose random number generator class.
 * wrapper around MersenneTwister with some nice D&D dice functions
 */

var MersenneTwister = require("../lib/MersenneTwister.js");
module.exports = class RNG {
	constructor (seed) {
		this.mersenne = new MersenneTwister(seed);
	}
	/**
	 * @return a random integer between @lo and @hi
	 * be forgiving if they get the order wrong
	 */
	between(lo, hi) {
		var rlo = Math.min(lo, hi);
		var rhi = Math.max(lo, hi);
		return this.mersenne.random_int() % (rhi - rlo + 1) + rlo;
	}
	/**
	 * Roll @dice number of @sides-sided dice, or pass it in as a string if you prefer
	 * this.roll(3, 6)
	 * this.roll("3d6")
	 * this.roll(6) is the same as this.roll(1, 6)
	 */
	roll(dice, sides) {
		/*
		 * roll 1 s-sided die
		 */
		var roll1 = (s) => {
			return this.between(1, s);
		}
		if (typeof dice == "string") {
			var m = dice.match(/(\d+)d(\d+)/i);
			if (m) {
				return this.roll(+m[1], +m[2]);
			}
			throw new Error("RNG.roll: malformed string " + dice);
		}
		if (!sides) {
			sides = dice;
			dice = 1;
		}
		if (!dice) {
			throw new Error("RNG.roll: no dice to roll");
		}
		var total = 0;
		while(dice--) {
			total += roll1(sides);
		}
		return total;
	}
	/**
	 * test how fair our dice are by rolling a bunch of times and seeing how close the results are to perfect
	 * @sides the number of sides on our test die
	 * @rolls the number of times to roll the test die
	 * @return an array with a value for each result, showing how close to "perfect" we are (1.0 means exactly as expected)
	 */
	test(sides = 10, rolls = 10000) {
		var results = [];
		var result;
		var perfect = 1 / sides;
		var count = rolls;

		while (count--) {
			result = this.roll(sides);
			results[result] = results[result] || 0;
			results[result]++;
		}
		return results.map((n) => (n / rolls) / perfect);
	}
	/**
	 * take an array of items and return an array with the same items in shuffled order
	 * @array the input array
	 * @return an array with the items shuffled
	 */
	shuffle(array) {
		let copy = array.slice(0);
		for (let i = copy.length - 1; i > 0; i--) {
			let j = this.between(0, i);
			let temp = copy[i];
			copy[i] = copy[j];
			copy[j] = temp;
		}
		return copy;
	}
}
