var cls = require("./lib/class");
var SkillData = require("./skilldata.js");

module.exports = SkillHandler = cls.Class.extend({
    init: function() {
        this.skills = {};
        this.skillSlots = [];
        for (var index = 0; index < 5; index++)
            this.skillSlots.push('');
    },

    clear: function() {
        for (var index = 4; index >= 0; index--)
            delete this.skillSlots[index];

        delete this.skillSlots;
        delete this.skills;

        this.skills = {};
        this.skillSlots = [];
    },

    getLevel: function(name) {
        return this.skills[name] ? this.skills[name] : 0;
    },

    add: function(name, level) {
        this.skills[name] = level;
    },

    install: function(index, name) {
        this.skillSlots[index] = name;
    },

    getIndexByName: function(name) {
        var i = 0;
        for (var skillName in this.skills) {
            if (skillName == name)
                return i;

            i++;
        }
        log.info("Index: " + i);

        return 0;
    },

    installSkills: function(player) {
        player.skills = {};

        for (var index = 0; index < SkillData.Skills; index++) {
            var skill = SkillData.Skills[index];
            if (player.pClass == skill.class) {
                if (player.level >= skill.levelRequirement) {
                    var skillLevel = ~~(player.level / skill.levelRequirement);
                    if (skillLevel > 4)
                        skillLevel = 4;

                    player.skills[index] = new Skill(player, id, skillLevel);

                    if (skill.type == "passive") {
                        switch(skill.skillType) {
                            case "attack":
                                player.skillPassiveAttack = skill.levels[skillLevel - 1];
                                break;

                            case "defense":
                                player.skillPassiveDefense = skill.levels[skillLevel - 1];
                                break;
                        }
                    }
                }
            }
        }
    }

});

Skill = cls.Class.extend({

    init: function(player, skillIndex, skillLevel) {
        this.player = player;
        this.skillData = SkillData.Skills[skillIndex];
        this.skillIndex = skillIndex;
        this.skillLevel = skillLevel;

        if (this.skillData.recharge > 0)
            this.skillCooldown = new Timer(this.skillData.recharge);
    },

    getSkill: function() {
        return this.skillData;
    },

    isReady: function() {
        time = new Date().getTime();
        return this.skillCooldown.isOver(time);
    }

});
