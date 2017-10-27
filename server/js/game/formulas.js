var Formulas = {},
    Utils = require('../util/utils');

Formulas.LevelExp = [];

module.exports = Formulas;

Formulas.getDamage = function(attacker, target, special) {
    if (!attacker || !target)
        return;

    var damage, damageAbsorbed,
        weaponLevel = attacker.weapon ? attacker.weapon.getLevel() : attacker.weaponLevel,
        attackerArmourLevel = attacker.armour ? attacker.armour.getDefense() : attacker.armourLevel,
        targetArmourLevel = target.armour ? target.armour.getDefense() : target.armourLevel,
        usingRange = attacker.weapon ? attacker.weapon.isRanged() : attacker.isRanged(),
        isPlayer = attacker.type === 'player',
        attackerPendant = attacker.pendant ? attacker.pendant : null,
        attackerRing = attacker.ring ? attacker.ring : null,
        attackerBoots = attacker.boots ? attacker.boots : null,
        targetPendant = target.pendant ?  target.pendant : null,
        targetRing = target.ring ? target.ring : null,
        targetBoots = target.boots ? target.boots : null;

    /**
     * Set the baseline damage
     */

    damage = attacker.level * Utils.randomRange(0.45, 2.1875) + (isPlayer ? Utils.randomInt(0, 9) : Utils.randomInt(-5, 2));

    /**
     * Take in consideration weapon level & armour
     */

    damage += (weaponLevel * (2.125 + (Utils.randomRange(0.1, 1.25))) * (usingRange ? Utils.randomRange(0.75, 1.15) : 2.15 + Utils.randomRange(2.1, 4.2)));
    damage += (attackerArmourLevel * (Utils.randomRange(0.15, 0.35)));

    if (special)
        damage *= Utils.randomRange(1.00, 3.10);

    if (attackerPendant)
        damage *= attackerPendant.getBaseAmplifier();

    if (attackerRing)
        damage *= attackerRing.getBaseAmplifier();

    if (attackerBoots)
        damage *= attackerBoots.getBaseAmplifier();

    damageAbsorbed = target.level + Utils.randomRange(0, targetArmourLevel) * (1.15 + Utils.randomRange(-0.35, 0.05));

    if (targetPendant)
        damageAbsorbed *= targetPendant.getBaseAmplifier();

    if (targetRing)
        damageAbsorbed *= targetRing.getBaseAmplifier();

    if (targetBoots)
        damageAbsorbed *= targetBoots.getBaseAmplifier();

    damage = Math.round(damage);
    damageAbsorbed = Math.round(damageAbsorbed);

    damage -= damageAbsorbed;

    if (isNaN(damage) || !damage || damage < 0 || target.invincible)
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