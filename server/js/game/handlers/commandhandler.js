var cls = require("./../lib/class"),
    Utils = require('./../utils/utils'),
    Messages = require('./../network/packets/message');

module.exports = CommandHandler = cls.Class.extend({

    init: function(server, packetHandler, player) {
        var self = this;
        
        self.server = server;
        self.packetHandler = packetHandler;
        self.player = player;
    },

    parseCommand: function(input) {
        var self = this;

        /**
         * We parse the raw input data and parse through
         * the necessary and unnecessary terms in it.
         * After that, we must set up a universal syntax for
         * command handling. /commandname, [parameter 1..n], <target>
         */

        if (self.player.rights < 1)
            return;

        var inputBlocks = input.substring(1).split(' ');

        switch(inputBlocks[0]) {
            case 'teletome':
            case 'teleto':
                var command = inputBlocks.shift(),
                    username = inputBlocks.join(' '),
                    playerEntity = self.server.getPlayerByName(username);

                if (!playerEntity) {
                    self.packetHandler.sendGUIMessage('Player: ' + username + ' does not exist or is offline.');
                    return;
                }

                var orientation = Utils.randomInt(1, 4);

                log.info(playerEntity.name + ' x: ' + playerEntity.x + ' y: ' + playerEntity.y);
                log.info(self.player.name + ' x: ' + self.player.x + ' y: ' + self.player.y);

                if (command == 'teletome')
                    playerEntity.forcefullyTeleport(self.player.x, self.player.y, orientation);
                else if (command == 'teleto')
                    self.player.forcefullyTeleport(playerEntity.x, playerEntity.y, orientation);

                break;

            case 'coords':
                self.server.pushToPlayer(self.player, new Messages.Chat(self.player, "Coordinates - x: " + self.player.x + " y: " + self.player.y));
                break;

            case 'teleport':
                inputBlocks.shift();

                var x = inputBlocks[0],
                    y = inputBlocks[1];

                if (isNaN(x) || isNaN(y)) {
                    self.packetHandler.sendGUIMessage("Invalid command input!");
                    return;
                }

                var orientation = Utils.randomInt(1, 4);

                self.player.forcefullyTeleport(parseInt(x), parseInt(y), orientation);

                break;

            case 'yell':
                inputBlocks.shift();

                var message = inputBlocks.join(' ');

                if (!message)
                    return;

                self.server.pushBroadcast(new Messages.GlobalChat(message, true));
                break;

            case 'globalchat':
                inputBlocks.shift();

                var message = inputBlocks.join(' ');

                self.server.pushBroadcast(new Messages.GlobalChat(message, false));
                break;

            case 'showstore':
                self.server.pushToPlayer(self.player, new Messages.InAppStore(self.player.id, 0));
                break;

            case 'showad':
                self.server.pushToPlayer(self.player, new Messages.SendAd(self.player.id));
                break;

            case 'centercamera':
                self.server.pushToPlayer(self.player, new Messages.CenterCamera(self.player.id));
                break;

            case 'showinstructions':
                self.server.pushToPlayer(self.player, new Messages.Instructions(self.player.id));
                break;

            case 'finishall':
                self.player.finishAllAchievements();
                break;

            case 'interface':
                inputBlocks.shift();

                var interfaceId = parseInt(inputBlocks[0]);

                if (isNaN(interfaceId))
                    return;

                self.server.pushToPlayer(self.player, new Messages.Interface(interfaceId));
                break;

            case 'addskill':
                inputBlocks.shift();

                var skillLevel = inputBlocks.shift(),
                    skillName = inputBlocks.join(' ');

                if (isNaN(skillLevel)) {
                    self.packetHandler.sendGUIMessage("Invalid command input!");
                    return;
                }

                self.player.skillHandler.add(skillName, skillLevel);

                var index = self.player.skillHandler.getIndexByName(skillName);

                self.redisPool.handleSkills(self.player, index, skillName, skillLevel);
                self.server.pushToPlayer(self.player, new Messages.SkillLoad(index, skillName, skillLevel));

                break;

            case 'players':
                for (var id in self.server.players) {
                    var player = self.server.getEntityById(id);
                    log.info("Player: " + player.name);
                }
                break;

            case 'item':
                inputBlocks.shift();
                var itemId = inputBlocks[0],
                    itemCount = inputBlocks[1];

                if (isNaN(itemCount) || isNaN(itemId)) {
                    self.packetHandler.sendGUIMessage("Invalid command input!");
                    return;
                }

                self.player.inventory.putInventory(itemId, itemCount);
                break;

            case 'spell':
                inputBlocks.shift();

                var spellType = inputBlocks[0];

                if (isNaN(spellType)) {
                    self.packetHandler.sendGUIMessage("Invalid command input!");
                    return;
                }

                if (spellType)
                    self.server.pushToPlayer(self.player, new Messages.ForceCast(spellType));

                break;

            case 'randommob':
                log.info(self.server.getRandomMob());
                break;
        }
    }
});