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
                
                self.player.inventory.add(parseInt(itemId), parseInt(itemCount));
                return;

            case 'empty':

                self.player.inventory.clearInventory();

                return;

            case 'spawn':
                inputBlocks.shift();
                var itemCount = inputBlocks.shift(),
                    itemName = inputBlocks.join(' ');

                log.info("Spawning: " + itemName + " " + itemCount);

                if (itemCount && itemName) {
                    var item = ItemTypes.getKindFromString(itemName.toLowerCase());
                    if (item)
                        self.player.inventory.add(item, itemCount);
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

            case 'queststage':
                inputBlocks.shift();

                var questName = inputBlocks.join(' ');

                if (!questName) {
                    self.packetHandler.sendGUIMessage('You have entered an invalid quest name.');
                    return;
                }

                var quest = self.player.questHandler.getQuest(questName);

                if (quest)
                    self.server.pushToPlayer(self.player, new Messages.Chat(self.player, 'Quest: ' + quest.name + ' stage: ' + quest.stage));
                else
                    log.info('Quest not found...');


                return;

            case 'createchest':
                inputBlocks.shift();

                /**
                 * Spawn the chest only in the current player's
                 * instance rather than globally indicate
                 * to others..
                 */

                var x = parseInt(inputBlocks.shift()),
                    y = parseInt(inputBlocks.shift()),
                    content = inputBlocks.shift(); //Just have one item;

                var contents = [content];

                if (x && y && content) {

                    var chestEntity = self.server.createChest(x, y, contents);

                    self.server.pushToPlayer(self.player, new Messages.Spawn(chestEntity));

                } else
                    self.packetHandler.sendGUIMessage('Malformed command, syntax: x, y, content');


                return;

            case 'pointer':
                inputBlocks.shift();

                var pointerType = parseInt(inputBlocks.shift()), //0 or 1
                    data = [],
                    id = self.player.id + '' + Utils.randomInt(0, 500);

                switch(pointerType) {
                    case Types.Pointers.Location:

                        var posX = inputBlocks.shift(),
                            posY = inputBlocks.shift();

                        data.push(id);

                        if (posX && posY) {
                            posX = parseInt(posX);
                            posY = parseInt(posY);

                            data.push(posX);
                            data.push(posY);

                            self.server.pushToPlayer(self.player, new Messages.Pointer(pointerType, data));
                        } else
                            self.packetHandler.sendGUIMessage('You have entered some invalid coordinates.');

                        break;

                    case Types.Pointers.Entity:

                        var entityId = inputBlocks.shift();

                        if (!entityId) {
                            self.packetHandler.sendGUIMessage('Please enter a valid ID.');
                            return;
                        }

                        data.push(entityId);

                        self.server.pushToPlayer(self.player, new Messages.Pointer(pointerType, data));

                        break;

                    case Types.Pointers.Clear:

                        self.server.pushToPlayer(self.player, new Messages.Pointer(pointerType, null));

                        break;

                    case Types.Pointers.Static:

                        var xPos = inputBlocks.shift(),
                            yPos = inputBlocks.shift();

                        if (xPos && yPos) {

                            xPos = parseInt(xPos);
                            yPos = parseInt(yPos);

                            data.push(id);
                            data.push(xPos);
                            data.push(yPos);

                            self.server.pushToPlayer(self.player, new Messages.Pointer(pointerType, data));

                        } else
                            self.packetHandler.sendGUIMessage('Please enter a valid input for x and y.');

                        break;

                    default:
                        self.packetHandler.sendGUIMessage('Please enter a valid pointer type.');
                        break;
                }

                return;
            
            case 'task':
                
                self.server.pushToPlayer(self.player, new Messages.Task("lorem ipsum", 5, 10));
                
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