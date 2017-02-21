var cls = require('../lib/class'),
    PVPGame = require('../minigames/pvpgame'),
    KingOfTheHill = require('../minigames/kingofthehill')

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
        self.minigames["KOTH"] = new KingOfTheHill(self.server, 2, "KOTH");

        log.info("[MinigameHandler] Has been successfully initialized!");
        log.info("[MinigameHandler] Loaded: " + self.getMinigameCount() + " minigames!");
    },

    getPVPMinigame: function() {
        return this.minigames["PVPGame"];
    },

    getKOTHMinigame: function() {
        return this.minigames["KOTH"];
    },

    getMinigameCount: function() {
        var count = 0;
        for (var minigame in this.minigames)
            count++;

        return count;
    }
});