var Equipment = require('./equipment'),
    Items = require('../../../../../util/items');

module.exports = Boots = Equipment.extend({

    init: function(name, id, count, ability, abilityLevel) {
        var self = this;

        self._super(name, id, count, ability, abilityLevel);

        self.bootsLevel = Items.getBootsLevel(name);
    }

});