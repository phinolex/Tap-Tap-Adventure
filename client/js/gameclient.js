
/* global Types, log, Class */

define(['player', 'entityfactory', 'mobdata', 'gatherdata', 'pet', 'lib/bison'], function(Player, EntityFactory, MobData, GatherData, Pet, BISON) {

    var GameClient = Class.extend({
        init: function(game) {
            this.game = game;
            this.connection = null;
            this.connected_callback = null;
            this.spawn_callback = null;
            this.movement_callback = null;
            this.ban_callback = null;
            this.wanted_callback = null;
            this.fail_callback = null;
            this.notify_callback = null;

            this.handlers = [];
            this.handlers[Types.Messages.WELCOME] = this.receiveWelcome;
            this.handlers[Types.Messages.MOVE] = this.receiveMove;
            this.handlers[Types.Messages.LOOTMOVE] = this.receiveLootMove;
            this.handlers[Types.Messages.ATTACK] = this.receiveAttack;
            this.handlers[Types.Messages.SPAWN] = this.receiveSpawn;
            this.handlers[Types.Messages.DESPAWN] = this.receiveDespawn;
            this.handlers[Types.Messages.HEALTH] = this.receiveHealth;
            this.handlers[Types.Messages.CHAT] = this.receiveChat;
            this.handlers[Types.Messages.EQUIP] = this.receiveEquipItem;
            this.handlers[Types.Messages.DROP] = this.receiveDrop;
            this.handlers[Types.Messages.TELEPORT] = this.receiveTeleport;
            this.handlers[Types.Messages.DAMAGE] = this.receiveDamage;
            this.handlers[Types.Messages.POPULATION] = this.receivePopulation;
            this.handlers[Types.Messages.LIST] = this.receiveList;
            this.handlers[Types.Messages.DESTROY] = this.receiveDestroy;
            this.handlers[Types.Messages.KILL] = this.receiveKill;
            this.handlers[Types.Messages.PP] = this.receivePoints;
            this.handlers[Types.Messages.BLINK] = this.receiveBlink;
            this.handlers[Types.Messages.PVP] = this.receivePVP;
            this.handlers[Types.Messages.BOARD] = this.receiveBoard;
            this.handlers[Types.Messages.NOTIFY] = this.receiveNotify;
            this.handlers[Types.Messages.KUNG] = this.receiveKung;
            this.handlers[Types.Messages.MANA] = this.receiveMana;
            this.handlers[Types.Messages.ACHIEVEMENT] = this.receiveAchievement;
            this.handlers[Types.Messages.PARTY] = this.receiveParty;
            this.handlers[Types.Messages.TALKTONPC] = this.receiveTalkToNPC;
            this.handlers[Types.Messages.RANKING] = this.receiveRanking;
            this.handlers[Types.Messages.INVENTORY] = this.receiveInventory;
            this.handlers[Types.Messages.DOUBLE_EXP] = this.receiveDoubleEXP;
            this.handlers[Types.Messages.EXP_MULTIPLIER] = this.receiveEXPMultiplier;
            this.handlers[Types.Messages.MEMBERSHIP] = this.receiveMembership;
            this.handlers[Types.Messages.SKILL] = this.receiveSkill;
            this.handlers[Types.Messages.SKILLINSTALL] = this.receiveSkillInstall;
            this.handlers[Types.Messages.SKILLLOAD] = this.receiveSkillLoad;
            this.handlers[Types.Messages.CHARACTERINFO] = this.receiveCharacterInfo;
            this.handlers[Types.Messages.SHOP] = this.receiveShop;
            this.handlers[Types.Messages.WANTED] = this.receiveWanted;
            this.handlers[Types.Messages.BANK] = this.receiveBank;
            this.handlers[Types.Messages.PARTYINVITE] = this.receivePartyInvite;
            this.handlers[Types.Messages.AUCTIONOPEN] = this.receiveAuction;
            this.handlers[Types.Messages.CLASSSWITCH] = this.receiveClassSwitch;
            this.handlers[Types.Messages.CHARDATA] = this.receiveData;
            this.handlers[Types.Messages.PVPGAME] = this.receivePVPGame;
            this.handlers[Types.Messages.POISON] = this.receivePoison;
            this.handlers[Types.Messages.INTERFACE] = this.receiveInterface;
            this.handlers[Types.Messages.GUINOTIFY] = this.receiveGraphicNotification;
            this.handlers[Types.Messages.FORCECAST] = this.receiveForceCast;
            this.handlers[Types.Messages.PROJECTILE] = this.receiveProjectile;
            this.handlers[Types.Messages.GAMEFLAG] = this.receiveGameFlag;
            this.handlers[Types.Messages.DOOR] = this.receiveDoor;
            this.handlers[Types.Messages.GAMEDATA] = this.receiveMinigameData;
            this.handlers[Types.Messages.TEAM] = this.receiveTeam;
            this.handlers[Types.Messages.STOP] = this.receiveStop;
            this.handlers[Types.Messages.SENDAD] = this.receiveAd;
            this.handlers[Types.Messages.CENTERCAMERA] = this.receiveCamera;
            this.handlers[Types.Messages.SHOWINSTURCTIONS] = this.receiveInstructions;
            this.handlers[Types.Messages.SHOWINAPPSTORE] = this.receiveInAppStore;
            this.handlers[Types.Messages.PURCHASE] = this.receivePurchase;
            this.handlers[Types.Messages.PLAYERSTATE] = this.receivePlayerState;

            this.useBison = false;

            this.enable();
        },

        enable: function() {
            this.isListening = true;
        },

        disable: function() {
            this.isListening = false;
        },

        connect: function() {

            var self = this,
                url = "ws://144.217.92.76:50526";
            //144.217.92.76
            this.connection = io(url, {
                forceNew: true,
                reconnection: false
                }
            );

            this.connection.on('connect_failed', function() {
                self.game.app.handleError('errorconnecting');
                self.game.started = false;
            });

            this.connection.on('connect_error', function() {
                self.game.app.handleError('errorconnecting');
                self.game.started = false;
            });

            this.connection.on('message', function(e) {
                switch(e) {
                    case 'go':
                        if (self.connected_callback)
                            self.connected_callback();
                        return;

                    case 'full':
                    case 'invalidlogin':
                    case 'userexists':
                    case 'loggedin':
                    case 'invalidusername':
                    case 'ban':
                    case 'passwordChanged':
                    case 'failedattempts':
                    case 'timeout':
                    case 'updated':
                        self.game.app.handleError(e);
                        self.game.started = false;
                        return;

                    default:
                        self.receiveMessage(e);
                        return;
                }

            });

            this.connection.on('error', function(e) {
                log.error("An error has occurred: " + e, true);
            });

            this.connection.on('disconnect', function() {
                $('#container').addClass('error');

                if(self.disconnected_callback) {
                    if(self.isTimeout)
                        self.disconnected_callback("You have been disconnected for being inactive for too long");
                    else
                        self.disconnected_callback("The connection to Tap Tap Adventure has been lost.");
                }
            });

        },

        sendMessage: function(json) {
            var data;
            if(this.connection.connected === true) {
                data = JSON.stringify(json);
                this.connection.send(data);
            }
        },

        receiveMessage: function(message) {
            var data, action;
            if (this.isListening) {
                data = JSON.parse(message);
                if (data instanceof Array) {
                    if (data[0] instanceof Array)
                        this.receiveActionBatch(data);
                    else
                        this.receiveAction(data);
                }
            }
        },

        receiveAction: function(data) {
            var action = data[0];

            if(this.handlers[action] && _.isFunction(this.handlers[action]))
                this.handlers[action].call(this, data);
        },

        receiveActionBatch: function(actions) {
            var self = this;

            _.each(actions, function(action) {
                self.receiveAction(action);
            });
        },

        receiveWelcome: function(data) {
            data.shift();

            var id = data.shift(),
                name = data.shift(),
                x = data.shift(),
                y = data.shift(),
                hp = data.shift(),
                armor = ItemTypes.getKindAsString(data.shift()),
                weapon = ItemTypes.getKindAsString(data.shift()),
                experience = data.shift(),
                mana = data.shift(),
                doubleExp = data.shift(),
                expMultiplier = data.shift(),
                membership = data.shift(),
                kind = data.shift(),
                rights = data.shift(),
                pClass = data.shift(),
                pendant = ItemTypes.getKindAsString(data.shift()),
                ring = ItemTypes.getKindAsString(data.shift()),
                boots = ItemTypes.getKindAsString(data.shift());


            var maxInventoryNumber = data.shift();
            var inventory = [];
            var inventoryNumber = [];
            var inventorySkillKind = [];
            var inventorySkillLevel = [];
            for(var i=0; i < maxInventoryNumber; ++i)
            {
                inventory.push(data.shift());
                inventoryNumber.push(data.shift());
                inventorySkillKind.push(data.shift());
                inventorySkillLevel.push(data.shift());
            }

            var maxBankNumber = data.shift();
            var bankKind = [];
            var bankNumber = [];
            var bankSkillKind = [];
            var bankSkillLevel = [];
            for(var i = 0; i < maxBankNumber; ++i) {
                bankKind.push(data.shift());
                bankNumber.push(data.shift());
                bankSkillKind.push(data.shift());
                bankSkillLevel.push(data.shift());
            }

            var maxAchievementNumber = data.shift();
            var achievementFound = [];
            var achievementProgress = [];
            for(var i = 0; i < maxAchievementNumber; i++) {
                achievementFound.push(data.shift());
                achievementProgress.push(data.shift());
            }

            if(this.welcome_callback) {
                this.welcome_callback(id, name, x, y, hp, mana, armor, weapon,
                    experience, inventory, inventoryNumber, maxInventoryNumber,
                    inventorySkillKind, inventorySkillLevel, maxBankNumber,
                    bankKind, bankNumber, bankSkillKind, bankSkillLevel,
                    maxAchievementNumber, achievementFound, achievementProgress, doubleExp,
                    expMultiplier, membership, kind, rights, pClass, pendant, ring, boots);
            }
        },

        receiveAchievement: function(data){
            data.shift();
            if(this.achievement_callback){
                this.achievement_callback(data);
            }
        },
        receiveInventory: function(data){
            var inventoryNumber = data[1];
            var itemKind = data[2];
            var itemCount = data[3];
            var itemSkillKind = data[4];
            var itemSkillLevel = data[5];
            if(this.inventory_callback){
                this.inventory_callback(inventoryNumber, itemKind, itemCount, itemSkillKind, itemSkillLevel);
            }
        },
        receiveTalkToNPC: function(data){
            var npcKind = data[1];
            var achievementId = data[2];
            var isCompleted = data[3];

            if(this.talkToNPC_callback){
                this.talkToNPC_callback(npcKind, achievementId, isCompleted);
            }
        },
        receiveMove: function(data) {
            var id = data[1],
                x = data[2],
                y = data[3];

            if(this.move_callback) {
                this.move_callback(id, x, y);
            }
        },

        receiveLootMove: function(data) {
            var id = data[1],
                item = data[2];

            if(this.lootmove_callback) {
                this.lootmove_callback(id, item);
            }
        },

        receiveAttack: function(data) {
            var attacker = data[1],
                target = data[2];

            if(this.attack_callback) {
                this.attack_callback(attacker, target);
            }
        },
        receiveParty: function (data) {
            data.shift();
            if(this.party_callback) {
                this.party_callback(data);
            }
        },
        receiveSpawn: function(data) {
            var id = data[1],
                kind = data[2],
                x = data[3],
                y = data[4],
                count = data[5];

            //log.info("data="+JSON.stringify(data));

            //if (!kind) return;

            if(ItemTypes.isItem(kind)) {
                var item = EntityFactory.createEntity(kind, id);
                item.count = count;
                if(this.spawn_item_callback) {
                    this.spawn_item_callback(item, x, y);
                }
            } else if(ItemTypes.isChest(kind)) {
                var item = EntityFactory.createEntity(kind, id);

                if(this.spawn_chest_callback) {
                    this.spawn_chest_callback(item, x, y);
                }
            } else {
                var name, orientation, target, weapon, armor, level, playerId, pClass;

                if(Types.isPlayer(kind)) {
                    name = data[5];
                    orientation = data[6];
                    armor = data[7];
                    weapon = data[8];
                    level = data[9];
                    pClass = data[10];
                    if(data.length > 10) {
                        target = data[10];
                    }
                }
                else if(MobData.Kinds[kind]) {
                    orientation = data[5];
                    if(data.length == 7) {
                        target = data[6];
                    }
                    if(data.length == 8) {
                        playerId = data[7];
                    }

                }
                else if (GatherData.Kinds[kind]) {
                    orientation = data[5];
                }

                var character = EntityFactory.createEntity(kind, id, name);

                if (character instanceof Pet) {
                    character.playerId = playerId;
                }
                if(character instanceof Player) {
                    character.weaponName = ItemTypes.getKindAsString(weapon);
                    character.spriteName = ItemTypes.getKindAsString(armor);
                    if (!character.spriteName)
                        character.spriteName = "clotharmor";
                    character.level = level;
                    character.setClass(pClass);
                }
                //log.info("character="+JSON.stringify(character));
                if(this.spawn_character_callback) {
                    this.spawn_character_callback(character, x, y, orientation, target, playerId);
                }
            }
        },

        receiveDespawn: function(data) {
            var id = data[1];

            if(this.despawn_callback)
                this.despawn_callback(id);

        },

        receiveHealth: function(data) {
            var points = data[1],
                isRegen = data[2],
                isPoison = data[3];


            if (this.health_callback)
                this.health_callback(points, isRegen ? isRegen : false, isPoison ? isPoison : false);
        },

        receiveMana: function(data) {
            var mana = data[1];

            if (this.mana_callback)
                this.mana_callback(mana);
        },

        receiveChat: function(data) {
            var id = data[1],
                text = data[2];

            if(this.chat_callback) {
                this.chat_callback(id, text);
            }
        },

        receiveEquipItem: function(data) {
            var id = data[1],
                itemKind = data[2];

            if(this.equip_callback) {
                this.equip_callback(id, itemKind);
            }
        },

        receiveDrop: function(data) {
            var mobId = data[1],
                id = data[2],
                kind = data[3],
                count = data[4],
                skillKind = data[5],
                skillLevel = data[6];

            var item = EntityFactory.createEntity(kind, id, '', skillKind, skillLevel);
            item.count = count;
            item.wasDropped = true;

            if(this.drop_callback)
                this.drop_callback(item, mobId);

        },

        receiveTeleport: function(data) {
            var id = data[1],
                x = data[2],
                y = data[3];

            if(this.teleport_callback) {
                this.teleport_callback(id, x, y);
            }
        },

        receiveDamage: function(data) {
            var id = data[1],
                dmg = data[2],
                hp = parseInt(data[3]),
                maxHp = parseInt(data[4]),
                playerId = data[5];

            if(this.dmg_callback)
                this.dmg_callback(id, dmg, hp, maxHp, playerId);
        },

        receivePopulation: function(data) {
            var worldPlayers = data[1],
                totalPlayers = data[2];

            if(this.population_callback) {
                this.population_callback(worldPlayers, totalPlayers);
            }
        },

        receiveKill: function(data) {
            var id = data[1];
            var level = data[2];
            var exp = data[3];


            if(this.kill_callback) {
                this.kill_callback(id, level, exp);
            }
        },

        receiveList: function(data) {
            data.shift();

            if(this.list_callback) {
                this.list_callback(data);
            }
        },

        receiveDestroy: function(data) {
            var id = data[1];

            if(this.destroy_callback) {
                this.destroy_callback(id);
            }
        },

        receivePoints: function(data) {
            var maxHp = data[1];
            var maxMana = data[2];
            var hp = data[3];
            var mp = data[4];

            log.info("Got Player Points.");

            if(this.points_callback) {
                this.points_callback(maxHp, maxMana, hp, mp);
            }
        },

        receiveBlink: function(data) {
            var id = data[1];

            if(this.blink_callback)
                this.blink_callback(id);

        },
        receivePVP: function(data){
            var pvp = data[1];
            if(this.pvp_callback){
                this.pvp_callback(pvp);
            }
        },

        receiveGameFlag: function(data) {
            var gameFlag = data[1];

            if (this.gameFlag_callback)
                this.gameFlag_callback(gameFlag);
        },
        
        receiveDoor: function(data) {
            var x = data[1],
                y = data[2],
                orientation = data[3],
                playerId = data[4];

            if (this.door_callback)
                this.door_callback(x, y, orientation, playerId);
        },

        receiveMinigameData: function(data) {
            if (this.minigameData_callback)
                this.minigameData_callback(data[1], data[2], data[3]);
        },

        receiveTeam: function(data) {
            if (this.team_callback)
                this.team_callback(data[1], data[2])
        },

        receiveStop: function(data) {
            if (this.stop_callback)
                this.stop_callback(data[1], data[2], data[3]);
        },

        receiveAd: function(data) {
            if (this.ad_callback)
                this.ad_callback(data[1]);
        },

        receiveCamera: function(data) {
            if (this.camera_callback)
                this.camera_callback(data[1]);

        },

        receiveInstructions: function(data) {
            if (this.instructions_callback)
                this.instructions_callback(data[1]);
        },

        receiveInAppStore: function(data) {
            if (this.inappstore_callback)
                this.inappstore_callback(data[1], data[2]);
        },

        receivePurchase: function(data) {
            if (this.purchase_callback)
                this.purchase_callback(data[1]);
        },

        receivePlayerState: function(data) {
            if (this.state_callback)
                this.state_callback(data[1]);
        },

        receiveRanking: function(data){
            data.shift();
            if(this.ranking_callback){
                this.ranking_callback(data);
            }
        },
        receiveBoard: function(data){
            if(this.board_callback){
                this.board_callback(data);
            }
        },

        receiveNotify: function(data){
            var msg = data[1];
            if(this.notify_callback){
                this.notify_callback(msg);
            }
        },
        receiveKung: function(data){
            var msg = data[1];
            if(this.kung_callback){
                this.kung_callback(msg);
            }
        },
        receiveDoubleEXP: function(data) {
            var msg = data[1];
            if (this.doubleexp_callback) {
                this.doubleexp_callback(msg);
            }
        },
        receiveEXPMultiplier: function(data) {
            var msg = data[1];
            //You're only sending and receiving a damn integer
            if (this.expmultiplier_callback) {
                this.expmultiplier_callback(msg);
            }
        },
        receiveMembership: function(data) {
            var msg = data[1];
            if (this.membership_callback) {
                this.membership_callback(msg);
            }
        },
        receiveSkill: function(data){
            data.shift();
            if(this.skill_callback){
                this.skill_callback(data);
            }
        },
        receiveSkillInstall: function(data) {
            if(this.skillInstall_callback) {
                data.shift();
                this.skillInstall_callback(data);
            }
        },
        receiveSkillLoad: function(data) {
            if(this.skillLoad_callback) {
                data.shift();
                this.skillLoad_callback(data);
            }
        },

        receiveCharacterInfo: function(data) {
            if(this.characterInfo_callback) {
                data.shift();
                this.characterInfo_callback(data);
            }
        },
        receiveShop: function(data){
            data.shift();
            if(this.shop_callback){
                this.shop_callback(data);
            }
        },
        receiveAuction: function(data){
            data.shift();
            if(this.auction_callback){
                this.auction_callback(data);
            }
        },
        receiveWanted: function (data) {
            var id = data[1],
                isWanted = data[2];
            if(this.wanted_callback) {
                this.wanted_callback(id, isWanted);
            }
        },

        receivePartyInvite: function(data) {
            if(this.partyInvite_callback) {
                this.partyInvite_callback(data[1]);
            }
        },

        receiveBank: function (data) {
            var bankNumber = data[1],
                itemKind = data[2],
                itemNumber = data[3],
                itemSkillKind = data[4],
                itemSkillLevel = data[5];

            if(this.bank_callback) {
                this.bank_callback(bankNumber, itemKind, itemNumber,
                    itemSkillKind, itemSkillLevel);
            }
        },

        receiveClassSwitch: function(data) {
            if(this.classSwitch_callback) {
                this.classSwitch_callback(data[1]);
            }
        },

        receivePoison: function(data) {
            if (this.poison_callback)
                this.poison_callback(data[1]);
        },

        receiveInterface: function(data) {
            var interfaceId = data[1];
            if (this.interface_callback)
                this.interface_callback(interfaceId);
        },

        receiveGraphicNotification: function(data) {
            var message = data[1];
            if (this.graphic_callback)
                this.graphic_callback(message);
        },

        receiveForceCast: function(data) {
            var castType = data[1];

            if (this.forceCast_callback)
                this.forceCast_callback(castType);
        },

        receiveProjectile: function(data) {
            var id = data[1],
                projectileType = data[2],
                sx = data[3],
                sy = data[4],
                x = data[5],
                y = data[6],
                owner = data[7],
                mobOwner = data[8];


            if (this.projectile_callback)
                this.projectile_callback([id, projectileType, sx, sy, x, y, owner, mobOwner]);
        },

        receiveData: function(data) {
            var attackSpeed = data[1],
                moveSpeed = data[2],
                walkSpeed = data[3],
                idleSpeed = data[4],
                attackRate = data[5];

            if (this.chardata_callback)
                this.chardata_callback(attackSpeed, moveSpeed, walkSpeed, idleSpeed, attackRate);
        },

        onDispatched: function(callback) {
            this.dispatched_callback = callback;
        },

        onConnected: function(callback) {
            this.connected_callback = callback;
        },

        onDisconnected: function(callback) {
            this.disconnected_callback = callback;
        },

        onWelcome: function(callback) {
            this.welcome_callback = callback;
        },

        onSpawnCharacter: function(callback) {
            this.spawn_character_callback = callback;
        },

        onSpawnItem: function(callback) {
            this.spawn_item_callback = callback;
        },

        onSpawnChest: function(callback) {
            this.spawn_chest_callback = callback;
        },

        onDespawnEntity: function(callback) {
            this.despawn_callback = callback;
        },

        onEntityMove: function(callback) {
            this.move_callback = callback;
        },

        onEntityAttack: function(callback) {
            this.attack_callback = callback;
        },

        onPlayerChangeHealth: function(callback) {
            this.health_callback = callback;
        },

        onPlayerEquipItem: function(callback) {
            this.equip_callback = callback;
        },

        onPlayerMoveToItem: function(callback) {
            this.lootmove_callback = callback;
        },

        onPlayerTeleport: function(callback) {
            this.teleport_callback = callback;
        },

        onChatMessage: function(callback) {
            this.chat_callback = callback;
        },

        onDropItem: function(callback) {
            this.drop_callback = callback;
        },

        onPlayerDamageMob: function(callback) {
            this.dmg_callback = callback;
        },

        onPlayerKillMob: function(callback) {
            this.kill_callback = callback;
        },

        onPopulationChange: function(callback) {
            this.population_callback = callback;
        },

        onEntityList: function(callback) {
            this.list_callback = callback;
        },

        onEntityDestroy: function(callback) {
            this.destroy_callback = callback;
        },

        onPlayerPoints: function(callback) {
            this.points_callback = callback;
        },

        onItemBlink: function(callback) {
            this.blink_callback = callback;
        },
        onPVPChange: function(callback){
            this.pvp_callback = callback;
        },
        onPVPGame: function(callback) {
            this.pvpGame_callback = callback;
        },
        onGameFlag: function(callback) {
            this.gameFlag_callback = callback;
        },
        onDoor: function(callback) {
            this.door_callback = callback;
        },
        onMinigameData: function(callback) {
            this.minigameData_callback = callback;
        },
        onTeam: function(callback) {
            this.team_callback = callback;
        },
        onStop: function(callback) {
            this.stop_callback = callback;
        },
        onAd: function(callback) {
            this.ad_callback = callback; 
        },
        onCamera: function(callback) {
            this.camera_callback = callback;
        },
        onInstructions: function(callback) {
            this.instructions_callback = callback;
        },
        onInAppStore: function(callback) {
            this.inappstore_callback = callback;  
        },
        onPurchase: function(callback) {
            this.purchase_callback = callback;
        },
        onPlayerState: function(callback) {
            this.state_callback = callback;
        },
        onNotify: function(callback){
            this.notify_callback = callback;
        },
        onMana: function(callback) {
            this.mana_callback = callback;
        },
        onAchievement: function(callback) {
            this.achievement_callback = callback;
        },
        onTalkToNPC: function(callback) {
            this.talkToNPC_callback = callback;
        },
        onParty: function (callback) {
            this.party_callback = callback;
        },
        onRanking: function (callback) {
            this.ranking_callback = callback;
        },
        onInventory: function(callback) {
            this.inventory_callback = callback;
        },
        onDoubleEXP: function(callback) {
            this.doubleexp_callback = callback;
        },
        onEXPMultiplier: function(callback) {
            this.expmultiplier_callback = callback;
        },
        onMembership: function(callback) {
            this.membership_callback = callback;
        },
        onSkill: function (callback) {
            this.skill_callback = callback;
        },
        onSkillInstall: function(callback) {
            this.skillInstall_callback = callback;
        },
        onSkillLoad: function(callback) {
            this.skillLoad_callback = callback;
        },

        onCharacterInfo: function(callback) {
            this.characterInfo_callback = callback;
        },
        onShop: function (callback) {
            this.shop_callback = callback;
        },
        onAuction: function (callback) {
            this.auction_callback = callback;
        },

        onWanted: function (callback) {
            this.wanted_callback = callback;
        },
        onBank: function (callback) {
            this.bank_callback = callback;
        },

        onPartyInvite: function (callback) {
            this.partyInvite_callback = callback;
        },

        onClassSwitch: function (callback) {
            this.classSwitch_callback = callback;
        },

        onCharData: function(callback) {
            this.chardata_callback = callback;
        },

        onPoison: function(callback) {
            this.poison_callback = callback;
        },

        onInterface: function(callback) {
            this.interface_callback = callback;
        },

        onGraphicNotification: function(callback) {
            this.graphic_callback = callback;
        },

        onForceCast: function(callback) {
            this.forceCast_callback = callback;
        },

        onProjectile: function(callback) {
            this.projectile_callback = callback;
        },

        sendPartyInvite: function(playerId, status) { // 0 for request, 1, for yes, 2 for no.
            this.sendMessage([Types.Messages.PARTYINVITE,
                playerId, status]);
        },

        sendPartyLeave: function(playerId) {
            this.sendMessage([Types.Messages.PARTYLEAVE]);
        },

        sendPartyLeader: function(playerId) {
            this.sendMessage([Types.Messages.PARTYLEADER,
                playerId]);
        },

        sendPartyKick: function(playerId) {
            this.sendMessage([Types.Messages.PARTYKICK,
                playerId]);
        },

        sendCreate: function(player) {
            this.sendMessage([Types.Messages.CREATE,
                player.name,
                player.pw,
                player.email,
                player.pClass]);
        },

        sendLogin: function(player) {
            this.sendMessage([Types.Messages.LOGIN,
                player.name,
                player.pw]);
        },

        sendNewPassword: function(username, pw, newpw) {
            this.sendMessage([Types.Messages.NEWPASSWORD,
                username,
                pw,
                newpw]);
            //alert("sendNewPassword");
        },

        sendCastSpell: function(projectile, sx, sy, x, y) {
            this.sendMessage([Types.Messages.CAST, projectile, sx, sy, x, y]);
        },

        sendMove: function(x, y) {
            this.sendMessage([Types.Messages.MOVE,
                x,
                y]);
        },

        // future move 1 for planned, 2 for arrived.
        sendMoveEntity: function(entity) {
            this.sendMessage([Types.Messages.MOVEENTITY,
                entity.id,
                entity.gridX,
                entity.gridY,
                2]);
        },

        sendStep: function(entity) {
            this.sendMessage([Types.Messages.STEP, entity.id, entity.gridX, entity.gridY]);
        },

        // future move 1 for planned, 2 for arrived.
        sendMoveEntity2: function(id, gridX, gridY, future) {
            this.sendMessage([Types.Messages.MOVEENTITY,
                id,
                gridX,
                gridY,
                future]);
        },

        sendLootMove: function(item, x, y) {
            this.sendMessage([Types.Messages.LOOTMOVE,
                x,
                y,
                item.id]);
        },

        sendAggro: function(mob) {
            this.sendMessage([Types.Messages.AGGRO,
                mob.id]);
        },

        sendAttack: function(mob) {
            this.sendMessage([Types.Messages.ATTACK,
                mob.id]);
        },

        sendHit: function(mob) {
            this.sendMessage([Types.Messages.HIT,
                mob.id]);
        },

        sendDetermineHit: function(player, mob) {
            this.sendMessage([Types.Messages.DETERMINEHIT, mob.id, mob.x, mob.y, player.x, player.y]);
        },
        
        sendArcherHit: function(mob) {
            
        },

        sendSpellHit: function(mob, spellType) {
            this.sendMessage([Types.Messages.SPELLHIT, mob.id, spellType]);
        },

        sendChat: function(text) {
            this.sendMessage([Types.Messages.CHAT,
                text]);
        },

        sendLoot: function(item) {
            this.sendMessage([Types.Messages.LOOT,
                item.id]);
        },

        sendTeleport: function(id, x, y) {
            this.sendMessage([Types.Messages.TELEPORT,
                id,
                x,
                y]);
        },

        sendZone: function() {
            this.sendMessage([Types.Messages.ZONE]);
        },

        sendOpen: function(chest) {
            this.sendMessage([Types.Messages.OPEN,
                chest.id]);
        },

        sendCheck: function(id) {
            this.sendMessage([Types.Messages.CHECK,
                id]);
        },

        sendWho: function(ids) {
            ids.unshift(Types.Messages.WHO);
            this.sendMessage(ids);
        },
        sendTalkToNPC: function(kind, achievementId){
            this.sendMessage([Types.Messages.TALKTONPC,
                kind, achievementId]);
        },
        sendMagic: function(magicName, target){
            this.sendMessage([Types.Messages.MAGIC,
                magicName, target]);
        },
        sendBoard: function(command, number, replynumber){
            this.sendMessage([Types.Messages.BOARD,
                command,
                number,
                replynumber]);
        },
        sendBoardWrite: function(command, title, content){
            this.sendMessage([Types.Messages.BOARDWRITE,
                command,
                title,
                content]);
        },
        sendKung: function(word) {
            this.sendMessage([Types.Messages.KUNG,
                word]);
        },
        sendRanking: function(command){

            this.sendMessage([Types.Messages.RANKING, command]);
        },
        sendAchievement: function(id, type){

            this.sendMessage([Types.Messages.ACHIEVEMENT, id, type]);
        },
        sendInventory: function(type, inventoryNumber, count){

            this.sendMessage([Types.Messages.INVENTORY, type, inventoryNumber, count]);
        },
        sendDoubleEXP: function(enabled) {

            this.sendMessage([Types.Messages.DOUBLE_EXP, enabled]);
        },
        sendEXPMultiplier: function(times) {

            this.sendMessage([Types.Messages.EXP_MULTIPLIER, times]);
        },
        sendMembership: function(hasMembership) {

            this.sendMessage([Types.Messages.MEMBERSHIP, hasMembership]);
        },
        
        sendSkill: function(type, targetId){

            this.sendMessage([Types.Messages.SKILL, type, targetId]);
        },
        sendSkillInstall: function(index, name) {

            this.sendMessage([Types.Messages.SKILLINSTALL, index, name]);
        },
        sendSkillLoad: function() {
            this.sendMessage([Types.Messages.SKILLLOAD]);
        },

        sendCharacterInfo: function() {
            this.sendMessage([Types.Messages.CHARACTERINFO]);
        },
        sendSell: function(inventoryNumber, count){
            this.sendMessage([Types.Messages.SELL,
                inventoryNumber,
                count]);
        },
        sendShop: function(command, number){
            this.sendMessage([Types.Messages.SHOP,
                command,
                number]);
        },
        sendBuy: function(number, itemKind, goldCount){
            this.sendMessage([Types.Messages.BUY,
                number,
                itemKind,
                goldCount]);
        },
        sendStoreSell: function(inventoryNumber) {
            this.sendMessage([Types.Messages.STORESELL, inventoryNumber]);
        },
        sendStoreBuy: function(itemType, itemKind, itemCount) {
            this.sendMessage([Types.Messages.STOREBUY, itemType, itemKind, itemCount]);
        },

        sendAuctionOpen: function(type) {
            this.sendMessage([Types.Messages.AUCTIONOPEN, type]);
        },
        sendAuctionSell: function(inventoryNumber, sellValue) {
            this.sendMessage([Types.Messages.AUCTIONSELL, inventoryNumber, sellValue]);
        },
        sendAuctionBuy: function(index) {
            this.sendMessage([Types.Messages.AUCTIONBUY, index]);
        },
        sendAuctionDelete: function(index) {
            this.sendMessage([Types.Messages.AUCTIONDELETE, index]);
        },

        sendStoreEnchant: function(inventoryNumber) {
            this.sendMessage([Types.Messages.STOREENCHANT, inventoryNumber]);
        },
        sendBankStore: function(inventoryNumber) {
            this.sendMessage([Types.Messages.BANKSTORE, inventoryNumber]);
        },
        sendBankRetrieve: function(inventoryNumber) {
            this.sendMessage([Types.Messages.BANKRETRIEVE, inventoryNumber]);
        },
        sendHasFocus: function(flag) {
            //log.info("Skipping has focus.");
            //this.sendMessage([Types.Messages.CLIENTFOCUS, flag]);
        },
        sendAddSpawn: function (id, x, y) {
            this.sendMessage([Types.Messages.ADDSPAWN, id, x, y]);
        },

        sendSaveSpawns: function () {
            this.sendMessage([Types.Messages.SAVESPAWNS]);
        },
        sendPetCreate: function (targetId, kind) {
            this.sendMessage([Types.Messages.PETCREATE, targetId, kind]);
        },
        sendClassSwitch: function (pClass) {
            this.sendMessage([Types.Messages.CLASSSWITCH, pClass]);
        },
        sendGather: function (id) {
            this.sendMessage([Types.Messages.GATHER, id]);
        },
        sendCraft: function (id) {
            this.sendMessage([Types.Messages.CRAFT, id]);
        },

        sendDeath: function(id) {
            this.sendMessage([Types.Messages.DEATH, id]);
        },

        requestWarp: function(id) {
            this.sendMessage([Types.Messages.REQUESTWARP, id]);
        },

        sendReady: function(id) {
            this.sendMessage([Types.Messages.PLAYERREADY, id]);
        },

        sendDoor: function(toX, toY, orientation) {
            this.sendMessage([Types.Messages.DOOR, toX, toY, orientation]);
        },

        sendRespawn: function(id) {
            this.sendMessage([Types.Messages.RESPAWN, id]);
        },

        sendDoorRequest: function(doorX, doorY, toX, toY, orientation) {
            this.sendMessage([Types.Messages.DOORREQUEST, doorX, doorY, toX, toY, orientation]);
        }
    });

    return GameClient;
});
