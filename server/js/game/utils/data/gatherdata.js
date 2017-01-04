var _ = require("underscore");
//var Types = require("../../shared/js/gametypes");
//var ItemTypes = require("../../shared/js/itemtypes");
var GatherJSON = require("../../../../../shared/data/gather.json");

var Properties = {};
var Kinds = {};
_.each( GatherJSON, function( value, key ) {
	Properties[key.toLowerCase()] = {
		key: key.toLowerCase(),
		kind: value.kind,
		drops: value.drops ? value.drops : null,
		xp: value.xp ? value.xp : 0,
		level: value.level ? value.level : 0,
		count: value.count ? value.count : 0,
	};
	// Create a Kind map for fast retrieval.
	Kinds[value.kind] = Properties[key.toLowerCase()]; 
});


var isGather = function(kind){
    return Kinds[kind] ? true : false; 
};

module.exports.Properties = Properties;
module.exports.Kinds = Kinds;
module.exports.isGather = isGather;

