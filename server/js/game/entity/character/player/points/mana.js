var Points = require('./points');

module.exports = Mana = Points.extend({

    init: function(mana, maxMana) {
        var self = this;

        self._super(mana, maxMana);
    },

    getMana: function() {
        return this.points;
    },

    getMaxMana: function() {
        return this.maxPoints;
    },

    setMana: function(mana) {
        var self = this;

        self.points = mana;

        if (self.manaCallback)
            self.manaCallback();
    },

    setMaxMana: function(maxMana) {
        var self = this;

        self.maxPoints = maxMana;

        if (self.maxManaCallback)
            self.maxManaCallback();
    },

    onMana: function(callback) {
        this.manaCallback = callback;
    },

    onMaxMana: function(callback) {
        this.maxManaCallback = callback;
    }

});