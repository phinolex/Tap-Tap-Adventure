var cls = require("./../lib/class");

module.exports = Timer = cls.Class.extend({

    init: function(duration, startingTime) {
        var self = this;

        self.lastTime = startingTime || 0;
        self.duration = duration;
    },

    isOver: function(time) {
        var self = this,
            over = false;

        if ((time - self.lastTime) > self.duration) {
            over = true;
            self.lastTime = time;
        }

        return over;
    }

});