/* global Types, module */

var Entity = require('./../entity'),
	ItemTypes = require("../../../../../shared/js/itemtypes");

module.exports = Item = Entity.extend({

    init: function(id, kind, x, y, count) {
        var self = this;

        self._super(id, 'item', kind, x,  y);

        self.isStatic = false;
        self.isFromChest = false;
        self.skillKind = 0;
        self.skillLevel = 0;

        self.count = count ? count : 1;
    },

    handleDespawn: function(parameters) {
        var self = this;

        self.blinkTimeout = setTimeout(function() {
            parameters.blinkCallback();
            self.despawnTimeout = setTimeout(parameters.despawnCallback, parameters.blinkingDuration);
        }, parameters.beforeBlinkDelay);
    },

    destroy: function() {
        var self = this;

        if (self.blinkTimeout)
            clearTimeout(self.blinkTimeout);

        if (self.despawnTimeout)
            clearTimeout(self.despawnTimeout);

        if (self.isStatic)
            self.scheduleRespawn(30000);
    },

    scheduleRespawn: function(delay) {
        var self = this;

        setTimeout(function() {
            if (self.respawnCallback)
                self.respawnCallback();
        }, delay);
    },

    onRespawn: function(callback) {
        this.respawnCallback = callback;
    },

    getState: function() {
        var self = this;

        return [parseInt(self.id), self.kind, self.x, self.y, self.count];
    },

    toString: function() {
        var self = this;

        return ItemTypes.getKindAsString(self.kind) + ' ' + self.count + ' ' + Types.getItemSkillNameByKind(self.skillKind) + ' ' + self.skillLevel + self.x + ' ' + self.y;
    }
});
