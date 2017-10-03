var Quest = require('../quest');

module.exports = BulkySituation = Quest.extend({

    init: function(player, data) {
        var self = this;

        self.player = player;
        self.data = data;

        self._super(data.id, data.name, data.description);
    },

    load: function() {
        var self = this;


    }

});