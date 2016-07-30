/* global Types */
define(['npc', 'text!../shared/data/npcs.json'], function(Npc, NpcsJson) {
	var npcParse = JSON.parse(NpcsJson);
	var NPCs = {};
	$.each( npcParse, function( npcKey, npcValue ) {
		NPCs[npcKey] = Npc.extend({
		    init: function(id, name) {
		    	this._super(id, npcValue.npcId, npcKey);
		    	if (npcValue.name)
			    this.title = npcValue.name;		    	
			if (npcValue.idleSpeed)
			    this.idleSpeed = npcValue.idleSpeed; 		    
		    
		    }
		});
	  
	}); 
    return NPCs;
});

