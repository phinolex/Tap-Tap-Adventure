var cls = require('./../lib/class'),
    Minigame = require('./minigame'),
    Messages = require('../network/packets/message'),
    Types = require('../../../../shared/js/gametypes');

module.exports = PVPGame = Minigame.extend({
    init: function(world, id, name) {
        var self = this;
        
        self._super(id, name);
        self.world = world; //We pass server instances and such we have full control.
        self.players = [];

        self.start();
    },

    start: function() {
        var self = this;

        self.processInterval = setInterval(function() {
            for (var i in self.players) {
                var playerId = self.players[i];

                var player = self.world.getEntityById(playerId);
                
                if (player) {
                    if (!player.gameFlag)
                        self.removePlayer(player);
                }
            }
        }, 1000);
    },

    restart: function() {
        var self = this;

        clearInterval(self.processInterval);
        self.players = [];

        self.startProcess();
    },

    stop: function() {
        var self = this;

        clearInterval(self.processInterval);
    },

    addPlayer: function(player) {
        var self = this;

        self.players.push(player.id);
    },

    removePlayer: function(player) {
        var self = this,
            index = self.players.indexOf(player.id);

        if (index > -1)
            self.players.splice(index, 1);
    },

    isInGame: function(player) {
        var self = this;

        for (var p in self.players)
            if (p.id == player.id)
                return true;

        return false;
    },

    updatePlayers: function() {
        var self = this;


    },

    playerCount: function() {
        return this.players.length;
    }
});