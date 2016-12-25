var tools = {
    move: function(creep, x, y, room_name) {
        room_name = room_name || false;
        if(creep.room.name == room_name) {
            creep.moveTo(x, y);
        } else {
            if(!creep.memory.get_path) {
                creep.memory.get_path = 1;
            }

            if(!creep.memory.roomName) {
                creep.memory.roomName = creep.room.name;
            }

            if(creep.memory.roomName != creep.room.name) {
                creep.memory.roomName = creep.room.name;
                creep.memory.get_path = 1;
            }

            if(creep.memory.pastx == creep.pos.x && creep.memory.pasty == creep.pos.y) {
                creep.memory.cpt += 1;
            } else {
                creep.memory.cpt = 0;
            }

            if(creep.memory.cpt > 3) {
                creep.memory.get_path = 1;
                creep.memory.cpt = 0;
            }

            creep.memory.pastx = creep.pos.x;
            creep.memory.pasty = creep.pos.y;

            if(creep.memory.get_path == 1) {
                var dest = new RoomPosition(x, y, room_name);
                var path = creep.pos.findPathTo(dest);
                creep.memory.path = Room.serializePath(path);
                creep.memory.get_path = -1;
            }

            var path = Room.deserializePath(creep.memory.path);
            creep.moveByPath(path);
        }
    },

    getPullStructure: function(room) {
        var storages = room.find(FIND_MY_STRUCTURES, {
            filter: function(s) {
                return s.structureType == "storage";
            }
        })
        if(storages) return storages[0];

        var containers = room.find(FIND_MY_STRUCTURES, {
            filters: function(s) {
                return s.structureType == "container";
            }
        })
        if(containers) return container[0];

        var flags = room.find(FIND_FLAGS, {
            filters: function(flag) {
                return flag.color == 6 && flag.secondaryColor == 6;
            }
        })
        if(flags) return flags[0];

        return null;
    },

    clean_mem: function() {
        for(var name in Memory.creeps) {
            if(!Game.creeps[name]) {
                delete Memory.creeps[name];
                console.log('Clearing non-existing creep memory:', name);
            }
        }
        for(var name in Memory.flags) {
            if(!Game.flags[name]) {
                delete Memory.flags[name];
                console.log('Clearing non-existing flag memory:', name);
            }
        }
    },

    display_cpu: function() {
        if(!Memory.cpu_stat) {
            Memory.cpu_stat = {
                hold: [],
            };
        }
        var hl1 = 60;
        var hl2 = 300;
        var hl3 = 1500;
        var cpu_used = Game.cpu.getUsed();
        Memory.cpu_stat.hold.push(cpu_used);
        var hl = Memory.cpu_stat.hold.length;
        if(hl > hl3) {
            Memory.cpu_stat.hold.splice(0, hl-hl3);
        }

        var total1 = _.takeRight(Memory.cpu_stat.hold, hl1).reduce(function(a, b) { return a + b; }, 0) / hl1;
        var total2 = _.takeRight(Memory.cpu_stat.hold, hl2).reduce(function(a, b) { return a + b; }, 0) / hl2;
        var total3 = _.takeRight(Memory.cpu_stat.hold, hl3).reduce(function(a, b) { return a + b; }, 0) / hl3;
        console.log(total1.toFixed(3) + ' - ' + total2.toFixed(3) + ' - ' + total3.toFixed(3) + ' [ ' + cpu_used.toFixed(3) + ' ] ' + Game.cpu.bucket.toFixed(0));
        console.log((Game.cpu.getUsed() - cpu_used).toFixed(3), Memory.cpu_stat.hold.length);
    },

}

module.exports = tools;