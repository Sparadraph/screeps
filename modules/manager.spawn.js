var tools = require('tools');

var managerSpawn = {
    init: function() {
        Memory.managerSpawn = {};
        Memory.managerSpawn.accept = {};
        Memory.managerSpawn.refuse = [];
        if(!Memory.lockRoomNames) {
            Memory.lockRoomNames = [];
        }
    },

    updateLockRooms: function() {
        var lockRoomNames = [];
        _.forEach(Game.rooms, function(room) {
            var keeper_lairs = room.find(FIND_HOSTILE_STRUCTURES, {
                filter: function(str) {
                    return str.structureType == 'keeperLair';
                }
            });
            var enemys = room.find(FIND_HOSTILE_CREEPS);
            if(enemys.length > keeper_lairs.length) {
                lockRoomNames.push(room.name);
            }
        })

        Memory.lockRoomNames = lockRoomNames;
    },

    addCreep: function(flag, sequence, spawn, body, name, mem) {
        if(spawn == undefined) return -1;
        // Don't spawn civilians in rooms with ennemies
        if(flag.room != undefined && flag.color != 1 && Memory.lockRoomNames.indexOf(flag.room.name) >= 0) {
            console.log('REFUSING ' + flag.name);
            return -1;
        }

        var data = {flag: flag, sequence: sequence, spawn: spawn, body: body, name: name, mem: mem}
        if(!Memory.managerSpawn.accept[spawn.name]) {
            Memory.managerSpawn.accept[spawn.name] = data;
        } else if(Memory.managerSpawn.accept[spawn.name].sequence > sequence) {
            Memory.managerSpawn.refuse.push(Memory.managerSpawn.accept[spawn.name]);
            Memory.managerSpawn.accept[spawn.name] = data;
        } else {
            Memory.managerSpawn.refuse.push(data);
        }
    },

    produceCreep: function(verbose) {
        _.forOwn(Memory.managerSpawn.accept, function(data) {
            if(verbose) {
                console.log("(" + data.sequence + ") TMP Spawning " + data.name + " from " + data.spawn.name);
            }
            if(data.spawn.createCreep(data.body, data.name, data.mem) == data.name) {
                data.flag.memory.index += 1;
                // if(data.flag.memory.to_replace) {
                //     data.flag.memory.to_replace = Math.max(0, data.flag.memory.to_replace - 1);
                // }
                if(verbose) {
                    console.log("(" + data.sequence + ") Spawning " + data.name + " from " + data.spawn.name);
                }
            };
        })
        if(verbose) {
            Memory.managerSpawn.refuse.forEach(function(data) {
                console.log("(" + data.sequence + ") Refused " + data.name + " from " + data.spawn.name);
            })
        }
    },
};

module.exports = managerSpawn;