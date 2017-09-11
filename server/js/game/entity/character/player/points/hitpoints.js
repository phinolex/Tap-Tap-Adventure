var Points = require('./points');

module.exports = HitPoints = Points.extend({

    init: function(hitPoints, maxHitPoints) {
        var self = this;

        self._super(hitPoints, maxHitPoints);
    },

    setHitPoints: function(hitPoints) {
        var self = this;

        self.setPoints(hitPoints);

        if (self.hitPointsCallback)
            self.hitPointsCallback();
    },

    setMaxHitPoints: function(maxHitPoints) {
        var self = this;

        self.setMaxPoints(maxHitPoints);

        if (self.maxHitPointsCallback)
            self.maxHitPointsCallback();
    },

    getHitPoints: function() {
        return this.points;
    },

    getMaxHitPoints: function() {
        return this.maxPoints;
    },

    onHitPoints: function(callback) {
        this.hitPointsCallback = callback;
    },

    onMaxHitPoints: function(callback) {
        this.maxHitPointsCallback = callback;
    }

});