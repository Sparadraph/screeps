var roleUpper = require('role.upper');
var managerSpawn = require('manager.spawn');

var flagUpper = {
    manage: function(flag) {
        if(!flag.memory.index) {
            flag.memory.index = 0;
        }
        if(!flag.memory.max_creep) {
            flag.memory.max_creep = 1;
        }
        if(!flag.memory.spawn_name) {
            flag.memory.spawn_name = 'Spawn5';
        }
        if(!flag.memory.body) {
            flag.memory.body = [WORK, WORK, CARRY, CARRY, MOVE, MOVE];
        }
        var cname = 'upper_' + flag.name;
        var creeps = _.filter(Game.creeps, (creep) => creep.name.substring(2) == cname);
        if(creeps.length < flag.memory.max_creep) {
            var tname = flag.memory.index%10 + '_' + cname;
            var spawn = Game.spawns[flag.memory.spawn_name];
            managerSpawn.addCreep(flag, 12, spawn, flag.memory.body, tname, {});
        }
        for(var i in creeps) {
            roleUpper.run(creeps[i], flag.pos);
        }
    }
};

module.exports = flagUpper;