var managerMiner = {
    getFlagsOn: function(obj) {
        return obj.room.find(FIND_FLAGS, {
            filter: function(flag) {
                return flag.pos.x == obj.pos.x && flag.pos.y == obj.pos.y;
            },
        });
    },

    getContainers: function(obj) {
        return obj.room.find(FIND_STRUCTURES, {
            filter: function(s) {
                return  s.structureType == 'container' &&
                        obj.pos.x - 1 <= s.pos.x && s.pos.x <= obj.pos.x +1 &&
                        obj.pos.y - 1 <= s.pos.y && s.pos.y <= obj.pos.y +1
            },
        });
    },

    get: function(room, type) {
        return room.find(FIND_STRUCTURES, {
            filter: function(s) {
                return s.structureType == type;
            },
        });
    },

    createMinerFlag: function(spawn, mineral, container) {
        var name = 'mineral_miner_' + mineral.room.name;
        mineral.room.createFlag(mineral.pos, name, 9, 9);

        Game.flags[name].memory = {
            spawn_name: spawn.name,
            pick_pos: [container.pos.x, container.pos.y],
            body: [
                WORK, WORK, WORK, MOVE,
                WORK, WORK, WORK, MOVE,
                WORK, WORK, WORK, MOVE,
                WORK, WORK, WORK, MOVE,
                WORK, WORK, WORK, MOVE,
            ],
        }
    },

    createLinkerFlag: function(spawn, mineral, container, terminal) {
        var name = 'mineral_linker_' + container.room.name;
        container.room.createFlag(container.pos, name, 6, 6);
        terminal.room.createFlag(terminal.pos, name + '_drop', 6, 5);

        Game.flags[name].memory = {
            spawn_name: spawn.name,
            body: [CARRY, CARRY, MOVE, MOVE, CARRY, MOVE, MOVE, CARRY, MOVE, CARRY],
            rtype: mineral.mineralType,
            max_creep: 1,
        }
    },

    manage: function(room) {
        var mineral = room.find(FIND_MINERALS)[0];
        var miner_flags = this.getFlagsOn(mineral);
        var containers = this.getContainers(mineral);
        var extractors = this.get(room, 'extractor');
        var terminals = this.get(room, 'terminal');
        var spawns = this.get(room, 'spawn');

        if(containers.length == 0 || extractors.length == 0 || terminals.length == 0)
            return -1;

        var linker_flags = this.getFlagsOn(containers[0]);
        if(mineral.mineralAmount > 0) {
            if(miner_flags.length == 0) {
                this.createMinerFlag(spawns[0], mineral, containers[0]);
            }
            if(linker_flags.length == 0) {
                this.createLinkerFlag(spawns[0], mineral, containers[0], terminals[0]);
            }
        } else {
            if(miner_flags.length > 0) {
                miner_flags[0].remove();
            }
            if(linker_flags.length > 0) {
                var drop_flag = Game.flags[linker_flags[0].name + '_drop'];
                drop_flag.remove();
                linker_flags[0].remove();
            }
        }
    },
};

module.exports = managerMiner;