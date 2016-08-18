define(function() {
    var WarpManager = Class.extend({
        init: function(game) {
            var self = this;
            this.enabled = false;            
            this.game = game;
        },
        
        toggle: function() {
            if(this.enabled) {
                this.enabled = false;

		var p = this.game.player;
		if (p.warpX && p.warpY)
		{
			this.teleportTo(p.warpX, p.warpY);	
		}  
		else
		{
			this.teleportToTown();	
		}
            } else {
                this.enabled = true;
                this.teleportToTown();
            }
            return this.enabled;
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
        },
    });
    return WarpManager;
});
