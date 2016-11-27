var cls = require('./lib/class');

module.exports = Projectile = cls.Class.extend({
    init: function(id, type) {
        var self = this;

        this.id = id;
        this.type =type;
    }
});