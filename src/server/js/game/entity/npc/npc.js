var Entity = require("../entity");

module.exports = NPC = Entity.extend({
  constructor(id, instance, x, y) {
    

    this.super(id, "npc", instance, x, y);

    this.talkIndex = 0;
  },

  talk(messages) {
    

    if (this.talkIndex > messages.length) this.talkIndex = 0;

    this.talkIndex++;
  }
});
