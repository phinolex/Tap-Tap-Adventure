var Equipment = require("./equipment"),
  Items = require("../../../../../util/items");

module.exports = Boots = Equipment.extend({
  init(name, id, count, ability, abilityLevel) {
    var self = this;

    self._super(name, id, count, ability, abilityLevel);

    self.bootsLevel = Items.getBootsLevel(name);
  },

  getBaseAmplifier() {
    return 1.0 + this.bootsLevel / 200;
  }
});
