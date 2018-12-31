var Entity = require("../entity");

module.exports = NPC = Entity.extend({
  init(id, instance, x, y) {
    var self = this;

    self._super(id, "npc", instance, x, y);

    self.talkIndex = 0;
  },

  talk(messages) {
    var self = this;

    if (self.talkIndex > messages.length) self.talkIndex = 0;

    self.talkIndex++;
  }
});
