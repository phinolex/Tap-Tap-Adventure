var cls = require('../lib/class'),
    _ = require('underscore');

module.exports = Grids = cls.Class.extend({

    /**
     * This class is another version of the grid generation
     * system in the client side. It's used to simplify location
     * of all the entities in the world.
     */

    init: function(map) {
        var self = this;

        self.map = map;

        self.entityGrid = [];

        self.load();
    },

    load: function() {
        var self = this;

        for (var i = 0; i < self.map.height; i++) {
            self.entityGrid[i] = [];

            for (var j = 0; j < self.map.width; j++)
                self.entityGrid[i][j] = {};
        }
    },

    updateEntityPosition: function(entity) {
        var self = this;

        if (entity && entity.oldX === entity.x && entity.oldY === entity.y)
            return;

        self.removeFromEntityGrid(entity, entity.oldX, entity.oldY);
        self.addToEntityGrid(entity, entity.x, entity.y);

        entity.updatePosition();
    },

    addToEntityGrid: function(entity, x, y) {
        var self = this;

        if (entity && x > 0 && y > 0 && x < self.map.width && x < self.map.height && self.entityGrid[y][x])
            self.entityGrid[y][x][entity.instance] = entity;
    },

    removeFromEntityGrid: function(entity, x, y) {
        var self = this;

        if (entity && x > 0 && y > 0 && x < self.map.width && y < self.map.height && self.entityGrid[y][x] && entity.instance in self.entityGrid[y][x])
            delete self.entityGrid[y][x][entity.instance];
    },

    getSurroundingEntities: function(entity, radius, include) {
        var self = this,
            entities = [];

        if (!self.checkBounds(entity.x, entity.y, radius))
            return;

        for (var i = -radius; i < radius + 1; i++) {

            for (var j = -radius; j < radius + 1; j++) {
                var pos = self.entityGrid[entity.y + i][entity.x + j];

                if (_.size(pos) > 0) {
                    _.each(pos, function (pEntity) {

                        if (!include && pEntity.instance !== entity.instance)
                            entities.push(pEntity);
                    });
                }

            }
        }

        return entities;
    },

    checkBounds: function(x, y, radius) {
        return x + radius < this.map.width && x - radius > 0 && y + radius < this.map.height && y - radius > 0;
    }

});