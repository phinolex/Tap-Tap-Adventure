var cls = require("../../../../../lib/class"),
  Items = require("../../../../../util/items");

module.exports = Slot = cls.Class.extend({
  constructor(index) {
    

    this.index = index;

    this.id = -1;
    this.count = -1;
    this.ability = -1;
    this.abilityLevel = -1;

    this.string = null;
  },

  load(id, count, ability, abilityLevel) {
    

    this.id = parseInt(id);
    this.count = parseInt(count);
    this.ability = parseInt(ability);
    this.abilityLevel = parseInt(abilityLevel);

    this.string = Items.idToString(this.id);
    this.edible = Items.isEdible(this.id);
    this.equippable = Items.isEquippable(this.string);

    this.verify();
  },

  empty() {
    

    this.id = -1;
    this.count = -1;
    this.ability = -1;
    this.abilityLevel = -1;

    this.string = null;
  },

  increment(amount) {
    

    this.count += parseInt(amount);

    this.verify();
  },

  decrement(amount) {
    

    this.count -= parseInt(amount);

    this.verify();
  },

  verify() {
    

    if (isNaN(this.count)) this.count = 1;
  },

  getData() {
    return {
      index: this.index,
      string: this.string,
      count: this.count,
      ability: this.ability,
      abilityLevel: this.abilityLevel
    };
  }
});
