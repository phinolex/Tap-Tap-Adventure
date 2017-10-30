var Item = require('../../js/game/entity/objects/item.js'),
    Utils = require('../../js/util/utils'),
    Items = require('../../js/util/items')
;

module.exports = Flask = Item.extend({
    init: function (id, instance, x, y) {
        var self = this;
        self._super(id, instance, x, y);

        self.healAmount = 0;
        self.manaAmount = 0;


        var customData = Items.getCustomData(id);
        if (customData) {
            self.healAmount = customData.healAmount ? customData.healAmount : 0;
            self.manaAmount = customData.manaAmount ? customData.manaAmount : 0;
        }
    },

    onUse: function (character) {
        var self = this;
        if (self.healAmount) {
            character.healHitPoints(self.healAmount);
        }

        if (self.manaAmount) {
            character.healManaPoints(self.manaAmount);
        }

    }
});




