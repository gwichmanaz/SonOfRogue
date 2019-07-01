{
	/**
	 * MapCell represents a single cell on a map, at an X,Y location
	 * It represents the permanent reality of the ground, it's not something that can be moved.
	 *
	 * Some map cells are static and inert, e.g walls, grass, etc. For such cells, every cell reference can
	 * actually just point to the exact same object; we don't need 2000 copies of a wall cell when they all behave exactly
	 * the same
	 */
	const CONFIG_BY_TYPE = {
		"void": {
			interactive: false,
			canStep: false,
			static: true,
		},
		"floor": {
			interactive: true,
			canStep: true,
			static: true,
			interact: function (eventBus, x, y) {
				eventBus.fire("setDestination", { x, y });
			}
		},
		"wall": {
			interactive: false,
			canStep: false,
			static: true,
		},
		"door": {
			interactive: true,
			canStep: function (doorCell) {
				return doorCell.state == "open";
			},
			static: false,
			states: ["open", "closed"],
			interact: function (eventBus, x, y) {
				// TODO... doors are funny things, but for now, just set the destination
				eventBus.fire("setDestination", { x, y });
			}
		},
		"bed": {
			interactive: true,
			canStep: false,
			static: true,
			interact: function (eventBus, x, y) {
				// TODO... are beds map cells or are they artifacts?
			}
		}
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
		/**
		 * return true if this map cell can have a creature or artifact on it
		 * maybe should call it canBeOccupied?
		 * NOTE this doesn't check if it's already occupied, only if it is occupiable given its nature and state
		 */
		canStep() {
			return typeof this.config.canStep == 'function' ? this.config.canStep(this) : this.config.canStep;
		}
		interactive() {
			return this.config.interactive;
		}
		interact(eventBus, x, y) {
			if (this.config.interactive) {
				return this.config.interact(eventBus, x, y);
			}
		}
		initialize(level, x, y, state) {
			if (this.config.static) {
				throw new Error("Cannot initialize a static cell");
			}
			if (!this.config.states || this.config.states.indexOf(state) == -1) {
				throw new Error(`Illegal state "${state}" for type "${this.cellType}"`);
			}
			if (this.cellState) {
				throw new Error("Cell already initialized");
			}
			this.cellState = new CellState(level, x, y, state);
		}
		getState() {
			return (this.cellState && this.cellState.getState()) || null;
		}
		onStateChange(handler) {
			this.cellState && this.cellState.on("stateChange", changeHandler);
		}
	};
}
