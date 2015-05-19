define(['mob'], function(Mob) {
  var Skill = Class.extend({
    init: function(name) {
      this.name = name;
      this.level = 0;
      this.slots = [];
    },

    getName: function() {
      return this.name;
    },
    getLevel: function() {
      return this.level;
    },
    setLevel: function(value) {
      this.level = value;

      for(var index = 0; index < this.slots.length; index++) {
        this.slots[index].setLevel(value);
      }
    },

    clear: function() {
    },
    add: function(slot) {
      this.slots.push(slot);
    },
    remove: function(slot) {
      var index = this.slots.indexOf(slot);
      if(index >= 0) {
        this.slots.splice(index, 1);
      }
    }
  });
  var SkillPassive = Skill.extend({
  });
  var SkillActive = Skill.extend({
    init: function(name, cooltime) {
      this._super(name);

      this.cooltime = cooltime;
      this.cooltimeCounter = 0;
      this.cooltimeTickHandle = null;
      this.cooltimeDoneHandle = null;

      this.executingHandler = null;
    },

    clear: function() {
      if(this.cooltimeTickHandle) {
        clearInterval(this.cooltimeTickHandle);
        this.cooltimeTickHandle = null;
      }
      if(this.cooltimeDoneHandle) {
        clearTimeout(this.cooltimeDoneHandle);
        this.cooltimeDoneHandle = null;
      }
    },
    execute: function(game) {
      if(this.cooltimeDoneHandle) {
        if(this.executingHandler) {
          this.executingHandler(this);
        }
      } else {
        var self = this;

        this.cooltimeCounter = this.cooltime;

        this.cooltimeTickHandle = setInterval(function() {
          if(self.cooltimeCounter >= 0.2) {
            self.cooltimeCounter -= 0.2;

            self.tick(game);
            for(var index = 0; index < self.slots.length; index++) {
              self.slots[index].tick(self);
            }
          }
        }, 200);
        this.cooltimeDoneHandle = setTimeout(function() {
          clearInterval(self.cooltimeTickHandle);
          self.cooltimeTickHandle = null;

          self.cooltimeDoneHandle = null;

          self.done(game);
          for(var index = 0; index < self.slots.length; index++) {
            self.slots[index].done(self);
          }
        }, this.cooltime * 1000);

        for(var index = 0; index < this.slots.length; index++) {
          this.slots[index].execute_(this);
        }
      }
    },
    tick: function(game) {
    },
    done: function(game) {
    },

    onExecuting: function(handler) {
      this.executingHandler = handler;
    }
  });

  var SkillEvasion = SkillPassive.extend({
  });
  var SkillBloodSucking = SkillPassive.extend({
  });
  var SkillCriticalStrike = SkillPassive.extend({
  });
  var SkillHeal = SkillActive.extend({
    init: function(name) {
      this._super(name, 30);
    },

    execute: function(game) {
      if(!this.cooltimeDoneHandle) {
        game.client.sendSkill("heal", 0);
      }

      this._super(game);
    }
  });
  var SkillFlareDance = SkillActive.extend({
    init: function(name) {
      this._super(name, 10);
    },

    execute: function(game) {
      if(!this.cooltimeDoneHandle) {
        game.client.sendSkill("flareDance", 0);
        this.interval = 0;
      }

      this._super(game);
    },
    tick: function(game) {
      if(this.interval <= 0 && game.player.isFlareDance){
        game.player.flareDanceAttack();
        this.interval = 1;
      } else {
        this.interval -= 0.2;
      }
    }
  });
  var SkillStun = SkillActive.extend({
    init: function(name) {
      this._super(name, 30);
    },

    execute: function(game) {
      if(!this.cooltimeDoneHandle
      && game.player.target
      && game.player.target instanceof Mob) {
        game.client.sendSkill("stun", game.player.target.id);
        this.interval = 0;
        this._super(game);
      } else{
        game.chathandler.addNotification('대상을 지정하지 않았습니다.');
      }
    },
  });
  var SkillSuperCat = SkillActive.extend({
    init: function(name) {
      this._super(name, 90);
    },

    execute: function(game) {
      if(!this.cooltimeDoneHandle) {
        game.client.sendSkill("superCat", 0);
        this.interval = 0;
      }

      this._super(game);
    },
  });
  var SkillProvocation = SkillActive.extend({
    init: function(name) {
      this._super(name, 15);
    },

    execute: function(game) {
      if(!this.cooltimeDoneHandle
      && game.player.target
      && game.player.target instanceof Mob) {
        game.client.sendSkill("provocation", game.player.target.id);
        this.interval = 0;
        this._super(game);
      } else{
        game.chathandler.addNotification('대상을 지정하지 않았습니다.');
      }
    },
  });

  var SkillFactory = {
    Skills: {
      evasion: SkillEvasion,
      bloodSucking: SkillBloodSucking,
      criticalStrike: SkillCriticalStrike,
      heal: SkillHeal,
      flareDance: SkillFlareDance,
      stun: SkillStun,
      superCat: SkillSuperCat,
      provocation: SkillProvocation,
    },

    make: function(name) {
      if(name in SkillFactory.Skills) {
        return new SkillFactory.Skills[name](name);
      } else {
        return null;
      }
    }
  };

  var SkillPositions = {
    evasion:        '-700px -556px',
    bloodSucking:   '-668px -556px',
    criticalStrike: '-732px -556px',
    heal:           '-764px -556px',
    flareDance:     '-796px -556px',
    stun:           '-828px -556px',
    superCat:       '-860px -556px',
    provocation:    '-892px -556px',
  };

  var SkillSlot = Class.extend({
    init: function(parent, index, id) {
      this.parent = parent;
      this.index = index;
      this.body = $(id + 'Body');
      this.cooltime = $(id + 'Cooltime');
      this.levels = [];

      for(var index = 0; index< 4; index++) {
        this.levels.push($(id + index));
      }

      var self = this;

      this.body.unbind('click').bind('click', function(event) {
        self.execute(self.parent.game);
      });
      this.body.unbind('dragover').bind('dragover', function(event) {
        if(DragData && DragData.skillName) {
          event.preventDefault();
        }
      });
      this.body.unbind('drop').bind('drop', function(event) {
        if(DragData && DragData.skillName) {
          self.parent.game.client.sendSkillInstall(self.index, DragData.skillName);
        }
      });
    },

    setLevel: function(value) {
      for(var index = 0; index < value; index++) {
        this.levels[index].css('display', 'block');
      }
      for(var index = value; index < this.levels.length; index++) {
        this.levels[index].css('display', 'none');
      }
    },

    clear: function() {
      if(this.skill) {
        this.skill.clear();
        this.cooltime.css('display', 'none');
      }
    },
    assign: function(name) {
      if(this.skill) {
        this.skill.remove(this);
      }

      this.skill = this.parent.getSkill(name);
      if(this.skill) {
        this.skill.add(this);

        var self = this;

        this.body.css({
          'background-image': 'url("img/2/main.png")',
          'background-position': SkillPositions[name]
        });
        this.body.attr('title', Types.Player.Skills.getComment(name));

        this.setLevel(this.skill.level);

        if((this.skill instanceof SkillActive) && this.skill.cooltimeDoneHandle) {
          this.execute_(this.skill);
        }
      } else {
        this.body.css({
          'background-image': '',
          'background-position': ''
        });
        this.body.attr('title', '');
      }
    },
    execute: function() {
      if(this.skill && (this.skill instanceof SkillActive)) {
        this.skill.execute(this.parent.game);
      }
    },
    execute_: function(skill) {
      if(skill.cooltime > 0) {
        this.cooltime.css('display', 'block');
        this.tick(skill);
      }
    },
    tick: function(skill) {
      this.cooltime.html('' + skill.cooltimeCounter.toFixed(1));
    },
    done: function(skill) {
      this.cooltime.css('display', 'none');
    }
  });

  var SkillHandler = Class.extend({
    init: function(game) {
      this.game = game;
      this.skills = {};
      this.skillSlots = [];

      for(var index = 0; index < 5; index++) {
        this.skillSlots.push(new SkillSlot(this, index, '#skill' + index));
      }
    },

    getSkill: function(name) {
      return name in this.skills ? this.skills[name] : null;
    },

    clear: function() {
      for(var index = 0; index < this.skillSlots.length; index++) {
        this.skillSlots[index].clear();
      }
    },
    add: function(name, level) {
      var skill = null;
      if(name in this.skills) {
        skill = this.skills[name];
      } else {
        skill = SkillFactory.make(name);
        if(skill) {
          if(skill instanceof SkillActive) {
            var self = this;

            skill.onExecuting(function(sender) {
              self.game.chathandler.addNotification('아직 ' + Types.Player.Skills.getComment(sender.name) + '의 쿨타임이 끝나지 않았습니다.');
            });
          }
          this.skills[name] = skill;
        }
      }
      if(skill) {
        skill.setLevel(level);
      }
    },
    install: function(index, name) {
      if((index >= 0) && (index < this.skillSlots.length)) {
        this.skillSlots[index].assign(name);
      }
    },
    execute: function(key) {
      var index = [81, 87, 69, 82, 84].indexOf(key); // q, w, e, r, t
      if(index >= 0) {
        this.skillSlots[index].execute(this.game);
      }
    }
  });

  return SkillHandler;
});
