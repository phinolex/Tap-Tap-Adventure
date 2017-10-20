var Minigame = require('../minigame'),
    Data = require('../../../data/minigames.json');

module.exports = TeamWar = Minigame.extend({

    init: function(world) {
        var self = this;

        self.world = world;

        self.data = Data['TeamWar'];

        self._super(self.data.id, self.data.name);


    }

});