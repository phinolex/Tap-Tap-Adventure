var Quest = require('../quest'),
    Messages = require('../../../../../../network/messages'),
    Packets = require('../../../../../../network/packets');

module.exports = BulkySituation = Quest.extend({

    init: function(player, data) {
        var self = this;

        self.player = player;
        self.data = data;

        self.lastNPC = null;

        self._super(player, data);
    },

    load: function(stage) {
        var self = this;

        if (!stage)
            self.update();
        else
            self.stage = stage;

        self.loadCallbacks();
    },

    loadCallbacks: function() {
        var self = this;

        if (self.stage > 9999)
            return;

        self.onNPCTalk(function(npc) {

            if (self.hasRequirement()) {
                self.progress('item');
                return;
            }

            var conversation = self.getConversation(npc.id);

            self.player.send(new Messages.NPC(Packets.NPCOpcode.Talk, {
                id: npc.instance,
                text: conversation
            }));

            self.lastNPC = npc;

            npc.talk(conversation);

            if (npc.talkIndex > conversation.length)
                self.progress('talk');

        });

    },

    progress: function(type) {
        var self = this,
            task = self.data.task[self.stage];

        if (!task || task !== type)
            return;

        if (self.stage === self.data.stages) {
            self.finish();
            return;
        }

        switch (type) {
            case 'item':

                self.player.inventory.remove(self.getItem(), 1);

                break;
        }

        self.resetTalkIndex(self.lastNPC);

        self.stage++;

        self.player.send(new Messages.Quest(Packets.QuestOpcode.Progress, {
            id: self.id,
            stage: self.stage,
            isQuest: true
        }));
    },

    finish: function() {
        this._super();
    },

    hasRequirement: function() {
        return this.getTask() === 'item' && this.player.inventory.contains(this.getItem());
    }

});