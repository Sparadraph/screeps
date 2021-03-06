var roleLinker = require('role.linker');
var managerSpawn = require('manager.spawn');

var flagLinker = {
    manage: function(flag) {
        var room_name = flag.pos.roomName;
        var room = Game.rooms[room_name];
        if(room == undefined) {
            return -1;
        }

        if(!flag.memory.index) {
            flag.memory.index = 0;
        }
        if(!flag.memory.max_creep) {
            flag.memory.max_creep = 1;
        }
        if(!flag.memory.spawn_name) {
            flag.memory.spawn_name = 'Spawn4';
        }
        if(!flag.memory.body) {
            flag.memory.body = [
                CARRY, MOVE, /*CARRY, MOVE, CARRY, MOVE,
                CARRY, MOVE, CARRY, MOVE, CARRY, MOVE,
                CARRY,CARRY, CARRY,CARRY, CARRY,CARRY,
                CARRY, MOVE, MOVE,CARRY, CARRY, WORK*/
                ];
        }
        if(!flag.memory.rtype) {
            flag.memory.rtype = 'energy';
        }
        if(!flag.memory.max_fill) {
            flag.memory.max_fill = 1;
        }

        var cname = 'linker_' + flag.name;
        var flag_drops = _.filter(Game.flags, (f) => f.name == flag.name + '_drop');
        if(flag_drops.length > 0) {
            var fd = flag_drops[0];
            var creeps = _.filter(Game.creeps, (creep) => creep.name.substring(2) == cname);
            if(creeps.length < flag.memory.max_creep) {
                var tname = flag.memory.index%10 + '_' + cname;
                var spawn = Game.spawns[flag.memory.spawn_name];
                managerSpawn.addCreep(flag, 8, spawn, flag.memory.body, tname, {});
            }
        }

        for(var i in creeps) {
            roleLinker.run(creeps[i], flag.pos, fd.pos, flag.memory.rtype, flag.memory.max_fill);
        }
    }
};

module.exports = flagLinker;