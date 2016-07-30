#!/usr/bin/env node







//
//THIS TOOL IS DEPRACATED DO NOT USE UNLESS ASKY FILE TESTING.




var Log = require('log'),
    _ = require('underscore'),
    path = require("path"),
    fs = require("fs"),
    log = new Log(Log.DEBUG),
    Types = require("../../shared/js/gametypes"),
    ItemTypes = require("../../shared/js/itemtypes");

var source = "map.json";
var clientDest = "../../client/maps/world_client";
var serverDest = "../../server/maps/world_server.json";

function main(){
    getTiledJSONmap(source, function(json){
        var clientMap = processMap(json, "client");
        var clientJsonMap = JSON.stringify(clientMap);

        fs.writeFile(clientDest + ".json", clientJsonMap, function(err, file){
            log.info("Finished processing map file: " + clientDest + ".json was saved.");
        });

        clientJsonMap = "var mapData = " + JSON.stringify(clientMap);
        fs.writeFile(clientDest + ".js", clientJsonMap, function(err, file){
            log.info("Finished processing map file: " + clientDest + ".js was saved.");
        });

        var serverMap = processMap(json, "server");
        var serverJsonMap = JSON.stringify(serverMap);

        fs.writeFile(serverDest, serverJsonMap, function(err, file){
            log.info("Finished processing map file: " + serverDest + " was saved.");
        });
    });
}

function getTiledJSONmap(filename, callback){
    var self = this;

    path.exists(filename, function(exists){
        if(!exists){
            log.error(filename + " doesn't exist.");
            return;
        }

        fs.readFile(source, function(err, file){
            callback(JSON.parse(file.toString()));
        });
    });
}

