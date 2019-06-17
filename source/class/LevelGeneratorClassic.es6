{
	let LevelGenerator = require('./LevelGenerator.es6');
	let RNG = require('./RNG.es6');
	const CLASSIC_WIDTH = 80;
	const CLASSIC_HEIGHT = 24;
	const PLACEMENT_HEIGHT = Math.floor(CLASSIC_HEIGHT / 3);
	const PLACEMENT_WIDTH = Math.floor(CLASSIC_WIDTH / 3);
	const MAX_ROOM_HEIGHT = PLACEMENT_HEIGHT - 2;
	const MAX_ROOM_WIDTH = PLACEMENT_WIDTH - 2;
	const MIN_ROOM_HEIGHT = 3;
	const MIN_ROOM_WIDTH = 3;

	/**
	 * Level generator that behaves similar to classic rogue
	 * (Or will when it is finished)
	 * 80 x 24 level, 3x3 grid of rooms
	 */
	module.exports = class LevelGeneratorClassic extends LevelGenerator {
		/**
		 * return a 2-dimensional array of Cells.
		 * base class returns empty map
		 */
		generateLevelMap(mapSeed) {
			this.cells = [];
			this.rng = new RNG(mapSeed);
			// Start with all void
			for (let x = 0; x < CLASSIC_WIDTH; x++) {
				for (let y = 0; y < CLASSIC_HEIGHT; y++) {
					this.cells[x] = this.cells[x] || [];
					this.cells[x].push(this.getCell("void"));
				}
			}
			// Build the rooms
			for (let x = 0; x < 3; x++) {
				for (let y = 0; y < 3; y++) {
					this.__buildRoom(x * PLACEMENT_WIDTH, y * PLACEMENT_HEIGHT);
				}
			}
			// (TODO) Connect the rooms
			return this.cells;
		}
		__buildRoom(pX, pY) {
			let roomHeight = this.rng.between(MIN_ROOM_HEIGHT, MAX_ROOM_HEIGHT);
			let roomWidth = this.rng.between(MIN_ROOM_WIDTH, MAX_ROOM_WIDTH);
			let spareWidth = (PLACEMENT_WIDTH - roomWidth) - 1;
			let spareHeight = (PLACEMENT_HEIGHT - roomHeight) - 1;
			let firstX = this.rng.between(pX, pX + spareWidth);
			let firstY = this.rng.between(pY, pY + spareHeight);
			console.log("Creating", roomWidth, "by", roomHeight, "room at", firstX, firstY);
			let lastX = firstX + roomWidth, lastY = firstY + roomHeight;
			for (let x = firstX; x <= lastX; x++) {
				for (let y = firstY; y <= lastY; y++) {
					let cellType = "floor";
					if (x == firstX || x == lastX || y == firstY || y == lastY) {
						cellType = "wall";
					}
					this.cells[x][y] = this.getCell(cellType);
				}
			}
		}
	};
}

