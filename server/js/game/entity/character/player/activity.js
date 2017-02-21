/**
 * Created by flavius on 2017-02-20.
 */

var cls = require('../../../lib');

module.exports = Activity = cls.Class.extend({

    init: function(id, name) {
        var self = this;

        self.id = id;
        self.name = name;
        self.exp = 0;
        self.level = 0;
    },

    setExp: function(exp) {
        this.exp = exp;
    },

    setLevel: function(level) {
        this.level = level;
    }

});