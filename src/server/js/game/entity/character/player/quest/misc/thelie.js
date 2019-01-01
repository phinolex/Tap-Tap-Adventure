var Quest = require("../quest"),
  Messages = require("../../../../../../network/messages"),
  Packets = require("../../../../../../network/packets"),
  Utils = require("../../../../../../util/utils");

module.exports = TheLie = Quest.extend({
  constructor(player, data) {
    

    this.player = player;
    this.data = data;

    this.super(data.id, data.name, data.description);
  },

  load(stage) {
    

    if (stage) this.update();
    else this.stage = stage;
  },

  update() {
    this.player.save();
  }
});
