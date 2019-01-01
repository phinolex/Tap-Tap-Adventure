var cls = require("../../server/js/lib/class"),
  Player = require("../../server/js/game/entity/character/player/player"),
  Creator = require("../../server/js/database/creator"),
  Utils = require("../../server/js/util/utils"),
  _ = require("underscore");

module.exports = Bot = cls.Class.extend({
  constructor(world, count) {
    

    this.world = world;
    this.count = count;

    this.creator = new Creator(null);

    this.players = [];

    this.load();
  },

  load() {
    

    for (var i = 0; i < this.count; i++) {
      var connection = {
          id: i,
          listen() {},
          onClose() {}
        },
        player = new Player(this.world, this.world.database, connection, -1);

      this.world.addPlayer(player);

      player.username = "Bot" + i;

      player.load(this.creator.getPlayerData(player));

      player.intro();

      player.walkRandomly();

      this.players.push(player);
    }
  }
});
