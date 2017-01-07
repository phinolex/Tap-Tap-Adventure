var cls = require('../lib/class');

module.exports = Minigame = cls.Class.extend({
    init: function(id, name) {
        var self = this;

        self.id = id;
        self.name = name;
    },

    getId: function() {
        return this.id;
    },

    getName: function() {
        return this.name;
    }
});