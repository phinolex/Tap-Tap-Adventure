define(['mob', 'skilldata', 'character'], function(Mob, SkillData, Character) {

    var Skill = Class.extend({
        init: function(name, skillIndex) {
            this.name = name;
            this.level = 0;
            this.slots = [];
            this.skillIndex = skillIndex;
            this.skillData = SkillData.Data[skillIndex];
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
        init: function(name, skillIndex) {
            this._super(name, skillIndex);

            this.cooltime = SkillData.Data[skillIndex].recharge;
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

        /**
         * Warning, this is still experimental
         * all of this data has to be sent to the server
         * after which the server responds accordingly,
         * rather than having it all being handled directly
         * in the client. This is good for now, but after 50
         * players are online simultaneously, it will be dangerous
         * to keep this much information client-sided.
         */

        execute: function(game) {
            var self = this;

            if (this.cooltimeDoneHandle) {
                game.chathandler.addNotification('Your skill has not cooled down yet.');
                return;
            }

            var skillData = SkillData.Names[self.name],
                skillTarget = skillData.target,
                manaReq = skillData.manaReq[self.level];


            if (game.player.mana - manaReq < 0) {
                game.chathandler.addNotification('You do not have enough mana points to use this ability!');
                return;
            }

            if(!this.cooltimeDoneHandle)
                game.client.sendSkill(this.skillIndex);


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

        },
        tick: function(game) {
        },
        done: function(game) {
        },

        onExecuting: function(handler) {
            this.executingHandler = handler;
        }
    });


    var SkillFactory = {
        make: function(name, index) {
            if(name in SkillFactory.Skills) {
                return new SkillFactory.Skills[name](name, index);
            } else {
                return null;
            }
        }
    };

    SkillFactory.Skills = {};
    for (var i = 0; i < SkillData.Data.length; ++i)
    {
        var skillName = SkillData.Data[i].name;
        if (SkillData.Data[i].type == "passive")
        {
            SkillFactory.Skills[skillName] =  SkillPassive;
        }
        else
        {
            SkillFactory.Skills[skillName] =  SkillActive;
        }
    };
    log.info("SKillFactory.Skills:" + JSON.stringify(SkillFactory.Skills));

    var haste_attack_execute_callback = function(self, game) {
        var level = ~~(game.player.level / self.skillData.attain);
        var speedMultiplier = 1 + (self.skillData.levels[level-1] / 100);
        game.player.attackCooldown.duration /= speedMultiplier;
        setTimeout(function() {
            game.player.attackCooldown.duration *= speedMultiplier;
        }, self.skillData.duration * 1000);

        game.client.sendSkill(this.skillIndex);
    };

    var haste_move_execute_callback = function(self, game) {
        var level = ~~(game.player.level / self.skillData.attain);
        var speedMultiplier = 1 + (self.skillData.levels[level-1] / 100);
        game.player.moveSpeed /= speedMultiplier;
        setTimeout(function() {
            game.player.moveSpeed *= speedMultiplier;
        }, self.skillData.duration * 1000);

        game.client.sendSkill(this.skillIndex);
    };


    var slow_execute_callback = function(self, game) {
        var target = game.player.target;
        var level = ~~(game.player.level / self.skillData.attain);
        var speedMultiplier = 1 + (self.skillData.levels[level-1] / 100);
        target.moveSpeed *= speedMultiplier;
        target.attackCooldown.duration *= speedMultiplier;

        setTimeout(function() {
            target.moveSpeed /= speedMultiplier;
            target.attackCooldown.duration /= speedMultiplier;
        }, self.skillData.duration * 1000);

        game.client.sendSkill(this.skillIndex, target.id);
    };

    var stun_execute_callback = function(self, game) {
        var target = game.player.target;
        var level = ~~(game.player.level / self.skillData.attain);
        var duration = self.skillData.duration[level-1];
        target.isStunned = true;
        setTimeout(function() {
            target.isStunned = false;
        }, duration * 1000);

        game.client.sendSkill(this.skillIndex, target.id);
    };



    var SkillSlot = Class.extend({
        init: function(game, parent, index, id) {
            this.game = game;
            this.parent = parent;
            this.index = index;
            this.body = $(id + 'Body');
            this.cooltime = $(id + 'Cooltime');
            this.levels = [];
            this.name;

            for(var index = 0; index< 4; index++) {
                this.levels.push($(id + index));
            }

            var self = this;

            this.body.unbind('click').bind('click', function(event) {
                log.info("click?")
                self.execute(self.parent.game);
            });
            this.body.unbind('dragover').bind('dragover', function(event) {
                log.info("Drag is over.");
                if(DragData && DragData.skillName) {
                    event.preventDefault();
                }
            });
            this.body.unbind('drop').bind('drop', function(event) {
                log.info("Drag is dropped.");
                if(DragData && DragData.skillName) {
                    self.parent.game.client.sendSkillInstall(self.index, DragData.skillName);
                    DragData.skillName = null;
                }
            });
        },

        setLevel: function(value) {
            var self = this,
                renderer = self.game.renderer,
                scale = renderer.getScaleFactor();

            if (renderer.mobile)
                scale = 1;

            for(var index = 0; index < value; index++) {
                this.levels[index].css({
                    'display': 'block',
                    'left': '' + (4.5 * scale * index) + 'px'
                });

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
        hideShortcut: function() {
            this.body.css({
                'background-image': '',
                'background-position': ''
            });
            this.body.attr('title', '');
            for(var index = 0; index < this.levels.length; index++) {
                this.levels[index].css('display', 'none');
            }

        },

        displayShortcut: function() {
            if (this.name)
            {
                var scale = this.game.renderer.getScaleFactor();
                if (this.game.renderer.mobile)
                    scale = 1;
                this.body.css({
                    'background-image': 'url("img/'+scale+'/skillicons.png")',
                    //'background-position': SkillPositions[scale][this.name]
                    'background-position': SkillData.Names[this.name].iconOffset[scale-1],
                    'background-repeat': 'no-repeat'
                });
            }
        },
        assign: function(name) {
            this.name = name;
            if(this.skill) {
                this.skill.remove(this);
            }

            this.skill = this.parent.getSkill(name);
            if(this.skill) {
                this.skill.add(this);

                var self = this;
                var scale = this.game.renderer.getScaleFactor();

                this.displayShortcut();
                this.body.attr('title', name);

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
            this.container = $('#skillcontainer');

            for(var index = 0; index < 5; index++) {
                this.skillSlots.push(new SkillSlot(this.game, this, index, '#skill' + index));
                this.skillSlots[index].assign();
            }

            var self = this;
            self.isDragging = false;

            this.container.bind("touchstart", function(ev) {
                self.isClicked = true;
            });
            this.container.mousedown(function() {
                self.isClicked = true;
            });

            this.container.mousemove(function() {
                self.isDragging = true;
            });

            $("#container").mousemove(function() {
                if (self.isUnlocked && self.isDragging && self.isClicked) {
                    self.moveShortcuts();
                }
            });
            $("#container").bind("touchmove", function(ev) {
                self.isDragging = true;
                if (self.isUnlocked && self.isDragging && self.isClicked) {
                    self.game.app.setMouseCoordinates(ev.originalEvent.touches[0]);
                    self.moveShortcuts();
                }
            });

            this.container.mouseup(function(event) {
                self.isDragging = false;
                self.isClicked = false;
            });
            this.container.bind("touchend", function(ev) {
                self.isDragging = false;
                self.isClicked = false;
            });

            self.isVertical = true;
            $('#skillcontainermove').click(function (event) {
                if (self.isVertical)
                    $('#skillcontainer').attr("class","vertical");
                else
                    $('#skillcontainer').attr("class","horizontal");
                self.isVertical = !self.isVertical;
            });

            self.isUnlocked = false;
            $('#skillcontainerswitch').click(function (event) {
                self.isUnlocked = !self.isUnlocked;
            });
        },

        moveShortcuts: function() {
            this.container.css({
                "left":this.game.mouse.x + "px",
                "top":this.game.mouse.y + "px"
            });
        },

        displayShortcuts: function() {
            for(var i = 0; i < 5; ++i) {
                this.skillSlots[i].displayShortcut();
            }
        },

        hideShortcuts: function() {
            for(var i = 0; i < 5; ++i) {
                this.skillSlots[i].hideShortcut();
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
        add: function(name, level, skillIndex) {
            var skill = null;
            if(name in this.skills) {
                skill = this.skills[name];
            } else {
                skill = SkillFactory.make(name, skillIndex);
                if(skill) {
                    if(skill instanceof SkillActive) {
                        var self = this;
                        var type = skill.skillData.skillType;
                        if (type == "haste-attack")
                            skill.execute_callback = haste_attack_execute_callback;
                        else if (type == "haste-move")
                            skill.execute_callback = haste_move_execute_callback;
                        else if (type == "slow")
                            skill.execute_callback = slow_execute_callback;
                        else if (type == "stun")
                            skill.execute_callback = stun_execute_callback;

                        skill.onExecuting(function(sender) {
                            self.game.chathandler.addNotification('You have to wait for ' + sender.name + ' to cool down.');
                        });
                    }
                    this.skills[name] = skill;
                }
            }
            if(skill) {
                skill.setLevel(level);
            }
            //alert(JSON.stringify(this.skills));
        },
        install: function(index, name) {
            if((index >= 0) && (index < this.skillSlots.length)) {
                this.skillSlots[index].assign(name);
            }
        },
        execute: function(key) {
            var index = [81, 69, 82, 84, 89].indexOf(key); // q, w, e, r, t
            if(index >= 0) {
                this.skillSlots[index].execute(this.game);
            }
        }
    });

    return SkillHandler;
});