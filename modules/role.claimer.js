var tools = require('tools');

var roleClaimer = {
    /** @param {Creep} creep **/
    run: function(creep, fpos) {
        if(creep.room.name == fpos.roomName) {
            var controller = creep.room.controller;
            if(creep.claimController(controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(controller);
            }
        } else {
            tools.move(creep, fpos.x, fpos.y, fpos.roomName);
        }
    }
};

module.exports = roleClaimer;