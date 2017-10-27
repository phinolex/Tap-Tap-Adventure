var Entity = require('../entity');

module.exports = Projectile = Entity.extend({

    init: function(id, instance) {
        var self = this;

        self._super(id, 'projectile', instance);

        self.startX = -1;
        self.startY = -1;
        self.destX = -1;
        self.destY = -1;

        self.target = null;

        self.damage = -1;
        self.special = -1;

        self.owner = null;
    },

    setStart: function(x, y) {
        var self = this;

        self.x = x;
        self.y = y;
    },

    setTarget: function(target) {
        var self = this;

        self.target = target;

        self.destX = target.x;
        self.destY = target.y;
    },

    setStaticTarget: function(x, y) {
        var self = this;

        self.static = true;

        self.destX = x;
        self.destY = y;
    },

    getData: function() {
        var self = this;

        /**
         * Cannot generate a projectile
         * unless it has a target.
         */

        if (!self.owner || !self.target)
            return;

        return {
            id: self.instance,
            name: self.owner.projectileName,
            characterId: self.owner.instance,
            targetId: self.target.instance,
            damage: self.damage,
            special: self.special,
            type: self.type
        }
    }

});