var Points = require("./points");

module.exports = HitPoints = Points.extend({
  constructor(hitPoints, maxHitPoints) {
    

    this._super(hitPoints, maxHitPoints);
  },

  setHitPoints(hitPoints) {
    

    this.setPoints(hitPoints);

    if (this.hitPointsCallback) this.hitPointsCallback();
  },

  setMaxHitPoints(maxHitPoints) {
    

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
