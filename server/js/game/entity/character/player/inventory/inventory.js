/* global databaseHandler, log */

var cls = require('../../../../lib/class'),
    InventorySlot = require('./inventoryslot'),
    _ = require('underscore'),
    Messages = require('../../../../network/packets/message'),
    ItemTypes = require('../../../../../../../shared/js/itemtypes');

module.exports = Inventory = cls.Class.extend({

    init: function(owner, size, kinds, counts, skills, sLevels) {
        var self = this;

        self.owner = owner;
        self.server = self.owner.server;
        self.size = size;
        self.slots = [];

        for (var i = 0; i < self.size; i++)
            self.slots.push(new InventorySlot(kinds[i], counts[i], skills[i], sLevels[i]));
    },

    getItem: function(index) {
        var self = this;

        if (index > self.slots.index || index < 0)
            return null;

        return this.slots[index];
    },

    contains: function(kind, count) {
        var self = this;

        for (var i = 0; i < self.slots.length; i++)
            if (self.slots[i].kind == kind && self.slots[i].count >= count)
                return true;

        return false;
    },

    hasSpace: function() {
        var self = this;

        for (var i = 0; i < self.slots.length; i++)
            if (self.slots[i].kind == null)
                return true;

        return false;
    },

    add: function(kind, count, skillKind, skillLevel) {
        var self = this,
            index = 0,
            isConsumable = ItemTypes.isConsumableItem(kind),
            isStackable = ItemTypes.isGold(kind);

        if (count < 0)
            return;

        if (!isConsumable)
            index = 6;

        for (var i = index; i < self.slots.length; i++) {
            var item = self.slots[i];

            if ((isStackable || isConsumable) && item.kind == kind) {

                item.count += count;

                databaseHandler.setInventory(self.owner, i, kind, self.slots[i].count, 0, 0);

                return;

            } else if (item.kind == null) {
                //Empty space..

                item.kind = kind;
                item.count = count;
                item.skillKind = skillKind;
                item.skillLevel = skillLevel;

                databaseHandler.setInventoryItem(self.owner, i, item);

                return;
            }

        }
    },

    remove: function(kind, count) {
        var self = this;

        if (count < 0)
            return;

        for (var i = 0; i < self.slots.length; i++) {
            var item = self.slots[i];

            if (item.kind == kind) {

                if (item.count > count) {

                    item.kind = kind;
                    item.count -= count;

                    databaseHandler.setInventoryItem(self.owner, i, item);

                } else {

                    item.kind = null;
                    item.count = 0;
                    item.skillKind = 0;
                    item.skillLevel = 0;

                    databaseHandler.makeEmptyInventory(self.owner, i);
                }
            }
        }
    },

    empty: function(index) {
        var self = this,
            item = self.slots[index];

        item.kind = null;
        item.count = 0;
        item.skillKind = 0;
        item.skillLevel = 0;

        databaseHandler.makeEmptyInventory(self.owner, index);
    },

    getCount: function(kind) {
        var self = this;

        for (var i = 0; i < self.slots.length; i++)
            if (self.slots[i].kind == kind)
                return self.rooms[i].count;

        return -1;
    },

    getIndex: function(kind) {
        var self = this;

        for (var i = 0 ; i < self.slots.length; i++)
            if (self.slots[i].kind == kind)
                return i;

        return -1;
    },

    getEmptySlot: function(isEquipment) { //Couldn't we use this instead of hasSpace()?
        var self = this;

        for (var i = isEquipment ? 6 : 0; i < self.slots.length; i++)
            if (self.rooms[i].itemKind == null)
                return i;

        return -1;
    },

    clearInventory: function() {
        var self = this;

        for (var i = 0; i < self.slots.length; i++) {
            var item = self.slots[i];

            if (item.kind != null) {
                item.kind = null;
                item.count = 0;
                item.skillKind = 0;
                item.skillLevel = 0;

                databaseHandler.makeEmptyInventory(self.owner, i);
            }
        }
    }
});