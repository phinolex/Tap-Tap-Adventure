var Combat = require('../combat'),
    Packets = require('../../../../../network/packets'),
    Messages = require('../../../../../network/messages');

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

        self.aoeTimeout = null;

        self.lastAoE = 0;
        self.aoeRadius = 2;

        self.lastSpawn = 0;
        self.minions = [];

        self.character.spawnDistance = 8;

        self.frozen = false;

        self.onDeath(function() {

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

    hit: function(attacker, target, hitInfo) {
        var self = this;

        if (self.frozen)
            return;

        if (self.canCastAoE()) {
            self.dealAoE();
            return;
        }

        self._super(attacker, target, hitInfo);
    },

    dealAoE: function() {
        var self = this;

        if (self.world)
            self.pushToGroup(self.character.group, new Messages.Movement(Packets.MovementOpcode.Freeze, [self.character.instance, true]))

        self.stop();

        self.aoeTimeout = setTimeout(function() {

            self._super(self.aoeRadius, true);

        }, 5000);

    },

    spawnMinions: function() {
        var self = this;

        self.lastMinions = new Date().getTime();


    },

    canCastAoE: function() {
        return new Date().getTime() - this.lastAoE > 30000;
    }

});