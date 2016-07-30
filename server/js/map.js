var cls = require('./lib/class');
_ = require('underscore');
var fs = require('fs');
var file = require('../../shared/js/file');
var path = require('path');
var Utils = require('./utils');
var Checkpoint = require('./checkpoint');
var Area = require('./area');

var Map = cls.Class.extend({


    init: function (filepath) {
        var self = this;

        this.isLoaded = false;

        file.exists(filepath, function (exists) {

            if (!exists) {
                log.error(filepath + ' doesn\'t exist.');
                return;
            }

            fs.readFile(filepath, function (err, file) {
                var json = JSON.parse(file.toString());

                self.initMap(json);
            });
        });
    },

    initMap: function (thismap) {
        this.width = thismap.width;
        this.height = thismap.height;
        this.collisions = thismap.collisions;
        this.mobAreas = thismap.roamingAreas;
        this.chestAreas = thismap.chestAreas;
        this.staticChests = thismap.staticChests;
        this.staticEntities = thismap.staticEntities;
        this.isLoaded = true;
        this.generateCollisions = false;

        // zone groups
        this.zoneWidth = 20;
        this.zoneHeight = 10;
        this.groupWidth = Math.floor(this.width / this.zoneWidth);
        this.groupHeight = Math.floor(this.height / this.zoneHeight);

        this.initConnectedGroups(thismap.doors);
        this.initCheckpoints(thismap.checkpoints);
        this.initPVPAreas(thismap.pvpAreas);
        this.loadCollisionGrid();

        if (!this.generateCollisions && this.readyFunc) {
            this.readyFunc();
        }
    },

    ready: function(f) {
        this.readyFunc = f;
    },

    tileIndexToGridPosition: function (tileNum) {
        var x = 0;
        var y = 0;

        var getX = function (num, w) {
            if (num === 0) {
                return 0;
            }
            return (num % w === 0) ? w - 1 : (num % w) - 1;
        };

        tileNum -= 1;
        x = getX(tileNum + 1, this.width);
        y = Math.floor(tileNum / this.width);

        return { x: x, y: y };
    },

    GridPositionToTileIndex: function (x, y) {
        return (y * this.width) + x + 1;
    },

    generateArea: function(width, height) {

    },

    loadCollisionGrid: function() {
        var self = this;
        var collisionGrid = require('../data/map/collisions.json');


        if (self.generateCollisions) {
            var filePath = ('./server/data/map/collisiongrid.json')
            fs.exists(filePath, function(exists) {
                if (exists) {
                    log.info("JSON Collision Grid already exists.. Assigning");
                    self.grid = collisionGrid;
                } else {
                    log.info("Generating collision grid...");
                    self.grid = [];
                    if (self.isLoaded) {
                        var tileIndex = 0;
                        log.info("height:"+self.height+",width:"+self.width);
                        for (var i = 0; i < self.height; i++) {
                            self.grid[i] = [];
                            for (var j = 0; j < self.width; j++) {
                                if (_.include(self.collisions, tileIndex)) {
                                    self.grid[i][j] = 1;
                                } else {
                                    self.grid[i][j] = 0;
                                }
                                tileIndex += 1;
                            }
                        }
                    } else {
                        log.info("An error has occured, map has not loaded.");
                    }
                    fs.writeFile(filePath, JSON.stringify(self.grid), function(err) {
                        if (err)
                            log.info(err);
                        else
                            log.info("Successfully generated the collision grid");
                    
			if (this.readyFunc) {
			    this.readyFunc();
			}                    
                    });

                }
            });
        } else
            self.grid = collisionGrid;


        log.info("Collision Grid Loaded");

        
    },


    isOutOfBounds: function (x, y) {
        return x <= 0 || x >= this.width || y <= 0 || y >= this.height;
    },

    isColliding: function (x, y) {
    	//log.info("x="+x+",y="+y);
        if (this.isOutOfBounds(x, y)) {
            return false;
        }
        return this.grid[y][x] === 1;
    },
    isPVP: function(x,y){

        var id = 0;
        var area = null;

        area = _.detect(this.pvpAreas, function(area){
            return area.contains(x,y);
        });
        if(area){

            return true;
        } else{

            return false;
        }
    },

    isHealingArea: function(x, y) {
        var id = 0;
        var area = null;

        area = _.detect(this.healingAreas, function(area) {
            return area.contains(x, y);
        });

        if (area) {

            return true;
        } else {

            return false;
        }
    },

    GroupIdToGroupPosition: function (id) {
        var posArray = id.split('-');

        return pos(parseInt(posArray[0], 10), parseInt(posArray[1], 10));
    },

    forEachGroup: function (callback) {
        var width = this.groupWidth;
        var height = this.groupHeight;

        for (var x = 0; x < width; x += 1) {
            for(var y = 0; y < height; y += 1) {
                callback(x+'-'+y);
            }
        }
    },

    getGroupIdFromPosition: function (x, y) {
        var w = this.zoneWidth;
        var h = this.zoneHeight;
        var gx = Math.floor((x) / w);
        var gy = Math.floor((y) / h);

        return gx + '-' + gy;
    },

    getAdjacentGroupPositions: function (id) {
        var self = this;
        var position = this.GroupIdToGroupPosition(id);
        var x = position.x;
        var y = position.y;
        // surrounding groups
        var list = [pos(x-1, y-1), pos(x, y-1), pos(x+1, y-1),
            pos(x-1, y),   pos(x, y),   pos(x+1, y),
            pos(x-1, y+1), pos(x, y+1), pos(x+1, y+1)];

        // groups connected via doors
        _.each(this.connectedGroups[id], function (position) {
            // don't add a connected group if it's already part of the surrounding ones.
            if (!_.any(list, function(groupPos) { return equalPositions(groupPos, position); })) {
                list.push(position);
            }
        });

        return _.reject(list, function(pos) {
            return pos.x < 0 || pos.y < 0 || pos.x >= self.groupWidth || pos.y >= self.groupHeight;
        });
    },

    forEachAdjacentGroup: function(groupId, callback) {
        if(groupId) {
            _.each(this.getAdjacentGroupPositions(groupId), function(pos) {
                callback(pos.x+'-'+pos.y);
            });
        }
    },

    initConnectedGroups: function (doors) {
        var self = this;

        this.connectedGroups = {};
        _.each(doors, function (door) {
            var groupId = self.getGroupIdFromPosition(door.x, door.y);
            var connectedGroupId = self.getGroupIdFromPosition(door.tx, door.ty);
            var connectedPosition = self.GroupIdToGroupPosition(connectedGroupId);

            if (groupId in self.connectedGroups) {
                self.connectedGroups[groupId].push(connectedPosition);
            } else {
                self.connectedGroups[groupId] = [connectedPosition];
            }
        });
    },

    //Waiting Areas

    initWaitingAreas: function(waitingList) {
        var self = this;
        this.waitingAreas = {};
        var minigame = null;

        _.each(waitingList, function (wait) {
            var minigameArea = new Area(wait.id, wait.x, wait.y, wait.w, wait.h);
            minigame = wait.m;

        });

    },

    getWaitingArea: function(minigame) {

        return this.waitingArea[minigame].value;
    },

    initCheckpoints: function (cpList) {
        var self = this;

        this.checkpoints = {};
        this.startingAreas = [];

        _.each(cpList, function (cp) {
            var checkpoint = new Checkpoint(cp.id, cp.x, cp.y, cp.w, cp.h);
            self.checkpoints[checkpoint.id] = checkpoint;
            if (cp.s === 1) {
                self.startingAreas.push(checkpoint);
            }
        });
    },

    getCheckpoint: function (id) {
        return this.checkpoints[id];
    },

    getRandomStartingPosition: function () {
        var nbAreas = _.size(this.startingAreas),
            i = Utils.randomInt(0, nbAreas-1),
            area = this.startingAreas[i];

        return area.getRandomPosition();
    },

    initPVPAreas: function(pvpList){
        var self = this;

        this.pvpAreas = [];
        _.each(pvpList, function(pvp){
            var pvpArea = new Area(pvp.id, pvp.x, pvp.y, pvp.w, pvp.h, null);
            self.pvpAreas.push(pvpArea);
        });
    },

    initHealingAreas: function(healingList) {
        var self = this;
        self.healingSpots = [];
        _.each(healingList, function(healing){
            var healingArea = new Area(healing.id, healing.x, healing.y, healing.w, healing.h, null);
            self.healingSpots.push(healingArea);
        });


    }


});

var pos = function (x, y) {
    return { x: x, y: y };
};

var equalPositions = function (pos1, pos2) {
    return pos1.x === pos2.x && pos2.y === pos2.y;
};

module.exports = Map;
