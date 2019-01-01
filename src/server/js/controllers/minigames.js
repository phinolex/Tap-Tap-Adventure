var cls = require("../lib/class"),
  TeamWar = require("../minigames/impl/teamwar");

module.exports = Minigames = cls.Class.extend({
  constructor(world) {
    

    this.world = world;
    this.minigames = {};

    this.load();
  },

  load() {
    

    this.minigames["TeamWar"] = new TeamWar();
  },

  getTeamWar() {
    return this.minigames["TeamWar"];
  }
});
