var fs = require('fs'),
    _ = require('underscore');

/**
 * Global Values
 */

var collisions = {},
    entities = {},
    mobsFirstGid = -1,
    map, mode;

module.exports = function parse(json, options) {
    var self = this;

    self.json = json;
    self.options = options;

    mode = self.options.mode;

    map = {
        width: 0,
        height: 0,
        collisions: []
    };

    switch (mode) {
        case 'client':

            map.data = [];
            map.high = [];
            map.blocking = [];

            map.animated = {};

            break;

        case 'server':

            map.roamingAreas = [];
            map.chestAreas = [];
            map.pvpAreas = [];
            map.gameAreas = [];
            map.staticChests = [];
            map.doors = [];
            map.musicAreas = [];

            map.staticEntities = {};

            break;
    }

    map.width = self.json.width;
    map.height = self.json.height;

    map.tilesize = self.json.tilewidth;

    var handleProperty = function(property, value, id) {
        if (property === 'c')
            collisions[id] = true;

        if (mode === 'client') {
            if (property === 'v')
                map.high.push(id);

            if (property === 'length') {
                if (!map.animated[id])
                    map.animated[id] = {};

                map.animated[id].l = value;
            }

            if (property === 'delay') {
                if (!map.animated[id])
                    map.animated[id] = {};

                map.animated[id].d = value;
            }
        }
    };

    if (self.json.tilesets instanceof Array) {
        _.each(self.json.tilesets, function(tileset) {
            var name = tileset.name.toLowerCase();

            if (name === 'tilesheet') {
                _.each(tileset.tileproperties, function(value, name) {
                    var id = parseInt(name, 10) + 1;

                    _.each(value, function(value, name) {
                        handleProperty(name, (isValid(parseInt(value, 10))) ? parseInt(value, 10) : value, id);
                    });
                });
            } else if (name === 'mobs' && mode === 'server') {
                mobsFirstGid = tileset.firstgid;

                _.each(tileset.tileproperties, function(value, name) {
                    var id = parseInt(name, 10) + 1;

                    entities[id] = value.type;
                });
            }
        });
    }

    _.each(self.json.layers, function(layer) {
        var name = layer.name.toLowerCase(),
            type = layer.type;

        if (mode === 'server')
            switch (name) {

                case 'doors':

                    var doors = layer.objects;

                    for (var d = 0; d < doors.length; d++) {
                        map.doors[d] = {
                            x: doors[d].x / map.tilesize,
                            y: doors[d].y / map.tilesize,
                            p: (doors[d].type === 'portal') ? 1 : 0
                        };

                        _.each(doors[d].properties, function(value, name) {
                            map.doors[d]['t' + name] = isValid(parseInt(value, 10)) ? parseInt(value, 10) : value;
                        });
                    }

                    break;

                case 'roaming':

                    var areas = layer.objects;

                    for (var a = 0; a < areas.length; a++) {
                        var count = 1;

                        if (areas[a].properties)
                            count = parseInt(areas[a].properties.count, 10);

                        map.roamingAreas[a] = {
                            id: a,
                            x: areas[a].x / map.tilesize,
                            y: areas[a].y / map.tilesize,
                            width: areas[a].width / map.tilesize,
                            height: areas[a].height / map.tilesize,
                            type: areas[a].type,
                            count: count
                        }

                    }

                    break;

                case 'chestareas':

                    var cAreas = layer.objects;

                    _.each(cAreas, function(area) {
                        var chestArea = {
                            x: area.x / map.tilesize,
                            y: area.y / map.tilesize,
                            width: area.width / map.tilesize,
                            height: area.height / map.tilesize
                        };

                        chestArea['i'] = _.map(area.properties.items.split(','), function(name) {
                            return name;
                        });

                        _.each(area.properties, function(value, name) {
                            if (name !== 'items')
                                chestArea['t' + name] = isValid(parseInt(value, 10)) ? parseInt(value, 10) : value;
                        });

                        map.chestAreas.push(chestArea);
                    });

                    break;

                case 'chests':

                    var chests = layer.objects;

                    _.each(chests, function(chest) {
                        var oChest = {
                            x: chest.x / map.tilesize,
                            y: chest.y / map.tilesize
                        };

                        oChest['i'] = _.map(chest.properties.items.split(','), function(name) {
                            return name;
                        });

                        map.staticChests.push(oChest);
                    });

                    break;

                case 'music':

                    var mAreas = layer.objects;

                    _.each(mAreas, function(area) {
                        var musicArea = {
                            x: area.x / map.tilesize,
                            y: area.y / map.tilesize,
                            width: area.width / map.tilesize,
                            height: area.height / map.tilesize,
                            id: area.properties.id
                        };

                        map.musicAreas.push(musicArea);
                    });

                    break;

                case 'pvp':

                    var pAreas = layer.objects;

                    _.each(pAreas, function(area) {
                        var pvpArea = {
                            x: area.x / map.tilesize,
                            y: area.y / map.tilesize,
                            width: area.width / map.tilesize,
                            height: area.height / map.tilesize
                        };

                        map.pvpAreas.push(pvpArea);
                    });

                    break;

                case 'games':

                    var gAreas = layer.objects;

                    _.each(gAreas, function(area) {
                        var gameArea = {
                            x: area.x / map.tilesize,
                            y: area.y / map.tilesize,
                            width: area.width / map.tilesize,
                            height: area.height / map.tilesize
                        };

                        map.gameAreas.push(gameArea);
                    });

                    break;
            }
    });

    for (var l = self.json.layers.length - 1; l > 0; l--)
        parseLayer(self.json.layers[l]);

    if (mode === 'client')
        for (var i = 0, max = map.data.length; i < max; i++)
            if (!map.data[i])
                map.data[i] = 0;

    return map;
};

var isValid = function(number) {
    return number && !isNaN(number - 0) && number !== null && number !== '' && number !== false;
};

var parseLayer = function(layer) {
    var name = layer.name.toLowerCase(),
        type = layer.type;

    if (name === 'entities' && mode === 'server') {
        var tiles = layer.data;

        for (var i = 0; i < tiles.length; i++) {
            var gid = tiles[i] - mobsFirstGid + 1;

            if (gid && gid > 0)
                map.staticEntities[i] = entities[gid];
        }
    }

    var tiles = layer.data;

    if (name === 'blocking' && mode === 'client') {
        for (var j = 0; j < tiles.length; j++) {
            var bGid = tiles[j];

            if (bGid && bGid > 0)
                map.blocking.push(j);
        }
    } else if (type === 'tilelayer' && layer.visible !== 0 && name !== 'entities') {

        for (var k = 0; k < tiles.length; k++) {
            var tGid = tiles[k];

            if (mode === 'client') {
                if (tGid > 0) {
                    if (map.data[k] === undefined)
                        map.data[k] = tGid;
                    else if (map.data[k] instanceof Array)
                        map.data[k].unshift(tGid);
                    else
                        map.data[k] = [tGid, map.data[k]];
                }
            }

            if (tGid in collisions)
                map.collisions.push(k);
        }

    }

};