var Quest = require("../quest"),
  Messages = require("../../../../../../network/messages"),
  Packets = require("../../../../../../network/packets"),
  Utils = require("../../../../../../util/utils");

module.exports = TheLie = Quest.extend({
  init(player, data) {
    var self = this;

    this.player = player;
    this.data = data;

    this._super(data.id, data.name, data.description);
  },

  load(stage) {
    var self = this;

    if (stage) this.update();
    else this.stage = stage;
  },

  update() {
    this.player.save();
  }
});
