var Quest = require('../quest'),
    Messages = require('../../../../../../network/messages'),
    Packets = require('../../../../../../network/packets'),
    Utils = require('../../../../../../util/utils');

module.exports = TheLie = Quest.extend({

    init: function(player, data) {
        var self = this;

        self.player = player;
        self.data = data;

        self._super(data.id, data.name, data.description)
    },

    load: function(stage) {
        var self = this;

        if (stage)
            self.update();
        else
            self.stage = stage;
    },

    update: function() {
        this.player.save();
    }


});