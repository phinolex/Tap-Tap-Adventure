var Quest = require('../quest'),
    Messages = require('../../../../../../network/messages'),
    Packets = require('../../../../../../network/packets');

module.exports = BulkySituation = Quest.extend({

    init: function(player, data) {
        var self = this;

        self.player = player;
        self.data = data;

        self.lastNPC = null;

        self._super(data.id, data.name, data.description);
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
        var self = this;

        if (!self.player.inventory.hasSpace()) {
            self.player.notify('You do not have enough space in your inventory.');
            self.player.notify('Please make room prior to finishing the quest.');

            return;
        }

        self.setStage(9999);

        self.player.inventory.add({ id: 202, count: 400 });
        self.player.send(new Messages.Quest(Packets.QuestOpcode.Finish, {
            id: self.id,
            isQuest: true
        }));
    },

    resetTalkIndex: function(npc) {
        var self = this;

        if (!npc)
            return;

        npc.talkIndex = 0;

        self.player.send(new Messages.NPC(Packets.NPCOpcode.Talk, {
            id: npc.instance,
            text: null
        }));
    },

    update: function() {
        this.player.save();
    },

    getTask: function() {
        return this.data.task[this.stage];
    },

    getConversation: function(id) {
        var self = this,
            conversation = self.data.conversations[id];

        if (!conversation || !conversation[self.stage])
            return [''];

        return conversation[self.stage];
    },

    getItem: function() {
        return this.data.itemReq[this.stage];
    },

    hasRequirement: function() {
        return this.getTask() === 'item' && this.player.inventory.contains(this.getItem());
    },

    hasNPC: function(id) {
        return this.data.npcs.indexOf(id) > -1;
    }

});