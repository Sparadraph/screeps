var tools = require('tools');

var roleFiller = {
    /** @param {Creep} creep **/
    /** @param {Pos} fpos flag.pos **/
    /** @param {Pos} fdpos flag_drop.pos **/
    run: function(creep, fpos, fdpos, frtype, max_fill) {
        if(_.sum(creep.carry) == 0) {
            if(creep.ticksToLive > 20) {
                creep.memory.picking = true;
            } else {
                creep.suicide()
            }
        }
        if(_.sum(creep.carry) >= creep.carryCapacity - 5) {
            creep.memory.picking = false;
            var storages = creep.room.find(FIND_STRUCTURES, {
                filter: (s) => {
                    return s.structureType == STRUCTURE_STORAGE
                }
            });
            var targets = Game.rooms[fdpos.roomName].lookForAt(LOOK_STRUCTURES, fdpos.x, fdpos.y);
            if(storages.length > 0 && storages[0].store[RESOURCE_ENERGY] < -10000) {
                creep.memory.target_id = storages[0].id;
            } else if(targets.length > 0 && targets[0].store == undefined) {
                creep.memory.target_id = targets[0].id;
            } else if (targets.length > 0) {/* && targets[0].store[RESOURCE_ENERGY]*1.1 < targets[0].storeCapacity) {*/
                creep.memory.target_id = targets[0].id;
            } else if(storages.length > 0) {
                creep.memory.target_id = storages[0].id;
            } else {
                creep.memory.target_id = false;
            }
        }

        if(!creep.memory.builder) {
            creep.memory.builder = -1;
            _.forEach(creep.body, function(part) {
                if(part.type == 'work') {
                    creep.memory.builder = 1;
                }
            })
        }

        if(creep.memory.builder == 1) {
            var target = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);
            if(creep.build(target) != 0) {
                target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: function(s) {
                        return s.hits < s.hitsMax;
                    }
                });
                if(target) {
                    creep.repair(target);
                }
            }
        }

        if(creep.memory.picking) {
            if(creep.room.name != fpos.roomName) {
                tools.move(creep, fpos.x, fpos.y, fpos.roomName);
            } else {
                var resources = creep.room.lookForAt(LOOK_RESOURCES, fpos.x, fpos.y);
                if(resources.length > 0) {
                    if(creep.pickup(resources[0]) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(resources[0]);
                    }
                } else {
                    var containers = creep.room.lookForAt(LOOK_STRUCTURES, fpos.x, fpos.y);
                    if(containers.length > 0) {
                        if(creep.withdraw(containers[0], frtype) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(containers[0]);
                        }
                    }
                }
            }
        } else {
            if(creep.memory.target_id) {
                var target = Game.getObjectById(creep.memory.target_id);
                if(target.store == undefined || target.store[frtype] == undefined || target.store[frtype] < target.storeCapacity * max_fill) {
                    if(creep.transfer(target, frtype) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(target);
                    }
                }
            }
        }
	}
};

module.exports = roleFiller;