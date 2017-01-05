/* global databaseHandler, log */

var cls = require("./../../../../lib/class"),
    InventoryRoom = require("./inventoryroom"),
    Messages = require("./../../../../network/packets/message"),
    ItemTypes = require("../../../../../../../shared/js/itemtypes"),
    Types = require("../../../../../../../shared/js/gametypes");

module.exports = Inventory = cls.Class.extend({
    /**
     * TODO - The inventory system is still very ambiguous,
     * it has to be better defined using terminology such as
     * slot, item, itemCount, inventoryType
     */

    init: function(owner, number, itemKinds, itemNumbers, itemSkillKinds, itemSkillLevels) {
        var self = this;

        self.owner = owner;
        self.number = number;
        self.rooms = [];

        for (var i = 0; i < self.number; i++)
            self.rooms.push(new InventoryRoom(itemKinds[i], itemNumbers[i], itemSkillKinds[i], itemSkillLevels[i]));
    },

    hasItem: function(itemKind) {
        var self = this;

        for (var i = 0; i < self.number; i++) {
            if (self.rooms[i].itemKind === itemKind)
                return true;

        }
        return false;
    },

    hasItems: function(itemKind, itemCount) {
        var self = this;

        for (var i = 0; i < self.number; i++) {
            if (self.rooms[i].itemKind === itemKind) {
                if (self.rooms[i].number >= itemCount)
                    return true;

            }
        }
        return false;
    },

    hasEmptyInventory: function() {
        var self = this;

        for (var i = 0; i < self.number; i++) {
            if (self.rooms[i].itemKind === null)
                return true;

        }
        return false;
    },

    takeOut: function(itemKind, itemCount) {
        var self = this;

        for (var i = 0; i < self.number; i++) {
            var room = self.rooms[i];

            if (room.itemKind === itemKind) {
                if (room.itemNumber > itemCount) {
                    room.itemKind = itemKind;
                    room.itemNumber -= itemCount;

                    databaseHandler.setInventory(self.owner, i, itemKind, room.itemNumber, 0, 0);
                } else {
                    room.itemKind = null;
                    room.itemNumber = 0;
                    room.itemSkillKind = 0;
                    room.itemSkillLevel = 0;

                    databaseHandler.makeEmptyInventory(self.owner, i);
                }
            }
        }
    },

    makeEmptyInventory: function(inventoryNumber) {
        var self = this;

        self.rooms[inventoryNumber].itemKind = null;
        self.rooms[inventoryNumber].itemNumber = 0;
        self.rooms[inventoryNumber].itemSkillKind = 0;
        self.rooms[inventoryNumber].itemSkillLevel = 0;

        databaseHandler.makeEmptyInventory(self.owner, inventoryNumber);
    },

    getItemNumber: function(itemKind) {
        var self = this;

        for (var i = 0; i < self.number; i++) {
            if (self.rooms[i].itemKind === itemKind)
                return self.rooms[i].itemNumber;

        }
        return 0;
    },

    getInventoryNumber: function(itemKind) {
        var self = this;

        for (var i = 0; i < self.number; i++) {
            if (self.rooms[i].itemKind === itemKind)
                return i;
        }

        return -1;
    },

    getEmptyInventoryNumber: function() {
        var self = this;

        for (var i = 0; i < self.number; i++) {
            if (self.rooms[i].itemKind === null)
                return i;
        }

        return -1;
    },

    getEmptyEquipmentNumber: function() {
        var self = this;

        for (var i = 6; i < self.number; i++) {
            if (self.rooms[i].itemKind === null)
                return i;
        }

        return -1;
    },

    putInventoryItem: function(item) {
        this.putInventory(item.itemKind, item.itemNumber, item.itemSkillKind, item.itemSkillLevel);
    },

    putInventory: function(itemKind, itemNumber, itemSkillKind, itemSkillLevel) {
        var self = this,
            itemCount = itemNumber ? itemNumber : 1;

        itemSkillKind = itemSkillKind ? itemSkillKind : 0;
        itemSkillLevel = itemSkillLevel ? itemSkillLevel : 0;

        if (ItemTypes.isConsumableItem(itemKind) || ItemTypes.isGold(itemKind)) {
            for (var i = 0; i < self.number; i++) {
                if (self.rooms[i].itemKind === itemKind) {
                    self.rooms[i].itemNumber += itemNumber;

                    if (self.rooms[i].itemNumber <= 0)
                        self.makeEmptyInventory(i);
                    else
                        databaseHandler.setInventory(self.owner, i, itemKind, self.rooms[i].itemNumber, 0, 0);

                    return true;
                }
            }

            if (i === self.number)
                return self.addItem(itemKind, itemNumber, 0, 0);
        } else
            return self.addItem(itemKind, itemNumber, itemSkillKind, itemSkillLevel);
    },

    addItem: function(itemKind, itemNumber, itemSkillKind, itemSkillLevel) {
        var self = this,
            index = 0;

        if (!ItemTypes.isConsumableItem(itemKind))
            index = 6;

        for (; index < self.number; index++) {
            var item = self.rooms[index];

            if (item.itemKind === null) {
                item.itemKind = itemKind;
                item.itemNumber = itemNumber;
                item.itemSkillKind = itemSkillKind;
                item.itemSkillLevel = itemSkillLevel;

                databaseHandler.setInventoryItem(self.owner, index, item);
                return true;
            }
        }

        self.owner.server.pushToPlayer(self.owner, new Messages.Notify("Your inventory is full!"));
        return false;
    },

    setInventory: function(inventoryNumber, itemKind, itemNumber, itemSkillKind, itemSkillLevel) {
        var self = this;

        self.rooms[inventoryNumber].set(itemKind, itemNumber, itemSkillKind, itemSkillLevel);
        databaseHandler.setInventory(self.owner, inventoryNumber, itemKind, itemNumber, itemSkillKind, itemSkillLevel);
    },

    takeOutInventory: function(inventoryNumber, number) {
        var self = this,
            item = self.rooms[inventoryNumber];


        if((ItemTypes.isConsumableItem(item.itemKind) ||
            ItemTypes.isGold(item.itemKind) ||
            ItemTypes.isCraft(item.itemKind)) && item.itemNumber > number) {

            item.itemNumber -= number;
            databaseHandler.setInventoryItem(self.owner, inventoryNumber, item);
        } else
            self.makeEmptyInventory(inventoryNumber);
    },

    getAvailableSpace: function() {

    }
});