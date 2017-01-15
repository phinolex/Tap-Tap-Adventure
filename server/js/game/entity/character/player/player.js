/* global require, module, log, databaseHandler */

var cls = require("./../../../lib/class"),
    _ = require("underscore"),
    Character = require('./../character'),
    Chest = require('./../../item/chest'),
    Messages = require("./../../../network/packets/message"),
    Utils = require("./../../../utils/utils"),
    MobData = require("./../../../utils/data/mobdata"),
    Formulas = require("./../../../utils/formulas"),
    Party = require("./party"),
    Items = require("./../../../utils/data/itemdata"),
    Bank = require("./bank/bank"),
    Types = require("../../../../../../shared/js/gametypes"),
    ItemTypes = require("../../../../../../shared/js/itemtypes"),
    bcrypt = require('bcrypt'),
    Inventory = require("./inventory/inventory"),
    Mob = require('./../mob/mob'),
    SkillHandler = require("./../../../handlers/skillhandler"),
    Variations = require('./../../../utils/variations'),
    Trade = require('./trade'),
    express = require('express'),
    bodyParser = require('body-parser'),
    app = express(),
    Achievements = require('./../../../utils/data/achievementdata'),
    request = require("request"),
    EntitySpawn = require("./../../entityspawn"),
    PacketHandler = require("./../../../handlers/packethandler"),
    Quests = require('./../../../utils/data/questdata'),
    QuestHandler = require('../../../handlers/questhandler');

