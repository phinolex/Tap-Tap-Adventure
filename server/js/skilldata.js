var _ = require("underscore");
var SkillsJSON = require("../../shared/data/skills.json");

var Skills = [];
var SkillNames = {};

for (var index in SkillsJSON)
{
	var value = SkillsJSON[index];

	
	Skills.push({
	    name:value.name,
	    class:value.class,
	    type:value.type ? value.type : "cast",
	    skillType:value.skillType,
	    target:value.target,
	    duration:value.duration ? value.duration : 0,
	    attain: value.attain ? value.attain : 25,
	    levels: value.levels,
	    recharge: value.recharge ? value.recharge : 0,
	    aoe: value.aoe
	});
	
	SkillNames[value.name] = Skills[index];
}

//log.info("skills: "+JSON.stringify(Skills));

module.exports.Skills = Skills;
module.exports.SkillNames = SkillNames;

