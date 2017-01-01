var managerMarket = {
    init: function() {
        Memory.market = {
            time: Game.time,
            b_offers: {},
            s_offers: {},
        }
    },

    initRoom: function(room) {
        room.memory.market = {
            energy: {
                min: 0,
                max: 100000,
                val: 0.02,
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

        var energy_pu = 0.03;
        for(var r in room.memory.market) {
            var data = room.memory.market[r];
            var cur_amount = 0;
            if(terminals.length > 0 && terminals[0].store[r] != undefined) {
                cur_amount = terminals[0].store[r];
            }

            if(terminals.length > 0 && cur_amount > data.max){
                if(!Memory.market.b_offers[r]) {
                    Memory.market.b_offers[r] = Game.market.getAllOrders({
                        'type': ORDER_BUY,
                        'resourceType': r,
                    });
                }

                Memory.market.b_offers[r].forEach(function(offer) {
                    var amount = Math.min(offer.remainingAmount, cur_amount - data.max, 2000);
                    var energy_cost = Game.market.calcTransactionCost(amount, offer.roomName, room.name);
                    var lose = amount * data.val + energy_pu * energy_cost;
                    var win = offer.price * amount;
                    if(lose < win) {
                        console.log("Traiding (" + r + ") - " + amount + " (" + offer.price + ")");
                        console.log("Win: " + win + " - Lose: " + lose);
                        Game.market.deal(offer.id, amount, room.name);
                    }
                })
            }


            if(terminals.length > 0 && cur_amount < data.min) {
                if(!Memory.market.s_offers[r]) {
                    Memory.market.s_offers[r] = Game.market.getAllOrders({
                        'type': ORDER_SELL,
                        'resourceType': r,
                    });
                }

                Memory.market.s_offers[r].forEach(function(offer) {
                    var amount = Math.min(offer.remainingAmount, data.min - cur_amount, 1000);
                    var energy_cost = Game.market.calcTransactionCost(amount, offer.roomName, room.name);
                    var lose = offer.price * amount + energy_pu * energy_cost;
                    var win = amount * data.val;
                    if(lose < win) {
                        console.log("Traiding (" + r + ") - " + amount + " (" + offer.price + " - " + energy_cost +")");
                        console.log("Win: " + win + " - Lose: " + lose);
                        Game.market.deal(offer.id, amount, room.name);
                    }
                })
            }
        }
    },


};

module.exports = managerMarket;