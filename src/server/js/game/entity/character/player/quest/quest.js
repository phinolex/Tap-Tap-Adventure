var cls = require("../../../../../lib/class"),
  Messages = require("../../../../../network/messages"),
  Packets = require("../../../../../network/packets"),
  Utils = require("../../../../../util/utils");

module.exports = Quest = cls.Class.extend({
  constructor(player, data) {
    

    this.player = player;
    this.data = data;

    this.id = data.id;
    this.name = data.name;
    this.description = data.description;

    this.stage = 0;
  },

  finish() {
    

    if (this.hasItemReward()) {
      var item = this.getItemReward();

      if (item) {
        if (this.hasInventorySpace(item.id, item.count))
          this.player.inventory.add(item.id, item.count);
        else {
          this.player.notify("You do not have enough space in your inventory.");
          this.player.notify("Please make room prior to finishing the quest.");

          return;
        }
      }
    }

    this.setStage(9999);

    this.player.send(
      new Messages.Quest(Packets.QuestOpcode.Finish, {
        id: this.id,
        isQuest: true
      })
    );
  },

  isFinished() {
    return this.stage >= 9999;
  },

  setStage(stage) {
    

    this.stage = stage;
    this.update();
  },

  hasMob() {
    return false;
  },

  triggerTalk(npc) {
    

    if (this.npcTalkCallback) this.npcTalkCallback(npc);
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
    

    if (!this.data.pointers) return;

    var pointer = this.data.pointers[this.stage];

    if (!pointer) return;

    var opcode = pointer[0],
      x = pointer[1],
      y = pointer[2];

    this.player.send(
      new Messages.Pointer(opcode, {
        id: Utils.generateRandomId(),
        x: x,
        y: y
      })
    );
  },

  forceTalk(npc, message) {
    

    if (!npc) return;

    npc.talkIndex = 0;

    this.player.send(
      new Messages.NPC(Packets.NPCOpcode.Talk, {
        id: npc.instance,
        text: message
      })
    );
  },

  resetTalkIndex(npc) {
    

    /**
     * Ensures that an NPC does not go off the conversation
     * index and is resetted in order to start a new chat
     */

    if (!npc) return;

    npc.talkIndex = 0;

    this.player.send(
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
      conversation = this.data.conversations[id];

    if (!conversation || !conversation[this.stage]) return [""];

    return conversation[this.stage];
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
