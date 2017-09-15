var Equipment = require('./equipment'),
    Items = require('../../../../../util/items');

module.exports = Weapon = Equipment.extend({

    init: function(name, id, count, ability, abilityLevel) {
        var self = this;

        self._super(name, id, count, ability, abilityLevel);

        self.level = Items.getWeaponLevel(name);
        self.ranged = Items.isArcherWeapon(name);
    },

    hasCritical: function() {
        return this.ability === 1;
    },

    hasExplosive: function() {
        return this.ability === 4;
    },

    hasStun: function() {
        return this.ability === 5;
    },

    isRanged: function() {
        return this.ranged;
    },

    setLevel: function(level) {
        this.level = level;
    },

    getLevel: function() {
        return this.level;
    }

});