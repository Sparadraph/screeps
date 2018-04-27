var tools = require('tools');

var managerCreep = {
	run: function(creep) {
		var self = this;
		var task = Memory.data.task[creep.memory.task_id];

		if(!task)
			return;

		switch(task.type) {
			case 'farmer':
				self.runFarmer(creep, task);
				break;
			case 'upper':
				self.runUpper(creep, task);
				break;
			case 'auto_upper':
				self.runAutoUpper(creep, task);
				break;
			case 'linker':
				self.runLinker(creep, task);
				break;
			case 'filler':
				self.runFiller(creep, task);
				break;
			case 'auto_filler':
				self.runAutoFiller(creep, task);
				break;
			case 'builder':
				self.runBuilder(creep, task);
				break;
			case 'auto_builder':
				self.runAutoBuilder(creep, task);
				break;
			case 'reserver':
				self.runReserver(creep, task);
		}
	},

	runFarmer: function(creep, task) {
		var source = Game.getObjectById(task.source_id);
		var pos = tools.mem2pos(task.pos);

		tools.move(creep, pos);
		creep.harvest(source);
	},

	runUpper: function(creep, task) {
		var controller = Game.getObjectById(task.controller_id);
		var pickpos = tools.mem2pos(task.pos);

		if(creep.carry[RESOURCE_ENERGY] == 0) {
			creep.memory.upping = false;
		}
		if(creep.carry[RESOURCE_ENERGY] == creep.carryCapacity) {
			creep.memory.upping = true;
		}

		if(creep.memory.upping) {
			if(creep.upgradeController(controller) == ERR_NOT_IN_RANGE) {
				tools.move(creep, controller.pos);
			}
			if(creep.carry[RESOURCE_ENERGY] < 21) {
				var resources = creep.room.lookForAt(LOOK_RESOURCES, pickpos);
				if(resources.length > 0) {
					creep.pickup(resources[0]);
				} else {
					var containers = creep.room.lookForAt(LOOK_STRUCTURES, pickpos);
					if(containers.length > 0 && containers[0].store[RESOURCE_ENERGY] > 1500) {
						creep.withdraw(containers[0], RESOURCE_ENERGY);
					}
				}
			}
		} else {
			var resources = creep.room.lookForAt(LOOK_RESOURCES, pickpos);
			if(resources.length > 0) {
				if(creep.pickup(resources[0]) == ERR_NOT_IN_RANGE) {
					tools.move(creep, resources[0].pos);
				}
			} else {
				var containers = creep.room.lookForAt(LOOK_STRUCTURES, pickpos);
				if(containers.length > 0 && containers[0].store[RESOURCE_ENERGY] > 1500) {
					if(creep.withdraw(containers[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
						tools.move(creep, containers[0].pos);
					}
				}
			}
		}
	},

	runAutoUpper: function(creep, task) {
		var controller = Game.getObjectById(task.controller_id);

		if(creep.carry[RESOURCE_ENERGY] == 0) {
			creep.memory.upping = false;
		}
		if(creep.carry[RESOURCE_ENERGY] == creep.carryCapacity) {
			creep.memory.upping = true;
		}

		if(creep.memory.upping) {
			if(creep.upgradeController(controller) == ERR_NOT_IN_RANGE) {
				tools.move(creep, controller.pos);
			}
		} else {
			var source = Game.getObjectById(task.source_id);

			tools.move(creep, source);
			creep.harvest(source);
		}
	},

	linkerPick: function(creep, task) {
		var pickpos = tools.mem2pos(task.pickpos);
		tools.move(creep, pickpos, true);
		
		var energys = pickpos.lookFor(LOOK_ENERGY);
		if(energys.length)
			creep.pickup(energys[0]);

		var strs = pickpos.lookFor(LOOK_STRUCTURES);
		if(strs.length)
			creep.withdraw(strs[0], task.r_type);
	},

	linkerDrop: function(creep, task) {
		var droppos = tools.mem2pos(task.droppos);
		tools.move(creep, droppos);
		
		var strs = droppos.lookFor(LOOK_STRUCTURES);
		if(strs.length) {
			return creep.transfer(strs[0], task.r_type);
		}

		if(tools.posEq(creep.pos, droppos)) {
			creep.drop(task.r_type);
		}
	},

	runLinker: function(creep, task) {
		var droppos = tools.mem2pos(task.droppos);
		if(_.sum(creep.carry) == 0) {
			creep.memory.picking = true;
		}

		if(_.sum(creep.carry) == creep.carryCapacity) {
			creep.memory.picking = false;
		}

		if(creep.memory.picking) {
			this.linkerPick(creep, task);
		} else {
			if(this.linkerDrop(creep, task) == 0) {
				this.linkerPick(creep, task);
			} else if(tools.posEq(creep.pos, droppos)) {
				creep.drop(task.r_type);
			}
		}
	},


	fillerPick: function(creep, task) {
		var spawn = Game.getObjectById(task.spawn_id);
		var pickpos = tools.getStockPosToControler(spawn.room);
		tools.move(creep, pickpos, true);
		
		var energys = pickpos.lookFor(LOOK_ENERGY);
		if(energys.length)
			return creep.pickup(energys[0]);

		var strs = pickpos.lookFor(LOOK_STRUCTURES);
		if(strs.length) {
			return creep.withdraw(strs[0], RESOURCE_ENERGY);
		}
	},

	runFiller: function(creep, task) {
		if(_.sum(creep.carry) == 0) {
			creep.memory.picking = true;
		}
		if(_.sum(creep.carry) == creep.carryCapacity) {
			creep.memory.picking = false;
		}

		if(creep.memory.picking) {
			if(this.fillerPick(creep, task) != 0){
				return;
			}
		}
		var target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
			filter: (structure) => {
				return (
					structure.structureType == STRUCTURE_EXTENSION ||
					structure.structureType == STRUCTURE_SPAWN ||
					(
						structure.structureType == STRUCTURE_TOWER &&
						structure.energy * 1.5 < structure.energyCapacity
					)
				) && 
				structure.energy < structure.energyCapacity;
			}
		});
		if(target) {
			if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
				tools.move(creep, target);
			}
		}

	},

	runAutoFiller: function(creep, task) {
		if(_.sum(creep.carry) == 0) {
			creep.memory.farming = true;
		}
		if(_.sum(creep.carry) == creep.carryCapacity) {
			creep.memory.farming = false;
		}

		if(creep.memory.farming) {
			var source = Game.getObjectById(task.source_id);

			tools.move(creep, source);
			creep.harvest(source);
		} else {
			var target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
				filter: (structure) => {
					return (
						structure.structureType == STRUCTURE_EXTENSION ||
						structure.structureType == STRUCTURE_SPAWN ||
						(
							structure.structureType == STRUCTURE_TOWER &&
							structure.energy * 1.5 < structure.energyCapacity
						)
					) && 
					structure.energy < structure.energyCapacity;
				}
			});
			if(target) {
				if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
					tools.move(creep, target);
				}
			}
		}

	},

	builderPick: function(creep, task) {
		var pickpos = tools.mem2pos(task.pickpos);
		tools.move(creep, pickpos, true);
		
		var energys = pickpos.lookFor(LOOK_ENERGY);
		if(energys.length)
			return creep.pickup(energys[0]);

		var strs = pickpos.lookFor(LOOK_STRUCTURES);
		if(strs.length) {
			return creep.withdraw(strs[0], RESOURCE_ENERGY);
		}
	},


	runBuilder: function(creep, task) {
        if(creep.carry[RESOURCE_ENERGY] == 0) {
            creep.memory.building = false;
        }
        if(creep.carry[RESOURCE_ENERGY] == creep.carryCapacity) {
            creep.memory.building = true;
        }

        if(creep.memory.building) {
            if(creep.memory.target_id) {
                var target = Game.getObjectById(creep.memory.target_id);
                if(target) {
                    if(creep.build(target) == ERR_NOT_IN_RANGE || creep.repair(target) == ERR_NOT_IN_RANGE) {
                        tools.move(creep, target);
                    }
                    if(target.hits != undefined && target.hits == target.hitsMax) {
                        creep.memory.target_id = false;
                    } else {
                        if(target.structureType == 'constructedWall' && target.hits > 500) {
                            creep.memory.target_id = false;
                        }
                        if(target.structureType == 'rampart' && target.hits > 700) {
                            creep.memory.target_id = false;
                        }
                    }
                } else {
                    creep.memory.target_id = false;
                }
            } else {
                var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
                if(targets.length > 0) {
                    creep.memory.target_id = targets[0].id;
                } else {
                    targets = creep.room.find(FIND_STRUCTURES, {
                        filter: (s) => {
                            return s.hits*1000 < s.hitsMax && s.structureType != 'constructedWall' && s.structureType != 'rampart'
                        }
                    });
                    if(targets.length > 0) {
                        creep.memory.target_id = targets[0].id;
                    } else {
                        targets = creep.room.find(FIND_STRUCTURES, {
                            filter: (s) => {
                                return s.hits < 200000 && s.hits < s.hitsMax
                            }
                        });
                        if(targets.length > 0) {
                            creep.memory.target_id = targets[0].id;
                        }
                    }
                }
            }
        } else {
			this.builderPick(creep, task);
        }
	},

	runAutoBuilder: function(creep, task) {
        if(creep.carry[RESOURCE_ENERGY] == 0) {
            creep.memory.building = false;
        }
        if(creep.carry[RESOURCE_ENERGY] == creep.carryCapacity) {
            creep.memory.building = true;
        }

        if(creep.memory.building) {
            if(creep.memory.target_id) {
                var target = Game.getObjectById(creep.memory.target_id);
                if(target) {
                    if(creep.build(target) == ERR_NOT_IN_RANGE || creep.repair(target) == ERR_NOT_IN_RANGE) {
                        tools.move(creep, target);
                    }
                    if(target.hits != undefined && target.hits == target.hitsMax) {
                        creep.memory.target_id = false;
                    } else {
                        if(target.structureType == 'constructedWall' && target.hits > 500) {
                            creep.memory.target_id = false;
                        }
                        if(target.structureType == 'rampart' && target.hits > 700) {
                            creep.memory.target_id = false;
                        }
                    }
                } else {
                    creep.memory.target_id = false;
                }
            } else {
                var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
                if(targets.length > 0) {
                    creep.memory.target_id = targets[0].id;
                } else {
                    targets = creep.room.find(FIND_STRUCTURES, {
                        filter: (s) => {
                            return s.hits*1000 < s.hitsMax && s.structureType != 'constructedWall' && s.structureType != 'rampart'
                        }
                    });
                    if(targets.length > 0) {
                        creep.memory.target_id = targets[0].id;
                    } else {
                        targets = creep.room.find(FIND_STRUCTURES, {
                            filter: (s) => {
                                return s.hits < 500 && s.hits < s.hitsMax
                            }
                        });
                        if(targets.length > 0) {
                            creep.memory.target_id = targets[0].id;
                        }
                    }
                }
            }
        } else {
			var source = Game.getObjectById(task.source_id);

			tools.move(creep, source);
			creep.harvest(source);
        }
	},

    runReserver: function(creep, task) {
    	var controller = Game.getObjectById(task.controller_id);
    	if(!controller) return;
    	tools.move(creep, controller.pos);
    	creep.reserveController(controller);
    },

	runSoldierContact: function(creep, fpos) {
        if(creep.room.name == fpos.roomName) {
            var strHostile = creep.room.lookForAt(LOOK_STRUCTURES, fpos.x, fpos.y);
            var closestHostile = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
            if(strHostile.length > 0) {
                if(creep.attack(strHostile[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(strHostile[0]);
                    if(closestHostile) {
                        creep.attack(closestHostile);
                    }
                }
            } else if(closestHostile) {
                if(creep.attack(closestHostile) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(closestHostile);
                }
            } else {
                closestHostile = creep.pos.findClosestByRange(FIND_HOSTILE_STRUCTURES, {
                    filter: (s) => {
                        return s.structureType != 'road' && s.structureType != 'controller';
                    }
                });
                if(closestHostile) {
                    if(creep.attack(closestHostile) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(closestHostile);
                    }
                } else {
                	tools.move(creep, fpos);
                }
            }
        } else {
            tools.move(creep, fpos);
        }
    },
};

module.exports = managerCreep;