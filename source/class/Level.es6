module.exports = class Level {
	constructor () {
		this.cells = null;
		this.monsters = [];
		this.player = null;
	}

	setPlayer (player) {
		this.player = player;
	}

	addMonster (monster) {
		this.monsters.push(monster);
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

	getMonster (x, y) {
		return this.monsters.find(m => m.x == x && m.y == y);
	}
}