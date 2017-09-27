var cls = require('../../../../../lib/class'),
    Items = require('../../../../../util/items');

module.exports = Equipment = cls.Class.extend({

    /**
     * Count represents the enchantment level of
     * the equipment child
     */

    init: function(name, id, count, ability, abilityLevel) {
        var self = this;

        self.name = name;
        self.id = id;
        self.count = count ? count : 0;
        self.ability = ability ? ability : 0;
        self.abilityLevel = abilityLevel ? abilityLevel : 0;
    },

    getName: function() {
        return this.name;
    },

    getId: function() {
        return this.id;
    },

    getCount: function() {
        return this.count;
    },

    getAbility: function() {
        return this.ability;
    },

    getAbilityLevel: function() {
        return this.abilityLevel;
    },

    getBaseAmplifier: function() {
        return 1.00;
    },

    getData: function() {
        return [Items.idToName(this.id), Items.idToString(this.id), this.count, this.ability, this.abilityLevel];
    },

    getString: function() {
        return Items.idToString(this.id);
    },

    getItem: function() {
        return {
            name: this.name,
            string: Items.idToString(this.id),
            id: this.id,
            count: this.count,
            ability: this.ability,
            abilityLevel: this.abilityLevel
        }
    }

});