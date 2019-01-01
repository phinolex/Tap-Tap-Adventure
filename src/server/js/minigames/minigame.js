var cls = require("../lib/class");

module.exports = Minigame = cls.Class.extend({
  init(id, name) {
    var self = this;

    this.id = id;
    this.name = name;
  },

  getId() {
    return this.id;
  },

  getName() {
    return this.name;
  }
});
