var cls = require('../lib/class'),
    PVPGame = require('../minigames/pvpgame');

/**
 * This is similar in concept to
 * https://www.rune-server.ee/runescape-development/rs-503-client-server/snippets/480042-minigame-handler.html
 */

module.exports = MinigameHandler = cls.Class.extend({
    init: function(server) {
        var self = this;

        self.server = server;
        self.minigames = {};

        self.loadMinigames();
    },

    loadMinigames: function() {
        var self = this;

        self.minigames["PVPGame"] = new PVPGame(self.server, 1, "PVPGame");

        log.info("Minigame Handler has been successfully initialized.");
    },

    getPVPMinigame: function() {
        return this.minigames["PVPGame"];
    }
});