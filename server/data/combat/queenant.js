var Combat = require('../../js/game/entity/character/combat/combat'),
    Packets = require('../../js/network/packets'),
    Messages = require('../../js/network/messages'),
    Utils = require('../../js/util/utils'),
    _ = require('underscore');

module.exports = QueenAnt = Combat.extend({

    /**
     * This is where bosses start to get a bit more complex.
     * The queen ant will do an AoE attack after staggering for five seconds,
     * indicating to the players. If players are caught up in this, the terror
     * explosion sprite is drawn above them.
     */

    init: function(character) {
        var self = this;

        self.character = character;

        character.spawnDistance = 14;

        self.aoeTimeout = null;

        self.lastAoE = 0;
        self.aoeRadius = 2;

        self.lastSpawn = 0;
        self.minions = [];
        self.minionCount = 3;

        self.character.spawnDistance = 8;

        self.frozen = false;

        self.onNoAttackers(function() {

            self.resetAoE();

        });

        self.character.onDeath(function() {

            /**
             * This is to prevent the boss from dealing
             * any powerful AoE attack after dying.
             */

            self.lastSpawn = 0;

            if (self.aoeTimeout) {
                clearTimeout(self.aoeTimeout);
                self.aoeTimeout = null;
            }

            var listCopy = self.minions.slice();

            for (var i = 0; i < listCopy.length; i++)
                self.world.kill(listCopy[i]);

        });

    },

    begin: function(attacker) {
        var self = this;

        self.resetAoE();

        self._super(attacker);
    },

    hit: function(attacker, target, hitInfo) {
        var self = this;

        if (self.frozen)
            return;

        if (self.isAttacked())
            self.beginMinionAttack();

        if (self.canCastAoE()) {
            self.dealAoE();
            return;
        }

        self._super(attacker, target, hitInfo);
    },

    dealAoE: function() {
        var self = this;

        self.pushFreeze(true);

        self.stop();

        self.aoeTimeout = setTimeout(function() {

            self._super(self.aoeRadius, true);

            self.resetAoE();

            self.pushFreeze(false);

            if (self.character.hasTarget())
                self.begin(self.character.target);

        }, 5000);

    },

    spawnMinions: function() {
        var self = this;

        self.lastMinions = new Date().getTime();

        for (var i = 0; i < self.minionCount; i++)
            self.minions.push(self.world.spawnMob(13, self.character.x, self.character.y));

        _.each(self.minions, function(minion) {
            minion.onDeath(function() {

                if (self.isLast())
                    self.lastSpawn = new Date().getTime();

                self.minions.splice(self.minions.indexOf(minion), 1);

            });

            if (self.isAttacked())
                self.beginMinionAttack();

        });
    },

    beginMinionAttack: function() {
        var self = this;

        if (!self.hasMinions())
            return;

        _.each(self.minions, function(minion) {
            var randomTarget = self.getRandomTarget();

            if (!minion.hasTarget() && randomTarget)
                minion.combat.begin(randomTarget);

        });
    },

    resetAoE: function() {
        this.lastAoE = new Date().getTime();
    },

    getRandomTarget: function() {
        var self = this;

        if (self.isAttacked()) {
            var keys = Object.keys(self.attackers),
                randomAttacker = self.attackers[keys[Utils.randomInt(0, keys.length)]];

            if (randomAttacker)
                return randomAttacker;
        }

        if (self.character.hasTarget())
            return self.character.target;

        return null;
    },

    pushFreeze: function(state) {
        var self = this;

        self.character.frozen = state;
        self.character.stunned = state;

        self.world.pushToAdjacentGroups(self.character.group, new Messages.Movement(Packets.MovementOpcode, [self.character.instance, state]));
    },

    isLast: function() {
        return this.minions.length === 1;
    },

    hasMinions: function() {
        return this.minions.length > 0;
    },

    canCastAoE: function() {
        return new Date().getTime() - this.lastAoE > 30000;
    },

    canSpawn: function() {
        return new Date().getTime() - this.lastMinions > 45000 && !this.hasMinions() && this.isAttacked();
    }

});