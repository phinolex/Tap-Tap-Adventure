/* global Types */

var Utils = require('./utils'),
    ItemTypes = require('../../shared/js/itemtypes'),
    Formulas = {};


Formulas.dmg = function(attacker, defender) {
    var damage, damageDealt, damageAbsorbed, usingRange, attackerLevel, defenderLevel, defenderArmourLevel, attackerArmourLevel, attackerWeaponLevel;

    defenderArmourLevel = defender.armorLevel;
    attackerArmourLevel = attacker.armorLevel;
    attackerWeaponLevel = attacker.weaponLevel;
    usingRange = attacker instanceof Player && attacker.pClass == Types.PlayerClass.ARCHER;

    attackerLevel = attacker.level;
    defenderLevel = defender.level;

    if (defenderArmourLevel == 0)
        defenderArmourLevel = 1;

    if (attackerArmourLevel == 0)
        attackerArmourLevel = 1;

    if (defenderLevel == 0)
        defenderLevel = 1;

    if (attackerLevel == 0)
        attackerLevel = 1;

    if (attackerWeaponLevel == 0)
        attackerWeaponLevel = 1;


    damageDealt = Math.round((attackerLevel * Utils.randomRange(0.25, 2.1875)) + (attackerWeaponLevel * (1.125 + (Utils.randomRange(-0.5, 0.50))) * (usingRange ? 1.85 + (Utils.randomRange(-0.25, 0.35)) : 2.15 + (Utils.randomRange(-0.95, 1.25)))));
    damageAbsorbed = Math.round((defenderLevel + (Utils.random (0, defenderArmourLevel))) * (1.115 + Utils.random(-0.35, 0.05)));

    if (damageAbsorbed > damageDealt)
        damageAbsorbed = damageDealt - 1;

    damage = damageDealt - damageAbsorbed;


    if (damage < 0)
        damage = 0;

    if (ItemTypes.isArcherArmor(attacker.weapon) && attacker.isAdjacentNonDiagonal(defender))
        damage *= Utils.randomRange(1.01, 1 + (attacker.weaponLevel / 100));

    damage = Math.round(damage);

    return damage;
};
/*
Formulas.dmg = function(attacker, defender) {
    var dealt, absorbed, dmg;

    dealt = (attacker.weaponLevel + attacker.level * 0.5 + 5) * Utils.randomRange(4, 8);
    // Passive Attack
    if (attacker instanceof Player && attacker.skillPassiveAttack > 0)
    {
    	log.info("dealt="+dealt);
        dealt = ~~(dealt * (1 + attacker.skillPassiveAttack / 100));
        log.info("dealt="+dealt);
    }

    absorbed = (defender.armorLevel * 2.0 + defender.level * 2.0);
    // Passive Defense
    if (defender instanceof Player && defender.skillPassiveDefense > 0)
    {
    	absorbed = ~~(absorbed * (1 + defender.skillPassiveDefense / 100));    
    }
        
    dmg = dealt - absorbed;

    if(defender.royalAzaleaBenefTimeout){
        dmg = Math.floor(dmg * 0.66);
    } else{
        dmg = Math.floor(dmg);
    }

    // Make Mobs do 15% more damage
    if (attacker instanceof Mob && defender instanceof Player) {
    	dmg = Math.floor(dmg * 1.15);	    
    }

    // Bows do 75% damage when close quarters.
    if (ItemTypes.isArcherWeapon(attacker.weapon) && attacker.isAdjacentNonDiagonal(defender))
    {
    	dmg = Math.floor(dmg * 0.75);
    }
    
    if(dmg <= 0) {
        return 0;
    } else {
        return dmg;
    }
};*/

Formulas.hp = function(entityLevel) {
    var hp = 300 + (entityLevel * 8) * 5;
    return hp;
};

Formulas.mana = function(entityLevel) {
    //Do not check kind yet, will be implemented later on.
    return 50 + entityLevel * 2;
    //This requires more work, look around "kind".
};

Formulas.getExpArray = function() {
    
    //just return the EXP Array here.
};

if(!(typeof exports === 'undefined')) {
    module.exports = Formulas;
}