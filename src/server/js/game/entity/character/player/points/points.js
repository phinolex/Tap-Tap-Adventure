var cls = require("../../../../../lib/class");

module.exports = Points = cls.Class.extend({
  init(points, maxPoints) {
    var self = this;

    this.points = points;
    this.maxPoints = maxPoints;
  },

  heal(amount) {
    var self = this;

    this.setPoints(this.points + amount);

    if (this.healCallback) this.healCallback();
  },

  increment(amount) {
    this.points += amount;
  },

  decrement(amount) {
    this.points -= amount;
  },

  setPoints(points) {
    var self = this;

    this.points = points;

    if (this.points > this.maxPoints) this.points = this.maxPoints;
  },

  setMaxPoints(maxPoints) {
    this.maxPoints = maxPoints;
  },

  getData() {
    return [this.points, this.maxPoints];
  },

  onHeal(callback) {
    this.healCallback = callback;
  }
});
