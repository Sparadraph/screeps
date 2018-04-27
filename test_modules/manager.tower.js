var managerTower = {
    manageTowersByRoom: function(room) {
        var towers = room.find(FIND_MY_STRUCTURES, {
            filter: function(s) {
                return s.structureType == 'tower';
            }
        });
        if(towers.length == 0) return 1;

        var hostile = towers[0].pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if(hostile) {
            towers.forEach(function(tower) {
                tower.attack(hostile);
            })
            return 9
        }
        return 0
    },


    manageTowers: function() {
        var self = this;
        _.forEach(
            _.uniq(_.map(Game.spawns, function(spawn) {
                return spawn.room;
            })), function(room) {
                self.manageTowersByRoom(room);
        });
    },
};


module.exports = managerTower;