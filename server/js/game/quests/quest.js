/**
 * Provides the baseline for every quest such as
 * its name, id, description and any other information.
 */

var cls = require('../lib/class');

module.exports = Quest = cls.Class.extend({
    init: function(id, name, description) {
        var self = this;

        self.id = id;
        self.name = name;
        self.description = description;
    },

    getId: function() {
        return this.id;
    },

    getName: function() {
        return this.name;
    },

    getDescription: function() {
        return this.description;
    }
});