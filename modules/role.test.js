var roleTest = {
    /** @param {Creep} creep **/
    run: function(creep) {
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

        if(creep.memory.get_path == 1) {
            var path = creep.pos.findPathTo(Game.getObjectById(creep.memory.to_id));
            creep.memory.path = Room.serializePath(path);
            creep.memory.get_path = -1;
            console.log("COMPUTING PATH")
        }

        var path = Room.deserializePath(creep.memory.path);
        creep.moveByPath(path);


    }
};

module.exports = roleTest;