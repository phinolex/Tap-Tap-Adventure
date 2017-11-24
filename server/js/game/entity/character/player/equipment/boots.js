var Equipment = require('./equipment'),
    Items = require('../../../../../util/items');

module.exports = Boots = Equipment.extend({

    init: function(name, id, count, ability, abilityLevel) {
        var self = this;

        self._super(name, id, count, ability, abilityLevel);

        self.bootsLevel = Items.getBootsLevel(name);
    },

    getBaseAmplifier: function() {
        return 1.00 + (this.bootsLevel / 200);
    }

});