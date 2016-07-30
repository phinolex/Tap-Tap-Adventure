/* global Types, module */

var Entity = require('./entity'),
	ItemTypes = require("../../shared/js/itemtypes");

module.exports = Item = Entity.extend({
    init: function (id, kind, x, y, count) {
        this._super(id, 'item', kind, x, y);
        this.isStatic = false;
        this.isFromChest = false;
        this.skillKind = 0;
        this.skillLevel = 0;
        this.count = (count) ? count : 1;
    },

    handleDespawn: function (params) {
        var self = this;

        this.blinkTimeout = setTimeout(function () {
            params.blinkCallback();
            self.despawnTimeout = setTimeout(params.despawnCallback, params.blinkingDuration);
        }, params.beforeBlinkDelay);
    },

    destroy: function () {
        if (this.blinkTimeout) {
            clearTimeout(this.blinkTimeout);
        }
        if (this.despawnTimeout) {
            clearTimeout(this.despawnTimeout);
        }

        if (this.isStatic) {
            this.scheduleRespawn(30000);
        }
    },

    scheduleRespawn: function (delay) {
        var self = this;
        setTimeout(function () {
            if (self.respawnCallback) {
                self.respawnCallback();
            }
        }, delay);
    },

    onRespawn: function (callback) {
        this.respawnCallback = callback;
    },
    getState: function() {
        //this._super.getState().push(this.count);
        return [
            parseInt(this.id),
            this.kind,
            this.x,
            this.y,
            this.count
        ];
    },
    toString: function(){
    return ItemTypes.getKindAsString(this.kind) + " "
         + this.count + " "
         + Types.getItemSkillNameByKind(this.skillKind) + " "
         + this.skillLevel + " "
         + this.x + " "
         + this.y;
  }
});
