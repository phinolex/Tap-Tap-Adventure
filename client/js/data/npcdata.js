/* global Types */
define(['text!../../shared/data/npcs.json'], function(NPCsJson) {

	var NpcData = {};
	NpcData.Kinds = {};
	NpcData.Properties = {};
	var npcParse = JSON.parse(NPCsJson);
	$.each( npcParse, function( key, value ) {
		NpcData.Properties[key.toLowerCase()] = {
			key: key.toLowerCase(),
			kind: value.npcId,
			name: value.name ? value.name : key,
			spriteName: value.sprite ? value.sprite : key.toLowerCase(),
		};
		NpcData.Kinds[value.npcId] = NpcData.Properties[key.toLowerCase()];
	});
	NpcData.isNpc = function(kind){
	    return NpcData.Kinds[kind] ? true : false; 
	};
    return NpcData;
});
