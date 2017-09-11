/* global module */

var Utils = {};

module.exports = Utils;

Utils.random = function(range) {
    return Math.floor(Math.random() * range);
};

Utils.randomRange = function(min, max) {
    return min + (Math.random() * (max - min));
};

Utils.randomInt = function(min, max) {

    return min + Math.floor(Math.random() * (max - min + 1));
};

/**
 * There is seriously no way two clients can end up with the same ID
 */

Utils.generateClientId = function() {
    return Utils.randomInt(0, 1000000) + Utils.randomInt(0, 40000) + Utils.randomInt(0, 9000);
};

Utils.generateInstance = function(randomizer, id, modulo, posY) {
    return '' + randomizer + Utils.randomInt(0, id) + randomizer + Utils.randomInt(0, modulo) + (posY ? posY : 0);
};

Utils.generateRandomId = function() {
    return '' + 1 + Utils.random(0, 200) + Utils.random(0, 20) + 2
};