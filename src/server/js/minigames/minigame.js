var cls = require("../lib/class");

module.exports = Minigame = cls.Class.extend({
  constructor(id, name) {
    

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
