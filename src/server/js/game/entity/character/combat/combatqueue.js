var cls = require("../../../../lib/class");

/**
 * Author: Tachyon
 * Company: uDeva 2017
 */

module.exports = CombatQueue = cls.Class.extend({
  constructor() {
    var self = this;

    this.hitQueue = [];
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

    if (this.hitQueue.length < 1) return;

    var hit = this.hitQueue.shift();

    return hit.getData();
  }
});
