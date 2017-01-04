var cls = require("./lib/class");

/* global Lobby, World, databaseHandler */

module.exports = Lobby = World.extend({
    init: function(server, player) {
        var self = this;

        self.server = server;
        self.player = player;
    }
});