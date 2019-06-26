module.exports = class Cell {
	constructor (cellType) {
		this.cellType = cellType;
	}
	getSprites() {
		return [this.cellType];
	}
}
