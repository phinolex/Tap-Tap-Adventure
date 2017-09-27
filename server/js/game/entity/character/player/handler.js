/* global log */

var cls = require('../../../../lib/class'),
    _ = require('underscore'),
    Messages = require('../../../../network/messages'),
    Packets = require('../../../../network/packets'),
    Npcs = require('../../../../util/npcs');

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
            self.detectPVP();
            self.detectMusic();
        });

        self.player.onDeath(function() {

        });

        self.player.onGroup(function() {
            self.world.handleEntityGroup(self.player);
            self.world.pushEntities(self.player);
        });

        self.player.connection.onClose(function() {
            self.world.removePlayer(self.player);
        });

        self.player.onTalkToNPC(function(npc) {

            if (self.player.quests.isQuestNPC(npc)) {
                self.player.quests.getQuestByNPC(npc).triggerTalk(npc);

                return;
            }

            switch(npc.id) {
                case 43:
                    self.player.send(new Messages.NPC(Packets.NPCOpcode.Bank, {}));
                    return;

                case 42:
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

    detectMusic: function() {
        var self = this,
            musicArea = _.detect(self.world.getMusicAreas(), function(area) { return area.contains(self.player.x, self.player.y); });

        if (musicArea && self.player.currentSong !== musicArea.id)
            self.player.updateMusic(musicArea.id);
    },

    detectPVP: function() {
        var self = this,
            pvpArea = _.detect(self.world.getPVPAreas(), function(area) { return area.contains(self.player.x, self.player.y); });

        self.player.updatePVP(pvpArea);
    }

});