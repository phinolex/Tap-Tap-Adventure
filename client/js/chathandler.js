
define(['jquery'], function() {
    var ChatHandler = Class.extend({
        init: function(game, kkhandler) {
            var self = this;
            this.game = game;
            this.kkhandler = kkhandler;
            this.chatLog = $('#chatLog');
            this.board = $('#board');
            setInterval(function(){
                var randNumber = Math.random();
                if(randNumber < 0.25){
                    self.addNotification('Make sure you sign up on the forum!');
                } else if(randNumber < 0.5){
                    self.addNotification('This game is also playable on mobile devices, including tablets.');
                } else if(randNumber < 0.75){
                    self.addNotification('Invite your friends today!');
                } else {
                    self.addNotification('We are open to suggestions!');
                }
                // OPTIMIZED VERSION !!! NON TESTED
               // var randNumber = Math.random();
                //if(randNumber < 0.25)
                  //  self.addNotification('Make sure you sign up on the forum!');
                //else if(randNumber < 0.5)
                  //  self.addNotification('This game is also playable on mobile devices, including tablets.');
                //else if(randNumber < 0.75)
                  //  self.addNotification('Invite your friends today!');
                //else if(Math.round(Math.random() * 3628) + 1074==Math.round(Math.random() * 3628) + 1074)
                  //  self.addNotification('You found a special easteregg!');
                //else
                  //  self.addNotification('We are open to suggestions!');
            }, 1000*60*20);
        },
        show: function(){
          $('#chatLog').css('display', 'block');
          $('#kungLog').css('display', 'block');
          $('#gamebutton').css('display', 'block');
          $('#boardbutton').css('display', 'block');
          $('#partybutton').css('display', 'block');
          $('#kungbutton').css('display', 'block');
        },
        processSendMessage: function(message) {
          return this.processMessage(null, message, 'senders');
        },
        processReceiveMessage: function(entityId, message) {
          return this.processMessage(entityId, message, 'receivers');
        },
        processMessage: function(entityId, message, type) {
            var pattern = message.substring(0, 3),
                self = this,
                commandPatterns = {
                    'senders': {
                      "/1 ": function(message) {
                          var name = self.game.player.name;
                          if (self.game.player.admin) {
                              name = "[Admin] " + name;
                          } else if (self.game.player.moderator) {
                              name = "[Mod] " + name
                          }
                          // OPTIMIZED VERSION !!! NON TESTED
                          //if (self.game.player.admin)
                          //    name = "[Admin]" + name;
                          self.game.client.sendChat("/1 " + name + ": " + message);
                          return true;
                      },
                      "/2 ": function(message){
                          if(message.length !== 3){
                              self.game.showNotification(message + "Incorrect message syntax.");
                          } else{
                              self.game.client.sendKung(message);
                          }
                          // OPTIMIZED VERSION !!! NON TESTED
                          //if(message.lenght !== 3)
                          //    self.game.showNotification(message + "Incorrect message syntax.");
                          //else
                          //    self.game.client.sendKung(message);
                          return true;
                      },
                      "// ": function(message) {
                          self.game.client.sendChat("// " + self.game.player.name + ": " + message);
                          return true;
                      },
                      "///": function(message) {
                          self.game.client.sendChat("/// " + self.game.player.name + ": " + message);
                          return true;
                      },
                    },
                    'receivers': {
                        // World chat
                        "/1 ": function(entityId, message) {
                            self.addToChatLog(message);
                            return true;
                        },
                        "// ": function(entityId, message){
                            self.addToChatLog('<font color="#00BFFF">' + message + '</font>');
                            return true;
                        },
                        "///": function(entityId, message){
                            var i=0;
                            var splitMsg = message.split(' ');
                            var msg = "";
                            for(i=0; i<splitMsg.length; i++){
                                  if(i !== 3){
                                      msg += splitMsg[i] + " ";
                                  }
                                  // OPTIMIZED VERSION !!! NON TESTED
                                  //if(i !== 3)
                                  //    msg += splitMsg[i] + " ";
                            }
                            self.addToChatLog('<font color="#FFA500">' + msg + '</font>');
                            return true;
                        },
                    }
                };
                if (pattern in commandPatterns[type]) {
                      if (typeof commandPatterns[type][pattern] == "function") {
                            switch(type) {
                                  case 'senders':
                                        return commandPatterns[type][pattern](message.substring(3));
                                  case 'receivers':
                                        return commandPatterns[type][pattern](entityId, message.substring(3));
                            }
                      }
                }
            return false;
        },
        addToChatLog: function(message){
            var self = this;
            var el = $('<p style="color: white">' + message + '</p>');
            $(el).appendTo(this.chatLog);
            $(this.chatLog).scrollTop(999999);
        },
        addNotification: function(message){
            var self = this;
            var el = $('<p style="color: rgba(128, 255, 128, 1)">' + message + '</p>');
            $(el).appendTo(this.chatLog);
            $(this.chatLog).scrollTop(999999);
        },
        addNormalChat: function(name, message, theEntity){
            var self = this;
            var el = self.game.player.admin ? $('<p style="color: rgba(251, 86, 65, 1)">' + "[Admin] " + name + ': ' + message + '</p>') : self.game.player.moderator ? $('<p style="color: rgba(219, 100, 53, 1)">' + "[Mod] " + name + ': ' + message + '</p>') : $('<p style="color: rgba(255, 255, 0, 1)">' + name + ': ' + message + '</p>');

            $(el).appendTo(this.chatLog);
            $(this.chatLog).scrollTop(999999);
        }
    });
    return ChatHandler;
});
