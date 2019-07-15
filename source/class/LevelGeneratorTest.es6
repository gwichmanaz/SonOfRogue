{

	let TEST_DATA = [
		'                                                             ',
		'    wwwwwwwwwww                                              ',
		'    w.........wwwwwwwwwwwwwwwwwww                            ',
		'    w....@....d.................w                            ',
		'    w.........wwwwwwwwwdwwwwwww.w  wwwwwwwwwwwww             ',
		'    wwwwwwwwwww       w.w     w.w  w...........w             ',
		'                      w.w     w.wwww...........w             ',
		'                      w.w     w....d...........w             ',
		'              wwwwwww w.w     wwwwww...........w             ',
		'              w.....w w.w          w...........w             ',
		'              w.....www.w          wwwwwwwwwwwww             ',
		'              w.....d...w                                    ',
		'              wwwwwwwwwww                                    ',
		'                                                             ',
		'                                                             ',
	];

	let CHARACTERS = {
		"w": "wall",
		".": "floor",
		"@": "floor",
		" ": "void",
		"d": "door"
	};

	let LevelGenerator = require('./LevelGenerator.es6');
	module.exports = class LevelGeneratorTest extends LevelGenerator {
		/**
		 * return a 2-dimensional array of Cells, and an entry point for the level
		 */
		generateLevelMap(mapSeed) {
			const cells = [];
			const entry = {
				x: undefined,
				y: undefined
			};
			TEST_DATA.forEach((row, y) => {
				for (let x = 0; x < row.length; x++) {
					if (!cells[x]) {
						cells[x] = [];
					}
					cells[x][y] = this.getCell(CHARACTERS[row.charAt(x)]);
					if (row.charAt(x) == "@") {
						entry.x = x;
						entry.y = y;
					}
				}
			});
			return {
				cells: cells,
				entry: entry
			};
		}
	};
}
