var Equipment = require("./equipment"),
  Items = require("../../../../../util/items");

module.exports = Armour = Equipment.extend({
  constructor(name, id, count, ability, abilityLevel) {
    

    this.super(name, id, count, ability, abilityLevel);

    this.defense = Items.getArmourLevel(name);
  },

  hasAntiStun() {
    return this.ability === 6;
  },

  setDefense(defense) {
    this.defense = defense;
  },

  getDefense() {
    return this.defense;
  }
});
