/* global module */

var cls = require('../../lib/class'),
    Messages = require('../../network/messages'),
    Mobs = require('../../util/mobs'),
    NPCs = require('../../util/npcs'),
    Items = require('../../util/items');

module.exports = Entity = cls.Class.extend({

    init: function(id, type, instance, x, y) {
        var self = this;

        self.id = id;
        self.type = type;
        self.instance = instance;

        self.x = x;
        self.y = y;

        self.combat = null;

        self.dead = false;

        self.recentGroups = [];
    },

    getCombat: function() {
        return null;
    },

    getDistance: function(entity) {
        var self = this,
            x = Math.abs(self.x - entity.x),
            y = Math.abs(self.y - entity.y);

        return x > y ? x : y;
    },

    getCoordDistance: function(toX, toY) {
        var self = this,
            x = Math.abs(self.x - toX),
            y = Math.abs(self.y - toY);

        return x > y ? x : y;
    },

    isAdjacent: function(entity) {
        var self = this;

        if (!entity)
            return false;

        return self.getDistance(entity) <= 1;
    },

    isNonDiagonal: function(entity) {
        return this.isAdjacent(entity) && !(entity.x !== this.x && entity.y !== this.y);
    },

    isNear: function(entity, distance) {
        var self = this,
            near = false;

        var dx = Math.abs(self.x - entity.x),
            dy = Math.abs(self.y - entity.y);

        if (dx <= distance && dy <= distance)
            near = true;

        return near;
    },

    drop: function(item) {
        return new Messages.Drop(this, item);
    },

    isPlayer: function() {
        return this.type === 'player';
    },

    isMob: function() {
        return this.type === 'mob';
    },

    isNPC: function() {
        return this.type === 'npc';
    },

    isItem: function() {
        return this.type === 'item';
    },

    setPosition: function(x, y) {
        var self = this;

        self.x = x;
        self.y = y;
    },

    getState: function() {
        var self = this,
            string = self.isMob() ? Mobs.idToString(self.id) : (self.isNPC() ? NPCs.idToString(self.id) : Items.idToString(self.id)),
            name = self.isMob() ? Mobs.idToName(self.id) : (self.isNPC() ? NPCs.idToName(self.id) : Items.idToName(self.id));

        return [
            self.type,
            self.instance,
            string,
            name,
            self.x,
            self.y
        ];
    }

});