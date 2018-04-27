var tools = require('tools');

var roleMiner = {
    /** @param {Creep} creep **/
    run: function(creep, f) {
        var source = Game.getObjectById(creep.memory.source_id);
        if(creep.room == source.room) {
            creep.moveTo(creep.memory.x, creep.memory.y);
        } else {
            tools.move(creep, creep.memory.x, creep.memory.y, f.room.name);
        }
        creep.harvest(Game.getObjectById(creep.memory.source_id));

        // Find and transfer to close by link
        if(creep.memory.link_id != -1) {
            var link = Game.getObjectById(creep.memory.link_id);
            if(link) {
                if(creep.carry[RESOURCE_ENERGY] >= 40) {
                    creep.transfer(link, RESOURCE_ENERGY);
                }
            } else {
                var carry_count = _.filter(creep.body, part => part.type == CARRY).length
                var links = new RoomPosition(creep.memory.x, creep.memory.y, f.room.name).findInRange(FIND_MY_STRUCTURES, 1, {
                    filter: s => s.structureType == 'link'
                });
                creep.memory.link_id = carry_count && links.length ? links[0].id : -1;
            }
        }
    }
};

module.exports = roleMiner;