
/* global require, module, log, databaseHandler */

var cls = require("./lib/class"),
    _ = require("underscore"),
    Character = require('./character'),
    Chest = require('./chest'),
    Messages = require("./message"),
    Utils = require("./utils"),
    Properties = require("./properties"),
    Formulas = require("./formulas"),
    check = require("./format").check,
    Party = require("./party"),
    Types = require("../../shared/js/gametypes");
    bcrypt = require('bcrypt');
    Inventory = require("./inventory"),
    Mob = require('./mob');
    SkillHandler = require("./skillhandler");
    Variations = require('./variations');
    

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
        this.inventory = null;
        this.pvpFlag = false;
        this.bannedTime = 0;
        this.banUseTime = 0;
        this.membershipTime = 0;
        this.experience = 0;
        this.level = 0;
        this.lastWorldChatMinutes = 99;
        this.achievement = [];
        this.skillHandler = new SkillHandler();
        this.variations = new Variations();
        this.membership = false;

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
                    
                    switch(msg) {
                        case msg.startsWith("/1 "):
                            if((new Date()).getTime() > self.chatBanEndTime) {
                                self.server.pushBroadcast(new Messages.Chat(self, msg));
                            } else {
                                self.send([Types.Messages.NOTIFY, "You are currently muted."]);
                            }
                        break;
                        
                        case msg.startsWith("/kick "):
                            var targetPlayer = self.server.getPlayerByName(msg.split(' ')[1]);
                            if (targetPlayer) {
                                databaseHandler.kickPlayer(self, targetPlayer);
                            }
                        break;
                        
                        case msg.startsWith("/ban "):
                            var banPlayer = self.server.getPlayerByName(msg.split(' '));
                            var days = (msg.split(' ')[2]);
                            if (banPlayer) {
                                
                                databaseHandler.banPlayer(self, banPlayer, days);
                            }
                        break;
                        
                        case msg.startsWith("/banbyname "):
                            var banPlayer = self.server.getPlayerByName(msg.split(' '));
                            if (banPlayer) {
                                databaseHandler.newBanPlayer(self, banPlayer);
                            }
                        break;
                        
                        case msg.startsWith("/tele "):
                            var playerName = self.server.getPlayerByName(msg.split(' ')[1]);
                            var x = msg.split(' ')[2];
                            var y = msg.split(' ')[3];
                            
                            if (playerName) {
                                log.info("Teleported player: " + playerName + " to: X: " + x + " and Y: " + y);
                                databaseHandler.teleportPlayer(self, playerName, x, y);
                            }
                        break;    
                        
                        case msg.startsWith("/mute "):
                            var mutePlayer = self.server.getPlayerByName(msg.split(' '));
                            if (mutePlayer) {
                                
                                databaseHandler.chatBan(self, mutePlayer);
                            }
                        break;
                        
                        case msg.startsWith("/unmute "):
                            var targetPlayer = self.server.getPlayerByName(msg.split(' '));
                            
                            if (targetPlayer) {
                                
                                databaseHandler.unmute(self, targetPlayer);
                            }
                        break;
                        
                        case msg.startsWith("/pmute "):
                            var targetPlayer = self.server.getPlayerByName(msg.split(' '));
                            if (targetPlayer) {
                                
                                databaseHandler.permanentlyMute(self, targetPlayer);
                            }
                        break;
                        
                        case msg.startsWith("/promote "):
                            var targetPlayer = self.server.getPlayerByName(msg.split(' ')[1]);
                            var rank = msg.split(' ')[2];
                            
                            if (targetPlayer) {
                                databaseHandler.promotePlayer(self, targetPlayer, rank);
                            }
                        break;
                        
                        case msg.startsWith("/demote "):
                            var targetPlayer = self.server.getPlayerByName(msg.split(' ')[1]);
                            
                            if (targetPlayer) {
                                databaseHandler.demotePlayer(self, targetPlayer);
                            }
                        break;
                        
                        default:
                        
                            self.broadcastToZone(new Messages.Chat(self, msg), false);
                        break;
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
            
            else if(action === Types.Messages.HIT) {
                log.info("HIT: " + self.name + " " + message[1]);
                var mob = self.server.getEntityById(message[1]);
                if(mob && self.id) {
                    var dmg = Formulas.dmg(self, mob);
                    
                    if(dmg > 0) {
                        if(mob.type !== "player"){
                            mob.receiveDamage(dmg, self.id);
                            if (mob.hitPoints <= 0) {
                                //CLASS
                                self.questAboutKill(mob);
                                
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
                        if(self.level >= 45) { // Don't forget
                            self.incExp(Math.floor(self.level*self.level*(-2)));
                        }
                        if(self.firepotionTimeout) {
                            clearTimeout(self.firepotionTimeout);
                        }
                    }
                }
            } else if(action === Types.Messages.INVENTORY){
                log.info("INVENTORY: " + self.name + " " + message[1] + " " + message[2] + " " + message[3]);
                self.handleInventory(message);
            }  else if(action === Types.Messages.SKILL){
                log.info("SKILL: " + self.name + " " + message[1] + " " + message[2]);
                self.handleSkill(message);
            } else if(action === Types.Messages.SKILLINSTALL) {
                log.info("SKILLINSTALL: " + self.name + " " + message[1] + " " + message[2]);
                self.handleSkillInstall(message);
            } else if(action === Types.Messages.TELEPORT) {
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
            } else if(action === Types.Messages.LOOTMOVE) {
                log.info("LOOTMOVE: " + this.name + "(" + message[1] + ", " + message[2] + ")");
                self.handleLootMove(message);
            } else if(action === Types.Messages.LOOT) {
                log.info("LOOT: " + self.name + " " + message[1]);
                self.handleLoot(message);
            } else if(action === Types.Messages.CHECK) {
                log.info("CHECK: " + self.name + " " + message[1]);
                var checkpoint = self.server.map.getCheckpoint(message[1]);
                if(checkpoint) {
                    self.lastCheckpoint = checkpoint;
                    databaseHandler.setCheckpoint(self.name, self.x, self.y);
                }
            } else if(action === Types.Messages.QUEST) {
                log.info("QUEST: " + self.name + " " + message[1] + " " + message[2]);
                self.handleQuest(message);
            } else if(action === Types.Messages.TALKTONPC){
                log.info("TALKTONPC: " + self.name + " " + message[1]);
                self.handleTalkToNPC(message);
            } else if(action === Types.Messages.MAGIC){
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
          } else if(action === Types.Messages.BOARD){
              log.info("BOARD: " + self.name + " " + message[1] + " " + message[2]);
              var command = message[1];
              var number = message[2];
              var replyNumber = message[3];
              databaseHandler.loadBoard(self, command, number, replyNumber);
            } else if(action === Types.Messages.RANKING){
                log.info("RANKING: " + self.name + " " + message[1]);
                self.handleRanking(message);
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
            }  else {
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
    
    
    
    
    questAboutKill: function(mob){
    var self = this;
    // Daily Quest
        if(this.achievement[101].found){
            if(this.achievement[101].progress < 999){
                this._questAboutKill(mob.kind, 0, 101, 25, function(){
                    log.info("Quest 101 Completed");
                    self.inventory.putInventory(Types.Entities.FLASK, 100, 0, 0);
            });
            return;
            } else if(this.achievement[102].found){
                if(this.achievement[102].progress < 999){
                    this._questAboutKill(mob.kind, 0, 102, 100, function(){
                        log.info("Quest 102 Completed");
                        self.inventory.putInventory(Types.Entities.BURGER, 100, 0, 0);
                    });
                    return;
                } else if(this.achievement[103].found){
                    if(this.achievement[103].progress < 999){
                        this._questAboutKill(mob.kind, 0, 103, 200, function(){
                            log.info("Quest 103 Completed");
                            self.inventory.putInventory(Types.Entities.ROYALAZALEA, 50, 0, 0);
                        });
                    return;
                    } else if(this.achievement[104].found){
                        if(this.achievement[104].progress < 999){
                            this._questAboutKill(mob.kind, 0, 104, 500, function(){
                                log.info("Quest 104 Completed");
                                self.inventory.putInventory(Types.Entities.SNOWPOTION, 1, 0, 0);
                        });
                        return;
                        }
                    }
                }
            }
        }
        this._questAboutKill(mob.kind, Types.Entities.RAT, 2, 10, function(){
             self.incExp(200);
        });
        this._questAboutKill(mob.kind, Types.Entities.CRAB, 4, 5, function(){
            self.incExp(100);
        });
        this._questAboutKill(mob.kind, Types.Entities.SKELETON, 7, 10, function(){
            self.incExp(400);
        });
        this._questAboutKill(mob.kind, Types.Entities.SKELETONKING, 9, 2, function(){
            self.incExp(1000);
        });
        this._questAboutKill(mob.kind, Types.Entities.ORC, 10, 10, function(){ self.setAbility(); });
        this._questAboutKill(mob.kind, Types.Entities.GOLEM, 11, 10, function(){ self.setAbility(); });
        this._questAboutKill(mob.kind, Types.Entities.HOBGOBLIN, 12, 13, function(){ self.setAbility(); });
        this._questAboutKill(mob.kind, Types.Entities.YELLOWMOUSE, 13, 12, function(){ self.setAbility(); });
        this._questAboutKill(mob.kind, Types.Entities.MERMAID, 16, 15, function(){ self.setAbility(); });
        this._questAboutKill(mob.kind, Types.Entities.LIVINGARMOR, 17, 9, function(){ self.setAbility(); });
        this._questAboutKill(mob.kind, Types.Entities.PENGUIN, 18, 12, function(){ self.setAbility(); });
        this._questAboutKill(mob.kind, Types.Entities.DARKSKELETON, 19, 20, function(){ self.setAbility(); });
        this._questAboutKill(mob.kind, Types.Entities.MINIKNIGHT, 20, 30, function(){ self.setAbility(); });
        this._questAboutKill(mob.kind, Types.Entities.WOLF, 22, 50, function(){ self.setAbility(); });
        this._questAboutKill(mob.kind, Types.Entities.SNOWWOLF, 28, 60, function(){ self.setAbility(); });
        this._questAboutKill(mob.kind, Types.Entities.SNOWLADY, 29, 70, function(){ self.setAbility(); });
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

    equipArmor: function(kind, enchantedPoint, skillKind, skillLevel) {
        this.armor = kind;
        if(enchantedPoint){
            this.armorEnchantedPoint = enchantedPoint;
        } else{
            this.armorEnchantedPoint = 0;
        }
        this.armorLevel = Properties.getArmorLevel(kind) + this.armorEnchantedPoint;
        this.armorSkillKind = skillKind;
        this.armorSkillLevel = skillLevel;
    },
    equipAvatar: function(kind, enchantedPoint, skillKind, skillLevel) {
        if(kind){
            
            this.avatar = kind;
        } else{
            
            this.avatar = null;
        }
        if(enchantedPoint){
            
            this.avatarEnchantedPoint = enchantedPoint;
        } else{
            
            this.avatarEnchantedPoint = 0;
        }
        this.avatarSkillKind = skillKind;
        this.avatarSkillLevel = skillLevel;
    },
    equipWeapon: function(kind, enchantedPoint, skillKind, skillLevel){
        this.weapon = kind;
        if(enchantedPoint){
            
            this.weaponEnchantedPoint = enchantedPoint;
            
        } else{
            
            this.weaponEnchantedPoint = 0;
        }
        this.weaponLevel = Properties.getWeaponLevel(kind) + this.weaponEnchantedPoint;
        this.weaponSkillKind = skillKind;
        this.weaponSkillLevel = skillLevel;
    },
    equipWeaponAvatar: function(kind, enchantedPoint, skillKind, skillLevel){
        if(kind){
            this.weaponAvatar = kind;
            if(enchantedPoint){
                
                this.weaponAvatarEnchantedPoint = enchantedPoint;
            } else{
                
                this.weaponAvatarEnchantedPoint = 0;
            }
            this.weaponAvatarSkillKind = skillKind;
            this.weaponAvatarSkillLevel = skillLevel;
        } else{
            this.weaponAvatar = null;
            this.weaponAvatarEnchantedPoint = 0;
            this.weaponAvatarSkillKind = 0;
            this.weaponAvatarSkillLevel = 0;
        }
    },
    equipPendant: function(kind, enchantedPoint, skillKind, skillLevel) {
        if(kind) {
            this.pendant = kind;
            if(enchantedPoint){
                
                this.pendantEnchantedPoint = enchantedPoint;
            } else{
                
                this.pendantEnchantedPoint = 0;
            }
            this.pendantLevel = Properties.getPendantLevel(kind);
            this.pendantSkillKind = skillKind;
            this.pendantSkillLevel = skillLevel;
        } else {
            this.pendant = null;
            this.pendantEnchantedPoint = 0;
            this.pendantLevel = 0;
            this.pendantSkillKind = 0;
            this.pendantSkillLevel = 0;
        }
    },
    equipRing: function(kind, enchantedPoint, skillKind, skillLevel) {
        if(kind) {
            this.ring = kind;
            if(enchantedPoint){
                
                this.ringEnchantedPoint = enchantedPoint;
            } else{
                
                this.ringEnchantedPoint = 0;
            }
            this.ringLevel = Properties.getRingLevel(kind);
            this.ringSkillKind = skillKind;
            this.ringSkillLevel = skillLevel;
        } else {
            this.ring = null;
            this.ringEnchantedPoint = 0;
            this.ringLevel = 0;
            this.ringSkillKind = 0;
            this.ringSkillLevel = 0;
        }
    },
    equipBoots: function(kind, enchantedPoint, skillKind, skillLevel) {
        if(kind) {
            this.boots = kind;
            if(enchantedPoint){
                
                this.bootsEnchantedPoint = enchantedPoint;
            } else{
                
                this.bootsEnchantedPoint = 0;
            }
            this.bootsLevel = Properties.getBootsLevel(kind);
            this.bootsSkillKind = skillKind;
            this.bootsSkillLevel = skillLevel;
        } else {
            this.boots = null;
            this.bootsEnchantedPoint = 0;
            this.bootsLevel = 0;
            this.bootsSkillKind = 0;
            this.bootsSkillLevel = 0;
        }
    },
    equipItem: function(itemKind, enchantedPoint, skillKind, skillLevel, isAvatar) {
        if(itemKind) {
            log.debug(this.name + " equips " + Types.getKindAsString(itemKind));

            if(Types.isArmor(itemKind) || Types.isArcherArmor(itemKind)) {
                if(isAvatar){
                    databaseHandler.equipAvatar(this.name, Types.getKindAsString(itemKind), enchantedPoint, skillKind, skillLevel);
                    this.equipAvatar(itemKind, enchantedPoint, skillKind, skillLevel);
                } else{
                    databaseHandler.equipArmor(this.name, Types.getKindAsString(itemKind), enchantedPoint, skillKind, skillLevel);
                    this.equipArmor(itemKind, enchantedPoint, skillKind, skillLevel);
                }
            } else if(Types.isWeapon(itemKind) || Types.isArcherWeapon(itemKind)) {
                if(isAvatar){
                    databaseHandler.equipWeaponAvatar(this.name, Types.getKindAsString(itemKind), enchantedPoint ? enchantedPoint : 0, skillKind, skillLevel);
                    this.equipWeaponAvatar(itemKind, enchantedPoint, skillKind, skillLevel);
                } else{
                    databaseHandler.equipWeapon(this.name, Types.getKindAsString(itemKind), enchantedPoint ? enchantedPoint : 0, skillKind, skillLevel);
                    this.equipWeapon(itemKind, enchantedPoint, skillKind, skillLevel);
                }
            } else if(Types.isPendant(itemKind)) {
                databaseHandler.equipPendant(this.name, Types.getKindAsString(itemKind), enchantedPoint, skillKind, skillLevel);
                this.equipPendant(itemKind, enchantedPoint, skillKind, skillLevel);
            } else if(Types.isRing(itemKind)) {
                databaseHandler.equipRing(this.name, Types.getKindAsString(itemKind), enchantedPoint, skillKind, skillLevel);
                this.equipRing(itemKind, enchantedPoint, skillKind, skillLevel);
            } else if(Types.isBoots(itemKind)) {
                databaseHandler.equipBoots(this.name, Types.getKindAsString(itemKind), enchantedPoint, skillKind, skillLevel);
                this.equipBoots(itemKind, enchantedPoint, skillKind, skillLevel);
            }
        }
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
    handleRanking: function(message){ // 40
        var type = message[1];

        if(type === 'get'){
            databaseHandler.getRanking(this);
        }
    },
    handleQuest: function(message){ // 29
        if(message[2] === "found") {
            var questId = message[1];
            if(!this.achievement[questId].found){
                this.foundQuest(questId);
            }
        } else if(message[2] === "show") { 
            var self = this;
            databaseHandler.loadQuest(this, function(){
                var i=0;
                var msg = [Types.Messages.QUEST, "show"];
                for(i=0; i<Types.Quest.TOTAL_QUEST_NUMBER; i++){
                    msg.push(self.achievement[i+1].found);
                    msg.push(self.achievement[i+1].progress);
                }
                for(i=0; i<4; i++){
                    msg.push(self.achievement[i+101].found);
                    msg.push(self.achievement[i+101].progress);
                }
            self.send(msg);
            });
        }
    },
    handleTalkToNPC: function(message){ // 30
        var self = this;
        var npcKind = message[1];

        if(npcKind === Types.Entities.CODER){
            this.getDailyQuest();
        } else if(npcKind === Types.Entities.VILLAGER){
            this.questAboutItem(npcKind, 3, Types.Entities.LEATHERARMOR, function(){ self.incExp(50); });
        } else if(npcKind === Types.Entities.AGENT){
            this.questAboutItem(npcKind, 5, Types.Entities.CAKE, function(){ self.incExp(50); });
        } else if(npcKind === Types.Entities.NYAN){
            this.questAboutItem(npcKind, 6, Types.Entities.CD, function(){ self.incExp(100); });
        } else if(npcKind === Types.Entities.DESERTNPC){
            this.questAboutItem(npcKind, 8, Types.Entities.AXE, function(){ self.incExp(200); });
        } else if(npcKind === Types.Entities.ODDEYECAT){
            this.questAboutItem(npcKind, 14, Types.Entities.RATARMOR, function(){ self.setAbility(); });
        } else if(npcKind === Types.Entities.OCTOCAT){
            this.questAboutItem(npcKind, 15, Types.Entities.HAMMER, function(){ self.setAbility(); });
        } else if(npcKind === Types.Entities.FAIRYNPC){
            this.questAboutItem(npcKind, 21, Types.Entities.REDLIGHTSABER, function(){ self.setAbility(); });
        } else if(npcKind === Types.Entities.ZOMBIEGF){
            this.questAboutItem(npcKind, 23, Types.Entities.BLUEWINGARMOR, function(){ self.setAbility(); });
        } else if(npcKind === Types.Entities.PIRATEGIRLNPC){
            this.questAboutItem(npcKind, 24, Types.Entities.BASTARDSWORD, function(){ self.setAbility(); });
        } else if(npcKind === Types.Entities.IAMVERYCOLDNPC){
            this.questAboutItem(npcKind, 25, Types.Entities.REDMETALSWORD, function(){ self.setAbility(); });
        } else if(npcKind === Types.Entities.ICEELFNPC){
            this.questAboutItem(npcKind, 26, Types.Entities.ICEROSE, function(){ self.setAbility(); });
        } else if(npcKind === Types.Entities.ELFNPC){
            this.questAboutItem(npcKind, 27, Types.Entities.FORESTGUARDIANSWORD, function(){ self.setAbility(); });
        } else if(npcKind === Types.Entities.MOMANGELNPC){
            this.questAboutItem(npcKind, 30, Types.Entities.FROSTARMOR, function(){ self.setAbility(); });
        } else if(npcKind === Types.Entities.SUPERIORANGELNPC){
            this.questAboutItem(npcKind, 31, Types.Entities.SHADOWREGIONARMOR, function(){ self.setAbility(); });
        } else if(npcKind === Types.Entities.FIRSTSONANGELNPC){
            this.questAboutItem(npcKind, 32, Types.Entities.BREAKER, function(){ self.setAbility(); });
        } else if(npcKind === Types.Entities.SECONDSONANGELNPC){
            this.questAboutItem(npcKind, 33, Types.Entities.DAMBOARMOR, function(){ self.setAbility(); });
        } else if(npcKind === Types.Entities.MOJOJOJONPC){
            this.questAboutItem2(npcKind, 34, Types.Entities.SQUIDARMOR, Types.Entities.TYPHOON, function(){ self.setAbility(); });
        } else if(npcKind === Types.Entities.ANCIENTMANUMENTNPC){
            this.questAboutItem(npcKind, 35, Types.Entities.MEMME, function(){ self.setAbility(); });
        } else{
            this.server.pushToPlayer(this, new Messages.TalkToNPC(npcKind, false));
        }
    },
    questAboutItem: function(npcKind, questNumber, itemKind, callback){
        if(this.achievement[questNumber].found === true
        && this.achievement[questNumber].progress !== 999) {
            if(this.inventory.hasItem(itemKind)){
                this.inventory.makeEmptyInventory(this.inventory.getInventoryNumber(itemKind));
                this.send([Types.Messages.QUEST, "complete", questNumber]);
                this.achievement[questNumber].progress = 999;
                if(callback){
                    callback();
                    this.server.pushToPlayer(this, new Messages.TalkToNPC(npcKind, true));
                }
            databaseHandler.progressAchievement(this.name, questNumber, this.achievement[questNumber].progress);
            } else{
                this.server.pushToPlayer(this, new Messages.TalkToNPC(npcKind, false));
            }
        }
    },
    questAboutItem2: function(npcKind, questNumber, itemKind, item2Kind, callback){
        if(this.achievement[questNumber].found === true
        && this.achievement[questNumber].progress !== 999) {
            if(this.inventory.hasItem(itemKind) && this.inventory.hasItem(item2Kind)){
                this.inventory.makeEmptyInventory(this.inventory.getInventoryNumber(itemKind));
                this.inventory.makeEmptyInventory(this.inventory.getInventoryNumber(item2Kind));
                this.send([Types.Messages.QUEST, "complete", questNumber]);
                this.achievement[questNumber].progress = 999;
                if(callback){
                    callback();
                    this.server.pushToPlayer(this, new Messages.TalkToNPC(npcKind, true));
                }
            databaseHandler.progressAchievement(this.name, questNumber, this.achievement[questNumber].progress);
            } else{
                this.server.pushToPlayer(this, new Messages.TalkToNPC(npcKind, false));
            } 
        }
    },
    resetTimeout: function() {
        clearTimeout(this.disconnectTimeout);
        this.disconnectTimeout = setTimeout(this.timeout.bind(this), 1000 * 60 * 5); // 5 min.
    },
    
    _questAboutKill: function(mobKind, questMobKind, questId, completeNumber, callback){
        if((questMobKind === 0 && Types.getMobLevel(mobKind)*2 > this.level) || mobKind === questMobKind) {
            var achievement = this.achievement[questId];
            if(achievement.found && achievement.progress !== 999) {
                if(isNaN(achievement.progress)){
                    achievement.progress = 0;
                } else{
                    achievement.progress++;
                }
            if(achievement.progress >= completeNumber) {
                this.send([Types.Messages.QUEST, "complete", questId]);
                achievement.progress = 999;
                if(callback){
                    callback();
                }
            }
                databaseHandler.progressAchievement(this.name, questId, achievement.progress);
                if(achievement.progress < completeNumber){
                    this.send([Types.Messages.QUEST, "progress", questId, achievement.progress]);
                }
            }
        }
    },
    getDailyQuest: function(){
        var i=0;
        for(i=0; i<4; i++){
            if(this.achievement[i+101].found){
                if(this.achievement[i+101].progress !== 999){
                    break;
                }
            } else {
                this.foundQuest(i+101);
                break;
            }
        }
    },
    foundQuest: function(questId){
        this.achievement[questId].found = true;
        databaseHandler.foundAchievement(this.name, questId);
        this.send([Types.Messages.QUEST, "found", questId]);
    },
    
    timeout: function() {
        this.connection.sendUTF8("timeout");
        this.connection.close("Player was idle for too long");
    },

    incExp: function(gotexp){
        if (this.variations.doubleEXP) {
            log.info("Double EXP Enabled");
            this.experience = parseInt(this.experience) + (parseInt(gotexp) * 2);
            log.info("Added: " + parseInt(gotexp) + " w/ double EXP: " + (parseInt(gotexp) * 2));
        } else {
            log.info("EXP Multiplier: " + this.variations.expMultiplier);
            this.experience = parseInt(this.experience) + (parseInt(gotexp) * this.variations.expMultiplier);
        }
        
        //NOTE
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

    sendWelcome: function(armor, weapon, avatar, weaponAvatar, exp, admin,
                          bannedTime, banUseTime, x, y, chatBanEndTime, 
                          armorEnchantedPoint, armorSkillKind, armorSkillLevel,
                          avatarEnchantedPoint, avatarSkillKind, avatarSkillLevel, 
                          weaponEnchantedPoint, weaponSkillKind, weaponSkillLevel, 
                          weaponAvatarEnchantedPoint, weaponAvatarSkillKind, weaponAvatarSkillLevel, 
                          pendant, pendantEnchantedPoint, pendantSkillKind, pendantSkillLevel,
                          ring, ringEnchantedPoint, ringSkillKind, ringSkillLevel, 
                          boots, bootsEnchantedPoint, bootsSkillKind, bootsSkillLevel, membership, membershipTime) {
        var self = this;
        self.kind = Types.Entities.WARRIOR;
        self.admin = admin;
        //self.moderator = moderator;
        self.equipArmor(Types.getKindFromString(armor), armorEnchantedPoint, armorSkillKind, armorSkillLevel);
        self.equipAvatar(Types.getKindFromString(avatar), avatarEnchantedPoint, avatarSkillKind, armorSkillLevel);
        self.equipWeapon(Types.getKindFromString(weapon), weaponEnchantedPoint, weaponSkillKind, weaponSkillLevel);
        self.equipWeaponAvatar(Types.getKindFromString(weaponAvatar), weaponAvatarEnchantedPoint, weaponAvatarSkillKind, weaponAvatarSkillLevel);
        self.equipPendant(Types.getKindFromString(pendant), pendantEnchantedPoint, pendantSkillKind, pendantSkillLevel);
        self.equipRing(Types.getKindFromString(ring), ringEnchantedPoint, ringSkillKind, ringSkillLevel);
        self.equipBoots(Types.getKindFromString(boots), bootsEnchantedPoint, bootsSkillKind, bootsSkillLevel);
        self.membership = membership;
        self.bannedTime = bannedTime;
        self.banUseTime = banUseTime;
        self.membershipTime = membershipTime;
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
        databaseHandler.getAllInventory(this, function(maxInventoryNumber, itemKinds, itemNumbers, itemSkillKinds, itemSkillLevels) {
            self.inventory = new Inventory(self, maxInventoryNumber, itemKinds, itemNumbers, itemSkillKinds, itemSkillLevels);
            databaseHandler.loadQuest(self, function() {
                var i = 0;
                var sendMessage = [
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
                    self.mana, //12
                    self.variations.doubleEXP,
                    self.variations.expMultiplier,
                    self.membership
                ]; 
                log.info("Sent Double EXP w/ value of: " + self.variations.doubleEXP);
                log.info("Sent EXP Multiplier w/ value of: " + self.variations.expMultiplier);
            
                for(i = 0; i < Types.Quest.TOTAL_QUEST_NUMBER; i++){
                    sendMessage.push(self.achievement[i+1].found);
                    sendMessage.push(self.achievement[i+1].progress);
                }
                for(i = 0; i < 4; i++){
                    sendMessage.push(self.achievement[i+101].found);
                    sendMessage.push(self.achievement[i+101].progress);
                }
                sendMessage.push(self.inventory.number);
                for(i=0; i < self.inventory.number; i++){
                    sendMessage.push(self.inventory.rooms[i].itemKind);
                    sendMessage.push(self.inventory.rooms[i].itemNumber);
                    sendMessage.push(self.inventory.rooms[i].itemSkillKind);
                    sendMessage.push(self.inventory.rooms[i].itemSkillLevel);
                }
                self.send(sendMessage);
                
                
                /*databaseHandler.loadSkillSlots(self, function(names) {
                    for(var index = 0; index < names.length; index++) {
                        if(names[index]) {
                            self.skillHandler.install(index, names[index]);
                            self.send((new Messages.SkillInstall(index, names[index])).serialize());
                        }
                    }
                self.setAbility();
                });*/
            });
        });
        self.hasEnteredGame = true;
        self.isDead = false;  
    },
   
    handleLootMove: function(message){ 
        if(this.lootmove_callback) {
            this.setPosition(message[1], message[2]);

            var item = this.server.getEntityById(message[3]);
            if(item) {
                this.clearTarget();

                this.broadcast(new Messages.LootMove(this, item));
                this.lootmove_callback(this.x, this.y);
            }
        }     
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
    canEquipArmor: function(itemKind){
        
        var armorLevel = Types.getArmorRank(itemKind)+1;
        if(armorLevel * 2 > this.level){
            this.server.pushToPlayer(this, new Messages.Notify("You need to be level " + armorLevel * 2 + " to equip this."));
            return false;
        }
        return true;
        
      },
      canEquipWeapon: function(itemKind){
        
        var weaponLevel = Types.getWeaponRank(itemKind)+1;
        if(weaponLevel * 2 > this.level){
            this.server.pushToPlayer(this, new Messages.Notify("You need to be level " + weaponLevel * 2 + " to equip this."));
            return false;
        }
        return true;
    },
    handleInventoryAvatar: function(inventoryNumber){
        var itemKind = this.inventory.rooms[inventoryNumber].itemKind;
        var itemEnchantedPoint = this.inventory.rooms[inventoryNumber].itemNumber;
        var itemSkillKind = this.inventory.rooms[inventoryNumber].itemSkillKind;
        var itemSkillLevel = this.inventory.rooms[inventoryNumber].itemSkillKind;

        if(!this.canEquipArmor(itemKind)){
          return;
        }
        if(this.avatar){
          this.inventory.setInventory(inventoryNumber, this.avatar, this.avatarEnchantedPoint, this.avatarSkillKind, this.avatarSkillLevel);
        } else{
          this.inventory.makeEmptyInventory(inventoryNumber);
        }
        this.equipItem(itemKind, itemEnchantedPoint, itemSkillKind, itemSkillLevel, true);
        this.broadcast(this.equip(itemKind), false);
    },
    handleInventoryWeaponAvatar: function(inventoryNumber){
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
        if(weaponLevel * 2 > this.level){
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
                  Types.isPendant(item.kind) || Types.isRing(item.kind) || Types.isBoots(item.kind)){
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
        } else{
            this.server.removeEntity(item);
            this.inventory.makeEmptyInventory(inventoryNumber);
        }
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
    handleInventoryEnchantWeapon: function(itemKind, inventoryNumber){
        if(itemKind !== Types.Entities.SNOWPOTION){
            this.server.pushToPlayer(this, new Messages.Notify("스노우포션이 아닙니다."));
            return;
        }
        if(this.weaponEnchantedPoint + this.weaponSkillLevel>= 30){
            this.server.pushToPlayer(this, new Messages.Notify("무기의 강화도와 무기 속성 레벨의 합은 30을 넘을 수 없습니다."));
            return;
        }
        this.inventory.makeEmptyInventory(inventoryNumber);
        if(Utils.ratioToBool(0.1)){
            this.server.pushToPlayer(this, new Messages.Notify("강화에 성공했습니다."));
            if(this.weaponEnchantedPoint){
              this.weaponEnchantedPoint += 1;
            } else{
              this.weaponEnchantedPoint = 1;
            }
            databaseHandler.enchantWeapon(this.name, this.weaponEnchantedPoint);
        } else{
            this.server.pushToPlayer(this, new Messages.Notify("강화에 실패했습니다."));
        }
    },
    handleInventoryEnchantBloodsucking: function(itemKind, inventoryNumber){
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
            if(this.weaponSkillLevel){
              this.weaponSkillLevel += 1;
            } else{
              this.weaponSkillLevel = 1;
            }
            databaseHandler.setWeaponSkill(this.name, this.weaponSkillKind, this.weaponSkillLevel);
        } else{
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
        } else{
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



    handleLoot: function(message){
        var self = this;
        var item = this.server.getEntityById(message[1]);
                
    if(item) {
        var kind = item.kind;
        var itemRank = 0;

        if(Types.isItem(kind)) {
            if(kind === Types.Entities.FIREPOTION) {
                this.updateHitPoints();
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
                if(self.inventory.putInventory(item.kind, item.count, item.skillKind, item.skillLevel)){
                    this.broadcast(item.despawn(), false);
                    this.server.removeEntity(item);
                }
            }
        }
    }
  },
    
    
    computeSkillLevel: function() {
        if(this.achievement[10].progress === 999) {
            if(this.achievement[11].progress === 999) {
                if(this.achievement[14].progress === 999) {
                    if(this.achievement[18].progress === 999) {
                        
                        this.skillHandler.add('evasion', 4);
                    } else {
                        
                        this.skillHandler.add('evasion', 3);
                    }
                } else{
                    
                    this.skillHandler.add('evasion', 2);
                }
            } else {
                
                this.skillHandler.add('evasion', 1);
            }
        }
        if(this.achievement[12].progress === 999) {
            if(this.achievement[13].progress === 999) {
                if(this.achievement[17].progress === 999) {
                    if(this.achievement[20].progress === 999) {
                        this.skillHandler.add('bloodSucking', 4);
                    } else {
                        this.skillHandler.add('bloodSucking', 3);
                    }
                } else {
                    this.skillHandler.add('bloodSucking', 2);
                }
            } else {
                this.skillHandler.add('bloodSucking', 1);
            }
        }
        if(this.achievement[15].progress === 999) {
            if(this.achievement[16].progress === 999) {
                if(this.achievement[21].progress === 999) {
                    if(this.achievement[24].progress === 999) {
                        this.skillHandler.add('criticalStrike', 4);
                    } else {
                        this.skillHandler.add('criticalStrike', 3);
                    }
                } else {
                    this.skillHandler.add('criticalStrike', 2);
                }
            } else {
                this.skillHandler.add('criticalStrike', 1);
            }
        }
        if(this.achievement[19].progress === 999) {
            if(this.achievement[22].progress === 999) {
                if(this.achievement[25].progress === 999) {
                    if(this.achievement[28].progress === 999) {
                        this.skillHandler.add('heal', 4);
                    } else{
                        this.skillHandler.add('heal', 3);
                    }
                } else {
                    this.skillHandler.add('heal', 2);
                }
            } else {
                this.skillHandler.add('heal', 1);
            }
        }
        if(this.achievement[23].progress === 999) {
            if(this.achievement[26].progress === 999) {
                if(this.achievement[29].progress === 999) {
                    if(this.achievement[32].progress === 999) {
                        this.skillHandler.add('flareDance', 4);
                    } else{
                        this.skillHandler.add('flareDance', 3);
                    }
                } else{
                      this.skillHandler.add('flareDance', 2);
                }
            } else {
                this.skillHandler.add('flareDance', 1);
            }
        }
        if(this.achievement[27].progress === 999) {
            if(this.achievement[30].progress === 999) {
                if(this.achievement[33].progress === 999) {
                    this.skillHandler.add('stun', 3);
                } else{
                    this.skillHandler.add('stun', 2);
                }
            } else{
                this.skillHandler.add('stun', 1);
            }
        }
        if(this.achievement[31].progress === 999){
            if(this.achievement[34].progress === 999) {
                this.skillHandler.add('superCat', 2);
            } else{
                this.skillHandler.add('superCat', 1);
            }
        }
        if(this.achievement[35].progress === 999){
            this.skillHandler.add('provocation', 1);
        }
      },
    setAbility: function(){
        this.computeSkillLevel();

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
    handleSkill: function(message){
        var self = this;
        var type = message[1];
        var targetId = message[2];
        if(type === "heal"){
            if(this.party){
                var healLevel = this.skillHandler.getLevel("heal"),
                    now = (new Date()).getTime();
                if((healLevel > 0) && ((now - this.healExecuted) > 30 * 1000) && this.mana >= 30) {
                    var i = 0;
                    var partyPlayers = this.party.players;
                    var p = null;
                    var amount = 0;
                    switch(healLevel) {
                        case 1: amount = this.level;
                        case 2: amount = Math.floor(this.level * 1.5);
                        case 3: amount = this.level * 2;
                        case 4: amount = Math.floor(this.level * 2.5);
                    }
                    if(this.pendantSkillKind == Types.Skills.HEALANDHEAL) {
                        amount += this.pendantSkillLevel * 10;
                    }
                    if(this.ringSkillKind == Types.Skills.HEALANDHEAL) {
                        amount += this.ringSkillLevel * 10;
                    }
                    for(i=0; i < partyPlayers.length; i++){
                        p = partyPlayers[i];
                        if(p === this){
                            continue;
                        }
                        if(!p.hasFullHealth()) {
                            p.regenHealthBy(amount);
                            p.server.pushToPlayer(p, p.health());
                        }
                    }
                    this.healExecuted = now;
                    this.broadcast(new Messages.Skill("heal", this.id, 0), false);
                    this.mana -= 30;
                    this.server.pushToPlayer(this, new Messages.Mana(this));
                }
            } else{
                
                this.server.pushToPlayer(this, new Messages.Notify("파티원이 없을 때는 힐링 스킬을 쓸 수 없습니다."));
            }
        } else if(type === "flareDance"){
            var flareDanceLevel = this.skillHandler.getLevel("flareDance"),
                now = (new Date).getTime();
            if((flareDanceLevel > 0) && ((now - this.flareDanceExecuted1) > 10 * 1000) && this.mana >= 100) {
                this.broadcast(new Messages.Skill("flareDance", this.id, 0), false);
                self.flareDanceCallback = setTimeout(function () {
                    self.flareDanceCallback = null;
                    self.broadcast(new Messages.Skill("flareDanceOff", self.id, 0), false);
                }, 5*1000);
                this.flareDanceExecuted1 = now;
                this.flareDanceExecuted2 = 0;
                this.flareDanceCount = 0;
                this.mana -= 100;
                this.server.pushToPlayer(this, new Messages.Mana(this));
            }
        } else if(type === "stun"){
            var target = this.server.getEntityById(targetId);
            var stunLevel = this.skillHandler.getLevel("stun");
            var now = (new Date).getTime();
            if(target
            && stunLevel > 0
            && (now - this.stunExecuted) > 30 * 1000
            && this.mana >= 150) {
                this.broadcast(new Messages.Skill("stun", targetId, stunLevel), false);
                this.stunExecuted = now;
                this.mana -= 150;
                this.server.pushToPlayer(this, new Messages.Mana(this));
            }
        } else if(type === "superCat"){
            var superCatLevel = this.skillHandler.getLevel("superCat");
            var now = (new Date).getTime();
            if(superCatLevel > 0 && (now - this.superCatExecuted) > 90 * 1000
            && this.mana >= 200 && this.superCatCallback == null){
                this.broadcast(new Messages.Skill("superCat", this.id, superCatLevel), false);
                this.superCatExecuted = now;
                this.mana -= 200;
                this.server.pushToPlayer(this, new Messages.Mana(this));
                this.superCatCallback = setTimeout(function () {
                    self.superCatCallback = null;
                    self.broadcast(new Messages.Skill("superCatOff", self.id, 0), false);
                }, 30*1000);
            }
        } else if(type === "provocation"){
            var target = this.server.getEntityById(targetId);
            var provocationLevel = this.skillHandler.getLevel("provocation");
            var now = (new Date).getTime();
            if(target
            && provocationLevel > 0
            && (now - this.provocationExecuted) > 15 * 1000
            && this.mana >= 50) {
                this.broadcast(new Messages.Skill("provocation", targetId, provocationLevel), false);
                this.provocationExecuted = now;
                this.mana -= 50;
                this.server.pushToPlayer(this, new Messages.Mana(this));
                this.server.provocateMob(this, target);
            }
        }
      },
    handleFlareDance: function(message){
        if(this.flareDanceCallback) {
            var flareDanceLevel = this.skillHandler.getLevel("flareDance"),
                now = (new Date).getTime();
            if((flareDanceLevel > 0) && ((now - this.flareDanceExecuted2) >= 720) && (this.flareDanceCount < 10)) {
                var i=1;
                var dmg = this.level;

                this.flareDanceExecuted2 = now;
                this.flareDanceCount++;

                if(flareDanceLevel == 2) {
                    dmg = Math.floor(this.level * 1.4);
                } else if(flareDanceLevel == 3){
                    dmg = Math.floor(this.level * 1.7);
                } else if(flareDanceLevel == 4){
                    dmg = Math.floor(this.level * 2);
                }

                for(i=1; i<5; i++){
                    var mob = this.server.getEntityById(message[i]);
                    if(mob){
                        mob.receiveDamage(dmg, this.id);
                        if(mob.hitPoints <= 0){
                            this.questAboutKill(mob);
                        }
                        this.server.handleMobHate(mob.id, this.id, dmg);
                        this.server.handleHurtEntity(mob, this, dmg);
                    }
                }
            }
        }
    },
    handleSkillInstall: function(message) {
        var index = message[1],
            name = message[2],
            self = this;

        if(((index >= 0) && (index < this.skillHandler.skillSlots.length)) && (name in Types.Player.Skills)) {
            databaseHandler.handleSkillInstall(this, index, name, function() {
                self.skillHandler.install(index, name);
                self.server.pushToPlayer(self, new Messages.SkillInstall(index, name));
            });
        }
    },
  
    getRanking: function() {
        databaseHandler.getPlayerRanking(this, function(ranking){
             log.debug("Ranking: " + ranking);
        });
    }
});
