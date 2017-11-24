/* global log */

var cls = require('../../../../lib/class'),
    _ = require('underscore'),
    Messages = require('../../../../network/messages'),
    Packets = require('../../../../network/packets'),
    Npcs = require('../../../../util/npcs'),
    Formulas = require('../../../formulas'),
    Modules = require('../../../../util/modules');

module.exports = Handler = cls.Class.extend({

    init: function(player) {
        var self = this;

        self.player = player;
        self.world = player.world;

        self.load();
    },

    load: function() {
        var self = this;

        self.player.onMovement(function(x, y) {

            self.player.checkGroups();

            self.detectAggro();
            self.detectPVP(x, y);
            self.detectMusic(x, y);

        });

        self.player.onDeath(function() {


        });

        self.player.onHit(function(attacker, damage) {

            /**
             * Handles actions whenever the player
             * instance is hit by 'damage' amount
             */

            if (self.player.combat.isRetaliating())
                self.player.combat.begin(attacker);

        });

        self.player.onDamage(function(target, hitInfo) {

            /**
             *  Verifies certain things every time the
             *  player instance hits a target.
             */

            if (self.player.hasBreakableWeapon() && Formulas.getWeaponBreak(self.player, target))
                self.player.breakWeapon();

            if (hitInfo.type === Modules.Hits.Stun) {

                target.setStun(true);

                if (target.stunTimeout)
                    clearTimeout(target.stunTimeout);

                target.stunTimeout = setTimeout(function() {

                    target.setStun(false);

                }, 3000);
            }

        });

        self.player.onKill(function(character) {

            if (self.player.quests.isAchievementMob(character)) {
                var achievement = self.player.quests.getAchievementByMob(character);

                if (achievement && achievement.isStarted())
                    self.player.quests.getAchievementByMob(character).step();
            }
        });

        self.player.onGroup(function() {
            self.world.handleEntityGroup(self.player);
            self.world.pushEntities(self.player);
        });

        self.player.connection.onClose(function() {
            self.player.stopHealing();

            self.world.removePlayer(self.player);
        });

        self.player.onTalkToNPC(function(npc) {

            if (self.player.quests.isQuestNPC(npc)) {
                self.player.quests.getQuestByNPC(npc).triggerTalk(npc);

                return;
            }

            if (self.player.quests.isAchievementNPC(npc)) {
                self.player.quests.getAchievementByNPC(npc).converse(npc);

                return;
            }

            switch(Npcs.getType(npc.id)) {
                case 'banker':
                    self.player.send(new Messages.NPC(Packets.NPCOpcode.Bank, {}));
                    return;

                case 'echanter':
                    self.player.send(new Messages.NPC(Packets.NPCOpcode.Enchant, {}));
                    break;
            }

            var text = Npcs.getText(npc.id);

            if (!text)
                return;

            npc.talk(text);

            self.player.send(new Messages.NPC(Packets.NPCOpcode.Talk, {
                id: npc.instance,
                text: text
            }));

        });
    },

    detectAggro: function() {
        var self = this,
            group = self.world.groups[self.player.group];

        if (!group)
            return;

        _.each(group.entities, function(entity) {
            if (entity && entity.type === 'mob') {
                var aggro = entity.canAggro(self.player);

                if (aggro)
                    entity.combat.begin(self.player);
            }
        });
    },

    detectMusic: function(x, y) {
        var self = this,
            musicArea = _.find(self.world.getMusicAreas(), function(area) { return area.contains(x, y); }),
            a2;

        if (musicArea && self.player.currentSong !== musicArea.id)
            self.player.updateMusic(musicArea.id);
    },

    detectPVP: function(x, y) {
        var self = this,
            pvpArea = _.find(self.world.getPVPAreas(), function(area) { return area.contains(x, y); });

        self.player.updatePVP(!!pvpArea);
    }

});