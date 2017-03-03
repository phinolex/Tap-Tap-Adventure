
define(['jquery'], function() {
    var ChatHandler = Class.extend({
        init: function(game) {
            var self = this;
            
            self.game = game;
            self.chatLog = $('#chatLog');
        },
        
        show: function() {
            this.chatLog.css('display', 'block');
        },

        pushNotification: function(message, isAdmin) {
            var self = this,
                source = isAdmin ? "ADMIN" : "GAME";

            self.add('[' + source + ']: ' + message, 'darkcyan');
        },

        pushChat: function(message, entity, isGlobal) {
            var self = this;

            if (!entity)
                return;

            self.add(entity.name + ': ' + message, isGlobal ? 'rgba(3, 119, 43, 1)' : 'rgba(255, 205, 0, 1');

            self.game.audioManager.playSound('chat');
        },
        
        add: function(message, color) {
            /**
             * Here we lastly sent the parsed message
             * to the chatLog CSS object.
             */
            
            var self = this,
                textElement = $('<p style="color:' + color + '">' + message + '</p>');
            
            $(textElement).appendTo(self.chatLog);
            self.chatLog.scrollTop(99999);
        }
    });
    return ChatHandler;
});