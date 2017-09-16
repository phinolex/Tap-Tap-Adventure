var Entity = require('../entity');

module.exports = Projectile = Entity.extend({

    init: function(id, instance) {
        var self = this;

        self._super(id, 'projectile', instance);

        self.startX = -1;
        self.startY = -1;
        self.destX = -1;
        self.destY = -1;

        self.target = false;
        self.static = false;

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

        self.target = true;

        self.destX = target.x;
        self.destY = target.y;
    },

    setStaticTarget: function(x, y) {
        var self = this;

        self.static = true;

        self.destX = x;
        self.destY = y;
    }

});