/**
 * Created by flavius on 2017-02-20.
 */
var cls = require('../lib/class'),
    Mining = require('../activities/mining');

module.exports = ActivityHandler = cls.Class.extend({

    init: function(player) {
        var self = this;

        self.server = server; //We will handle entities through this (rocks, trees, other things for activities)
        self.activities = {}
        
        self.loadActivities();
    },

    loadActivities: function() {
        var self = this;
        
        self.activities["Mining"] = new Mining(0, "Mining");
    }

});