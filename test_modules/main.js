// require('manager.group').initFarmer('sim');
// require('manager.group').initUpper('sim');
// require('tools').pushAllToLive();

var managerId = require('manager.id');
var managerQueueSpawn = require('manager.queue.spawn');
var managerGroup = require('manager.group');
var managerTask = require('manager.task');
var managerCreep = require('manager.creep');
var managerTower = require('manager.tower');
var tools = require('tools');

module.exports.loop = function () {
	console.log('======= START ========', Game.time);

	// Initialise New Spawns Memory
	_.forEach(Game.spawns, function(spawn) {
		if(!spawn.memory.queue) {
			managerQueueSpawn.init(spawn);
		}
	});

	// Initialise IDs Memory
	managerId.init();


	// Manage Towers
	managerTower.manageTowers();


	// Run creeps
	_.forEach(Game.creeps, function(creep) {
		managerCreep.run(creep);
	});


	// TODO: upgrade this
	_.forEach(Game.flags, function(flag) {
		var creep = Game.creeps['contact_' + flag.name];
		if(creep) {
			managerCreep.runSoldierContact(creep, flag.pos);
		} else {
			Game.spawns.Spawn1.spawnCreep([MOVE, ATTACK], 'contact_' + flag.name, {
				memory: {
					task_id: 0,
				}
			});
		}


	})


	// Stage Groups
	_.forEach(Memory.data.group, function(mem, group_id) {
		if(mem.state == 'staging' && mem.type == 'farmer') {
			managerGroup.stageFarmer(group_id, mem.roomName);
		}
	})

	// Forecast Spawning Creeps from Tasks
	managerTask.forecastSpawn();

	// Produce Creeps
	_.forEach(Game.spawns, function(spawn) {
		managerQueueSpawn.produce(spawn);
	});

	tools.display_cpu();
	console.log('========= END ========', Game.time);
};