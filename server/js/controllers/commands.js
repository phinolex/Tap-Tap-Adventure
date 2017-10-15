/* global log */

var cls = require('../lib/class'),
    Messages = require('../network/messages'),
    Packets = require('../network/packets'),
    Utils = require('../util/utils'),
    Mob = require('../game/entity/character/mob/mob');

module.exports = Commands = cls.Class.extend({

    init: function(player) {
        var self = this;

        self.world = player.world;
        self.player = player;
    },

    parse: function(rawText) {
        var self = this,
            blocks = rawText.substring(1).split(' ');

        if (blocks.length < 1)
            return;

        var command = blocks.shift();

        self.handlePlayerCommands(command, blocks);

        if (self.player.rights > 0)
            self.handleModeratorCommands(command, blocks);

        if (self.player.rights > 1)
            self.handleAdminCommands(command, blocks);
    },

    handlePlayerCommands: function(command, blocks) {
        var self = this;

        switch(command) {

            case 'players':

                self.player.send(new Messages.Notification(Packets.NotificationOpcode.Text, 'There are currently ' + self.world.playerCount + ' online.'))

                break;

            case 'tutstage':

                log.info(self.player.getTutorial().stage);

                break;

            case 'coords':

                self.player.send(new Messages.Notification(Packets.NotificationOpcode.Text, 'x: ' + self.player.x + ' y: ' + self.player.y));

                break;

            case 'progress':

                var tutorialQuest = self.player.getTutorial();

                self.player.send(new Messages.Quest(Packets.QuestOpcode.Progress, {
                    id: tutorialQuest.id,
                    stage: tutorialQuest.stage
                }));

                break;

            case 'global':

                self.world.pushBroadcast(new Messages.Chat({
                    name: self.player.username,
                    text: blocks.join(' '),
                    isGlobal: true,
                    withBubble: false,
                    colour: 'rgba(191, 191, 63, 1.0)'
                }));

                break;

        }
    },

    handleModeratorCommands: function(command, blocks) {
        var self = this;

        switch (command) {

            case 'mute':
            case 'ban':

                var duration = blocks.shift(),
                    targetName = blocks.join(' '),
                    user = self.world.getPlayerByName(targetName);

                if (!user)
                    return;

                if (!duration)
                    duration = 24;

                var timeFrame = new Date().getTime() + duration * 60 * 60;

                if (command === 'mute')
                    user.mute = timeFrame;
                else if (command === 'ban') {
                    user.ban = timeFrame;
                    user.save();

                    user.sendUTF8('ban');
                    user.connection.close('banned');
                }

                user.save();

                break;

            case 'unmute':

                var uTargetName = blocks.join(' '),
                    uUser = self.world.getPlayerByName(uTargetName);

                if (!uTargetName)
                    return;

                uUser.mute = new Date().getTime() - 3600;

                uUser.save();

                break;

        }

    },

    handleAdminCommands: function(command, blocks) {
        var self = this;

        switch (command) {

            case 'spawn':

                var spawnId = parseInt(blocks.shift()),
                    count = parseInt(blocks.shift()),
                    ability = parseInt(blocks.shift()),
                    abilityLevel = parseInt(blocks.shift());

                if (!spawnId || !count)
                    return;

                self.player.inventory.add({
                    id: spawnId,
                    count: count,
                    ability: ability ? ability : -1,
                    abilityLevel: abilityLevel ? abilityLevel : -1
                });

                return;

            case 'maxhealth':

                self.player.notify('Max health is ' + self.player.hitPoints.getMaxHitPoints());

                break;

            case 'ipban':

                return;

            case 'drop':

                var id = parseInt(blocks.shift()),
                    dCount = parseInt(blocks.shift());

                if (!id)
                    return;

                if (!dCount)
                    dCount = 1;

                self.world.dropItem(id, dCount, self.player.x, self.player.y);

                return;

            case 'ghost':

                self.player.equip('ghost', 1, -1, -1);

                return;

            case 'notify':

                self.player.notify('Hello!!!');

                break;

            case 'teleport':

                var x = parseInt(blocks.shift()),
                    y = parseInt(blocks.shift());

                if (x && y)
                    self.player.teleport(x, y);

                break;

            case 'nohit':

                self.player.invincible = !self.player.invincible;

                break;

            case 'mob':

                var npcId = parseInt(blocks.shift());

                self.world.spawnMob(npcId, self.player.x, self.player.y);

                break;

            case 'pointer':

                var posX = parseInt(blocks.shift()),
                    posY = parseInt(blocks.shift());

                if (!posX || !posY)
                    return;

                self.player.send(new Messages.Pointer(Packets.PointerOpcode.Location, {
                    id: self.player.instance,
                    x: posX,
                    y: posY
                }));

                break;

        }

    }

});