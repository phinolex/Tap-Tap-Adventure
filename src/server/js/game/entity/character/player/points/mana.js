var Points = require("./points");

module.exports = Mana = Points.extend({
  init(mana, maxMana) {
    var self = this;

    this._super(mana, maxMana);
  },

  getMana() {
    return this.points;
  },

  getMaxMana() {
    return this.maxPoints;
  },

  setMana(mana) {
    var self = this;

    this.points = mana;

    if (this.manaCallback) this.manaCallback();
  },

  setMaxMana(maxMana) {
    var self = this;

    this.maxPoints = maxMana;

    if (this.maxManaCallback) this.maxManaCallback();
  },

  onMana(callback) {
    this.manaCallback = callback;
  },

  onMaxMana(callback) {
    this.maxManaCallback = callback;
  }
});
