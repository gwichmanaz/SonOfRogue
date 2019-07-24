{
	let Perist = require('./Persist.es6');
	let EventBus = require('./EventBus.es6');

	/**
	 * Not all cells need to keep track of a state, so make cellState its own class
	 * TODO: state should be persistent, so add persistence (levelId, x and y needed for persistence)
	 */
	module.exports = class CellState extends EventBus {
		constructor(levelId, x, y, states, current) {
			super();
			this.states = states;
			this.levelId = levelId;
			this.x = x;
			this.y = y;
			this.setState(current || 0);
		}
		setStateIndex(index) {
			if (isNaN(index) || index < 0 || index >= this.states.length) {
				throw new Error("Illegal cell state");
			}
			if (index != this.current) {
				this.fire("stateChange", {
					from: this.states[this.current],
					to: this.states[index],
					x: this.x,
					y: this.y
				});
				this.current = index;
			}
		}
		setState(stateOrIndex) {
			if (isNaN(+stateOrIndex)) {
				stateOrIndex = this.states.indexOf(stateOrIndex);
			}
			this.setStateIndex(stateOrIndex);
		}
		getState() {
			return this.states[this.current];
		}
	}
}
