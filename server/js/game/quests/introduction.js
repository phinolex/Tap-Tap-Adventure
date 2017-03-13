/**
 * Created by flavius on 2017-01-07.
 */
var Quest = require('./quest'),
    Messages = require('../network/packets/message'),
    Types = require('../../../../shared/js/gametypes'),
    Utils = require('../utils/utils');

module.exports = Introduction = Quest.extend({
    init: function(jsonData, player) {
        var self = this;

        self._super(jsonData.id, jsonData.name, jsonData.name);
        
        self.jsonData = jsonData;
        self.player = player;
        self.server = self.player.server;
        self.killCount = 0;
        self.displayTask = false;
        self.currentTask = '';
        self.ratIds = [72772, 72773, 72774, 72775, 72776, 72777];
        self.skeletonIds = [];
        
        self.load();

        self.onFinishedLoading(function() {
            if (self.server.development) {
                self.setStage(0);
                self.player.forcefullyTeleport(15, 555, 2);
            }

            if (self.stage == 9999)
                return;

            if (self.stage <= 10)
                self.toggleTalking();

            self.currentTask = self.jsonData.task[self.stage];

            setTimeout(function() {
                self.setPointer();

                if (self.currentTask == 'kill') {
                    if (self.stage == 10)
                        self.server.pushToPlayer(self.player, new Messages.Task('Kill five rats!', self.killCount, 5, true));
                    else if (self.stage == 13)
                        self.server.pushToPlayer(self.player, new Messages.Task('Kill three skeletons', self.killCount, 3, true));
                }

            }, 100);


            self.player.onEquipWeapon(function(itemKind) {

                if (self.checkProgress(itemKind))
                    self.forceTalk();

                self.checkProgress(itemKind);
            });

            self.player.packetHandler.onKillMob(function(mob) {
                
                if (self.currentTask != 'kill')
                    return;
                
                self.clearPointers();
                self.setKillCount(self.killCount + 1);

                if (self.stage == 10) {

                    self.ratIds.splice(self.ratIds.indexOf(mob.id), 1);

                    if (self.killCount >= 5) {
                        self.checkProgress('kill');
                        return;
                    }

                    self.setRatPointer();

                } else if (self.stage == 13) {

                    self.skeletonIds.splice(self.skeletonIds.indexOf(mob.id), 1);

                    if (self.killCount >= 3) {
                        self.checkProgress('kill');
                        return;
                    }

                    self.setSkeletonPointer();
                }
            });

            self.player.packetHandler.onTalkToNPC(function(npcKind, npcId, talkIndex) {
                log.info('Received NPC Talk: ' + npcKind + ' id: ' + npcId + ' index: ' + talkIndex);

                var conversation = self.getConversation(npcKind);

                self.server.pushToPlayer(self.player, new Messages.TalkToNPC(npcId, conversation));

                if (conversation && talkIndex >= conversation.length) {
                    self.resetTalkIndex(npcId);
                    self.checkProgress('talk');
                }
            });
            
            self.player.packetHandler.onAttack(function(entityId) {

                if (self.stage < 10) {
                    self.notify('Hang on! You do not know how to fight yet..');
                    return;
                }

                self.server.pushToPlayer(self.player, new Messages.AttackLink(entityId));
                self.player.setTarget(self.server.getEntityById(entityId));
                self.server.broadcastAttacker(self.player);
            });

            self.player.packetHandler.onDoorRequest(function(doorX, doorY, toX, toY, orientation) {
                log.info('Received door: ' + doorX + ' y: ' + doorY);

                if (self.stage < 5) {
                    self.teleport(doorX, doorY, orientation, false);
                    self.notify('You are not allowed to leave the starting area yet.');
                    return;
                }

                var doorData = self.getDoorData();

                if (doorData[0] == doorX && doorData[1] == doorY)
                    self.checkProgress('door');

                self.teleport(toX, toY, orientation, true);
            });

            self.player.packetHandler.onButtonClick(function(buttonId, state) {

                /**
                 * TODO: Make it so when a player is tasked with equipping the sword, the
                 * pointer is dyanmic and switches to point to the sword in the inventory.
                 * Perhaps not necessary, but it makes the tutorial much nicer.
                 */

                if (!state)
                    return;

                switch (buttonId) {
                    case 'characterButton':
                        
                        if (self.stage == 1) {
                            self.checkProgress('click');
                            self.forceTalk(['This is the character menu'], 814554);
                        }
                        
                        break;
                    
                    case 'inventoryButton':

                        if (self.stage == 3) {
                            self.checkProgress('click');
                            self.forceTalk(['Here you can store items such as weapons and armours!'], 814554);
                        }

                        break;
                }
            });
        });
    },

    load: function() {
        var self = this;


        self.player.redisPool.getQuestStage(self.player.name, self.getId(), function(stage) {

            if (!stage)
                self.update();
            else
                self.stage = stage;

            if (self.finished_callback)
                self.finished_callback();
        });
    },

    checkProgress: function(action) {
        var self = this,
            task = self.jsonData.task[self.stage];

        if (action != task)
            return false;
        
        self.currentTask = action;

        switch (action) {

            case 'talk':

                if (self.stage == 7)
                    self.player.inventory.putInventory(60, 1);
                else if (self.stage == 9)
                    self.server.pushToPlayer(self.player, new Messages.Task('Kill five rats!', self.killCount, 5, true));
                else if (self.stage == 11)
                    self.player.forcefullyTeleport(82, 43, Utils.random(1, 4));
                else if (self.stage == 12) {
                    self.player.inventory.putInventory(224, 1);
                    self.server.pushToPlayer(self.player, new Messages.Task('Kill three skeletons', self.killCount, 3, true));
                }

                self.nextStage();

                return true;

            case 'kill':

                self.killCount = 0;
                self.server.pushToPlayer(self.player, new Messages.Task(null, 0, 0, false));

                self.nextStage();

                break;

            default:
                self.nextStage();
                return true;
        }
    },

    toggleTalking: function() {
        this.player.talkingAllowed = !this.player.talkingAllowed;
    },
    
    update: function() {
        var self = this;

        self.player.redisPool.setQuestStage(self.player.name, self.getId(), self.stage);
    },

    clearPointers: function() {
        var self = this;

        self.server.pushToPlayer(self.player, new Messages.Pointer(Types.Pointers.Clear, null));
    },

    resetTalkIndex: function(npcId) {
        var self = this;
        
        self.server.pushToPlayer(self.player, new Messages.TalkIndex(npcId, 0));
    },
    
    setPointer: function() {
        var self = this,
            pointerData = self.jsonData.pointers[self.stage],
            pointerType = pointerData.shift();

        switch (pointerType) {
            case 'm':
                self.setRatPointer();
                break;

            case 'a':
                self.setSkeletonPointer();
                break;

            default:
                var id = self.player.id + '' + Utils.random(0, 500),
                    data = [];

                data.push(id);

                for (var i = 0; i < pointerData.length; i++)
                    data.push(pointerData[i]);

                self.server.pushToPlayer(self.player, new Messages.Pointer(pointerType, data));
                break;
        }
    },

    setRatPointer: function() {
        var self = this,
            randomIndex = Utils.randomInt(0, self.ratIds.length);

        log.info('index: ' + randomIndex);

        self.server.pushToPlayer(self.player, new Messages.Pointer(Types.Pointers.Entity, [self.ratIds[randomIndex]]));
    },

    setSkeletonPointer: function() {
        var self = this,
            randomIndex = Utils.randomInt(0, self.skeletonIds.length);

        self.server.pushToPlayer(self.player, new Messages.Pointer(Types.Pointers.Entity, [self.skeletonIds[randomIndex]]));
    },

    getConversation: function(npcKind) {
        return this.jsonData.conversations[npcKind][this.stage];
    },

    getDoorData: function() {
        var self = this,
            doorData = self.jsonData.doors[self.stage];

        return doorData ? doorData : [-1, -1];
    },

    nextStage: function() {
        var self = this;

        self.stage++;
        self.killCount = 0;

        self.clearPointers();
        self.update();

        self.setPointer();
    },

    setKillCount: function(count) {
        var self = this;

        self.killCount = count;

        self.server.pushToPlayer(self.player, new Messages.Task('Kill five rats!', self.killCount, 5, true));
    },

    forceTalk: function(messageData, npcId) {
        var self = this;

        self.server.pushToPlayer(self.player, new Messages.TalkToNPC(npcId, messageData));
    },

    notify: function(message) {
        var self = this;

        self.server.pushToPlayer(self.player, new Messages.GuiNotify(message));
    },

    teleport: function(x, y, orientation) {
        var self = this;

        self.server.pushToPlayer(self.player, new Messages.Stop(x, y, orientation));
    },

    setStage: function(stage) {
        var self = this;

        self.clearPointers();
        self.stage = stage;
        self.update();
        self.setPointer();
    },

    onFinishedLoading: function(callback) {
        this.finished_callback = callback;
    }
});