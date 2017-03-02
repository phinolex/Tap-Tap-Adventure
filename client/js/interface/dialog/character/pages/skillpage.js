/**
 * Created by flavius on 2017-02-24.
 */
define(['../../../../tabpage', '../../../../skilldata'], function(TabPage, SkillData) {
    var SkillPage = TabPage.extend({
        init: function(frame) {
            var self = this;

            self._super('#characterDialogFrameSkillPage');
            self.frame = frame;
            self.game = self.frame.game;
            self.scale = self.frame.getScale();
            self.skills = [];

            log.info("Loading skill page...");
        },

        setSkill: function(name, level) {
            this.skills.push({
                name: name,
                level: level,
                skill: null
            });
        },

        load: function() {
            var self = this,
                passiveSkillId = 0,
                activeSkillId = 0;

            self.updateScale();

            for (var id = 0; id < self.skills.length; id++) {
                var skill = self.skills[id],
                    skillData = SkillData.Names[skill.name],
                    isPassive = skillData.type == 'passive';

                if (skill) {
                    var iconOffset = skillData.iconOffset[scale - 1],
                        skillId = id + 10,
                        s = new Skill('#characterSkill' + skillId, skill.name, iconOffset, self.game);

                    s.background.css({
                        'position': 'absolute',
                        'left': '' + ((isPassive ? passiveSkillId : activeSkillId) % 2 ? 70 : 14) * scale + 'px',
                        'top': '' + (isPassive ? 113 + (Math.floor(passiveSkillId / 2) * 20) : 17 + (Math.floor(activeSkillId / 2) * 20)) * scale + 'px',
                        "width": '42px',
                        'height': '15px',
                        'display': 'block'
                    });

                    self.skills[id].skill = s;

                    $('#characterSkill' + skillId).attr('title', skill.name + " Lv: " + skill.level);
                    s.setLevel(skill.level);

                    if (isPassive)
                        passiveSkillId++;
                    else
                        activeSkillId++;
                }
            }
        },

        clear: function() {
            var self = this;

            for (var i = self.skills.length - 1; i >= 0; --i) {
                var skill = self.skills[i];

                if (skill.skill) {
                    skill.skill.background.css({
                        'display': 'none'
                    });

                    $('#characterSkill1' + i).attr('title', '');
                    skill.skill.setLevel(0);
                }

                delete self.skills[i];
            }

            self.skills = [];
        },

        updateScale: function() {
            this.scale = this.frame.getScale();
        }
    });

    return SkillPage;
});