var cls = require("./lib/class"),
    Types = require("../../shared/js/gametypes");

module.exports = BankRoom = cls.Class.extend({
    init: function(itemKind, itemNumber, itemSkillKind, itemSkillLevel) {
        
        this.set(itemKind, itemNumber, itemSkillKind, itemSkillLevel);
    },
    set: function(itemKind, itemNumber, itemSkillKind, itemSkillLevel) {
        
        this.itemKind = itemKind;
        this.itemNumber = itemNumber;
        this.itemSkillKind = itemSkillKind;
        this.itemSkillLevel = itemSkillLevel;
    },
    addNumber: function(number){
        
        this.itemNumber += number;
    }
});
