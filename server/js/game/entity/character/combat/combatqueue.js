var cls = require('../../../../lib/class');

/**
 * Author: Tachyon
 * Company: uDeva 2017
 */

module.exports = CombatQueue = cls.Class.extend({

    init: function() {
        var self = this;

        self.hitQueue = [];
    },

    add: function(hit) {
        this.hitQueue.push(hit);
    },

    hasQueue: function() {
        return this.hitQueue.length > 0;
    },

    clear: function() {
        this.hitQueue = [];
    },

    getHit: function() {
        var self = this;

        if (self.hitQueue.length < 1)
            return;

        var hit = self.hitQueue.shift();

        return hit.getData();
    }

});