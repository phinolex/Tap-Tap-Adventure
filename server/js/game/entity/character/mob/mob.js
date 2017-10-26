var Character = require('../character'),
    Mobs = require('../../../../util/mobs'),
    _ = require('underscore'),
    Utils = require('../../../../util/utils'),
    Items = require('../../../../util/items');

module.exports = Mob = Character.extend({

    init: function(id, instance, x, y) {
        var self = this;

        self._super(id, 'mob', instance, x, y);

        if (!Mobs.exists(id))
            return;

        self.data = Mobs.Ids[self.id];
        self.hitPoints = self.data.hitPoints;
        self.maxHitPoints = self.data.hitPoints;
        self.drops = self.data.drops;

        self.respawnDelay = self.data.spawnDelay;

        self.level = self.data.level;

        self.armourLevel = self.data.armour;
        self.weaponLevel = self.data.weapon;
        self.attackRange = self.data.attackRange;
        self.aggroRange = self.data.aggroRange;
        self.aggressive = self.data.aggressive;

        self.spawnLocation = [x, y];

        self.dead = false;
        self.boss = false;
        self.static = false;

        self.projectileName = self.getProjectileName();
        
    },

    refresh: function() {
        var self = this;

        self.hitPoints = self.data.hitPoints;
        self.maxHitPoints = self.data.hitPoints;

        if (self.refreshCallback)
            self.refreshCallback();

    },

    getDrop: function() {
        var self = this;

        if (!self.drops)
            return null;

        var min = 0,
            percent = 0,
            random = Utils.randomInt(0, 1000);

        for (var drop in self.drops)
            if (self.drops.hasOwnProperty(drop)) {
                var chance = self.drops[drop];

                min = percent;
                percent += chance;

                if (random >= min && random < percent) {
                    var count = 1;

                    if (drop === 'gold')
                        count = Utils.randomInt(1, self.level * (Math.floor(Math.pow(2, self.level / 7) / (self.level / 4))));

                    return {
                        id: Items.stringToId(drop),
                        count: count
                    }
                }
            }

        return null;
    },

    getProjectileName: function() {
        return this.data.projectileName ? this.data.projectileName : 'projectile-pinearrow';
    },

    canAggro: function(player) {
        var self = this;

        if (self.hasTarget() || !self.aggressive || Math.floor(self.level * 1.5) < player.level)
            return false;

        return self.isNear(player, self.aggroRange);
    },

    destroy: function() {
        var self = this;

        self.dead = true;
        self.clearTarget();
        self.resetPosition();
        self.respawn();
    },

    return: function() {
        var self = this;

        self.clearTarget();
        self.resetPosition();
        self.move(self.x, self.y);
    },

    isRanged: function() {
        return this.attackRange > 1;
    },

    distanceToSpawn: function() {
        return this.getCoordDistance(this.spawnLocation[0], this.spawnLocation[1]);
    },

    isAtSpawn: function() {
        return this.x === this.spawnLocation[0] && this.y === this.spawnLocation[1];
    },

    respawn: function() {
        var self = this;

        if (!self.static)
            return;

        setTimeout(function() {
            if (self.respawnCallback)
                self.respawnCallback();

        }, self.respawnDelay);
    },

    getState: function() {
        var self = this,
            base = self._super();

        base.push(self.hitPoints, self.maxHitPoints, self.attackRange, self.level);

        return base;
    },

    resetPosition: function() {
        var self = this;

        self.setPosition(self.spawnLocation[0], self.spawnLocation[1]);
    },

    onRespawn: function(callback) {
        this.respawnCallback = callback;
    },

    onMove: function(callback) {
        this.moveCallback = callback;
    },

    onRefresh: function(callback) {
        this.refreshCallback = callback;
    },

    onDeath: function(callback) {
        this.deathCallback = callback;
    },

    move: function(x, y) {
        var self = this;

        self.setPosition(x, y);

        if (self.moveCallback)
            self.moveCallback(self);
    }

});