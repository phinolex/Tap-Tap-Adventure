var Points = require("./points");

module.exports = HitPoints = Points.extend({
  init(hitPoints, maxHitPoints) {
    var self = this;

    self._super(hitPoints, maxHitPoints);
  },

  setHitPoints(hitPoints) {
    var self = this;

    self.setPoints(hitPoints);

    if (self.hitPointsCallback) self.hitPointsCallback();
  },

  setMaxHitPoints(maxHitPoints) {
    var self = this;

    self.setMaxPoints(maxHitPoints);

    if (self.maxHitPointsCallback) self.maxHitPointsCallback();
  },

  getHitPoints() {
    return this.points;
  },

  getMaxHitPoints() {
    return this.maxPoints;
  },

  onHitPoints(callback) {
    this.hitPointsCallback = callback;
  },

  onMaxHitPoints(callback) {
    this.maxHitPointsCallback = callback;
  }
});
