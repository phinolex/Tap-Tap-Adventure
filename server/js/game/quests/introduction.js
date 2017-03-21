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
        self.lastNpcTalk = null;
        self.progressTimeout = null;
        self.ratIds = [72784, 72783, 72782, 72781, 72780, 72779];
        self.skeletonIds = [7356, 7360, 7351];
        
        self.load();

        self.onFinishedLoading(function() {
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


            /**
             * Convert these two callbacks into an
             * inventory callback in the Packet Handler.
             * If necessary that is.
             */

            self.player.onEquipWeapon(function(itemKind) {
                if (self.checkProgress(itemKind))
                    self.forceTalk();
            });

            self.player.onHealPotion(function(itemKind) {
                self.checkProgress(itemKind);
            });

            self.player.packetHandler.onKillMob(function(mob) {
                log.info('Mob Killed: ' + mob.id);
                
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

                    log.info('Update pointer here.');

                    //self.setRatPointer();

                } else if (self.stage == 13) {

                    self.skeletonIds.splice(self.skeletonIds.indexOf(mob.id), 1);

                    if (self.killCount >= 3) {
                        self.checkProgress('kill');
                        return;
                    }

                    log.info('Update pointer here.');
                    //self.setSkeletonPointer();
                }
            });

            self.player.packetHandler.onTalkToNPC(function(npcKind, npcId, talkIndex) {
                log.info('Received NPC Talk: ' + npcKind + ' id: ' + npcId + ' index: ' + talkIndex);

                if (self.progressTimeout)
                    return;

                var conversation = self.getConversation(npcKind);

                self.server.pushToPlayer(self.player, new Messages.TalkToNPC(npcId, conversation));
                self.lastNpcTalk = npcId;

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

                if (self.stage < 5 || self.currentTask != 'door') {
                    self.teleport(doorX, doorY, orientation, false);
                    self.notify('You are not allowed to go through the door right now.');
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
                var withTimeout = false;

                if (self.stage == 7)
                    self.player.inventory.add(60, 1);
                else if (self.stage == 9)
                    self.server.pushToPlayer(self.player, new Messages.Task('Kill five rats!', self.killCount, 5, true));
                else if (self.stage == 11)
                    self.player.forcefullyTeleport(82, 43, Utils.random(1, 4));
                else if (self.stage == 12) {
                    self.player.inventory.add(224, 1);
                    self.server.pushToPlayer(self.player, new Messages.Task('Kill three skeletons', self.killCount, 3, true));
                } else if (self.stage == 14)
                    self.player.forcefullyTeleport(38, 20, Utils.random(1, 4));
                else if (self.stage == 15) {
                    self.damagePlayer(self.player.hitPoints - 1);
                    withTimeout = true;
                } else if (self.stage == 16)
                    self.player.inventory.add(35, 1);

                self.nextStage(withTimeout);

                return true;

            case 'kill':

                self.killCount = 0;
                self.server.pushToPlayer(self.player, new Messages.Task(null, 0, 0, false));

                self.nextStage();

                return true;

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
            pointerData = self.jsonData.pointers[self.stage];

        if (!pointerData)
            return;

        var pointerType = pointerData[0];

        if (pointerType > 3)
            pointerType = 0;

        switch(pointerType) {

            case 'm':
                self.setRatPointer();
                break;

            case 'a':
                self.setSkeletonPointer();
                break;

            default:

                var id = self.player.id + '' + Utils.random(0, 500),
                    data = [id];

                for (var i = 1; i < pointerData.length; i++)
                    data.push(pointerData[i]);

                self.server.pushToPlayer(self.player, new Messages.Pointer(pointerType, data));

                break;

        }
    },

    setRatPointer: function() {
        var self = this,
            randomIndex = Utils.randomInt(0, self.ratIds.length);

        log.info('Setting rat pointer: ' + self.ratIds[randomIndex]);

        self.server.pushToPlayer(self.player, new Messages.Pointer(Types.Pointers.Entity, [self.ratIds[randomIndex]]));
    },

    setSkeletonPointer: function() {
        var self = this,
            randomIndex = Utils.randomInt(0, self.skeletonIds.length);

        log.info('Setting skeleton pointer: ' + self.skeletonIds[randomIndex]);

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

    nextStage: function(withTimeout) {
        var self = this;

        if (self.progressTimeout)
            return;

        self.clearPointers();

        self.progressTimeout = setTimeout(function() {
            self.stage++;
            self.killCount = 0;
            self.currentTask = self.jsonData.task[self.stage];

            self.update();
            self.setPointer();

            self.progressTimeout = null;

        }, withTimeout ? 1500 : 1);

    },

    setKillCount: function(count) {
        var self = this,
            message = '',
            goal = 0;

        if (self.stage == 10) {
            message = 'Kill five rats!';
            goal = 5;
        } else if (self.stage == 13) {
            message = 'Kill three skeletons!';
            goal = 3;
        }

        self.killCount = count;

        self.server.pushToPlayer(self.player, new Messages.Task(message, self.killCount, goal, true));
    },

    forceTalk: function(messageData, npcId) {
        var self = this;

        self.server.pushToPlayer(self.player, new Messages.TalkToNPC(npcId, messageData));
        self.resetTalkIndex(npcId);
    },

    damagePlayer: function(damage) {
        this.player.hitPoints -= damage;
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