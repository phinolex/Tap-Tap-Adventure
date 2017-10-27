var cls = require('../../lib/class'),
    Area = require('../area'),
    map = require('../../../data/map/world_server.json'),
    _ = require('underscore');

module.exports = ChestAreas = cls.Class.extend({

    init: function(world) {
        var self = this;

        self.world = world;

        self.chestAreas = [];

        self.load();
    },

    load: function() {
        var self = this;

        _.each(map.chestAreas, function(m) {
            var chestArea = new Area(m.id, m.x, m.y, m.width, m.height);

            chestArea.maxEntities = m.entities;
            chestArea.items = m.i;
            chestArea.cX = m.tx;
            chestArea.cY = m.ty;

            self.chestAreas.push(chestArea);

            chestArea.onEmpty(function() {
                self.spawnChest(this);
            });

            chestArea.onSpawn(function() {
                self.removeChest(this);
            });

        });

        log.info('Loaded ' + self.chestAreas.length + ' chest areas.');
    },

    standardize: function() {
        var self = this;

        _.each(self.chestAreas, function(chestArea) {
            chestArea.setMaxEntities(chestArea.entities.length);
        });
    },

    spawnChest: function(chestArea) {
        var self = this;

        /**
         * Works beautifully :)
         */

        chestArea.chest = self.world.spawnChest(chestArea.items, chestArea.cX, chestArea.cY, false);
    },

    removeChest: function(chestArea) {
        var self = this;

        if (!chestArea.chest)
            return;

        self.world.removeChest(chestArea.chest);

        chestArea.chest = null;
    }

});