var cls = require('../../../../../lib/class');

module.exports = Points = cls.Class.extend({

    init: function(points, maxPoints) {
        var self = this;

        self.points = points;
        self.maxPoints = maxPoints;
    },

    heal: function(amount) {
        var self = this;

        self.setPoints(self.points + amount);

        if (self.healCallback)
            self.healCallback();
    },

    increment: function(amount) {
        this.points += amount;
    },

    decrement: function(amount) {
        this.points -= amount;
    },

    setPoints: function(points) {
        var self = this;

        self.points = points;

        if (self.points > self.maxPoints)
            self.points = self.maxPoints;
    },

    setMaxPoints: function(maxPoints) {
        this.maxPoints = maxPoints;
    },

    getData: function() {
        return [this.points, this.maxPoints];
    },

    onHeal: function(callback) {
        this.healCallback = callback;
    }


});