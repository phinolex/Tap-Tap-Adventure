/* global Types */
define(['text!../shared/data/mobs.json'], function(MobsJson) {

	var MobData = {};
	MobData.Kinds = {};
	MobData.Properties = {};
	var mobParse = JSON.parse(MobsJson);
	$.each( mobParse, function( key, value ) {
		MobData.Properties[key.toLowerCase()] = {
			key: key.toLowerCase(),
			kind: value.kind,
			name: value.name ? value.name : key,
			spriteName: value.sprite ? value.sprite : key.toLowerCase(),
			drops: value.drops ? value.drops : [],
			hp: value.hp ? value.hp : 0,
			armor: (value.armor) ? value.armor : 0,
			weapon: (value.weapon) ? value.weapon : 0,
			xp: value.xp ? value.xp : 0,
			level: value.level ? value.level : 0,
			aggroRange: (value.aggroRange) ? value.aggroRange : 2,
			attackRange: (value.attackRange) ? value.attackRange : 1,
			isAggressive: typeof (value.isAggressive) === 'boolean' ? value.isAggressive : true,
			attackRate: (value.attackRate) ? value.attackRate : 1000,
			moveSpeed: value.moveSpeed ? value.moveSpeed : 250,
			idleSpeed: value.idleSpeed ? value.idleSpeed : 200,
			walkSpeed: value.walkSpeed ? value.walkSpeed : 200,
			atkSpeed: value.atkSpeed ? value.atkSpeed : 100,
			shadowOffsetY: value.shadowOffsetY ? value.shadowOffsetY : 0,
		};
		MobData.Kinds[value.kind] = MobData.Properties[key.toLowerCase()];
	});
    return MobData;
});

