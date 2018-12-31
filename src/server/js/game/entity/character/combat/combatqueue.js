var cls = require("../../../../lib/class");

/**
 * Author: Tachyon
 * Company: uDeva 2017
 */

module.exports = CombatQueue = cls.Class.extend({
  constructor() {
    var self = this;

    self.hitQueue = [];
  },

  add(hit) {
    this.hitQueue.push(hit);
  },

  hasQueue() {
    return this.hitQueue.length > 0;
  },

  clear() {
    this.hitQueue = [];
  },

  getHit() {
    var self = this;

    if (self.hitQueue.length < 1) return;

    var hit = self.hitQueue.shift();

    return hit.getData();
  }
});
