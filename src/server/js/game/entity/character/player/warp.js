var cls = require("../../../../lib/class"),
  Modules = require("../../../../util/modules"),
  Utils = require("../../../../util/utils");

module.exports = Warp = cls.Class.extend({
  init(player) {
    var self = this;

    this.player = player;

    this.lastWarp = 0;
    this.warpTimeout = 300000;
  },

  warp(id) {
    var self = this;

    if (!this.canWarp()) {
      this.player.notify(
        "You must wait another " + this.getDuration() + " to warp."
      );
      return;
    }

    var data = Modules.Warps[id];

    if (!data) return;

    var name = data[0],
      x = data[3] ? data[1] + Utils.randomInt(0, 1) : data[1],
      y = data[3] ? data[2] + Utils.randomInt(0, 1) : data[2],
      levelRequirement = data[4];

    if (this.player.level < levelRequirement) {
      this.player.notify(
        "You must be at least level " + levelRequirement + " to warp here!"
      );
      return;
    }

    this.player.teleport(x, y, false, true);

    this.player.notify("You have been warped to " + name);

    this.lastWarp = new Date().getTime();
  },

  setLastWarp(lastWarp) {
    var self = this;

    if (isNaN(lastWarp)) {
      this.lastWarp = 0;
      this.player.save();
    } else this.lastWarp = lastWarp;
  },

  canWarp() {
    return this.getDifference() > this.warpTimeout || this.player.rights > 1;
  },

  getDuration() {
    var self = this,
      difference = this.warpTimeout - this.getDifference();

    if (!difference) return "5 minutes";

    return difference > 60000
      ? Math.ceil(difference / 60000) + " minutes"
      : Math.floor(difference / 1000) + " seconds";
  },

  getDifference() {
    return new Date().getTime() - this.lastWarp;
  }
});
