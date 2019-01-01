var cls = require("../../../../../../lib/class"),
  Abilities = require("../../../../../../util/abilities");

module.exports = Ability = cls.Class.extend({
  init(name, type) {
    var self = this;

    this.name = name;
    this.type = type;
    this.level = -1;

    this.data = Abilities.Data[name];
  }
});
