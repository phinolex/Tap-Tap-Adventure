var cls = require("../lib/class");

module.exports = Minigame = cls.Class.extend({
  init(id, name) {
    var self = this;

    self.id = id;
    self.name = name;
  },

  getId() {
    return this.id;
  },

  getName() {
    return this.name;
  }
});
