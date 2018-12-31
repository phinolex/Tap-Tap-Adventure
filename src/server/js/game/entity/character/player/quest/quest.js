var cls = require("../../../../../lib/class"),
  Messages = require("../../../../../network/messages"),
  Packets = require("../../../../../network/packets"),
  Utils = require("../../../../../util/utils");

module.exports = Quest = cls.Class.extend({
  init(player, data) {
    var self = this;

    self.player = player;
    self.data = data;

    self.id = data.id;
    self.name = data.name;
    self.description = data.description;

    self.stage = 0;
  },

  finish() {
    var self = this;

    if (self.hasItemReward()) {
      var item = self.getItemReward();

      if (item) {
        if (self.hasInventorySpace(item.id, item.count))
          self.player.inventory.add(item.id, item.count);
        else {
          self.player.notify("You do not have enough space in your inventory.");
          self.player.notify("Please make room prior to finishing the quest.");

          return;
        }
      }
    }

    self.setStage(9999);

    self.player.send(
      new Messages.Quest(Packets.QuestOpcode.Finish, {
        id: self.id,
        isQuest: true
      })
    );
  },

  isFinished() {
    return this.stage >= 9999;
  },

  setStage(stage) {
    var self = this;

    self.stage = stage;
    self.update();
  },

  hasMob() {
    return false;
  },

  triggerTalk(npc) {
    var self = this;

    if (self.npcTalkCallback) self.npcTalkCallback(npc);
  },

  onNPCTalk(callback) {
    this.npcTalkCallback = callback;
  },

  hasNPC(id) {
    return this.data.npcs.indexOf(id) > -1;
  },

  update() {
    this.player.save();
  },

  updatePointers() {
    var self = this;

    if (!self.data.pointers) return;

    var pointer = self.data.pointers[self.stage];

    if (!pointer) return;

    var opcode = pointer[0],
      x = pointer[1],
      y = pointer[2];

    self.player.send(
      new Messages.Pointer(opcode, {
        id: Utils.generateRandomId(),
        x: x,
        y: y
      })
    );
  },

  forceTalk(npc, message) {
    var self = this;

    if (!npc) return;

    npc.talkIndex = 0;

    self.player.send(
      new Messages.NPC(Packets.NPCOpcode.Talk, {
        id: npc.instance,
        text: message
      })
    );
  },

  resetTalkIndex(npc) {
    var self = this;

    /**
     * Ensures that an NPC does not go off the conversation
     * index and is resetted in order to start a new chat
     */

    if (!npc) return;

    npc.talkIndex = 0;

    self.player.send(
      new Messages.NPC(Packets.NPCOpcode.Talk, {
        id: npc.instance,
        text: null
      })
    );
  },

  clearPointers() {
    this.player.send(new Messages.Pointer(Packets.PointerOpcode.Remove, {}));
  },

  getConversation(id) {
    var self = this,
      conversation = self.data.conversations[id];

    if (!conversation || !conversation[self.stage]) return [""];

    return conversation[self.stage];
  },

  hasItemReward() {
    return !!this.data.itemReward;
  },

  getTask() {
    return this.data.task[this.stage];
  },

  getId() {
    return this.id;
  },

  getName() {
    return this.name;
  },

  getDescription() {
    return this.description;
  },

  getStage() {
    return this.stage;
  },

  getItem() {
    return this.data.itemReq ? this.data.itemReq[this.stage] : null;
  },

  getItemReward() {
    return this.hasItemReward() ? this.data.itemReward : null;
  },

  hasInventorySpace(id, count) {
    return this.player.inventory.canHold(id, count);
  },

  getInfo() {
    return {
      id: this.getId(),
      name: this.getName(),
      description: this.getDescription(),
      stage: this.getStage(),
      finished: this.isFinished()
    };
  }
});
