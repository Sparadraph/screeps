var roleExplorer = require('role.explorer');
var managerSpawn = require('manager.spawn');

var flagExplorer = {
    manage: function(flag) {
        if(!flag.memory.index) {
            flag.memory.index = 0;
        }
        if(!flag.memory.max_creep) {
            flag.memory.max_creep = 1;
        }
        if(!flag.memory.body) {
            flag.memory.body = [MOVE];
        }
        if(!flag.memory.spawn_name) {
            flag.memory.spawn_name = 'Spawn4';
        }
        var cname = 'explorer_' + flag.name;
        var creeps = _.filter(Game.creeps, (creep) => creep.name.substring(2) == cname);
        if(creeps.length < flag.memory.max_creep) {
            var tname = flag.memory.index%10 + '_' + cname;
            var spawn = Game.spawns[flag.memory.spawn_name];
            managerSpawn.addCreep(flag, 8, spawn, flag.memory.body, tname, {});
        }
        for(var i in creeps) {
            roleExplorer.run(creeps[i], flag.pos);
        }
    }
};

module.exports = flagExplorer;