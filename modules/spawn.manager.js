var tools = require('tools');

var spawnManager = {
    init: function() {
        Memory.spawnManager = {};
        Memory.spawnManager.accept = {};
        Memory.spawnManager.refuse = [];
    },

    addCreep: function(flag, sequence, spawn, body, name, mem) {
        var data = {flag: flag, sequence: sequence, body: body, name: name, mem: mem}
        if(!Memory.spawnManager.accept.spawn) {
            Memory.spawnManager.accept.spawn = data;
        } else if(Memory.spawnManager.accept.spawn.sequence > sequence) {
            Memory.spawnManager.refuse.push(Memory.spawnManager.accept.spawn);
            Memory.spawnManager.accept.spawn = data;
        } else {
            Memory.spawnManager.refuse.push(data);
        }
    },

    produceCreep: function(verbose) {
        _.forOwn(Memory.spawnManager.accept, function(spawn) {
            var data = Memory.spawnManager.accept.spawn;
            if(spawn.createCreep(data.body, data.name, data.mem) == data.name) {
                data.flag.memory.index += 1;
                if(data.flag.memory.to_replace) {
                    data.flag.memory.to_replace = Math.max(0, data.flag.memory.to_replace - 1);
                }
            };
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
    },
};

module.exports = spawnManager;