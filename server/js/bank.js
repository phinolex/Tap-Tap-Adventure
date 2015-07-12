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
    }
    
});