/* global module, log */

var cls = require("../../lib/class"),
  _ = require("underscore"),
  map = require("../../../data/map/world_server.json"),
  Area = require("../area");

module.exports = MusicAreas = cls.Class.extend({
  constructor() {
    

    this.musicAreas = [];

    this.load();
  },

  load() {
    

    _.each(map.musicAreas, function(m) {
      var musicArea = new Area(m.id, m.x, m.y, m.width, m.height);

      this.musicAreas.push(musicArea);
    });

    log.info("Loaded " + this.musicAreas.length + " music areas.");
  }
});
