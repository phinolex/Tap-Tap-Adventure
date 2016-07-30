/* global Types */
define(['mob', 'mobdata'], function(Mob, MobData) {

	var Mobs = {};
	$.each( MobData.Properties, function( mobKey, mobVal ) {
		Mobs[mobKey] = Mob.extend({
		    init: function(id) {
			this._super(id, mobVal.kind, mobKey);
			
			this.kind = mobVal.kind;
			this.title = mobVal.name;
			this.spriteName = mobVal.sprite;
			this.moveSpeed = mobVal.moveSpeed;
			this.idleSpeed = mobVal.idleSpeed;
			this.walkSpeed = mobVal.walkSpeed;
			//this.atkSpeed = mobVal.atkSpeed;
			this.shadowOffsetY = mobVal.shadowOffsetY;
			this.aggroRange = mobVal.aggroRange;
			this.isAggressive = mobVal.isAggressive;
			this.setAttackRate(mobVal.attackRate);
			this.xp = mobVal.xp;
			this.level = mobVal.level;
			this.hitPoints = mobVal.hp;
			
		    }
		});

	});
    return Mobs;
});
