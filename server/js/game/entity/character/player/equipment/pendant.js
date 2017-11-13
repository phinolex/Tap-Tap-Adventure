var Equipment = require('./equipment'),
    Items = require('../../../../../util/items');

module.exports = Pendant = Equipment.extend({

    init: function(name, id, count, ability, abilityLevel) {
        var self = this;

        self._super(name, id, count, ability, abilityLevel);

        self.pendantLevel = Items.getPendantLevel(name);
    },

    getBaseAmplifier: function() {
        return 1.00 + this.pendantLevel / 100;
    }

});