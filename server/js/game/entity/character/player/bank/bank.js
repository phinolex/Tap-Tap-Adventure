/* global databaseHandler, log */

var cls = require('./../../../../lib/class'),
    Inventory = require('./../inventory/inventory'),
    Messages = require('./../../../../network/packets/message'),
    BankRoom = require('./bankroom'),
    ItemTypes = require("../../../../../../../shared/js/itemtypes"),
    Types = require('../../../../../../../shared/js/gametypes');

module.exports = Bank = cls.Class.extend({
    init: function(owner, number, itemKinds, itemNumbers, itemSkillKinds, itemSkillLevels) {
        this.owner = owner;
        this.number = number;
        this.rooms = [];
        for (var i = 0; i < number; i++)
            this.rooms.push(new BankRoom(itemKinds[i], itemNumbers[i], itemSkillKinds[i], itemSkillLevels[i]));
    },
    
    hasItem: function(itemKind) {
        var i = 0;
        for (i = 0; i < this.number; i++) {
            if (this.rooms[i].itemKind === itemKind)
                return true;
        }
        return false;
    },
    
    hasEmptySpace: function(itemKind) {
        var i = 0;
        for (i = 0; i < this.number; i++) {
            if (this.rooms[i].itemKind === 0) {
                return true;
            }
        }
        return false;
    },
    
    emptyBankItem: function(bankNumber) {
        this.rooms[bankNumber].itemKind = 0;
        this.rooms[bankNumber].itemNumber = 0;
        this.rooms[bankNumber].itemSkillKind = 0;
        this.rooms[bankNumber].itemSkillLevel = 0;
        databaseHandler.emptyOutBankItem(this.owner, bankNumber);
    },
    
    getItemNumber: function(itemKind) {
        var i = 0;
        for (i = 0; i < this.number; i++) {
            if (this.rooms[i].itemKind === itemKind) {
                
                return this.rooms[i].itemNumber;
            }
        }
        return 0;
    },
    
    getBankNumber: function(itemKind) {
        var i = 0;
        
        for (i = 0; i < this.number; i++) {
            if (this.rooms[i].itemKind === itemKind)
                return i;
        }
        return -1;
    },
    
    getEmptyBankNumber: function() {
        for (var index = 0; index < this.number; index++) {
            if (this.rooms[index].itemKind === 0)
                return index;
        }
        return -1;
    },
    
    putBankItem: function (item)
    {
    	this.putBank(item.itemKind, item.itemNumber, item.itemSkillKind, item.itemSkillLevel);    
    },
    
    putBank: function(itemKind, itemNumber, itemSkillKind, itemSkillLevel) {
        //var i = 0;
        for (var i = 0; i < this.number; i++) {
            if ((ItemTypes.isConsumableItem(itemKind) || ItemTypes.isGold(itemKind) || ItemTypes.isCraft(itemKind)) && this.rooms[i].itemKind === itemKind) {
                this.rooms[i].itemNumber += itemNumber;

                if (this.rooms[i].itemNumber <= 0)
                    this.emptyBankItem(i);
                else
                    databaseHandler.setBank(this.owner, i, itemKind, this.rooms[i].itemNumber, 0, 0);

                return true;
            }
        }

        return this._putBank(itemKind, itemNumber, itemSkillKind, itemSkillLevel);
    },
    
    _putBank: function(itemKind, itemNumber, itemSkillKind, itemSkillLevel) {
        for(var i = 0; i < this.number; i++){
            var item = this.rooms[i];
            if(item.itemKind === 0) {
            	item.itemKind = itemKind;
                item.itemNumber = itemNumber;
                item.itemSkillKind = itemSkillKind;
                item.itemSkillLevel = itemSkillLevel;
                databaseHandler.setBankItem(this.owner, i, item);
                return true;
            }
        } 
        this.owner.server.pushToPlayer(this.owner, new Messages.Notify("Your bank is full."));
        return false;
    },
    
    setBank: function(bankNumber, itemKind, itemNumber, itemSkillKind, itemSkillLevel) {
        this.rooms[bankNumber].set(itemKind, itemNumber, itemSkillKind, itemSkillLevel);
        databaseHandler.setBank(this.owner, bankNumber, itemKind, itemNumber, itemSkillKind, itemSkillLevel);
    },
    
    takeOutBank: function(bankNumber, number) {
        var item = this.rooms[bankNumber];
    if((ItemTypes.isConsumableItem(item.itemKind) || ItemTypes.isCraft(item.itemKind)) && item.itemNumber > number) {
            item.itemNumber -= number;
            databaseHandler.setBankItem(this.owner, inventoryNumber, item);
        }
        else {
            this.emptyBankItem(bankNumber);
        }       
    },
    
    incBankRoom: function() {
        if (this.owner.isMember) {
            this.number += 100;
            this.rooms.push(new BankRoom(null, 0, 0, 0));
        }
    },
    
    bankToString: function() {
        var i = 0;
        var inventoryString = "" + this.number;
        
        for (i = 0; i < this.number; i++) {
            inventoryString += ", " + ItemTypes.getKindAsString(this.rooms[i].itemKind) + " ";
            inventoryString += this.rooms[i].itemNumber + " ";
            inventoryString += Types.getItemSkillNameByKind(this.rooms[i].itemSkillKind) + " ";
            inventoryString += this.rooms[i].itemSkillLevel;
        }
        return inventoryString;
    }
    
});