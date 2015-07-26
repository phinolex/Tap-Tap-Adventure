/* global databaseHandler, log */

var cls = require('./lib/class'),
    Inventory = require('./inventory'),
    Messages = require('./message'),
    BankRoom = require('./bankroom')
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
    }
    
});