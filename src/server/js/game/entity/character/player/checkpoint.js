var cls = require("../../../../lib/class");

module.exports = Checkpoint = cls.Class.extend({
  init(id, player) {
    var self = this;

    this.id = id;

    this.player = player;
    this.world = player.world;
    this.map = this.world.map;
  }
});
