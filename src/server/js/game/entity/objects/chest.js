var Entity = require("../entity"),
  Utils = require("../../../util/utils");

module.exports = Chest = Entity.extend({
  init(id, instance, x, y) {
    var self = this;

    self._super(id, "chest", instance, x, y);

    self.respawnDuration = 25000; //Every 25 seconds
    self.static = false;

    self.items = [];
  },

  openChest() {
    var self = this;

    if (self.openCallback) self.openCallback();
  },

  respawn() {
    var self = this;

    setTimeout(function() {
      if (self.respawnCallback) self.respawnCallback();
    }, self.respawnDuration);
  },

  getItem() {
    var self = this,
      random = Utils.randomInt(0, self.items.length - 1),
      item = self.items[random];

    if (!item) return;

    return item;
  },

  onOpen(callback) {
    this.openCallback = callback;
  },

  onRespawn(callback) {
    this.respawnCallback = callback;
  }
});