function processMap(json, mode){
    var Tiled = json,
        layerIndex = 0,
        tileIndex = 0,
        tilesetFilepath = "";

    var map = {
        width: 0,
        height: 0,
        collisions: [],
        doors: [],
        checkpoints: []
    };

    var collidingTiles = {};
    var staticEntities = {};
    var mobsFirstgid;

    if(mode === "client"){
        map.data = [];
        map.high = [];
        map.animated = {};
        map.blocking = [];
        map.plateau = [];
        map.musicAreas = [];
    }
    if(mode === "server"){
        map.roamingAreas = [];
        map.chestAreas = [];
        map.pvpAreas = [];
        map.staticChests = [];
        map.staticEntities = {};
    }

    log.info("Processing map info...");
    map.width = Tiled.width;
    map.height = Tiled.height;
    map.tilesize = Tiled.tilewidth;

    log.info("Width: " + map.width);
    log.info("Height: " + map.height);
    log.info("Tile Size: " + map.tilesize);

    // Tile properties (collision, z-index, animation length...)
    var tileProperties;
    var handleProp = function(property, id){
        if(property.c !== undefined){
            collidingTiles[id] = true;
        }
        if(mode === "client"){
            if(property.v !== undefined){
                map.high.push(id);
            } else if(property.length){
                if(!map.animated[id]){
                    map.animated[id] = {};
                }
                map.animated[id].l = property.length;
            } else if(property.delay){
                if(!map.animated[id]){
                    map.animated[id] = {};
                }
                map.animated[id].d = property.delay;
            }
        }
    }

    if(Tiled.tilesets){
        _.each(Tiled.tilesets, function(tileset){
            if(tileset.name === "tilesheet"){
                log.info("Processing terrain properties...");
                tileProperties = tileset.tileproperties;
                var id;
                for(id in tileProperties){
                    var property = tileProperties[id];
                    var tilePropertyId = (id*1)+1;
                    handleProp(property, tilePropertyId);
                }
            } else if(tileset.name === "Mobs" && mode === "server"){
                log.info("Processing static entity properties...");
                mobsFirstgid = tileset.firstgid;
                tileProperties = tileset.tileproperties;
                var id;
                for(id in tileProperties){
                    var property = tileProperties[id];

                    if(property["type"]){
                        staticEntities[id] = property["type"];
                    }
                }
            }
        });
    } else {
        log.error("A tilesets is missing");
    }

    if(Tiled.layers){
        _.each(Tiled.layers, function(layer){
             if(layer.name === "doors"){
                 log.info("Processing doors...");
                 for(var i = 0; i < layer.objects.length; i++){
                     map.doors[i] = {
                         x: layer.objects[i].x / map.tilesize,
                         y: layer.objects[i].y / map.tilesize,
                         p: (layer.objects[i].type === 'portal') ? 1 : 0,
                     }
                     var doorprops = layer.objects[i].properties;
                     if(doorprops){
                         if(doorprops.cx){
                             map.doors[i]['tcx'] = doorprops.cx*1;
                         }
                         if(doorprops.cy){
                             map.doors[i]['tcy'] = doorprops.cy*1;
                         }
                         if(doorprops.o){
                             map.doors[i]['to'] = doorprops.o;
                         }
                         if(doorprops.x){
                             map.doors[i]['tx'] = doorprops.x*1;
                         }
                         if(doorprops.y){
                             map.doors[i]['ty'] = doorprops.y*1;
                         }
                         if(doorprops.l){
                             map.doors[i]['l'] = doorprops.l*1;
                         }
                         if(doorprops.a){
                             map.doors[i]['a'] = doorprops.a*1;
                         }
                     }
                 }
             } else if(layer.name === "roaming" && mode === "server"){
                 log.info("Processing roaming areas...");
                 var areas = layer.objects;
                 for(var i = 0; i < areas.length; i++){
                     if(areas[i].properties){
                         var nb = areas[i].properties.nb;
                     }

                     map.roamingAreas[i] = {
                         id: i,
                         x: areas[i].x / map.tilesize,
                         y: areas[i].y / map.tilesize,
                         width: areas[i].width / map.tilesize,
                         height: areas[i].height / map.tilesize,
                         type: areas[i].type,
                         nb: nb
                     };
                 }
             } else if(layer.name === "chestareas" && mode === "server"){
                 log.info("Processing chest areas...");
                 var areas = layer.objects;
                 for(var i = 0; i < areas.length; i++){
                     var chestArea = {
                         x: areas[i].x / map.tilesize,
                         y: areas[i].y / map.tilesize,
                         w: areas[i].width / map.tilesize,
                         h: areas[i].height / map.tilesize
                     };
                     var chestAreaProps = areas[i].properties;
                     if(chestAreaProps){
                         if(chestAreaProps.items){
                             chestArea['i'] = _.map(chestAreaProps.items.split(','), function(name){
                                 return ItemTypes.getKindFromString(name);
                             });
                         }
                         if(chestAreaProps.x){
                             chestArea['tx'] = chestAreaProps.x*1;
                         }
                         if(chestAreaProps.items){
                             chestArea['ty'] = chestAreaProps.y*1;
                         }
                     }
                     map.chestAreas.push(chestArea);
                 }
             } else if(layer.name === "pvpAreas" && mode === "server"){
                 log.info("Processing pvp areas...");
                 var areas = layer.objects;
                 for(var i = 0; i < areas.length; i++){
                     var pvpArea = {
                         x: areas[i].x / map.tilesize,
                         y: areas[i].y / map.tilesize,
                         w: areas[i].width / map.tilesize,
                         h: areas[i].height / map.tilesize
                     };
                     map.pvpAreas.push(pvpArea);
                 }
             } else if(layer.name === "chests" && mode === "server"){
                 log.info("Processing static chests...");
                 var chests = layer.objects;
                 for(var i = 0; i < chests.length; i++){
                     var items = chests[i].properties.items;
                     var newChest = {
                         x: chests[i].x / map.tilesize,
                         y: chests[i].y / map.tilesize,
                         i: _.map(items.split(','), function(name){
                             return ItemTypes.getKindFromString(name);
                         })
                     };
                     map.staticChests.push(newChest);
                 }
             } else if(layer.name === "music" && mode === "client"){
                 log.info("Processing music areas...");
                 var areas = layer.objects;
                 for(var i = 0; i < areas.length; i++){
                     var musicArea = {
                         x: areas[i].x / map.tilesize,
                         y: areas[i].y / map.tilesize,
                         w: areas[i].width / map.tilesize,
                         h: areas[i].height / map.tilesize,
                         id: areas[i].properties.id
                     };
                     map.musicAreas.push(musicArea);
                 }
             } else if(layer.name === "checkpoints"){
                 log.info("Processing check points...");
                 var checkpoints = layer.objects;
                 for(var i = 0; i < checkpoints.length; i++){
                     var cp = {
                         id: i+1,
                         x: checkpoints[i].x / map.tilesize,
                         y: checkpoints[i].y / map.tilesize,
                         w: checkpoints[i].width / map.tilesize,
                         h: checkpoints[i].height / map.tilesize
                     };
                     if(mode === "server"){
                         cp.s = checkpoints[i].type ? 1 : 0;
                     }
                     map.checkpoints.push(cp);
                 }
             } else if(layer.name === "entities" && mode === "server"){
                 log.info("Processing positions of static entities...");
                 var data = layer.data;
                 for(var i=0; i < data.length; i++){
                     if(data[i] !== 0){
                         var id = data[i] - mobsFirstgid;
                         map.staticEntities[i] = staticEntities[id];
                     }
                 }
             } else if(layer.name === "blocking" && mode === "client"){
                 log.info("Processing blocking tiles...");
                 var data = layer.data;
                 for(var i=0; i < data.length; i++){
                     if(data[i] !== 0){
                         map.blocking.push(i);
                     }
                 }
             } else if(layer.name === "plateau" && mode === "client"){
                 log.info("Processing plateau tiles...");
                 var data = layer.data;
                 for(var i=0; i < data.length; i++){
                     if(data[i] !== 0){
                         map.plateau.push(i);
                     }
                 }
             } else if(layer.visible === true && layer.name !== "entities"
                    && layer.name !== "plateau"
                    && layer.name !== "zones"
                    && layer.name !== "music"
                    && layer.name !== "doors"
                    && layer.name !== "chests"
                    && layer.name !== "chestareas"
                    && layer.name !== "roaming"
                    && layer.name !== "pvpAreas"
                    && layer.name !== "mobile zones"){
                 log.info("Processing layer: " + layer.name);
                 var data = layer.data;
                 for(var i=0; i < data.length; i++){
                     if(data[i] !== 0){
                         if(mode === "client"){
                             if(map.data[i] === undefined){
                                 map.data[i] = data[i];
                             } else if(map.data[i] instanceof Array){
                                 map.data[i].push(data[i]);
                             } else{
                                 map.data[i] = [map.data[i], data[i]];
                             }
                         }

                         if(data[i] in collidingTiles){
                             map.collisions.push(i);
                         }
                     }
                 }
             }
        });
    } else {
        log.error("Layers are missing");
    }

    return map;
}

main();
