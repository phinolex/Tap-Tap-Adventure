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
        self.hasRespawned = true;

        self.maxEntities = 0;
    },

    contains: function(x, y) {
        return x >= this.x && y >= this.y && x < this.x + this.width && y < this.y + this.height;
    },

    addToArea: function(entity) {
        var self = this;

        self.entities.push(entity);
        entity.area = self;
    },

    removeFromArea: function(entity) {
        var self = this,
            index = self.entities.indexOf(entity);

        if (index > -1)
            self.entities.splice(index, 1);
    },

    isFull: function() {
        return this.entities.length >= this.maxEntities;
    },

    setMaxEntities: function(maxEntities) {
        this.maxEntities = maxEntities;
    },

    onEmpty: function(callback) {
        this.emptyCallback = callback;
    }

});