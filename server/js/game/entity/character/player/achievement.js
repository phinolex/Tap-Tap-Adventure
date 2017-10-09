var cls = require('../../../../lib/class'),
    Data = require('../../../../../data/achievements.json'),
    Messages = require('../../../../network/messages'),
    Packets = require('../../../../network/packets');

module.exports = Achievement = cls.Class.extend({

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

        if (self.progress === self.data.count)
            self.finish();
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

    finish: function() {
        var self = this;

        self.setProgress(9999);
        self.update();

        self.player.send(new Messages.Quest(Packets.QuestOpcode.Finish, {
            id: self.id,
            isQuest: false
        }));
    },

    update: function() {
        this.player.save();
    },

    setProgress: function(progress) {
        this.progress = progress;
    },

    isStarted: function() {
        return this.stage > 0;
    },

    isFinished: function() {
        return this.stage > 9998;
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