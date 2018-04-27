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
                var path = creep.pos.findPathTo(dest, {
                    costCallback: function(rn, cm) {
                        if(rn == 'W56N26') {
                            for(var i = 0; i < 50; i++){
                                cm.set(i, 2, 255);
                            }
                        }
                        if(rn == 'W56N18') {
                            for(var i = 0; i < 50; i++){
                                cm.set(i, 2, 255);
                            }
                        }

                        flags = _.filter(Game.flags, function(flag) {
                            return flag.color == 1 && flag.secondaryColor == 9 && flag.pos.roomName == rn;
                        })

                        for(var f in flags) {
                            var pos = flags[f].pos;
                            for(var i = -5; i <= 5; i++) {
                                for(var j = -5; j <= 5; j++) {
                                    if(0 <= pos.x+i && pos.x+i < 50 && 0 <= pos.y+j && pos.y+j < 50) {
                                        cm.set(pos.x + i, pos.y + j, 2550);
                                    }
                                }
                            }
                        }


                    },
                });
                creep.memory.path = Room.serializePath(path);
                creep.memory.get_path = -1;
            }

            var path = Room.deserializePath(creep.memory.path);
            creep.moveByPath(path);
        }
    },

    getTerminal: function(room) {
        var terminal = Game.getObjectById(room.memory.terminal_id);
        if(terminal) return terminal;
        terminal = room.find(FIND_MY_STRUCTURES, {
            filter: function(s) {
                return s.structureType == 'terminal';
            }
        });
        if(terminal.length == 0) return null;
        room.memory.terminal_id = terminal[0].id;
        return terminal[0];
    },

    getStorage: function(room) {
        var storage = Game.getObjectById(room.memory.storage_id);
        if(storage) return storage;
        storage = room.find(FIND_MY_STRUCTURES, {
            filter: function(s) {
                return s.structureType == 'storage';
            }
        });
        if(storage.length == 0) return null;
        room.memory.storage_id = storage[0].id;
        return storage[0];
    },

    getPullStructure: function(room) {
        var storages = room.find(FIND_MY_STRUCTURES, {
            filter: function(s) {
                return s.structureType == "storage";
            }
        })
        if(storages.length) return storages[0];

        var flags = room.find(FIND_FLAGS, {
            filters: function(flag) {
                return flag.color == 7 && flag.secondaryColor == 7;
            }
        })
        if(flags.length) return flags[0];

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

    store_cpu: function(display) {
        display = display || false;

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
        
        
        
        if(!Memory.gcl_stat) {
            Memory.gcl_stat = [];
        }
        Memory.gcl_stat.push(Game.gcl.progressTotal - Game.gcl.progress);
        if(Memory.gcl_stat.length > 100) {
            Memory.gcl_stat.splice(0, Memory.gcl_stat.length - 100);
        }
        var gcl_med = (Memory.gcl_stat[0] - Memory.gcl_stat[Memory.gcl_stat.length - 1]) / Memory.gcl_stat.length;
        var t = (Game.gcl.progressTotal - Game.gcl.progress) / gcl_med;
        console.log(gcl_med.toFixed(2), t.toFixed(0), (t/1200).toFixed(2), (t/28800).toFixed(3));
        
        
        
        if(display) {
            console.log(
                Game.time + ' || ' +
                total1.toFixed(3) + ' - ' +
                total2.toFixed(3) + ' - ' +
                total3.toFixed(3) +
                ' [ ' + cpu_used.toFixed(3) + ' ] ' +
                Game.cpu.bucket.toFixed(0)
            );

            if(!(Game.time%5)) {
                _.forEach(Game.rooms, function(room) {
                    var controller = room.controller;
                    if(controller && controller.my) {
                        console.log(
                            room.name + ' | ' +
                            controller.progress + '/' +
                            controller.progressTotal +
                            ' [' + (controller.progress / controller.progressTotal).toFixed(4) + ']'
                        )
                    }
                })
            }
            
        }
    },

}

module.exports = tools;