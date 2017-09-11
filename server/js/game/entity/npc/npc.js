var Entity = require('../entity');

module.exports = NPC = Entity.extend({

    init: function(id, instance, x, y) {
        var self = this;

        self._super(id, 'npc', instance, x, y);

        self.talkIndex = 0;
    },

    talk: function(messages) {
        var self = this;

        if (self.talkIndex > messages.length)
            self.talkIndex = 0;

        self.talkIndex++;

    }

});