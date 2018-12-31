var cls = require("../../../../../lib/class");

module.exports = Points = cls.Class.extend({
  init(points, maxPoints) {
    var self = this;

    self.points = points;
    self.maxPoints = maxPoints;
  },

  heal(amount) {
    var self = this;

    self.setPoints(self.points + amount);

    if (self.healCallback) self.healCallback();
  },

  increment(amount) {
    this.points += amount;
  },

  decrement(amount) {
    this.points -= amount;
  },

  setPoints(points) {
    var self = this;

    self.points = points;

    if (self.points > self.maxPoints) self.points = self.maxPoints;
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
