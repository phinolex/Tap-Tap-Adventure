define(['dialog', 'tabbook', 'tabpage', 'item'], function(Dialog, TabBook, TabPage, Item) {
    var StatePage = TabPage.extend({
        init: function() {
            this._super('#characterDialogFrameStatePage');
        },
        assign: function(datas) {
            var game = this.parent.parent.game,
                player = {
                    kind: datas[0],
                    armor: datas[1],
                    armorEnchantedPoint: datas[2],
                    avatar: datas[3],
                    weapon: datas[4],
                    weaponEnchantedPoint: datas[5],
                    weaponSkillKind: datas[6],
                    weaponSkillLevel: datas[7],
                    weaponAvatar: datas[8],
                    pendant: datas[9],
                    pendantEnchantedPoint: datas[10],
                    pendantSkillKind: datas[11],
                    pendantSkillLevel: datas[12],
                    ring: datas[13],
                    ringEnchantedPoint: datas[14],
                    ringSkillKind: datas[15],
                    ringSkillLevel: datas[16],
                    boots: datas[17],
                    bootsEnchantedPoint: datas[18],
                    bootsSkillKind: datas[19],
                    bootsSkillLevel: datas[20],
                    experience: datas[21],
                    level: datas[22],
                    maxHitPoints: datas[23],
                    hitPoints: datas[24],
                    admin: datas[25]
                },
                weapon, armor,
                width1, height1, width2, height2, width3, height3;

            if(!player.avatar){
                player.avatar = player.armor;
            }
            if(!player.weaponAvatar){
                player.weaponAvatar = player.weapon;
            }

            for(var i = 0; i < game.dialogs.length; i++) {
                if((game.dialogs[i] != this) && game.dialogs[i].visible){
                    game.dialogs[i].hide();
                }
            }

            $('#characterName').text(game.player.name);
            $('#characterLevel').text(player.level);
            $('#characterExp').text(
                player.experience
            );

            if(player.pendant) {
                $('#characterItemPendant').css('background-image', 'url("img/2/item-' + Types.getKindAsString(player.pendant) + '.png")');
                $('#characterItemPendant').attr('class', '');
                $('#characterItemPendant').attr(
                    'title',
                    Item.getInfoMsgEx(player.pendant, player.pendantEnchantedPoint, player.pendantSkillKind, player.pendantSkillLevel)
                );
            } else {
                $('#characterItemPendant').attr('class', 'empty');
            }

            $('#characterItemWeapon').css('background-image', 'url("img/2/item-' + Types.getKindAsString(player.weapon) + '.png")');
            $('#characterItemWeapon').attr(
                'title',
                Item.getInfoMsgEx(player.weapon, player.weaponEnchantedPoint, player.weaponSkillKind, player.weaponSkillLevel)
            );

            $('#characterItemArmor').css('background-image', 'url("img/2/item-' + Types.getKindAsString(player.armor) + '.png")');
            $('#characterItemArmor').attr(
                'title',
                Item.getInfoMsgEx(player.armor, 0, 0, 0)
            );

            if(player.ring) {
                $('#characterItemRing').css('background-image', 'url("img/2/item-' + Types.getKindAsString(player.ring) + '.png")');
                $('#characterItemRing').attr('class', '');
                $('#characterItemRing').attr(
                    'title',
                    Item.getInfoMsgEx(player.ring, player.ringEnchantedPoint, player.ringSkillKind, player.ringSkillLevel)
                );
            } else {
                $('#characterItemRing').attr('class', 'empty');
            }

            if(player.boots) {
                $('#characterItemBoots').css('background-image', 'url("img/2/item-' + Types.getKindAsString(player.boots) + '.png")');
                $('#characterItemBoots').attr('class', '');
                $('#characterItemBoots').attr(
                    'title',
                    Item.getInfoMsgEx(player.boots, player.bootsEnchantedPoint, player.bootsSkillKind, player.bootsSkillLevel)
                );
            } else {
                $('#characterItemBoots').attr('class', 'empty');
            }

            weapon = game.sprites[Types.getKindAsString(player.weaponAvatar)];
            armor = game.sprites[Types.getKindAsString(player.avatar)];

            width1 = weapon.width * 2;
            height1 = weapon.height * 2;

            width2 = armor.width * 2;
            height2 = armor.height * 2;

            width3 = Math.max(width1, width2);
            height3 = Math.max(height1, height2);

            $('#characterLook').css('left', '' + (126 - parseInt(width3 / 2)) + 'px');
            $('#characterLook').css('top', '' + (300 - height2) + 'px');
            $('#characterLook').css('width', '' + width3 + 'px');
            $('#characterLook').css('height', '' + height3 + 'px');

            $('#characterLookShadow').css('left', '' + parseInt(((width3 - width2) / 2) + ((width2 - 32) / 2)) + 'px');
            $('#characterLookShadow').css('top', '' + parseInt(((height3 - height2) / 2) + (height2 - 38)) + 'px');

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

            $('#characterLookArmor').css('background-image', 'url("img/2/' + Types.getKindAsString(player.avatar) + '.png")');
            $('#characterLookWeapon').css('background-image', 'url("img/2/' + Types.getKindAsString(player.weaponAvatar) + '.png")');
        }
    });

    var Skill = Class.extend({
        init: function(id, name, position) {
            this.background = $(id);
            this.body = $(id + 'Body');
            this.levels = [];
            this.name = name;
            this.level = 0;

            this.body.css({
                'position': 'absolute',
                'left': '0px',
                'top': '0px',
                'width': '32px',
                'height': '30px',
                'display': 'none'
            });
            if(position) {
                this.body.css({
                    'background-image': 'url("img/2/characterdialogsheet.png")',
                    'background-position': position
                });
            }

            for(var index = 0; index < 4; index++) {
                var level = $(id + 'Level' + (1 + index));
                level.css({
                    'position': 'absolute',
                    'left': '' + (38 + (index * 12)) + 'px',
                    'top': '18px',
                    'width': '10px',
                    'height': '12px',
                    'background-image': 'url("img/2/characterdialogsheet.png")',
                    'background-position': '-254px -438px',
                    'display': 'none'
                });
                this.levels.push(level);
            }

            var self = this;

            this.body.unbind('dragstart').bind('dragstart', function(event) {
                event.originalEvent.dataTransfer.setData("skllName", self.name);
                DragData = {};
                DragData.skillName = self.name;
            });
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
                this.body[0].draggable = true;
                for(var index = 0; index < value; index++) {
                    this.levels[index].css('display', 'block');
                }
                for(var index = value; index < this.levels.length; index++) {
                    this.levels[index].css('display', 'none');
                }
            } else {
                this.body.css('display', 'none');
                this.body[0].draggable = false;
                for(var index = 0; index < this.levels.length; index++) {
                    this.levels[index].css('display', 'none');
                }
            }
        }
    });

    var skill1Names = ['evasion', 'bloodSucking', 'criticalStrike', '', '', '', '', ''];
    var skill1Positions = ['-286px -454px', '-254px -454px', '-318px -454px', '', '', '', '', ''];
    var skill2Names = ['heal', 'flareDance', 'stun', 'superCat', 'provocation', '', '', ''];
    var skill2Positions = ['-350px -454px', '-382px -454px', '-414px -454px', '-446px -454px', '-254px -484px', '', ''];

    var SkillPage = TabPage.extend({
        init: function(frame) {
            this._super('#characterDialogFrameSkillPage');

            this.skills = [];

            for(var index = 0; index < 8; index++) {
                if(skill1Names[index]) {
                    var skill = new Skill('#characterSkill1' + index, skill1Names[index], skill1Positions[index]);
                    skill.background.css({
                        'position': 'absolute',
                        'left': '' + ((index % 2) ? 140 : 28) + 'px',
                        'top': '' + (34 + (Math.floor(index / 2) * 40)) + 'px',
                        'width': '84px',
                        'height': '30px',
                        'display': 'block'
                    });
                    this.skills.push(skill);
                }
            }
            for(var index = 0; index < 8; index++) {
                if(skill2Names[index]) {
                    var skill = new Skill('#characterSkill2' + index, skill2Names[index], skill2Positions[index]);
                    skill.background.css({
                        'position': 'absolute',
                        'left': '' + ((index % 2) ? 140 : 28) + 'px',
                        'top': '' + (226 + (Math.floor(index / 2) * 40)) + 'px',
                        'width': '84px',
                        'height': '30px',
                        'display': 'block'
                    });
                    this.skills.push(skill);
                }
            }
        },

        setSkill: function(name, level) {
            for(var index = 0; index < this.skills.length; index++) {
                var skill = this.skills[index];
                if(skill.name == name) {
                    skill.setLevel(level);

                    break;
                }
            }
        },

        assign: function(player) {
            for(var name in player.skillHandler.skills) {
                var skill = player.skillHandler.skills[name];
                this.setSkill(skill.name, skill.level);
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

            if(this.changeHandler) {
                this.changeHandler(this);
            }
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
            this.add(new StatePage(this));
            this.add(new SkillPage(this));

            this.pageNavigator = new PageNavigator();
            this.pageNavigator.setCount(this.getPageCount());

            var self = this;

            this.pageNavigator.onChange(function(sender) {
                self.setPageIndex(sender.getIndex() - 1);
            });
        },

        open: function(datas) {
            this.pages[0].assign(datas);
            this.pages[1].assign(this.parent.game.player);
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
