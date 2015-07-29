/* global databaseHandler, log */

var cls = require('./lib/class'),
    Inventory = require('./inventory'),
    Messages = require('./message'),
    BankRoom = require('./bankroom'),
    Types = require('../../shared/js/gametypes');

module.exports = Bank = cls.Class.extend({
    init: function(owner, number, itemKinds, itemNumbers, itemSkillKinds, itemSkillLevels) {
        this.owner = owner;
        this.number = number;
        this.rooms = [];
        for (var i = 0; i < number; i++) {
            this.rooms.push(new BankRoom(itemKinds[i], itemNumbers[i], itemSkillKinds[i], itemSkillLevels[i]));
        }
    },
    
    hasItem: function(itemKind) {
        var i = 0;
        for (i = 0; i < this.number; i++) {
            if (this.rooms[i].itemKind === itemKind) {
                return true;
            }
        }
        return false;
    },
    
    hasEmptySpace: function(itemKind) {
        var i = 0;
        for (i = 0; i < this.number; i++) {
            if (this.rooms[i].itemKind === null) {
                return true;
            }
        }
        return false;
    },
    
    emptyBankItem: function(bankNumber) {
        this.rooms[bankNumber].itemKind = null;
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
            if (this.rooms[i].itemKind === itemKind) {
                
                return i;
            }
        }
        return -1;
    },
    
    getEmptyBankNumber: function() {
        for (var index = 0; index < this.number; index++) {
            if (this.rooms[index].itemKind === null) {
                
                return index;
            }
        }
        return -1;
    },
    
    putBank: function(itemKind, itemNumber, itemSkillKind, itemSkillLevel) {
        var i = 0;
        for (i = 0; i < this.number; i++) {
            if (this.rooms[i].itemKind === itemKind) {
                this.rooms[i].itemNumber += itemNumber;
                if (this.rooms[i].itemNumber <= 0) {
                    
                    this.emptyBankItem(i);
                } else {
                    
                    databaseHandler.setBank(this.owner, i, itemKind, this.rooms[i].itemNumber, 0, 0);
                }
                return true;
            }
        }
        if (i === this.number) {
            
            return this._putBank(itemKind, itemNumber, 0, 0);
        }
    },
    
    _putBank: function(itemKind, itemNumber, itemSkillKind, itemSkillLevel) {
        var i = 0;
        for(i = 0; i < this.number; i++) {
            if (this.rooms[i].itemKind === null) {
                this.rooms[i].itemKind = itemKind;
                this.rooms[i].itemNumber = itemNumber;
                this.rooms[i].itemSkillKind = itemSkillKind;
                this.rooms[i].itemSkillLevel = itemSkillLevel;
                databaseHandler.setBank(this.owner, i, itemKind, itemNumber, itemSkillKind, itemSkillLevel);
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
        if (this.rooms[bankNumber].itemNumber <= number) {
            this.emptyBankItem(bankNumber);
        } else {
            this.rooms[bankNumber].itemNumber -= number;
            databaseHandler.setBank(this.owner, bankNumber, this.rooms[bankNumber].itemKind, this.rooms[bankNumber].itemNumber, this.rooms[bankNumber].itemSkillKind, this.rooms[bankNumber].itemSkillLevel);
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
            inventoryString += ", " + Types.getKindAsString(this.rooms[i].itemKind) + " ";
            inventoryString += this.rooms[i].itemNumber + " ";
            inventoryString += Types.getItemSkillNameByKind(this.rooms[i].itemSkillKind) + " ";
            inventoryString += this.rooms[i].itemSkillLevel;
        }
        return inventoryString;
    }
    
});