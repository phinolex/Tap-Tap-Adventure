var cls = require('../lib/class');

module.exports = Grids = cls.Class.extend({

    init: function(map) {
        var self = this;

        self.map = map;

        self.pathingGrid = [];

        self.load();
    },

    load: function() {
        var self = this;
    }

});