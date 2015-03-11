
/* global require, log, databaseHandler */

var cls = require("./lib/class"),
    _ = require("underscore"),
    Character = require('./character'),
    Chest = require('./chest'),
    Messages = require("./message"),
    Utils = require("./utils"),
    Properties = require("./properties"),
    Formulas = require("./formulas"),
    Inventory = require("./inventory"),
    check = require("./format").check,
    Types = require("../../shared/js/gametypes");
    bcrypt = require('bcrypt');
    Mob = require('./mob');
    

module.exports = Player = Character.extend({
    init: function(connection, worldServer, databaseHandler) {
        var self = this;
        
        this.server = worldServer;
        this.connection = connection;

        this._super(this.connection.id, "player", Types.Entities.WARRIOR, 0, 0, "");

        this.hasEnteredGame = false;
        this.isDead = false;
        this.haters = {};
        this.lastCheckpoint = null;
        this.formatChecker = new FormatChecker();
        this.disconnectTimeout = null;

        this.pvpFlag = false;
        this.bannedTime = 0;
        this.banUseTime = 0;
        this.experience = 0;
        this.level = 0;
        this.lastWorldChatMinutes = 99;
        this.inventory = null;
        this.achievement = [];

        this.chatBanEndTime = 0;

        this.connection.listen(function(message) {
            var action = parseInt(message[0]);

            log.debug("Received: "+message);
            if(!check(message)) {
                self.connection.close("Invalid "+Types.getMessageTypeAsString(action)+" message format: "+message);
                return;
            }

            if(!self.hasEnteredGame && action !== Types.Messages.CREATE && action !== Types.Messages.LOGIN) { // CREATE or LOGIN must be the first message
                self.connection.close("Invalid handshake message: "+message);
                return;
            }
            if(self.hasEnteredGame && !self.isDead && (action === Types.Messages.CREATE || action === Types.Messages.LOGIN)) { // CREATE/LOGIN can be sent only once
                self.connection.close("Cannot initiate handshake twice: "+message);
                return;
            }

            self.resetTimeout();

            if(action === Types.Messages.CREATE || action === Types.Messages.LOGIN) {
                var name = Utils.sanitize(message[1]);
                var pw = Utils.sanitize(message[2]);
                
                
                /**
                 * Implement RSA Authorization
                 */
                
                log.info("Starting Client/Server Handshake");
                
                // Always ensure that the name is not longer than a maximum length.
                // (also enforced by the maxlength attribute of the name input element).
                self.name = name.substr(0, 12).trim();
                    
                    
                // Validate the username
                if(!self.checkName(self.name)){
                    self.connection.sendUTF8("invalidusername");
                    self.connection.close("Invalid name " + self.name);
                    return;
                }
                self.pw = pw.substr(0, 15);
                
                if(action === Types.Messages.CREATE) {
                    bcrypt.genSalt(10, function(err, salt) {
                        bcrypt.hash(self.pw, salt, function(err, hash) {
                            log.info("CREATE: " + self.name);
                            self.email = Utils.sanitize(message[3]);
                            self.pw = hash;
                            //databaseHandler.checkBan(self);
                            databaseHandler.createPlayer(self);
                            
                        });
                    });
                } else {
                    log.info("LOGIN: " + self.name);
                    if(self.server.loggedInPlayer(self.name)) {
                        self.connection.sendUTF8("loggedin");
                        self.connection.close("Already logged in " + self.name);
                        return;
                    }
                   //databaseHandler.checkBan(self);
                   //^We now check ban upon login.
                   databaseHandler.loadPlayer(self);
                }
                
            }
            else if(action === Types.Messages.WHO) {
                log.info("WHO: " + self.name);
                message.shift();
                self.server.pushSpawnsToPlayer(self, message);
            }
            else if(action === Types.Messages.ZONE) {
                log.info("ZONE: " + self.name);
                self.zone_callback();
            }
            else if(action === Types.Messages.CHAT) {
                var msg = Utils.sanitize(message[1]);
                log.info("CHAT: " + self.name + ": " + msg);

                // Sanitized messages may become empty. No need to broadcast empty chat messages.
                if(msg && msg !== "") {
                    msg = msg.substr(0, 60); // Enforce maxlength of chat input
                    var key = msg.substr(0);
                    if ( typeof String.prototype.startsWith !== 'function' ) {
                                String.prototype.startsWith = function( str ) {
                                    return str.length > 0 && this.substring( 0, str.length ) === str;
                        };
                    };

                    if ( typeof String.prototype.endsWith !== 'function' ) {
                        String.prototype.endsWith = function( str ) {
                            return str.length > 0 && this.substring( this.length - str.length, this.length ) === str;
                        };
                    };
                    var targetPalyer = self.server.getPlayerByName(msg.split(' ')[1]);  
                    // Chat command handling
                    
                    if(msg.startsWith("/1 ")) {
                        
                        
                          if((new Date()).getTime() > self.chatBanEndTime) {
                              self.server.pushBroadcast(new Messages.Chat(self, msg));
                          } else {
                              self.send([Types.Messages.NOTIFY, "You have been muted.."]);
                            
                          
                      }
                          
                    } else if (msg.startsWith("/kick ")) {
                        var targetPlayer = self.server.getPlayerByName(msg.split(' ')[1]);
                        if (targetPlayer) {
                            databaseHandler.kickPlayer(self, targetPlayer);
                        }
                        
                    } else if(msg.startsWith("/ban ")) {
                        
                        var banPlayer = self.server.getPlayerByName(msg.split(' ')[2]);
                        var days = (msg.split(' ')[1])*1;
                        if(banPlayer) {
                            
                            databaseHandler.banPlayer(self, banPlayer, days);
                        }
                    } else if(msg.startsWith("/banbyname ")) {
                        var banPlayer = self.server.getPlayerByName(msg.split(' ')[1]);
                        if(banPlayer){
                            databaseHandler.newBanPlayer(self, banPlayer);
                        }
                    } else if(msg.startsWith("/move ")) {
                        var playerName = self.server.getPlayerByName(msg.split(' ')[1]);
                        var x = (msg.split(' ')[2]) * 1;
                        var y = (msg.split(' ')[3]) * 1;
                        
                        if (playerName) {
                            databaseHandler.teleportPlayer(self ,playerName, x, y);
                            
                            
                        }
                        
                    } else if(msg.startsWith("/unmute ")) {
                        if (targetPalyer) {
                            
                            databaseHandler.unmute(self, targetPalyer);
                        }
                    }
                    
                    else if(msg.startsWith("/mute ")) {
                        var mutePlayer1 = self.server.getPlayerByName(msg.split(' ')[1]);
                        var mutePlayer2 = self.server.getPlayerByName(msg.split(' ')[2]);
                        if(mutePlayer1) {
                            
                            databaseHandler.chatBan(self, mutePlayer1);
                        } else if (mutePlayer1 && mutePlayer2) {
                            
                            databaseHandler.chatBan(self, mutePlayer1 + mutePlayer2);
                        }
                    } else if(msg.startsWith("/pmute ")) {
                        if (targetPalyer) 
                            databaseHandler.permanentlyMute(self, targetPalyer);
                        
                        
                    } else if(msg.startsWith("/promote ")) {
                        var targetPlayer = self.server.getPlayerByName(msg.split(' ')[1]);
                        var rank = (msg.split(' ')[2]) * 1;
                        if (targetPlayer && rank) {
                              databaseHandler.promotePlayer(self, targetPalyer, rank);
                        }
                    } else if (msg.startsWith("/demote ")) {
                        var targetPlayer = self.server.getPlayerByName(msg.split(' ')[1]);
                        if (targetPlayer) {
                            databaseHandler.demotePlayer(self, targetPlayer);
                        }
                        
                    } else {
                      self.broadcastToZone(new Messages.Chat(self, msg), false);              
                    }
                    
                }
            }
            else if(action === Types.Messages.MOVE) {
                log.info("MOVE: " + self.name + "(" + message[1] + ", " + message[2] + ")");
                if(self.move_callback) {
                    var x = message[1],
                        y = message[2];

                    if(self.server.isValidPosition(x, y)) {
                        self.setPosition(x, y);
                        self.clearTarget();

                        self.broadcast(new Messages.Move(self));
                        self.move_callback(self.x, self.y);
                    }
                }
            }
            else if(action === Types.Messages.LOOTMOVE) {
                log.info("LOOTMOVE: " + self.name + "(" + message[1] + ", " + message[2] + ")");
                if(self.lootmove_callback) {
                    self.setPosition(message[1], message[2]);

                    var item = self.server.getEntityById(message[3]);
                    if(item) {
                        self.clearTarget();

                        self.broadcast(new Messages.LootMove(self, item));
                        self.lootmove_callback(self.x, self.y);
                    }
                }
            }
            else if(action === Types.Messages.AGGRO) {
                log.info("AGGRO: " + self.name + " " + message[1]);
                if(self.move_callback) {
                    self.server.handleMobHate(message[1], self.id, 5);
                }
            }
            else if(action === Types.Messages.ATTACK) {
                log.info("ATTACK: " + self.name + " " + message[1]);
                var mob = self.server.getEntityById(message[1]);

                if(mob) {
                    self.setTarget(mob);
                    self.server.broadcastAttacker(self);
                }
            }
            else if(action === Types.Messages.HIT) {
                log.info("HIT: " + self.name + " " + message[1]);
                var mob = self.server.getEntityById(message[1]);
                if(mob && self.id) {
                    var dmg = Formulas.dmg(self, mob);
                    
                    if(dmg > 0) {
                        if(mob.type !== "player"){
                            mob.receiveDamage(dmg, self.id);
                            if (mob.hitPoints <= 0) {
                                switch (mob.kind) {
                                    case Types.Entities.RAT:
                                        if(self.achievement[2].found && self.achievement[2].progress !== 999){
                                            if(isNaN(self.achievement[2].progress)){
                                                self.achievement[2].progress = 0;
                                            } else{
                                                self.achievement[2].progress++;
                                            }
                                            if(self.achievement[2].progress >= 10){
                                                self.send([Types.Messages.ACHIEVEMENT, 2, "complete"]);
                                                self.achievement[2].progress = 999;
                                                self.incExp(50);
                                            }
                                            databaseHandler.progressAchievement(self.name, 2, self.achievement[2].progress);
                                        }
                                    break;
                                 
                                    case Types.Entities.CRAB:
                                        if(self.achievement[4].found && self.achievement[4].progress !== 999){
                                            if(isNaN(self.achievement[4].progress)){
                                                self.achievement[4].progress = 0;
                                            } else{
                                                self.achievement[4].progress++;
                                            }
                                            if(self.achievement[4].progress >= 5){
                                                self.send([Types.Messages.ACHIEVEMENT, 4, "complete"]);
                                                self.achievement[4].progress = 999;
                                                self.incExp(50);
                                            }
                                            databaseHandler.progressAchievement(self.name, 4, self.achievement[4].progress);
                                        }    
  
                                    break;
                                    
                                    case Types.Entities.SKELETON:
                                        if(self.achievement[7].found && self.achievement[7].progress !== 999){
                                            if(isNaN(self.achievement[7].progress)){
                                                self.achievement[7].progress = 0;
                                            } else{
                                                self.achievement[7].progress++;
                                            }
                                            if(self.achievement[7].progress >= 10){
                                                self.send([Types.Messages.ACHIEVEMENT, 7, "complete"]);
                                                self.achievement[7].progress = 999;
                                                self.incExp(200);
                                            }
                                            databaseHandler.progressAchievement(self.name, 7, self.achievement[7].progress);
                                        }
                                    break;
                                }
                            }
                            
                            self.server.handleMobHate(mob.id, self.id, dmg);
                            self.server.handleHurtEntity(mob, self, dmg);
                        } else {
                            mob.hitPoints -= dmg;
                            self.server.handleHurtEntity(mob);
                            if(mob.hitPoints <= 0){
                                mob.isDead = true;
                                if(mob.firepotionTimeout){
                                    clearTimeout(mob.firepotionTimeout);
                                }
                                self.server.pushBroadcast(new Messages.Chat(self, self.name + " killed " + mob.name));
                            }
                        }
                    }
                }
            }
            else if(action === Types.Messages.HURT) {
                log.info("HURT: " + self.name + " " + message[1]);
                var mob = self.server.getEntityById(message[1]);
                
                
                if(mob && self.hitPoints > 0 && mob instanceof Mob) {
                    self.hitPoints -= Formulas.dmg(mob, self);
                    self.server.handleHurtEntity(self);
                    mob.addTanker(self.id);
                    
                    if(self.hitPoints <= 0) {
                        self.isDead = true;
                        if(self.level >= 45){ // Don't forget
                            self.incExp(Math.floor(self.level*self.level*(-2)));
/*                            var dice = Utils.randomInt(0, 19);
                            if(dice === 3){
                                self.equipArmor(Types.Entities.CLOTHARMOR);
                                databaseHandler.equipArmor(self.name, Types.getKindAsString(Types.Entities.CLOTHARMOR));
                                self.equipAvatar(Types.Entities.CLOTHARMOR);
                                databaseHandler.equipAvatar(self.name, Types.getKindAsString(Types.Entities.CLOTHARMOR));
                            } */
                        }
                        if(self.firepotionTimeout) {
                            clearTimeout(self.firepotionTimeout);
                        }
                    }
                }
            }
            else if(action === Types.Messages.LOOT) {
                log.info("LOOT: " + self.name + " " + message[1]);
                
                var item = self.server.getEntityById(message[1]);
                
                if(item) {
                var kind = item.kind;
                var itemRank = 0;
                    
                    if(Types.isItem(kind)) {
                        if(kind === Types.Entities.FIREPOTION) {
                            this.resetHPandMana();
                            this.broadcast(this.equip(Types.Entities.FIREBENEF), false);
                            this.broadcast(item.despawn(), false);
                            this.server.removeEntity(item);
                            this.server.pushToPlayer(this, new Messages.HitPoints(this.maxHitPoints, this.maxMana));
                        } else if(Types.isHealingItem(kind)
                            || Types.isWeapon(kind)
                            || Types.isArmor(kind)
                            || Types.isArcherArmor(kind)
                            || Types.isArcherWeapon(kind)
                            || Types.isPendant(kind)
                            || Types.isRing(kind)
                            || Types.isBoots(kind)
                            || kind === Types.Entities.CAKE
                            || kind === Types.Entities.CD
                            || kind === Types.Entities.SNOWPOTION
                            || kind === Types.Entities.BLACKPOTION) {
                                if(this.inventory.putInventory(item.kind, item.count, item.skillKind, item.skillLevel)){
                                    this.logHandler.addItemLog(this, "loot", item);
                                    this.broadcast(item.despawn(), false);
                                    this.server.removeEntity(item);
                                }
                        }
                    }
                }
            }
            else if(action === Types.Messages.TELEPORT) {
                log.info("TELEPORT: " + self.name + "(" + message[1] + ", " + message[2] + ")");
                var x = message[1],
                    y = message[2];

                if(self.server.isValidPosition(x, y)) {
                    self.setPosition(x, y);
                    self.clearTarget();

                    self.broadcast(new Messages.Teleport(self));

                    self.server.handlePlayerVanish(self);
                    self.server.pushRelevantEntityListTo(self);
                }
            }
            else if(action === Types.Messages.OPEN) {
                log.info("OPEN: " + self.name + " " + message[1]);
                var chest = self.server.getEntityById(message[1]);
                if(chest && chest instanceof Chest) {
                    self.server.handleOpenedChest(chest, self);
                }
            }
            else if(action === Types.Messages.CHECK) {
                log.info("CHECK: " + self.name + " " + message[1]);
                var checkpoint = self.server.map.getCheckpoint(message[1]);
                if(checkpoint) {
                    self.lastCheckpoint = checkpoint;
                    databaseHandler.setCheckpoint(self.name, self.x, self.y);
                }
            }
            
            else if(action === Types.Messages.ACHIEVEMENT){
                log.info("ACHIEVEMENT: " + self.name + " " + message[1] + " " + message[2]);
                if(message[2] === "found"){
                    self.achievement[message[1]].found = true;
                    databaseHandler.foundAchievement(self.name, message[1]);
                }
            } else if(action === Types.Messages.TALKTONPC){
                log.info("TALKTONPC: " + self.name + " " + message[1]);
                //Handling things using Switch Statement.
                
                switch(message[1]) {
                    case Types.Entities.VILLAGER:
                        if((self.armor !== Types.Entities.CLOTHARMOR)
                    && self.achievement[3].found === true
                    && self.achievement[3].progress !== 999){
                        //self.equipItem(Types.Entities.CLOTHARMOR);
                        self.send([Types.Messages.ACHIEVEMENT, 3, "complete"]);
                        self.achievement[3].progress = 999;
                        self.incExp(50);
                        databaseHandler.progressAchievement(self.name, 3, self.achievement[3].progress);
                    }
                    break;
                    
                    
                        
                        
                    case Types.Entities.DESERTNPC:
                        if(self.weapon !== Types.Entities.SWORD1 && self.weapon !== Types.Entities.SWORD2
                    && self.achievement[8].found === true
                    && self.achievement[8].progress !== 999){
                        //self.equipItem(Types.Entities.SWORD2);
                        //Let's just not unequip it k?
                        self.send([Types.Messages.ACHIEVEMENT, 8, "complete"]);
                        self.achievement[8].progress = 999;
                        self.incExp(200);
                        databaseHandler.progressAchievement(self.name, 8, self.achievement[8].progress);
                    }
                    
                        break;
                }
                
            }
            
            else if(action === Types.Messages.MAGIC){
              log.info("MAGIC: " + self.name + " " + message[1] + " " + message[2]);
              var magicName = message[1];
              var magicTargetName = message[2];

              if(magicName === "setheal"){
                self.magicTarget = self.server.getPlayerByName(magicTargetName);
                if(self.magicTarget === self){
                  self.magicTarget = null;
                }
              } else if(magicName === "heal"){
                if(self.magicTarget){
                  if(!self.magicTarget.hasFullHealth()) {
                      self.magicTarget.regenHealthBy(50);
                      self.server.pushToPlayer(self.magicTarget, self.magicTarget.health());
                  }
                }
              }
          }
           else if(action === Types.Messages.BOARD){
                log.info("BOARD: " + self.name + " " + message[1] + " " + message[2]);
                var command = message[1];
                var number = message[2];
                var replyNumber = message[3];
                databaseHandler.loadBoard(self, command, number, replyNumber);
            } else if(action === Types.Messages.BOARDWRITE){
                log.info("BOARDWRITE: " + self.name + " " + message[1] + " " + message[2] + " " + message[3]);
                var command = message[1];
            if(command === "board"){
                var title = message[2];
                var content = message[3];
                databaseHandler.writeBoard(self, title, content);
            } else if(command === "reply"){
                var reply = message[2];
                var number = message[3]*1;
                    if(number > 0){
                        databaseHandler.writeReply(self, reply, number);
                    }
                }
            } else if(action === Types.Messages.KUNG){
                log.info("KUNG: " + self.name + " " + message[1]);
                var word = message[1];
                databaseHandler.pushKungWord(self, word);
            } else if(action === Types.Messages.SELL){
                log.info("SELL: " + self.name + " " + message[1] + " " + message[2]);
                self.handleSell(message);
            } else if(action === Types.Messages.SHOP){
                log.info("SHOP: " + self.name + " " + message[1] + " " + message[2]);
                self.handleShop(message);
            } else if(action === Types.Messages.BUY){
                log.info("BUY: " + self.name + " " + message[1] + " " + message[2] + " " + message[3]);
                self.handleBuy(message); 
            } else if(action === Types.Messages.STORESELL) {
                log.info("STORESELL: " + self.name + " " + message[1]);
                self.handleStoreSell(message);
            } else if(action === Types.Messages.STOREBUY) {
                log.info("STOREBUY: " + self.name + " " + message[1] + " " + message[2] + " " + message[3]);
                self.handleStoreBuy(message); 
            } else if(action === Types.Messages.INVENTORY){
                log.info("INVENTORY: " + self.name + " " + message[1] + " " + message[2] + " " + message[3]);
                self.handleInventory(message);
            } else {
                if(self.message_callback) {
                    self.message_callback(message);
                }
            }
        });

        this.connection.onClose(function() {
            if(self.firepotionTimeout) {
                clearTimeout(self.firepotionTimeout);
            }
            clearTimeout(self.disconnectTimeout);
            if(self.exit_callback) {
                self.exit_callback();
            }
        });

        this.connection.sendUTF8("go"); // Notify client that the HELLO/WELCOME handshake can start
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
            state.push(this.target);
        }

        return basestate.concat(state);
    },

    send: function(message) {
        this.connection.send(message);
    },

    flagPVP: function(pvpFlag){
        if(this.pvpFlag !== pvpFlag){
            this.pvpFlag = pvpFlag;
            if (this.pvpFlag) {
                log.info('PVP Enabled - ServerSide');
            } else {
                log.info('PVP Disabled - ServerSide');
            }
            
            this.send(new Messages.PVP(this.pvpFlag).serialize());
        }
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

    equipArmor: function(kind) {
        this.armor = kind;
        this.armorLevel = Properties.getArmorLevel(kind);
    },

    equipAvatar: function(kind) {
        if(kind) {
            this.avatar = kind;
        } else {
            this.avatar = Types.Entities.CLOTHARMOR;
        }
     },


    equipWeapon: function(kind) {
        this.weapon = kind;
        this.weaponLevel = Properties.getWeaponLevel(kind);
    },

    equipItem: function(itemKind, isAvatar) {
        if(itemKind) {
            log.debug(this.name + " equips " + Types.getKindAsString(itemKind));

            if(Types.isArmor(itemKind)) {
                if(isAvatar) {
                    databaseHandler.equipAvatar(this.name, Types.getKindAsString(itemKind));
                    this.equipAvatar(itemKind);
                } else {
                    databaseHandler.equipAvatar(this.name, Types.getKindAsString(itemKind));
                    this.equipAvatar(itemKind);

                    databaseHandler.equipArmor(this.name, Types.getKindAsString(itemKind));
                    this.equipArmor(itemKind);
                }
                //this.updateHitPoints();
                //this.send(new Messages.HitPoints(this.maxHitPoints).serialize());
            } else if(Types.isWeapon(itemKind)) {
                databaseHandler.equipWeapon(this.name, Types.getKindAsString(itemKind));
                this.equipWeapon(itemKind);
            }
        }
    },


    handleStoreSell: function(message) {
        var inventoryNumber1 = message[1],
            itemKind = null,
            price = 0,
            inventoryNumber2 = -1;

        if((inventoryNumber1 >= 0) && (inventoryNumber1 < this.inventory.number)) {
            itemKind = this.inventory.rooms[inventoryNumber1].itemKind;
            if(itemKind) {
                price = Types.Store.getSellPrice(Types.getKindAsString(itemKind));
                if(price > 0) {
                    inventoryNumber2 = this.inventory.getInventoryNumber(Types.Entities.BURGER);
                        if(inventoryNumber2 < 0) {
                            inventoryNumber2 = this.inventory.getEmptyInventoryNumber();
                        }
                        if(inventoryNumber2 < 0) {
                            this.server.pushToPlayer(this, new Messages.Notify("Unknown message."));
                            return;
                        }
                    this.inventory.makeEmptyInventory(inventoryNumber1);
                    this.inventory.putInventory(Types.Entities.BURGER, price, 0, 0);
                }
            }
        }
    },
    handleStoreBuy: function(message) {
        var itemType = message[1],
            itemKind = message[2],
            itemCount = message[3],
            itemName = null,
            price = 0,
            burgerCount = 0,
            inventoryNumber = -1,
            buyCount = 0;

        if(itemCount <= 0) {
            
            return;
        }
        if(itemKind) {
            
            itemName = Types.getKindAsString(itemKind);
        }
        if(itemName) {
            
            price = Types.Store.getBuyPrice(itemName);
            if(price > 0) {
                if(Types.Store.isBuyMultiple(itemName)) {
                    
                    price = price * itemCount;
                } else {
                    
                    itemCount = 1;
                }
                burgerCount = this.inventory.getItemNumber(Types.Entities.BURGER);
                if(burgerCount < price) {
                    
                    this.server.pushToPlayer(this, new Messages.Notify("You do not have enough money."));
                    return;
                }

                if(this.inventory.hasEmptyInventory()) {
                    
                    this.inventory.putInventory(itemKind, Types.Store.getBuyCount(itemName) * itemCount, 0, 0);
                    this.inventory.putInventory(Types.Entities.BURGER, -1 * price, 0, 0);
                } else {
                    
                    this.server.pushToPlayer(this, new Messages.Notify("Inventory full?"));
                }
            }
        }
    },

    handleSell: function(message){ // 41
        var inventoryNumber = message[1];
        var burgerCount = message[2];

        if(Types.isArmor(this.inventory.rooms[inventoryNumber].itemKind) && burgerCount > 0){
            databaseHandler.sell(this, inventoryNumber, burgerCount);
        }
    },
    handleShop: function(message){ // 42
        var command = message[1];
        var number = message[2];

        if(command === 'get'){
            databaseHandler.getShop(this, number);
        }
    },
    handleBuy: function(message){ // 43
        var id = message[1];
        var itemKind = message[2];
        var burgerCount = message[3];

        databaseHandler.buy(this, id, itemKind, burgerCount);
    },
    
    handleInventory: function(message){ // 28
        var inventoryNumber = message[2],
            count = message[3];
        var self = this;

        if(inventoryNumber > this.inventory.number){
          return;
        }

        var itemKind = this.inventory.rooms[inventoryNumber].itemKind;
        if(itemKind){
            if(message[1] === "armor"){
              this.handleInventoryArmor(itemKind, inventoryNumber);
            } else if(message[1] === "weapon"){
              this.handleInventoryWeapon(itemKind, inventoryNumber);
            } else if(message[1] === "pendant") {
              this.handleInventoryPendant(itemKind, inventoryNumber);
            } else if(message[1] === "ring") {
              this.handleInventoryRing(itemKind, inventoryNumber);
            } else if(message[1] === "boots") {
              this.handleInventoryBoots(itemKind, inventoryNumber);
            } else if(message[1] === "empty"){
              this.handleInventoryEmpty(itemKind, inventoryNumber, count);
            } else if(message[1] === "eat"){
              this.handleInventoryEat(itemKind, inventoryNumber);
            } else if(message[1] === "enchantweapon"){
              this.handleInventoryEnchantWeapon(itemKind, inventoryNumber);
            } else if(message[1] === "enchantbloodsucking"){
              this.handleInventoryEnchantBloodsucking(itemKind, inventoryNumber);
            } else if(message[1] === "enchantring"){
              this.handleInventoryEnchantRing(itemKind, inventoryNumber);
            } else if(message[1] === "enchantpendant"){
              this.handleInventoryEnchantPendant(itemKind, inventoryNumber);
            }
        }
    },
    
    
    
    
    handleInventoryAvatar: function(inventoryNumber) {
        var itemKind = this.inventory.rooms[inventoryNumber].itemKind;
        var itemEnchantedPoint = this.inventory.rooms[inventoryNumber].itemNumber;
        var itemSkillKind = this.inventory.rooms[inventoryNumber].itemSkillKind;
        var itemSkillLevel = this.inventory.rooms[inventoryNumber].itemSkillKind;

        if(!this.canEquipArmor(itemKind)){
            
            return;
        }
        if(this.avatar) {
            
            this.inventory.setInventory(inventoryNumber, this.avatar, this.avatarEnchantedPoint, this.avatarSkillKind, this.avatarSkillLevel);
        } else {
            
            this.inventory.makeEmptyInventory(inventoryNumber);
        }
        this.equipItem(itemKind, itemEnchantedPoint, itemSkillKind, itemSkillLevel, true);
        this.broadcast(this.equip(itemKind), false);
    },
    handleInventoryWeaponAvatar: function(inventoryNumber) {
        var itemKind = this.inventory.rooms[inventoryNumber].itemKind;
        var itemEnchantedPoint = this.inventory.rooms[inventoryNumber].itemNumber;
        var itemSkillKind = this.inventory.rooms[inventoryNumber].itemSkillKind;
        var itemSkillLevel = this.inventory.rooms[inventoryNumber].itemSkillLevel;

        if(!this.canEquipWeapon(itemKind)){
            
            return;
        }
        if(this.weaponAvatar){
            
            this.inventory.setInventory(inventoryNumber, this.weaponAvatar, this.weaponAvatarEnchantedPoint, this.weaponAvatarSkillKind, this.weaponAvatarSkillLevel);
        } else{
            
            this.inventory.makeEmptyInventory(inventoryNumber);
        }
        this.equipItem(itemKind, itemEnchantedPoint, itemSkillKind, itemSkillLevel, true);
        this.broadcast(this.equip(itemKind), false);
    },

    handleInventoryArmor: function(itemKind, inventoryNumber){
        if(!this.canEquipArmor(itemKind)){
            
            return;
        }
        this.inventory.setInventory(inventoryNumber, this.armor, 0, 0, 0);
        this.equipItem(itemKind, 0, 0, 0, false);
        if(!this.avatar){
            
            this.broadcast(this.equip(itemKind), false);
        }
    },
    handleInventoryWeapon: function(itemKind, inventoryNumber){
        if(this.kind === Types.Entities.ARCHER && Types.isWeapon(itemKind)){
            
            this.server.pushToPlayer(this, new Messages.Notify("궁수는 궁수용 무기만 착용할 수 있습니다."));
            return;
        } else if(this.kind === Types.Entities.WARRIOR && Types.isArcherWeapon(itemKind)){
            
            this.server.pushToPlayer(this, new Messages.Notify("검사는 검사용 무기만 착용할 수 있습니다."));
            return;
        }
        var weaponLevel = Types.getWeaponRank(itemKind)+1;
        if(weaponLevel*2 > this.level){
           
            this.server.pushToPlayer(this, new Messages.Notify(""+weaponLevel+"레벨 무기는 " + (weaponLevel*2) + "레벨 이상만 착용할 수 있습니다."));
            return;
        }

        var enchantedPoint = this.inventory.rooms[inventoryNumber].itemNumber;
        var weaponSkillKind = this.inventory.rooms[inventoryNumber].itemSkillKind;
        var weaponSkillLevel = this.inventory.rooms[inventoryNumber].itemSkillLevel;

        this.inventory.setInventory(inventoryNumber, this.weapon, this.weaponEnchantedPoint, this.weaponSkillKind, this.weaponSkillLevel);

        this.equipItem(itemKind, enchantedPoint, weaponSkillKind, weaponSkillLevel, false);
        this.setAbility();
        if(!this.weaponAvatar){
            
            this.broadcast(this.equip(itemKind), false);
        }
    },
    handleInventoryPendant: function(itemKind, inventoryNumber){
        if(!Types.isPendant(itemKind)) {
            
            this.server.pushToPlayer(this, new Messages.Notify("펜던트가 아닙니다.."));
            return;
        }
        var pendantLevel = Properties.getPendantLevel(itemKind);
        if((pendantLevel * 10) > this.level) {
            
            this.server.pushToPlayer(this, new Messages.Notify("" + pendantLevel + "레벨 펜던트는 " + (pendantLevel * 10) + "레벨 이상만 착용할 수 있습니다."));
            return;
        }
        var enchantedPoint = this.inventory.rooms[inventoryNumber].itemNumber;
        var pendantSkillKind = this.inventory.rooms[inventoryNumber].itemSkillKind;
        var pendantSkillLevel = this.inventory.rooms[inventoryNumber].itemSkillLevel;

        if(this.pendant) {
            
            this.inventory.setInventory(inventoryNumber, this.pendant, this.pendantEnchantedPoint, this.pendantSkillKind, this.pendantSkillLevel);
        } else {
            
            this.inventory.makeEmptyInventory(inventoryNumber);
        }
        this.equipItem(itemKind, enchantedPoint, pendantSkillKind, pendantSkillLevel, false);
        this.server.pushToPlayer(this, this.equip(itemKind));
    },
    handleInventoryRing: function(itemKind, inventoryNumber){
        if(!Types.isRing(itemKind)) {
            this.server.pushToPlayer(this, new Messages.Notify("반지가 아닙니다."));
            return;
        }
        var ringLevel = Properties.getRingLevel(itemKind);
        if((ringLevel * 10) > this.level) {
            this.server.pushToPlayer(this, new Messages.Notify("" + ringLevel + "레벨 반지는 " + (ringLevel * 10) + "레벨 이상만 착용할 수 있습니다."));
            return;
        }
        var enchantedPoint = this.inventory.rooms[inventoryNumber].itemNumber;
        var ringSkillKind = this.inventory.rooms[inventoryNumber].itemSkillKind;
        var ringSkillLevel = this.inventory.rooms[inventoryNumber].itemSkillLevel;

        if(this.ring) {
            
            this.inventory.setInventory(inventoryNumber, this.ring, this.ringEnchantedPoint, this.ringSkillKind, this.ringSkillLevel);
        } else {
            
            this.inventory.makeEmptyInventory(inventoryNumber);
        }
        this.equipItem(itemKind, enchantedPoint, ringSkillKind, ringSkillLevel, false);
        this.server.pushToPlayer(this, this.equip(itemKind));
    },
    handleInventoryBoots: function(itemKind, inventoryNumber){
        if(!Types.isBoots(itemKind)) {
            
            this.server.pushToPlayer(this, new Messages.Notify("부츠가 아닙니다.."));
            return;
        }
        var bootsLevel = Properties.getBootsLevel(itemKind);
        if((bootsLevel * 10) > this.level) {
            
            this.server.pushToPlayer(this, new Messages.Notify("" + bootsLevel + "레벨 부츠는 " + (bootsLevel * 10) + "레벨 이상만 착용할 수 있습니다."));
            return;
        }

        var enchantedPoint = this.inventory.rooms[inventoryNumber].itemNumber;
        var bootsSkillKind = this.inventory.rooms[inventoryNumber].itemSkillKind;
        var bootsSkillLevel = this.inventory.rooms[inventoryNumber].itemSkillLevel;

        if(this.boots) {
            
            this.inventory.setInventory(inventoryNumber, this.boots, this.bootsEnchantedPoint, this.bootsSkillKind, this.bootsSkillLevel);
        } else {
            
            this.inventory.makeEmptyInventory(inventoryNumber);
        }
        this.equipItem(itemKind, enchantedPoint, bootsSkillKind, bootsSkillLevel, false);
        this.server.pushToPlayer(this, this.equip(itemKind));
    },

    handleInventoryEmpty: function(itemKind, inventoryNumber, count){
        var item = this.server.addItem(this.server.createItem(itemKind, this.x, this.y));
        if(Types.isHealingItem(item.kind)){
            if(count < 0){

                  count = 0;
            } else if(count > this.inventory.rooms[inventoryNumber].itemNumber){

                  count = this.inventory.rooms[inventoryNumber].itemNumber;
            }
            item.count = count;
        } else if(Types.isWeapon(item.kind) || Types.isArcherWeapon(item.kind) ||
            Types.isPendant(item.kind) || Types.isRing(item.kind) || Types.isBoots(item.kind)) {
            item.count = this.inventory.rooms[inventoryNumber].itemNumber;
            item.skillKind = this.inventory.rooms[inventoryNumber].itemSkillKind;
            item.skillLevel = this.inventory.rooms[inventoryNumber].itemSkillLevel;
        }

        if(item.count >= 0) {
            this.server.pushToAdjacentGroups(this.group, new Messages.Drop(this, item));
            this.server.handleItemDespawn(item);

                if(Types.isHealingItem(item.kind)) {

                    this.inventory.takeOutInventory(inventoryNumber, item.count);
                } else {

                    this.inventory.makeEmptyInventory(inventoryNumber);
                }
            } else {
            this.server.removeEntity(item);
            this.inventory.makeEmptyInventory(inventoryNumber);
            }
            
        this.logHandler.addItemLog(this, "drop", item);
    },
    
    handleInventoryEat: function(itemKind, inventoryNumber){
        var self = this;
        if(itemKind === Types.Entities.ROYALAZALEA){
            this.broadcast(this.equip(Types.Entities.ROYALAZALEABENEF), false);
            if(this.royalAzaleaBenefTimeout){
                clearTimeout(this.royalAzaleaBenefTimeout);
            }
            this.royalAzaleaBenefTimeout = setTimeout(function(){
            self.royalAzaleaBenefTimeout = null;
            }, 15000);
        } else {
            var amount;

            switch(itemKind) {
                case Types.Entities.FLASK: 
                    amount = 80;
                break;
                case Types.Entities.BURGER: 
                    amount = 200;
                break;
            }

        if(!this.hasFullHealth()) {
            this.regenHealthBy(amount);
            this.server.pushToPlayer(this, this.health());
            }
        }
        this.inventory.takeOutInventory(inventoryNumber, 1);
    },
    
    handleInventoryEnchantWeapon: function(itemKind, inventoryNumber) {
        if(itemKind !== Types.Entities.SNOWPOTION) {
            
            this.server.pushToPlayer(this, new Messages.Notify("스노우포션이 아닙니다."));
            return;
        }
        if(this.weaponEnchantedPoint + this.weaponSkillLevel>= 30) {
            
            this.server.pushToPlayer(this, new Messages.Notify("무기의 강화도와 무기 속성 레벨의 합은 30을 넘을 수 없습니다."));
            return;
        }
        this.inventory.makeEmptyInventory(inventoryNumber);
        if(Utils.ratioToBool(0.1)) {
            this.server.pushToPlayer(this, new Messages.Notify("강화에 성공했습니다."));
            if(this.weaponEnchantedPoint){
                this.weaponEnchantedPoint += 1;
            } else { 
                this.weaponEnchantedPoint = 1;
            }
            databaseHandler.enchantWeapon(this.name, this.weaponEnchantedPoint);
        } else {
            this.server.pushToPlayer(this, new Messages.Notify("강화에 실패했습니다."));
        }
    },
    handleInventoryEnchantBloodsucking: function(itemKind, inventoryNumber) {
        if(itemKind !== Types.Entities.BLACKPOTION){
            this.server.pushToPlayer(this, new Messages.Notify("블랙포션이 아닙니다."));
            return;
        }
        if(this.weaponEnchantedPoint + this.weaponSkillLevel >= 30){
            this.server.pushToPlayer(this, new Messages.Notify("무기의 강화도와 흡혈률의 합은 30을 넘을 수 없습니다."));
            return;
        }
        if(this.weaponSkillLevel >= 7){
            this.server.pushToPlayer(this, new Messages.Notify("흡혈률이 7이상일 경우 더이상 흡혈률을 올릴 수 없습니다."));
            return;
        }
        if(this.weaponSkillKind !== Types.Skills.BLOODSUCKING){
            this.server.pushToPlayer(this, new Messages.Notify("무기의 속성이 흡혈인 경우에만 블랙포션을 사용할 수 있습니다."));
            return;
        }

        this.inventory.makeEmptyInventory(inventoryNumber);
        if(Utils.ratioToBool(0.1)){
            this.server.pushToPlayer(this, new Messages.Notify("흡혈률 강화에 성공했습니다."));
            this.weaponSkillKind = Types.Skills.BLOODSUCKING;
            if(this.weaponSkillLevel) {
                this.weaponSkillLevel += 1;
            } else {
                this.weaponSkillLevel = 1;
            }
            databaseHandler.setWeaponSkill(this.name, this.weaponSkillKind, this.weaponSkillLevel);
        } else {
            
            this.server.pushToPlayer(this, new Messages.Notify("흡혈률 강화에 실패했습니다."));
        }
    },
    handleInventoryEnchantRing: function(itemKind, inventoryNumber){
        if(itemKind !== Types.Entities.SNOWPOTION){
            
            this.server.pushToPlayer(this, new Messages.Notify("스노우포션이 아닙니다."));
            return;
        }
        if(this.ringEnchantedPoint >= 9){
            
            this.server.pushToPlayer(this, new Messages.Notify("반지의 강화도는 9을 넘을 수 없습니다."));
            return;
        }
        this.inventory.makeEmptyInventory(inventoryNumber);
        if(Utils.ratioToBool(0.3)){
            this.server.pushToPlayer(this, new Messages.Notify("강화에 성공했습니다."));
            if(this.ringEnchantedPoint){
                this.ringEnchantedPoint += 1;
            } else{
                this.ringEnchantedPoint = 1;
            }
            databaseHandler.enchantRing(this.name, this.ringEnchantedPoint);
        } else if(this.ringEnchantedPoint && Utils.ratioToBool(0.3/0.7)){
            this.server.pushToPlayer(this, new Messages.Notify("반지가 약해졌습니다."));
            if(this.ringEnchantedPoint >= 1){
                this.ringEnchantedPoint -= 1;
            } else{
                this.ringEnchantedPoint = 0;
            }
            databaseHandler.enchantRing(this.name, this.ringEnchantedPoint);
        } else {
            this.server.pushToPlayer(this, new Messages.Notify("강화에 실패했습니다."));
        }
    },
    handleInventoryEnchantPendant: function(itemKind, inventoryNumber){
        if(itemKind !== Types.Entities.SNOWPOTION){
            
            this.server.pushToPlayer(this, new Messages.Notify("스노우포션이 아닙니다."));
            return;
        }
        if(this.pendantEnchantedPoint >= 9){
            
            this.server.pushToPlayer(this, new Messages.Notify("펜던트의 강화도는 9을 넘을 수 없습니다."));
            return;
        }
        this.inventory.makeEmptyInventory(inventoryNumber);
        if(Utils.ratioToBool(0.3)){
            this.server.pushToPlayer(this, new Messages.Notify("강화에 성공했습니다."));
            if(this.pendantEnchantedPoint){
                this.pendantEnchantedPoint += 1;
            } else{
                this.pendantEnchantedPoint = 1;
            }
            databaseHandler.enchantPendant(this.name, this.pendantEnchantedPoint);
        } else if(this.pendantEnchantedPoint && Utils.ratioToBool(0.3/0.7)){
            this.server.pushToPlayer(this, new Messages.Notify("펜던트가 약해졌습니다."));
            if(this.pendantEnchantedPoint >= 1){
                this.pendantEnchantedPoint -= 1;
            } else{
                this.pendantEnchantedPoint = 0;
            }
            databaseHandler.enchantPendant(this.name, this.pendantEnchantedPoint);
        } else {
            this.server.pushToPlayer(this, new Messages.Notify("강화에 실패했습니다."));
        }
    },
  
    

    updateHitPoints: function() {
        this.resetHitPoints(Formulas.hp(this.level));
        this.resetMana(Formulas.mana(this.level));
    },
    //NOTE HERE - HP HERE
    //This needs to be looked over and change everything necessary.
    //
    /* resetHPandMana: function() {
        this.resetHitpoints(Formulas.hp(this.kind ,this.level));
        this.resetMana(Formulas.mana(this.kind, this.level));
    }, */
    //^ ALREADY COVERED BY updateHitPoints
    
    
    updatePosition: function() {
        if(this.requestpos_callback) {
            var pos = this.requestpos_callback();
            this.setPosition(pos.x, pos.y);
        }
    },

    onRequestPosition: function(callback) {
        this.requestpos_callback = callback;
    },

    resetTimeout: function() {
        clearTimeout(this.disconnectTimeout);
        this.disconnectTimeout = setTimeout(this.timeout.bind(this), 1000 * 60 * 5); // 5 min.
    },

    timeout: function() {
        this.connection.sendUTF8("timeout");
        this.connection.close("Player was idle for too long");
    },

    incExp: function(gotexp){
        this.experience = parseInt(this.experience) + (parseInt(gotexp));
        databaseHandler.setExp(this.name, this.experience);
        var origLevel = this.level;
        this.level = Types.getLevel(this.experience);
        if(origLevel !== this.level) {
            //this.resetHPandMana();
            this.updateHitPoints();
            //this.server.pushToPlayer(this, new Messages.HitPoints(this.maxHitPoints, this.maxMana));
            //NOTE 3
            this.send(new Messages.HitPoints(this.maxHitPoints, this.maxMana).serialize());
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
    
    takeOffAvatar: function(){
        this.inventory.putInventory(this.avatar, this.avatarEnchantedPoint, this.avatarSkillKind, this.avatarSkillLevel);
        this.avatar = null;
        this.avatarEnchantedPoint = 0;
        this.avatarSkillKind = 0;
        this.avatarSkillLevel = 0;
        databaseHandler.takeOffAvatar(this.name);
        this.broadcastToZone(new Messages.EquipItem(this, this.armor), false);
    },
    takeOffWeaponAvatar: function(){
        this.inventory.putInventory(this.weaponAvatar, this.weaponAvatarEnchantedPoint, this.weaponAvatarSkillKind, this.weaponAvatarSkillLevel);
        this.weaponAvatar = null;
        this.weaponAvatarEnchantedPoint = 0;
        this.weaponAvatarSkillKind = 0;
        this.weaponAvatarSkillLevel = 0;
        databaseHandler.takeOffWeaponAvatar(this.name);
        this.broadcastToZone(new Messages.EquipItem(this, this.weapon), false);
    },

    sendWelcome: function(armor, weapon, avatar, weaponAvatar, exp, admin,
                          bannedTime, banUseTime,
                           achievementFound, achievementProgress,
                          x, y,
                          chatBanEndTime) {
        var self = this;
        self.kind = Types.Entities.WARRIOR;
        self.admin = admin;
        //self.moderator = moderator;
        self.equipArmor(Types.getKindFromString(armor));
        self.equipAvatar(Types.getKindFromString(avatar));
        self.equipWeapon(Types.getKindFromString(weapon));

        self.achievement[1] = {found: achievementFound[0], progress: achievementProgress[0]};
        self.achievement[2] = {found: achievementFound[1], progress: achievementProgress[1]};
        self.achievement[3] = {found: achievementFound[2], progress: achievementProgress[2]};
        self.achievement[4] = {found: achievementFound[3], progress: achievementProgress[3]};
        self.achievement[5] = {found: achievementFound[4], progress: achievementProgress[4]};
        self.achievement[6] = {found: achievementFound[5], progress: achievementProgress[5]};
        self.achievement[7] = {found: achievementFound[6], progress: achievementProgress[6]};
        self.achievement[8] = {found: achievementFound[7], progress: achievementProgress[7]};
        self.bannedTime = bannedTime;
        self.banUseTime = banUseTime;
        self.experience = exp;
        self.level = Types.getLevel(self.experience);
        self.orientation = Utils.randomOrientation;
        self.updateHitPoints();
        if(x === 0 && y === 0) {
            self.updatePosition();
        } else {
            self.setPosition(x, y);
        }
        self.chatBanEndTime = chatBanEndTime;

        self.server.addPlayer(self);
        self.server.enter_callback(self);
        
            databaseHandler.getAllInventory(this, function(maxInventoryNumber, itemKinds, itemNumbers, itemSkillKinds, itemSkillLevels){
        self.inventory = new Inventory(self, maxInventoryNumber, itemKinds, itemNumbers, itemSkillKinds, itemSkillLevels);
        self.logHandler.addLoginLog(self);
        
        });
        
        
        self.send([
            Types.Messages.WELCOME, 
            self.id, // 1
            self.name, //2
            self.x, //3
            self.y, //4
            self.hitPoints, //5
            armor, //6
            weapon, //7
            avatar, //8
            weaponAvatar, //9
            self.experience, //10
            self.admin, //11

            achievementFound[0], //16
            achievementProgress[0], //17
            achievementFound[1], //18
            achievementProgress[1], //19
            achievementFound[2], //20
            achievementProgress[2], //21
            achievementFound[3], //22
            achievementProgress[3], //23
            achievementFound[4], //24
            achievementProgress[4], //25
            achievementFound[5], //26
            achievementProgress[5], //27
            achievementFound[6], //28
            achievementProgress[6], // 29
            achievementFound[7], //30
            achievementProgress[7], //31
            self.mana //32
        ]);

        self.hasEnteredGame = true;
        self.isDead = false;

        }
                          
                          
                          
});
