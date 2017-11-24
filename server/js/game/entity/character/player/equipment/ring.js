var Equipment = require('./equipment'),
    Items = require('../../../../../util/items');

module.exports = Ring = Equipment.extend({

    init: function(name, id, count, ability, abilityLevel) {
        var self = this;

        self._super(name, id, count, ability, abilityLevel);

        self.ringLevel = Items.getRingLevel(name);
    },

    getBaseAmplifier: function() {
        return 1.00 + (this.ringLevel / 150);
    }

});