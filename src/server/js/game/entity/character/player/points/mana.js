var Points = require("./points");

module.exports = Mana = Points.extend({
  constructor(mana, maxMana) {
    

    this.super(mana, maxMana);
  },

  getMana() {
    return this.points;
  },

  getMaxMana() {
    return this.maxPoints;
  },

  setMana(mana) {
    

    this.points = mana;

    if (this.manaCallback) this.manaCallback();
  },

  setMaxMana(maxMana) {
    

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
