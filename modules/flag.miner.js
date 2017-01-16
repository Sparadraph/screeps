var roleMiner = require('role.miner');
var managerSpawn = require('manager.spawn');

var flagMiner = {
    manage: function(flag) {
        var room_name = flag.pos.roomName;
        var room = Game.rooms[room_name];
        if(room == undefined) {
            return -1;
        }

        if(!flag.memory.pick_pos) {
            for(var i=-1; i<=1; i++) {
                for(var j=-1; j<=1; j++) {
                    if(Game.map.getTerrainAt(flag.pos.x + i, flag.pos.y + j, room.name) != 'wall') {
                        flag.memory.pick_pos = [flag.pos.x + i, flag.pos.y + j];
                    }
                }
            }
        }
        if(!flag.memory.index) {
            flag.memory.index = 0;
        }
        if(!flag.memory.max_creep) {
            flag.memory.max_creep = 1;
        }
        if(!flag.memory.replace_time) {
            var distx = flag.pos.x - room.controller.pos.x;
            var disty = flag.pos.y - room.controller.pos.y;
            var dist = Math.max(Math.abs(distx), Math.abs(disty));
            flag.memory.replace_time = 5 * dist + 20;
        }

        if(!flag.memory.body) {
            flag.memory.body = [WORK, WORK, WORK, WORK, WORK, MOVE, MOVE, MOVE, MOVE, MOVE];
        }
        if(!flag.memory.spawn_name) {
            flag.memory.spawn_name = 'Spawn10';
        }

        var cname = 'miner_' + flag.name;
        var creeps = _.filter(Game.creeps, (creep) => creep.name.substring(2) == cname);
        var rcreeps = _.filter(Game.creeps, (creep) => creep.name.substring(2) == cname && creep.ticksToLive < flag.memory.replace_time)

        var sources = flag.pos.lookFor(LOOK_SOURCES);
        if(sources.length == 0) {
            sources = flag.pos.lookFor(LOOK_MINERALS);
        }

        if(creeps.length - rcreeps.length < flag.memory.max_creep) {
        // if(creeps.length == 0 || flag.memory.to_replace > 0) {
            var mem = {
                    'x': flag.memory.pick_pos[0],
                    'y': flag.memory.pick_pos[1],
                    'room_name': room_name,
                    'source_id': sources[0].id,
                }
            var tname = flag.memory.index%10 + '_' + cname;
            var spawn = Game.spawns[flag.memory.spawn_name];
            managerSpawn.addCreep(flag, 4, spawn, flag.memory.body, tname, mem);
        }
        for(var i in creeps) {
            roleMiner.run(creeps[i], flag);
        }
    }
};

module.exports = flagMiner;