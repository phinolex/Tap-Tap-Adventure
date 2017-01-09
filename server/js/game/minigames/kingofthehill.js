/**
 * Created by flavius on 2017-01-07.
 */
var cls = require('../lib/class');

module.exports = KingOfTheHill = cls.Class.extend({
    init: function() {
        var self = this;

        self.start();
    },

    start: function() {
        setInterval(function() {
            //update every second.
        }, 1000);
    }
});