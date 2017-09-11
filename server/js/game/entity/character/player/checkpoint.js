var cls = require('../../../../lib/class');

module.exports = Checkpoint = cls.Class.extend({

    init: function(id, player) {
        var self = this;

        self.id = id;

        self.player = player;
        self.world = player.world;
        self.map = self.world.map;


    }

});