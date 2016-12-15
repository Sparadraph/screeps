var roomManager = {
    getSpawnRoomNames: function() {
        var roomNames = [];
        _.forOwn(Game.spawns, function(spawn) {
            if(roomNames.indexOf(spawn.room.name) == -1) {
                roomNames.push(spawn.room.name);
            }
        })
        return roomNames;
    },

    manageTowers: function(room) {
        var towers = room.find(FIND_MY_STRUCTURES, {
            filter: function(s) {
                return s.structureType == 'tower';
            }
        });
        if(towers.length == 0) return 1;

        var hostile = tower[0].pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if(hostile) {
            towers.forEach(function(tower) {
                tower.attack(hostile);
            })
        }
    },

    manageRooms: function() {
        this.getSpawnRoomNames().forEach(function(roomName) {
            var room = Game.rooms[roomName];
            this.manageTowers(room);
        })
    },

};

module.exports = roomManager;