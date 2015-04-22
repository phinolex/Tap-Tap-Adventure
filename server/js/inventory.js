/* global databaseHandler, log */

var cls = require("./lib/class"),
    InventoryRoom = require("./inventoryroom");
    Messages = require("./message");
    Types = require("../../shared/js/gametypes");

module.exports = Inventory = cls.Class.extend({
    init: function(owner, number, itemKinds, itemNumbers, itemSkillKinds, itemSkillLevels){
        var i=0;
        this.owner = owner;
        this.number = number;
        this.rooms = [];
        log.info("Owner: " + this.owner + " Number:" + this.number + " ItemKinds: " + itemKinds[i] + " "
                + "itemNumbers: " + itemNumbers[i] + " itemSkillKinds: " + itemSkillKinds[i] + " itemSkillLevels"
                + itemSkillLevels[i]);
        for(i=0; i<number; i++){
            this.rooms.push(new InventoryRoom(itemKinds[i], itemNumbers[i], itemSkillKinds[i], itemSkillLevels[i]));
        }
    },
    hasItem: function(itemKind){
        var i = 0;
        for(i=0; i<this.number; i++){
            if(this.rooms[i].itemKind === itemKind){
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
    putInventory: function(itemKind, itemNumber, itemSkillKind, itemSkillLevel){
        log.info("putInventory " + "Owner: " + this.owner + " Number:" + this.number + " ItemKinds: " + itemKind + " "
                + "itemNumbers: " + itemNumber + " itemSkillKinds: " + itemSkillKind + " itemSkillLevels"
                + itemSkillLevel);
        var i=0;
        if(Types.isHealingItem(itemKind)){
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
        } else{
            
            return this._putInventory(itemKind, itemNumber, itemSkillKind, itemSkillLevel);
        }
    },
    _putInventory: function(itemKind, itemNumber, itemSkillKind, itemSkillLevel){
        log.info("putInventory " + "Owner: " + this.owner + " Number:" + this.number + " ItemKinds: " + itemKind + " "
                + "itemNumbers: " + itemNumber + " itemSkillKinds: " + itemSkillKind + " itemSkillLevels"
                + itemSkillLevel);
        var i=0;
        for(i=0; i<this.number; i++){
            if(this.rooms[i].itemKind === null) {
                this.rooms[i].itemKind = itemKind;
                this.rooms[i].itemNumber = itemNumber;
                this.rooms[i].itemSkillKind = itemSkillKind;
                this.rooms[i].itemSkillLevel = itemSkillLevel;
                databaseHandler.setInventory(this.owner, i, itemKind, itemNumber, itemSkillKind, itemSkillLevel);
                return true;
            }
        } 
        this.owner.server.pushToPlayer(this.owner, new Messages.Notify("Inventory is full."));
        return false;
    },
    setInventory: function(inventoryNumber, itemKind, itemNumber, itemSkillKind, itemSkillLevel){
        log.info("putInventory " + "Owner: " + this.owner + " Number:" + this.number + " ItemKinds: " + itemKind + " "
                + "itemNumbers: " + itemNumber + " itemSkillKinds: " + itemSkillKind + " itemSkillLevels"
                + itemSkillLevel);
        this.rooms[inventoryNumber].set(itemKind, itemNumber, itemSkillKind, itemSkillLevel);
        databaseHandler.setInventory(this.owner, inventoryNumber, itemKind, itemNumber, itemSkillKind, itemSkillLevel);
    },
    takeOutInventory: function(inventoryNumber, number){
        if(this.rooms[inventoryNumber].itemNumber <= number){
            this.makeEmptyInventory(inventoryNumber);
        } else{
            this.rooms[inventoryNumber].itemNumber -= number;
            databaseHandler.setInventory(this.owner, inventoryNumber, this.rooms[inventoryNumber].itemKind, this.rooms[inventoryNumber].itemNumber, this.rooms[inventoryNumber].itemSkillKind, this.rooms[inventoryNumber].itemSkillLevel);
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
            inventoryString += ", " + Types.getKindAsString(this.rooms[i].itemKind) + " ";
            inventoryString += this.rooms[i].itemNumber + " ";
            inventoryString += Types.getItemSkillNameByKind(this.rooms[i].itemSkillKind) + " ";
            inventoryString += this.rooms[i].itemSkillLevel;
        }
        return inventoryString;
    }
});
