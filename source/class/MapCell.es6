{
	const CONFIG_BY_TYPE = {
		"void": {
			canStep: false,
			static: true,
		},
		"floor": {
			canStep: true,
			static: true,
		},
		"wall": {
			canStep: false,
			static: true,
		},
		"door": {
			canStep: function (doorCell) {
				return doorCell.state == "open";
			},
			static: false,
			states: ["open", "closed"],
		},
	};
	const staticCells = {};
	const Cell = require("./Cell.es6");
	module.exports = class MapCell extends Cell {
		static getMapCell(cellType) {
			if (CONFIG_BY_TYPE[cellType].static) {
				staticCells[cellType] = staticCells[cellType] || new MapCell(cellType);
				return staticCells[cellType];
			}
			return new MapCell(cellType);
		}
		constructor(cellType) {
			super(cellType);
			this.config = CONFIG_BY_TYPE[cellType];
		}
		getSprites() {
			if (this.config.states) {
				return this.config.states.map((s) => this.cellType + "-" + s);
			}
			return super.getSprites();
		}
		canStep() {
			return typeof this.config.canStep == 'function' ? this.config.canStep(this) : this.config.canStep;
		}
	};
}
