var Equipment = require("./equipment"),
  Items = require("../../../../../util/items");

module.exports = Pendant = Equipment.extend({
  constructor(name, id, count, ability, abilityLevel) {
    

    this._super(name, id, count, ability, abilityLevel);

    this.pendantLevel = Items.getPendantLevel(name);
  },

  getBaseAmplifier() {
    return 1.0 + this.pendantLevel / 100;
  }
});
