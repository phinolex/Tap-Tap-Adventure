var cls = require("../../../../../../lib/class"),
  Abilities = require("../../../../../../util/abilities");

module.exports = Ability = cls.Class.extend({
  constructor(name, type) {
    

    this.name = name;
    this.type = type;
    this.level = -1;

    this.data = Abilities.Data[name];
  }
});
