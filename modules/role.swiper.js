var tools = require('tools');

var roleSwiper = {
    /** @param {Creep} creep **/
    run: function(creep, fpos) {
        if(creep.room.name == fpos.roomName) {
            var targets = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 5);
            if(targets.length > 0) {
                creep.moveTo(targets[0]);
                creep.attack(targets[0]);
            } else {
                tools.move(creep, fpos.x, fpos.y, fpos.roomName);
                if(creep.hits < creep.hitsMax) {
                    creep.heal(creep);
                }
            }
        } else {
            tools.move(creep, fpos.x, fpos.y, fpos.roomName);
        }
    }
};

module.exports = roleSwiper;