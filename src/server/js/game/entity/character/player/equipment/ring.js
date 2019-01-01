var Equipment = require("./equipment"),
  Items = require("../../../../../util/items");

module.exports = Ring = Equipment.extend({
  init(name, id, count, ability, abilityLevel) {
    var self = this;

    this._super(name, id, count, ability, abilityLevel);

    this.ringLevel = Items.getRingLevel(name);
  },

  getBaseAmplifier() {
    return 1.0 + this.ringLevel / 150;
  }
});
