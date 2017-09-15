var Equipment = require('./equipment'),
    Items = require('../../../../../util/items');

module.exports = Armour = Equipment.extend({

    init: function(name, id, count, ability, abilityLevel) {
        var self = this;

        self._super(name, id, count, ability, abilityLevel);

        self.defense = Items.getArmourLevel(name);
    },

    hasAntiStun: function() {
        return this.ability === 6
    },

    setDefense: function(defense) {
        this.defense = defense;
    },

    getDefense: function() {
        return this.defense;
    }

});