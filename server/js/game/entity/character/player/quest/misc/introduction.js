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

        self._super(data.id, data.name, data.description);

        self.loadCallbacks();
    },

    load: function(stage) {
        var self = this;

        if (!stage)
            self.update();
        else
            self.stage = stage;

        if (self.finishedCallback)
            self.finishedCallback();
    },

    loadCallbacks: function() {
        var self = this;

        self.onFinishedLoading(function() {
            if (self.stage > 9999)
                return;

            if (self.stage < 10)
                self.toggleChat();
        });

        self.onNPCTalk(function(npc) {

            var conversation = self.getConversation(npc.id);

            if (!conversation)
                return;

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

            if (!self.verifyDoor(destX, destY))
                self.player.notify('You are not supposed to go through here.');
            else
                self.progress('door');
        });

        self.player.onProfile(function() {
            if (self.player.profileDialogOpen)
                self.progress('click');

        });

    },

    progress: function(type) {
        var self = this,
            task = self.data.task[self.stage];

        if (!task || task !== type)
            return;

        switch (type) {
            case 'talk':

                break;

            case 'click':

                if (self.stage === 1)
                    self.forceTalk(self.lastNPC, ['Great job! This is your character menu.']);


                break;
        }


        self.stage++;
        self.clearPointers();
        self.resetTalkIndex(self.lastNPC);

        self.update();
        self.updatePointers();
    },

    update: function() {
        this.player.save();
    },

    updatePointers: function() {
        var self = this,
            pointer = self.data.pointers[self.stage];

        if (!pointer)
            return;

        var opcode = pointer[0],
            x = pointer[1],
            y = pointer[2];

        self.player.send(new Messages.Pointer(opcode, {
            id: Utils.generateRandomId(),
            x: x,
            y: y
        }));
    },

    clearPointers: function() {
        this.player.send(new Messages.Pointer(Packets.PointerOpcode.Remove, {}));
    },

    toggleChat: function() {
        this.player.canTalk = !this.player.canTalk;
    },

    getConversation: function(id) {
        var self = this,
            conversation = self.data.conversations[id];

        if (!conversation || !conversation[self.stage])
            return [''];

        var message = conversation[self.stage];

        if (self.stage === 3)
            message[0] += self.player.username;

        return message;
    },

    getTask: function() {
        return this.data.task[this.stage];
    },

    setStage: function(stage) {
        var self = this;

        self._super(stage);

        self.update();
        self.clearPointers();

    },

    finish: function() {
        var self = this;

        self.setStage(9999);
    },

    forceTalk: function(npc, message) {
        var self = this;

        /**
         * The message must be in an array format.
         */

        npc.talkIndex = 0;

        self.player.send(new Messages.NPC(Packets.NPCOpcode.Talk, {
            id: npc.instance,
            text: message
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

    hasNPC: function(id) {
        var self = this;

        for (var i = 0; i < self.data.npcs.length; i++)
            if (self.data.npcs[i] === id)
                return true;

        return false;
    },

    verifyDoor: function(destX, destY) {
        var self = this,
            doorData = self.data.doors[self.stage];

        return doorData[0] === destX && doorData[1] === destY;
    },

    onFinishedLoading: function(callback) {
        this.finishedCallback = callback;
    }

});