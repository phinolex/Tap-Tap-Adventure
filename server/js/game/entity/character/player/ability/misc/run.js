var Ability = require('./ability');

module.exports = Run = Ability.extend({

    init: function(name, type) {
        var self = this;

        self._super(name, type);
    }

});