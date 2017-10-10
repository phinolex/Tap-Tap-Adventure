var cls = require('../../../../lib/class'),
    Data = require('../../../../../data/achievements.json'),
    Messages = require('../../../../network/messages'),
    Packets = require('../../../../network/packets'),
    Modules = require('../../../../util/modules');

module.exports = Achievement = cls.Class.extend({

    /**
     * TODO: Change the conditionals to use Modules to clarify what is done where.
     */

    init: function(id, player) {
        var self = this;

        self.id = id;
        self.player = player;

        self.progress = 0;

        self.data = Data[self.id];

        self.name = self.data.name;
        self.description = self.data.description;

        self.discovered = false;

    },

    step: function() {
        var self = this;

        if (self.isThreshold())
            return;

        self.progress++;

        self.update();

        self.player.send(new Messages.Quest(Packets.QuestOpcode.Progress, {
            id: self.id,
            name: self.name,
            progress: self.progress - 1,
            count: self.data.count,
            isQuest: false
        }))
    },

    converse: function(npc) {
        var self = this;

        if (self.isThreshold() || self.hasItem())
            self.finish(npc);
        else {
            npc.talk(self.data.text);

            self.player.send(new Messages.NPC(Packets.NPCOpcode.Talk, {
                id: npc.instance,
                text: self.data.text
            }));

            if (!self.isStarted() && npc.talkIndex > self.data.text.length)
                self.step();
        }
    },

    finish: function(npc) {
        var self = this,
            rewardType = self.data.rewardType;

        switch (rewardType) {
            case Modules.Achievements.Rewards.Item:

                if (!self.player.inventory.hasSpace()) {
                    self.player.notify('You do not have enough space in your inventory to finish this achievement.');
                    return;
                }

                self.player.inventory.add({
                    id: self.data.item,
                    count: self.data.itemCount
                });

                break;

            case Modules.Achievements.Rewards.Experience:

                self.player.addExperience(self.data.reward);

                break;
        }

        self.setProgress(9999);
        self.update();

        self.player.send(new Messages.Quest(Packets.QuestOpcode.Finish, {
            id: self.id,
            name: self.name,
            isQuest: false
        }));

        if (npc && self.player.npcTalkCallback)
            self.player.npcTalkCallback(npc);
    },

    update: function() {
        this.player.save();
    },

    isThreshold: function() {
        return this.progress === this.data.count;
    },

    hasItem: function() {
        var self = this;

        if (self.data.type === Modules.Achievements.Type.Scavenge && self.player.inventory.contains(self.data.item)) {
            self.player.inventory.remove(self.data.item, self.data.itemCount);

            return true;
        }

        return false
    },

    setProgress: function(progress) {
        this.progress = progress;
    },

    isStarted: function() {
        return this.progress > 0;
    },

    isFinished: function() {
        return this.progress > 9998;
    },

    getInfo: function() {
        return {
            id: this.id,
            name: this.name,
            type: this.data.type,
            description: this.description,
            count: this.data.count ? this.data.count : 1,
            progress: this.progress,
            finished: this.isFinished()
        }
    }

});