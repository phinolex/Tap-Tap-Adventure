var Combat = require('../../js/game/entity/character/combat/combat');

module.exports = GreatSquid = Combat.extend({

    init: function(character) {
        var self = this;

        self._super(character);

        self.character = character;

    },

    hit: function(character, target, hitInfo) {
        var self = this;

        self._super(character, target, hitInfo);
    }


});