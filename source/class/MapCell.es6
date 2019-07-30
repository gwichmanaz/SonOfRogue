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
			interact: function (game, cell, x, y) {
				game.getActor().setDestination({ x, y });
			}
		},
		"wall": {
			interactive: false,
			canStep: false,
			static: true,
			getState: function (level, cell, x, y) {
				// State of a wall depends on its neighbours
				function isWall(x, y) {
					let cell = level.getCellAt(x, y);
					return cell && cell.cellType == "wall";
				}
				// Create an object whose values are true if there's a wall in that direction
				// tOP, lEFT, bOTTOM, rIGHT
				let neighbours = {
					t: isWall(x, y - 1),
					l: isWall(x - 1, y),
					b: isWall(x, y + 1),
					r: isWall(x + 1, y)
				}
				let state = Object.keys(neighbours).filter((k) => neighbours[k]).join("");
				return state;
			}
		},
		"door": {
			interactive: true,
			canStep: function (doorCell) {
				return doorCell.getState() == "open";
			},
			static: false,
			states: ["open", "closed"],
			interact: function (game, doorCell, x, y) {
				var hero = game.getActor();
				var heroPosition = hero.getPosition();
				// TODO: make a general util to get distance between 2 positions
				var xdist = Math.abs(heroPosition.x - x);
				var ydist = Math.abs(heroPosition.y - y);
				if (xdist == 0 && ydist == 0) {
					return; // no playing with the door while I'm on it.
				}
				if (xdist <= 1 && ydist <= 1) {
					console.log("Next to door, open or close it", doorCell.getState());
					doorCell.setState(doorCell.getState() == "open" ? "closed" : "open");
				} else if (doorCell.canStep()) {
					hero.setDestination({ x, y });
				}
				// Otherwise do nothing, you are too far away and the door is closed
			}
		},
		"bed": {
			interactive: true,
			canStep: false,
			static: true,
			interact: function (game, bedCell, x, y) {
				// TODO... are beds map cells or are they artifacts?
			}
		}
	};
	const staticCells = {};
	const Cell = require("./Cell.es6");
	const CellState = require("./CellState.es6");
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
		interact(game, x, y) {
			if (this.config.interactive) {
				return this.config.interact(game, this, x, y);
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
			this.cellState = new CellState(level, x, y, this.config.states, state);
		}
		getState(level, x, y) {
			if (this.cellState) {
				return this.cellState.getState();
			}
			if (this.config.getState) {
				return (this.config.getState(level, this, x, y));
			}
			return null;
		}
		setState(newState) {
			this.cellState && this.cellState.setState(newState);
		}
		onStateChange(handler) {
			this.cellState && this.cellState.on("stateChange", handler);
		}
	};
}
