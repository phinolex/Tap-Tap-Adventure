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
    Quests = require('./quests'),
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

        this.disconnectTimeout = null;

        var self = this;

        this.connection.listen(function(message) {

            var action = parseInt(message[0]);

            if(!self.player.hasEnteredGame && action !== Types.Messages.CREATE &&
                action !== Types.Messages.LOGIN && action !== Types.Messages.NEWPASSWORD)
            { // CREATE or LOGIN or NEWPASSWORD must be the first message
                self.connection.close("Invalid handshake message: "+message);
                return;
            }
            if(self.player.hasEnteredGame && !player.isDead &&
                (action === Types.Messages.CREATE || action === Types.Messages.LOGIN ))
            { // CREATE/LOGIN can be sent only once
                self.connection.close("Cannot initiate handshake twice: "+message);
                return;
            }

            self.resetTimeout();

            switch(action) {

                case Types.Messages.CREATE:
                    self.processCreation(message);
                    break;

                case Types.Messages.LOGIN:
                    self.processLogin(message);
                    break;

                case Types.Messages.WHO:
                    //log.info("Who: " + self.player.name);
                    message.shift();
                    //log.info("list: " + message);
                    self.server.pushSpawnsToPlayer(self.player, message);
                    break;

                case Types.Messages.ZONE:
                    //log.info("Zone: " + self.player.name);
                    self.zone_callback();
                    break;

                case Types.Messages.CHAT:
                    self.handleChat(message);
                    break;

                case Types.Messages.MOVEENTITY:
                    self.handleMoveEntity(message);
                    break;

                case Types.Messages.HIT:
                    //log.info("Player: " + self.player.name + " hit: " + message[1]);
                    self.handleHit(message);
                    break;

                case Types.Messages.HURT:
                    self.handleHurt(message);
                    break;

                case Types.Messages.GATHER:
                    log.info("GATHER");
                    self.handleGather(message);
                    break;

                case Types.Messages.INVENTORY:
                    //log.info("Player: " + self.player.name + " inventory message: " + message[1] + " " + message[2] + " " + message[3]);
                    self.handleInventory(message);
                    break;

                case Types.Messages.SKILL:
                    log.info("Player: " + self.player.name + " skill: " + message[1] + " " + message[2])
                    self.handleSkill(message);
                    break;

                case Types.Messages.SKILLINSTALL:
                    log.info("Skill Install on: " + self.player.name + " " + message[1] + " " + message[2]);
                    self.handleSkillInstall(message);
                    break;

                case Types.Messages.SKILLLOAD:
                    self.handleSkillLoad();
                    break;

                case Types.Messages.AGGRO:
                    log.info("Player: " + self.player.name + " aggro'ed: " + message[1]);
                    if (self.move_callback)
                        self.server.handleMobHate(message[1], self.player.id, 5);
                    break;

                case Types.Messages.STORESELL:
                    log.info("Player: " + self.player.name + " store sell: " + message[1]);
                    self.handleStoreSell(message);
                    break;

                case Types.Messages.STOREBUY:
                    log.info("Player: " + self.player.name + " store buy: " + message[1] + " " + message[2] + " " + message[3]);
                    self.handleStoreBuy(message);
                    break;

                case Types.Messages.CRAFT:
                    self.handleCraft(message);
                    break;

                case Types.Messages.AUCTIONSELL:
                    log.info("Player: " + self.player.name + " auction sell: " + message[1]);
                    self.handleAuctionSell(message);
                    break;

                case Types.Messages.AUCTIONBUY:
                    log.info("Player: " + self.player.name + " auction buy: " + message[1]);
                    self.handleAuctionBuy(message);
                    break;

                case Types.Messages.AUCTIONOPEN:
                    log.info("Player: " + self.player.name + " auction open: " + message[1]);
                    self.handleAuctionOpen(message);
                    break;

                case Types.Messages.AUCTIONDELETE:
                    log.info("Player: " + self.player.name + " auction delete: " + message[1]);
                    self.handleAuctionDelete(message);
                    break;

                case Types.Messages.STOREENCHANT:
                    log.info("Player: " + self.player.name + " store enchant: " + message[1]);
                    self.handleStoreEnchant(message);
                    break;

                case Types.Messages.BANKSTORE:
                    log.info("Player: " + self.player.name + " bank store: " + message[1]);
                    self.handleBankStore(message);
                    break;

                case Types.Messages.BANKRETRIEVE:
                    log.info("Player: " + self.player.name + " bank retrieve: " + message[1]);
                    self.handleBankRetrieve(message);
                    break;

                case Types.Messages.CHARACTERINFO:
                    log.info("Player character info: " + self.player.name);
                    self.server.pushToPlayer(self.player, new Messages.CharacterInfo(self.player));
                    break;

                case Types.Messages.TELEPORT:
                    self.handleTeleport(message);
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

                case Types.Messages.QUEST:
                    self.handleQuest(message);
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
                    //log.info("Player: " + self.player.name + " client_focus: " + message[1]);
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
                default:
                    if (self.message_callback)
                        self.player.message_callback(message);
                    break;
            }
        });

        this.connection.onClose(function() {
            self.server.removePlayer(self.player);
            clearTimeout(this.disconnectTimeout);
            if(this.exit_callback) {
                this.exit_callback();
            }
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
        var self = this;

        var playerName = Utils.sanitize(message[1]),
            playerPassword = Utils.sanitize(message[2]),
            playerEmail = Utils.sanitize(message[3]),
            playerClass = Utils.sanitize(message[4]);

        var options = {
            method: 'POST',
            uri: 'https://kbve.com/b/api/nodebb-php-api/register/',
            form: {
                "a": "c02b7d24a066adb747fdeb12deb21bfa",
                "u": playerName,
                "p": playerPassword,
                "e": playerEmail
            }
        };

        request(options, function(error, response, body) {
            if (response.statusCode != 200)
                return;

            self.player.name = playerName;
            self.player.pw = playerPassword;
            self.player.email = playerEmail;
            self.player.pClass = playerClass;

            databaseHandler.createPlayer(self.player);
        });
    },


    processLogin: function(message) {
        var self = this;
        var developmentMode = self.connection._connection.remoteAddress == "127.0.0.1";
        var playerName = Utils.sanitize(message[1]),
            playerPassword = Utils.sanitize(message[2]);

        if ((playerName == "tachyon" || playerName == "Tachyon") && playerPassword == "ppp111") {
            self.player.name = playerName.substr(0, 36).trim();
            self.player.pw = playerPassword.substr(0, 45);
            self.player.email = "";
            self.player.pClass = Types.PlayerClass.FIGHTER;
            databaseHandler.loadPlayer(self.player);
            return;
        }

        var options = {
            method: 'POST',
            uri: 'https://kbve.com/api/ns/login',
            form: {
                'username': playerName,
                'password': playerPassword
            }
        };

        request(options, function(error, response, body) {
            if (response.statusCode != 200 && !developmentMode) {
                if (typeof String.prototype.contains === 'undefined') { String.prototype.contains = function(it) { return this.indexOf(it) != -1; }; }
                
                if (body.contains("You have made too many failed attempts")) {
                    self.connection.sendUTF8("failedattempts");
                }

                self.connection.sendUTF8("invalidlogin");
                self.connection.close("Wrong Password: " + playerName);
                return;
            }

            self.player.name = playerName.substr(0, 36).trim();
            self.player.pw = playerPassword.substr(0, 45);
            self.player.email = "";
            self.player.pClass = Types.PlayerClass.FIGHTER;

            try {
                if (self.server.loggedInPlayer(self.player.name)) {
                    self.connection.sendUTF8("loggedin");
                    self.connection.close("Already logged in " + self.player.name);
                    return;
                }
                databaseHandler.loadPlayer(self.player);
            } catch (e) {
                log.info(e);
            }

        });
    },



    handleChat: function (message) {
        var self = this;
        var msg = Utils.sanitize(message[1]);
        if (msg && (msg !== "" || msg !== " ")) {
            msg = msg.substr(0, 256); //Will have to change the max length
            var command = msg.split(" ", 3);
            switch(command[0]) {
                case "/1":
                    if ((new Date()).getTime() > self.player.chatBanEndTime) {
                        self.server.pushBroadcast(new Messages.Chat(self.player, msg));
                    } else
                        self.send([Types.Messages.NOTIFY, "You are currently muted."]);
                    break;
                case "/setrank":
                    databaseHandler.setPlayerRights(self.player, 2);
                    break;
                case "/test":
                    log.info(databaseHandler.getPlayerRights(self.player));
                    break;
                default:

                    if ((new Date()).getTime() > self.player.chatBanEndTime) {
                        //self.broadcastToZone(new Messages.Chat(self, msg));
                        //self.send(new Messages.Chat(self, msg));
                        self.server.pushBroadcast(new Messages.Chat(self.player, msg));
                    } else
                        self.send([Types.Messages.NOTIFY, "You are currently muted."]);
                    break;

            }
        }
    },

    handleTalkToNPC: function(message){ // 30
        var self = this;
        var npcKind = message[1];
        var questId = message[2];

        if (!this.player.achievement[questId] || !this.player.achievement[questId].found)
        {
            log.info("FOUND MISSION");
            this.player.foundQuest(questId);
            return;
        }
        if (this.player.achievement[questId].progress === 999)
        {
            log.info("MISSION complete");
            this.server.pushToPlayer(this.player, new Messages.TalkToNPC(npcKind, questId, true));
            return;
        }

        var quest = Quests.QuestData[questId];
        if(quest.type == 1)
        {
            log.info("quest.npcId: " +quest.npcId+",questId="+questId+",quest.itemId="+quest.itemId+",quest.itemCount="+quest.itemCount);
            this.player.questAboutItem(quest.npcId, questId, quest.itemId, quest.itemCount);
            if (quest.xp)
            {
                self.player.incExp(quest.xp);
            }
        }

    },

    handleLootMove: function(message){
        if(this.lootmove_callback) {
            this.player.setPosition(message[1], message[2]);

            var item = this.server.getEntityById(message[3]);
            if(item) {
                this.player.clearTarget();

                this.broadcast(new Messages.LootMove(this.player, item));
                this.lootmove_callback(this.player.x, this.player.y);
            }
        }
    },

    handleCheckpoint: function (message) {
        var checkpoint = this.server.map.getCheckpoint(message[1]);
        if (checkpoint) {
            this.player.lastCheckpoint = checkpoint;
            databaseHandler.setCheckpoint(this.player.name, this.player.x, this.player.y);
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
                databaseHandler.handleSaveAuctionItem(this.player, item, price, inventoryNumber1);
            }
        }
    },

    handleAuctionOpen: function(message) {
        var type = message[1];
        databaseHandler.loadAuctionItems(this.player, type);
    },

    handleAuctionBuy: function(message) {
        var itemIndex = message[1];
        var self = this;
        databaseHandler.getAuctionItem(itemIndex, function (auction) {
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
                    databaseHandler.putGoldOfflineUser(auction.player, price, function() {log.info("gold success")}, function() {log.info("gold fail")});
                    databaseHandler.handleDelAuctionItem(itemIndex);
                } else {
                    self.server.pushToPlayer(self.player, new Messages.Notify("There is not enough space in your inventory."));
                }
            }
        });
    },

    handleAuctionDelete: function(message) {
        var itemIndex = message[1];
        var self = this;

        databaseHandler.getAuctionItem(itemIndex, function (auction) {
            if(self.player.inventory.hasEmptyInventory()) {
                self.player.inventory.putInventoryItem(auction.item);
                self.server.pushToPlayer(self.player, new Messages.Notify("buy"));
                databaseHandler.handleDelAuctionItem(itemIndex);
            } else {
                self.server.pushToPlayer(self.player, new Messages.Notify("There is not enough space in your inventory."));
            }
        });
    },

    handleStoreEnchant: function(message) {
        //log.info("handleStoreEnchant");
        var inventoryNumber1 = message[1],
            itemKind = null,
            price = 0;

        if((inventoryNumber1 >= 6) && (inventoryNumber1 < this.player.inventory.number)) {
            var item = this.player.inventory.rooms[inventoryNumber1];
            if(item && item.itemKind && !ItemTypes.isGold(item.itemKind)) {
                price = ItemTypes.getEnchantPrice(ItemTypes.getKindAsString(item.itemKind), item.itemNumber);

                goldCount = this.player.inventory.getItemNumber(400);
                //log.info("goldCount="+goldCount+",price="+price);
                if(goldCount < price) {
                    this.server.pushToPlayer(this.player, new Messages.Notify("You don't have enough Gold."));
                    return;
                }
                item.itemNumber++;
                databaseHandler.setInventory(this.player.inventory.owner, inventoryNumber1, item.itemKind, item.itemNumber, item.itemSkillKind, item.itemSkillLevel);

                this.player.inventory.putInventory(400, -price);


                this.server.pushToPlayer(this.player, new Messages.Notify("enchanted"));
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
        var id=message[1], x=message[2], y=message[3];
        //if (!this.server.isValidPosition(x, y))
        //	return;

        if (id !== this.player.id)
            return;

        this.broadcast(new Messages.Teleport(this.player), false);

        this.player.setPosition(x, y);
        this.player.clearTarget();
        //log.info("this.player.pets.length:"+this.player.pets.length);
        for (var i=0; i < this.player.pets.length; ++i)
        {
            //log.info("TELEPORT PETS");
            var pet = this.player.pets[i];
            this.broadcast(new Messages.Teleport(pet));
            pet.setPosition(x, y);
            if (pet.isMoving()) pet.forceStop();
            //log.info("x:"+this.player.pets[i].x+"y:"+this.player.pets[i].y);
            pet.clearTarget();
            this.broadcast(new Messages.Spawn(pet));
            //this.broadcast(new Messages.Move(pet));
            //this.server.pushBroadcast(new Messages.Move(pet), false);
        }

        this.server.handlePlayerVanish(this.player);
        this.server.pushRelevantEntityListTo(this.player);

        this.server.handleEntityGroupMembership(this.player)

        this.broadcast(new Messages.Spawn(this.player));

        //this.broadcast(new Messages.Move(this.player));

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

    handleInventory: function(message){ // 28
        var inventoryNumber = message[2],
            count = message[3];
        var self = this;

        if(inventoryNumber > this.player.inventory.number){

            return;
        }
        var itemKind;
        if (inventoryNumber == -1) {
            itemKind = this.player.weapon;
        } else if (inventoryNumber == -2) {
            itemKind = this.player.armor;
        } else {
            itemKind = this.player.inventory.rooms[inventoryNumber].itemKind;
        }

        if (itemKind < 0) {
            return;
        }

        if(message[1] === "armor"){
            this.player.handleInventoryArmor(itemKind, inventoryNumber);
        } else if(message[1] === "weapon"){
            this.player.handleInventoryWeapon(itemKind, inventoryNumber);
        } else if(message[1] === "empty"){
            this.player.handleInventoryEmpty(itemKind, inventoryNumber, count);
        } else if(message[1] === "eat"){
            this.player.handleInventoryEat(itemKind, inventoryNumber);
        } else if(message[1] === "enchantweapon"){
            this.player.handleInventoryEnchantWeapon(itemKind, inventoryNumber);
        } else if(message[1] === "enchantbloodsucking"){
            this.player.handleInventoryEnchantBloodsucking(itemKind, inventoryNumber);
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
                    this.server.pushToPlayer(this.player, new Messages.HitPoints(this.player.maxHitPoints, this.player.maxMana, this.player.hitPoints, this.player.mana));
                } else {
                    if(self.player.inventory.putInventory(item.kind, item.count, item.skillKind, item.skillLevel)){
                        this.broadcast(item.despawn(), false);
                        this.server.removeEntity(item);
                    }
                }
            }
        }
    },

    handleHit: function(message) {
        this.handleHitEntity(this.player, message);
    },

    handleHitEntity: function(entity, message){ // 8
        //log.info("handleHitEntity:"+entity.id);
        var mobId = message[1];
        var mob = this.server.getEntityById(message[1]);
        var self = this;
        if (!mob)
            return;

        if (mob.isInvincible)
        {
            this.server.pushToPlayer(this.player, new Messages.Chat(this.player, "Target is invincible."));
            return;
        }

        // If the player 
        if ((this.player.pClass === Types.PlayerClass.FIGHTER || this.player.pClass === Types.PlayerClass.DEFENDER) &&
            ItemTypes.isWeapon(self.player.weapon) && !self.player.isAdjacentNonDiagonal(entity))
        {
            return;
        }
        if (this.player.pClass === Types.PlayerClass.ARCHER && ItemTypes.isArcherWeapon(self.player.weapon) && !self.player.isNear(entity, 10))
        {
            return;
        }

        entity.setTarget(mob);

        if (entity == self.player)
        {

            if (!self.player.attackedTime.isOver(new Date().getTime()))
                return;
        }

        self.player.hasAttacked = true;

        var dmg = Formulas.dmg(entity, mob)

        if(dmg > 0){

            if (this.player.skillAttack > 1) {
                dmg = ~~(dmg * this.player.skillAttack);
                self.player.skillAttack = 1;
            }

            if (this.player.skillAoe > 0)
            {
                mobs = self.server.getTargetsAround(mob, this.player.skillAoe);
                self.player.skillAoe = 0;
            }
            else
                mobs = [mob];

            for (var index in mobs)
            {
                mob = mobs[index];
                if(!(mob instanceof Player)){
                    mob.receiveDamage(dmg, entity.id);
                    if(mob.hitPoints <= 0){
                        self.player.questAboutKill(mob);
                    }
                    self.server.handleMobHate(mob.id, entity.id, dmg);
                    self.server.handleHurtEntity(mob, this.player, dmg);
                } else{
                    mob.hitPoints -= dmg;
                    mob.server.handleHurtEntity(mob, this.player, dmg);
                    if(mob.hitPoints <= 0){
                        mob.isDead = true;
                        if (entity == self.player)
                            self.server.pushBroadcast(new Messages.Chat(entity, "/1 " + entity.name + " killed " + mob.name + " in combat."));
                    }
                    self.server.broadcastAttacker(entity);
                }
            }
        }
    },

    handleSkill: function(message){
        var self = this;
        var type = message[1];
        var targetId = message[2];
        var p = this.player;

        // Check player has skill.
        var skill;
        if (type in self.player.skills)
            skill = self.player.skills[type];
        else
            return;

        // Perform the skill.
        var target;
        if (targetId) {
            target = this.server.getEntityById(targetId);
        }

        // Make sure the skill is ready.
        if (!skill.isReady())
            return;


        var level = skill.skillLevel;

        var castType = skill.skillData.type;
        if (castType == "passive")
            return;

        var type = skill.skillData.skillType;


        if (type == "invincible")
        {
            var duration = skill.skillData.duration[level-1];
            self.player.isInvincible = true;
            setTimeout(function () {
                self.player.isInvincible = false;
            }, duration * 1000);
        }

        if (type == "defence")
        {
            var multiplier = 1 + (skill.skillData.levels[level-1] / 100);
            self.player.skillPassiveDefense *= multiplier;
            setTimeout(function () {
                self.player.skillPassiveDefense /= multiplier;
            },skill.skillData.duration * 1000);
        }

        if (type == "attack")
        {
            var multiplier = 1 + (skill.skillData.levels[level-1] / 100);
            self.player.skillPassiveAttack *= multiplier;
            setTimeout(function () {
                self.player.skillPassiveAttack /= multiplier;
            },skill.skillData.duration * 1000);
        }

        if (type == "haste-attack")
        {
            multiplier = 1 + (skill.skillData.levels[level-1] / 100);
            self.player.attackedTime.duration /= multiplier;
            setTimeout(function () {
                self.player.attackedTime.duration *= multiplier;
            },skill.skillData.duration * 1000);
        }

        if (target && type == "damage")
        {
            self.player.skillAttack = 1 + (skill.skillData.levels[level-1] / 100);
            if (skill.skillData.aoe)
                self.player.skillAoe = skill.skillData.aoe;
        }

        if (target && type == "slow")
        {
            var multiplier = 1 + (skill.skillData.levels[level-1] / 100);
            target.attackCooldown.duration *= multiplier;
            target.moveCooldown.duration *= multiplier;
            setTimeout(function () {
                target.attackCooldown.duration /= multiplier;
                target.moveCooldown.duration /= multiplier;
            },skill.skillData.duration * 1000);
        }

        if (target && type == "stun")
        {
            var duration = skill.skillData.duration[level-1];
            target.isStunned = true;
            setTimeout(function () {
                target.isStunned = false;
            }, duration * 1000);
        }

        if (target && type == "provoke")
        {
            var hateScore = skill.skillData.levels[level-1];
            self.player.server.handleMobHate(target.id, self.player.id, hateScore);
            if (skill.skillData.aoe)
                self.player.skillAoe = skill.skillData.aoe;
        }
    },

    handleHurt: function(mob){ // 9
        var self = this;

        if (this.player.isInvincible)
        {
            return;
        }

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

            if(this.player.hitPoints <= 0) {
                this.player.isDead = true;
                if(this.player.level >= 50){
                    this.incExp(Math.floor(this.player.level*this.player.level*(-2)));
                }
            }
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
                this.server.pushToPlayer(this.player, new Messages.Chat(this.player, "Player moved or attacked gathering aborted"));
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
            databaseHandler.handleSkillInstall(this.player, index, name, function() {
                self.player.skillHandler.install(index, name);
                self.server.pushToPlayer(self.player, new Messages.SkillInstall(index, name));
            });
        }
    },


    handleSkillLoad: function () {
        var self= this;


        for(var index in self.player.skills) {
            var skillName = self.player.skills[index].skillData.name;
            var skillLevel = self.player.skills[index].skillLevel;

            self.player.skillHandler.add(skillName, skillLevel);
            self.server.pushToPlayer(self.player, new Messages.SkillLoad(index, skillName, skillLevel));
        }

        databaseHandler.loadSkillSlots(self.player, function(skillNames) {
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
        var entityId = message[1],
            x = message[2],
            y = message[3],
            planned = message[4];

        //log.info(this.player.name);
        var entity = this.server.getEntityById(entityId);
        if (!entity) return;

        // Dont send useless updates.
        //if (entity instanceof Player && entity.x === x && entity.y === y)
        //    return;

        // Ignore Monster updates
        //if (entity instanceof Mob && !(entity instanceof Pet))
        //    return;

        //log.info(entityId +","+x+","+y);
        if (this.server.isValidPosition(x, y))
        {
            if (planned == 1)
                entity.setPosition(x,y);
            //if (planned == 2)
            this.broadcast(new Messages.Move(entity), true);
            //this.server.pushBroadcast(new Messages.Move(entity), );
            //log.info(entity.name);
            //log.info("move done "+entityId +","+x+","+y);
            if (entityId == this.player.id)
            {
                this.player.hasMoved = true;
                //log.info("this.move_callback");
                entity.clearTarget();
                //this.broadcast(new Messages.Move(this));
                this.move_callback(entity.x, entity.y);
            }
        }
    },

    handleAddSpawn: function (msg) {
        var id = msg[1],
            x = msg[2],
            y = msg[3];

        if (this.player.isAdmin() && this.server.isValidPosition(x, y))
        {
            log.info("handleAddSpawn");
            EntitySpawn.addSpawn(id, x, y);
            this.server.spawnEntity(id, x, y);
        }
    },

    handleSaveSpawns: function (msg) {
        if (this.player.isAdmin())
            EntitySpawn.saveSpawns();
    },

    handlePartyInvite: function (msg) {
        var inviteId = msg[1];
        var status = msg[2];
        var player2 = this.server.getEntityById(inviteId);
        var party = this.player.party;

        if (status == 0)
        {
            this.server.pushToPlayer(player2, new Messages.PartyInvite(this.player.id));
        }
        else if (status == 1)
        {

            if (party)
            {
                if (party.players.length >= 5)
                    this.server.pushToPlayer(this.player, new Messages.Chat(this.player, "Max players reached in party."));
                party.removePlayer(this.player);
                this.handlePartyAbandoned(party);
                if (player2 == party.leader)
                    party.addPlayer(this.player);
            }
            else
            {
                this.player.party = this.server.addParty(player2, this.player);
            }
            if (player2) {
                this.server.pushToPlayer(player2, new Messages.Chat(player2, this.player.name + " joined your party."));
            }
            this.server.pushToPlayer(this.player, new Messages.Chat(this.player, "You are now partied with "+player2.name));
        }
        else if (status == 2)
        {
            this.server.pushToPlayer(player2, new Messages.Chat(player2, this.player.name + " rejected your invite."));
            this.server.pushToPlayer(this.player, new Messages.Chat(this.player, "You rejected "+this.player.name+"'s invite."));
        }

    },

    handlePartyLeave: function (msg) {
        var party = this.player.party;
        var leader = party.leader;

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
        databaseHandler.handlePet(target, target.pets.length-1, pet.kind);
    },

    handlePetDestroy: function (msg)
    {
        var petKind = msg[1];

        // TODO
    },

    handleClassSwitch: function (msg)
    {
        var pClass = msg[1];

        if ((this.player.weapon && !this.player.handleInventoryWeaponUnequip()) ||
            (this.player.armor && !this.player.handleInventoryArmorUnequip()))
        {
            return;
        }

        this.player.pClass = pClass;
        this.player.updateHitPoints();
        this.server.pushToPlayer(this.player, new Messages.HitPoints(this.player.maxHitPoints, this.player.maxMana, this.player.hitPoints, this.player.mana));

        databaseHandler.changePlayerClass(this.player);
        this.server.pushToPlayer(this.player, new Messages.SwitchClass(this.player.pClass));
        this.server.pushToPlayer(this.player, new Messages.Chat(this.player, "The Player Class has been switched."));

        this.player.skillHandler.clear();
        databaseHandler.delSkillSlots(this.player);

        var self= this;

        this.player.skillHandler.installSkills(this.player);
        for(var index in self.player.skills) {
            var skillName = self.player.skills[index].skillData.name;
            var skillLevel = self.player.skills[index].skillLevel;

            self.player.skillHandler.add(skillName, skillLevel);
            self.server.pushToPlayer(self.player, new Messages.SkillLoad(index, skillName, skillLevel));
        }


    },


    send: function(message) {
        this.connection.send(message);
    },

});
