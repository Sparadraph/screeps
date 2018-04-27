var managerQueueSpawn = {
    init: function(spawn) {
        spawn.memory.queue = [];
        spawn.room.memory.pos = {
            x: 24,
            y: 19,
        }
    },

    getPosition: function(queue, max_time) {
        for(var i in queue) {
            if(max_time <= queue[i].max_time) {
                return parseInt(i);
            }
        }
        return queue.length;
    },

    span: function(queue) {
        var i = 0;
        var t = Game.time
        while(true) {
            if(queue[i].t < t) {
                queue[i].t = t;
            } else if(i+2 < queue.length) {
                t = queue[i].t + 3 * queue[i].body.length;
                i++;
            } else {
                return;
            }
        }
    },

    ajust: function(queue, pos) {
        pos = _.min([pos, queue.length - 2]);
        for(var i=pos; i>=0; i--) {
            queue[i].t = _.min([queue[i].t, queue[i+1].t - 3 * queue[i].body.length]);
        }

        this.span(queue);
    },

    add: function(spawn, name, body, mem, max_time) {
        var queue = spawn.memory.queue;
        var tmp = 3 * body.length;

        var pos = this.getPosition(queue, max_time)
        queue.splice(pos, 0, {
                name: name,
                body: body,
                mem: mem,
                t: max_time,
                max_time: max_time,
            }
        );
        this.ajust(queue, pos);
    },

    forecast: function() {
        _.forEach(Memory.data.task, function(mem, task_id) {
            if(mem.state != 'live')
                return


        })
    },

    produce: function(spawn) {
        var queue = spawn.memory.queue;
        _.forEach(queue, function(q) {
            console.log(q.t-q.max_time, q.t - Game.time, q.t, q.name);
        });

        var important = -1;
        for(var i in queue) {
            var q = queue[i];
            var type = Memory.data.task[q.mem.task_id].type;

            if(q.t > q.max_time && (type == 'auto_filler' || type == 'filler') ) {
                important = i;
                //console.log(important);
            }
        }

        if(important >= 0) {
            var res = spawn.spawnCreep(queue[important].body, queue[important].name, {
                memory: queue[important].mem,
            })
            if(res) {
                this.span(queue);
                // Name already taken, discard
                if(res == -3) {
                    queue.splice(important, 1);
                    return;
                }

            // Ok to produce, discard
            } else {
                queue.splice(important, 1);
                return;
            }
        }

        if(queue.length && queue[0].t <= Game.time) {
            var res = spawn.spawnCreep(queue[0].body, queue[0].name, {
                memory: queue[0].mem,
            })

            if(res) {
                this.span(queue);
                // Name already taken, discard
                if(res == -3) {
                    queue.shift();
                }

            // Ok to produce, discard
            } else {
                queue.shift();
            }
        }

    },

    deprecate: function(spawn, task_id) {
        var queue = spawn.memory.queue;
        
        for(var i in queue) {
            if(queue[i].mem.task_id == task_id) {
                queue.splice(i, 1);
            }
        }
    },
};

module.exports = managerQueueSpawn;