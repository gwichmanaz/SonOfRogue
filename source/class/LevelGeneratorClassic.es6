{
	let LevelGenerator = require('./LevelGenerator.es6');
	let RNG = require('./RNG.es6');
	const CLASSIC_WIDTH = 110;
	const CLASSIC_HEIGHT = 55;
	const PLACEMENT_HEIGHT = Math.floor(CLASSIC_HEIGHT / 3);
	const PLACEMENT_WIDTH = Math.floor(CLASSIC_WIDTH / 3);
	const MAX_ROOM_HEIGHT = PLACEMENT_HEIGHT - 3;
	const MAX_ROOM_WIDTH = PLACEMENT_WIDTH - 3;
	const MIN_ROOM_HEIGHT = 7;
	const MIN_ROOM_WIDTH = 7;

	// The twelve possible room-to-room connections
	const CONNECTIONS = ["01","12","03","14","25","34","45","36","47","58","67","78"];

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
			// Start with all void
			for (let x = 0; x < CLASSIC_WIDTH; x++) {
				for (let y = 0; y < CLASSIC_HEIGHT; y++) {
					this.cells[x] = this.cells[x] || [];
					this.cells[x].push(this.getCell("void"));
				}
			}
			// Build the rooms
			let id = 0;
			for (let y = 0; y < 3; y++) {
				for (let x = 0; x < 3; x++, id++) {
					this.__buildRoom(id, x, y);
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
				entry: this.__makeEntry()
			};
		}
		__buildRoom(id, x, y) {
			let pX = x * PLACEMENT_WIDTH, pY = y * PLACEMENT_HEIGHT;
			let roomHeight = this.rng.between(MIN_ROOM_HEIGHT, MAX_ROOM_HEIGHT);
			let roomWidth = this.rng.between(MIN_ROOM_WIDTH, MAX_ROOM_WIDTH);
			let spareWidth = (PLACEMENT_WIDTH - roomWidth) - 2;
			let spareHeight = (PLACEMENT_HEIGHT - roomHeight) - 2;
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
			this.rooms[id] = {
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
			if (fromRoom.row == toRoom.row) {
				// same row, corridor will be horizontal
				let firstX = fromRoom.right;
				let fromY = this.rng.between(fromRoom.top + 1, fromRoom.bottom - 1);
				let lastX = toRoom.left;
				let toY = this.rng.between(toRoom.top + 1, toRoom.bottom - 1);
				let firstY = Math.min(fromY, toY);
				let lastY = Math.max(fromY, toY);
				let bend = this.rng.between(firstX+1, lastX-1);
				for (let walk = firstX; walk < bend; walk++) {
					this.cells[walk][fromY] = this.getCell("floor");
				}
				for (let walk = firstY; walk <= lastY; walk++) {
					this.cells[bend][walk] = this.getCell("floor");
				}
				for (let walk = bend; walk <= lastX; walk++) {
					this.cells[walk][toY] = this.getCell("floor");
				}
			} else if (fromRoom.column == toRoom.column) {
				// same column, corridor will be vertical
				let firstY = fromRoom.bottom;
				let fromX = this.rng.between(fromRoom.left + 1, fromRoom.right - 1);
				let lastY = toRoom.top;
				let toX = this.rng.between(toRoom.left + 1, toRoom.right - 1);
				let firstX = Math.min(fromX, toX);
				let lastX = Math.max(fromX, toX);
				let bend = this.rng.between(firstY+1, lastY-1);
				for (let walk = firstY; walk < bend; walk++) {
					this.cells[fromX][walk] = this.getCell("floor");
				}
				for (let walk = firstX; walk <= lastX; walk++) {
					this.cells[walk][bend] = this.getCell("floor");
				}
				for (let walk = bend; walk <= lastY; walk++) {
					this.cells[toX][walk] = this.getCell("floor");
				}
			} else {
				console.log("can't build a corridor between these rooms", fromRoom, toRoom);
				return;
			}
			fromRoom.exits.push(toRoom.id);
			toRoom.exits.push(fromRoom.id);
			// If either room was connected before, both are connected now.
			if (fromRoom.connected || toRoom.connected) {
				fromRoom.connected = toRoom.connected = true;
			}
		}
		__pickRandomRoom() {
			return this.rng.randomEntry(this.rooms);
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
			var room = this.__pickRandomRoom();
			room.safe = true;
			// TODO: Make beds in each corner
			return this.__pickRandomPosition(room);
		}
	};
}

