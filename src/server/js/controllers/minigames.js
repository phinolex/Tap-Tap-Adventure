var cls = require("../lib/class"),
  TeamWar = require("../minigames/impl/teamwar");

module.exports = Minigames = cls.Class.extend({
  init(world) {
    var self = this;

    this.world = world;
    this.minigames = {};

    this.load();
  },

  load() {
    var self = this;

    this.minigames["TeamWar"] = new TeamWar();
  },

  getTeamWar() {
    return this.minigames["TeamWar"];
  }
});
