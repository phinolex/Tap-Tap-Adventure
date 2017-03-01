var cls = require("./../lib/class"),
    Utils = require('./../utils/utils'),
    Messages = require('./../network/packets/message'),
    ItemTypes = require('../../../../shared/js/itemtypes')

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



        var inputBlocks = input.substring(1).split(' ');

        log.info('Player rights: ' + self.player.rights);

        self.handlePlayerCommands(inputBlocks);

        if (self.player.rights > 0)
            self.handleModeratorCommands(inputBlocks);

        if (self.player.rights > 1)
            self.handleAdminCommands(inputBlocks);
        
    },

    handleAdminCommands: function(input) {
        var self = this,
            inputBlocks = input; //Just a pointer for safety?

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

                return;

            case 'coords':
                self.server.pushToPlayer(self.player, new Messages.Chat(self.player, "Coordinates - x: " + self.player.x + " y: " + self.player.y));
                return;

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

                return;

            case 'yell':
                inputBlocks.shift();

                var message = inputBlocks.join(' ');

                if (!message)
                    return;

                self.server.pushBroadcast(new Messages.GlobalChat(message, true));
                return;

            case 'globalchat':
                inputBlocks.shift();

                var message = inputBlocks.join(' ');

                self.server.pushBroadcast(new Messages.GlobalChat(message, false));
                return;

            case 'showstore':
                self.server.pushToPlayer(self.player, new Messages.InAppStore(self.player.id, 0));
                return;

            case 'showad':
                self.server.pushToPlayer(self.player, new Messages.SendAd(self.player.id));
                return;

            case 'showinstructions':
                self.server.pushToPlayer(self.player, new Messages.Instructions(self.player.id));
                return;

            case 'finishall':
                self.player.finishAllAchievements();
                return;

            case 'interface':
                inputBlocks.shift();

                var interfaceId = parseInt(inputBlocks[0]);

                if (isNaN(interfaceId))
                    return;

                self.server.pushToPlayer(self.player, new Messages.Interface(interfaceId));
                return;

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

                return;

            case 'players':
                for (var id in self.server.players) {
                    var player = self.server.getEntityById(id);
                    log.info("Player: " + player.name);
                }
                return;

            case 'item':
                inputBlocks.shift();
                var itemId = inputBlocks[0],
                    itemCount = inputBlocks[1];

                if (isNaN(itemCount) || isNaN(itemId)) {
                    self.packetHandler.sendGUIMessage("Invalid command input!");
                    return;
                }
                
                self.player.inventory.putInventory(parseInt(itemId), parseInt(itemCount));
                return;

            case 'spawn':
                inputBlocks.shift();
                var itemCount = inputBlocks.shift(),
                    itemName = inputBlocks.join(' ');

                log.info("Spawning: " + itemName + " " + itemCount);

                if (itemCount && itemName) {
                    var item = ItemTypes.getKindFromString(itemName.toLowerCase());
                    if (item)
                        self.player.inventory.putInventory(item, itemCount);
                    else
                        self.packetHandler.sendGUIMessage("Item: " + itemName + " could not be found in the database.");
                } else
                    self.packetHandler.sendGUIMessage("Command input is erroneous.");

                return;

            case 'spell':
                inputBlocks.shift();

                var spellType = inputBlocks[0];

                if (isNaN(spellType)) {
                    self.packetHandler.sendGUIMessage("Invalid command input!");
                    return;
                }

                if (spellType)
                    self.server.pushToPlayer(self.player, new Messages.ForceCast(spellType));

                return;

            case 'randommob':
                log.info(self.server.getRandomMob());
                return;
        }
    },
    
    handleModeratorCommands: function(input) {
        var self = this,
            inputBlocks = input;
        
        switch (inputBlocks[0]) {
            case 'mute':

                return;

            case 'kick':
                inputBlocks.shift();

                var username = inputBlocks.join(' '),
                    player = self.server.getPlayerByName(username);
                
                if (player)
                    player.connection._connection.close();

                return;
        }
    },
    
    handlePlayerCommands: function(input) {
        var self = this,
            inputBlocks = input;
        
        switch (inputBlocks[0]) {
            case 'centercamera':
                self.server.pushToPlayer(self.player, new Messages.CenterCamera(self.player.id));
                return;
        }
    }
});