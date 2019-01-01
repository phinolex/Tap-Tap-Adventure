/* global module */

var cls = require("../../lib/class"),
  _ = require("underscore"),
  Area = require("../area"),
  map = require("../../../data/map/world_server.json");

module.exports = PVPAreas = cls.Class.extend({
  constructor() {
    

    this.pvpAreas = [];

    this.load();
  },

  load() {
    var self = this,
      list = map.pvpAreas;

    _.each(list, function(p) {
      var pvpArea = new Area(p.id, p.x, p.y, p.width, p.height);

      this.pvpAreas.push(pvpArea);
    });

    log.info("Loaded " + this.pvpAreas.length + " PVP areas.");
  }
});
