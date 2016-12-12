var tools = require('tools');

var roleSoldierRanger = {
    /** @param {Creep} creep **/
    run: function(creep, fpos) {
        if(creep.room.name == fpos.roomName) {
            var closestHostile = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
            if(closestHostile) {
                if(creep.rangedAttack(closestHostile) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(closestHostile);
                }
            } else {
                closestHostile = creep.pos.findClosestByRange(FIND_HOSTILE_STRUCTURES);
                if(closestHostile) {
                    if(creep.rangedAttack(closestHostile) == ERR_NOT_IN_RANGE) {
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

module.exports = roleSoldierRanger;