var cls = require('../lib/class'),
    TeamWar = require('../minigames/impl/teamwar');

module.exports = Minigames = cls.Class.extend({

    init: function(world) {
        var self = this;

        self.world = world;
        self.minigames = {};

        self.load();
    },

    load: function() {
        var self = this;

        self.minigames['TeamWar'] = new TeamWar();
    },

    getTeamWar: function() {
        return this.minigames['TeamWar'];
    }

});