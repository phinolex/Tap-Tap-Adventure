/* global module, log */

var cls = require("../lib/class"),
  map = require("../../data/map/world_server.json"),
  Utils = require("../util/utils"),
  fs = require("fs"),
  _ = require("underscore"),
  config = require("../../config.json"),
  Groups = require("./groups"),
  Modules = require("../util/modules"),
  PVPAreas = require("./areas/pvpareas"),
  MusicAreas = require("./areas/musicareas"),
  ChestAreas = require("./areas/chestareas"),
  Grids = require("./grids");

module.exports = Map = cls.Class.extend({
  constructor(world) {
    

    this.world = world;
    this.ready = false;

    this.load();
    this.groups = new Groups(self);
    this.grids = new Grids(self);
  },

  load() {
    

    this.width = map.width;
    this.height = map.height;
    this.collisions = map.collisions;
    this.bossAreas = map.bossAreas;
    this.roamingAreas = map.roamingAreas;
    this.chestAreas = map.chestAreas;
    this.chests = map.chests;
    this.staticEntities = map.staticEntities;

    this.zoneWidth = 30;
    this.zoneHeight = 15;

    this.groupWidth = Math.floor(this.width / this.zoneWidth);
    this.groupHeight = Math.floor(this.height / this.zoneHeight);

    this.areas = {};

    this.loadAreas();
    this.loadCollisions();
    this.loadDoors();

    this.ready = true;
  },

  loadAreas() {
    

    /**
     * The structure for the new this.areas is as follows:
     *
     * this.areas = {
     *      pvpAreas = {
     *          allPvpAreas
     *      },
     *
     *      musicAreas = {
     *          allMusicAreas
     *      },
     *
     *      ...
     * }
     */

    this.areas["PVP"] = new PVPAreas();
    this.areas["Music"] = new MusicAreas();
    this.areas["Chests"] = new ChestAreas(this.world);
  },

  loadDoors() {
    

    this.doors = {};

    _.each(map.doors, function(door) {
      var orientation;

      switch (door.to) {
        case "u":
          orientation = Modules.Orientation.Up;
          break;

        case "d":
          orientation = Modules.Orientation.Down;
          break;

        case "l":
          orientation = Modules.Orientation.Left;
          break;

        case "r":
          orientation = Modules.Orientation.Right;
          break;
      }

      this.doors[this.gridPositionToIndex(door.x, door.y)] = {
        x: door.tx,
        y: door.ty,
        orientation: orientation,
        portal: door.p === 1,
        level: door.l,
        achievement: door.a,
        rank: door.r
      };
    });
  },

  isDoor(x, y) {
    return !!this.doors[this.gridPositionToIndex(x, y)];
  },

  getDoorDestination(x, y) {
    return this.doors[this.gridPositionToIndex(x, y)];
  },

  loadCollisions() {
    var self = this,
      location = "./server/data/map/collisions.json";

    this.grid = null;

    fs.exists(location, function(exists) {
      if (!exists || config.forceCollisions) {
        log.info("Generating the collision grid...");

        this.grid = [];

        var tileIndex = 0;

        for (var i = 0; i < this.height; i++) {
          this.grid[i] = [];
          for (var j = 0; j < this.width; j++) {
            if (_.include(this.collisions, tileIndex)) this.grid[i][j] = 1;
            else this.grid[i][j] = 0;

            tileIndex += 1;
          }
        }

        fs.writeFile(location, JSON.stringify(this.grid), function(err) {
          if (err) {
            log.info("An error has occurred: " + err);
            return;
          }

          log.info("The collision grid has been successfully generated!");

          this.done();
        });
      } else {
        this.grid = require("../../data/map/collisions.json");

        this.done();
      }
    });
  },

  isValidPosition(x, y) {
    return (
      isInt(x) &&
      isInt(y) &&
      !this.isOutOfBounds(x, y) &&
      !this.isColliding(x, y)
    );
  },

  isOutOfBounds(x, y) {
    return x < 0 || x >= this.width || y < 0 || y >= this.height;
  },

  isColliding(x, y) {
    

    if (this.isOutOfBounds(x, y)) return false;

    return this.grid[y][x] === 1;
  },

  indexToGridPosition(tileIndex) {
    

    tileIndex -= 1;

    var x = this.getX(tileIndex + 1, this.width),
      y = Math.floor(tileIndex / this.width);

    return {
      x: x,
      y: y
    };
  },

  gridPositionToIndex(x, y) {
    return y * this.width + x + 1;
  },

  getX(index, width) {
    if (index === 0) return 0;

    return index % width === 0 ? width - 1 : (index % width) - 1;
  },

  getRandomPosition(area) {
    var self = this,
      pos = {},
      valid = false;

    while (!valid) {
      pos.x = area.x + Utils.randomInt(0, area.width + 1);
      pos.y = area.y + Utils.randomInt(0, area.height + 1);
      valid = this.isValidPosition(pos.x, pos.y);
    }

    return pos;
  },

  inArea(posX, posY, x, y, width, height) {
    return posX >= x && posY >= y && posX <= width + x && posY <= height + y;
  },

  inTutorialArea(entity) {
    if (entity.x === -1 || entity.y === -1) return true;

    return (
      this.inArea(entity.x, entity.y, 13, 553, 7, 7) ||
      this.inArea(entity.x, entity.y, 15, 13, 11, 12)
    );
  },

  done() {
    if (this.readyCallback) this.readyCallback();
  },

  isReady(callback) {
    this.readyCallback = callback;
  }
});
