var _ = require("underscore");
//var Types = require("../../shared/js/gametypes");
//var ItemTypes = require("../../shared/js/itemtypes");
var NPCs = require("../../../../../shared/data/npcs.json");

var Properties = {};
var Kinds = {};
_.each( NPCs, function( value, key ) {
	Properties[key.toLowerCase()] = {
		key: key.toLowerCase(),
		kind: value.npcId,
		name: value.name ? value.name : key,
	};
	// Create a Kind map for fast retrieval.
	Kinds[value.npcId] = Properties[key.toLowerCase()]; 
});

var isNpc = function(kind){
	
    return Kinds[kind] ? true : false; 
};

module.exports.Properties = Properties;
module.exports.Kinds = Kinds;
module.exports.isNpc = isNpc;

