/* global module */

var cls = require('../../lib/class'),
    _ = require('underscore'),
    Area = require('../area'),
    map = require('../../../data/map/world_server.json');

module.exports = PVPAreas = cls.Class.extend({

    init: function() {
        var self = this;

        self.pvpAreas = [];

        self.load();
    },

    load: function() {
        var self = this,
            list = map.pvpAreas;

        _.each(list, function(p) {
            var pvpArea = new Area(p.id, p.x, p.y, p.width, p.height);

            self.pvpAreas.push(pvpArea);
        });

        log.info('Loaded ' + self.pvpAreas.length + ' PVP areas.');
    }

});