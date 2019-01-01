var Points = require("./points");

module.exports = HitPoints = Points.extend({
  init(hitPoints, maxHitPoints) {
    var self = this;

    this._super(hitPoints, maxHitPoints);
  },

  setHitPoints(hitPoints) {
    var self = this;

    this.setPoints(hitPoints);

    if (this.hitPointsCallback) this.hitPointsCallback();
  },

  setMaxHitPoints(maxHitPoints) {
    var self = this;

    this.setMaxPoints(maxHitPoints);

    if (this.maxHitPointsCallback) this.maxHitPointsCallback();
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
