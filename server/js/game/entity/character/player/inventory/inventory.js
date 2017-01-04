/* global databaseHandler, log */

var cls = require("./../../../../lib/class"),
    InventoryRoom = require("./inventoryroom"),
    Messages = require("./../../../../network/packets/message"),
    ItemTypes = require("../../../../../../../shared/js/itemtypes"),
    Types = require("../../../../../../../shared/js/gametypes");

module.exports = Inventory = cls.Class.extend({
    init: function(owner, number, itemKinds, itemNumbers, itemSkillKinds, itemSkillLevels){
        var i=0;
        this.owner = owner;
        this.number = number;
        this.rooms = [];
        for(i=0; i<number; i++){
            this.rooms.push(new InventoryRoom(itemKinds[i], itemNumbers[i], itemSkillKinds[i], itemSkillLevels[i]));
        }
    },
    hasItem: function(itemKind) {
        var i = 0;
        for(i=0; i<this.number; i++){
            if(this.rooms[i].itemKind === itemKind){
                return true;
            }
        }
        return false;
    },
    hasItems: function(itemKind, itemCount){
        for (var i  = 0; i < this.number; i++) {
            if (this.rooms[i].itemKind === itemKind) {
                if (this.rooms[i].itemNumber >= itemCount)
                    return true;
            }
        }

        return false;
    },    
    hasEmptyInventory: function(){
        var i=0;
        for(i=0; i<this.number; i++){
            if(this.rooms[i].itemKind === null){
                return true;
            }
        }
        return false;
    },

    takeOut: function(itemKind, itemCount) {
        for (var i = 0; i < this.number; i++) {
            var room = this.rooms[i];
            if (room.itemKind === itemKind) {
                if (room.itemNumber > itemCount) {
                    room.itemKind = itemKind;
                    room.itemNumber -= itemCount;
                    databaseHandler.setInventory(this.owner, i, itemKind, room.itemNumber, 0, 0);
                } else {
                    room.itemKind = null;
                    room.itemNumber = 0;
                    room.itemSkillKind = 0;
                    room.itemSkilLevel = 0;

                    databaseHandler.makeEmptyInventory(this.owner, i);
                }
            }
        }
    },

    makeEmptyInventory2: function(itemKind, itemCount) {
        var i = 0;
        var a = itemCount;
        for(i = 0; i < this.number; i++) {
            if(this.rooms[i].itemKind === itemKind){
                this.rooms[i].itemKind = null;
                this.rooms[i].itemNumber = 0;
                this.rooms[i].itemSkillKind = 0;
                this.rooms[i].itemSkillLevel = 0;
                databaseHandler.makeEmptyInventory(this.owner, i);

                if (--a == 0)
                    return;
            }
        }   
    },
    
    makeEmptyInventory: function(inventoryNumber){
        this.rooms[inventoryNumber].itemKind = null;
        this.rooms[inventoryNumber].itemNumber = 0;
        this.rooms[inventoryNumber].itemSkillKind = 0;
        this.rooms[inventoryNumber].itemSkillLevel = 0;
        databaseHandler.makeEmptyInventory(this.owner, inventoryNumber);
    },
    getItemNumber: function(itemKind){
        var i = 0;

        for(i=0; i<this.number; i++){
            if(this.rooms[i].itemKind === itemKind){
                
                return this.rooms[i].itemNumber;
            }
        }
        return 0;
    },
    getInventoryNumber: function(itemKind){
        var i = 0;

        for(i=0; i<this.number; i++){
            if(this.rooms[i].itemKind === itemKind){
                return i;
            }
        }
        return -1;
    },
    getEmptyInventoryNumber: function() {
        for(var index = 0; index < this.number; index++) {
            if(this.rooms[index].itemKind === null) {
                
                return index;
            }
        }
        return -1;
    },
    getEmptyEquipmentNumber: function() {
        for(var index = 6; index < this.number; index++) {
            if(this.rooms[index].itemKind === null) {
                
                return index;
            }
        }
        return -1;
    },
    putInventoryItem: function (item)
    {
    	this.putInventory(item.itemKind, item.itemNumber, item.itemSkillKind, item.itemSkillLevel);    
    },
    
    putInventory: function(itemKind, itemNumber, itemSkillKind, itemSkillLevel) {
        itemNumber = (itemNumber) ? itemNumber : 1;
        itemSkillKind = (itemSkillKind) ? itemSkillKind : 0;
        itemSkillLevel = (itemSkillLevel) ? itemSkillLevel : 0;


        var i=0;
        if(ItemTypes.isConsumableItem(itemKind) || ItemTypes.isGold(itemKind)){
            for(i=0; i<this.number; i++){
                if(this.rooms[i].itemKind === itemKind){
                    this.rooms[i].itemNumber += itemNumber;
                    if(this.rooms[i].itemNumber <= 0){
                        
                        this.makeEmptyInventory(i);
                    } else{
                        
                        databaseHandler.setInventory(this.owner, i, itemKind, this.rooms[i].itemNumber, 0, 0);
                    }
                    return true;
                }
            }
            if(i === this.number){
                
                return this._putInventory(itemKind, itemNumber, 0, 0);
            }
        } else {
            return this._putInventory(itemKind, itemNumber, itemSkillKind, itemSkillLevel);
        }
    },
    _putInventory: function(itemKind, itemNumber, itemSkillKind, itemSkillLevel){
        var i=0;
        if(!ItemTypes.isConsumableItem(itemKind)) {
        	i = 6;
        }
        for(; i < this.number; i++){
            var item = this.rooms[i];
            if(item.itemKind === null) {
            	item.itemKind = itemKind;
                item.itemNumber = itemNumber;
                item.itemSkillKind = itemSkillKind;
                item.itemSkillLevel = itemSkillLevel;
                databaseHandler.setInventoryItem(this.owner, i, item);
                return true;
            }
        } 
        this.owner.server.pushToPlayer(this.owner, new Messages.Notify("Inventory is full."));
        return false;
    },
    setInventory: function(inventoryNumber, itemKind, itemNumber, itemSkillKind, itemSkillLevel){
        this.rooms[inventoryNumber].set(itemKind, itemNumber, itemSkillKind, itemSkillLevel);
        databaseHandler.setInventory(this.owner, inventoryNumber, itemKind, itemNumber, itemSkillKind, itemSkillLevel);
    },

    takeOutInventory: function(inventoryNumber, number){
        var item = this.rooms[inventoryNumber];
        if((ItemTypes.isConsumableItem(item.itemKind) || ItemTypes.isGold(item.itemKind) || ItemTypes.isCraft(item.itemKind)) && item.itemNumber > number) {
            item.itemNumber -= number;
            databaseHandler.setInventoryItem(this.owner, inventoryNumber, item);
        }
        else {
            this.makeEmptyInventory(inventoryNumber);
        }	
    },

    incInventoryRoom: function(){
        this.number++;
        this.rooms.push(new InventoryRoom(null, 0, 0, 0));
    },
    toString: function(){
        var i=0;
        var inventoryString = "" + this.number;

        for(i=0; i<this.number; i++){
            inventoryString += ", " + ItemTypes.getKindAsString(this.rooms[i].itemKind) + " ";
            inventoryString += this.rooms[i].itemNumber + " ";
            inventoryString += Types.getItemSkillNameByKind(this.rooms[i].itemSkillKind) + " ";
            inventoryString += this.rooms[i].itemSkillLevel;
        }
        return inventoryString;
    }
});