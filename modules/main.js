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
//var managerMinerSK = require('manager.miner_sk');





module.exports.loop = function () {
    tools.clean_mem();
    managerSpawn.init();
    if(Game.time%10==0) managerSpawn.updateLockRooms();
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

    var flag_types = {
        1: { 1: flagSoldier, },
        3: { 3: flagLink, },
        4: { 4: flagReserver, 5: flagClaimer},
        5: { 5: flagExplorer, },
        6: { 6: flagLinker, },
        7: { 7: flagUpper, },
        8: { 8: flagBuilder, },
        9: { 9: flagMiner, },
    };

    _.forEach(Game.flags, function(flag) {
        var Flag = flag_types[flag.color] && flag_types[flag.color][flag.secondaryColor];
        if(!Flag) return
        Flag.manage(flag);
    })


/*    var t1 = Game.spawns['Spawn1'].room.find(FIND_MY_STRUCTURES, {
            filter: function(s) {
                return s.structureType == 'terminal';
            }
        })[0];*/
/*    var t2 = Game.spawns['Spawn2'].room.find(FIND_MY_STRUCTURES, {
            filter: function(s) {
                return s.structureType == 'terminal';
            }
        })[0];*/
/*    if(t1.store['energy'] > 20000) {
        t1.send(RESOURCE_ENERGY, 10000, 'E57N76');
    };*/
/*    if(t2.store['energy'] > 20000) {
        t2.send(RESOURCE_ENERGY, 10000, 'E57N76');
    };*/

    managerSpawn.produceCreep();
    tools.store_cpu(true);
    
}