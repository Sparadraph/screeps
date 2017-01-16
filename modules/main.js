var roleHarvester = require('role.harvester');
var roleFiller = require('role.filler');

var roleUpgrader = require('role.upgrader');
var roleReserver = require('role.reserver');

var flagMiner = require('flag.miner');
var flagBuilder = require('flag.builder');
var flagUpper = require('flag.upper');
var flagLinker = require('flag.linker');
var flagExplorer = require('flag.explorer');
var flagReserver = require('flag.reserver');
var flagClaimer = require('flag.claimer');
var flagSoldier = require('flag.soldier');
var flagLink = require('flag.link');

var tools = require('tools');
var managerRoom = require('manager.room');
var managerSpawn = require('manager.spawn');
var managerMinerSK = require('manager.miner_sk');

module.exports.loop = function () {
    tools.clean_mem();
    managerSpawn.init();
    managerRoom.manageRooms();


    /*
    9-9 => miner
    8-8 => builder
    7-7 => upper
    6-6 => linker // 6-5 with name <linker>_drop for drop pos
    5-5 => explorer
    4-4 => reserver
    4-5 => claimer
    3-3 => link
    2-2 => manager minerSK // 2-3 with name sk_<manager> for attaking keeperLair
    1-1 => soldier
    */
    for(var flag_name in Game.flags) {
        var flag = Game.flags[flag_name];
        if(flag.color == 1 && flag.secondaryColor == 1) {
            flagSoldier.manage(flag);
        }
        if(flag.color == 9 && flag.secondaryColor == 9) {
            flagMiner.manage(flag);
        }
        if(flag.color == 5 && flag.secondaryColor == 5) {
            flagExplorer.manage(flag);
        }
        if(flag.color == 8 && flag.secondaryColor == 8) {
            flagBuilder.manage(flag);
        }
        if(flag.color == 7 && flag.secondaryColor == 7) {
            flagUpper.manage(flag);
        }
        if(flag.color == 6 && flag.secondaryColor == 6) {
            flagLinker.manage(flag);
        }
        if(flag.color == 4 && flag.secondaryColor == 4) {
            flagReserver.manage(flag);
        }
        if(flag.color == 4 && flag.secondaryColor == 5) {
            flagClaimer.manage(flag);
        }
        if(flag.color == 3 && flag.secondaryColor == 3) {
            flagLink.manage(flag);
        }
        if(flag.color == 2 && flag.secondaryColor == 2) {
            managerMinerSK.manage(flag);
        }
    }


    var t1 = Game.spawns['Spawn1'].room.find(FIND_MY_STRUCTURES, {
            filter: function(s) {
                return s.structureType == 'terminal';
            }
        })[0];
    var t2 = Game.spawns['Spawn2'].room.find(FIND_MY_STRUCTURES, {
            filter: function(s) {
                return s.structureType == 'terminal';
            }
        })[0];
    if(t1.store['energy'] > 20000) {
        t1.send(RESOURCE_ENERGY, 10000, 'E57N76');
    };
    if(t2.store['energy'] > 20000) {
        t2.send(RESOURCE_ENERGY, 10000, 'E57N76');
    };

    managerSpawn.produceCreep(false);
    tools.display_cpu();
}