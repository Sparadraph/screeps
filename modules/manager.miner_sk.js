var roleExplorer = require('role.explorer');
var managerSpawn = require('manager.spawn');

var managerMinerSk = {
    get_sk_tts_on_flag: function(flag) {
        if(flag.room == undefined) {
            return 200;
        } else {
            kls = _.filter(flag.pos.look(), r => r.type == 'structure' && r.structure.structureType == 'keeperLair')
            if(kls.length == 0) {
                return 200;
            } else {
                if(kls[0].ticksToSpawn == undefined) {
                    return 100;
                } else {
                    return kls[0].ticksToSpawn;
                }
            }
        }
    }

    init_sk_flag: function(flag) {
        var fname = 'sk_' + flag.name;
        var flags = _.filter(Game.flags, f => f.name.substring(2) == fname);
        return flags
    },

    init: function(flag) {
        flag.memory.init = 1;
        flag.memory.sk_flags = this.init_sk(flag);
        if(!flag.memory.spawn_name) {
            flag.memory.spawn_name = 'Spawn9';
        }
        if(!flag.memory.index) {
            flag.memory.index = 0;
        }
        if(!flag.memory.replace_time_swiper) {
            flag.memory.replace_time_swiper = 500;
        }
        if(!flag.memory.body_swiper) {
            flag.memory.body_swiper = [
                MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE,
                MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE,
                ATTACK, ATTACK, ATTACK, ATTACK, ATTACK,
                ATTACK, ATTACK, ATTACK, ATTACK, ATTACK,
                ATTACK, ATTACK, ATTACK, ATTACK, ATTACK,
                ATTACK, ATTACK, ATTACK, ATTACK, ATTACK,
                HEAL, HEAL, HEAL, HEAL, HEAL,
            ]
        }
    },

    manage_explo: function(flag) {
        var explo_name = 'explo_' + flag.name;
        var creeps = _.filter(Game.creeps, c => c.name == cname);
        if(creeps.length == 0) {
            var spawn = Game.spawns[flag.memory.spawn_name];
            managerSpawn.addCreep(flag, 8, spawn, [MOVE], cname, {});
        } else {
            roleExplorer.run(creeps[0], flag.pos);
        }
    },

    get_next_sk_flag: function(flag) {
        var fname = 'sk_' + flag.name;
        var flags = _.filter(Game.flags, f => f.name.substring(2) == fname);
        if(flags.length == 0) {
            return undefined;
        }
        return _.sortBy(flags, function(f) {
            return this.get_sk_tts_on_flag(flag);
        })
    },

    manage_swiper: function(flag) {
        var cname = 'swiper_' + flag.name;
        var creeps = _.filter(Game.creeps, c => c.name.substring(2) == cname);
        var rcreeps = _.filter(Game.creeps, c => c.name.substring(2) == cname && creep.ticksToLive < flag.memory.replace_time_swiper);

        if(creeps.length - rcreeps.length < 1) {
            var tname = flag.memory.index%10 + '_' + cname;
            var spawn = Game.spawns[flag.memory.spawn_name];
            managerSpawn.addCreep(flag, 1, spawn, flag.memory.body_swiper, tname, {});
        }

        var sk_flag = this.get_next_sk_flag(flag);
        if(sk_flag != undefined) {
            for(var i in creeps) {
                roleSwiper.run(creeps[i], sk_flag.pos);
            }
        }
    },

    manage: function(flag) {
        if(!flag.memory.init) {
            this.init(flag);
        }

        if(flag.room == undefined) {
            this.manage_explo(flag);
        } else {
            this.manage_swiper(flag);
        }
    }
};

module.exports = managerMinerSk;