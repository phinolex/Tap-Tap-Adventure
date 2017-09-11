var cls = require('../../../../../lib/class'),
    AbilityInfo = require('../../../../../util/abilities'),
    _ = require('underscore');

module.exports = Abilities = cls.Class.extend({

    init: function(player) {
        var self = this;

        self.player = player;

        self.abilities = {};
        self.shortcuts = [];

        self.shortcutSize = 5;
    },

    addAbility: function(ability) {
        this.abilities[ability.name] = ability;
    },

    addShortcut: function(ability) {
        var self = this;

        if (self.shortcutSize >= 5)
            return;

        self.shortcuts.push(ability.name);
    },

    removeAbility: function(ability) {
        var self = this;

        if (self.isShortcut(ability))
            self.removeShortcut(self.shortcuts.indexOf(ability.name));

        delete self.abilities[ability.name];
    },

    removeShortcut: function(index) {
        if (index > -1)
            this.shortcuts.splice(index, 1);
    },

    hasAbility: function(ability) {
        _.each(this.abilities, function(uAbility) {
            if (uAbility.name === ability.name)
                return true;
        });

        return false;
    },

    isShortcut: function(ability) {
        return this.shortcuts.indexOf(ability.name) > -1;
    },

    getArray: function() {
        var self = this,
            abilities = '',
            abilityLevels = '',
            shortcuts = self.shortcuts.toString();

        _.each(self.abilities, function(ability) {
            abilities += ability.name;
            abilityLevels += ability.level;
        });

        return {
            username: self.player.username,
            abilities: abilities,
            abilityLevels: abilityLevels,
            shortcuts: shortcuts
        }
    }

});