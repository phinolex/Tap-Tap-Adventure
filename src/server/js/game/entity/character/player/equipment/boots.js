var Equipment = require("./equipment"),
  Items = require("../../../../../util/items");

module.exports = Boots = Equipment.extend({
  init(name, id, count, ability, abilityLevel) {
    var self = this;

    this._super(name, id, count, ability, abilityLevel);

    this.bootsLevel = Items.getBootsLevel(name);
  },

  getBaseAmplifier() {
    return 1.0 + this.bootsLevel / 200;
  }
});
