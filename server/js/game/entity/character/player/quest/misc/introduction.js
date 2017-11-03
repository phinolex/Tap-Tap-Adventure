var Quest = require('../quest'),
    Messages = require('../../../../../../network/messages'),
    Packets = require('../../../../../../network/packets'),
    Utils = require('../../../../../../util/utils');

module.exports = Introduction = Quest.extend({

    init: function(player, data) {
        var self = this;

        self.player = player;
        self.data = data;

        self.lastNPC = null;

        self._super(player, data);
    },

    load: function(stage) {
        var self = this;

        if (!self.player.inTutorial()) {
            self.setStage(9999);
            self.update();
            return;
        }

        if (!stage)
            self.update();
        else
            self.stage = stage;

        self.loadCallbacks();
    },

    loadCallbacks: function() {
        var self = this;

        if (self.stage >= 9999)
            return;

        self.updatePointers();
        self.toggleChat();

        self.onNPCTalk(function(npc) {

            var conversation = self.getConversation(npc.id);

            self.lastNPC = npc;

            npc.talk(conversation);

            self.player.send(new Messages.NPC(Packets.NPCOpcode.Talk, {
                id: npc.instance,
                text: conversation
            }));

            if (npc.talkIndex > conversation.length)
                self.progress('talk');
        });

        self.player.onReady(function() {

            self.updatePointers();

        });

        self.player.onDoor(function(destX, destY) {
            if (self.getTask() !== 'door') {
                self.player.notify('You cannot go through this door yet.');
                return;
            }

            if (!self.verifyDoor(self.player.x, self.player.y))
                self.player.notify('You are not supposed to go through here.');
            else {
                self.progress('door');
                self.player.teleport(destX, destY, false);
            }
        });

        self.player.onProfile(function(isOpen) {

            if (isOpen)
                self.progress('click');

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
            case 'talk':

                if (self.stage === 4)
                    self.player.inventory.add({
                        id: 248,
                        count: 1,
                        ability: -1,
                        abilityLevel: -1
                    });


                break;
        }


        self.stage++;
        self.clearPointers();
        self.resetTalkIndex(self.lastNPC);

        self.update();
        self.updatePointers();

        self.player.send(new Messages.Quest(Packets.QuestOpcode.Progress, {
            id: self.id,
            stage: self.stage,
            isQuest: true
        }));
    },

    isFinished: function() {
        return this._super() || !this.player.inTutorial();
    },

    toggleChat: function() {
        this.player.canTalk = !this.player.canTalk;
    },

    setStage: function(stage) {
        var self = this;

        self._super(stage);

        self.clearPointers();
    },

    finish: function() {
        var self = this;

        self.toggleChat();
        self._super();
    },

    verifyDoor: function(destX, destY) {
        var self = this,
            doorData = self.data.doors[self.stage];

        if (!doorData)
            return;

        return doorData[0] === destX && doorData[1] === destY;
    },

    onFinishedLoading: function(callback) {
        this.finishedCallback = callback;
    }

});