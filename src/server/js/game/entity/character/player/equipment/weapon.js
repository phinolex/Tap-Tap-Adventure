var Equipment = require("./equipment"),
  Items = require("../../../../../util/items");

module.exports = Weapon = Equipment.extend({
  init(name, id, count, ability, abilityLevel) {
    var self = this;

    self._super(name, id, count, ability, abilityLevel);

    self.level = Items.getWeaponLevel(name);
    self.ranged = Items.isArcherWeapon(name);
    self.breakable = false;
  },

  hasCritical() {
    return this.ability === 1;
  },

  hasExplosive() {
    return this.ability === 4;
  },

  hasStun() {
    return this.ability === 5;
  },

  isRanged() {
    return this.ranged;
  },

  setLevel(level) {
    this.level = level;
  },

  getLevel() {
    return this.level;
  }
});
