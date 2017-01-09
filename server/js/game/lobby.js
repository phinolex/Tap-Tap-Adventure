var cls = require("./lib/class");

/* global Lobby, World, databaseHandler */

/**
 * The player login and create method have to be redone for this to work fully,
 * I am laying out the foundation for the future when I have more time. The bottom
 * line is that a player does not spawn until they've clicked "Start Game".
 */


module.exports = Lobby = cls.Class.extend({
    init: function(server) {
        var self = this;

        self.server = server;
        self.players = [];

        log.info("[Lobby] Has been successfully initialized!");
    },

    addPlayer: function(player) {
        this.players.push(player);
    },

    removePlayer: function(player) {
        var self = this,
            index = self.players.indexOf(player.id);

        if (index > -1)
            self.players.splice(index, 1);
    },

    startGame: function() {

    }
});