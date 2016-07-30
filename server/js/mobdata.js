var _ = require("underscore");
var Mobs = require("../../shared/data/mobs.json");

var Properties = {};
var Kinds = {};
_.each( Mobs, function( value, key ) {
	Properties[key.toLowerCase()] = {
		key: key.toLowerCase(),
		kind: value.kind,
		drops: value.drops ? value.drops : null,
		hp: value.hp,
		armor: (value.armor) ? value.armor : 0,
		weapon: (value.weapon) ? value.weapon : 0,
		xp: value.xp ? value.xp : 0,
		level: value.level ? value.level : 0,
		aggroRange: (value.aggroRange) ? value.aggroRange : 2,
		attackRange: (value.attackRange) ? value.attackRange : 1,
		isAggressive: typeof value.isAggressive === 'boolean' ? value.isAggressive : true,
		attackRate: (value.attackRate) ? value.attackRate : 1000,
		moveSpeed: (value.moveSpeed) ? value.moveSpeed : 200,
		spawnDelay: value.spawnDelay ? value.spawnDelay : 60000,
	};
	
	// Create a Kind map for fast retrieval.
	Kinds[value.kind] = Properties[key.toLowerCase()]; 
});


var isMob = function(kind){
    return Kinds[kind] ? true : false; 
};

var forEachMobKind = function(callback) {
    for(var k in MobKinds) {
        callback(MobKinds[k][0], k);
    }
};


module.exports.Properties = Properties;
module.exports.Kinds = Kinds;
module.exports.isMob = isMob;
module.exports.forEachMobKind = forEachMobKind;

