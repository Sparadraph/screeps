var roleMiner = {
    /** @param {Creep} creep **/
    run: function(creep) {
        var source = Game.getObjectById(creep.memory.source_id);
        if(creep.room == source.room) {
            creep.moveTo(creep.memory.x, creep.memory.y);
        } else {
            creep.moveTo(source);
        }
        creep.harvest(Game.getObjectById(creep.memory.source_id));
    }
};

module.exports = roleMiner;