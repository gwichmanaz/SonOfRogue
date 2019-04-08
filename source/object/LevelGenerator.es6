const Level = require('../class/Level.es6');
const Cell = require('../class/Cell.es6');

const TEST_DATA = [
	'                                                             ',
	'    wwwwwwwwwww                                              ',
	'    w.........wwwwwwwwwwwwwwwwwww                            ',
	'    w...........................w                            ',
	'    w.........wwwwwwwww.wwwwwww.w  wwwwwwwwwwwww             ',
	'    wwwwwwwwwww       w.w     w.w  w...........w             ',
	'                      w.w     w.wwww...........w             ',
	'                      w.w     w................w             ',
	'              wwwwwww w.w     wwwwww...........w             ',
	'              w.....w w.w          w...........w             ',
	'              w.....www.w          wwwwwwwwwwwww             ',
	'              w.........w                                    ',
	'              wwwwwwwwwww                                    ',
	'                                                             ',
	'                                                             ',
];

const CHARACTERS = {
	['C_w']: new Cell('wall'),
	['C_.']: new Cell('floor'),
	['C_ ']: new Cell('void')
};

module.exports	 = {
	generateLevel() {
		const level = new Level();
		level.setCells(this.__getTestCells());
		return level;
	},

	__getTestCells () {
		const cells = [];
		TEST_DATA.forEach((row, y) => {
			for (let x = 0; x < row.length; x++) {
				if (!cells[x]) {
					cells[x] = [];
				}
				cells[x][y] = this.__pickCell(row.charAt(x));
			}
		});
		return cells;
	},

	__pickCell(character) {
		return CHARACTERS['C_' + character];
	}
}