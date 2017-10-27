var Entity = require('../Entity'),
    Utils = require('../../../util/utils');

module.exports = Chest = Entity.extend({

    init: function(id, instance, x, y) {
        var self = this;

        self._super(id, 'chest', instance, x, y);

        self.respawnDuration = 25000; //Every 25 seconds
        self.static = false;

        self.items = [];
    },

    openChest: function() {
        var self = this;

        if (self.openCallback)
            self.openCallback();
    },

    respawn: function() {
        var self = this;

        setTimeout(function() {

            if (self.respawnCallback)
                self.respawnCallback();

        }, self.respawnDuration);
    },

    getItem: function() {
        var self = this,
            random = Utils.randomInt(0, self.items.length - 1),
            item = self.items[random];

        if (!item)
            return;

        return item;
    },

    onOpen: function(callback) {
        this.openCallback = callback;
    },

    onRespawn: function(callback) {
        this.respawnCallback = callback
    }

});