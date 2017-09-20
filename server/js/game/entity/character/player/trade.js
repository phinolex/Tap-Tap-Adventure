var cls = require('../../../../lib/class'),
    Modules = require('../../../../util/modules');

module.exports = Trade = cls.Class.extend({

    /**
     * We maintain a trade instance for every player,
     * and we trigger it whenever the trading is
     * started and/or requested.
     */

    init: function(player) {
        var self = this;

        self.player = player;
        self.oPlayer = null;

        self.requestee = null;

        self.state = null;
        self.subState = null;

        self.playerItems = [];
        self.oPlayerItems = [];
    },

    start: function() {
        var self = this;

        self.oPlayer = self.requestee;
        self.state = Modules.Trade.Started;
    },

    stop: function() {
        var self = this;

        self.oPlayer = null;
        self.state = null;
        self.subState = null;
        self.requestee = null;

        self.playerItems = [];
        self.oPlayerItems = [];
    },

    finalize: function() {
        var self = this;

        if (!self.player.inventory.containsSpaces(self.oPlayerItems.length))
            return;

        for (var i in self.oPlayerItems) {
            var item = self.oPlayerItems[i];

            if (!item || item.id === -1)
                continue;

            self.oPlayer.inventory.remove(item.id, item.count, item.index);
            self.player.inventory.add(item);
        }
    },

    select: function(slot) {
        var self = this,
            item = self.player.inventory.slots[slot];

        if (!item || item.id === -1 || self.playerItems.indexOf(item) < 0)
            return;

        self.playerItems.push(item);
    },

    request: function(oPlayer) {
        var self = this;

        self.requestee = oPlayer;

        if (oPlayer.trade.getRequestee() === self.player.instance)
            self.start();


    },

    accept: function() {
        var self = this;

        self.subState = Modules.Trade.Accepted;

        if (self.oPlayer.trade.subState === Modules.Trade.Accepted) {
            self.finalize();
            self.oPlayer.trade.finalize();
        }
    },

    getRequestee: function() {
        var self = this;

        if (!self.requestee)
            return null;

        return self.requestee.instance;
    },

    decline: function() {
        this.stop();
    },

    isStarted: function() {
        return this.state !== null;
    }

});