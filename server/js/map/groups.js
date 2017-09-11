/* global module */

var cls = require('../lib/class'),
    map = require('../../data/map/world_server.json'),
    _ = require('underscore');

module.exports = Groups = cls.Class.extend({

    init: function(map) {
        var self = this;

        self.map = map;

        self.width = self.map.width;
        self.height = self.map.height;

        self.zoneWidth = self.map.zoneWidth;
        self.zoneHeight = self.map.zoneHeight;

        self.groupWidth = self.map.groupWidth;
        self.groupHeight = self.map.groupHeight;

        self.linkedGroups = {};

        self.loadDoors();
    },

    loadDoors: function() {
        var self = this,
            doors = map.doors;

        _.each(doors, function(door) {
             var groupId = self.groupIdFromPosition(door.x, door.y),
                 linkedGroupId = self.groupIdFromPosition(door.tx, door.ty),
                 linkedGroupPosition = self.groupIdToPosition(linkedGroupId);

             if (groupId in self.linkedGroups)
                 self.linkedGroups[groupId].push(linkedGroupPosition);
             else
                 self.linkedGroups[groupId] = [linkedGroupPosition];
        });

    },

    getAdjacentGroups: function(id) {
        var self = this,
            position = self.groupIdToPosition(id),
            x = position.x, y = position.y;

        var list = [];

        for (var i = -1; i <= 1; i++)
            for (var j = -1; j <= 1; j++)
                list.push({ x: x + j, y: y + i });

        _.each(self.linkedGroups[id], function(groupPosition) {

            if (!_.any(list, function(groupPosition) {
                return groupPosition.x === x && groupPosition.y === y;
            })) list.push(groupPosition);

        });

        return _.reject(list, function(groupPosition) {
            var gX = groupPosition.x,
                gY = groupPosition.y;

            return gX < 0 || gY < 0 || gX >= self.groupWidth || gY >= self.groupHeight;
        });
    },

    forEachGroup: function(callback) {
        var self = this;

        for (var x = 0; x < self.groupWidth; x++)
            for (var y = 0; y < self.groupHeight; y++)
                callback(x + '-' + y)
    },

    forEachAdjacentGroup: function(groupId, callback) {
        var self = this;

        if (!groupId)
            return;

        _.each(self.getAdjacentGroups(groupId), function(position) {
            callback(position.x + '-' + position.y);
        });
    },

    groupIdFromPosition: function(x, y) {
        return (Math.floor(x / this.zoneWidth) + '-' + (Math.floor(y / this.zoneHeight)));
    },

    groupIdToPosition: function(id) {
        var position = id.split('-');

        return {
            x: parseInt(position[0], 10),
            y: parseInt(position[1], 10)
        }
    }

});