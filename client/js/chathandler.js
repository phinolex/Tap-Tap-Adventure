
define(['jquery'], function() {
    var ChatHandler = Class.extend({
        init: function(game, kkhandler) {
            var self = this;
            this.game = game;
            this.kkhandler = kkhandler;
            this.chatLog = $('#chatLog');
            this.board = $('#board');
        },
        show: function(){
            $('#chatLog').css('display', 'block');
            $('#gamebutton').css('display', 'block');
            $('#boardbutton').css('display', 'block');
            $('#partybutton').css('display', 'block');
        },
        processSendMessage: function(message) {
            return this.processSenders(null, message);
        },
        processReceiveMessage: function(entityId, message) {
            return this.processRecievers(entityId, message);
        },

        handleIdEntity: function (data) {
            var m = this.game.getMouseGridPosition();
            var entity = this.game.getEntityAt(m.x, m.y);
            if (entity)
            {
                this.addToChatLog("entity name: " + entity.name + ", id: " + entity.kind +
                    ", pos: (" + m.x + "," + m.y + ")");
            }
        },

        handlePartyInvite: function(data) {
            var m = this.game.getMouseGridPosition();
            var entity;
            if (data.length == 2)
            {
                log.info("name_search="+data[1]);
                entity = this.game.getEntityByName(data[1]);
            }
            else
            {
                entity = this.game.getEntityAt(m.x, m.y);
            }
            if (entity == this.game.player)
                return;
            if (entity && entity.id)
                this.game.client.sendPartyInvite(entity.id, 0);

        },

        handlePartyLeader: function(data) {
            var m = this.game.getMouseGridPosition();
            var entity = this.game.getEntityAt(m.x, m.y);
            if (entity)
                this.game.client.sendPartyLeader(entity.id);
        },

        handlePartyLeave: function(data) {
            this.game.client.sendPartyLeave();
        },

        handlePartyKick: function(data) {
            var m = this.game.getMouseGridPosition();
            var entity = this.game.getEntityAt(m.x, m.y);
            if (entity)
                this.game.client.sendPartyKick(entity.id);
        },

        handlePetCreate: function (data) {
            if (data.length == 3)
            {
                var target = this.game.getEntityByName(data[1]);
                if (target)
                    this.game.client.sendPetCreate(target.id, parseInt(data[2]));
            }
        },

        processSenders: function(entityId, message) {
            var data = message.split(" ",5);
            if (!data) data[0] = message;


            var pattern = message.substring(0, 3),
                self = this,
                commandPatterns = {
                    "/1 ": function(message) {
                        var name = self.game.player.name,
                            rights = self.game.player.rights;

                        switch (rights) {
                            case 2:
                                name = "[Admin]" + name;
                                break;

                            case 1:
                                name = "[Moderator]" + name;
                                break;
                        }

                        self.game.client.sendChat("/1 " + name + ": " + message);
                        return true;
                    },

                    "/t ": function(message) {
                        self.game.client.sendChat("Hey: " + self.game.player.weaponName + " " + self.game.player.isDead);
                        return;
                    }
                };
            if (pattern in commandPatterns) {
                if (typeof commandPatterns[pattern] == "function") {
                    return commandPatterns[pattern](message.substring(3));
                }
            }
            return false;
        },

        processRecievers: function(entityId, message) {
            var data = message.split(" ",5);
            if (!data) data[0] = message;

            var pattern = message.substring(0, 3),
                self = this,
                commandPatterns = {
                    // World chat
                    "/1 ": function(entityId, message) {
                        self.addToChatLog(message);
                        return true;
                    }
                };
            if (pattern in commandPatterns) {
                if (typeof commandPatterns[pattern] == "function") {
                    return commandPatterns[pattern](entityId, message.substring(3));
                }
            }
            return false;
        },

        addToChatLog: function(message){
            var self = this;
            var el = $('<p style="color: darkcyan">' + message + '</p>');
            $(el).appendTo(this.chatLog);
            $(this.chatLog).scrollTop(999999);
        },

        addNotification: function(message, isAdmin) {
            var self = this;

            self.addMessage(isAdmin ? 'ADMIN' : 'GAME', message);
        },

        addNormalChat: function(entity, message) {
            var self = this;

            if (!entity) return;

            self.addMessage(entity.name, message);
        },

        addMessage: function(sourceName, message, colour) { //TODO - Do different colours in a single function.
            var self = this;

            self.game.app.displayChatLog(true);
            
            var syntax = $('<p style="color: rgba(255, 205, 0, 1)">' + '[' + sourceName + ']: ' + message + '</p>');
            $(syntax).appendTo(this.chatLog);
            $(self.chatLog.scrollTop(999999));
        }

    });
    return ChatHandler;
});