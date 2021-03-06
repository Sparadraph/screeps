var roleClaimer = require('role.claimer');
var managerSpawn = require('manager.spawn');

var flagClaimer = {
    manage: function(flag) {
        if(!flag.memory.index) {
            flag.memory.index = 0;
        }
        if(!flag.memory.max_creep) {
            flag.memory.max_creep = 1;
        }
        if(!flag.memory.body) {
            flag.memory.body = [CLAIM, MOVE]
        }
        if(!flag.memory.spawn_name) {
            flag.memory.spawn_name = 'Spawn1a';
        }

        var cname = 'claimer_' + flag.name;
        var creeps = _.filter(Game.creeps, (creep) => creep.name.substring(2) == cname);
        if(creeps.length < flag.memory.max_creep) {
            var tname = flag.memory.index%10 + '_' + cname;
            var spawn = Game.spawns[flag.memory.spawn_name];
            managerSpawn.addCreep(flag, 24, spawn, flag.memory.body, tname, {});
        }
        for(var i in creeps) {
            roleClaimer.run(creeps[i], flag.pos);
        }
    }
};

module.exports = flagClaimer;