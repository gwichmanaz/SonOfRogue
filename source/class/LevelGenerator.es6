{
	// (Abstract) base class for level generators
	let Cell = require('./Cell.es6');
	const cells = {};

	module.exports = class LevelGenerator {
		constructor() {
		}

		/**
		 * return a 2-dimensional array of Cells.
		 * base class returns empty map
		 */
		generateLevelMap(mapSeed) {
			return [];
		}
		// Lazy-instantiate cells.
		getCell(typ) {
			cells[typ] = cells[typ] || new Cell(typ);
			return cells[typ];
		}
	};
}
