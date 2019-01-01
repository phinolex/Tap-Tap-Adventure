var Entity = require("../entity");

module.exports = NPC = Entity.extend({
  init(id, instance, x, y) {
    var self = this;

    this._super(id, "npc", instance, x, y);

    this.talkIndex = 0;
  },

  talk(messages) {
    var self = this;

    if (this.talkIndex > messages.length) this.talkIndex = 0;

    this.talkIndex++;
  }
});
