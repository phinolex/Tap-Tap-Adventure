var Equipment = require("./equipment"),
  Items = require("../../../../../util/items");

module.exports = Pendant = Equipment.extend({
  init(name, id, count, ability, abilityLevel) {
    var self = this;

    self._super(name, id, count, ability, abilityLevel);

    self.pendantLevel = Items.getPendantLevel(name);
  },

  getBaseAmplifier() {
    return 1.0 + this.pendantLevel / 100;
  }
});
