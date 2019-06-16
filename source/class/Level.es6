{
	let base = {
		// What type of generator generates my map
		generatorType: 'Test',
		// id's of all my living beings
		creatures: []
	};
	let Persist = require('./Persist.es6');
	let LevelManager = require('../object/LevelManager.es6');
	module.exports = class Level extends Persist {
		constructor (id, dflt) {
			// Persist my map seed so I always generate the same map
			// (don't persist my whole map because that's not necessary)
			// But create a randomish seed if I'm brand-new
			base.mapSeed = Math.floor(Math.random() * 0xffffffff);
			super(id, dflt, base);
			this.generateMap();
		}

		/**
		 * set my cells based on procedural generation
		 */
		generateMap() {
			this.ready.then(() => {
				this.cells = LevelManager.generateLevelMap(this.persistent.generatorType, this.persistent.mapSeed);
			});
		}

		getCell (x, y) {
			return this.cells[x][y];
		}

		getSize () {
			return {
				w: this.cells.length,
				h: this.cells[0].length
			}
		}
	};
}
