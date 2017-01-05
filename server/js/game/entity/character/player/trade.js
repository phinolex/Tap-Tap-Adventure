var cls = require("./../../../lib/class"),
    Messages = require('../../../network/packets/message'),
    Types = require('../../../../../../shared/js/gametypes');

module.exports = Trade = cls.Class.extend({
    init: function(server, playerOne, playerTwo) {
        var self = this;

        self.server = server;
        self.players = [playerOne, playerTwo]; //For iteration purposes
        self.items = [[], []]; //use id (311, 21, 125)
        self.tradeState = 0;

        self.startTrade();
    },

    startTrade: function() {
        var self = this;
        
        if (self.tradeState == 0) { //Just checking..
            for (var player in self.players)
                self.server.pushToPlayer(player, new Messages.Trade(Types.TradeStates.STARTED, self.items, self.players[1].name, self.players[2].name));
        }
    },

    addItem: function(player, item) {
        var self = this,
            playerIndex = self.getPlayerIndex(player);

        self.items[playerIndex].push(item);
        self.updateTrade();
    },

    getPlayerItems: function(player) {
        return this.items[this.getPlayerIndex(player)];
    },
    
    updateTrade: function() {
        var self = this;

        for (var player in self.players)
            self.server.pushToPlayer(player, new Messages.Trade(Types.TradeStates.ITEMCHANGE, self.items, self.players[1].name, self.players[2].name));
    },

    getPlayerIndex: function(player) {
        for (var i = 0; i < this.players; i++) {
            if (this.players[i].name == player.name)
                return i;
        }
    },

    finishTrade: function() {
        var self = this;
        /**
         * When it comes to finishing a trade,
         * we must ensure both players have enough
         * space available in their inventory.
         */

        for (var player in self.players) {
            if (self.getPlayerItems(player).length > player.inventory.getAvailableSpace()) {

            }
        }
    }
});