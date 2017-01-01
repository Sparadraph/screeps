var tools = require('tools');

var roleSoldierContact = {
    /** @param {Creep} creep **/
    run: function(creep, fpos) {
        if(creep.room.name == fpos.roomName) {
            var strHostile = creep.room.lookForAt(LOOK_STRUCTURES, fpos.x, fpos.y);
            var closestHostile = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
            if(strHostile.length > 0) {
                if(creep.attack(strHostile[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(strHostile[0]);
                    if(closestHostile) {
                        creep.attack(closestHostile);
                    }
                }
            } else if(closestHostile) {
                if(creep.attack(closestHostile) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(closestHostile);
                }
            } else {
                closestHostile = creep.pos.findClosestByRange(FIND_HOSTILE_STRUCTURES, {
                    filter: (s) => {
                        return s.structureType != 'road' && s.structureType != 'controller';
                    }
                });
                if(closestHostile) {
                    if(creep.attack(closestHostile) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(closestHostile);
                    }
                } else {
                    tools.move(creep, fpos.x, fpos.y, fpos.roomName);
                }
            }
        } else {
            tools.move(creep, fpos.x, fpos.y, fpos.roomName);
        }
    }
};

module.exports = roleSoldierContact;