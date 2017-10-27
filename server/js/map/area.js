/* global module */

var cls = require('../lib/class');

module.exports = Area = cls.Class.extend({

    /**
     * This is an abstract file for Area,
     * it encompasses the dimensions and all
     * entities in it.
     */

    init: function(id, x, y, width, height) {
        var self = this;

        self.id = id;
        self.x = x;
        self.y = y;
        self.width = width;
        self.height = height;

        self.entities = [];
        self.items = [];

        self.hasRespawned = true;
        self.chest = null;

        self.maxEntities = 0;
    },

    contains: function(x, y) {
        return x >= this.x && y >= this.y && x < this.x + this.width && y < this.y + this.height;
    },

    addEntity: function(entity) {
        var self = this;

        if (self.entities.indexOf(entity) > 0)
            return;

        self.entities.push(entity);
        entity.area = self;

        if (self.spawnCallback)
            self.spawnCallback();
    },

    removeEntity: function(entity) {
        var self = this,
            index = self.entities.indexOf(entity);

        if (index > -1)
            self.entities.splice(index, 1);

        if (self.entities.length === 0 && self.emptyCallback)
            self.emptyCallback();

    },

    isFull: function() {
        return this.entities.length >= this.maxEntities;
    },

    setMaxEntities: function(maxEntities) {
        this.maxEntities = maxEntities;
    },

    onEmpty: function(callback) {
        this.emptyCallback = callback;
    },

    onSpawn: function(callback) {
        this.spawnCallback = callback;
    }

});