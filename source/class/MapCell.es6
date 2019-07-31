{
	/**
	 * MapCell represents a single cell on a map, at an X,Y location
	 * It represents the permanent reality of the ground, it's not something that can be moved.
	 *
	 * Some map cells are static and inert, e.g walls, grass, etc. For such cells, every cell reference can
	 * actually just point to the exact same object; we don't need 2000 copies of a wall cell when they all behave exactly
	 * the same.  These cells can still have "state", but the state must be able to be determined solely from the type and location
	 * of the cell, e.g. a wall will be in the "br" state if there are wall cells bELOW and rIGHT of the cell
	 *
	 * Some map cells are "frozen" meaning they have an assigned state, but that state is guaranteed never to change, so all
	 * cells of that state can actually point to the same cell.  In this case the state must be assigned at construct time.
	 * Example is floor, where all floor cells _behave_ exactly the same, but they may be made of different material so look different
	 *
	 * Some map cells are dynamic, meaning they have state which can change and must be tracked,
	 * e.g. doors, which may be opened or closed.  In this case we need a separate map cell for every instance
	 */

	const STATIC = 0, FROZEN = 1, DYNAMIC = 2;

	const CONFIG_BY_TYPE = {
		"void": {
			interactive: false,
			canStep: false,
			meta: STATIC,
		},
		"floor": {
			interactive: true,
			canStep: true,
			meta: FROZEN,
			states: ['dirt', 'grass', 'tile', 'cobblestone', 'brick'],
			defaultState: 'tile',
			interact: function (game, cell, x, y) {
				game.getActor().setDestination({ x, y });
			}
		},
		"wall": {
			interactive: false,
			canStep: false,
			meta: STATIC,
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
			meta: DYNAMIC,
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

					// If I had a destination, using the door clears it
					// TODO: Generalized ITEM_USED event?
					game.getActor().clearDestination();

				} else if (doorCell.canStep()) {
					hero.setDestination({ x, y });
				}
				// Otherwise do nothing, you are too far away and the door is closed
			}
		},
		"bed": {
			interactive: true,
			canStep: false,
			meta: STATIC,
			interact: function (game, bedCell, x, y) {
				// TODO... are beds map cells or are they artifacts?
			}
		}
	};
	const staticCells = {};
	const Cell = require("./Cell.es6");
	const CellState = require("./CellState.es6");
	module.exports = class MapCell extends Cell {
		static getMapCell(cellType, cellState) {
			if (CONFIG_BY_TYPE[cellType].meta == STATIC) {
				staticCells[cellType] = staticCells[cellType] || new MapCell(cellType);
				return staticCells[cellType];
			}
			if (CONFIG_BY_TYPE[cellType].meta == FROZEN) {
				cellState = cellState || CONFIG_BY_TYPE[cellType].defaultState;
				let celDef = cellType + "-" + cellState;
				staticCells[celDef] = staticCells[celDef] || new MapCell(cellType, cellState);
				return staticCells[celDef];
			}
			return new MapCell(cellType);
		}
		constructor(cellType, cellState) {
			super(cellType);
			this.config = CONFIG_BY_TYPE[cellType];
			if (this.config.meta == FROZEN) {
				if (!cellState) {
					throw new Error(`cell type "${cellType}" is frozen, so state must be specified in constructor`);
				}
				this.setState(cellState);
			}
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
			if (this.config.meta != DYNAMIC) {
				throw new Error("Can only initialize dynamic cells");
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
			if (this.frozenState) {
				return this.frozenState;
			}
			if (this.config.getState) {
				return (this.config.getState(level, this, x, y));
			}
			return null;
		}
		setState(newState) {
			if (this.config.meta == STATIC) {
				throw new Error("Cannot set state on a static cell");
			}
			if (this.config.meta == FROZEN) {
				if (this.frozenState && this.frozenState != newState) {
					throw new Error(`Cannot change state from "${this.frozenState}" to "${newState}" on frozen cell`);
				}
				this.frozenState = newState;
			}
			if (this.config.meta == DYNAMIC) {
				if (!this.config.states || this.config.states.indexOf(newState) == -1) {
					throw new Error(`Illegal state "${newState}" for type "${this.cellType}"`);
				}
				this.cellState && this.cellState.setState(newState);
			}
		}
		onStateChange(handler) {
			this.cellState && this.cellState.on("stateChange", handler);
		}
	};
}
