
/* global require, module, log, databaseHandler */

var cls = require("./lib/class"),
    _ = require("underscore"),
    Character = require('./character'),
    Chest = require('./chest'),
    Messages = require("./message"),
    Utils = require("./utils"),
    MobData = require("./mobdata"),
    Formulas = require("./formulas"),
    check = require("./format").check,
    Party = require("./party"),
    Items = require("./items"),
    Bank = require("./bank"),
    Types = require("../../shared/js/gametypes"),
    ItemTypes = require("../../shared/js/itemtypes"),
    bcrypt = require('bcrypt'),
    Inventory = require("./inventory"),
    Mob = require('./mob'),
    SkillHandler = require("./skillhandler"),
    Variations = require('./variations'),
    Trade = require('./trade'),
    express = require('express'),
    bodyParser = require('body-parser'),
    app = express(),
    Achievements = require('./achievements'),
    request = require("request"),
    EntitySpawn = require("./entityspawn"),
    PacketHandler = require("./packethandler");


module.exports = Player = Character.extend({
    init: function(connection, worldServer, databaseHandler) {
        var self = this;

        this.server = worldServer;
        this.connection = connection;

        this._super(this.connection.id, "player", 1, 0, 0, "");

        this.hasEnteredGame = false;
        this.isDead = false;
        this.haters = {};
        this.lastCheckpoint = null;
        this.formatChecker = new FormatChecker();
        this.friends = {};
        this.ignores = {};
        this.pets = [];

        this.inventory = null;
        this.pvpFlag = false;
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

        this.stunExecuted = 0;

        this.superCatCallback = null;
        this.superCatExecuted = 0;

        this.provocationExecuted = 0;

        this.pubPointBuyTimeout = null;
        this.variations = new Variations();
        this.membership = false;
        this.chatBanEndTime = 0;

        this.hasFocus = true;

        this.attackedTime = new Timer(950);

        this.packetHandler = new PacketHandler(this, connection, worldServer, databaseHandler);

        this.pClass = 0;


    },

    destroy: function() {
        var self = this;

        this.forEachAttacker(function(mob) {
            mob.clearTarget();
        });
        this.attackers = {};

        this.forEachHater(function(mob) {
            mob.forgetPlayer(self.id);
        });
        this.haters = {};
    },

    getState: function() {
        var basestate = this._getBaseState(),
            state = [this.name, this.orientation, this.armor, this.weapon, this.level];

        if(this.target) {
            state.push(this.target.id);
        }

        return basestate.concat(state);
    },

    send: function(message) {
        this.connection.send(message);
    },

    setInPVPLobby: function(inPVPLobby) {
        if (this.inPVPLobby !== inPVPLobby)
            this.inPVPLobby = inPVPLobby;
    },

    setInPVPGame: function(inPVPGame) {
        if (this.inPVPGame !== inPVPGame)
            this.inPVPGame = inPVPGame;
    },


    flagPVP: function(pvpFlag){
        if(this.pvpFlag !== pvpFlag){
            this.pvpFlag = pvpFlag;
            this.send(new Messages.PVP(this.pvpFlag).serialize());
        }
    },

    equip: function(item) {
        return new Messages.EquipItem(this, item);
    },

    addHater: function(mob) {
        if(mob) {
            if(!(mob.id in this.haters)) {
                this.haters[mob.id] = mob;
            }
        }
    },

    removeHater: function(mob) {
        if(mob && mob.id in this.haters) {
            delete this.haters[mob.id];
        }
    },

    forEachHater: function(callback) {
        _.each(this.haters, function(mob) {
            callback(mob);
        });
    },

    equipArmor: function(kind, enchantedPoint, skillKind, skillLevel) {
        this.armor = kind;
        this.armorEnchantedPoint = enchantedPoint;
        this.armorLevel = ItemTypes.getArmorLevel(kind) + enchantedPoint;
        this.armorSkillKind = skillKind;
        this.armorSkillLevel = skillLevel;
    },
    equipWeapon: function(kind, enchantedPoint, skillKind, skillLevel){
        this.weapon = kind;
        this.weaponEnchantedPoint = enchantedPoint;
        this.weaponLevel = ItemTypes.getWeaponLevel(kind) + this.weaponEnchantedPoint;
        this.weaponSkillKind = skillKind;
        this.weaponSkillLevel = skillLevel;
    },

    equipItem: function(itemKind, enchantedPoint, skillKind, skillLevel, isAvatar) {
        if(itemKind) {
            log.debug(this.name + " equips " + ItemTypes.getKindAsString(itemKind));
            log.info("equipItem-enchantedPoint="+enchantedPoint);
            if(ItemTypes.isArmor(itemKind) || ItemTypes.isArcherArmor(itemKind)) {
                databaseHandler.equipArmor(this.name, ItemTypes.getKindAsString(itemKind), enchantedPoint, skillKind, skillLevel);
                this.equipArmor(itemKind, enchantedPoint, skillKind, skillLevel);
            } else if(ItemTypes.isWeapon(itemKind) || ItemTypes.isArcherWeapon(itemKind)) {
                databaseHandler.equipWeapon(this.name, ItemTypes.getKindAsString(itemKind), enchantedPoint, skillKind, skillLevel);
                this.equipWeapon(itemKind, enchantedPoint, skillKind, skillLevel);
            }
        }
    },
    unequipItem: function (itemKind)
    {
        if(itemKind) {
            log.debug(this.name + " unequips " + ItemTypes.getKindAsString(itemKind));

            if(ItemTypes.isArmor(itemKind) || ItemTypes.isArcherArmor(itemKind)) {
                databaseHandler.equipArmor(this.name, '', 0, 0, 0);
                this.equipArmor(0, 0, 0, 0);

            } else if(ItemTypes.isWeapon(itemKind) || ItemTypes.isArcherWeapon(itemKind)) {
                databaseHandler.equipWeapon(this.name, '', 0, 0, 0);
                this.equipWeapon(0, 0, 0, 0);
            }
        }
    },

    updateHitPoints: function() {
        this.resetHitPoints(this.getHp());
        this.resetMana(this.getMp());
    },

    updatePosition: function() {
        if(this.requestpos_callback) {
            var pos = this.requestpos_callback();
            this.setPosition(pos.x, pos.y);
        }
    },

    onRequestPosition: function(callback) {
        this.requestpos_callback = callback;
    },

    achievementAboutKill: function(mob){
        var self = this;

        for(i = 0; i < Object.keys(Achievements.AchievementData).length; i++){
            var achievement = Achievements.AchievementData[i];
            if(achievement.type == 2)
            {
                this.tmpAchievement = achievement;
                this._achievementAboutKill(mob.kind, achievement, function (achievement){
                    if (self.tmpachievement.xp)
                    {
                        self.incExp(self.tmpachievement.xp);
                    }
                    var skillName = self.tmpachievement.skillName;
                    var skillLevel = self.tmpachievement.skillLevel;
                    //log.info("skill="+skillName+",skillLevel="+skillLevel);
                    if (skillName && skillLevel)
                    {
                        self.skillHandler.add(skillName, skillLevel);
                        var index = self.skillHandler.getIndexByName(skillName);
                        databaseHandler.handleSkills(self, index, skillName, skillLevel);
                        self.server.pushToPlayer(self, new Messages.SkillLoad(index, skillName, skillLevel));

                    }
                });
            }
        }
    },

    achievementAboutItem: function(npcKind, achievementNumber, itemKind, itemCount, callback){

        if(this.achievement[achievementNumber].found === true
            && this.achievement[achievementNumber].progress !== 999) {
            if(this.inventory.hasItems(itemKind, itemCount)){
                log.info("MISSION COMPLETED!=============");
                this.inventory.makeEmptyInventory2(itemKind, itemCount);
                this.send([Types.Messages.ACHIEVEMENT, "complete", achievementNumber]);
                this.achievement[achievementNumber].progress = 999;
                if(callback){
                    callback();
                }
                databaseHandler.progressAchievement(this.name, achievementNumber, 999);
                this.server.pushToPlayer(this, new Messages.TalkToNPC(npcKind, achievementNumber, true));
            } else{
                this.server.pushToPlayer(this, new Messages.TalkToNPC(npcKind, achievementNumber, false));
            }
        }
    },

    _achievementAboutKill: function(mobKind, achievement, callback){

        if(achievement.mobId.length > 1 && (achievement.mobId.indexOf(mobKind) > -1) ||
            (mobKind === achievement.mobId) ||
            (achievement.mobId == 0 && MobData.Kinds[mobKind].level * 2 > this.level))
        {
            //log.info("mob found");
            var achievement = this.achievement[achievement.id];
            if(achievement.found && achievement.progress !== 999) {
                if(isNaN(achievement.progress)){
                    achievement.progress = 1;
                } else{
                    achievement.progress++;
                }
                if(achievement.progress >= achievement.mobCount) {
                    //log.info("MISSION COMPLETED!=============");
                    this.send([Types.Messages.ACHIEVEMENT, "complete", achievement.id]);
                    achievement.progress = 999;
                    if(callback){
                        callback();
                    }
                }
                //log.info("MISSION progress!=============");
                databaseHandler.progressAchievement(this.name, achievement.id, achievement.progress);
                if(achievement.progress < achievement.mobCount){
                    this.send([Types.Messages.ACHIEVEMENT, "progress", achievement.id, achievement.progress]);
                }
            }
        }
    },

    foundAchievement: function(achievementId){

        this.achievement[achievementId] = {};
        this.achievement[achievementId].found = true;
        databaseHandler.foundAchievement(this.name, achievementId);
        this.send([Types.Messages.ACHIEVEMENT, "found", achievementId]);
    },

    incExp: function(gotexp){
        if (this.variations.doubleEXP) {
            //log.info("Double EXP Enabled");
            this.experience = parseInt(this.experience) + (parseInt(gotexp) * 2);
            //log.info("Added: " + parseInt(gotexp) + " w/ double EXP: " + (parseInt(gotexp) * 2));
        } else {
            //log.info("EXP Multiplier: " + this.variations.expMultiplier);
            this.experience = parseInt(this.experience) + (parseInt(gotexp) * this.variations.expMultiplier);
        }

        //NOTE
        databaseHandler.setExp(this.name, this.experience);
        var origLevel = this.level;
        this.level = Types.getLevel(this.experience);
        if(origLevel !== this.level) {
            //this.resetHPandMana();
            this.updateHitPoints();
            this.server.pushToPlayer(this, new Messages.HitPoints(this.maxHitPoints, this.maxMana, this.hitPoints, this.mana));
            //NOTE 3
            //this.send(new Messages.HitPoints(this.maxHitPoints, this.maxMana, this.hitPoints, this.mana).serialize());
        }
    },

    checkName: function(name) {
        if(name === null) return false;
        else if(name === '') return false;
        else if(name === ' ') return false;

        for(var i=0; i < name.length; i++) {
            var c = name.charCodeAt(i);

            if(!((0xAC00 <= c && c <= 0xD7A3) || (0x3131 <= c && c <= 0x318E)       // Korean (Unicode blocks "Hangul Syllables" and "Hangul Compatibility Jamo")
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

    forcePosition: function(x, y) {
        var self = this,
            message = [Types.Messages.TELEPORT, self.id, x, y];

        log.info("Called.");

        self.send(message);
    },

    sendWelcome: function(armor, weapon, exp,
                          bannedTime, banUseTime, x, y, chatBanEndTime, rank,
                          armorEnchantedPoint, armorSkillKind, armorSkillLevel,
                          weaponEnchantedPoint, weaponSkillKind, weaponSkillLevel,
                          pendant, pendantEnchantedPoint, pendantSkillKind, pendantSkillLevel,
                          ring, ringEnchantedPoint, ringSkillKind, ringSkillLevel,
                          boots, bootsEnchantedPoint, bootsSkillKind, bootsSkillLevel,
                          membership, membershipTime, kind, rights, pClass) {

        var self = this;
        self.kind = kind;
        self.rights = rights;
        self.equipArmor(ItemTypes.getKindFromString(armor), armorEnchantedPoint, armorSkillKind, armorSkillLevel);
        self.equipWeapon(ItemTypes.getKindFromString(weapon), weaponEnchantedPoint, weaponSkillKind, weaponSkillLevel);
        self.membership = membership;
        self.bannedTime = bannedTime;
        self.banUseTime = banUseTime;
        self.membershipTime = membershipTime;
        self.chatBanEndTime = chatBanEndTime;
        self.experience = exp;
        self.level = Types.getLevel(self.experience);

        self.orientation = Utils.randomOrientation;
        self.pClass = pClass;
        self.updateHitPoints();
        self.skillHandler.installSkills(self);

        if(x === 0 && y === 0) {
            self.updatePosition();
        } else {
            self.setPosition(x, y);
        }

        self.server.addPlayer(self);
        self.server.enter_callback(self);



        databaseHandler.getBankItems(self, function(maxBankNumber, bankKinds, bankNumbers, bankSkillKinds, bankSkillLevels) {
            self.bank = new Bank(self, maxBankNumber, bankKinds, bankNumbers, bankSkillKinds, bankSkillLevels);
            databaseHandler.getAllInventory(self, function(maxInventoryNumber, itemKinds, itemNumbers, itemSkillKinds, itemSkillLevels) {
                self.inventory = new Inventory(self, maxInventoryNumber, itemKinds, itemNumbers, itemSkillKinds, itemSkillLevels);
                databaseHandler.loadAchievement(self, function() {
                    var i = 0;
                    var sendMessage = [
                        Types.Messages.WELCOME,
                        self.id, // 1
                        self.name, //2
                        self.x, //3
                        self.y, //4
                        self.hitPoints, //5
                        self.armor, //6
                        self.weapon, //7
                        self.experience, //10
                        self.mana, //11
                        self.variations.doubleEXP, //12
                        self.variations.expMultiplier, //13
                        self.membership, //14
                        self.kind, //15
                        self.rights, //16
                        self.pClass, //17
                    ];

                    // Send All Inventory
                    sendMessage.push(self.inventory.number);
                    for(i=0; i < self.inventory.number; i++){
                        sendMessage.push(self.inventory.rooms[i].itemKind);
                        sendMessage.push(self.inventory.rooms[i].itemNumber);
                        sendMessage.push(self.inventory.rooms[i].itemSkillKind);
                        sendMessage.push(self.inventory.rooms[i].itemSkillLevel);
                        //log.info("inventory"+i+"=" +JSON.stringify(self.inventory.rooms[i]));
                    }

                    // Send All Bank
                    //log.info("self.bank.number="+self.bank.number);
                    sendMessage.push(self.bank.number);
                    for(i=0; i < self.bank.number; i++){
                        sendMessage.push(self.bank.rooms[i].itemKind);
                        sendMessage.push(self.bank.rooms[i].itemNumber);
                        sendMessage.push(self.bank.rooms[i].itemSkillKind);
                        sendMessage.push(self.bank.rooms[i].itemSkillLevel);
                    }

                    var achievementLength = Object.keys(Achievements.AchievementData).length;
                    sendMessage.push(achievementLength);
                    for(i = 0; i < achievementLength; ++i){
                        sendMessage.push(self.achievement[i].found);
                        sendMessage.push(self.achievement[i].progress);
                    }

                    self.send(sendMessage);


                    databaseHandler.loadSkillSlots(self, function(names) {
                        for(var index = 0; index < names.length; index++) {
                            if(names[index]) {
                                self.skillHandler.install(index, names[index]);
                                self.send((new Messages.SkillInstall(index, names[index])).serialize());
                            }
                        }
                        //self.setAbility();
                    });

                    databaseHandler.loadPets(self, function(kinds) {
                        for(var index = 0; index < kinds.length; index++) {
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

    canEquipArmor: function(itemKind){

        var armorLevel = ItemTypes.getArmorLevel(itemKind);
        if(armorLevel * 2 > this.level){
            this.server.pushToPlayer(this, new Messages.Notify("You need to be level " + armorLevel * 2 + " to equip this."));
            return false;
        }
        if ((ItemTypes.isArmor(itemKind) && (this.pClass != Types.PlayerClass.FIGHTER && this.pClass != Types.PlayerClass.DEFENDER)) ||
            (ItemTypes.isArcherArmor(itemKind) && this.pClass != Types.PlayerClass.ARCHER))
        {
            this.server.pushToPlayer(this, new Messages.Notify("Your class cannot use this Armor."));
            return false;
        }
        return true;

    },
    canEquipWeapon: function(itemKind){

        var weaponLevel = ItemTypes.getWeaponLevel(itemKind);
        if(weaponLevel * 2 > this.level){
            this.server.pushToPlayer(this, new Messages.Notify("You need to be level " + weaponLevel * 2 + " to equip this."));
            return false;
        }
        if ((ItemTypes.isWeapon(itemKind) && (this.pClass != Types.PlayerClass.FIGHTER && this.pClass != Types.PlayerClass.DEFENDER)) ||
            (ItemTypes.isArcherWeapon(itemKind) && this.pClass != Types.PlayerClass.ARCHER))
        {
            this.server.pushToPlayer(this, new Messages.Notify("Your class cannot use this Weapon."));
            return false;

        }
        return true;
    },

    handleInventoryArmorUnequip: function () {
        if (this.inventory.putInventory(this.armor, this.armorEnchantedPoint, this.armorSkillKind, this.armorSkillLevel))
        {
            this.unequipItem(this.armor);
            this.packetHandler.broadcast(this.equip(-2), false);
            return true;
        }
        return false;
    },

    handleInventoryArmor: function(itemKind, inventoryNumber){
        if (inventoryNumber == -2) // Unequip Armor
        {
            this.handleInventoryArmorUnequip();
        }

        if(!this.canEquipArmor(itemKind)){
            return;
        }

        //log.info("itemEnchantedLevel="+this.inventory.rooms[inventoryNumber].itemNumber);
        var itemEnchantedLevel = this.inventory.rooms[inventoryNumber].itemNumber;
        var itemSkillKind = this.inventory.rooms[inventoryNumber].itemSkillKind;
        var itemSkillLevel = this.inventory.rooms[inventoryNumber].itemSkillLevel;

        this.inventory.setInventory(inventoryNumber, this.armor, this.armorEnchantedPoint, this.armorSkillKind, this.armorSkillLevel);
        this.equipItem(itemKind, itemEnchantedLevel, itemSkillKind, itemSkillLevel, false);
        //if(!this.avatar){
        this.packetHandler.broadcast(this.equip(itemKind), false);
        //}
    },

    handleInventoryWeaponUnequip: function() {
        if (this.inventory.putInventory(this.weapon, this.weaponEnchantedPoint, this.weaponSkillKind, this.weaponSkillLevel))
        {
            this.unequipItem(this.weapon);
            this.packetHandler.broadcast(this.equip(-1), false);
            return true;
        }
        return false;
    },

    handleInventoryWeapon: function(itemKind, inventoryNumber){
        if (inventoryNumber == -1) // Unequip Weapon
        {
            this.handleInventoryWeaponUnequip();
        }

        if(!this.canEquipWeapon(itemKind)){
            return;
        }

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
    handleInventoryEmpty: function(itemKind, inventoryNumber, count){
        var item = this.server.addItemFromChest(itemKind, this.x, this.y);
        if(ItemTypes.isConsumableItem(item.kind) || ItemTypes.isGold(item.kind) || ItemTypes.isCraft(item.kind)){
            if(count < 0){
                count = 0;
            } else if(count > this.inventory.rooms[inventoryNumber].itemNumber){
                count = this.inventory.rooms[inventoryNumber].itemNumber;
            }
            item.count = count;
        } else if(ItemTypes.isWeapon(item.kind) || ItemTypes.isArcherWeapon(item.kind) ||
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

        if(item.count >= 0) {
            this.server.pushToAdjacentGroups(this.group, new Messages.Drop(this, item));
            //this.server.addItemFromChest(itemKind, this.x, this.y);
            this.server.handleItemDespawn(item);

            if (inventoryNumber >= 0) {
                if(ItemTypes.isConsumableItem(item.kind) || ItemTypes.isGold(item.kind) || ItemTypes.isCraft(item.kind)) {
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
    handleInventoryEat: function(itemKind, inventoryNumber){
        if(this.consumeTimeout){
            return;
        } else{
            this.consumeTimeout = setTimeout(function(){
                self.consumeTimeout = null;
            }, 4000);
        }

        var self = this;
        if(itemKind === 212){ // ROYALAZALEA
            this.packetHandler.broadcast(this.equip(213), false); // ROYALAZALEABENEF
            if(this.royalAzaleaBenefTimeout){
                clearTimeout(this.royalAzaleaBenefTimeout);
            }
            this.royalAzaleaBenefTimeout = setTimeout(function(){
                self.royalAzaleaBenefTimeout = null;
            }, 15000);
        } else if (ItemTypes.isMount(itemKind) ) {
            this.packetHandler.broadcast(this.equip(itemKind), false);
        } else {
            var amount;

            switch(itemKind) {
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

            if(!this.hasFullHealth()) {
                this.regenHealthBy(amount);
                this.server.pushToPlayer(this, this.health());
            }
        }

        this.inventory.takeOutInventory(inventoryNumber, 1);
    },
    handleInventoryEnchantWeapon: function(itemKind, inventoryNumber){
        if(itemKind !== 200){ // SNOWPOTION
            this.server.pushToPlayer(this, new Messages.Notify("This isn't a snowpotion."));
            return;
        }
        if(this.weaponEnchantedPoint + this.weaponSkillLevel>= 30){
            this.server.pushToPlayer(this, new Messages.Notify("Weapon Enchantment cannot exceed 30."));
            return;
        }
        this.inventory.makeEmptyInventory(inventoryNumber);
        if(Utils.ratioToBool(0.1)){
            this.server.pushToPlayer(this, new Messages.Notify("Your enchantment succeeded."));
            if(this.weaponEnchantedPoint){
                this.weaponEnchantedPoint += 1;
            } else{
                this.weaponEnchantedPoint = 1;
            }
            databaseHandler.enchantWeapon(this.name, this.weaponEnchantedPoint);
        } else{
            this.server.pushToPlayer(this, new Messages.Notify("Your enchantment Failed."));
        }
    },
    handleInventoryEnchantBloodsucking: function(itemKind, inventoryNumber){
        if(itemKind !== 306){ // BLACKPOTION
            this.server.pushToPlayer(this, new Messages.Notify("This isn't a black potion."));
            return;
        }
        if(this.weaponEnchantedPoint + this.weaponSkillLevel >= 30){
            this.server.pushToPlayer(this, new Messages.Notify("Weapon enchantment cannot exceed level 30."));
            return;
        }
        if(this.weaponSkillLevel >= 7){
            this.server.pushToPlayer(this, new Messages.Notify("Weapon Skill Level cannot be raised beyond 7."));
            return;
        }
        if(this.weaponSkillKind !== Types.Skills.BLOODSUCKING){
            this.server.pushToPlayer(this, new Messages.Notify("You can use a black potion.")); //NOTE - Not sure about this
            return;
        }

        this.inventory.makeEmptyInventory(inventoryNumber);
        if(Utils.ratioToBool(0.1)){
            this.server.pushToPlayer(this, new Messages.Notify("Enchantment successful."));
            this.weaponSkillKind = Types.Skills.BLOODSUCKING;
            if(this.weaponSkillLevel){
                this.weaponSkillLevel += 1;
            } else{
                this.weaponSkillLevel = 1;
            }
            databaseHandler.setWeaponSkill(this.name, this.weaponSkillKind, this.weaponSkillLevel);
        } else{
            this.server.pushToPlayer(this, new Messages.Notify("The enchantment failed."));
        }
    },

    setAbility: function(){
        this.bloodsuckingRatio = 0;
        if(this.weaponSkillKind === Types.Skills.BLOODSUCKING){
            this.bloodsuckingRatio += this.weaponSkillLevel*0.02;
        }

        this.criticalRatio = 0;
        if(this.skillHandler.getLevel("criticalStrike") > 0){
            this.criticalRatio = 0.1;
        }
        if(this.weaponSkillKind === Types.Skills.CRITICALRATIO){
            this.criticalRatio += this.weaponSkillLevel*0.01;
        }
    },

    isAdmin: function () {
        if (this.name == "Langerz" || this.name == "Tachyon")
            return true;

        return false;
    },

    hasPet: function(pet) {
        for ( var i = 0; i < this.pets.length; ++i)
        {
            if (pet === this.pets[i])
                return true;
        }
        return false;
    },

    getHp: function () {
        if (this.pClass == Types.PlayerClass.FIGHTER)
            return 50 + (this.level * 10);
        // 20% More health.
        if (this.pClass == Types.PlayerClass.DEFENDER)
            return 60 + (this.level * 12);
        // 20% Less health.
        if (this.pClass == Types.PlayerClass.MAGE)
            return 40 + (this.level * 8);
        // 10% Less health.
        if (this.pClass == Types.PlayerClass.ARCHER)
            return 45 + (this.level * 9);
    },

    getMp: function () {
        if (this.pClass == Types.PlayerClass.FIGHTER)
            return 10 + (this.level * 2);
        if (this.pClass == Types.PlayerClass.DEFENDER)
            return 25 + (this.level * 2);
        if (this.pClass == Types.PlayerClass.MAGE)
            return 30 + (this.level * 10);
        if (this.pClass == Types.PlayerClass.ARCHER)
            return 10 + (this.level * 2);

    },

});
