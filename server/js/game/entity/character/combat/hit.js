var cls = require('../../../../lib/class');

/**
 * Author: Tachyon
 * Company: uDeva 2017
 */

module.exports = Hit = cls.Class.extend({

    init: function(type, damage) {
        var self = this;

        self.type = type;
        self.damage = damage;
    },

    getDamage: function() {
        return this.damage;
    },

    getData: function() {
        return [this.damage, this.type];
    }

});