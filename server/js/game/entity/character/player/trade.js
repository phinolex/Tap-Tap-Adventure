var cls = require('../../../../lib/class'),
    Modules = require('../../../../util/modules');

module.exports = Trade = cls.Class.extend({

    /**
     * Trade states proceed as follows..
     *
     * 1. Initial request (either player requests a trade)
     * 2. Trading screen opens (player select their items)
     * 3. First player accepts
     * 4. Second player accepts
     * 5. Trade finished.
     *
     * Each trading instance is assigned to a player,
     * and it is only triggered whenever a trade is intiated.
     *
     * After the trade, the oPlayer for each repsective player is cleared.
     *
     */

    init: function(player, oPlayer) {
        var self = this;

        self.player = player;
        self.oPlayer = oPlayer;

        self.playerItems = [];
        self.oPlayerItems = [];

        self.state = null;
    },

    select: function(instance, slot) {

    },

    accept: function() {
        var self = this;


    },

    decline: function() {

    },

    isStarted: function() {
        return this.state !== null;
    }

});