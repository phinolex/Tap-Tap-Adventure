var Formulas = {},
    Utils = require('../util/utils');

Formulas.LevelExp = [];

module.exports = Formulas;

Formulas.getDamage = function(attacker, target, special) {

    var maxDamage = Formulas.getMaxDamage(attacker, target, special),
        accuracy = Utils.randomInt(0, attacker.level);

    log.info(attacker.instance + ' ' + maxDamage);

    return Utils.randomInt(accuracy, maxDamage);
};

Formulas.getMaxDamage = function(attacker, target, special) {

    if (!attacker || !target)
        return;

    var damageDealt, damageAbsorbed, damageAmplifier = 1, absorptionAmplifier = 1,
        usingRange = attacker.weapon ? attacker.weapon.isRanged() : attacker.isRanged(),
        weaponLevel = attacker.weapon ? attacker.weapon.getLevel() : attacker.weaponLevel,
        armourLevel = attacker.armour ? attacker.armour.getDefense() : attacker.armourLevel,
        pendant = attacker.pendant ? attacker.pendant : null,
        ring = attacker.ring ? attacker.ring : null,
        boots = attacker.boots ? attacker.boots : null,
        targetArmour = target.armour ? target.armour.getDefense() : target.armourLevel,
        targetPendant = target.pendant ? target.pendant : null,
        targetRing = target.ring ? target.ring : null,
        targetBoots = target.boots ? target.boots : null,
        isPlayer = attacker.type === 'player';

    damageDealt = (isPlayer ? 10 : 0) + attacker.level + ((attacker.level * weaponLevel) / 4) + ((attacker.level + weaponLevel * armourLevel) / 8);

    /**
     * Apply ranged damage deficit
     */

    if (usingRange)
        damageDealt /= 1.275;

    /**
     * Apply special amulets
     */

    if (pendant && pendant.pendantLevel > 0)
        damageAmplifier *= pendant.getBaseAmplifier();

    if (ring && ring.ringLevel > 0)
        damageAmplifier *= ring.getBaseAmplifier();

    if (boots && boots.bootsLevel > 0)
        damageAmplifier *= boots.getBaseAmplifier();

    log.info(damageAmplifier);

    /**
     * Just so amplifiers don't get out of hand.
     */

    if (damageAmplifier > 1.60)
        damageAmplifier = 1.60;

    damageDealt *= damageAmplifier;

    damageAbsorbed = target.level + (targetArmour / 2);

    if (targetPendant)
        absorptionAmplifier *= targetPendant.getBaseAmplifier();

    if (targetRing)
        absorptionAmplifier *= targetRing.getBaseAmplifier();

    if (targetBoots)
        absorptionAmplifier *= targetBoots.getBaseAmplifier();

    damageAbsorbed *= absorptionAmplifier;

    var damage = damageDealt - damageAbsorbed;

    damage = Math.ceil(damage);

    if (isNaN(damage) || !damage || damage < 0)
        damage = 0;

    return damage;

};

Formulas.getCritical = function(attacker, target) {

    if (!attacker || !target)
        return;

    /**
     * The critical is the player's max hit plus *= critical multiplier of the weapon
     */

    var damage = Formulas.getDamage(attacker, target),
        multiplier = attacker.weapon.abilityLevel / 10;
    
    return damage *= multiplier;
};

Formulas.getWeaponBreak = function(attacker, target) {

    if (!attacker || !target)
        return;

    var targetArmour = target.getArmourLevel();

    /**
     * The chance a weapon will break ....
     */

    var breakChance = Utils.randomRange(1, 100);

    return breakChance > 75;
};


Formulas.getAoEDamage = function(attacker, target) {
    /**
     * Preliminary setup until this function is expanded
     * and fits in the necessary algorithms.
     */

    return Formulas.getDamage(attacker, target);
};

Formulas.expToLevel = function(experience) {
    if (experience < 0)
        return -1;

    for (var i = 1; i < Formulas.LevelExp.length; i++)
        if (experience < Formulas.LevelExp[i])
            return i;
};

Formulas.getMaxHitPoints = function(level) {
    return 100 + (level * 30);
};

Formulas.getMaxMana = function(level) {
    return 10 + (level * 8);
};