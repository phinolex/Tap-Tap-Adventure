/* global module */

var cls = require("../lib/class"),
  map = require("../../data/map/world_server.json"),
  _ = require("underscore");

module.exports = Groups = cls.Class.extend({
  init(map) {
    var self = this;

    this.map = map;

    this.width = this.map.width;
    this.height = this.map.height;

    this.zoneWidth = this.map.zoneWidth;
    this.zoneHeight = this.map.zoneHeight;

    this.groupWidth = this.map.groupWidth;
    this.groupHeight = this.map.groupHeight;

    this.linkedGroups = {};

    this.loadDoors();
  },

  loadDoors() {
    var self = this,
      doors = map.doors;

    _.each(doors, function(door) {
      var groupId = this.groupIdFromPosition(door.x, door.y),
        linkedGroupId = this.groupIdFromPosition(door.tx, door.ty),
        linkedGroupPosition = this.groupIdToPosition(linkedGroupId);

      if (groupId in this.linkedGroups)
        this.linkedGroups[groupId].push(linkedGroupPosition);
      else this.linkedGroups[groupId] = [linkedGroupPosition];
    });
  },

  getAdjacentGroups(id) {
    var self = this,
      position = this.groupIdToPosition(id),
      x = position.x,
      y = position.y;

    var list = [];

    for (var i = -1; i <= 1; i++)
      for (var j = -1; j <= 1; j++) list.push({x: x + j, y: y + i});

    _.each(this.linkedGroups[id], function(groupPosition) {
      if (
        !_.any(list, function(groupPosition) {
          return groupPosition.x === x && groupPosition.y === y;
        })
      )
        list.push(groupPosition);
    });

    return _.reject(list, function(groupPosition) {
      var gX = groupPosition.x,
        gY = groupPosition.y;

      return (
        gX < 0 || gY < 0 || gX >= this.groupWidth || gY >= this.groupHeight
      );
    });
  },

  forEachGroup(callback) {
    var self = this;

    for (var x = 0; x < this.groupWidth; x++)
      for (var y = 0; y < this.groupHeight; y++) callback(x + "-" + y);
  },

  forEachAdjacentGroup(groupId, callback) {
    var self = this;

    if (!groupId) return;

    _.each(this.getAdjacentGroups(groupId), function(position) {
      callback(position.x + "-" + position.y);
    });
  },

  groupIdFromPosition(x, y) {
    return (
      Math.floor(x / this.zoneWidth) + "-" + Math.floor(y / this.zoneHeight)
    );
  },

  groupIdToPosition(id) {
    var position = id.split("-");

    return {
      x: parseInt(position[0], 10),
      y: parseInt(position[1], 10)
    };
  }
});