module.exports = Player = Character.extend({
    init: function (connection, worldServer, databaseHandler) {
        var self = this;

        this.server = worldServer;
        this.connection = connection;
        this.redisPool = databaseHandler;

        this._super(this.connection.id, "player", 1, 0, 0, "");

        this.hasEnteredGame = false;
        this.isDead = false;
        this.haters = {};
        this.lastCheckpoint = null;
        this.friends = {};
        this.ignores = {};
        this.pets = [];
        this.inventory = null;
        this.pvpFlag = false;
        this.gameFlag = false;
        this.bannedTime = 0;
        this.banUseTime = 0;
        this.membershipTime = 0;
        this.experience = 0;
        this.level = 0;
        this.lastWorldChatMinutes = 99;
        this.achievement = [];
        this.royalAzaleaBenefTimeout = null;
        this.cooltimeTimeout = null;
        this.consumeTimeout = null;
        this.rights = 0;
        this.skillHandler = new SkillHandler();
        this.inPVPLobby = false;
        this.inPVPGame = false;
        this.healExecuted = 0;
        this.flareDanceCallback = null;
        this.flareDanceExecuted1 = 0;
        this.flareDanceExecuted2 = 0;
        this.flareDanceCount = 0;
        this.activeSkill = 0;
        this.stunExecuted = 0;
        this.quests = [];
        this.superCatCallback = null;
        this.superCatExecuted = 0;
        this.poisoned = false;
        this.provocationExecuted = 0;
        this.pubPointBuyTimeout = null;
        this.variations = new Variations();
        this.membership = false;
        this.chatBanEndTime = 0;
        this.isPlayer = true;
        this.hasFocus = true;
        this.attackedTime = new Timer(950);
        this.pClass = 0;
        this.minigameTeam = -1;
        this.talkingAllowed = true;
        this.questHandler = new QuestHandler(this);
        this.packetHandler = new PacketHandler(this, connection, worldServer, databaseHandler);
    },


    destroy: function () {
        var self = this;

        this.forEachAttacker(function (mob) {
            mob.clearTarget();
        });
        this.attackers = {};

        this.forEachHater(function (mob) {
            mob.forgetPlayer(self.id);
        });
        this.haters = {};
    },

    getState: function () {
        var basestate = this._getBaseState(),
            state = [this.name, this.orientation, this.armor, this.weapon, this.level];

        if (this.target) {
            state.push(this.target.id);
        }

        return basestate.concat(state);
    },

    send: function (message) {
        this.connection.send(message);
    },

    verifyPositioning: function () {

    },

    flagPVP: function (pvpFlag) {
        if (this.pvpFlag !== pvpFlag) {
            this.pvpFlag = pvpFlag;
            this.server.pushToPlayer(this, new Messages.PVP(this.pvpFlag));
            this.server.pushToPlayer(this, new Messages.Chat(this, this.pvpFlag ? "You are now in a PVP zone!" : "You are no longer in a PVP zone!"));
        }
    },

    checkGameFlag: function (gameFlag) {
        if (this.gameFlag !== gameFlag) {
            this.gameFlag = gameFlag;
            this.server.pushToPlayer(this, new Messages.GameFlag(this.gameFlag));
            this.server.pushToPlayer(this, new Messages.Chat(this, this.gameFlag ? "You have entered the lobby!" : "You are no longer in lobby."));

            if (this.gameFlag)
                this.server.getMinigameHandler().getPVPMinigame().addPlayer(this);
            else
                this.server.getMinigameHandler().getPVPMinigame().removePlayer(this);
        }
    },

    equip: function (item) {
        return new Messages.EquipItem(this, item);
    },

    addHater: function (mob) {
        if (mob) {
            if (!(mob.id in this.haters)) {
                this.haters[mob.id] = mob;
            }
        }
    },

    removeHater: function (mob) {
        if (mob && mob.id in this.haters) {
            delete this.haters[mob.id];
        }
    },

    forEachHater: function (callback) {
        _.each(this.haters, function (mob) {
            callback(mob);
        });
    },

    equipArmor: function (kind, enchantedPoint, skillKind, skillLevel) {
        this.armor = kind;
        this.armorEnchantedPoint = enchantedPoint;
        this.armorLevel = ItemTypes.getArmorLevel(kind) + enchantedPoint;
        this.armorSkillKind = skillKind;
        this.armorSkillLevel = skillLevel;
    },
    equipWeapon: function (kind, enchantedPoint, skillKind, skillLevel) {
        this.weapon = kind;
        this.weaponEnchantedPoint = enchantedPoint;
        this.weaponLevel = ItemTypes.getWeaponLevel(kind) + enchantedPoint;
        this.weaponSkillKind = skillKind;
        this.weaponSkillLevel = skillLevel;
    },

    equipPendant: function (kind, enchantedPoint, skillKind, skillLevel) {
        this.pendant = kind;
        this.pendantEnchantedPoint = enchantedPoint;
        this.pendantLevel = ItemTypes.getPendantLevel(kind) + enchantedPoint;
        this.pendantSkillKind = skillKind;
        this.pendantSkillLevel = skillLevel;
    },

    equipRing: function (kind, enchantedPoint, skillKind, skillLevel) {
        this.ring = kind;
        this.ringEnchantedPoint = enchantedPoint;
        this.ringLevel = ItemTypes.getRingLevel(kind) + enchantedPoint;
        this.ringSkillKind = skillKind;
        this.ringSkillLevel = skillLevel;
    },

    equipBoots: function (kind, enchantedPoint, skillKind, skillLevel) {
        this.boots = boots;
        this.bootsEnchantedPoint = enchantedPoint;
        this.bootsLevel = ItemTypes.getBootsLevel(kind) + enchantedPoint;
        this.bootsSkillKind = skillKind;
        this.bootsSkillLevel = skillLevel;
    },

    equipItem: function (itemKind, enchantedPoint, skillKind, skillLevel, isAvatar) {
        if (itemKind) {
            if (ItemTypes.isArmor(itemKind) || ItemTypes.isArcherArmor(itemKind)) {
                databaseHandler.equipArmor(this.name, ItemTypes.getKindAsString(itemKind), enchantedPoint, skillKind, skillLevel);
                this.equipArmor(itemKind, enchantedPoint, skillKind, skillLevel);
            } else if (ItemTypes.isWeapon(itemKind) || ItemTypes.isArcherWeapon(itemKind)) {
                databaseHandler.equipWeapon(this.name, ItemTypes.getKindAsString(itemKind), enchantedPoint, skillKind, skillLevel);
                this.equipWeapon(itemKind, enchantedPoint, skillKind, skillLevel);
            } else if (ItemTypes.isPendant(itemKind)) {
                databaseHandler.equipPendant(this.name, ItemTypes.getKindAsString(itemKind), enchantedPoint, skillKind, skillLevel);
                this.equipPendant(itemKind, enchantedPoint, skillKind, skillLevel);
            } else if (ItemTypes.isRing(itemKind)) {
                databaseHandler.equipRing(this.name, ItemTypes.getKindAsString(itemKind), enchantedPoint, skillKind, skillLevel);
                this.equipRing(itemKind, enchantedPoint, skillKind, skillLevel);
            }
        }
    },
    unequipItem: function (itemKind) {
        if (itemKind) {
            log.debug(this.name + " unequips " + ItemTypes.getKindAsString(itemKind));

            if (ItemTypes.isArmor(itemKind) || ItemTypes.isArcherArmor(itemKind)) {
                databaseHandler.equipArmor(this.name, '', 0, 0, 0);
                this.equipArmor(0, 0, 0, 0);
            } else if (ItemTypes.isWeapon(itemKind) || ItemTypes.isArcherWeapon(itemKind)) {
                databaseHandler.equipWeapon(this.name, '', 0, 0, 0);
                this.equipWeapon(0, 0, 0, 0);
            } else if (ItemTypes.isPendant(itemKind)) {
                databaseHandler.equipPendant(this.name, '', 0, 0, 0);
                this.equipPendant(0, 0, 0, 0);
            } else if (ItemTypes.isRing(itemKind)) {
                databaseHandler.equipRing(this.name, '', 0, 0, 0);
                this.equipRing(0, 0, 0, 0);
            }
        }
    },

    updateHitPoints: function () {
        this.resetHitPoints(this.getHp());
        this.resetMana(this.getMp());
    },

    refreshMaxHitpoints: function () {

    },

    updatePosition: function () {
        if (this.requestpos_callback) {
            var pos = this.requestpos_callback();
            this.setPosition(pos.x, pos.y);
        }
    },

    getSpawnPoint: function () {
        var self = this,
            playerTeam = self.getTeam(),
            offset = Utils.randomInt(-2, 2);

        if (playerTeam == Types.Messages.REDTEAM)
            return [163 + offset, 499 + offset];
        else if (playerTeam == Types.Messages.BLUETEAM)
            return [133 + offset, 471 + offset];
        else
            return [325 + offset, 87 + offset];
    },

    onRequestPosition: function (callback) {
        this.requestpos_callback = callback;
    },

    achievementAboutKill: function (mob) {
        var self = this;

        for (var i = 0; i < Object.keys(Achievements.AchievementData).length; i++) {
            var achievement = Achievements.AchievementData[i];
            if (achievement.type == 2) {
                this.tmpAchievement = achievement;
                this._achievementAboutKill(mob.kind, achievement, function (achievement) {
                    if (self.tmpAchievement.xp) {
                        self.incExp(self.tmpAchievement.xp);
                        //self.server.pushToPlayer(self, new Messages.Kill(mob, self.level, self.experience));
                    }


                    var skillName = self.tmpAchievement.skillName;
                    var skillLevel = self.tmpAchievement.skillLevel;
                    if (skillName && skillLevel) {
                        self.skillHandler.add(skillName, skillLevel);
                        var index = self.skillHandler.getIndexByName(skillName);
                        databaseHandler.handleSkills(self, index, skillName, skillLevel);
                        self.server.pushToPlayer(self, new Messages.SkillLoad(index, skillName, skillLevel));
                    }
                });
            }
        }
    },

    achievementAboutItem: function (npcKind, achievementNumber, itemKind, itemCount, callback) {
        var achievementData = Achievements.AchievementData[achievementNumber],
            achievement = this.achievement[achievementNumber];

        if (achievement.found && achievement.progress !== 999) {
            if (this.inventory.hasItems(itemKind, itemCount)) {
                this.inventory.takeOut(itemKind, itemCount);
                this.send([Types.Messages.ACHIEVEMENT, "complete", achievementNumber]);
                achievement.progress = 999;

                if (callback) callback();

                databaseHandler.progressAchievement(this.name, achievementNumber, 999);
                this.incExp(achievementData.xp);
                //self.server.pushToPlayer(this, new Messages.Kill("null", self.level, self.experience));
                this.server.pushToPlayer(this, new Messages.TalkToNPC(npcKind, achievementNumber, true));
            } else
                this.server.pushToPlayer(this, new Messages.TalkToNPC(npcKind, achievementNumber, false));
        }

    },

    _achievementAboutKill: function (mobKind, achievement, callback) {
        if (achievement.mobId.length > 1 && (achievement.mobId.indexOf(mobKind) > -1) ||
            (mobKind === achievement.mobId) ||
            (achievement.mobId == 0 && MobData.Kinds[mobKind].level * 2 > this.level)) {
            if (achievement.requirement === 1 && this.weapon)
                return;

            var achievementId = achievement.id;
            var mobCount = achievement.mobCount;
            var achievement = this.achievement[achievement.id];

            if (achievement.found && achievement.progress !== 999) {
                if (isNaN(achievement.progress))
                    achievement.progress = 1;
                else
                    achievement.progress++;

                if (achievement.progress >= mobCount) {
                    this.send([Types.Messages.ACHIEVEMENT, "complete", achievementId]);
                    achievement.progress = 999;
                    if (callback)
                        callback();
                }

                databaseHandler.progressAchievement(this.name, achievementId, achievement.progress);
                if (achievement.progress < mobCount) {
                    this.send([Types.Messages.ACHIEVEMENT, "progress", achievementId, achievement.progress]);
                }
            }
        }
    },

    foundAchievement: function (achievementId) {
        var self = this;

        self.achievement[achievemntId] = {};
        self.achievement[achievementId].found = true;
        self.redisPool.foundAchievement(self.name, achievementId);
        self.server.pushToPlayer(self, new Messages.Achievement('found', achievementId));
    },

    incExp: function (gotexp, mob) {
        var self = this,
            receivedExp = gotexp;

        if (mob) {
            var mobLevel = MobData.Kinds[mob.kind].level;
            if (mobLevel > self.level) {
                var multiplier = Utils.randomRange(1.2, 1.2 + (mobLevel - self.level) / 7);
                receivedExp *= multiplier;
            }
        }

        if (isNaN(receivedExp) || receivedExp < 0)
            receivedExp = 1;

        self.experience += parseInt(Math.round(receivedExp));

        var previousLevel = self.level;
        self.level = Types.getLevel(self.experience);

        if (previousLevel != self.level)
            self.updateHitPoints();

        self.server.pushToPlayer(self, new Messages.PlayerPoints(self.maxHitPoints, self.maxMana, self.hitPoints, self.mana));

        self.redisPool.setExp(self.name, self.experience);

        return parseInt(Math.round(receivedExp));
    },

    checkName: function (name) {
        if (name === null) return false;
        else if (name === '') return false;
        else if (name === ' ') return false;

        for (var i = 0; i < name.length; i++) {
            var c = name.charCodeAt(i);

            if (!((0xAC00 <= c && c <= 0xD7A3) || (0x3131 <= c && c <= 0x318E)       // Korean (Unicode blocks "Hangul Syllables" and "Hangul Compatibility Jamo")
                || (0x61 <= c && c <= 0x7A) || (0x41 <= c && c <= 0x5A)             // English (lowercase and uppercase)
                || (0x30 <= c && c <= 0x39)                                         // Numbers
                || (c === 0x20) || (c === 0x5f)                                       // Space and underscore
                || (c === 0x28) || (c === 0x29)                                       // Parentheses
                || (c === 0x5e))) {                                                  // Caret
                return false;
            }
        }
        return true;
    },

    movePlayer: function (x, y) {
        var self = this,
            message = [Types.Messages.TELEPORT, self.id, x, y];

        self.send(message);
    },

    setMaxes: function () {
        this.setMaxHitPoints(40);
        this.setMaxMana(10);
    },

    sendWelcome: function (armor, weapon, exp,
                           bannedTime, banUseTime, x, y, chatBanEndTime, rank,
                           armorEnchantedPoint, armorSkillKind, armorSkillLevel,
                           weaponEnchantedPoint, weaponSkillKind, weaponSkillLevel,
                           pendant, pendantEnchantedPoint, pendantSkillKind, pendantSkillLevel,
                           ring, ringEnchantedPoint, ringSkillKind, ringSkillLevel,
                           boots, bootsEnchantedPoint, bootsSkillKind, bootsSkillLevel,
                           membership, membershipTime, kind, rights, pClass, poisoned, hitpoints,
                           mana, ttacoins, pvpKills, pvpDeaths) {

        var self = this;
        self.kind = kind;
        self.rights = rights;
        self.equipArmor(ItemTypes.getKindFromString(armor), armorEnchantedPoint, armorSkillKind, armorSkillLevel);
        self.equipWeapon(ItemTypes.getKindFromString(weapon), weaponEnchantedPoint, weaponSkillKind, weaponSkillLevel);
        self.equipPendant(ItemTypes.getKindFromString(pendant), pendantEnchantedPoint, pendantSkillKind, pendantSkillLevel);
        self.equipRing(ItemTypes.getKindFromString(ring), ringEnchantedPoint, ringSkillKind, ringSkillLevel);
        //self.equipBoots(ItemTypes.getKindFromString(boots), bootsEnchantedPoint, bootsSkillKind, bootsSkillLevel)
        self.membership = membership;
        self.bannedTime = bannedTime;
        self.banUseTime = banUseTime;
        self.membershipTime = membershipTime;
        self.chatBanEndTime = chatBanEndTime;
        self.experience = parseInt(Math.floor(exp));
        self.level = Types.getLevel(self.experience);
        self.poisoned = poisoned;
        self.orientation = Utils.randomOrientation;
        self.pClass = pClass;
        self.TTACoins = ttacoins;
        self.pvpKills = pvpKills;
        self.pvpDeaths = pvpDeaths;
        self.updateHitPoints();
        self.setHitPoints(hitpoints);
        self.setMana(mana);

        if (x === 0 && y === 0)
            self.updatePosition();
        else
            self.setPosition(x, y);

        self.server.addPlayer(self);
        self.server.enter_callback(self);

        databaseHandler.getBankItems(self, function (maxBankNumber, bankKinds, bankNumbers, bankSkillKinds, bankSkillLevels) {
            self.bank = new Bank(self, maxBankNumber, bankKinds, bankNumbers, bankSkillKinds, bankSkillLevels);
            databaseHandler.getAllInventory(self, function (maxInventoryNumber, itemKinds, itemNumbers, itemSkillKinds, itemSkillLevels) {
                self.inventory = new Inventory(self, maxInventoryNumber, itemKinds, itemNumbers, itemSkillKinds, itemSkillLevels);
                databaseHandler.loadAchievement(self, function () {
                    var i = 0;
                    var sendMessage = [
                        Types.Messages.WELCOME,
                        self.id, // 1
                        self.name, //2
                        self.x, //3
                        self.y, //4
                        self.maxHitPoints ? self.maxHitPoints : 40, //5
                        self.armor, //6
                        self.weapon, //7
                        self.experience, //10
                        self.maxMana ? self.maxMana : 10, //11
                        self.variations.doubleEXP, //12
                        self.variations.expMultiplier, //13
                        self.membership, //14
                        self.kind, //15
                        self.rights, //16
                        self.pClass,
                        self.pendant,
                        self.ring,
                        self.boots
                    ];

                    sendMessage.push(self.inventory.number);
                    for (i = 0; i < self.inventory.number; i++) {
                        sendMessage.push(self.inventory.rooms[i].itemKind);
                        sendMessage.push(self.inventory.rooms[i].itemNumber);
                        sendMessage.push(self.inventory.rooms[i].itemSkillKind);
                        sendMessage.push(self.inventory.rooms[i].itemSkillLevel);
                    }

                    sendMessage.push(self.bank.number);
                    for (i = 0; i < self.bank.number; i++) {
                        sendMessage.push(self.bank.rooms[i].itemKind);
                        sendMessage.push(self.bank.rooms[i].itemNumber);
                        sendMessage.push(self.bank.rooms[i].itemSkillKind);
                        sendMessage.push(self.bank.rooms[i].itemSkillLevel);
                    }

                    var achievementLength = Object.keys(Achievements.AchievementData).length;
                    sendMessage.push(achievementLength);
                    for (i = 0; i < achievementLength; ++i) {
                        sendMessage.push(self.achievement[i].found);
                        sendMessage.push(self.achievement[i].progress);
                    }

                    self.send(sendMessage);

                    /*databaseHandler.loadSkillSlots(self, function(names) {
                     for(var index = 0; index < names.length; index++) {
                     if(names[index]) {
                     self.skillHandler.install(index, names[index]);
                     self.skillHandler.add(names[index], 3);
                     self.send((new Messages.SkillInstall(index, names[index])).serialize());
                     }
                     }
                     self.setAbility();
                     });*/

                    self.reviewSkills();

                    databaseHandler.loadPets(self, function (kinds) {
                        for (var index = 0; index < kinds.length; index++) {
                            if (kinds[index])
                                var pet = self.server.addPet(self, kinds[index], self.x, self.y);
                        }
                    });

                });
            });
        });

        self.hasEnteredGame = true;
        self.isDead = false;
    },

    canEquipArmor: function (itemKind) {
        var armourLevel = ItemTypes.getArmorLevel(itemKind);

        if (this.name == "Tachyon")
            return true;

        if (armourLevel * 2 > this.level) {
            this.server.pushToPlayer(this, new Messages.GuiNotify("You need to be at least level " + armourLevel * 2 + " to equip this."));
            return false;
        }

        /*if ((ItemTypes.isArmor(itemKind) && (this.pClass != Types.PlayerClass.FIGHTER && this.pClass != Types.PlayerClass.DEFENDER)) ||
         (ItemTypes.isArcherArmor(itemKind) && this.pClass != Types.PlayerClass.ARCHER)) {

         this.server.pushToPlayer(this, new Messages.GuiNotify("Your class cannot wield this armour."));
         return false;
         }*/

        return true;
    },

    canEquipWeapon: function (itemKind) {
        var weaponLevel = ItemTypes.getWeaponLevel(itemKind);

        if (this.name == "Tachyon")
            return true;

        if (weaponLevel * 2 > this.level) {
            this.server.pushToPlayer(this, new Messages.GuiNotify("You need to be at least level " + weaponLevel * 2 + " to wield this."));
            return false;
        }

        /*if ((ItemTypes.isWeapon(itemKind) && (this.pClass != Types.PlayerClass.FIGHTER && this.pClass != Types.PlayerClass.DEFENDER)) ||
         (ItemTypes.isArcherWeapon(itemKind) && this.pClass != Types.PlayerClass.ARCHER)) {

         this.server.pushToPlayer(this, new Messages.GuiNotify("Your class cannot wield this weapon."));
         return false;
         }*/

        return true;
    },

    canEquipPendant: function (itemKind) {
        var pendantLevel = ItemTypes.getPendantLevel(itemKind);

        var achievement = Achievements.AchievementData[23];

        if (this.achievement[23].progress != 999) {
            this.server.pushToPlayer(this, new Messages.GuiNotify("You must have completed: " + achievement.name + " to equip this."));
            return false;
        }

        if (pendantLevel * 2 > this.level) {
            this.server.pushToPlayer(this, new Messages.GuiNotify("You need to be at least level " + (pendantLevel * 2) + " to equip this."));
            return false;
        }

        return true;
    },

    canEquipRing: function (itemKind) {
        var ringLevel = ItemTypes.getRingLevel(itemKind);

        var achievement = Achievements.AchievementData[20];

        if (this.achievement[20].progress != 999) {
            this.server.pushToPlayer(this, new Messages.GuiNotify("You must have completed: " + achievement.name + " to equip this."));
            return false;
        }

        if (ringLevel * 2 > this.level) {
            this.server.pushToPlayer(this, new Messages.GuiNotify("You need to be at least level " + (ringLevel * 2) + " to equip this."));
            return false;
        }

        return true;
    },

    handleInventoryWeaponUnequip: function () {
        if (this.inventory.putInventory(this.weapon, this.weaponEnchantedPoint, this.weaponSkillKind, this.weaponSkillLevel)) {
            this.unequipItem(this.weapon);
            this.packetHandler.broadcast(this.equip(-1), false);
            return true;
        }
        return false;
    },

    handleInventoryArmorUnequip: function () {
        if (this.inventory.putInventory(this.armor, this.armorEnchantedPoint, this.armorSkillKind, this.armorSkillLevel)) {
            this.unequipItem(this.armor);
            this.packetHandler.broadcast(this.equip(-2), false);
            return true;
        }
        return false;
    },

    handleInventoryPendantUnequip: function () {
        if (this.inventory.putInventory(this.pendant, this.pendantEnchantedPoint, this.pendantSkillKind, this.pendantSkillLevel)) {
            this.unequipItem(this.pendant);
            this.packetHandler.broadcast(this.equip(-3), false);
            return true;
        }
        return false;
    },

    handleInventoryRingUnequip: function () {
        if (this.inventory.putInventory(this.ring, this.ringEnchantedPoint, this.ringSkillKind, this.ringSkillLevel)) {
            this.unequipItem(this.ring);
            this.packetHandler.broadcast(this.equip(-4), false);
            return true;
        }
        return false;
    },

    handleInventoryWeapon: function (itemKind, inventoryNumber) {
        if (inventoryNumber == -1) {
            this.handleInventoryWeaponUnequip();
            return;
        }

        if (!this.canEquipWeapon(itemKind))
            return;

        var enchantedPoint = this.inventory.rooms[inventoryNumber].itemNumber;
        var weaponSkillKind = this.inventory.rooms[inventoryNumber].itemSkillKind;
        var weaponSkillLevel = this.inventory.rooms[inventoryNumber].itemSkillLevel;

        this.inventory.setInventory(inventoryNumber, this.weapon, this.weaponEnchantedPoint, this.weaponSkillKind, this.weaponSkillLevel);

        this.equipItem(itemKind, enchantedPoint, weaponSkillKind, weaponSkillLevel, false);
        this.setAbility();
        //if(!this.weaponAvatar){
        this.packetHandler.broadcast(this.equip(itemKind), false);
        //}
    },

    handleInventoryArmor: function (itemKind, inventoryNumber) {
        if (inventoryNumber == -2) {
            this.handleInventoryArmorUnequip();
            return;
        }

        if (!this.canEquipArmor(itemKind)) {
            return;
        }

        //log.info("itemEnchantedLevel="+this.inventory.rooms[inventoryNumber].itemNumber);
        var itemEnchantedLevel = this.inventory.rooms[inventoryNumber].itemNumber;
        var itemSkillKind = this.inventory.rooms[inventoryNumber].itemSkillKind;
        var itemSkillLevel = this.inventory.rooms[inventoryNumber].itemSkillLevel;

        this.inventory.setInventory(inventoryNumber, this.armor, this.armorEnchantedPoint, this.armorSkillKind, this.armorSkillLevel);
        this.equipItem(itemKind, itemEnchantedLevel, itemSkillKind, itemSkillLevel, false);
        this.packetHandler.broadcast(this.equip(itemKind), false);
    },

    handleInventoryPendant: function (itemKind, inventoryNumber) {
        if (inventoryNumber == -3) {
            this.handleInventoryPendantUnequip();
            return;
        }

        if (!this.canEquipPendant(itemKind))
            return;

        var enchantedPoint = this.inventory.rooms[inventoryNumber].itemNumber;
        var pendantSkillKind = this.inventory.rooms[inventoryNumber].itemSkillKind;
        var pendantSkillLevel = this.inventory.rooms[inventoryNumber].itemSkillLevel;

        this.inventory.setInventory(inventoryNumber, this.pendant, this.pendantEnchantedPoint, this.pendantSkillKind, this.pendantSkillLevel);

        this.equipItem(itemKind, enchantedPoint, pendantSkillKind, pendantSkillLevel, false);
        this.setAbility();

        this.packetHandler.broadcast(this.equip(itemKind), false);
    },

    hasPendant: function () {
        return this.pendant != 0;
    },

    getPendant: function () {
        return this.pendant;
    },

    hasRing: function () {
        return this.ring != 0;
    },

    getRing: function () {
        return this.ring;
    },


    handleInventoryRing: function (itemKind, inventoryNumber) {
        if (inventoryNumber == -4) {
            this.handleInventoryRingUnequip();
            return;
        }

        if (!this.canEquipRing(itemKind))
            return;

        var enchantedPoint = this.inventory.rooms[inventoryNumber].itemNumber;
        var ringSkillKind = this.inventory.rooms[inventoryNumber].itemSkillKind;
        var ringSkillLevel = this.inventory.rooms[inventoryNumber].itemSkillLevel;

        this.inventory.setInventory(inventoryNumber, this.ring, this.ringEnchantedPoint, this.ringSkillKind, this.ringSkillLevel);

        this.equipItem(itemKind, enchantedPoint, ringSkillKind, ringSkillLevel, false);
        this.setAbility();

        this.packetHandler.broadcast(this.equip(itemKind), false);
    },

    handleInventoryEmpty: function (itemKind, inventoryNumber, count) {
        var self = this,
            item = self.server.addItemFromChest(itemKind, self.x, self.y);

        if (ItemTypes.isConsumableItem(item.kind) || ItemTypes.isGold(item.kind)) {
            if (count > self.inventory.rooms[inventoryNumber].itemNumber)
                count = self.inventory.rooms[inventoryNumber].itemNumber;
            else if (count < 0)
                count = 0;

            item.count = count;
        } else if (ItemTypes.isWeapon(item.kind) || ItemTypes.isArcherWeapon(item.kind) ||
            ItemTypes.isArmor(item.kind) || ItemTypes.isArcherArmor(item.kind)) {

            if (inventoryNumber > 0) {
                item.count = this.inventory.rooms[inventoryNumber].itemNumber;
                item.skillKind = this.inventory.rooms[inventoryNumber].itemSkillKind;
                item.skillLevel = this.inventory.rooms[inventoryNumber].itemSkillLevel;
            }
            else if (inventoryNumber == -1) {
                item.count = this.weaponEnchantedPoint;
                item.skillKind = this.weaponSkillKind;
                item.skillLevel = this.weaponSkillLevel;
            }
            else if (inventoryNumber == -2) {
                item.count = this.armorEnchantedPoint;
                item.skillKind = this.armorSkillKind;
                item.skillLevel = this.armorSkillLevel;
            }
        }

        if (item.count > 0) {
            this.server.pushToAdjacentGroups(this.group, new Messages.Drop(this, item));
            //this.server.addItemFromChest(itemKind, this.x, this.y);
            this.server.handleItemDespawn(item);

            if (inventoryNumber >= 0) {
                if (ItemTypes.isConsumableItem(item.kind) || ItemTypes.isGold(item.kind) || ItemTypes.isCraft(item.kind)) {
                    this.inventory.takeOutInventory(inventoryNumber, item.count);
                } else {
                    this.inventory.makeEmptyInventory(inventoryNumber);
                }
            }
            else if (inventoryNumber == -1) {
                this.unequipItem(this.weapon);
                this.packetHandler.broadcast(this.equip(-1), false);
            }
            else if (inventoryNumber == -2) {
                this.unequipItem(this.armor);
                this.packetHandler.broadcast(this.equip(-2), false);
            }
        } else {
            this.server.removeEntity(item);
            this.inventory.makeEmptyInventory(inventoryNumber);
        }
    },
    handleInventoryEat: function (itemKind, inventoryNumber) {
        if (this.consumeTimeout) {
            return;
        } else {
            this.consumeTimeout = setTimeout(function () {
                self.consumeTimeout = null;
            }, 4000);
        }

        var self = this;
        if (itemKind === 212) { // ROYALAZALEA
            this.packetHandler.broadcast(this.equip(213), false); // ROYALAZALEABENEF
            if (this.royalAzaleaBenefTimeout) {
                clearTimeout(this.royalAzaleaBenefTimeout);
            }
            this.royalAzaleaBenefTimeout = setTimeout(function () {
                self.royalAzaleaBenefTimeout = null;
            }, 15000);
        } else if (ItemTypes.isMount(itemKind)) {
            this.packetHandler.broadcast(this.equip(itemKind), false);
        } else if (itemKind === 300) {
            if (!this.hasFullMana()) {
                this.regenManaBy(75);
                this.server.pushToPlayer(this, new Messages.Mana(this.mana));
            }
        } else {
            var amount;

            switch (itemKind) {
                case 35: // FLASK
                    amount = 100;
                    break;
                case 36: // BURGER
                    amount = 200;
                    break;
                case 401: // BIGFLASK
                    amount = ~~(this.maxHitPoints * 0.35);
                    break;
            }

            if (!this.hasFullHealth()) {
                this.regenHealthBy(amount);
                this.server.pushToPlayer(this, this.health());
            }
        }

        this.inventory.takeOutInventory(inventoryNumber, 1);
    },
    handleInventoryEnchantWeapon: function (itemKind, inventoryNumber) {
        if (itemKind !== 200) { // SNOWPOTION
            this.server.pushToPlayer(this, new Messages.Notify("This isn't a snowpotion."));
            return;
        }
        if (this.weaponEnchantedPoint + this.weaponSkillLevel >= 30) {
            this.server.pushToPlayer(this, new Messages.Notify("Weapon Enchantment cannot exceed 30."));
            return;
        }
        this.inventory.makeEmptyInventory(inventoryNumber);
        if (Utils.ratioToBool(0.1)) {
            this.server.pushToPlayer(this, new Messages.Notify("Your enchantment succeeded."));
            if (this.weaponEnchantedPoint) {
                this.weaponEnchantedPoint += 1;
            } else {
                this.weaponEnchantedPoint = 1;
            }
            databaseHandler.enchantWeapon(this.name, this.weaponEnchantedPoint);
        } else {
            this.server.pushToPlayer(this, new Messages.Notify("Your enchantment Failed."));
        }
    },
    handleInventoryEnchantBloodsucking: function (itemKind, inventoryNumber) {
        if (itemKind !== 306) { // BLACKPOTION
            this.server.pushToPlayer(this, new Messages.Notify("This isn't a black potion."));
            return;
        }
        if (this.weaponEnchantedPoint + this.weaponSkillLevel >= 30) {
            this.server.pushToPlayer(this, new Messages.Notify("Weapon enchantment cannot exceed level 30."));
            return;
        }
        if (this.weaponSkillLevel >= 7) {
            this.server.pushToPlayer(this, new Messages.Notify("Weapon Skill Level cannot be raised beyond 7."));
            return;
        }
        if (this.weaponSkillKind !== Types.Skills.BLOODSUCKING) {
            this.server.pushToPlayer(this, new Messages.Notify("You can use a black potion.")); //NOTE - Not sure about this
            return;
        }

        this.inventory.makeEmptyInventory(inventoryNumber);
        if (Utils.ratioToBool(0.1)) {

            this.server.pushToPlayer(this, new Messages.Notify("Enchantment successful."));
            this.weaponSkillKind = Types.Skills.BLOODSUCKING;

            if (this.weaponSkillLevel)
                this.weaponSkillLevel += 1;
            else
                this.weaponSkillLevel = 1;

            databaseHandler.setWeaponSkill(this.name, this.weaponSkillKind, this.weaponSkillLevel);

        } else
            this.server.pushToPlayer(this, new Messages.Notify("The enchantment failed."));
    },

    setAbility: function () {
        this.bloodsuckingRatio = 0;
        if (this.weaponSkillKind === Types.Skills.BLOODSUCKING)
            this.bloodsuckingRatio += this.weaponSkillLevel * 0.02;

        this.criticalRatio = 0;
        if (this.skillHandler.getLevel("criticalStrike") > 0)
            this.criticalRatio = 0.1;

        if (this.weaponSkillKind === Types.Skills.CRITICALRATIO)
            this.criticalRatio += this.weaponSkillLevel * 0.01;
    },

    isAdmin: function () {
        if (this.name == "Tachyon")
            return true;

        return false;
    },

    hasPet: function (pet) {
        for (var i = 0; i < this.pets.length; ++i) {
            if (pet === this.pets[i])
                return true;
        }
        return false;
    },

    isPoisoned: function () {
        return this.poisoned;
    },

    setPoison: function (state) {
        var self = this;
        self.server.pushToPlayer(self, new Messages.Poison(state));
        self.poisoned = state;
        self.redisPool.setPoison(state);
    },

    getHp: function () {
        switch (this.pClass) {
            case Types.PlayerClass.FIGHTER:
                return 50 + (this.level * 25);

            case Types.PlayerClass.DEFENDER:
                return 60 + (this.level * 30);

            case Types.PlayerClass.MAGE:
                return 40 + (this.level * 18);

            case Types.PlayerClass.ARCHER:
                return 45 + (this.level * 16);

            default:
                return 40 + (this.level * 10);
        }
    },

    reviewSkills: function () {
        var self = this,
            skillHandler = self.skillHandler,
            achievements = Achievements.AchievementData,
            index = 0,
            skills = [];

        for (var a in achievements) {
            if (achievements.hasOwnProperty(a)) {
                if (self.achievement[index].progress == 999 && achievements[a].skillName) {
                    skills.push({
                        name: achievements[a].skillName,
                        level: achievements[a].skillLevel
                    });
                }
                index++;
            }
        }

        for (var index = 0; index < skills.length; index++) {
            var name = skills[index].name,
                level = skills[index].level;

            self.skillHandler.add(name, level);
        }
    },

    finishAllAchievements: function () {
        var self = this,
            index = 0;

        for (var a in Achievements.AchievementData) {
            var achievement = self.achievement[index];

            achievement.progress = 999;
            self.redisPool.progressAchievement(self.name, index, 999);
            index++;
        }
    },

    finishAchievement: function (achievementId) {
        var self = this,
            achievement = self.achievement[achievementId];

        achievement.progress = 999;
        self.redisPool.progressAchievement(self.name, achievementId, 999);
    },

    getMp: function () {
        if (this.pClass == Types.PlayerClass.FIGHTER)
            return 15 + (this.level * 8);

        if (this.pClass == Types.PlayerClass.DEFENDER)
            return 25 + (this.level * 3);

        if (this.pClass == Types.PlayerClass.MAGE)
            return 30 + (this.level * 12);

        if (this.pClass == Types.PlayerClass.ARCHER)
            return 10 + (this.level * 7);


        return 40 + (this.level * 10);
    },

    setActiveSkill: function (skillId) {
        this.activeSkill = skillId;
    },

    resetActiveSkill: function () {
        this.activeSkill = 0;
    },

    getActiveSkill: function () {
        return this.activeSkill;
    },

    forcefullyTeleport: function (x, y, orientation) {
        var self = this;

        log.info("Teleporting: " + self.name);

        self.server.pushToPlayer(self, new Messages.Stop(x, y, orientation));
    },

    setTeam: function (team) {
        this.minigameTeam = team;
    },

    getTeam: function (team) {
        return this.minigameTeam;
    },

    setPVPKills: function (kills) {
        this.pvpKills = kills;
        this.redisPool.setPVPKills(this.name, this.pvpKills);
    },

    addPVPKill: function () {
        this.pvpKills += 1;
        this.redisPool.setPVPKills(this.name, this.pvpKills);
        log.info("PVP Kills: " + this.pvpKills);
    },

    setPVPDeaths: function (deaths) {
        this.pvpDeaths = deaths;
        this.redisPool.setPVPDeaths(this.name, this.pvpDeaths);
    },

    addPVPDeath: function () {
        this.pvpDeaths += 1;
        this.redisPool.setPVPDeaths(this.name, this.pvpDeaths);
        log.info("PVP Deaths: " + this.pvpDeaths);
    }
});
