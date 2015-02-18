
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
          self.addNotification('This game is also playable on mobile devices as well as tablets!');
        } else if(randNumber < 0.75){
          self.addNotification('Invite your friends today!');
        } else{
          self.addNotification('We are welcome to suggestions.');
        }
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
                self.game.client.sendChat("/1 " + self.game.player.name + ": " + message);
                return true;
              },
              "/2 ": function(message){
                if(message.length !== 3){
                  self.game.showNotification(message + "Incorrect message syntax.");
                } else{
                  self.game.client.sendKung(message);
                }
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
    addNormalChat: function(name, message){
      var self = this;
      var el = $('<p style="color: rgba(255, 255, 0, 1)">' + name + ': ' + message + '</p>');
      $(el).appendTo(this.chatLog);
      $(this.chatLog).scrollTop(999999);
    }
  });

  return ChatHandler;
});
