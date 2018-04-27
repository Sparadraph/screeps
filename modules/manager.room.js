var roleFiller = require('role.filler');
var roleBalancer = require('role.balancer');
var tools = require('tools');
var managerMarket = require('manager.market');
var managerMiner = require('manager.miner');


var managerRoom = {
    getSpawnRoomNames: function() {
        var roomNames = [];
        _.forOwn(Game.spawns, function(spawn) {
            if(roomNames.indexOf(spawn.room.name) == -1) {
                roomNames.push(spawn.room.name);
            }
        })
        return roomNames;
    },

    manageTowers: function(room) {
        var towers = room.find(FIND_MY_STRUCTURES, {
            filter: function(s) {
                return s.structureType == 'tower';
            }
        });
        if(towers.length == 0) return 1;

        var hostile = towers[0].pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if(hostile) {
            towers.forEach(function(tower) {
                tower.attack(hostile);
            })
            return 9
        }
        return 0
    },

    manageRepairs: function(room) {
        room.find(FIND_STRUCTURES, {
            filter: function(s) {
                return  s.structureType != 'constructedWall' && (
                        (s.structureType == 'rampart' && s.hits < 10000) ||
                        (s.structureType != 'rampart' && s.hits*5 < s.hitsMax)
                    );
            },
        }).forEach(function(s) {
            var tower = s.pos.findClosestByRange(FIND_MY_STRUCTURES, {
                filter: function(s) {
                    return s.structureType == 'tower' && s.energy > 0;
                }
            })
            if(tower) {
                tower.repair(s);
            }
        })
    },

    manageFillers: function(room) {
        if(!room.memory.max_filler) room.memory.max_filler = 2;
        if(!room.memory.body_filler) room.memory.body_filler = [CARRY, MOVE];
        if(!room.memory.x_filler || !room.memory.y_filler) {
            var pull_structure = tools.getPullStructure(room);
            console.log(pull_structure);
            if(pull_structure) {
                room.memory.x_filler = pull_structure.pos.x;
                room.memory.y_filler = pull_structure.pos.y;
            } else {
                return -1
            }
        }

        var fillers = room.find(FIND_MY_CREEPS, {
            filter: function(creep) {
                return creep.memory.role == 'filler';
            }
        })

        fillers.forEach(function(creep) {
            roleFiller.run(creep);
        })

        if(fillers.length < room.memory.max_filler) {
            var spawns = room.find(FIND_MY_STRUCTURES, {
                filter: function(s) {
                    return s.structureType == 'spawn';
                }
            })
            if(spawns.length > 0) {
                var body = room.memory.body_filler;
                if(room.energyAvailable < 50 * body.length && fillers.length == 0) {
                    body = [CARRY, MOVE];
                }
                spawns[0].createCreep(body, undefined, {role: 'filler', x: room.memory.x_filler, y: room.memory.y_filler});
            }
        }
    },

    manageBalancers: function(room) {
        if(!room.memory.max_balancer) room.memory.max_balancer = -1;
        if(!room.memory.body_balancer) room.memory.body_balancer = [CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE];
        if(!room.memory.jobs) room.memory.jobs = [];

        var balancers = room.find(FIND_MY_CREEPS, {
            filter: function(creep) {
                return creep.memory.role == 'balancer';
            }
        });
        balancers.forEach(function(creep) {
            roleBalancer.run(creep);
        })

        if(balancers.length < room.memory.max_balancer) {
            var spawns = room.find(FIND_MY_STRUCTURES, {
                filter: function(s) {
                    return s.structureType == 'spawn';
                }
            })
            if(spawns.length >0) {
                spawns[0].createCreep(room.memory.body_balancer, 'balancer' + room + Game.time, {role: 'balancer'});
            }
        }

    },

    manageRooms: function() {
        this.getSpawnRoomNames().forEach(roomName => {
            var room = Game.rooms[roomName];
            if(this.manageTowers(room) == 0) {
                this.manageRepairs(room);
            }
            this.manageFillers(room);
            this.manageBalancers(room);

            if(Game.time%10 == 0) {
            //    managerMarket.manage(room);
                managerMiner.manage(room);
            }
        })
    },

};

module.exports = managerRoom;