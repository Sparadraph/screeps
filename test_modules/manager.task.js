var tools = require('tools');
var managerId = require('manager.id');
var managerQueueSpawn = require('manager.queue.spawn');

var managerTask = {
    init: function(type, group_id) {
        var task_id = managerId.getId('task');
        Memory.data.task[task_id] = {
            type: type,
            group_id: group_id,
            cpt: 1,
            state: 'staging',
        };
        return task_id;
    },

    deprecate: function(task_id) {
        Memory.data.task[task_id] = 'deprecated';

        _.forEach(Game.spawns, function(spawn) {
            managerQueueSpawn.deprecate(spawn, task_id);
        })
    },

    kill: function(task_id) {
        var creeps = this.getCreeps(task_id);
        _.forEach(creeps, function(creep) {
            creep.suicide();
        })

        delete Memory.data.task[task_id];
    },

    initFarmer: function(group_id, source) {
        var task_id = this.init('farmer', group_id);
        var mem = Memory.data.task[task_id];
        var data = tools.getCloserSpawnFromObj(source);

        mem.source_id = source.id;
        mem.dist = data.dist;
        mem.spawn_id = data.spawn.id;
        mem.pos = tools.pos2mem(data.pos);

        return data.pos;
    },

    initUpper: function(group_id, room, nb_creep) {
        var task_id = this.init('upper', group_id);
        var mem = Memory.data.task[task_id];
        var stockPos = tools.getStockPosToControler(room);
        var data = tools.getCloserSpawnFromObj(room.controller);

        mem.spawn_id = data.spawn.id;
        mem.controller_id = room.controller.id;
        mem.force_nb_creep = nb_creep;
        mem.nb_creep = nb_creep == -1 ? 1: nb_creep;
        mem.pos = tools.pos2mem(stockPos);
    },

    initAutoUpper: function(group_id, room) {
        var task_id = this.init('auto_upper', group_id);
        var mem = Memory.data.task[task_id];
        var data = tools.getCloserSpawnFromObj(room.controller);

        mem.spawn_id = data.spawn.id;
        mem.controller_id = room.controller.id;
        mem.source_id = data.spawn.pos.findClosestByPath(room.find(FIND_SOURCES)).id;
        mem.state = 'live';
    },

    initLinker: function(group_id, pickpos, droppos, r_type) {
        r_type = r_type || 'energy';

        var task_id = this.init('linker', group_id);
        var mem = Memory.data.task[task_id];
        var spawn = tools.getCloserSpawn(pickpos).spawn;

        mem.spawn_id = spawn.id;
        mem.r_type = r_type;
        mem.pickpos = tools.pos2mem(pickpos);
        mem.droppos = tools.pos2mem(droppos);
        mem.len = PathFinder.search(pickpos, droppos).path.length;
    },

    initFiller: function(group_id, room) {
        var task_id = this.init('filler', group_id);
        var mem = Memory.data.task[task_id];
        var data = tools.getCloserSpawnFromObj(room.controller);

        mem.spawn_id = data.spawn.id;
        mem.nb_creep = 1;
    },

    initAutoFiller: function(group_id, room) {
        var task_id = this.init('auto_filler', group_id);
        var mem = Memory.data.task[task_id];
        var data = tools.getCloserSpawnFromObj(room.controller);

        mem.spawn_id = data.spawn.id;
        mem.source_id = data.spawn.pos.findClosestByPath(room.find(FIND_SOURCES)).id;
        mem.state = 'live';
    },

    initBuilder: function(group_id, room) {
        var task_id = this.init('builder', group_id);
        var mem = Memory.data.task[task_id];
        var data = tools.getCloserSpawnFromObj(room.controller);
        var pickpos = tools.getStockPosToControler(room);


        mem.spawn_id = data.spawn.id;
        mem.pickpos = tools.pos2mem(pickpos);
        mem.nb_creep = 1;
    },

    initAutoBuilder: function(group_id, room) {
        var task_id = this.init('auto_builder', group_id);
        var mem = Memory.data.task[task_id];
        var data = tools.getCloserSpawnFromObj(room.controller);

        mem.spawn_id = data.spawn.id;
        mem.source_id = data.spawn.pos.findClosestByPath(room.find(FIND_SOURCES)).id;
        mem.state = 'live';
    },

    initReserver: function(group_id, room) {
        var task_id = this.init('reserver', group_id);
        var mem = Memory.data.task[task_id];

        mem.controller_id = room.controller.id;
    }



    getCreeps: function(task_id) {
        return _.filter(
            Game.creeps,
            (creep) => creep.memory.task_id == task_id
        );
    },

    getQueuedCreeps: function(task_id, spawn) {
        return _.filter(
            spawn.memory.queue,
            (elem) => elem.mem.task_id == task_id
        );
    },

    getQueueCountPart: function(queued_creep, type) {
        return _.filter(queued_creep.body, function(b) {
            return b == type;
        }).length;
    },

    getQueueCountParts: function(queued_creeps, type) {
        var self = this;
        var t = type;
        var res = 0;
        _.forEach(queued_creeps, function(creep) {
            res += self.getQueueCountPart(creep, t);
        });
        return res;
    },

    getBody: function(spawn, type) {
        switch(type) {
            case 'farmer':
                if(spawn.room.energyCapacityAvailable >= 550)
                    return [WORK, WORK, WORK, WORK, WORK, MOVE];
                if(spawn.room.energyCapacityAvailable >= 450)
                    return [WORK, WORK, WORK, WORK, MOVE];
                if(spawn.room.energyCapacityAvailable >= 350)
                    return [WORK, WORK, WORK, MOVE];
                return [WORK, WORK, MOVE];
            case 'upper':
                if(spawn.room.energyCapacityAvailable >= 1300)
                    return [WORK, WORK, WORK, WORK, WORK, 
                            WORK, WORK, WORK, WORK, WORK,
                            CARRY, MOVE, MOVE];
                if(spawn.room.energyCapacityAvailable >= 800)
                    return [WORK, WORK, WORK, WORK, WORK, WORK, WORK,
                            CARRY, MOVE];
                if(spawn.room.energyCapacityAvailable >= 600)
                    return [WORK, WORK, WORK, WORK, WORK,
                            CARRY, MOVE];
                if(spawn.room.energyCapacityAvailable >= 500)
                    return [WORK, WORK, WORK, WORK,
                            CARRY, MOVE];
                return [WORK, CARRY, MOVE];
            case 'linker':
                if(spawn.room.energyCapacityAvailable >= 600)
                    return [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY,
                            MOVE,  MOVE,  MOVE,  MOVE,  MOVE,  MOVE];
                if(spawn.room.energyCapacityAvailable >= 500)
                    return [CARRY, CARRY, CARRY, CARRY, CARRY,
                            MOVE,  MOVE,  MOVE,  MOVE,  MOVE];
                if(spawn.room.energyCapacityAvailable >= 400)
                    return [CARRY, CARRY, CARRY, CARRY,
                            MOVE,  MOVE,  MOVE,  MOVE];
                return [CARRY, CARRY, CARRY,
                        MOVE,  MOVE,  MOVE];
            case 'filler':
                if(spawn.room.energyCapacityAvailable >= 1000)
                    return [CARRY, CARRY, CARRY, MOVE, MOVE, MOVE];
                if(spawn.room.energyCapacityAvailable >= 500)
                    return [CARRY, CARRY, MOVE, MOVE];
                return [CARRY, MOVE];
            case 'builder':
                if(spawn.room.energyCapacityAvailable >= 1000)
                    return [WORK, WORK, CARRY, CARRY, MOVE, MOVE,
                            WORK, WORK, CARRY, CARRY, MOVE, MOVE];
                if(spawn.room.energyCapacityAvailable >= 500)
                    return [WORK, WORK, CARRY, CARRY, MOVE, MOVE];
                return [CARRY, MOVE, WORK];
            case 'reserver':
                if(spawn.room.energyCapacityAvailable >= 1300)
                    return [CLAIM, CLAIM, MOVE, MOVE];
                return [CLAIM, MOVE];
        }
    },

    getTravelTime: function(task_id, body) {
        // TODO
        return 100;
    },

    forecastSpawn: function() {
        var self = this;
        _.forEach(Memory.data.task, function(mem, task_id) {
            if(mem.state == 'staging') {
                return;
            }
            switch(mem.type) {
                case 'auto_filler':
                    var spawn = Game.getObjectById(mem.spawn_id);
                    var creeps = self.getCreeps(task_id);
                    var queued_creeps = self.getQueuedCreeps(task_id, spawn);
                    var body = [MOVE, WORK, CARRY, CARRY];


                    if(creeps.length) {
                        if(queued_creeps.length) {
                            // Everything is running and planned. Do nothing !
                        } else {
                            // Runing, but not planned. Must Plan !
                            var t = Game.time + (creeps[0].ticksToLive || 1500) - self.getTravelTime(task_id, body);
                            managerQueueSpawn.add(
                                spawn, 
                                task_id + '-' + mem.cpt++,
                                body,
                                {'task_id': task_id},
                                t
                            )
                        }
                    } else {

                        if(queued_creeps.length) {
                            // Not running, but planned. Must wait !
                        } else {
                            // Nothing running nor planned. Must Plan now !
                            managerQueueSpawn.add(
                                spawn, 
                                task_id + '-' + mem.cpt++,
                                body,
                                {'task_id': task_id},
                                Game.time
                            )
                        }
                    }
                    break;

                case 'auto_upper':
                    var spawn = Game.getObjectById(mem.spawn_id);
                    var creeps = self.getCreeps(task_id);
                    var queued_creeps = self.getQueuedCreeps(task_id, spawn);
                    var body = [MOVE, MOVE, WORK, CARRY];


                    if(creeps.length) {
                        if(queued_creeps.length) {
                            // Everything is running and planned. Do nothing !
                        } else {
                            // Runing, but not planned. Must Plan !
                            var t = Game.time + (creeps[0].ticksToLive || 1500) - self.getTravelTime(task_id, body);
                            managerQueueSpawn.add(
                                spawn, 
                                task_id + '-' + mem.cpt++,
                                body,
                                {'task_id': task_id},
                                t
                            )
                        }
                    } else {

                        if(queued_creeps.length) {
                            // Not running, but planned. Must wait !
                        } else {
                            // Nothing running nor planned. Must Plan now !
                            managerQueueSpawn.add(
                                spawn, 
                                task_id + '-' + mem.cpt++,
                                body,
                                {'task_id': task_id},
                                Game.time
                            )
                        }
                    }
                    break;

                case 'auto_builder':
                    var spawn = Game.getObjectById(mem.spawn_id);
                    var creeps = self.getCreeps(task_id);
                    var queued_creeps = self.getQueuedCreeps(task_id, spawn);
                    var body = [MOVE, WORK, WORK, CARRY];


                    if(creeps.length) {
                        if(queued_creeps.length) {
                            // Everything is running and planned. Do nothing !
                        } else {
                            // Runing, but not planned. Must Plan !
                            var t = Game.time + (creeps[0].ticksToLive || 1500) - self.getTravelTime(task_id, body);
                            managerQueueSpawn.add(
                                spawn, 
                                task_id + '-' + mem.cpt++,
                                body,
                                {'task_id': task_id},
                                t
                            )
                        }
                    } else {

                        if(queued_creeps.length) {
                            // Not running, but planned. Must wait !
                        } else {
                            // Nothing running nor planned. Must Plan now !
                            managerQueueSpawn.add(
                                spawn, 
                                task_id + '-' + mem.cpt++,
                                body,
                                {'task_id': task_id},
                                Game.time
                            )
                        }
                    }
                    break;

                case 'farmer':
                    var spawn = Game.getObjectById(mem.spawn_id);
                    var creeps = self.getCreeps(task_id);
                    var queued_creeps = self.getQueuedCreeps(task_id, spawn);

                    if(creeps.length) {
                        if(queued_creeps.length) {
                            // Everything is running and planned. Do nothing !
                        } else {
                            // Runing, but not planned. Must Plan !
                            var body = self.getBody(spawn, mem.type);
                            var max_t = 1;
                            _.forEach(creeps, function(creep) {
                                var tmp_t = creeps.ticksToLive || 1500
                                if(tmp_t > max_t) {
                                    max_t = tmp_t;
                                }
                            })
                            var t = Game.time + max_t - self.getTravelTime(task_id, body);
                            managerQueueSpawn.add(
                                spawn, 
                                task_id + '-' + mem.cpt++,
                                body,
                                {'task_id': task_id},
                                t
                            )
                        }
                    } else {
                        if(queued_creeps.length) {
                            // Not running, but planned. Must wait !
                        } else {
                            // Nothing running nor planned. Must Plan now !
                            managerQueueSpawn.add(
                                spawn, 
                                task_id + '-' + mem.cpt++,
                                self.getBody(spawn, mem.type),
                                {'task_id': task_id},
                                Game.time
                            )
                        }
                    }
                    break;

                case 'builder':
                    var spawn = Game.getObjectById(mem.spawn_id);
                    var creeps = self.getCreeps(task_id);
                    var queued_creeps = self.getQueuedCreeps(task_id, spawn);

                    if(creeps.length >= mem.nb_creep) {
                        if(queued_creeps.length >= mem.nb_creep) {
                            // Everything is running and planned. Do nothing !
                        } else {
                            // Runing, but not planned. Must Plan !
                            var ttl = _.map(creeps, function(creep) {
                                return creep.ticksToLive || 1500;
                            });
                            var t = Game.time + _.max(ttl)
                            managerQueueSpawn.add(
                                spawn,
                                task_id + '-' + mem.cpt++,
                                self.getBody(spawn, mem.type),
                                {'task_id': task_id},
                                t
                            );
                        }
                    } else {
                        if(queued_creeps.length >= mem.nb_creep) {
                            // Not running, but planned. Must wait !
                        } else {
                            // Nothing running nor planned. Must Plan now !
                            managerQueueSpawn.add(
                                spawn, 
                                task_id + '-' + mem.cpt++,
                                self.getBody(spawn, mem.type),
                                {'task_id': task_id},
                                Game.time
                            );
                        }
                    }
                    break;

                case 'upper':
                    var spawn = Game.getObjectById(mem.spawn_id);
                    var creeps = self.getCreeps(task_id);
                    var queued_creeps = self.getQueuedCreeps(task_id, spawn);

                    if(creeps.length >= mem.nb_creep) {
                        if(queued_creeps.length >= mem.nb_creep) {
                            // Everything is running and planned. Do nothing !
                        } else {
                            // Runing, but not planned. Must Plan !
                            var ttl = _.map(creeps, function(creep) {
                                return creep.ticksToLive || 1500;
                            });
                            var t = Game.time + _.max(ttl)
                            managerQueueSpawn.add(
                                spawn,
                                task_id + '-' + mem.cpt++,
                                self.getBody(spawn, mem.type),
                                {'task_id': task_id},
                                t
                            );
                        }
                    } else {
                        if(queued_creeps.length >= mem.nb_creep) {
                            // Not running, but planned. Must wait !
                        } else {
                            // Nothing running nor planned. Must Plan now !
                            managerQueueSpawn.add(
                                spawn, 
                                task_id + '-' + mem.cpt++,
                                self.getBody(spawn, mem.type),
                                {'task_id': task_id},
                                Game.time
                            );
                        }
                    }
                    break;

                case 'linker':
                    var spawn = Game.getObjectById(mem.spawn_id);
                    var creeps = self.getCreeps(task_id);
                    var queued_creeps = self.getQueuedCreeps(task_id, spawn);

                    var carry_creep = tools.getCountParts(creeps, CARRY);
                    var carry_queued_creep = self.getQueueCountParts(queued_creeps, CARRY);

                    // Needs to carry 15k energy / generation
                    // For x distance, you can make 750 / x trips
                    // So you need to carry 15k / (750/x) = 20x
                    // #carry parts = 2x/5
                    if(5*carry_creep >= 2*mem.len) {
                        if(5*carry_queued_creep >= 2*mem.len) {
                            // Everything is running and planned. DO nothing !
                        } else {
                            // Runing, but not planned. Must Plan !
                            // compute this coef time later if needed
                            var pre_time = 1500;
                            managerQueueSpawn.add(
                                spawn,
                                task_id + '-' + mem.cpt++,
                                self.getBody(spawn, mem.type),
                                {'task_id': task_id},
                                Game.time + pre_time
                            );
                        }
                    } else {
                        if(5*carry_queued_creep >= 2*mem.len) {
                            // Not running, but planned. Must wait !
                        } else {
                            // Not running nor planned. Must Plan now !
                            managerQueueSpawn.add(
                                spawn, 
                                task_id + '-' + mem.cpt++,
                                self.getBody(spawn, mem.type),
                                {'task_id': task_id},
                                Game.time
                            )
                        }
                    }
                    break;

                case 'filler':
                    var spawn = Game.getObjectById(mem.spawn_id);
                    var creeps = self.getCreeps(task_id);
                    var queued_creeps = self.getQueuedCreeps(task_id, spawn);

                    if(creeps.length >= mem.nb_creep) {
                        if(queued_creeps.length >= mem.nb_creep) {
                            // Everything is running and planned. Do nothing !
                        } else {
                            // Runing, but not planned. Must Plan !
                            var ttl = _.map(creeps, function(creep) {
                                return creep.ticksToLive || 1500;
                            });
                            var t = Game.time + _.max(ttl) - 20
                            managerQueueSpawn.add(
                                spawn,
                                task_id + '-' + mem.cpt++,
                                self.getBody(spawn, mem.type),
                                {'task_id': task_id},
                                t
                            );
                        }
                    } else {
                        if(queued_creeps.length >= mem.nb_creep) {
                            // Not running, but planned. Must wait !
                        } else {
                            // Nothing running nor planned. Must Plan now !
                            managerQueueSpawn.add(
                                spawn, 
                                task_id + '-' + mem.cpt++,
                                self.getBody(spawn, mem.type),
                                {'task_id': task_id},
                                Game.time
                            );
                        }
                    }
                    break;

                case 'reserver':
                    var controller = Game.getObjectById(mem.controller_id);
                    if(!controller)
                        return;
                    
                    var spawn = Game.getObjectById(mem.spawn_id);
                    var creeps = self.getCreeps(task_id);
                    var queued_creeps = self.getQueuedCreeps(task_id, spawn);

                    if(!controller.reservation || controller.reservation.ticksToEnd < 4000 ) {
                        if(creeps.length >= 2) {
                            if(queued_creeps.length >= 2) {

                            } else {
                                managerQueueSpawn.add(
                                    spawn,
                                    task_id + '-' + mem.cpt++,
                                    self.getBody(spawn, mem.type),
                                    {'task_id': task_id},
                                    Game.time + 1500,
                                );
                            }
                        } else {
                            if(queued_creeps.length >= 2) {

                            } else {
                                managerQueueSpawn.add(
                                    spawn,
                                    task_id + '-' + mem.cpt++,
                                    self.getBody(spawn, mem.type),
                                    {'task_id': task_id},
                                    Game.time,
                                );
                            }
                        }
                    }


            }
        });
    },

};

module.exports = managerTask;