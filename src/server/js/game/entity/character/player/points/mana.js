var Points = require("./points");

module.exports = Mana = Points.extend({
  init(mana, maxMana) {
    var self = this;

    self._super(mana, maxMana);
  },

  getMana() {
    return this.points;
  },

  getMaxMana() {
    return this.maxPoints;
  },

  setMana(mana) {
    var self = this;

    self.points = mana;

    if (self.manaCallback) self.manaCallback();
  },

  setMaxMana(maxMana) {
    var self = this;

    self.maxPoints = maxMana;

    if (self.maxManaCallback) self.maxManaCallback();
  },

  onMana(callback) {
    this.manaCallback = callback;
  },

  onMaxMana(callback) {
    this.maxManaCallback = callback;
  }
});
