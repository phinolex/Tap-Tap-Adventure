var Entity = require('../entity');

module.exports = Item = Entity.extend({

    init: function(id, instance, x, y) {
        var self = this;

        self._super(id, 'item', instance, x, y);

        self.static = false;
        self.dropped = false;
        self.shard = false;

        self.count = 1;
        self.ability = 0;
        self.abilityLevel = 0;
        self.tier = 1;

        self.respawnTime = 30000;
        self.despawnDuration = 4000;
        self.blinkDelay = 20000;
        self.despawnDelay = 1000;

        self.blinkTimeout = null;
        self.despawnTimeout = null;
    },

    destroy: function() {
        var self = this;

        if (self.blinkTimeout)
            clearTimeout(self.blinkTimeout);

        if (self.despawnTimeout)
            clearTimeout(self.despawnTimeout);

        if (self.static)
            self.respawn();
    },

    despawn: function() {
        var self = this;

        self.blinkTimeout = setTimeout(function() {
            if (self.blinkCallback)
                self.blinkCallback();

            self.despawnTimeout = setTimeout(function() {
                if (self.despawnCallback)
                    self.despawnCallback();

            }, self.despawnDuration);

        }, self.blinkDelay);
    },

    respawn: function() {
        var self = this;

        setTimeout(function() {
            if (self.respawnCallback)
                self.respawnCallback();
        }, self.respawnTime);
    },

    getData: function() {
        var self = this;

        return [self.id, self.count, self.ability, self.abilityLevel];
    },

    getState: function() {
        var self = this,
            state = self._super();

        state.count = self.count;
        state.ability = self.ability;
        state.abilityLevel = self.abilityLevel;

        return state;
    },

    setCount: function(count) {
        this.count = count;
    },

    setAbility: function(ability) {
        this.ability = ability;
    },

    setAbilityLevel: function(abilityLevel) {
        this.abilityLevel = abilityLevel;
    },

    onRespawn: function(callback) {
        this.respawnCallback = callback;
    },

    onBlink: function(callback) {
        this.blinkCallback = callback;
    },

    onDespawn: function(callback) {
        this.despawnCallback = callback;
    }

});