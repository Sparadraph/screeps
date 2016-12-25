var roleReserver = require('role.reserver');
var managerSpawn = require('manager.spawn');

var flagReserver = {
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
            flag.memory.spawn_name = 'Spawn3';
        }

        var cname = 'reserver_' + flag.name;
        var creeps = _.filter(Game.creeps, (creep) => creep.name.substring(2) == cname);
        if(creeps.length < flag.memory.max_creep) {
            var create = true;
            if(flag.room && flag.room.controller.reservation && flag.room.controller.reservation.ticksToEnd > 4000) {
                create = false;
            }
            if(create) {
                var tname = flag.memory.index%10 + '_' + cname;
                // if(Game.spawns[flag.memory.spawn_name].createCreep(flag.memory.body, tname) == tname) {
                //     flag.memory.index += 1;
                // }
                var spawn = Game.spawns[flag.memory.spawn_name];
                managerSpawn.addCreep(flag, 24, spawn, flag.memory.body, tname, {});
            }
        }
        for(var i in creeps) {
            roleReserver.run(creeps[i], flag.pos);
        }
    }
};

module.exports = flagReserver;