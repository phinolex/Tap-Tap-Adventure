define(['dialog', 'tabbook', 'tabpage', 'item', 'skilldata'], function(Dialog, TabBook, TabPage, Item, SkillData) {
    var StatePage = TabPage.extend({
        init: function(parent, game) {
            this._super('#characterDialogFrameStatePage');
            var self = this;
            this.parent = parent;
            this.game = game;

            $('#characterItemWeapon').click(function(event) {
                try {
                    if (self.game.ready) {
                        self.game.menu.clickEquipped(1);
                        var p = self.game.player;
                        //self.game.createBubble(p.weaponName, Item.getInfoMsgEx(p.weaponName, p.weaponEnchantedPoint, p.weaponSkillKind, p.weaponSkillLevel));
                        var id = $("#"+p.weaponName);
                        $(id).css("left",self.game.mouse.x-$(id).width()/2+"px");
                        $(id).css("top",self.game.mouse.y-$(id).height()+"px");
                    }
                } catch (e) {}
            });
            $('#characterItemArmor').click(function(event) {
                try {
                    if (self.game.ready){
                        self.game.menu.clickEquipped(2);
                        var p = self.game.player;
                        //self.game.createBubble(p.armorName, Item.getInfoMsgEx(p.armorName, p.armorEnchantedPoint, p.armorSkillKind, p.armorSkillLevel));
                        var id = $("#"+p.armorName);
                        $(id).css("left",self.game.mouse.x-$(id).width()/2+"px");
                        $(id).css("top",self.game.mouse.y-$(id).height()+"px");
                    }
                } catch (e) {}
            });

            $('#characterItemPendant').click(function(event) {
                try {
                    if (self.game.ready){
                        self.game.menu.clickEquipped(3);
                        var p = self.game.player;
                        //self.game.createBubble(p.pendant, Item.getInfoMsgEx(p.pendant, p.pendantEnchantedPoint, p.pendantSkillKind, p.pendantSkillLevel));
                        var id = $("#" + p.pendant);
                        $(id).css("left", self.game.mouse.x - $(id).width() / 2 + "px");
                        $(id).css("top", self.game.mouse.y - $(id).height() + "px");
                    }
                } catch (e) {}
            });

            $('#characterItemRing').click(function(event) {
                try {
                    if (self.game.ready){
                        self.game.menu.clickEquipped(4);
                        var p = self.game.player;
                        //self.game.createBubble(p.ring, Item.getInfoMsgEx(p.ring, p.ringEnchantedPoint, p.ringSkillKind, p.ringSkillLevel));
                        var id = $("#" + p.ring);
                        $(id).css("left", self.game.mouse.x - $(id).width() / 2 + "px");
                        $(id).css("top", self.game.mouse.y - $(id).height() + "px");
                    }
                } catch (e) {}
            });

        },
        assign: function(datas) {
            var game = this.game,
                width1, height1, width2, height2, width3, height3;



            if (this.game.renderer) {
                if (this.game.renderer.mobile) {
                    this.scale = 1;
                } else {
                    this.scale = this.game.renderer.getScaleFactor();
                }
            } else {
                this.scale = 2;
            }
            for(var i = 0; i < game.dialogs.length; i++) {
                if((game.dialogs[i] != this) && game.dialogs[i].visible){
                    game.dialogs[i].hide();
                }
            }

            $('#characterName').text(game.player.name);
            $('#characterLevel').text(this.game.player.level);
            $('#characterExp').text(this.game.player.experience);

            var playerArmour = this.game.player.spriteName;
            var playerWeapon = this.game.player.weaponName;
            var playerPendant = this.game.player.pendant;
            var playerRing = this.game.player.ring;

            if (typeof playerArmour == 'undefined' || playerArmour == null || playerArmour == 'undefined')
                playerArmour = 'clotharmor';

            if (typeof playerWeapon == 'undefined' || playerWeapon == null || playerWeapon == 'undefined')
                playerWeapon = 'sword1';


            $('#characterItemWeapon').css('background-image', 'url("img/' + this.scale + '/item-' + playerWeapon + '.png")');
            $('#characterItemWeapon').attr('title', Item.getInfoMsgEx(playerWeapon, this.game.player.weaponEnchantedPoint, this.game.player.weaponSkillKind, this.game.player.weaponSkillLevel));

            $('#characterItemArmor').css('background-image', 'url("img/' + this.scale + '/item-' + playerArmour + '.png")');
            $('#characterItemArmor').attr('title', Item.getInfoMsgEx(playerArmour, this.game.player.armorEnchantedPoint, this.game.player.armorSkillKind, this.game.player.armorSkillLevel));

            $('#characterItemPendant').css('background-image', 'url("img/' + this.scale + '/item-' + playerPendant + '.png")');
            $('#characterItemPendant').attr('title', Item.getInfoMsgEx(playerPendant, this.game.player.pendantEnchantedPoint, this.game.player.pendantSkillKind, this.game.player.pendantSkillLevel));

            $('#characterItemRing').css('background-image', 'url("img/' + this.scale + '/item-' + playerRing + '.png")');
            $('#characterItemRing').attr('title', Item.getInfoMsgEx(playerRing, this.game.player.ringEnchantedPoint, this.game.player.ringSkillKind, this.game.player.ringSkillLevel));


            var weapon = game.sprites[playerWeapon];
            var armor = game.sprites[playerArmour];

            switch (this.scale) {
                case 1:
                    width1 = weapon.width * 1;
                    height1 = weapon.height * 1;

                    width2 = armor.width * 1;
                    height2 = armor.height * 1;
                    break;
                case 2:
                    width1 = weapon.width * 2;
                    height1 = weapon.height * 2;

                    width2 = armor.width * 2;
                    height2 = armor.height * 2;
                    break;
                case 3:
                    width1 = weapon.width * 3;
                    height1 = weapon.height * 3;

                    width2 = armor.width * 3;
                    height2 = armor.height * 3;
                    break;
            }


            width3 = Math.max(width1, width2);
            height3 = Math.max(height1, height2);

            switch (this.scale) {
                case 1:
                    $('#characterLook').css('left', '' + (63 - parseInt(width3 / 2)) + 'px');
                    $('#characterLook').css('top', '' + (150 - height2) + 'px');
                    break;
                case 2:
                    $('#characterLook').css('left', '' + (126 - parseInt(width3 / 2)) + 'px');
                    $('#characterLook').css('top', '' + (300 - height2) + 'px');
                    break;
                case 3:
                    $('#characterLook').css('left', '' + (189 - parseInt(width3 / 2)) + 'px');
                    $('#characterLook').css('top', '' + (450 - height2) + 'px');
                    break;
            }


            $('#characterLook').css('width', '' + width3 + 'px');
            $('#characterLook').css('height', '' + height3 + 'px');
            switch (this.scale) {
                case 1:
                    $('#characterLookShadow').css('left', '' + parseInt(((width3 - width2) / 2) + ((width2 - 16) / 2)) + 'px');
                    $('#characterLookShadow').css('top', '' + parseInt(((height3 - height2) / 2) + (height2 - 19)) + 'px');
                    break;
                case 2:
                    $('#characterLookShadow').css('left', '' + parseInt(((width3 - width2) / 2) + ((width2 - 32) / 2)) + 'px');
                    $('#characterLookShadow').css('top', '' + parseInt(((height3 - height2) / 2) + (height2 - 38)) + 'px');
                    break;
                case 3:
                    $('#characterLookShadow').css('left', '' + parseInt(((width3 - width2) / 2) + ((width2 - 48) / 2)) + 'px');
                    $('#characterLookShadow').css('top', '' + parseInt(((height3 - height2) / 2) + (height2 - 57)) + 'px');
                    break;
            }


            $('#characterLookArmor').css('left', '' + parseInt((width3 - width2) / 2) + 'px');
            $('#characterLookArmor').css('top', '' + parseInt((height3 - height2) / 2) + 'px');
            $('#characterLookArmor').css('width', '' + width2 + 'px');
            $('#characterLookArmor').css('height', '' + height2 + 'px');
            $('#characterLookArmor').css('background-size', '' + (width2 * 5) + 'px');
            $('#characterLookArmor').css('background-position', '0px -' + (height2 * 8) + 'px');

            $('#characterLookWeapon').css('left', '' + parseInt((width3 - width1) / 2) + 'px');
            $('#characterLookWeapon').css('top', '' + parseInt((height3 - height1) / 2) + 'px');
            $('#characterLookWeapon').css('width', '' + width1 + 'px');
            $('#characterLookWeapon').css('height', '' + height1 + 'px');
            $('#characterLookWeapon').css('background-size', '' + (width1 * 5) + 'px');
            $('#characterLookWeapon').css('background-position', '0px -' + (height1 * 8) + 'px');

            $('#characterLookArmor').css('background-image', 'url("img/' + this.scale + '/' + playerArmour + '.png")');
            $('#characterLookWeapon').css('background-image', 'url("img/' + this.scale + '/' + playerWeapon + '.png")');
        }
    });

    var Skill = Class.extend({
        init: function(id, name, position, game) {
            log.info("Skill: " + name);
            this.background = $(id);
            this.body = $(id + 'Body');
            this.levels = [];
            this.name = name;
            this.level = 0;
            this.game = game;
            this.cooldown = false;

            if (this.game.renderer) {
                this.scale = this.game.renderer.scale;
                if (this.game.renderer.mobile)
                    this.scale = 1;
            }

            this.body.css({
                'position': 'absolute',
                'left': '0px',
                'top': '0px',
                'width': 16 * this.scale,
                'height': 15 * this.scale,
                'display': 'none'
            });
            if(position) {
                this.body.css({
                    'background-image': 'url("img/' + this.scale + '/skillicons.png")',
                    'background-position': position,
                    'display': 'block'
                });

            }

            for(var index = 0; index < 4; index++) {
                var level = $(id + 'Level' + (1 + index));
                var levelPosition = [
                    ["-329px -278px"],
                    ["-658px -556px"],
                    ["-987px -834px"]
                ];
                level.css({
                    'position': 'absolute',
                    'left': (19 + (index * 6)) * this.scale + 'px',
                    'top': 9 * this.scale,
                    'width': 5 * this.scale,
                    'height': 8 * this.scale,
                    'background-image': 'url("img/' + this.scale + '/main.png")',
                    'background-position': levelPosition[this.scale-1],
                    'display': 'none'
                });
                this.levels.push(level);
            }

            var self = this;
            var dragStart = false;

            if (SkillData.Names[self.name].type == "active") {
                this.body.bind('dragstart', function(event) {
                    event.originalEvent.dataTransfer.setData("skillName", self.name);
                    DragData = {};
                    DragData.skillName = self.name;
                    dragStart = true;
                });

                this.body.bind('mouseup', function(event) {
                    if(!dragStart && !self.game.player.skillHandler.containsSkill(self.name) && !self.cooldown) {
                        self.cooldown = true;
                        self.game.client.sendSkillInstall(self.game.selectedSkillIndex++ % 5, self.name);
                        setTimeout(function() {
                            self.cooldown = false;
                        }, 1000)
                    }
                    dragStart = false;
                });
            }
        },

        getName: function() {
            return this.name;
        },
        getLevel: function() {
            return this.level;
        },
        setLevel: function(value) {
            this.level = value;
            if(value > 0) {
                this.body.css('display', 'block');
                if (this.body[0])
                    this.body[0].draggable = true;
                for(var index = 0; index < value; index++) {
                    this.levels[index].css('display', 'block');
                }
                for(var index = value; index < this.levels.length; index++) {
                    this.levels[index].css('display', 'none');
                }
            } else {
                this.body.css('display', 'none');
                if (this.body[0])
                    this.body[0].draggable = false;
                for(var index = 0; index < this.levels.length; index++) {
                    this.levels[index].css('display', 'none');
                }
            }
        }
    });

    var SettingsPage = TabPage.extend({
        init: function(frame, game) {
            this._super('#characterDialogFrameSettingsPage');
            this.game = game;
        },

        assign: function() {

        }
    });

    var SkillPage = TabPage.extend({
        init: function(frame, game) {
            this._super('#characterDialogFrameSkillPage');
            this.game = game;
            this.skills = [];
        },

        setSkill: function(name, level) {
            this.skills.push(
                {name: name, level: level, skill: null}
            );
        },

        clear: function() {
            for (var i = this.skills.length-1; i >= 0; --i)
            {
                var tSkill = this.skills[i];
                if(tSkill.skill) {
                    tSkill.skill.background.css({
                        'display': 'none'
                    });
                    $('#characterSkill1' + i).attr('title', '');
                    tSkill.skill.setLevel(0);
                }
                delete this.skills[i];
            }
            this.skills = [];
        },

        assign: function(player) {
            var scale = this.game.renderer.getScaleFactor();
            if (this.game.renderer.mobile)
                scale = 1;

            var passiveSkillId = 0,
                activeSkillId = 0;

            for (var id = 0; id < this.skills.length; id++) {
                var skill = this.skills[id],
                    skillData = SkillData.Names[skill.name],
                    isPassive = skillData.type == 'passive';

                if (skill) {
                    var iconOffset = skillData.iconOffset[scale - 1],
                        skillId = id + 10,
                        s = new Skill('#characterSkill' + skillId, skill.name, iconOffset, this.game);

                    s.background.css({
                        'position': 'absolute',
                        'left': '' + ((isPassive ? passiveSkillId : activeSkillId) % 2 ? 70 : 14) * scale + 'px',
                        'top': '' + (isPassive ? 113 + (Math.floor(passiveSkillId / 2) * 20) : 17 + (Math.floor(activeSkillId / 2) * 20)) * scale + 'px',
                        "width": '42px',
                        'height': '15px',
                        'display': 'block'
                    });

                    this.skills[id].skill = s;
                    $("#characterSkill" + skillId).attr('title', skill.name + " Lv: " + skill.level);
                    s.setLevel(skill.level);

                    if (isPassive)
                        passiveSkillId++;
                    else
                        activeSkillId++;

                }
            }
        }
    });

    var PageNavigator = Class.extend({
        init: function() {
            this.body = $('#characterDialogFramePageNavigator');
            this.movePreviousButton = $('#characterDialogFramePageNavigatorMovePreviousButton');
            this.moveNextButton = $('#characterDialogFramePageNavigatorMoveNextButton');

            this.changeHandler = null;

            var self = this;

            this.movePreviousButton.click(function(event) {
                if(self.index > 1) {
                    self.setIndex(self.index - 1);
                }
            });
            this.moveNextButton.click(function(event) {
                if(self.index < self.count) {
                    self.setIndex(self.index + 1);
                }
            });
        },

        getCount: function() {
            return this.count;
        },
        setCount: function(value) {
            this.count = value;
        },
        getIndex: function() {
            return this.index;
        },
        setIndex: function(value) {
            this.index = value;

            this.movePreviousButton.attr('class', this.index > 1 ? 'enabled' : '');
            this.moveNextButton.attr('class', this.index < this.count ? 'enabled' : '');

            if(this.changeHandler)
                this.changeHandler(this);
        },
        getVisible: function() {
            return this.body.css('display') === 'block';
        },
        setVisible: function(value) {
            this.body.css('display', value ? 'block' : 'none');
        },

        onChange: function(handler) {
            this.changeHandler = handler;
        }
    });

    var Frame = TabBook.extend({
        init: function(parent, game) {
            this._super('#characterDialogFrame');

            this.parent = parent;
            this.game = game;
            this.add(new StatePage(this, this.game));
            this.add(new SkillPage(this, this.game));
            this.add(new SettingsPage(this, this.game));

            this.pageNavigator = new PageNavigator();
            this.pageNavigator.setCount(this.getPageCount());

            var self = this;

            this.pageNavigator.onChange(function(sender) {
                self.setPageIndex(sender.getIndex() - 1);
            });
        },

        open: function(datas) {
            this.pages[0].assign(datas);
            this.pages[1].assign(this.game.player);
            this.pageNavigator.setIndex(1);
        }
    });

    CharacterDialog = Dialog.extend({
        init: function(game) {
            this._super(game, '#characterDialog');
            this.game = game;
            this.frame = new Frame(this, this.game); // send the game... easier right?
        },

        show: function(datas) {
            this.frame.open(datas);

            if(this.button){
                this.button.down();
            }

            this._super();
        },
        hide: function() {
            this._super();

            if(this.button){
                this.button.up();
            }
        }
    });

    return CharacterDialog;
});
