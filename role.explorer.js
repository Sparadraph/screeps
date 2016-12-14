var tools = require('tools');

var roleExplorer = {
    /** @param {Creep} creep **/
    run: function(creep, fpos) {
        tools.move(creep, fpos.x, fpos.y, fpos.roomName);
	}
};

module.exports = roleExplorer;