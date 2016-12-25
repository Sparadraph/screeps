var tools = require('tools');

var spawnManager = {
    init: function() {
        Memory.spawnManager = {};
        Memory.spawnManager.accept = {};
        Memory.spawnManager.refuse = [];
    },

    addCreep: function(sequence, spawn, body, name, mem) {
        if(!Memory.spawnManager.accept.spawn) {
            Memory.spawnManager.accept.spawn = {sequence: sequence, body: body, name: name, mem: mem};
        } else if(Memory.spawnManager.accept.spawn.sequence > sequence) {
            Memory.spawnManager.refuse.push(Memory.spawnManager.accept.spawn);
            Memory.spawnManager.accept.spawn = {sequence: sequence, body: body, name: name, mem: mem};
        } else {
            Memory.spawnManager.refuse.push({: , sequence: sequence, body: body, name: name, mem: mem});
        }
    }

    produceCreep: function(verbose) {
        _.forOwn(Memory.spawnManager.accept, function(spawn) {
            var data = Memory.spawnManager.accept.spawn;
            spawn.createCreep(data.body, data.name, data.mem);
        })
        if(verbose) {
            _.forOwn(Memory.spawnManager.accept, function(spawn) {
                var data = Memory.spawnManager.accept
                console.log("(" + data.sequence + ") Spawning " + data.name + " from " + spawn.name);
            })
            Memory.spawnManager.refuse.forEach(function(data) {
                console.log("(" + data.sequence + ") Refused " + data.name + " from " + spawn.name);
            })
        }
    }
};

module.exports = spawnManager;