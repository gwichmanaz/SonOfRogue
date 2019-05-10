{
	let base = {
		// id's of all my living beings
		creatures: []
	};
	let Persist = require('./Persist.es6');
	module.exports = class Level extends Persist {
		constructor (id, dflt) {
			// Persist my map seed so I always generate the same map
			// (don't persist my whole map because that's not necessary)
			// But create a randomish seed if I'm brand-new
			base.mapSeed = Math.floor(Math.random() * 0xffffffff);
			super(id, dflt, base);
			this.cells = null;
		}

		/**
		 * set my cells based on procedural generation
		 */
		drawMap() {
			// TODO: write this
		}

		setCells (cells) {
			this.cells = cells;
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
