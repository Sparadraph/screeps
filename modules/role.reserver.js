var tools = require('tools');

var roleReserver = {
    /** @param {Creep} creep **/
    run: function(creep, fpos) {
        if(creep.room.name == fpos.roomName) {
            var controller = creep.room.controller;
            if(creep.reserveController(controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(controller);
            }
        } else {
            tools.move(creep, fpos.x, fpos.y, fpos.roomName);
        }
    }
};

module.exports = roleReserver;