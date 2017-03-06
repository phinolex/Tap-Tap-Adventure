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
        self.stage = 0;
    },

    getId: function() {
        return this.id;
    },

    getName: function() {
        return this.name;
    },

    getStage: function() {
        return this.stage;
    },
    
    finished: function() {
        return this.stage == 9999;
    },

    getDescription: function() {
        return this.description;
    }
});