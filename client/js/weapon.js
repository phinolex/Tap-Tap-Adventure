/**
 * Created by flavius on 2017-02-24.
 */
define(function() {
    var Weapon = Class.extend({
        init: function(name, type) {
            var self = this;
            
            self.name = name;
            self.type = type;

            self.establishKind(); //too lazy
        },

        establishKind: function() {
            var self = this;

            self.kind = ItemTypes.getKindFromString(self.name);
        },

        getEnchantedPoints: function() {
            return this.enchantedPoints;
        },

        getSkillKind: function() {
            return this.skillKind;
        },

        getSkillLevel: function() {
            return this.skillLevel;
        },

        setEnchantedPoints: function(points) {
            this.enchantedPoints = points;
        },

        setSkillKind: function(skillKind) {
            this.skillKind = skillKind;
        },

        setSkillLevel: function(skillLevel) {
            this.skillLevel = skillLevel;
        }
    });
});