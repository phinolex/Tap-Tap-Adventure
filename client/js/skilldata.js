/* global Types */
define(['text!../shared/data/skills.json'], function(SkillsJSON) {

	Skill = {};
	Skill.Data = [];
	Skill.Names = {};
	var skillsParse = JSON.parse(SkillsJSON);
	for (var i in skillsParse)
	{
		var value = skillsParse[i];
		
		Skill.Data.push({
		    name:value.name,
		    class:value.class,
		    type:value.type ? value.type : "passive",
		    skillType:value.skillType,
		    target:value.target ? value.target : "enemy" ,
		    duration:value.duration ? value.duration : 0,
		    attain: value.attain ? value.attain : 25,
		    levels: value.levels,
		    recharge: value.recharge ? value.recharge : 0,
		    iconOffset: value.iconOffset,
		});
		Skill.Names[value.name] = Skill.Data[i];
	}
    return Skill;
});

