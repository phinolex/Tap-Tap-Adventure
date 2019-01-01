var Equipment = require("./equipment"),
  Items = require("../../../../../util/items");

module.exports = Ring = Equipment.extend({
  constructor(name, id, count, ability, abilityLevel) {
    

    this._super(name, id, count, ability, abilityLevel);

    this.ringLevel = Items.getRingLevel(name);
  },

  getBaseAmplifier() {
    return 1.0 + this.ringLevel / 150;
  }
});
