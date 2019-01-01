var cls = require("../../../../lib/class"),
  fs = require("fs"),
  Guilds = require("../../../../../data/guilds.json");

module.exports = Guild = cls.Class.extend({
  init(name, leader) {
    var self = this;

    this.name = name;
    this.leader = leader;

    this.members = [];

    this.connected = false;
  },

  create() {},

  add(player) {
    var self = this;

    this.members.push(player);

    this.save();
  },

  save() {
    var self = this;

    log.info(Guilds[this.leader.username]);
  }
});
