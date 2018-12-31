var cls = require("../../../../../lib/class"),
  Items = require("../../../../../util/items");

module.exports = Slot = cls.Class.extend({
  init(index) {
    var self = this;

    self.index = index;

    self.id = -1;
    self.count = -1;
    self.ability = -1;
    self.abilityLevel = -1;

    self.string = null;
  },

  load(id, count, ability, abilityLevel) {
    var self = this;

    self.id = parseInt(id);
    self.count = parseInt(count);
    self.ability = parseInt(ability);
    self.abilityLevel = parseInt(abilityLevel);

    self.string = Items.idToString(self.id);
    self.edible = Items.isEdible(self.id);
    self.equippable = Items.isEquippable(self.string);

    self.verify();
  },

  empty() {
    var self = this;

    self.id = -1;
    self.count = -1;
    self.ability = -1;
    self.abilityLevel = -1;

    self.string = null;
  },

  increment(amount) {
    var self = this;

    self.count += parseInt(amount);

    self.verify();
  },

  decrement(amount) {
    var self = this;

    self.count -= parseInt(amount);

    self.verify();
  },

  verify() {
    var self = this;

    if (isNaN(self.count)) self.count = 1;
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
