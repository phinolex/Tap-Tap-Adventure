var _ = require("underscore");
var CraftJSON = require("../../shared/data/craft.json");

var Properties = {};
var Kinds = {};
_.each( CraftJSON, function( value, key ) {
	Properties[key.toLowerCase()] = {
		key: key.toLowerCase(),
		input: value.input,
		output: value.output,
	        minLevel: value.minLevel ? value.minLevel : 0,
	        maxLevel: value.maxLevel ? value.maxLevel : 0,
		sprite: value.sprite ? value.sprite : '',		
	};
	// Create a Kind map for fast retrieval.
	Kinds[value.kind] = Properties[key.toLowerCase()]; 
});

module.exports.Properties = Properties;
module.exports.Kinds = Kinds;

