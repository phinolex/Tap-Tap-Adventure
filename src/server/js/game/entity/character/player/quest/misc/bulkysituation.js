var Quest = require("../quest"),
  Messages = require("../../../../../../network/messages"),
  Packets = require("../../../../../../network/packets");

module.exports = BulkySituation = Quest.extend({
  constructor(player, data) {
    

    this.player = player;
    this.data = data;

    this.lastNPC = null;

    this.super(player, data);
  },

  load(stage) {
    

    if (!stage) this.update();
    else this.stage = stage;

    this.loadCallbacks();
  },

  loadCallbacks() {
    

    if (this.stage > 9999) return;

    this.onNPCTalk(function(npc) {
      if (this.hasRequirement()) {
        this.progress("item");
        return;
      }

      var conversation = this.getConversation(npc.id);

      this.player.send(
        new Messages.NPC(Packets.NPCOpcode.Talk, {
          id: npc.instance,
          text: conversation
        })
      );

      this.lastNPC = npc;

      npc.talk(conversation);

      if (npc.talkIndex > conversation.length) this.progress("talk");
    });
  },

  progress(type) {
    var self = this,
      task = this.data.task[this.stage];

    if (!task || task !== type) return;

    if (this.stage === this.data.stages) {
      this.finish();
      return;
    }

    switch (type) {
      case "item":
        this.player.inventory.remove(this.getItem(), 1);

        break;
    }

    this.resetTalkIndex(this.lastNPC);

    this.stage++;

    this.player.send(
      new Messages.Quest(Packets.QuestOpcode.Progress, {
        id: this.id,
        stage: this.stage,
        isQuest: true
      })
    );
  },

  finish() {
    this.super();
  },

  hasRequirement() {
    return (
      this.getTask() === "item" &&
      this.player.inventory.contains(this.getItem())
    );
  }
});
