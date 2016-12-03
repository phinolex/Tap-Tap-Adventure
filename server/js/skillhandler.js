var cls = require("./lib/class"),
    SkillData = require("./skilldata.js"),
    _ = require('underscore');

module.exports = SkillHandler = cls.Class.extend({
    init: function() {
        this.skills = {};
        this.skillSlots = [];

        for (var indx = 0; indx < 5; indx++)
            this.skillSlots.push('');
    },

    clear: function() {
        for (var index = 4; index >=0; index--)
            delete this.skillSlots[index];

        delete this.skillSlots;
        delete this.skills;

        this.skills = {};
        this.skillSlots = [];
    },

    getSkillByName: function(name) {
        for (var s in this.skills) {
            if (this.skills.hasOwnProperty(s)) {
                if (s == name)
                    return s;
            }
        }
        return null;
    },

    getLevel: function(name) {
        return this.skills[name] ? this.skills[name] : 0;
    },

    add: function(name, level) {
        if (this.hasSkill(name)) {
            var skillLevel = this.getLevel(name);

            if (level > skillLevel) {
                delete this.skills[name];
                this.skills[name] = level;
            }

        } else
            this.skills[name] = level;

    },

    install: function(index, name) {
        this.skillSlots[index] = name;
    },

    getIndexByName: function(name) {
        var index = 0;

        for (var skill in this.skills) {
            if (this.skills.hasOwnProperty(skill)) {
                if (skill == name)
                    return index;
            }

            index++;
        }

        return 0;
    },

    hasSkill: function(name) {
        for (var skill in this.skills) {
            if (skill == name)
                return true;
        }

        return false;
    },

    remove: function(name) {
        log.info("Before: " + this.skills);

        this.skills = _.reject(this.skills, function(el) {
            return el == name;
        });

        log.info("After: " + this.skills);
    }
});