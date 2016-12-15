var roleFiller = {
    /** @param {Creep} creep **/
    run: function(creep) {
        if(creep.carry[RESOURCE_ENERGY] == 0) {
            creep.memory.filling = false;
        }
        if(creep.carry[RESOURCE_ENERGY] == creep.carryCapacity) {
            creep.memory.filling = true;
        }

        if(creep.memory.filling) {
            var target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (
                            structure.structureType == STRUCTURE_EXTENSION ||
                            structure.structureType == STRUCTURE_SPAWN ||
                            structure.structureType == STRUCTURE_TOWER
                            ) && structure.energy < structure.energyCapacity;
                    }
            });
            if(target) {
                if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                }
            }
        } else {
            var resources = creep.room.lookForAt(LOOK_RESOURCES, creep.memory.x, creep.memory.y);
            if(resources.length > 0) {
                if(creep.pickup(resources[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(resources[0]);
                }
            } else {
                var containers = creep.room.lookForAt(LOOK_STRUCTURES, creep.memory.x, creep.memory.y);
                if(containers.length > 0) {
                    if(creep.withdraw(containers[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(containers[0]);
                    }
                }
            }
        }
	}
};

module.exports = roleFiller;