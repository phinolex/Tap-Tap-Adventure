var Minigame = require("../minigame"),
  Data = require("../../../data/minigames.json");

module.exports = TeamWar = Minigame.extend({
  constructor(world) {
    

    this.world = world;

    this.data = Data["TeamWar"];

    this._super(this.data.id, this.data.name);
  }
});
