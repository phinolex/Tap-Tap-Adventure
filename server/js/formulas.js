var Utils = require('./utils');

var Formulas = {};

Formulas.dmg = function(attacker, defender) {
    var dealt = (attacker.weaponLevel * 0.9 + attacker.level * 0.3 + 5) * Utils.randomInt(2, 11) - Utils.randomInt(5, 9),
        absorbed = (defender.armorLevel * 1.8 + defender.level * 0.325) * 2,
        dmg =  Math.floor(dealt - absorbed);
    
    //console.log("abs: "+absorbed+"   dealt: "+ dealt+"   dmg: "+ (dealt - absorbed));
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