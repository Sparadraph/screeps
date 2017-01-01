var tools = require('tools');

var roleSoldierHealer = {
    /** @param {Creep} creep **/
    run: function(creep, fpos) {
        if(creep.room.name == fpos.roomName) {
            var closestFriend = creep.pos.findClosestByRange(FIND_MY_CREEPS, {
                filter: (cf) => {
                        return cf.hits *1.1< cf.hitsMax;
                    }
                });
            var closestUFriend = creep.pos.findClosestByRange(FIND_MY_CREEPS, {
                filter: (cf) => {
                        return cf.hits*1.5 < cf.hitsMax;
                    }
                });
            if(closestUFriend) {
                creep.heal(closestUFriend);
                creep.moveTo(closestUFriend);
            }
            if(closestFriend) {
                creep.heal(closestFriend);
                creep.moveTo(closestFriend);
            } else {
                tools.move(creep, fpos.x, fpos.y, fpos.roomName);
            }
        } else {
            tools.move(creep, fpos.x, fpos.y, fpos.roomName);
        }
    }
};

module.exports = roleSoldierHealer;