var roleSoldierContact = require('role.soldier.contact');
var roleSoldierHealer = require('role.soldier.healer');
var roleSoldierRanger = require('role.soldier.ranger');

var flagSoldier = {
    manage: function(flag) {
        if(!flag.memory.index) {
            flag.memory.index = 0;
        }
        if(!flag.memory.max_contact) {
            flag.memory.max_contact = -1;
        }
        if(!flag.memory.max_healer) {
            flag.memory.max_healer = -1;
        }
        if(!flag.memory.max_ranger) {
            flag.memory.max_ranger = -1;
        }
        if(!flag.memory.body_contact) {
            flag.memory.body_contact = [
                ATTACK, MOVE, ATTACK, MOVE, ATTACK, MOVE, ATTACK, MOVE, ATTACK, MOVE,
                ATTACK, MOVE, ATTACK, MOVE, ATTACK, MOVE, ATTACK, MOVE, ATTACK, MOVE,
                ATTACK, MOVE, ATTACK, MOVE, ATTACK, MOVE, ATTACK, MOVE, ATTACK, MOVE,
                ATTACK, MOVE, ATTACK, MOVE, ATTACK, MOVE, ATTACK, MOVE, ATTACK, MOVE,
                ATTACK, MOVE, ATTACK, MOVE, ATTACK, MOVE, ATTACK, MOVE, ATTACK, MOVE
            ];
        }
        if(!flag.memory.body_healer) {
            flag.memory.body_healer = [
                MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE,
                MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE,
                MOVE, MOVE, MOVE, MOVE, MOVE,
                HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL,
                HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL,
                HEAL, HEAL, HEAL, HEAL, HEAL,
            ];
        }
        if(!flag.memory.body_ranger) {
            flag.memory.body_ranger = [MOVE, MOVE, MOVE, MOVE, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK];
        }
        if(!flag.memory.spawn_name) {
            flag.memory.spawn_name = 'Spawn1';
        }

        var cname_contact = 'soldier_contact_' + flag.name;
        var cname_healer = 'soldier_healer_' + flag.name;
        var cname_ranger = 'soldier_ranger_' + flag.name;
        var contacts = _.filter(Game.creeps, (creep) => creep.name.substring(2) == cname_contact);
        var healers = _.filter(Game.creeps, (creep) => creep.name.substring(2) == cname_healer);
        var rangers = _.filter(Game.creeps, (creep) => creep.name.substring(2) == cname_ranger);

        if(healers.length < flag.memory.max_healer) {
            tname = flag.memory.index%10 + '_' + cname_healer;
            if(Game.spawns[flag.memory.spawn_name].createCreep(flag.memory.body_healer, tname) == tname) {
                flag.memory.index += 1;
            }
        }
        if(rangers.length < flag.memory.max_ranger) {
            tname = flag.memory.index%10 + '_' + cname_ranger;
            if(Game.spawns[flag.memory.spawn_name].createCreep(flag.memory.body_ranger, tname) == tname) {
                flag.memory.index += 1;
            }
        }
        if(contacts.length < flag.memory.max_contact) {
            tname = flag.memory.index%10 + '_' + cname_contact;
            if(Game.spawns[flag.memory.spawn_name].createCreep(flag.memory.body_contact, tname) == tname) {
                flag.memory.index += 1;
            }
        }

        for(var i in contacts) {
            roleSoldierContact.run(contacts[i], flag.pos);
        }
        for(var i in rangers) {
            roleSoldierRanger.run(rangers[i], flag.pos);
        }
        for(var i in healers) {
            roleSoldierHealer.run(healers[i], flag.pos);
        }
    }
};

module.exports = flagSoldier;