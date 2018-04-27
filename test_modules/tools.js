var tools = {
	move: function(creep, pos, avoid) {
		
		avoid = avoid || false;
		if(avoid) {
			if(creep.pos.inRangeTo(pos, 1)) {
				// Too close, do nothing
				return;
			}
		}

		creep.moveTo(pos);
	},

	pos2mem: function(pos) {
		return {
			x: pos.x,
			y: pos.y,
			roomName: pos.roomName,
		};
	},

	mem2pos: function(mem) {
		return new RoomPosition(mem.x, mem.y, mem.roomName);
	},

    getStr: function(room, type) {
        return room.find(FIND_STRUCTURES, {
            filter: function(s) {
                return s.structureType == type;
            },
        });
    },

	getCloserSpawn: function(pos) {
		var res = {
			spawn: false,
			dist: 10000,
		};
		
		_.forEach(Game.spawns, function(spawn) {
			var dist = PathFinder.search(pos, {pos:spawn.pos, range:1}).path.length;
			if(dist < res.dist) {
				res.spawn = spawn;
				res.dist = dist;
			}
		});

		return res;
	},

	getCloserSpawnFromObj: function(obj, dist, terrain_ok, terrain_nok) {
		dist = dist || 1;
		terrain_ok = terrain_ok || [];
		terrain_nok = terrain_nok || ['wall'];

		var self = this;
		var poss = this.getAdjValidPos(obj.pos, dist, terrain_ok, terrain_nok);
		var res = {
			pos: false,
			dist: 10000,
			spawn: false,
		};

		_.forEach(poss, function(pos) {
			var closer_spawn = self.getCloserSpawn(pos);
			if(closer_spawn.dist < res.dist) {
				res.pos = pos;
				res.dist = closer_spawn.dist;
				res.spawn = closer_spawn.spawn;
			}
		});

		return res;
	},

	getAdjValidPos: function(pos, dist, terrain_ok, terrain_nok) {
		dist = dist || 1;
		terrain_ok = terrain_ok || [];
		terrain_nok = terrain_nok || [];

		var res = [];
		for(var i=-dist; i<=dist; i++) {
			for(var j=-dist; j<=dist; j++) {
				var x = pos.x + i;
				var y = pos.y + j;
				if(0 <= x <= 49 && 0 <= y <= 49) {
					var cur_pos = new RoomPosition(x, y, pos.roomName);
					var terrain = Game.map.getTerrainAt(cur_pos);
					if(terrain_ok.length) {
						if(terrain_ok.indexOf(terrain) >= 0) {
							res.push(cur_pos);
						}
					} else {
						if(terrain_nok.length) {
							if(terrain_nok.indexOf(terrain) < 0) {
								res.push(cur_pos);
							}
						} else {
							res.push(cur_pos);
						}
					}
				}
			}
		}

		return res;
	},

	getStockPosToControler: function(room) {
		var storages = this.getStr(room, 'storage');
		if(storages.length) {
			return storage[0].pos;
		}

		var containers = this.getStr(room, 'containers');
		if(containers.length) {
			return containers[0].pos;
		}

		return new RoomPosition(room.memory.pos.x, room.memory.pos.y, room.name);
	},

	pushToLive: function(task_id) {
		console.log(task_id, Memory.data.task[task_id].state);
		Memory.data.task[task_id].state = 'live';
		console.log(task_id, Memory.data.task[task_id].state);
	},

	pushAllToLive: function() {
		var self = this;
		_.forEach(Memory.data.task, function(mem, task_id) {
			self.pushToLive(task_id);
		})
	},

	pushToStaging: function(task_id) {
		console.log(task_id, Memory.data.task[task_id].state);
		Memory.data.task[task_id].state = 'staging';
		console.log(task_id, Memory.data.task[task_id].state);
	},

	pushAllToStaging: function() {
		var self = this;
		_.forEach(Memory.data.task, function(mem, task_id) {
			self.pushToStaging(task_id);
		})
	},

	getCountPart: function(creep, type) {
		return _.filter(creep.body, function(b) {
			return b.type == type;
		}).length;
	},

	getCountParts: function(creeps, type) {
		var self = this;
		var t = type;
		var res = 0;
		_.forEach(creeps, function(creep) {
			res += self.getCountPart(creep, t);
		});
		return res;
	},

	posEq: function(pos1, pos2) {
		return pos1.x == pos2.x && pos1.y == pos2.y && pos1.roomName == pos2.roomName;
	},

	display_cpu: function() {
        if(!Memory.cpu_stat) {
            Memory.cpu_stat = {
                hold: [],
            };
        }
        var hl1 = 60;
        var hl2 = 300;
        var hl3 = 1500;
        var cpu_used = Game.cpu.getUsed();
        Memory.cpu_stat.hold.push(cpu_used);
        var hl = Memory.cpu_stat.hold.length;
        if(hl > hl3) {
            Memory.cpu_stat.hold.splice(0, hl-hl3);
        }

        var total1 = _.takeRight(Memory.cpu_stat.hold, hl1).reduce(function(a, b) { return a + b; }, 0) / hl1;
        var total2 = _.takeRight(Memory.cpu_stat.hold, hl2).reduce(function(a, b) { return a + b; }, 0) / hl2;
        var total3 = _.takeRight(Memory.cpu_stat.hold, hl3).reduce(function(a, b) { return a + b; }, 0) / hl3;
        console.log(Game.time + ' || ' + total1.toFixed(3) + ' - ' + total2.toFixed(3) + ' - ' + total3.toFixed(3) + ' [ ' + cpu_used.toFixed(3) + ' ] ' + Game.cpu.bucket.toFixed(0));
    },
};


module.exports = tools;