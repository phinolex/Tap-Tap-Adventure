var Ability = require('./ability');

module.exports = IceAttack = Ability.extend({

    init: function(name, type) {
        var self = this;

        self._super(name, type);
    }

});