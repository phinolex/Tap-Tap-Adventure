
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
    Types = require("../../shared/js/gametypes"),
    bcrypt = require('bcrypt'),
    Inventory = require("./inventory"),
    Mob = require('./mob'),
    SkillHandler = require("./skillhandler"),
    Variations = require('./variations'),
    Trade = require('./trade');


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
        this.friends = {};
        this.ignores = {};
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
        this.royalAzaleaBenefTimeout = null;
        this.cooltimeTimeout = null;

        this.skillHandler = new SkillHandler();

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
                var session_id_kbve = false;

                /**
                 *  I was thinking we put the API check before everything and then not even have to use redis to verify the password again.
                 *  Basically under redis.js, you check if the password is correct? Lets just assume after it checks the API and if it returns true,
                 *  then the username is EITHER valid OR not existent.
                 *  if Valid, then we just load the character , no point in checking the password again...
                 * if not existent, we just create it ... then move forward.
                 * The API will be ready in 15mins ~
                 * https://kbve.com/api/vengyn/member/vengyn_member_login.php?action=login&username=demo&password=demo
                 * I am going to put a block for bruteforce and require an API key.
                 *  Basically, if the username and password are correct (demo, demo are), then it returns a session_id
                 * {"session_id": "c514c91e4ed341f263e458d44b3bb0a7"}
                 * 
                 * if its false, it returns... false for the session_id...
                 * 
                 * 
                 * THEN, with the session_id, you can pull anything you want..
                 * 
                 * https://kbve.com/api/tta/tta_m.php?session_id=c514c91e4ed341f263e458d44b3bb0a7
                 * 
                 * It gives you demo / demo 's full KBVE profile in json
                 * 
                 * "email":"mamosa@gmail.com
                 * "ip_address":"142.105.37.212"
                 * member_group_id":"3" , where 3 is a normal user, you can reference the admin panel for the exact user ids
                 *  So if they are in the group that is ban, we will go ahead and 
                 * 
                 * We can grab PMs, their KBVE credits, special exp boost if they recently were active, ect..
                 * 
                 * Furthermore, we can also grab their crypto-currency and steam_id (if they add it).
                 * 
                 * 
                 * http://rapiddg.com/blog/calling-rest-api-nodejs-script
                 * 
                 * I changed the API to https://kbve.com/api/tta/tta_l.php  , and its no longer $_GET but rather $_POST via JSON .
                 * 
                 * http://gurujsonrpc.appspot.com/ (You can use this to test the API)
                 * 
                 * 
                *
                * 
                * Here is how i am thinking of it working.. performRequest is from the link above. 
                * 
                  
                  
                  
                  performRequest('https://kbve.com/api/tta/tta_l.php', 'POST', {
                    
                    method: login,
                    username: name,
                    password: pw
                  }, function(data) {
                    session_id_kbve = data.session_id;
                  
                            
                        if(session_id_kbve)
                                {
                                    if(name exists)
                                     {
                                         
                                         Load Character ($name); 
                                     }
                                     else
                                     {
                                        Call TTA API to get member info, such as email.
                                         createAccount($name, $pw, $email, $kbve_userid); // We should also add their KBVE UserID, but the email kinda can be an ID.
                                         
                                         
                                     }
                                    
                                }
                                else
                                {
                                    
                                        player.connection.sendUTF8("invalidlogin");
                                        player.connection.close("Wrong KBVE Password: " + player.name);
                                        return;
                                }
                  
                  });
                  
                
                
                
                
                 * 
                 * 
                 * 
                 * 
                **/
                
                /* 
                // Check Password
                This is how redis checks the player's password
                bcrypt.compare(player.pw, pw, function(err, res) {
                    if(!res) {
                        player.connection.sendUTF8("invalidlogin");
                        player.connection.close("Wrong Password: " + player.name);
                        return;
                    }
                
                
                
                
                
                */
                
                

                /**
                 * Implement RSA Authorization
                 */

                log.info("Starting Client/Server Handshake");

                // Always ensure that the name is not longer than a maximum length.
                // (also enforced by the maxlength attribute of the name input element).
                // After that, you capitalize the first letter.
                var pName = name.substr(0, 12).trim();
                self.name = pName;


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

                    if(msg.startsWith("/1 ")) {


                        if((new Date()).getTime() > self.chatBanEndTime) {
                            self.server.pushBroadcast(new Messages.Chat(self, msg));
                        } else {
                            self.send([Types.Messages.NOTIFY, "You have been muted.."]);
                        }


                    } else if (msg.startsWith("/kick ")) {
                        var targetPlayer = self.server.getPlayerByName(msg.split('_'));

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
                            databaseHandler.teleportPlayer(self, playerName, x, y);


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

                    } else if (msg.startsWith("/sendrequest ")) {
                        var targetPlayer = self.server.getPlayerByName(msg.split(' ')[1]);
                        if (targetPlayer) {
                            this.trade = new Trade(self, targetPlayer);
                            this.trade.sendRequest(self, targetPlayer);
                        }

                    } else if (msg.startsWith("/setability ")) {
                        self.setAbility();
                    } else {
                        self.broadcastToZone(new Messages.Chat(self, msg), false);
                    }

                }
            }
            else if(action === Types.Messages.MOVE) {
                //log.info("MOVE: " + self.name + "(" + message[1] + ", " + message[2] + ")");
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
            } else if(action === Types.Messages.HIT) {
                log.info("HIT: " + self.name + " " + message[1]);
                self.handleHit(message);
            } else if(action === Types.Messages.HURT) {
                self.handleHurt(message);
            } else if(action === Types.Messages.INVENTORY){
                log.info("INVENTORY: " + self.name + " " + message[1] + " " + message[2] + " " + message[3]);
                self.handleInventory(message);
            }  else if(action === Types.Messages.SKILL){
                log.info("SKILL: " + self.name + " " + message[1] + " " + message[2]);
                self.handleSkill(message);
            } else if(action === Types.Messages.SKILLINSTALL) {
                log.info("SKILLINSTALL: " + self.name + " " + message[1] + " " + message[2]);
                self.handleSkillInstall(message);
            } else if(action === Types.Messages.SELL){
                log.info("SELL: " + self.name + " " + message[1] + " " + message[2]);
                self.handleSell(message);
            } else if(action === Types.Messages.AGGRO) {
                log.info("AGGRO: " + self.name + " " + message[1]);
                if(self.move_callback) {
                    self.server.handleMobHate(message[1], self.id, 5);
                }
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
            } else if(action === Types.Messages.CHARACTERINFO) {
                log.info("CHARACTERINFO: " + self.name);
                self.server.pushToPlayer(self, new Messages.CharacterInfo(self));

            } else if(action === Types.Messages.TELEPORT) {
                //log.info("TELEPORT: " + self.name + "(" + message[1] + ", " + message[2] + ")");
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
            } else if (action === Types.Messages.FLAREDANCE) {
                log.info("FLAREDANCE: " + self.name + " " + message[1] + ", " + message[2] + ", " + message[3] + ", " + message[4]);
                self.handleFlareDance(message);
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
            } else if(action === Types.Messages.GUILD) {
                if(message[1] === Types.Messages.GUILDACTION.CREATE) {
                    var guildname = Utils.sanitize(message[2]);
                    if(guildname === "") { //inaccurate name
                        self.server.pushToPlayer(self, new Messages.GuildError(Types.Messages.GUILDERRORTYPE.BADNAME,message[2]));
                    } else {
                        var guildId = self.server.addGuild(guildname);
                        if(guildId === false) {
                            self.server.pushToPlayer(self, new Messages.GuildError(Types.Messages.GUILDERRORTYPE.ALREADYEXISTS, guildname));
                        } else {
                            self.server.joinGuild(self, guildId);
                            self.server.pushToPlayer(self, new Messages.Guild(Types.Messages.GUILDACTION.CREATE, [guildId, guildname]));
                        }
                    }
                }
                else if(message[1] === Types.Messages.GUILDACTION.INVITE) {
                    var userName = message[2];
                    var invitee;
                    if(self.group in self.server.groups) {
                        invitee = _.find(self.server.groups[self.group].entities,
                                         function(entity, key) { return (entity instanceof Player && entity.name == userName) ? entity : false; });
                        if(invitee) {
                            self.getGuild().invite(invitee,self);
                        }
                    }
                }
                else if(message[1] === Types.Messages.GUILDACTION.JOIN) {
                    self.server.joinGuild(self, message[2], message[3]);
                }
                else if(message[1] === Types.Messages.GUILDACTION.LEAVE) {
                    self.leaveGuild();
                }
                else if(message[1] === Types.Messages.GUILDACTION.TALK) {
                    self.server.pushToGuild(self.getGuild(), new Messages.Guild(Types.Messages.GUILDACTION.TALK, [self.name, self.id, message[2]]));
                }
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
                    this._questAboutKill(mob.kind, 0, 102, 50, function(){
                        log.info("Quest 102 Completed");
                        self.inventory.putInventory(Types.Entities.BURGER, 100, 0, 0);
                    });
                    return;
                } else if(this.achievement[103].found){
                    if(this.achievement[103].progress < 999){
                        this._questAboutKill(mob.kind, 0, 103, 100, function(){
                            log.info("Quest 103 Completed");
                            self.inventory.putInventory(Types.Entities.ROYALAZALEA, 50, 0, 0);
                        });
                        return;
                    } else if(this.achievement[104].found){
                        if(this.achievement[104].progress < 999){
                            this._questAboutKill(mob.kind, 0, 104, 200, function(){
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
        this._questAboutKill(mob.kind, Types.Entities.GOBLIN, 28, 60, function(){ self.setAbility(); });
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
            state = [this.name, this.orientation, this.avatar ? this.avatar : this.armor, this.weaponAvatar ? this.weaponAvatar : this.weapon, this.level];

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
        this.avatar = kind;
        if(enchantedPoint){
            this.armorEnchantedPoint = enchantedPoint;
            this.avatarEnchantedPoint = enchantedPoint;
        } else {
            this.armorEnchantedPoint = 0;
            this.avatarEnchantedPoint = 0;
        }
        this.armorLevel = Properties.getArmorLevel(kind) + this.armorEnchantedPoint;
        this.armorSkillKind = skillKind;
        this.armorSkillLevel = skillLevel;
        this.avatarSkillKind = skillKind;
        this.avatarSkillLevel = skillLevel;
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
        this.weaponAvatar = kind;
        if(enchantedPoint){

            this.weaponEnchantedPoint = enchantedPoint;
            this.weaponAvatarEnchantedPoint = enchantedPoint;
        } else {

            this.weaponEnchantedPoint = 0;
            this.weaponAvatarEnchantedPoint = 0;
        }
        if (Types.isArcherWeapon(kind)) {
            databaseHandler.changePlayerKind(this, "archer");
        } else {
            databaseHandler.changePlayerKind(this, "archer");
        }

        this.weaponLevel = Properties.getWeaponLevel(kind) + this.weaponEnchantedPoint;
        this.weaponSkillKind = skillKind;
        this.weaponSkillLevel = skillLevel;
        this.weaponAvatarSkillKind = skillKind;
        this.weaponAvatarSkillLevel = skillLevel;
    },
    equipWeaponAvatar: function(kind, enchantedPoint, skillKind, skillLevel){

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
                databaseHandler.equipAvatar(this.name, Types.getKindAsString(itemKind), enchantedPoint, skillKind, skillLevel);
                databaseHandler.equipArmor(this.name, Types.getKindAsString(itemKind), enchantedPoint, skillKind, skillLevel);
                this.equipArmor(itemKind, enchantedPoint, skillKind, skillLevel);

            } else if(Types.isWeapon(itemKind) || Types.isArcherWeapon(itemKind)) {

                databaseHandler.equipWeaponAvatar(this.name, Types.getKindAsString(itemKind), enchantedPoint ? enchantedPoint : 0, skillKind, skillLevel);
                databaseHandler.equipWeapon(this.name, Types.getKindAsString(itemKind), enchantedPoint ? enchantedPoint : 0, skillKind, skillLevel);
                this.equipWeapon(itemKind, enchantedPoint, skillKind, skillLevel);

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
        } else if(npcKind === Types.Entities.SNOWSHEPHERDBOY){
            this.questAboutItem(npcKind, 28, Types.Entities.LEATHERARMOR, function(){ self.incExp(50); });
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
    setGuildId: function(id) {
        if(typeof this.server.guilds[id] !== "undefined") {
            this.guildId = id;
        }
        else {
            log.error(this.id + " cannot add guild " + id + ", it does not exist");
        }
    },

    getGuild: function() {
        return this.hasGuild ? this.server.guilds[this.guildId] : undefined;
    },

    hasGuild: function() {
        return (typeof this.guildId !== "undefined");
    },

    leaveGuild: function() {
        if(this.hasGuild()){
            var leftGuild = this.getGuild();
            leftGuild.removeMember(this);
            this.server.pushToGuild(leftGuild, new Messages.Guild(Types.Messages.GUILDACTION.LEAVE, [this.name, this.id, leftGuild.name]));
            delete this.guildId;
            this.server.pushToPlayer(this, new Messages.Guild(Types.Messages.GUILDACTION.LEAVE, [this.name, this.id, leftGuild.name]));
        }
        else {
            this.server.pushToPlayer(this, new Messages.GuildError(Types.Messages.GUILDERRORTYPE.NOLEAVE,""));
        }
    },


    sendWelcome: function(armor, weapon, avatar, weaponAvatar, exp, moderator, admin,
                          bannedTime, banUseTime, x, y, chatBanEndTime, rank,
                          armorEnchantedPoint, armorSkillKind, armorSkillLevel,
                          avatarEnchantedPoint, avatarSkillKind, avatarSkillLevel,
                          weaponEnchantedPoint, weaponSkillKind, weaponSkillLevel,
                          weaponAvatarEnchantedPoint, weaponAvatarSkillKind, weaponAvatarSkillLevel,
                          pendant, pendantEnchantedPoint, pendantSkillKind, pendantSkillLevel,
                          ring, ringEnchantedPoint, ringSkillKind, ringSkillLevel,
                          boots, bootsEnchantedPoint, bootsSkillKind, bootsSkillLevel, membership,
                          membershipTime, kind) {
        var self = this;
        self.kind = kind;
        self.moderator = moderator;
        self.admin = admin;
        self.equipArmor(Types.getKindFromString(armor), armorEnchantedPoint, armorSkillKind, armorSkillLevel);
        self.equipWeapon(Types.getKindFromString(weapon), weaponEnchantedPoint, weaponSkillKind, weaponSkillLevel);
        self.equipPendant(Types.getKindFromString(pendant), pendantEnchantedPoint, pendantSkillKind, pendantSkillLevel);
        self.equipRing(Types.getKindFromString(ring), ringEnchantedPoint, ringSkillKind, ringSkillLevel);
        self.equipBoots(Types.getKindFromString(boots), bootsEnchantedPoint, bootsSkillKind, bootsSkillLevel);
        self.membership = membership;
        self.bannedTime = bannedTime;
        self.banUseTime = banUseTime;
        self.membershipTime = membershipTime;
        self.chatBanEndTime = chatBanEndTime;
        self.experience = exp;
        self.level = Types.getLevel(self.experience);
        self.orientation = Utils.randomOrientation;
        self.updateHitPoints();

        if(x === 0 && y === 0) {
            self.updatePosition();
        } else {
            self.setPosition(x, y);
        }

        self.server.addPlayer(self);
        self.server.enter_callback(self);
        databaseHandler.getAllInventory(self, function(maxInventoryNumber, itemKinds, itemNumbers, itemSkillKinds, itemSkillLevels) {
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
                    self.armor, //6
                    self.weapon, //7
                    self.avatar, //8
                    self.weaponAvatar, //9
                    self.experience, //10
                    self.admin, //11
                    self.mana, //12
                    self.variations.doubleEXP, //13
                    self.variations.expMultiplier, //14
                    self.membership, //15
                    self.kind, //16
                    self.moderator
                ];

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


                databaseHandler.loadSkillSlots(self, function(names) {
                    for(var index = 0; index < names.length; index++) {
                        if(names[index]) {
                            self.skillHandler.install(index, names[index]);
                            self.send((new Messages.SkillInstall(index, names[index])).serialize());
                        }
                    }
                    self.setAbility();
                });
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
                        this.server.pushToPlayer(this, new Messages.Notify("Not enough space in your inventory."));
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
                    this.server.pushToPlayer(this, new Messages.Notify("You don't have enough Burgers."));
                    return;
                }

                if(this.inventory.hasEmptyInventory()) {
                    this.inventory.putInventory(itemKind, Types.Store.getBuyCount(itemName) * itemCount, 0, 0);
                    this.inventory.putInventory(Types.Entities.BURGER, -1 * price, 0, 0);
                } else {
                    this.server.pushToPlayer(this, new Messages.Notify("There is not enough space in your inventory."));
                }
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
        } else {
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
        //if(!this.avatar){
        this.broadcast(this.equip(itemKind), false);
        //}
    },
    handleInventoryWeapon: function(itemKind, inventoryNumber){

        var weaponLevel = Types.getWeaponRank(itemKind) + 1;
        if(weaponLevel * 2 > this.level){
            this.server.pushToPlayer(this, new Messages.Notify("You need to be at least level " + weaponLevel * 2 + " to wield this weapon."));
            return;
        }

        var enchantedPoint = this.inventory.rooms[inventoryNumber].itemNumber;
        var weaponSkillKind = this.inventory.rooms[inventoryNumber].itemSkillKind;
        var weaponSkillLevel = this.inventory.rooms[inventoryNumber].itemSkillLevel;

        this.inventory.setInventory(inventoryNumber, this.weapon, this.weaponEnchantedPoint, this.weaponSkillKind, this.weaponSkillLevel);

        this.equipItem(itemKind, enchantedPoint, weaponSkillKind, weaponSkillLevel, false);
        this.setAbility();
        //if(!this.weaponAvatar){
        this.broadcast(this.equip(itemKind), false);
        //}
    },
    handleInventoryPendant: function(itemKind, inventoryNumber){
        if(!Types.isPendant(itemKind)) {
            this.server.pushToPlayer(this, new Messages.Notify("This isn't a pendant.."));
            return;
        }
        var pendantLevel = Properties.getPendantLevel(itemKind);
        if((pendantLevel * 10) > this.level) {
            this.server.pushToPlayer(this, new Messages.Notify("You need to be level " + (pendantLevel * 10) + " to equip this."));
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
            this.server.pushToPlayer(this, new Messages.Notify("This is not a ring."));
            return;
        }
        var ringLevel = Properties.getRingLevel(itemKind);
        if((ringLevel * 10) > this.level) {
            this.server.pushToPlayer(this, new Messages.Notify("You need to be level " + (ringLevel * 10) + " to equip this."));
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
            this.server.pushToPlayer(this, new Messages.Notify("These are not boots.."));
            return;
        }
        var bootsLevel = Properties.getBootsLevel(itemKind);
        if((bootsLevel * 10) > this.level) {
            this.server.pushToPlayer(this, new Messages.Notify("You need to be level " + (bootsLevel * 10) + " to equop this."));
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
        var item = this.server.addItemFromChest(itemKind, this.x, this.y);
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
            //this.server.addItemFromChest(itemKind, this.x, this.y);
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
            this.server.pushToPlayer(this, new Messages.Notify("This isn't a snowpotion."));
            return;
        }
        if(this.weaponEnchantedPoint + this.weaponSkillLevel>= 30){
            this.server.pushToPlayer(this, new Messages.Notify("Weapon Enchantment cannot exceed 30."));
            return;
        }
        this.inventory.makeEmptyInventory(inventoryNumber);
        if(Utils.ratioToBool(0.4)){
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
        if(itemKind !== Types.Entities.BLACKPOTION){
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
            this.server.pushToPlayer(this, new Messages.Notify("You can use a black potion."));
            return;
        }

        this.inventory.makeEmptyInventory(inventoryNumber);
        if(Utils.ratioToBool(0.4)){
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
    handleInventoryEnchantRing: function(itemKind, inventoryNumber){
        if(itemKind !== Types.Entities.SNOWPOTION){
            this.server.pushToPlayer(this, new Messages.Notify("This isn't a Snow Potion."));
            return;
        }
        if(this.ringEnchantedPoint >= 9){
            this.server.pushToPlayer(this, new Messages.Notify("The ring enchantment cannot exceed level 9."));
            return;
        }
        this.inventory.makeEmptyInventory(inventoryNumber);
        if(Utils.ratioToBool(0.4)){
            this.server.pushToPlayer(this, new Messages.Notify("Ring enchantment successful."));
            if(this.ringEnchantedPoint){
                this.ringEnchantedPoint += 1;
            } else{
                this.ringEnchantedPoint = 1;
            }
            databaseHandler.enchantRing(this.name, this.ringEnchantedPoint);
        } else if(this.ringEnchantedPoint && Utils.ratioToBool(0.3/0.7)){
            this.server.pushToPlayer(this, new Messages.Notify("The ring has been weakened."));
            if(this.ringEnchantedPoint >= 1){
                this.ringEnchantedPoint -= 1;
            } else{
                this.ringEnchantedPoint = 0;
            }
            databaseHandler.enchantRing(this.name, this.ringEnchantedPoint);
        } else{
            this.server.pushToPlayer(this, new Messages.Notify("The enchantment failed."));
        }
    },
    handleInventoryEnchantPendant: function(itemKind, inventoryNumber){
        if(itemKind !== Types.Entities.SNOWPOTION){
            this.server.pushToPlayer(this, new Messages.Notify("This isn't a snow potion."));
            return;
        }
        if(this.pendantEnchantedPoint >= 9){
            this.server.pushToPlayer(this, new Messages.Notify("The pendant enchantment cannot exceed level 9."));
            return;
        }
        this.inventory.makeEmptyInventory(inventoryNumber);
        if(Utils.ratioToBool(0.4)){
            this.server.pushToPlayer(this, new Messages.Notify("Pendant enchantment successful."));
            if(this.pendantEnchantedPoint){
                this.pendantEnchantedPoint += 1;
            } else{
                this.pendantEnchantedPoint = 1;
            }
            databaseHandler.enchantPendant(this.name, this.pendantEnchantedPoint);
        } else if(this.pendantEnchantedPoint && Utils.ratioToBool(0.3/0.7)){
            this.server.pushToPlayer(this, new Messages.Notify("The pendant has been weakened."));
            if(this.pendantEnchantedPoint >= 1){
                this.pendantEnchantedPoint -= 1;
            } else{
                this.pendantEnchantedPoint = 0;
            }
            databaseHandler.enchantPendant(this.name, this.pendantEnchantedPoint);

        } else {
            this.server.pushToPlayer(this, new Messages.Notify("The enchantment failed."));
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

    handleHit: function(message){ // 8
        var mobId = message[1];
        var mob = this.server.getEntityById(message[1]);
        var self = this;

        if(this.cooltimeTimeout){
            return;
        } else{
            this.cooltimeTimeout = setTimeout(function(){
                self.cooltimeTimeout = null;
            }, 720);
        }

        if(mob && this.id){
            var dmg = Formulas.dmg(this, mob);
            if(mob instanceof Player){
                dmg = Formulas.newDmg(this, mob);
            }

            if(dmg > 0){
                if(Utils.ratioToBool(this.criticalRatio)){
                    var criticalStrikeLevel = this.skillHandler.getLevel("criticalStrike");

                    if (isNaN(criticalStrikeLevel)) {
                        criticalStrikeLevel = 1;
                        var dmg2 = dmg * (1 + (0.5 * criticalStrikeLevel));
                        var dmg3 = dmg;
                        dmg = Math.round(dmg2 + (this.ringSkillKind == Types.Skills.CRITICALATTACK ? dmg * (this.ringSkillLevel * 0.05) : 0));
                        if (isNaN(dmg)) {
                            dmg = dmg3;
                        }
                        log.info('critical: ' + dmg);

                        this.broadcast(new Messages.Skill("critical", mobId, 0), false);
                    } else {
                        var dmg2 = dmg * (1 + (0.5 * criticalStrikeLevel));
                        dmg = Math.round(dmg2 + (this.ringSkillKind == Types.Skills.CRITICALATTACK ? dmg * (this.ringSkillLevel * 0.05) : 0));

                        log.info('critical: ' + dmg);

                        this.broadcast(new Messages.Skill("critical", mobId, 0), false);
                    }
                }

                var bloodsuckingAmount = dmg * (this.bloodsuckingRatio + this.skillHandler.getLevel("bloodSucking")*0.05);

                if(this.ringSkillKind == Types.Skills.ATTACKWITHBLOOD) {
                    var hitPoints = this.hitPoints,
                        bleedingAmount = this.maxHitPoints * (this.ringSkillLevel * 0.01);
                    if(hitPoints > bleedingAmount) {
                        bloodsuckingAmount -= bleedingAmount;
                    }
                }

                bloodsuckingAmount = Math.floor(bloodsuckingAmount);
                if(bloodsuckingAmount != 0){
                    this.regenHealthBy(bloodsuckingAmount);
                    this.server.pushToPlayer(this, this.health());
                }

                if(mob.type !== "player"){
                    mob.receiveDamage(dmg, this.id);
                    if(mob.hitPoints <= 0){
                        this.questAboutKill(mob);
                    }
                    this.server.handleMobHate(mob.id, this.id, dmg);
                    this.server.handleHurtEntity(mob, this, dmg);
                } else{
                    mob.hitPoints -= dmg;
                    mob.server.handleHurtEntity(mob, this, dmg);
                    if(mob.hitPoints <= 0){
                        mob.isDead = true;
                        this.server.pushBroadcast(new Messages.Chat(this, "/1 " + this.name + " killed " + mob.name + " in combat."));
                    }
                }
            }
        }
    },
    handleHurt: function(message){ // 9
        var self = this;
        log.info("HURT: " + this.name + " " + message[1]);
        var mob = this.server.getEntityById(message[1]);
        if(mob &&
            (mob.kind === Types.Entities.FORESTDRAGON
            || mob.kind == Types.Entities.SEADRAGON
            || mob.kind == Types.Entities.HELLSPIDER
            || mob.kind == Types.Entities.SKYDINOSAUR)){
            var group = this.server.groups[this.group];
            if(group){
                _.each(group.players, function(playerId){
                    var attackedPlayer = self.server.getEntityById(playerId);
                    if(attackedPlayer){
                        attackedPlayer.hitPoints -= Formulas.dmg(mob, attackedPlayer);
                        self.server.handleHurtEntity(attackedPlayer, mob);

                        if(attackedPlayer.hitPoints <= 0) {
                            attackedPlayer.isDead = true;
                            if(attackedPlayer.level >= 50){
                                attackedPlayer.incExp(Math.floor(attackedPlayer.level*attackedPlayer.level*(-2)));
                            }
                        }
                    }
                });
            }
        }
        if(mob && this.hitPoints > 0 && mob instanceof Mob) {
            var evasionLevel = this.skillHandler.getLevel("evasion");
            if(evasionLevel > 0) {
                var randNum = Math.random(),
                    avoidChance = 0.05 * evasionLevel;

                if(this.pendantSkillKind == Types.Skills.AVOIDATTACK){
                    avoidChance += this.pendantSkillLevel * 0.01;
                }

                if(randNum < avoidChance){
                    this.server.pushToPlayer(this, new Messages.Damage(this, 'MISS', this.hitPoints, this.maxHitPoints));
                    return;
                }
            }

            this.hitPoints -= Formulas.dmg(mob, this);
            this.server.handleHurtEntity(this, mob);
            mob.addTanker(this.id);

            if(this.hitPoints <= 0) {
                this.isDead = true;
                if(this.level >= 50){
                    this.incExp(Math.floor(this.level*this.level*(-2)));
                }
                if(this.flareDanceCallback) {
                    clearTimeout(this.flareDanceCallback);
                    this.flareDanceCallback = null;
                    this.flareDanceExecuted1 = 0;
                    this.flareDanceExecuted2 = 0;
                    this.flareDanceCount = 0;
                }
            }
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

                this.server.pushToPlayer(this, new Messages.Notify("You're not in a party."));
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
