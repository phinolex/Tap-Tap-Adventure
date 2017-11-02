/* global module, log */

var cls = require('../lib/class'),
    map = require('../../data/map/world_server.json'),
    Utils = require('../util/utils'),
    fs = require('fs'),
    _ = require('underscore'),
    config = require('../../config.json'),
    Groups = require('./groups'),
    Modules = require('../util/modules'),
    PVPAreas = require('./areas/pvpareas'),
    MusicAreas = require('./areas/musicareas'),
    ChestAreas = require('./areas/chestareas'),
    Grids = require('./grids');

module.exports = Map = cls.Class.extend({

    init: function(world) {

        var self = this;

        self.world = world;
        self.ready = false;

        self.load();
        self.groups = new Groups(self);
        self.grids = new Grids(self);
    },

    load: function() {
        var self = this;

        self.width = map.width;
        self.height = map.height;
        self.collisions = map.collisions;
        self.bossAreas = map.bossAreas;
        self.roamingAreas = map.roamingAreas;
        self.chestAreas = map.chestAreas;
        self.chests = map.chests;
        self.staticEntities = map.staticEntities;

        self.zoneWidth = 30;
        self.zoneHeight = 15;

        self.groupWidth = Math.floor(self.width / self.zoneWidth);
        self.groupHeight = Math.floor(self.height / self.zoneHeight);

        self.areas = {};

        self.loadAreas();
        self.loadCollisions();
        self.loadDoors();

        self.ready = true;
    },

    loadAreas: function() {
        var self = this;

        /**
         * The structure for the new self.areas is as follows:
         *
         * self.areas = {
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

        self.areas['PVP'] = new PVPAreas();
        self.areas['Music'] = new MusicAreas();
        self.areas['Chests'] = new ChestAreas(self.world);
    },

    loadDoors: function() {
        var self = this;

        self.doors = {};

        _.each(map.doors, function(door) {
            var orientation;

            switch (door.to) {
                case 'u':
                    orientation = Modules.Orientation.Up;
                    break;

                case 'd':
                    orientation = Modules.Orientation.Down;
                    break;

                case 'l':
                    orientation = Modules.Orientation.Left;
                    break;

                case 'r':
                    orientation = Modules.Orientation.Right;
                    break;
            }

            self.doors[self.gridPositionToIndex(door.x, door.y)] = {
                x: door.tx,
                y: door.ty,
                orientation: orientation,
                portal: door.p === 1,
                level: door.l,
                achievement: door.a,
                rank: door.r
            }

        });
    },

    isDoor: function(x, y) {
        return !!this.doors[this.gridPositionToIndex(x, y)];
    },

    getDoorDestination: function(x, y) {
        return this.doors[this.gridPositionToIndex(x, y)];
    },

    loadCollisions: function() {
        var self = this,
            location = './server/data/map/collisions.json';

        self.grid = null;

        fs.exists(location, function(exists) {
            if (!exists || config.forceCollisions) {

                log.info('Generating the collision grid...');

                self.grid = [];

                var tileIndex = 0;

                for (var i = 0; i < self.height; i++) {
                    self.grid[i] = [];
                    for (var j = 0; j < self.width; j++) {
                        if (_.include(self.collisions, tileIndex))
                            self.grid[i][j] = 1;
                        else
                            self.grid[i][j] = 0;

                        tileIndex += 1;
                    }
                }

                fs.writeFile(location, JSON.stringify(self.grid), function(err) {
                    if (err) {
                        log.info('An error has occurred: ' + err);
                        return;
                    }

                    log.info('The collision grid has been successfully generated!');

                    self.done();
                });

            } else {
                self.grid = require('../../data/map/collisions.json');

                self.done();
            }
        });
    },

    isValidPosition: function(x, y) {
        return isInt(x) && isInt(y) && !this.isOutOfBounds(x, y) && !this.isColliding(x, y);
    },

    isOutOfBounds: function(x, y) {
          return x < 0 || x >= this.width || y < 0 || y >= this.height;
    },

    isColliding: function(x, y) {
        var self = this;

        if (self.isOutOfBounds(x, y))
            return false;

        return self.grid[y][x] === 1;
    },

    indexToGridPosition: function(tileIndex) {
        var self = this;

        tileIndex -= 1;

        var x = self.getX(tileIndex + 1, self.width),
            y = Math.floor(tileIndex / self.width);

        return {
            x: x,
            y: y
        }
    },

    gridPositionToIndex: function(x, y) {
          return (y * this.width) + x + 1;
    },

    getX: function(index, width) {
        if (index === 0)
            return 0;

        return (index % width === 0) ? width - 1 : (index % width) - 1;
    },

    getRandomPosition: function(area) {
        var self = this,
            pos = {},
            valid = false;

        while (!valid) {
            pos.x = area.x + Utils.randomInt(0, area.width + 1);
            pos.y = area.y + Utils.randomInt(0, area.height + 1);
            valid = self.isValidPosition(pos.x, pos.y);
        }

        return pos;
    },

    inArea: function(posX, posY, x, y, width, height) {
        return posX >= x && posY >= y && posX <= width + x && posY <= height + y;
    },

    inTutorialArea: function(entity) {
        if (entity.x === -1 || entity.y === -1)
            return true;

        return this.inArea(entity.x, entity.y, 13, 553, 7, 7) || this.inArea(entity.x, entity.y, 15, 13, 11, 12);
    },

    done: function() {
        if (this.readyCallback)
            this.readyCallback();
    },

    isReady: function(callback) {
        this.readyCallback = callback;
    }


});