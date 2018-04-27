var tools = require('tools');

var roleUpper = {
    /** @param {Creep} creep **/
    run: function(creep, fpos) {
        if(creep.carry[RESOURCE_ENERGY] == 0) {
            creep.memory.upping = false;
        }
        if(creep.carry[RESOURCE_ENERGY] == creep.carryCapacity) {
            creep.memory.upping = true;
        }

        if(fpos.roomName != creep.room.name) {
            tools.move(creep, fpos.x, fpos.y, fpos.roomName);
            return 1;
        }

        if(creep.memory.upping) {
            if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller);
            }
            if(creep.carry[RESOURCE_ENERGY] < 25) {
                var resources = creep.room.lookForAt(LOOK_RESOURCES, fpos.x, fpos.y);
                if(resources.length > 0) {
                    creep.pickup(resources[0]);
                } else {
                    var containers = creep.room.lookForAt(LOOK_STRUCTURES, fpos.x, fpos.y);
                    if(containers.length > 0) {
                        
                        var container = containers[0];
                        if(container.structureType == 'storage' && container.store[RESOURCE_ENERGY] < 10000) {
                            return;
                        }
                        creep.withdraw(containers[0], RESOURCE_ENERGY);
                    }
                }
            }
        } else {
            var resources = creep.room.lookForAt(LOOK_RESOURCES, fpos.x, fpos.y);
            if(resources.length > 0) {
                if(creep.pickup(resources[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(resources[0]);
                }
            } else {
                var containers = creep.room.lookForAt(LOOK_STRUCTURES, fpos.x, fpos.y);
                if(containers.length > 0) {
                    var container = containers[0];
                    if(container.structureType == 'storage' && container.store[RESOURCE_ENERGY] < 10000) {
                        return;
                    }
                    if(creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(container);
                    }
                }
            }
        }
    }
};

module.exports = roleUpper;