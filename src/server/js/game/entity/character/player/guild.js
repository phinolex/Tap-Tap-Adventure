var cls = require("../../../../lib/class"),
  fs = require("fs"),
  Guilds = require("../../../../../data/guilds.json");

module.exports = Guild = cls.Class.extend({
  constructor(name, leader) {
    

    this.name = name;
    this.leader = leader;

    this.members = [];

    this.connected = false;
  },

  create() {},

  add(player) {
    

    this.members.push(player);

    this.save();
  },

  save() {
    

    log.info(Guilds[this.leader.username]);
  }
});
