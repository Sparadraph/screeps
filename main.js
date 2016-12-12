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

module.exports.loop = function () {
    tools.clean_mem();

    var tower = Game.getObjectById('583d7e064ec4782b74195a75');
    var tower2 = Game.getObjectById('583d6a7e7bba33137857917e');
    var closestHostile = tower2.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
    if(closestHostile) {
        tower.attack(closestHostile);
        tower2.attack(closestHostile);
    }

    var tower3 = Game.getObjectById('583ffd6e91bfac4467250661');
    closestHostile = tower3.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
    if(closestHostile) {
        tower3.attack(closestHostile);
    }

    var tower5 = Game.getObjectById('584785f3aaf0a9985bbb260c');
    closestHostile = tower5.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
    if(closestHostile) {
        tower5.attack(closestHostile);
    }


    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
/*        if(creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        if(creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }*/
        if(creep.memory.role == 'filler' || creep.memory.role == 'filler2' || creep.memory.role == 'filler3') {
            roleFiller.run(creep);
        }
        if(creep.memory.role == 'reserver') {
            roleReserver.run(creep);
        }
    }

    /*
    9-9 => miner
    8-8 => builder
    7-7 => upper
    6-6 => linker // 6-5 with name <linker>_drop for drop pos
    5-5 => explorer
    4-4 => reserver
    4-5 => claimer
    3-3 => link
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
    }

        /*var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');*/
    var fillers = _.filter(Game.creeps, (creep) => creep.memory.role == 'filler');
    var fillers2 = _.filter(Game.creeps, (creep) => creep.memory.role == 'filler2');
    var fillers3 = _.filter(Game.creeps, (creep) => creep.memory.role == 'filler3');
/*  if(harvesters.length < 1) {
        var newName = Game.spawns['Spawn1'].createCreep([WORK,CARRY,MOVE], undefined, {role: 'harvester'});
    }*/
    if(fillers.length < 2) {
        var newName = Game.spawns['Spawn4'].createCreep([CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE], undefined, {role: 'filler', x: 20, y: 18});
    }
    if(fillers2.length < 2) {
        var newName = Game.spawns['Spawn2'].createCreep([CARRY, MOVE, CARRY, MOVE, CARRY, MOVE], undefined, {role: 'filler2', x: 23, y: 22});
    }
    if(fillers3.length < 2) {
        var newName = Game.spawns['Spawn3'].createCreep([CARRY, MOVE, CARRY, MOVE, CARRY, MOVE], undefined, {role: 'filler3', x: 46, y: 19});
    }
/*
    roleTest = require('role.test');
    var tests = _.filter(Game.creeps, (creep) => creep.memory.role == 'test');
    for(var i in tests) {
        roleTest.run(tests[i]);
    }*/
    tools.display_cpu();
}