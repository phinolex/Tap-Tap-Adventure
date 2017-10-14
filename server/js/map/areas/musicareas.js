/* global module, log */

var cls = require('../../lib/class'),
    _ = require('underscore'),
    map = require('../../../data/map/world_server.json'),
    Area = require('../area');

module.exports = MusicAreas = cls.Class.extend({

    init: function() {
        var self = this;

        self.musicAreas = [];

        self.load();
    },

    load: function() {
        var self = this;

        _.each(map.musicAreas, function(m) {
            var musicArea = new Area(m.id, m.x, m.y, m.width, m.height);

            self.musicAreas.push(musicArea);
        });

        log.info('Loaded ' + self.musicAreas.length + ' music areas.');
    }

});