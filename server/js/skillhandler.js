var cls = require("./lib/class");
var SkillData = require("./skilldata.js");

module.exports = SkillHandler = cls.Class.extend({
    init: function() {
        this.skills = {};
        this.skillSlots = [];
    
        for(var index = 0; index < 5; index++) {
            this.skillSlots.push('');
        }
    },
    clear: function() {
        for(var index = 4; index >= 0; --index) {
            delete this.skillSlots[index]
        }
        delete this.skillSlots;
        delete this.skills;
    	this.skills = {};
        this.skillSlots = [];
    },
    
    getLevel: function(name) {
    	    //log.info("getLevel-name:"+name);
    	    //log.info("skill:" + JSON.stringify(this.skills));
    	    return this.skills[name] ? this.skills[name] : 0;
    	    /*log.info(JSON.stringify(this.skills));

      for(var index = 0; index < this.skillSlots.length; index++) {
      	  if(this.skillSlots[index] == name) {
              return this.skills[name];
          }
      }
      return 0;*/
    },
    add: function(name, level) {
        this.skills[name] = level;
    },
    install: function(index, name) {
        this.skillSlots[index] = name;
    },
    
    getIndexByName: function (name) {
    	var i = 0;
        for (var skillName in this.skills)
        {
            if (skillName == name)
                return i;
            i++;
        }
        return 0;
    },
    
    installSkills: function (player)
    {
    	player.skills = {};
    	var slotIndex = 0;
    	for (var id in SkillData.Skills)
    	{
    		var skill = SkillData.Skills[id];
    		if (player.pClass == skill.class)
    		{
    		    var level = player.level;
    		    if (level >= skill.attain)
    		    {
    		    	var skillLevel = ~~(level / skill.attain);
    		    	if (skillLevel > 4) level = 4; 
    		    	player.skills[id] = new Skill(player, id, skillLevel);
    		    	slotIndex++;
    		    	
    		    	if (skill.type == "passive")
    		    	{
    		    	    (skill.skillType == "attack")
    		    	    	player.skillPassiveAttack = skill.levels[skillLevel-1]; 
    		    	    (skill.skillType == "defense")
    		    	    	player.skillPassiveDefense = skill.levels[skillLevel-1];
    		    	}
    		    }	
    		}
    	}
    }
});

Skill = cls.Class.extend({
   init: function (player, skillIndex, skillLevel) 
   {
   	this.player = player;
   	this.skillData = SkillData.Skills[skillIndex];
   	this.skillIndex = skillIndex;
   	this.skillLevel = skillLevel;

   	if (this.skillData.recharge > 0)
   		this.skillCooldown = new Timer(this.skillData.recharge);
   },

		
   getSkill: function ()
   {
	return this.skillData;
   },
   
   isReady: function ()
   {
   	time = new Date().getTime();
   	return this.skillCooldown.isOver(time);	   
   }
	

});
