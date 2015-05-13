var cls = require("./lib/class");

module.exports = SkillHandler = cls.Class.extend({
    init: function() {
        this.skills = {};
        this.skillSlots = [];
    
        for(var index = 0; index < 5; index++) {
            this.skillSlots.push('');
        }
    },
    getLevel: function(name) {
      for(var index = 0; index < this.skillSlots.length; index++) {
          if(this.skillSlots[index] == name) {
              return this.skills[name];
          }
      }
      return 0;
    },
    add: function(name, level) {
        this.skills[name] = level;
    },
    install: function(index, name) {
        this.skillSlots[index] = name;
    }
});
