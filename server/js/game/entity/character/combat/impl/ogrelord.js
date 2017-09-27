var Combat = require('../combat'),
    Messages = require('../../../../../network/messages'),
    Packets = require('../../../../../network/packets'),
    Modules = require('../../../../../util/modules'),
    Utils = require('../../../../../util/utils'),
    _ = require('underscore');

module.exports = OgreLord = Combat.extend({

    init: function(character) {
        var self = this;

        self._super(character);

        self.character = character;

        self.dialogues = ['Get outta my swamp', 'No, not the onion.', 'My minions give me strength! You stand no chance!'];

        self.minions = [];

        self.lastSpawn = 0;

        character.projectile = Modules.Projectiles.Boulder;
        character.projectileName = 'projectile-boulder';

        self.load();

        character.onRefresh(function() {

            self.load();

        });

        character.onDeath(function() {

            clearInterval(self.talkingInterval);
            clearInterval(self.updateInterval);

            self.talkingInterval = null;
            self.updateInterval = null;

            _.each(self.minions, function(minion) {

                if (minion) {

                    minion.hitPoints = 0;

                    self.world.handleDeath(minion);

                    self.lastSpawn = 0;

                }

            });

        });
    },

    load: function() {
        var self = this;

        self.talkingInterval = setInterval(function() {

            if (self.character.hasTarget())
                self.forceTalk(self.getMessage());

        }, 9000);

        self.updateInterval = setInterval(function() {

            self.character.armourLevel += (self.minions.length * 5);

            if (self.canSpawn())
                self.spawnMinions();

        }, 2000);
    },

    hit: function(character, target, hitInfo) {
        var self = this,
            chance = Utils.randomInt(0, 15) === 4;

        if (chance) {
            hitInfo.isRanged = true;
            character.attackRange = 7;
        } else
            character.attackRange = 1;


        self._super(character, target, hitInfo);
    },

    forceTalk: function(message) {
        var self = this;

        if (!self.world)
            return;

        self.world.pushToAdjacentGroups(self.character.target.group, new Messages.NPC(Packets.NPCOpcode.Talk, {
            id: self.character.instance,
            text: message,
            nonNPC: true
        }));

    },

    getMessage: function() {
        return this.dialogues[Utils.randomInt(0, this.dialogues.length - 1)];
    },

    spawnMinions: function() {
        var self = this,
            xs = [414, 430, 414, 420, 430],
            ys = [172, 172, 183, 185, 180];

        log.info('Spawning..??');

        self.lastSpawn = new Date().getTime();

        self.forceTalk('Now you shall see my true power!');

        for (var i = 0; i < xs.length; i++)
            self.minions.push(self.world.spawnMob(12, xs[i], ys[i]));

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
        return (new Date().getTime() - this.lastSpawn > 50000) && !this.hasMinions() && this.character.hasTarget();
    }

});