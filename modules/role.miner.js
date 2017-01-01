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
    }
};

module.exports = roleMiner;