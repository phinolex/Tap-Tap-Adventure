var cls = require("./../../../../lib/class");

module.exports = InventorySlot = cls.Class.extend({

    init: function(kind, count, skillKind, skillLevel) {
        var self = this;

        self.kind = kind;
        self.count = count; //Item count or enchantment count
        self.skillKind = skillKind;
        self.skillLevel = skillLevel;
    },

    setCount: function(count) {
        var self = this;

        self.count = count;
    },

    setSkillKind: function(skillKind) {
        this.skillKind = skillKind;
    },

    setSkillLevel: function(skillLevel) {
        this.skillLevel = skillLevel;
    },

    getCount: function() {
        return this.count;
    },

    getSkillKind: function() {
        return this.skillKind;
    },

    getSkillLevel: function() {
        return this.skillLevel;
    }
});
