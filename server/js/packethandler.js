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
    SkillData = require("./skilldata"),
    EntitySpawn = require("./entityspawn"),
    Gather = require("./gather"),
    GatherData = require("./gatherdata"),
    CraftData = require("./craftdata"),
    querystring = require('querystring'),
    http = require('http');

module.exports = PacketHandler = Class.extend({
    init: function(player, connection, worldServer, databaseHandler) {

        this.player = player;
        this.server = worldServer;
        this.connection = connection;
        this.redisPool = databaseHandler;

        this.disconnectTimeout = null;

        var self = this;

        this.connection.listen(function(message) {

            var action = parseInt(message[0]);

            if(!self.player.hasEnteredGame && action !== Types.Messages.CREATE && action !== Types.Messages.LOGIN) {
                self.connection.sendUTF8('unknownerror');
                self.connection.close("Invalid handshake message: " + message);
                return;
            }
            if(self.player.hasEnteredGame && !player.isDead &&
                (action === Types.Messages.CREATE || action === Types.Messages.LOGIN ))
            { // CREATE/LOGIN can be sent only once
                self.connection.sendUTF8('unknownerror');
                self.connection.close("Cannot initiate handshake twice: "+message);
                return;
            }

            //self.resetTimeout();
            /**
             * Let's just catch any potential errors.
             */

            switch(action) {
                case Types.Messages.CREATE:
                    self.processCreation(message);
                    break;
                case Types.Messages.LOGIN:
                    self.processLogin(message);
                    break;
                case Types.Messages.WHO:
                    message.shift();
                    self.server.pushSpawnsToPlayer(self.player, message);
                    break;
                case Types.Messages.ZONE:
                    self.zone_callback();
                    break;
                case Types.Messages.CHAT:
                    self.handleChat(message);
                    break;
                case Types.Messages.MOVEENTITY:
                    self.handleMoveEntity(message);
                    break;
                case Types.Messages.HIT:
                    self.handleHit(message);
                    break;
                case Types.Messages.HURT:
                    self.handleHurt(message);
                    break;
                case Types.Messages.GATHER:
                    self.handleGather(message);
                    break;
                case Types.Messages.INVENTORY:
                    self.handleInventory(message);
                    break;
                case Types.Messages.SKILL:
                    self.handleSkill(message);
                    break;
                case Types.Messages.SKILLINSTALL:
                    self.handleSkillInstall(message);
                    break;
                case Types.Messages.SKILLLOAD:
                    self.handleSkillLoad();
                    break;
                case Types.Messages.AGGRO:
                    if (self.move_callback)
                        self.server.handleMobHate(message[1], self.player.id, 5);
                    break;
                case Types.Messages.STORESELL:
                    self.handleStoreSell(message);
                    break;
                case Types.Messages.STOREBUY:
                    self.handleStoreBuy(message);
                    break;

                case Types.Messages.ATTACK:
                    self.handleAttack(message);
                    break;
                case Types.Messages.CRAFT:
                    self.handleCraft(message);
                    break;
                case Types.Messages.AUCTIONSELL:
                    self.handleAuctionSell(message);
                    break;
                case Types.Messages.AUCTIONBUY:
                    self.handleAuctionBuy(message);
                    break;
                case Types.Messages.AUCTIONOPEN:
                    self.handleAuctionOpen(message);
                    break;
                case Types.Messages.AUCTIONDELETE:
                    self.handleAuctionDelete(message);
                    break;
                case Types.Messages.STOREENCHANT:
                    self.handleStoreEnchant(message);
                    break;
                case Types.Messages.BANKSTORE:
                    self.handleBankStore(message);
                    break;
                case Types.Messages.BANKRETRIEVE:
                    self.handleBankRetrieve(message);
                    break;
                case Types.Messages.CHARACTERINFO:
                    self.server.pushToPlayer(self.player, new Messages.CharacterInfo(self.player));
                    break;
                case Types.Messages.TELEPORT:
                    self.handleTeleport(message, false);
                    break;
                case Types.Messages.OPEN:
                    self.handleOpen(message);
                    break;
                case Types.Messages.LOOTMOVE:
                    self.handleLootMove(message);
                    break;
                case Types.Messages.LOOT:
                    self.handleLoot(message);
                    break;
                case Types.Messages.CHECK:
                    self.handleCheckpoint(message);
                    break;
                case Types.Messages.Achievement:
                    self.handleAchievement(message);
                    break;
                case Types.Messages.TALKTONPC:
                    self.handleTalkToNPC(message);
                    break;
                case Types.Messages.FLAREDANCE:
                    self.handleFlareDance(message);
                    break;
                case Types.Messages.MAGIC:
                    self.handleMagic(message);
                    break;
                case Types.Messages.CLIENTFOCUS:
                    self.handleClientFocus(message);
                    break;
                case Types.Messages.ADDSPAWN:
                    self.handleAddSpawn(message);
                    break;
                case Types.Messages.SAVESPAWNS:
                    self.handleSaveSpawns();
                    break;
                case Types.Messages.PARTYINVITE:
                    self.handlePartyInvite(message);
                    break;
                case Types.Messages.PARTYLEAVE:
                    self.handlePartyLeave(message);
                    break;
                case Types.Messages.PARTYLEADER:
                    self.handlePartyLeader(message);
                    break;
                case Types.Messages.PARTYKICK:
                    self.handlePartyKick(message);
                    break;
                case Types.Messages.PETCREATE:
                    self.handlePetCreate(message);
                    break;
                case Types.Messages.CLASSSWITCH:
                    self.handleClassSwitch(message);
                    break;
                case Types.Messages.STEP:
                    self.handleStep(message);
                    break;
                case Types.Messages.DEATH:
                    self.handleDeath(message);
                    break;
                case Types.Messages.UPDATE:
                    self.handleUpdate(message);
                    break;
                case Types.Messages.REQUESTWARP:
                    self.handleWarp(message);
                    break;
                case Types.Messages.PLAYERREADY:
                    self.handlePlayerReady(message);
                    break;
                case Types.Messages.CAST:
                    self.handleCast(message);
                    break;
                case Types.Messages.SPELLHIT:
                    self.handleSpellHit(message);
                    break;
                case Types.Messages.DOOR:
                    self.handleDoor(message);
                    break;
                default:
                    if (self.message_callback)
                        self.player.message_callback(message);
                    break;
            }
        });

        this.connection.onClose(function() {
            self.server.removePlayer(self.player);
            if(self.exit_callback)
                self.exit_callback();
        });


        this.connection.sendUTF8("go"); // Notify client that the HELLO/WELCOME handshake can start

    },

    timeout: function() {
        this.connection.sendUTF8("timeout");
        this.connection.close("Player was idle for too long");
    },

    resetTimeout: function() {
        clearTimeout(this.disconnectTimeout);
        this.disconnectTimeout = setTimeout(this.timeout.bind(this), 900000); // 15 min.
    },


    broadcast: function(message, ignoreSelf) {
        if(this.broadcast_callback) {
            this.broadcast_callback(message, ignoreSelf === undefined ? true : ignoreSelf);
        }
    },

    broadcastToZone: function(message, ignoreSelf) {
        if(this.broadcastzone_callback) {
            this.broadcastzone_callback(message, ignoreSelf === undefined ? true : ignoreSelf);
        }
    },

    onExit: function(callback) {
        this.exit_callback = callback;
    },

    onMove: function(callback) {
        this.move_callback = callback;
    },

    onLootMove: function(callback) {
        this.lootmove_callback = callback;
    },

    onZone: function(callback) {
        this.zone_callback = callback;
    },

    onOrient: function(callback) {
        this.orient_callback = callback;
    },

    onMessage: function(callback) {
        this.message_callback = callback;
    },

    onBroadcast: function(callback) {
        this.broadcast_callback = callback;
    },

    onBroadcastToZone: function(callback) {
        this.broadcastzone_callback = callback;
    },

    processCreation: function(message) {
        var self = this,
            playerName = Utils.sanitize(message[1]),
            playerPassword = Utils.sanitize(message[2]),
            playerEmail = Utils.sanitize(message[3]),
            playerClass = Utils.sanitize(message[4]);

        var options = {
            method: 'GET',
            uri: 'http://taptapadventure.com/api/register/index.php?a=' + '9a4c5ddb-5ce6-4a01-a14f-3ae49d8c6507' + '&u=' + playerName + '&p=' + playerPassword + '&e=' + playerEmail
        };

        try {
            request(options, function(error, response, body) {
                switch (JSON.parse(JSON.parse(body).data).code) {
                    case "ok":
                        self.player.name = playerName;
                        self.player.pw = playerPassword;
                        self.player.email = playerEmail;
                        self.player.pClass = playerClass;
                        self.redisPool.createPlayer(self.player);
                        break;

                    default:
                        self.connection.sendUTF8("userexists");
                        self.connection.close("Username not available: " + self.player.name);
                        break;
                }
            });
        } catch (e) {
            log.info("An error occured whilst contacting the API: " + e);
        }
    },

    processLogin: function(message) {
        var self = this,
            developmentMode = self.connection._connection.remoteAddress == "127.0.0.1",
            playerName = Utils.sanitize(message[1]),
            playerPassword = Utils.sanitize(message[2]);

        var options = {
            method: 'POST',
            uri: 'http://forum.taptapadventure.com/api/ns/login',
            form: {
                'username': playerName,
                'password': playerPassword
            }
        };

        if (developmentMode) {
            self.player.name = playerName.substr(0, 36).trim();
            self.player.pw = playerPassword.substr(0, 45);
            self.player.email = "Me@me.me";
            self.redisPool.loadPlayer(self.player);
            return;
        }

        if (self.server.loggedInPlayer(playerName.substr(0, 36).trim())) {
            self.connection.sendUTF8('loggedin');
            self.connection.close("Player: " + playerName);
            return;
        }

        request(options, function(error, response, body) {
            try {
                var data = JSON.parse(body);
                if (data.message) {
                    self.connection.sendUTF8('invalidlogin');
                    self.connection.close("Wrong password for: " + playerName);
                } else {
                    self.player.name = playerName.substr(0, 36).trim();
                    self.player.pw = playerPassword.substr(0, 45);
                    self.player.email = data.email;
                    self.redisPool.loadPlayer(self.player);
                }
            } catch (e) {
                log.info("An error has occured whilst connecting to the API.");
            }
        });
    },

    verifyMessage: function(text) {
        return text && (text !== "" || text !== " ");
    },

    sendGUIMessage: function(text) {
        this.server.pushToPlayer(this.player, new Messages.GuiNotify(text));
        //this.send(new Messages.GuiNotify(text));
    },

    handleChat: function (message) {
        var self = this,
            sanitizedMessage = Utils.sanitize(message[1]);

        if (self.verifyMessage(sanitizedMessage)) {
            var text = sanitizedMessage.substr(0, 256),
                command = text.split(" ");

            if (command[0] == "/teleport") {
                if (command.length < 3) {
                    self.sendGUIMessage("Invalid command syntax");
                    return;
                }

                self.player.movePlayer(command[1], command[2]);
                return;
            }

            if (command[0] == "/addskill") {
                if (command.length < 3) {
                    self.sendGUIMessage("Invalid command syntax.");
                    return;
                }

                var skillName = command[1];
                var skillLevel = command[2];

                self.player.skillHandler.add(skillName, skillLevel);
                var index = self.player.skillHandler.getIndexByName(skillName);

                self.redisPool.handleSkills(self.player, index, skillName, skillLevel);
                self.server.pushToPlayer(self.player, new Messages.SkillLoad(index, skillName, skillLevel));
            }

            if (command[0] == "/finishachievement") {
                var achievementId = command[1];
                
                self.player.finishAchievement(achievementId);
            }
            
            
            if (self.player.rights == 2) {
                switch(command[0]) {
                    case "/finishall":

                        self.player.finishAllAchievements();
                        break;

                    case "/maxmana":
                        var p = self.player;
                        self.player.mana = self.player.maxMana;

                        self.server.pushToPlayer(p, new Messages.PlayerPoints(p.maxHitPoints, p.maxMana, p.hitPoints, p.mana), false);
                        break;

                    case "/teleport":
                        if (command.length < 3) {
                            self.sendGUIMessage("Invalid command syntax");
                            return;
                        }

                        self.player.movePlayer(command[1], command[2]);
                        break;

                    case "/attackers":
                        log.info("Attackers: " + self.player.attackers.kind);
                        break;

                    case "/interface":
                        if (command.length < 2) {
                            self.sendGUIMessage("Invalid command syntax.");
                            return;
                        }

                        self.server.pushToPlayer(self.player, new Messages.Interface(command[1]));
                        break;

                    case "/players":

                        for (var player in self.server.players) {
                            if (self.server.players.hasOwnProperty(player))
                                log.info("Player: " + player.name);
                        }
                        break;

                    case "/addskill":
                        if (command.length < 3) {
                            self.sendGUIMessage("Invalid command syntax.");
                            return;
                        }

                        var skillName = command[1];
                        var skillLevel = command[2];

                        self.player.skillHandler.add(skillName, skillLevel);
                        var index = self.player.skillHandler.getIndexByName(skillName);

                        self.redisPool.handleSkills(self.player, index, skillName, skillLevel);
                        self.server.pushToPlayer(self.player, new Messages.SkillLoad(index, skillName, skillLevel));
                        break;


                    case "/addattack":
                        var sName = "Deadly Attack",
                            sLevel = 2;

                        self.player.skillHandler.add(sName, sLevel);
                        var index = self.player.skillHandler.getIndexByName(sName);

                        self.redisPool.handleSkills(self.player, index, sName, sLevel);
                        self.server.pushToPlayer(self.player, new Messages.SkillLoad(index, sName, sLevel));
                        break;

                    case "/addattack2":
                        var sName = "Whirlwind Attack",
                            sLevel = 4;

                        self.player.skillHandler.add(sName, sLevel);
                        var index = self.player.skillHandler.getIndexByName(sName);

                        self.redisPool.handleSkills(self.player, index, sName, sLevel);
                        self.server.pushToPlayer(self.player, new Messages.SkillLoad(index, sName, sLevel));
                        break;

                    case "/addpower":
                        var sName = "Power Gain",
                            sLevel = 1;

                        self.player.skillHandler.add(sName, sLevel);
                        var index = self.player.skillHandler.getIndexByName(sName);

                        self.redisPool.handleSkills(self.player, index, sName, sLevel);
                        self.server.pushToPlayer(self.player, new Messages.SkillLoad(index, sName, sLevel));
                        break;

                    case "/spawn":
                        if (command.length < 2) {
                            self.sendGUIMessage("Invalid command syntax.");
                            return;
                        }
                        var itemKind = command[1];
                        try {
                            self.player.inventory.putInventory(itemKind, 1);
                        } catch (e) {
                            self.sendGUIMessage("Invalid item Id.");
                        }

                        break;

                    case "/forcespell":
                        if (command.length < 2) {
                            self.sendGUIMessage("Invalid command syntax.");
                            return;
                        }

                        var spellType = command[1];

                        if (spellType)
                            self.server.pushToPlayer(self.player, new Messages.ForceCast(spellType));

                        break;

                    default:
                        if ((new Date().getTime()) > self.player.chatBanEndTime)
                            self.broadcastToZone(new Messages.Chat(self.player, text), false);
                        else
                            self.sendGUIMessage("You are currently muted.");
                }
            } else {
                if ((new Date().getTime()) > self.player.chatBanEndTime)
                    self.broadcastToZone(new Messages.Chat(self.player, text), false);
                else
                    self.sendGUIMessage("You are currently muted.");
            }

        }
    },

    handleTalkToNPC: function(message) { // 30
        var self = this;
        var npcKind = message[1];
        var achievementId = message[2];

        if (!this.player.achievement[achievementId] || !this.player.achievement[achievementId].found)
        {
            this.player.foundAchievement(achievementId);
            return;
        }
        if (this.player.achievement[achievementId].progress === 999)
        {
            this.server.pushToPlayer(this.player, new Messages.TalkToNPC(npcKind, achievementId, true));
            return;
        }

        var achievement = Achievements.AchievementData[achievementId];
        if(achievement.type == 1)
            this.player.achievementAboutItem(achievement.npcId, achievementId, achievement.itemId, achievement.itemCount);


    },

    handleLootMove: function(message){

        if (message) {
            if(this.lootmove_callback) {
                this.player.setPosition(message[1], message[2]);

                var item = this.server.getEntityById(message[3]);
                if(item) {
                    this.player.clearTarget();

                    this.broadcast(new Messages.LootMove(this.player, item));
                    this.lootmove_callback(this.player.x, this.player.y);
                }
            }

        }
    },

    handleCheckpoint: function (message) {
        var checkpoint = this.server.map.getCheckpoint(message[1]);
        if (checkpoint) {
            this.player.lastCheckpoint = checkpoint;
            this.redisPool.setCheckpoint(this.player.name, this.player.x, this.player.y);
        }
    },

    handleStoreSell: function(message) {
        var inventoryNumber1 = message[1],
            itemKind = null,
            price = 0,
            inventoryNumber2 = -1;

        if((inventoryNumber1 >= 0) && (inventoryNumber1 < this.player.inventory.number)) {
            itemKind = this.player.inventory.rooms[inventoryNumber1].itemKind;
            if(itemKind && !ItemTypes.isConsumableItem(itemKind) && !ItemTypes.isGold(itemKind)) {
                price = ItemTypes.getSellPrice(ItemTypes.getKindAsString(itemKind));
                inventoryNumber2 = this.player.inventory.getInventoryNumber(400);
                if(inventoryNumber2 < 0) {
                    inventoryNumber2 = this.player.inventory.getEmptyInventoryNumber();
                }
                this.player.inventory.makeEmptyInventory(inventoryNumber1);
                this.player.inventory.putInventory(400, price);
                this.server.pushToPlayer(this.player, new Messages.Notify("sold"));
            }
        }
    },

    handleAuctionSell: function(message) {
        var inventoryNumber1 = message[1],
            price = message[2];

        if((inventoryNumber1 >= 0) && (inventoryNumber1 < this.player.inventory.number)) {
            item = this.player.inventory.rooms[inventoryNumber1];
            //log.info(JSON.stringify(item));
            if(item.itemKind && !ItemTypes.isConsumableItem(item.itemKind) && !ItemTypes.isGold(item.itemKind)) {
                this.redisPool.handleSaveAuctionItem(this.player, item, price, inventoryNumber1);
            }
        }
    },

    handleAuctionOpen: function(message) {
        var type = message[1];
        this.redisPool.loadAuctionItems(this.player, type);
    },

    handleAuctionBuy: function(message) {
        var itemIndex = message[1];
        var self = this;
        self.redisPool.getAuctionItem(itemIndex, function (auction) {
            price = auction.value;
            if(price > 0) {
                goldCount = self.player.inventory.getItemNumber(400);

                if(goldCount < price) {
                    self.server.pushToPlayer(self.player, new Messages.Notify("You don't have enough Gold."));
                    return;
                }

                if(self.player.inventory.hasEmptyInventory()) {
                    self.player.inventory.putInventoryItem(auction.item);
                    self.player.inventory.putInventory(400, -price);
                    self.server.pushToPlayer(self.player, new Messages.Notify("buy"));
                    self.redisPool.putGoldOfflineUser(auction.player, price, function() {log.info("gold success")}, function() {log.info("gold fail")});
                    self.redisPool.handleDelAuctionItem(itemIndex);
                } else {
                    self.server.pushToPlayer(self.player, new Messages.Notify("There is not enough space in your inventory."));
                }
            }
        });
    },

    handleAuctionDelete: function(message) {
        var itemIndex = message[1];
        var self = this;

        self.redisPool.getAuctionItem(itemIndex, function (auction) {
            if(self.player.inventory.hasEmptyInventory()) {
                self.player.inventory.putInventoryItem(auction.item);
                self.server.pushToPlayer(self.player, new Messages.Notify("buy"));
                self.redisPool.handleDelAuctionItem(itemIndex);
            } else {
                self.server.pushToPlayer(self.player, new Messages.Notify("There is not enough space in your inventory."));
            }
        });
    },

    handleStoreEnchant: function(message) {
        var self = this,
            inventoryNumber = message[1],
            itemKind,
            price = 0;


        if ((inventoryNumber >= 6) && (inventoryNumber < self.player.inventory.number)) {
            var item = self.player.inventory.rooms[inventoryNumber];

            if (item && item.itemKind && !ItemTypes.isGold(item.itemKind)) {
                price = ItemTypes.getEnchantPrice(ItemTypes.getKindAsString(item.itemKind), item.itemNumber);
                goldCount = self.player.inventory.getItemNumber(400);

                if (goldCount < price) {
                    self.server.pushToPlayer(self.player, new Messages.GuiNotify("You do not have enough gold to enchant this item!"));
                    return;
                }

                item.itemNumber++;

                self.redisPool.setInventory(self.player.inventory.owner, inventoryNumber, item.itemKind, item.itemNumber, item.itemSkillKind, item.itemSkillLevel);
                self.player.inventory.putInventory(400, -price);
                self.server.pushToPlayer(self.player, new Messages.GuiNotify("You have successfully enchanted this item!"));
            }
        }
    },

    handleBankStore: function(message) {
        var inventoryNumber = message[1],
            itemKind = null;

        if((inventoryNumber >= 6) && (inventoryNumber < this.player.inventory.number)) {
            var item = this.player.inventory.rooms[inventoryNumber];

            if(item && item.itemKind) {
                var slot = this.player.bank.getEmptyBankNumber();

                if (slot >= 0) {
                    this.player.bank.putBankItem(item);
                    this.player.inventory.takeOutInventory(inventoryNumber, item.itemNumber);
                }
            }
        }
    },

    handleBankRetrieve: function(message) {
        var bankNumber = message[1],
            itemKind = null;

        if((bankNumber >= 0) && (bankNumber < this.player.bank.number)) {
            var item = this.player.bank.rooms[bankNumber];

            if(item && item.itemKind) {
                var slot = this.player.inventory.getEmptyEquipmentNumber();
                if (slot >= 0) {
                    this.player.inventory.putInventoryItem(item);
                    this.player.bank.takeOutBank(bankNumber, item.itemNumber);
                }
            }
        }
    },

    handleOpen: function (message) {
        var chest = this.server.getEntityById(message[1]);
        if (chest && chest instanceof Chest)
            this.server.handleOpenedChest(chest, this.player);
    },

    handleTeleport: function (message) {
        var self = this,
            id = message[1],
            x = message[2],
            y = message[3];
        /*
         if (id !== self.player.id || !self.server.isValidPosition(x, y))
         return;*/

        self.player.setPosition(x, y);
        self.player.movePlayer(x, y);
        self.player.clearTarget();
        //self.server.pushToPlayer(new Messages.Teleport(self.player));
        self.broadcast(new Messages.Teleport(self.player));
        self.server.handlePlayerVanish(self.player);
        self.server.pushRelevantEntityListTo(self.player);

    },

    handleAttack: function(message) {
        var self = this,
            mob = self.server.getEntityById(message[1]);

        if (mob) {
            self.player.setTarget(mob);
            self.server.broadcastAttacker(self.player);
        }
    },

    handleStoreBuy: function(message) {
        var itemType = message[1],
            itemKind = message[2],
            itemCount = message[3],
            itemName = null,
            price = 0,
            goldCount = 0,
            inventoryNumber = -1,
            buyCount = 0;

        if(itemCount <= 0) {
            return;
        }
        if(itemKind) {
            itemName = ItemTypes.getKindAsString(itemKind);
        }
        if(itemName) {
            price = ItemTypes.getBuyPrice(itemName);
            if(price > 0) {
                if(ItemTypes.Store.isBuyMultiple(itemName)) {
                    price = price * itemCount;
                } else {
                    itemCount = 1;
                }
                goldCount = this.player.inventory.getItemNumber(400);


                if(goldCount < price) {
                    this.server.pushToPlayer(this.player, new Messages.Notify("You don't have enough Gold."));
                    return;
                }

                if(this.player.inventory.hasEmptyInventory()) {
                    this.player.inventory.putInventory(itemKind, ItemTypes.Store.getBuyCount(itemName) * itemCount);
                    this.player.inventory.putInventory(400, -1 * price);
                    this.server.pushToPlayer(this.player, new Messages.Notify("buy"));
                } else {
                    this.server.pushToPlayer(this.player, new Messages.Notify("There is not enough space in your inventory."));
                }
            }
        }
    },

    handleCraft: function(message) {
        var craft = message[1];

        if (!(craft in CraftData.Properties))
            return;

        var recipe = CraftData.Properties[craft];

        if(!this.player.inventory.hasEmptyInventory())
        {
            this.server.pushToPlayer(this.player, new Messages.Notify("You don't have enough space."));
            return;
        }

        for (var key in recipe.input)
        {
            var inputItem = Items.Properties[key];
            var inputCount = this.player.inventory.getItemNumber(inputItem.kind);
            if (recipe.input[key] > inputCount)
            {
                this.server.pushToPlayer(this.player, new Messages.Notify("You don't have enough resources."));
                return;
            }
        }

        for (var key in recipe.input)
        {
            var inputItem = Items.Properties[key];
            this.player.inventory.putInventory(inputItem.kind, -recipe.input[key]);

        }

        if (recipe.output=="weapon" || recipe.output=="weaponarcher" ||
            recipe.output=="armor" || recipe.output=="armorarcher")
        {
            var outputs = [];
            var range = (recipe.maxLevel - recipe.minLevel);
            var totalWeight = 0;
            var targetWeightMin = 0;
            var targetWeightMax = 0;
            for(var i=0; i < range; ++i)
            {
                var item = ItemTypes.getItemByLevel(recipe.output, ~~((recipe.minLevel+i)/2));

                if (item)
                {
                    outputs.push(item);
                    totalWeight += (range - i);
                }
            }
            //log.info(JSON.stringify(outputs));
            var random = Math.floor(Math.random()*totalWeight)
            //log.info("random="+random);
            //log.info("totalWeight="+totalWeight);
            for(var i=0; i < outputs.length; ++i)
            {
                targetWeightMin = targetWeightMax;
                targetWeightMax += (range - i);
                //log.info("targetWeightMin="+targetWeightMin);
                //log.info("targetWeightMax="+targetWeightMax);
                if (targetWeightMin >= random && random < targetWeightMax)
                {
                    this.player.inventory.putInventory(outputs[i].kind, 1);
                    break;
                }
            }
        }
        else
        {
            this.player.inventory.putInventory(Items.Properties[recipe.output].kind, 1);
        }
        this.server.pushToPlayer(this.player, new Messages.Notify("craft"));
    },

    handleInventory: function(message) { // 28
        var inventoryKind = message[1],
            inventoryNumber = message[2],
            count = message[3],
            self = this;


        if (inventoryNumber > self.player.inventory.number)
            return;

        var itemKind;

        switch (inventoryNumber) {
            case -1:
                itemKind = self.player.weapon;
                break;

            case -2:
                itemKind = self.player.armor;
                break;

            case -3:
                itemKind = self.player.pendant;
                break;

            case -4:
                itemKind = self.player.ring;
                break;

            default:
                itemKind = self.player.inventory.rooms[inventoryNumber].itemKind;
                break;
        }

        if (itemKind < 0)
            return;

        switch (inventoryKind) {
            case "armor":
                this.player.handleInventoryArmor(itemKind, inventoryNumber);
                break;

            case "weapon":
                this.player.handleInventoryWeapon(itemKind, inventoryNumber);
                break;

            case "empty":
                this.player.handleInventoryEmpty(itemKind, inventoryNumber, count);
                break;

            case "eat":
                this.player.handleInventoryEat(itemKind, inventoryNumber);
                break;

            case "enchantweapon":
                this.player.handleInventoryEnchantWeapon(itemKind, inventoryNumber);
                break;

            case "enchantbloodsucking":
                this.player.handleInventoryEnchantBloodsucking(itemKind, inventoryNumber);
                break;

            case "pendant":
                this.player.handleInventoryPendant(itemKind, inventoryNumber);
                break;

            case "ring":
                this.player.handleInventoryRing(itemKind, inventoryNumber);
                break;
        }
    },

    handleLoot: function(message){
        var self = this;
        var item = this.server.getEntityById(message[1]);
        if(item) {
            var kind = item.kind;
            var itemRank = 0;

            if(ItemTypes.isItem(kind)) {
                if(kind === 38) { // FIREPOTION
                    this.player.updateHitPoints();
                    this.broadcast(this.player.equip(169), false); // FIREBENEF
                    this.broadcast(item.despawn(), false);
                    this.server.removeEntity(item);
                    this.server.pushToPlayer(this.player, new Messages.PlayerPoints(this.player.maxHitPoints, this.player.maxMana, this.player.hitPoints, this.player.mana));
                } else {
                    if(self.player.inventory.putInventory(item.kind, item.count, item.skillKind, item.skillLevel)){
                        this.broadcast(item.despawn(), false);
                        this.server.removeEntity(item);
                    }
                }
            }
        }
    },

    handleDoor: function(message) {
        var doorX = message[1],
            doorY = message[2],
            toX = message[3],
            toY = message[4],
            orientation = message[5];



    },

    handleHit: function(message) {
        this.handleHitEntity(this.player, message[1]);
    },

    handleSpellHit: function(message) {
        this.handleHitEntity(this.player, message[1], message[2])
    },

    handleHitEntity: function(entity, mobId, spellType) { // 8
        var self = this,
            mob = self.server.getEntityById(mobId),
            isSpell,
            spellLevel;

        if (mob) {
            if (spellType)
                isSpell = true;

            if (mob.isInvincible) {
                self.server.pushToPlayer(self.player, new Messages.Chat(self.player, "Target is invincible."));
                return;
            }

            if ((self.player.pClass === Types.PlayerClass.FIGHTER || self.player.pClass === Types.PlayerClass.DEFENDER)
                && ItemTypes.isWeapon(self.player.weapon) && !self.player.isAdjacentNonDiagonal(entity))
                return;

            if (self.player.pClass == Types.PlayerClass.ARCHER && ItemTypes.isArcherWeapon(self.player.weapon) && !self.player.isNear(entity, 10))
                return;

            entity.setTarget(mob);

            if (entity == self.player) {
                if (!self.player.attackedTime.isOver(new Date().getTime()))
                    return;
            }

            self.player.hasAttacked = true;
            var damage;

            if (isSpell) {
                var spellName;

                if (spellType == 1)
                    spellName = "Deadly Attack";
                else if (spellType == 4)
                    spellName = "Whirlwind Attack";

                spellLevel = self.player.skillHandler.getLevel(spellName);
                damage = Formulas.dmg(entity, mob, spellType, spellLevel);
            } else
                damage = Formulas.dmg(entity, mob);

            if (damage > -1) {
                if (self.player.skillAttack > 1) {
                    damage = ~~(damage * self.player.skillAttack);
                    self.player.skillAttack = 1;
                }

                if (self.player.skillAoe > 0) {
                    mobs = self.server.getTargetsAround(mob, self.player.skillAoe);
                    self.player.skillAoe = 0;
                } else
                    mobs = [mob];

                for (var index in mobs) {
                    if (mobs.hasOwnProperty(index)) {
                        mob = mobs[index];

                        if (mob instanceof Player) {
                            mob.hitPoints -= damage;
                            mob.server.handleHurtEntity(mob, self.player, damage);
                            if (mob.hitPoints <= 0) {
                                mob.isDead = true;

                                if (entity == self.player)
                                    self.server.pushBroadcast(new Messages.Chat(entity, "/1 " + entity.name + " has just slain: " + mob.name + " in battle!"))
                            }

                            self.server.broadcastAttacker(entity);
                        } else {
                            mob.receiveDamage(damage, entity.id);

                            if (mob.hitPoints <= 0)
                                self.player.achievementAboutKill(mob);

                            self.server.handleMobHate(mob.id, entity.id, damage);
                            self.server.handleHurtEntity(mob, self.player, damage);
                        }
                    }
                }
            }
        }
    },

    handleStep: function(message) {
        if (!message)
            return;

        var self = this,
            id = message[1],
            x = message[2],
            y = message[3];

        var entity = self.server.getEntityById(id);

        if (entity) {
            if (entity.x == x && entity.y == y)
                return;

            entity.setPosition(x, y);
            self.broadcast(new Messages.Move(entity));
        }
    },

    handleDeath: function(message) {
        var self = this,
            id = message[1];

        if (self.player) {
            var spawnPoint = self.player.getSpawnPoint();
            var x = spawnPoint[0];
            var y = spawnPoint[1];

            self.redisPool.setPointsData(self.player.name, self.player.maxHitPoints, self.player.maxMana);
            self.redisPool.setPlayerPosition(self.player, x, y);
            self.player.setPosition(x, y);

        }
    },

    handleUpdate: function(message) {
        var self = this,
            id = message[1],
            x = message[2],
            y = message[3];

        if (self.player.id != id)
            return;

        var player = self.server.getEntityById(id);

        if (player) {
            if (player.x != x && player.y != y) {

            }
        }
    },

    handleWarp: function(message) {
        var self = this,
            id = message[1],
            warpId = message[2];

        if (self.player.id != id)
            return;

        var player = self.server.getEntityById(id);
    },

    handlePlayerReady: function(message) {
        var self = this,
            id = message[1];

        if (self.player.id != id) {
            log.info("ID Mismatch whilst handling player.");
            return;
        }

        var player = self.server.getEntityById(id);

        self.server.pushRelevantEntityListTo(player);
    },

    handleCast: function(message) {
        var self = this,
            projectile = message[1],
            sx = Math.floor(message[2] / 16),
            sy = Math.floor(message[3] / 16),
            x = Math.floor(message[4] / 16),
            y = Math.floor(message[5] / 16);

        var p = self.player;

        var projectileId = '' + Utils.randomInt(0, projectile) + Utils.randomInt(0, sx) + Utils.randomInt(0, x) + Utils.randomInt(0, sy) + Utils.randomInt(0, y);

        log.info("ProjectileId: "+ projectileId);

        self.broadcast(new Messages.Projectile(projectileId, projectile, sx, sy, x, y, self.player.id), false);


        switch (projectile) {
            case 1:
                var skill1Level = self.player.skillHandler.getLevel("Deadly Attack");

                self.player.mana -= SkillData.SkillNames["Deadly Attack"].manaReq[skill1Level - 1];
                break;

            case 4:
                var skill4Level = self.player.skillHandler.getLevel('Whirlwind Attack');

                self.player.mana -= SkillData.SkillNames["Whirlwind Attack"].manaReq[skill4Level - 1];
                break;

            default:
                return;
        }

        if (self.player.mana < 0 || isNaN(self.player.mana))
            self.player.mana = 0;


        self.server.pushToPlayer(p, new Messages.PlayerPoints(p.maxHitPoints, p.maxMana, p.hitPoints, p.mana), false);
    },

    handleSkill: function(message) {
        var self = this,
            value = message[1],
            targetId = message[2],
            p = this.player,
            skillHandler = p.skillHandler,
            skill;

        log.info("Received Skill Data: " + value);

        if (typeof value != 'string')
            skill = skillHandler.skillSlots[value - 1];
        else
            skill = value;

        if (p.getActiveSkill() != 0)
            return;

        if (targetId)
            var target = self.server.getEntityById(targetId);

        var skillLevel = skillHandler.getLevel(skill),
            mana = SkillData.SkillNames[skill].manaReq[skillLevel],
            originalData = [50, 150, 100, 450, 1000];

        
        switch(skill) {
            case "Run":
                var runData = [50, 90, 80, 450, 1000];

                self.server.pushToPlayer(p, new Messages.CharData(runData));
                p.setActiveSkill(Types.ActiveSkill.RUN);
                p.mana -= mana;

                setTimeout(function() {
                    self.server.pushToPlayer(p, new Messages.CharData(originalData));
                }, 5000 * skillLevel);
                break;

            case "Berserker":
                var berserkerData = [25, 150, 100, 450, 500];

                self.server.pushToPlayer(p, new Messages.CharData(berserkerData));
                p.setActiveSkill(Types.ActiveSkill.BERSERKER);
                p.mana -= mana;

                setTimeout(function() {
                    self.server.pushToPlayer(p, new Messages.CharData(originalData));
                }, 4000 * skillLevel);

                break;

            case "Whirlwind Attack":
                self.server.pushToPlayer(p, new Messages.ForceCast(4));
                break;

            case "Deadly Attack":
                self.server.pushToPlayer(p, new Messages.ForceCast(1));
                break;

        }

        setTimeout(function() {
            p.resetActiveSkill();
        }, 20000);


        self.server.pushToPlayer(p, new Messages.PlayerPoints(p.maxHitPoints, p.maxMana, p.hitPoints, p.mana));
    },

    handleHurt: function(mob){ // 9
        var self = this;

        if (this.player.isInvincible || this.player.isDead)
            return;


        if(mob && this.player.hitPoints > 0 && mob instanceof Mob) {
            var evasionLevel = this.player.skillHandler.getLevel("evasion");

            if(evasionLevel > 0) {
                var randNum = Math.random(),
                    avoidChance = 0.05 * evasionLevel;

                if(randNum < avoidChance){
                    this.server.pushToPlayer(this.player, new Messages.Damage(this.player, 'MISS', mob.hitPoints, mob.maxHitPoints));
                    return;
                }
            }

            this.player.hitPoints -= Formulas.dmg(mob, this.player);
            this.server.handleHurtEntity(this.player, mob);
            mob.addTanker(this.player.id);

            if(this.player.hitPoints <= 0)
                this.player.isDead = true;
        }
    },

    handleGather: function (message) {
        var self = this;
        var targetId = message[1];
        var p = this.player;

        var target;
        if (targetId) {
            target = this.server.getEntityById(targetId);
        }

        if (!(target instanceof Gather))
            return;

        var level = GatherData.Kinds[target.kind].level;
        if (this.player.level < level)
        {
            this.server.pushToPlayer(this.player, new Messages.Chat(this.player, "You need to be level "+level));
            return;
        }

        var oldx = this.player.x,
            oldy = this.player.y;
        self.player.hasAttacked = false;
        self.player.hasMoved = false;

        this.server.pushToPlayer(this.player, new Messages.Chat(this.player, "Gathering..."));
        setTimeout(function() {
            if (self.player.hasAttacked ||
                self.player.hasMoved)
            {
                self.server.pushToPlayer(self.player, new Messages.Chat(self.player, "Player moved or attacked gathering aborted"));
                return;
            }
            self.player.hasAttacked = false;
            self.player.hasMoved = false;
            self.server.handleGather(self.player, target);
        }, 5000);
    },

    handleSkillInstall: function(message) {
        var index = message[1],
            name = message[2],
            self = this;

        if(((index >= 0) && (index < 5)) && (name in SkillData.SkillNames)) {
            self.redisPool.handleSkillInstall(this.player, index, name, function() {
                self.player.skillHandler.install(index, name);
                self.server.pushToPlayer(self.player, new Messages.SkillInstall(index, name));
            });
        }
    },


    handleSkillLoad: function () {
        var self = this,
            skills = self.player.skillHandler.skills,
            index = 0;

        for (var object in skills) {
            index++;
            if (skills.hasOwnProperty(object)) {
                var skillName = object,
                    skillLevel = skills[object];

                self.player.skillHandler.add(skillName, skillLevel);
                self.server.pushToPlayer(self.player, new Messages.SkillLoad(index, skillName, skillLevel));
            }
        }

        self.redisPool.loadSkillSlots(self.player, function(skillNames) {
            for(var index = 0; index < skillNames.length; index++) {

                var skillName = skillNames[index];
                if (!skillName)
                    break;

                self.player.skillHandler.install(index, skillName);
                self.server.pushToPlayer(self.player, new Messages.SkillInstall(index, skillName));

            }

        });

    },

    handleClientFocus: function (message) {
        var hasFocus = message[1];

        this.hasFocus = (hasFocus == 0) ? false : true;
    },

    handleMoveEntity: function (message) {
        var self = this,
            entityId = message[1],
            x = message[2],
            y = message[3];

        var entity = self.server.getEntityById(entityId);

        try {
            if (self.server.isValidPosition(x, y)) {
                entity.setPosition(x, y);
                self.broadcast(new Messages.Move(entity), true);
                self.move_callback(entity.x, entity.y);
            }
        } catch (e) {
            log.info("Caught handled exception: " + e);
        }
    },

    handleAddSpawn: function (msg) {
        var id = msg[1],
            x = msg[2],
            y = msg[3];

        if (this.player.isAdmin() && this.server.isValidPosition(x, y))
        {
            EntitySpawn.addSpawn(id, x, y);
            this.server.spawnEntity(id, x, y);
        }
    },

    handleSaveSpawns: function (msg) {
        if (this.player.isAdmin())
            EntitySpawn.saveSpawns();
    },

    handlePartyInvite: function (msg) {
        var self = this,
            inviteId = msg[1],
            status = msg[2],
            invitedPlayer = self.server.getEntityById(inviteId),
            party = self.player.party;

        switch (status) {

            case 0:
                self.server.pushToPlayer(invitedPlayer, new Messages.PartyInvite(self.player.id));
                break;

            case 1:
                if (party) {
                    if (party.player.length >= 5)
                        self.server.pushToPlayer(self.player, new Messages.Chat(self.player, "You have reached the maximum players in a party!"));

                    party.removePlayer(self.player);
                    self.handlePartyAbandoned(party);
                    if (invitedPlayer == party.leader)
                        party.addPlayer(self.player);

                } else
                    self.player.party = self.server.addParty(invitedPlayer, self.player);

                if (invitedPlayer)
                    self.server.pushToPlayer(invitedPlayer, new Messages.Chat(invitedPlayer, self.player.name + " has joined your party!"));

                self.server.pushToPlayer(self.player, new Messages.Chat(self.player, "You are now in a party with: " + invitedPlayer.name ? invitedPlayer.name : "undefined" + "!"));
                break;

            case 2:
                self.server.pushToPlayer(invitedPlayer, new Messages.Chat(invitedPlayer, self.player.name + " has rejected your invitation."));
                self.server.pushToPlayer(self.player, new Messages.Chat(self.player, "You have rejected " + invitedPlayer.name ? invitedPlayer.name : "undefined" + "'s invitation."));
                break
        }
    },

    handlePartyLeave: function (msg) {
        var party = this.player.party,
            leader;

        if (party.leader)
            leader = party.leader;

        if (!party)
        {
            this.server.pushToPlayer(this.player, new Messages.Chat(this.player, "You cannot leave as you are not in a party."));
            return;
        }

        party.removePlayer(this.player);
        this.handlePartyAbandoned(party);

        this.server.pushToPlayer(leader, new Messages.Chat(leader, this.player.name+" has left your party."));


        this.server.pushToPlayer(this.player, new Messages.Chat(this.player, "You have left "+this.player.name+"'s party."));

    },

    handlePartyLeader: function (msg) {
        var leaderId = msg[1];
        var player2 = this.server.getEntityById(leaderId);
        var party = this.player.party;

        if (!party)
        {
            this.server.pushToPlayer(this.player, new Messages.Chat(this.player, "You cannot set the leader as you are not in a party."));
            return;
        }

        if (this.player == party.leader)
        {
            party.leader = player2;
            this.server.pushToPlayer(player2, new Messages.Chat(player2, "You are now the leader."));
            this.server.pushToPlayer(this.player, new Messages.Chat(this.player, party.leader.name + " is now leader."));
        }
        else
        {
            this.server.pushToPlayer(this.player, new Messages.Chat(this.player, party.leader.name + " is already leader."));
        }
    },

    handlePartyKick: function (msg) {
        var kickId = msg[1];
        var player2 = this.server.getEntityById(kickId);
        var party = this.player.party;

        if (!party)
        {
            this.server.pushToPlayer(this.player, new Messages.Chat(this.player, "You cannot kick as you are not in a party."));
            return;
        }

        if (this.player == party.leader) {
            party.removePlayer(player2);
            this.server.pushToPlayer(player2, new Messages.Chat(player2, "You have been kicked from the party."));
            this.handlePartyAbandoned(party);
        }
        else {
            this.server.pushToPlayer(this.player, new Messages.Chat(this.player, "You cannot kick as you are not leader."));
        }
    },

    handlePartyAbandoned: function (party)
    {
        if (party.players.length == 1)
        {
            this.server.removeParty(party);
            this.server.pushToPlayer(this.player, new Messages.Chat(this.player, "The party has been disbanded."));
            if (this.player !== party.players[0])  {
                this.server.pushToPlayer(party.players[0], new Messages.Chat(party.players[0], "The party has been disbanded."));
            }
        }
    },

    handlePetCreate: function (msg)
    {
        var targetId = msg[1];
        var petKind = msg[2];

        // Only Admins and valid Monsters can spawn.
        if (!this.player.isAdmin() || !MobData.Kinds[petKind])
            return;

        var target = this.server.getEntityById(targetId);
        var pos = Utils.randomPositionNextTo(target);
        //log.info("pos: " + JSON.stringify(pos));
        if (!this.server.isValidPosition(pos.x, pos.y))
            return;

        var pet = this.server.addPet(target, petKind, pos.x, pos.y);
        this.redisPool.handlePet(target, target.pets.length-1, pet.kind);
    },

    handlePetDestroy: function (msg)
    {
        var petKind = msg[1];

        // TODO
    },

    handleClassSwitch: function (msg) {

        var pClass = msg[1];

        if ((this.player.weapon && !this.player.handleInventoryWeaponUnequip()) || (this.player.armor && !this.player.handleInventoryArmorUnequip()))
            return;

        this.player.pClass = pClass;
        this.player.updateHitPoints();
        this.server.pushToPlayer(this.player, new Messages.PlayerPoints(this.player.maxHitPoints, this.player.maxMana, this.player.hitPoints, this.player.mana));

        this.redisPool.changePlayerClass(this.player);
        this.server.pushToPlayer(this.player, new Messages.SwitchClass(this.player.pClass));
        this.server.pushToPlayer(this.player, new Messages.Chat(this.player, "The Player Class has been switched."));

        this.player.skillHandler.clear();
        this.redisPool.delSkillSlots(this.player);

        var self = this;

        this.player.skillHandler.installSkills(this.player);

        for(var index in self.player.skills) {
            if (self.player.skills.hasOwnProperty(index)) {
                var skillName = self.player.skills[index].skillData.name;
                var skillLevel = self.player.skills[index].skillLevel;

                self.player.skillHandler.add(skillName, skillLevel);
                self.server.pushToPlayer(self.player, new Messages.SkillLoad(index, skillName, skillLevel));
            }
        }
        
    },


    send: function(message) {
        this.connection.send(message);
    },

});
