var Utils = require('./utils');

var Formulas = {};

Formulas.newDmg = function(attacker, defender){
    var dealt, absorbed, dmg;

    if(attacker.kind === Types.Entities.ARCHER){
        dealt = (attacker.weaponLevel + (attacker.level*2) + 15) * (0.9 + Math.random() * 0.2);
    } else{
        dealt = (attacker.weaponLevel + attacker.level + 5) * (0.9 + Math.random() * 0.2);
    }
    dealt = dealt + (dealt * (Utils.NaN2Zero(attacker.ringLevel + attacker.ringEnchantedPoint) * 0.005));
    absorbed = defender.armorLevel + defender.level;
    absorbed = absorbed + (absorbed * (Utils.NaN2Zero(defender.pendantLevel + defender.pendantEnchantedPoint) * 0.005));
    dmg = Math.floor(dealt * 100 / (100 + absorbed));

    if(attacker.ringSkillKind == Types.Skills.ATTACKWITHBLOOD) {
        var hitPoints = attacker.hitPoints,
            bleedingAmount = attacker.maxHitPoints * (attacker.ringSkillLevel * 0.01),
            dmg2 = 0;
        if(hitPoints > bleedingAmount) {
            dmg2 += dmg * (attacker.ringSkillLevel * 0.006);
        }
        dmg += dmg2;
    }


    if(defender.royalAzaleaBenefTimeout){
        dmg =  Math.floor(dmg*0.66);
    } else{
        dmg =  Math.floor(dmg);
    }

    if(dmg <= 0) {
        return Utils.randomInt(0, 3);
    } else {
        return dmg;
    }
};


Formulas.dmg = function(attacker, defender) {
    var dealt, absorbed, dmg;

    if(attacker.kind === Types.Entities.ARCHER){
        dealt = (attacker.weaponLevel * 0.9 + attacker.level * 0.5 + 6) * Utils.randomRange(6, 9);
    } else{
        dealt = (attacker.weaponLevel * 0.9 + attacker.level * 0.3 + 5) * Utils.randomRange(6, 9);
    }
    dealt = dealt + (dealt * (Utils.NaN2Zero(attacker.ringLevel + attacker.ringEnchantedPoint) * 0.005));
    absorbed = (defender.armorLevel * 1.8 + defender.level * 0.325) * 2;
    absorbed = absorbed + (absorbed * (Utils.NaN2Zero(defender.pendantLevel + defender.pendantEnchantedPoint) * 0.005));
    dmg = dealt - absorbed;

    if(attacker.ringSkillKind == Types.Skills.ATTACKWITHBLOOD) {
        var hitPoints = attacker.hitPoints,
            bleedingAmount = attacker.maxHitPoints * (attacker.ringSkillLevel * 0.01),
            dmg2 = 0;
        if(hitPoints > bleedingAmount) {
            dmg2 += dmg * (attacker.ringSkillLevel * 0.006);
        }

        dmg += dmg2;
    }

    if(defender.royalAzaleaBenefTimeout){
        dmg =  Math.floor(dmg*0.66);
    } else{
        dmg =  Math.floor(dmg);
    }

    if(dmg <= 0) {
        return Utils.randomInt(0, 3);
    } else {
        return dmg;
    }
};

Formulas.hp = function(entityLevel) {
    var hp = 300 + (entityLevel * 8) * 5;
    return hp;
};

Formulas.mana = function(entityLevel) {
    //Do not check kind yet, will be implemented later on.
    return 50 + entityLevel * 2;
    //This requires more work, look around "kind".
};

if(!(typeof exports === 'undefined')) {
    module.exports = Formulas;
}