var managerMarket = {
    init: function() {
        Memory.market = {
            time: Game.time,
            offers: {},
        }
    },

    initRoom: function(room) {
        room.memory.market = {
            energy: {
                min: 10000,
                max: 80000,
                val: 0.03,
            },
        };
    },

    manage: function(room) {
        if(!Memory.market || Memory.market.time != Game.time) {
            this.init();
        }

        if(!room.memory.market) {
            this.initRoom(room);
        }

        var terminals = room.find(FIND_MY_STRUCTURES, {
            filter: function(s) {
                return s.structureType == 'terminal';
            }
        })
        for(var r in room.memory.market) {
            var data = room.memory.market[r];
            if(terminals.length > 0 && terminals[0].store[r] > data.max){
                if(!Memory.market.offers[r]) {
                    Memory.market.offers[r] = Game.market.getAllOrders({
                        'type': ORDER_BUY,
                        'resourceType': r,
                    });
                }

                Memory.market.offers[r].forEach(function(offer) {
                    var amount = Math.min(offer.remainingAmount, terminals[0].store[r] - data.max, 20000);
                    var energy_cost = Game.market.calcTransactionCost(amount, offer.roomName, room.name);
                    var energy_pu = 0.03;
                    var lose = amount * data.val + energy_pu * energy_cost;
                    var win = offer.price * amount;
                    if(lose < win) {
                        console.log("Traiding (" + r + ") - " + amount + " (" + offer.price + ")");
                        console.log("Win: " + win + " - Lose: " + lose);
                        Game.market.deal(offer.id, amount, room.name);
                    }
                })
            }
        }
    },


};

module.exports = managerMarket;