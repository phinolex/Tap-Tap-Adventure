var cls = require("../../../../../lib/class");

module.exports = Profession = cls.Class.extend({
  init(player) {
    var self = this;

    self.id = -1;
    self.name = null;

    self.level = -1;
    self.maxLevel = -1;
    self.experience = -1;
  },

  load(id, name, level, maxLevel) {
    var self = this;

    self.id = id;
    self.name = name;
    self.level = level;
    self.maxLevel = maxLevel;
  }
});
