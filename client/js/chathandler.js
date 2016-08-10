
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
          $('#kungLog').css('display', 'block');
          $('#gamebutton').css('display', 'block');
          $('#boardbutton').css('display', 'block');
          $('#partybutton').css('display', 'block');
          $('#kungbutton').css('display', 'block');
        },
        processSendMessage: function(message) {
          return this.processSenders(null, message);
        },
        processReceiveMessage: function(entityId, message) {
          return this.processRecievers(entityId, message);
        },
        
        handleAddSpawn: function (data) {
		log.info("sendAddSpawn");
		var m = this.game.getMouseGridPosition();
		if (data.length == 2)
			this.game.client.sendAddSpawn(parseInt(data[1]), m.x, m.y);        	
        },
        
        handleSaveSpawns: function (data) {
        	this.game.client.sendSaveSpawns();
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
        
        handleWarp: function (data) {
		var p = this.game.player;
		if (p.warpX && p.warpY)
		{
			this.teleportTo(p.warpX, p.warpY);	
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
                          
                          
                            //'hacking' this will cause no issues
                            //as they grant no advantages
                            switch (rights) {
                                case 2:
                                    name = "[Admin]" + name;
                                break;
                                
                                case 1:
                                    name = "[Moderator]" + name;
                                break;
                                //no default needed.
                            }
                            
                            self.game.client.sendChat("/1 " + name + ": " + message);
                            return true;
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
        addNormalChat: function(entity, message) {
            var self = this;

            if (!entity) return;
            
            var el = $('<p style="color: rgba(255, 255, 0, 1)">' + entity.name + ': ' + message + '</p>');
            
            
            $(el).appendTo(this.chatLog);
            $(this.chatLog).scrollTop(999999);
        },
        
        addGameNotification: function(notificationType, message) {
            var el = $('<p style="color: rgba(255, 255, 0, 1)">' + notificationType + ': ' + message + '</p>');
            $(el).appendTo(this.chatLog);
            $(this.chatLog).scrollTop(999999);
        },
       
        teleportToTown: function () {
    		var p = this.game.player; 
    		p.warpX = p.gridX;
    		p.warpY = p.gridY;
    		
            	var destX = Math.floor(Math.random() * 8) + 12;
    		var destY = Math.floor(Math.random() * 8) + 206;
    		
    		this.teleportTo(destX,destY);        	
        },
        
        teleportTo: function (destX, destY) {
    		var self = this;
    		var p = this.game.player; 
    		p.warpX = p.gridX;
    		p.warpY = p.gridY;
	
    		if(self.game.map.isOutOfBounds(destX, destY))
    		    return;
    	    	
    	    	self.game.client.sendTeleport(p.id, destX, destY);
    		self.game.makeCharacterTeleportTo(p, destX, destY);
    		p.setGridPosition(destX, destY);
    		p.nextGridX = destX;
    		p.nextGridY = destY;
    		p.turnTo(Types.Orientations.DOWN);
    		self.game.resetZone();
    		self.game.updatePlateauMode();
                self.game.camera.setRealCoords();
        	self.game.enqueueZoningFrom(p.gridX, p.gridY);
        	self.game.renderer.forceRedraw = true;
        }

    });
    return ChatHandler;
});
