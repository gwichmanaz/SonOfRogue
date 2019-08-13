{
	let LevelGenerator = require('./LevelGenerator.es6');
	let RNG = require('./RNG.es6');
	let EventBus = require('./EventBus.es6');
	const CLASSIC_WIDTH = 110;
	const CLASSIC_HEIGHT = 55;
	const PLACEMENT_HEIGHT = Math.floor(CLASSIC_HEIGHT / 3);
	const PLACEMENT_WIDTH = Math.floor(CLASSIC_WIDTH / 3);
	const MAX_ROOM_HEIGHT = PLACEMENT_HEIGHT - 3;
	const MAX_ROOM_WIDTH = PLACEMENT_WIDTH - 3;
	const MIN_ROOM_HEIGHT = 7;
	const MIN_ROOM_WIDTH = 7;
	const MAX_SKINNY_ROOMS = 3; // Maximum number of skinny rooms (rooms disguised as hallways)
	const SKINNYROOM_CHANCE = 10; // one chance in X of a room being skinny

	// The twelve possible room-to-room connections
	const CONNECTIONS = ["01","12","03","14","25","34","45","36","47","58","67","78"];

	function none(room) {
		return true;
	}

	function not(f) {
		return function(arg) {
			return !f(arg);
		}
	}

	function skinny(room) {
		return room.isSkinny;
	}

	/**
	 * If we can find our way from this room to a room already marked as connected,
	 *  mark this room as connected and return true
	 * @rooms the array of rooms to check
	 * @id the index of the room in question
	 * @tested the array of rooms we've already looked at, so don't look at them again
	 */
	function canGetToConnectedRoom(rooms, id, tested) {
		tested = tested || [];
		tested.push(id);
		if (rooms[id].connected) {
			return true;
		}
		let exits = rooms[id].exits;
		for (let i = 0; i < exits.length; i++) {
			let testId = exits[i];
			if (tested.indexOf(testId) == -1) {
				if (canGetToConnectedRoom(rooms, testId, tested)) {
					rooms[tested[0]].connected = true;
					return true;
				}
			}
		}
		return false;
	}

	/**
	 * @return true if any rooms are still isolated
	 */
	function thereAreAnyUnconnected(rooms) {
		return !! rooms.find(room => !canGetToConnectedRoom(rooms, room.id));
	}

	/**
	 * Level generator that behaves similar to classic rogue
	 * (Or will when it is finished)
	 * 110 x 55 level, 3x3 grid of rooms
	 */
	module.exports = class LevelGeneratorClassic extends LevelGenerator {
		/**
		 * return a 2-dimensional array of Cells.
		 * base class returns empty map
		 */
		generateLevelMap(mapSeed) {
			this.cells = [];
			this.rooms = [];
			this.rng = new RNG(mapSeed);
			this.bus = new EventBus();
			// Start with all void
			for (let x = 0; x < CLASSIC_WIDTH; x++) {
				for (let y = 0; y < CLASSIC_HEIGHT; y++) {
					this.cells[x] = this.cells[x] || [];
					this.cells[x].push(this.getCell("void"));
				}
			}
			// Build the rooms
			let id = 0;
			let numSkinny = 0;
			for (let y = 0; y < 3; y++) {
				for (let x = 0; x < 3; x++, id++) {
					let w = 0, h = 0;
					if (numSkinny < MAX_SKINNY_ROOMS) {
						if (this.rng.between(1, SKINNYROOM_CHANCE) == 1) {
							w = 1;
						}
						if (this.rng.between(1, SKINNYROOM_CHANCE) == 1) {
							h = 1;
						}
						if (w || h) {
							numSkinny++;
						}
					}
					this.__buildRoom(id, x, y, w, h);
				}
			}

			// Hook up the possible connections in random order until there are no isolated rooms
			var shuffledConnections = this.rng.shuffle(CONNECTIONS);
			let firstRoom = this.rooms[+(shuffledConnections[0][0])];
			let secondRoom = this.rooms[+(shuffledConnections[0][1])];
			firstRoom.connected = true;
			secondRoom.connected = true;
			let walk = 0;
			while (walk < shuffledConnections.length && thereAreAnyUnconnected(this.rooms)) {
				this.__makeConnection(shuffledConnections[walk]);
				walk++;
			}
			console.log("BUILT", walk, "CONNECTIONS");
			return {
				cells: this.cells,
				entry: this.__makeEntry(),
				bus: this.bus,
				generator: this
			};
		}
		clockAction(tick) {
			// Maybe generate random monsters someday
		}
		/**
		 * build a room in "nonant" at x,y
		 * pass in a width/height, or pass 0 for either to get a random size
		 */
		__buildRoom(id, x, y, w, h) {
			let pX = x * PLACEMENT_WIDTH, pY = y * PLACEMENT_HEIGHT;
			let roomWidth = w || this.rng.between(MIN_ROOM_WIDTH, MAX_ROOM_WIDTH);
			let roomHeight = h || this.rng.between(MIN_ROOM_HEIGHT, MAX_ROOM_HEIGHT);
			let spareWidth = (PLACEMENT_WIDTH - roomWidth) - 3;
			let spareHeight = (PLACEMENT_HEIGHT - roomHeight) - 3;
			let firstX = this.rng.between(pX, pX + spareWidth);
			let firstY = this.rng.between(pY, pY + spareHeight);
			let isSkinny = roomWidth == 1 || roomHeight == 1;
			console.log("Creating", roomWidth, "by", roomHeight, "room at", firstX, firstY);
			let lastX = firstX + roomWidth + 1, lastY = firstY + roomHeight + 1;
			for (let x = firstX; x <= lastX; x++) {
				for (let y = firstY; y <= lastY; y++) {
					let cellType = "floor";
					let cellState = isSkinny ? 'cobblestone' : 'tile';
					if (x == firstX || x == lastX || y == firstY || y == lastY) {
						// TODO: hallways will have walls, so this can be walls for all rooms, but for now
						// be like original rogue and make them void
						//cellType = isSkinny ? "void" : "wall";
						cellType = "wall";
						cellState = undefined;
					}
					this.cells[x][y] = this.getCell(cellType, cellState);
				}
			}
			this.rooms[id] = {
				skinny: isSkinny,
				connected: false,
				id: id,
				row: y,
				column: x,
				top: firstY,
				left: firstX,
				right: lastX,
				bottom: lastY,
				exits: []
			};
		}
		__makeConnection(str) {
			var a = str.split("").map((c) => +c);
			this.__connectRooms(a[0], a[1]);
		}
		__connectRooms(id1, id2) {
			console.log("Connecting", id1, "to", id2);
			let fromId = Math.min(id1, id2);
			let toId = Math.max(id1, id2);
			this.__buildCorridor(this.rooms[fromId], this.rooms[toId]);
		}
		__buildCorridor(fromRoom, toRoom) {
			var firstX, firstY, lastX, lastY;
			var fromX, fromY, toX, toY;
			let replaceVoidWithWall = (x, y) => {
				if (this.cells[x][y].cellType == "void") {
					this.cells[x][y] = this.getCell("wall");
				}
			}
			if (fromRoom.row == toRoom.row) {
				// same row, corridor will be horizontal
				fromX = firstX = fromRoom.right;
				fromY = this.rng.between(fromRoom.top + 1, fromRoom.bottom - 1);
				toX = lastX = toRoom.left;
				toY = this.rng.between(toRoom.top + 1, toRoom.bottom - 1);
				firstY = Math.min(fromY, toY);
				lastY = Math.max(fromY, toY);
				let bend = this.rng.between(firstX+1, lastX-1);
				for (let walk = firstX; walk <= bend; walk++) {
					replaceVoidWithWall(walk, fromY - 1);
					this.cells[walk][fromY] = this.getCell("floor", "cobblestone");
					replaceVoidWithWall(walk, fromY + 1);
				}
				replaceVoidWithWall(bend - 1, firstY - 1);
				replaceVoidWithWall(bend + 1, firstY - 1);
				for (let walk = firstY; walk <= lastY; walk++) {
					replaceVoidWithWall(bend - 1, walk);
					this.cells[bend][walk] = this.getCell("floor", "cobblestone");
					replaceVoidWithWall(bend + 1, walk);
				}
				replaceVoidWithWall(bend - 1, lastY + 1);
				replaceVoidWithWall(bend + 1, lastY + 1);
				for (let walk = bend; walk <= lastX; walk++) {
					replaceVoidWithWall(walk, toY - 1);
					this.cells[walk][toY] = this.getCell("floor", "cobblestone");
					replaceVoidWithWall(walk, toY + 1);
				}
			} else if (fromRoom.column == toRoom.column) {
				// same column, corridor will be vertical
				fromY = firstY = fromRoom.bottom;
				fromX = this.rng.between(fromRoom.left + 1, fromRoom.right - 1);
				toY = lastY = toRoom.top;
				toX = this.rng.between(toRoom.left + 1, toRoom.right - 1);
				firstX = Math.min(fromX, toX);
				lastX = Math.max(fromX, toX);
				let bend = this.rng.between(firstY+1, lastY-1);
				for (let walk = firstY; walk <= bend; walk++) {
					replaceVoidWithWall(fromX - 1, walk);
					this.cells[fromX][walk] = this.getCell("floor", "cobblestone");
					replaceVoidWithWall(fromX + 1, walk);
				}
				replaceVoidWithWall(firstX - 1, bend - 1);
				replaceVoidWithWall(firstX - 1, bend + 1);
				for (let walk = firstX; walk <= lastX; walk++) {
					replaceVoidWithWall(walk, bend - 1);
					this.cells[walk][bend] = this.getCell("floor", "cobblestone");
					replaceVoidWithWall(walk, bend + 1);
				}
				replaceVoidWithWall(lastX + 1, bend - 1);
				replaceVoidWithWall(lastX + 1, bend + 1);
				for (let walk = bend; walk <= lastY; walk++) {
					replaceVoidWithWall(toX - 1, walk);
					this.cells[toX][walk] = this.getCell("floor", "cobblestone");
					replaceVoidWithWall(toX + 1, walk);
				}
			} else {
				console.log("can't build a corridor between these rooms", fromRoom, toRoom);
				return;
			}
			if (!fromRoom.skinny) {
				let fromDoor = this.getCell("door");
				fromDoor.initialize(1, fromX, fromY, "closed");
				this.cells[fromX][fromY] = fromDoor;
			}
			if (!toRoom.skinny) {
				let toDoor = this.getCell("door");
				toDoor.initialize(1, toX, toY, "closed");
				this.cells[toX][toY] = toDoor;
			}
			fromRoom.exits.push(toRoom.id);
			toRoom.exits.push(fromRoom.id);
			// If either room was connected before, both are connected now.
			if (fromRoom.connected || toRoom.connected) {
				fromRoom.connected = toRoom.connected = true;
			}
		}
		__pickRandomRoom(restrictions = none) {
			return this.rng.randomEntry(this.rooms.filter(restrictions));
		}
		__pickRandomPosition(room) {
			room = room || this.__pickRandomRoom();
			// TODO: make sure Position is unoccupied
			return {
				x: this.rng.between(room.left + 1, room.right - 1),
				y: this.rng.between(room.top + 1, room.bottom - 1)
			};
		}
		__makeEntry() {
			var room = this.__pickRandomRoom(not(skinny));
			room.safe = true;
			// TODO: Make beds in each corner
			return this.__pickRandomPosition(room);
		}
	};
}

