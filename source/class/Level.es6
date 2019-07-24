{
	let base = {
		// What type of generator generates my map
		generatorType: 'Test',
		// id's of all my living beings
		creatures: []
	};
	let Persist = require('./Persist.es6');
	let LevelManager = require('../object/LevelManager.es6');
	module.exports = class Level extends Persist {
		constructor (id, dflt) {
			// Persist my map seed so I always generate the same map
			// (don't persist my whole map because that's not necessary)
			// But create a randomish seed if I'm brand-new
			base.mapSeed = Math.floor(Math.random() * 0xffffffff);
			super(id, dflt, base);
			this.generateMap();
			this.creatures = [];
		}

		/**
		 * set my cells based on procedural generation
		 */
		generateMap() {
			this.ready.then(() => {
				var level = LevelManager.generateLevelMap(this.persistent.generatorType, this.persistent.mapSeed);
				this.cells = level.cells;
				this.entry = level.entry;
			});
		}

		/**
		 * retrieve the cell at x, y
		 * can pass 2 numbers or 1 position object
		 */
		getCellAt(x, y) {
			if (x.hasOwnProperty("x")) {
				y = x.y;
				x = x.x;
			}
			return this.cells[x] && this.cells[x][y];
		}

		placeCreatureOnLevel(creature) {
			this.creatures.push(creature);
		}

		moveCreatures() {
			// TODO: deal with initiative and various speeds and all that.  For now, we're just moving the hero about
			this.creatures.forEach(this.moveCreature.bind(this));
		}

		moveCreature(creature) {
			var destination = creature.getDestination();
			// TODO: pass in number of steps this creature could actually take
			destination && creature.setPosition(this.getClosestAvailableCell(creature.getPosition(), destination, 3));
		}

		/**
		 * given a position and a destination, return the position of
		 * the cell closest to the destination, which may be moved to from the start position
		 * @steps number of steps this character can take right now.  > 3 means character may move diagonally
		 * (orthognal move costs two steps, diagonal costs 3)
		 * @hvid optional boolean, alternate true/false or leave it undefined to get orthogonal movement
		 * TODO: check for creatures and artifacts that may be occupying the space
		 */
		getClosestAvailableCell(position, destination, steps, hvid) {
			var delta = {
				x: Math.sign(destination.x - position.x),
				y: Math.sign(destination.y - position.y),
			};
			var hmove = false, vmove = false, dmove = false;
			if (delta.x != 0) {
				hmove = {
					x: delta.x + position.x,
					y: position.y
				};
			}
			if (delta.y != 0) {
				vmove = {
					x: position.x,
					y: delta.y + position.y
				};
			}
			if (steps >= 3 && delta.x != 0 && delta.y != 0) {
				dmove = {
					x: delta.x + position.x,
					y: delta.y + position.y
				};
			}
			var hcell = hmove && this.getCellAt(hmove);
			var vcell = vmove && this.getCellAt(vmove);
			var dcell = dmove && this.getCellAt(dmove);
			var hmovePossible = hcell && hcell.canStep();
			var vmovePossible = vcell && vcell.canStep();
			var dmovePossible = dcell && dcell.canStep();
			// Always take the diagonal move if we can
			if (dmovePossible) {
				return dmove;
			}
			// If both moves are possible, choose 1
			if (hmovePossible && vmovePossible) {
				if (hvid === undefined) {
					hvid = Math.random() > 0.5;
				}
				var even = position.x % 2 == position.y % 2;
				return hvid == even ? hmove : vmove;
			}
			if (hmovePossible) {
				return hmove;
			}
			if (vmovePossible) {
				return vmove;
			}
			// Can't get there from here.
			console.log("Can't get there from here", position, destination);
			return position;
		}

		getSize () {
			return {
				w: this.cells.length,
				h: this.cells[0].length
			}
		}
	};
}
