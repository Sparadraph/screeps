var tools = require('tools');
var managerId = require('manager.id');
var managerTask = require('manager.task');

var managerGroup = {
	init: function(type) {
		var group_id = managerId.getId('group');
		Memory.data.group[group_id] = {
			type: type,
		};
		return group_id;
	},

	stageFarmer: function(group_id, roomName) {
		var mem = Memory.data.group[group_id];

		var room = Game.rooms[roomName];
		if(!room) {
			mem.state = 'staging';
		} else {
			mem.state = 'live';
		}

		if(mem.state == 'live') {
			var sources = room.find(FIND_SOURCES);

			_.forEach(sources, function(source) {
				var pickpos = managerTask.initFarmer(group_id, source);
				managerTask.initLinker(group_id, pickpos, tools.getStockPosToControler(room));
			});

			if(room.find(FIND_MY_SPAWNS).length == 0) {
				managerTask.initReserver(group_id, room);
			}
		}
	}

	initFarmer: function(roomName) {
		var group_id = this.init('farmer');
		var mem = Memory.data.group[group_id];
		mem.state = 'staging';
		mem.roomName = roomName;

		var room = Game.rooms[roomName];
		if(!room) {
			managerTask.initExplorer(group_id, roomName);
		}
	},

	initUpper: function(roomName, nb_creep) {
		nb_creep = nb_creep || -1;

		var group_id = this.init('upper');
		var room = Game.rooms[roomName];
		managerTask.initUpper(group_id, room, nb_creep);
	},

	initAutoUpper: function(roomName) {
		var group_id = this.init('auto_upper');
		var room = Game.rooms[roomName];
		managerTask.initAutoUpper(group_id, room);
	},

	initFiller: function(roomName) {
		var group_id = this.init('filler');
		var room = Game.rooms[roomName];

		managerTask.initFiller(group_id, room);
	},

	initAutoFiller: function(roomName) {
		var group_id = this.init('auto_filler');
		var room = Game.rooms[roomName];

		managerTask.initAutoFiller(group_id, room);
	},

	initBuilder: function(roomName) {
		var group_id = this.init('filler');
		var room = Game.rooms[roomName];

		managerTask.initBuilder(group_id, room);
	},

	initAutoBuilder: function(roomName) {
		var group_id = this.init('filler');
		var room = Game.rooms[roomName];

		managerTask.initAutoBuilder(group_id, room);
	},
};

module.exports = managerGroup;