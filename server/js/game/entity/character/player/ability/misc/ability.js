var cls = require('../../../../../../lib/class'),
    Abilities = require('../../../../../../util/abilities');

module.exports = Ability = cls.Class.extend({

    init: function(name, type) {
        var self = this;

        self.name = name;
        self.type = type;
        self.level = -1;

        self.data = Abilities.Data[name];
    }


});