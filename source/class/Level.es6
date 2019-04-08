module.exports = class Level {
	constructor () {
		this.cells = null;
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
}
