var _ = require("underscore");
var SkillsJSON = require("../../../../../shared/data/skills.json");

var Skills = [];
var SkillNames = {};

for (var index = 0; index < SkillsJSON.length; index++) {
    var value = SkillsJSON[index];

    Skills.push({
        skillName: value.name,
        skillClass: value.class,
        type: value.type ? value.type : "passive",
        levelRequirement: value.reqLevel,
        skillType: value.skillType,
        target: value.target,
        duration: value.duration ? value.duration : 0,
        recharge: value.recharge ? value.recharge : 0,
        levels: value.levels ? value.levels : 5,
        manaReq: value.manaReq ? value.manaReq : [10, 25, 45, 70],
        aoe: value.aoe ? value.aoe : 0
    });

    SkillNames[value.name] = Skills[index];
}

module.exports.Skills = Skills;
module.exports.SkillNames = SkillNames;

