var tools = require('tools');

var roleBuilder = {
    /** @param {Creep} creep **/
    run: function(creep, fpos) {
        if(creep.carry[RESOURCE_ENERGY] == 0) {
            creep.memory.building = false;
        }
        if(creep.carry[RESOURCE_ENERGY] == creep.carryCapacity) {
            creep.memory.building = true;
        }

        if(creep.memory.building) {
            if(creep.memory.target_id) {
                var target = Game.getObjectById(creep.memory.target_id);
                if(target) {
                    if(creep.build(target) == ERR_NOT_IN_RANGE || creep.repair(target) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(target);
                    }
                    if(target.hits != undefined && target.hits == target.hitsMax) {
                        creep.memory.target_id = false;
                    } else {
                        if(target.structureType == 'constructedWall' && target.hits > 500) {
                            creep.memory.target_id = false;
                        }
                        if(target.structureType == 'rampart' && target.hits > 700) {
                            creep.memory.target_id = false;
                        }
                    }
                } else {
                    creep.memory.target_id = false;
                }
            } else {
                var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
                if(targets.length > 0) {
                    creep.memory.target_id = targets[0].id;
                } else {
                    targets = creep.room.find(FIND_STRUCTURES, {
                        filter: (s) => {
                            return s.hits*2 < s.hitsMax && s.structureType != 'constructedWall' && s.structureType != 'rampart'
                        }
                    });
                    if(targets.length > 0) {
                        creep.memory.target_id = targets[0].id;
                    } else {
                        targets = creep.room.find(FIND_STRUCTURES, {
                            filter: (s) => {
                                return s.hits < 500 && s.hits < s.hitsMax
                            }
                        });
                        if(targets.length > 0) {
                            creep.memory.target_id = targets[0].id;
                        }
                    }
                }

            }
        } else {
            if(creep.room.name != fpos.roomName) {
                tools.move(creep, fpos.x, fpos.y, fpos.roomName);
            }
            var resources = creep.room.lookForAt(LOOK_RESOURCES, fpos.x, fpos.y);
            if(resources.length > 0) {
                if(creep.pickup(resources[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(resources[0]);
                }
            } else {
                var containers = creep.room.lookForAt(LOOK_STRUCTURES, fpos.x, fpos.y);
                if(containers.length > 0 && containers[0].store != undefined && containers[0].store[RESOURCE_ENERGY] > 500) {
                    if(creep.withdraw(containers[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(containers[0]);
                    }
                }
            }
        }
    }
};

module.exports = roleBuilder;