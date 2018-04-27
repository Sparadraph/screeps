var managerId = {
	init: function() {
		if(!Memory.ID) {
			Memory.ID = {};
		}
		if(!Memory.data) {
			Memory.data = {};
		}

		_.forEach([
			'task',
			'group',
		], function(type) {
			if(!(type in Memory.ID)) {
				Memory.ID[type] = 1;
			}

			if(!(type in Memory.data)) {
				Memory.data[type] = {};
			}
		})
	},

	getId: function(type) {
		return Memory.ID[type] ++;
	},
};


module.exports = managerId;