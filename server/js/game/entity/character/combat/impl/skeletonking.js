var Combat = require('../combat'),
    _ = require('underscore');

module.exports = SkeletonKing = Combat.extend({

    /**
     * First of its kind, the Skeleton King will spawn 4 minions.
     * Two sorcerers on (x + 1, y + 1) & (x - 1, y + 1)
     *
     * And two death knights on (x + 1, y - 1) & (x - 1, y - 1)
     */

    init: function(character) {
        var self = this;

        self._super(character);

        character.spawnDistance = 12;

        self.lastSpawn = 0;

        self.minions = [];

        character.onDeath(function() {
            _.each(self.minions, function(minion) {

                self.world.handleDeath(minion, true);

                self.lastSpawn = 0;

            });
        });
    },

    hit: function(character, target, hitInfo) {
        var self = this;

        if (!self.canSpawn())
            self._super(character, target, hitInfo);
        else
            self.spawnMinions();
    },

    spawnMinions: function() {
        var self = this,
            x = self.character.x,
            y = self.character.y;

        self.lastSpawn = new Date().getTime();

        if (!self.colliding(x + 2, y - 2))
            self.minions.push(self.world.spawnMob(17, x + 2, y + 2));

        if (!self.colliding(x - 2, y - 2))
            self.minions.push(self.world.spawnMob(17, x - 2, y + 2));

        if (!self.colliding(x + 1, y + 1))
            self.minions.push(self.world.spawnMob(11, x + 1, y - 1));

        if (!self.colliding(x - 1, y + 1))
            self.minions.push(self.world.spawnMob(11, x - 1, y - 1));

        _.each(self.minions, function(minion) {
            minion.onDeath(function() {
                if (self.isLast())
                    self.lastSpawn = new Date().getTime();

                self.minions.splice(self.minions.indexOf(minion), 1);
            });

            if (self.character.hasTarget())
                minion.combat.begin(self.character.target);
        });
    },

    hasMinions: function() {
        return this.minions.length > 0;
    },

    isLast: function() {
        return this.minions.length === 1;
    },

    canSpawn: function() {
        return (new Date().getTime() - this.lastSpawn > 25000) && !this.hasMinions();
    }

});