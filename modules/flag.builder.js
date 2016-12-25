var roleBuilder = require('role.builder');
var managerSpawn = require('manager.spawn');

var flagBuilder = {
    manage: function(flag) {
        if(!flag.memory.index) {
            flag.memory.index = 0;
        }
        if(!flag.memory.max_creep) {
            flag.memory.max_creep = 2;
        }
        if(!flag.memory.body) {
            flag.memory.body = [WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE];
        }
        if(!flag.memory.spawn_name) {
            flag.memory.spawn_name = 'Spawn2';
        }

        var cname = 'builder_' + flag.name;
        var creeps = _.filter(Game.creeps, (creep) => creep.name.substring(2) == cname);
        if(creeps.length < flag.memory.max_creep) {
            var tname = flag.memory.index%10 + '_' + cname;
            var spawn = Game.spawns[flag.memory.spawn_name];
            managerSpawn.addCreep(flag, 16, spawn, flag.memory.body, tname, {});

        }
        for(var i in creeps) {
            roleBuilder.run(creeps[i], flag.pos);
        }
    }
};

module.exports = flagBuilder;