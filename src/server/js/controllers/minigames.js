var cls = require("../lib/class"),
  TeamWar = require("../minigames/impl/teamwar");

module.exports = Minigames = cls.Class.extend({
  init(world) {
    var self = this;

    self.world = world;
    self.minigames = {};

    self.load();
  },

  load() {
    var self = this;

    self.minigames["TeamWar"] = new TeamWar();
  },

  getTeamWar() {
    return this.minigames["TeamWar"];
  }
});
