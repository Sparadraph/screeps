var tools = require('tools');

var roleBalancer = {
    /** @param {Creep} creep **/
    run: function(creep) {
        if(creep.carry[RESOURCE_ENERGY] == 0 && !creep.memory.picking) {
            creep.memory.picking = true;
            creep.memory.target_id = false;
        }
        if(creep.carry[RESOURCE_ENERGY] == creep.carryCapacity && creep.memory.picking) {
            creep.memory.picking = false;
            creep.memory.target_id = false;
        }

        if(creep.memory.picking) {
            if(creep.memory.target_id) {
                var target = Game.getObjectById(creep.memory.target_id);
                if(creep.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                }
            } else {
                var terminal = tools.getTerminal(creep.room);
                var storage = tools.getStorage(creep.room);
                if(!terminal || !storage) return;
                if(storage.store[RESOURCE_ENERGY] > 100000 && terminal.store[RESOURCE_ENERGY] < 100000) {
                    creep.memory.target_id = storage.id;
                }
                if(storage.store[RESOURCE_ENERGY] < 50000 && terminal.store[RESOURCE_ENERGY] > 100000) {
                    creep.memory.target_id = terminal.id;
                }
            }
        } else {
            if(creep.memory.target_id) {
                var target = Game.getObjectById(creep.memory.target_id);
                if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                }
            } else {
                var terminal = tools.getTerminal(creep.room);
                var storage = tools.getStorage(creep.room);
                if(!terminal || !storage) return;
                if(storage.store[RESOURCE_ENERGY] < 50000 && terminal.store[RESOURCE_ENERGY] > 100000) {
                    creep.memory.target_id = storage.id;
                }
                if(storage.store[RESOURCE_ENERGY] > 100000 && terminal.store[RESOURCE_ENERGY] < 100000) {
                    creep.memory.target_id = terminal.id;
                }
            }
        }
    },
};

module.exports = roleBalancer;