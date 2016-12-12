var flagLink = {
    manage: function(flag) {
        var room_name = flag.pos.roomName;
        var room = Game.rooms[room_name];
        if(room == undefined) {
            return -1;
        }

        var to_link = flag.room.find(FIND_STRUCTURES, {
            filter: (s) => {
                return s.structureType == 'link' && s.pos.x == flag.pos.x && s.pos.y == flag.pos.y;
            }
        })[0];
        var from_links = flag.room.find(FIND_STRUCTURES, {
            filter: (s) => {
                return s.structureType == 'link' && s.pos.x != flag.pos.x && s.pos.y != flag.pos.y;
            }
        });
        for(var i in from_links) {
            if(to_link.energy < 400 && from_links[i].energy > 400) {
                from_links[i].transferEnergy(to_link);
            }
        }
    }
};

module.exports = flagLink;