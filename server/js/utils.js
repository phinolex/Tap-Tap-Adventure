var Utils = {},
    sanitizer = require('sanitizer'),
    Types = require("../../shared/js/gametypes");

module.exports = Utils;

Utils.sanitize = function(string) {
    // Strip unsafe tags, then escape as html entities.
    return sanitizer.escape(sanitizer.sanitize(string));
};
Utils.random = function(range) {
    return Math.floor(Math.random() * range);
};
Utils.randomRange = function(min, max) {
    return min + (Math.random() * (max - min));
};
Utils.randomInt = function(min, max) {
    return min + Math.floor(Math.random() * (max - min + 1));
};
Utils.percentToBool = function(percent){
    if(Math.random() < percent*0.01){
        return true;
    } else{
        return false;
    }
};
Utils.ratioToBool = function(ratio){
    if(Math.random() < ratio){
        return true;
    } else{
        return false;
    }
};

Utils.clamp = function(min, max, value) {
    if(value < min) {
        return min;
    } else if(value > max) {
        return max;
    } else {
        return value;
    }
};
/*Utils.randomOrientation = function() {
    var o, r = Utils.random(4);

    if(r === 0)
        o = Types.Orientations.LEFT;
    if(r === 1)
        o = Types.Orientations.RIGHT;
    if(r === 2)
        o = Types.Orientations.UP;
    if(r === 3)
        o = Types.Orientations.DOWN;

    return o;
};*/

Utils.randomPositionNextTo = function (entity) {
    var a = entity.x, b = entity.y, r = Utils.random(4);
    
    if(r === 0)
        --a;
    if(r === 1)
        ++a;
    if(r === 2)
        --b;
    if(r === 3)
        ++b;

    return {"x": a, "y": b};
}

Utils.Mixin = function(target, source) {
    if (source) {
        for (var key, keys = Object.keys(source), l = keys.length; l--; ) {
            key = keys[l];

            if (source.hasOwnProperty(key)) {
                target[key] = source[key];
            }
        }
    }
    return target;
};
Utils.distanceTo = function(x, y, x2, y2) {
    var distX = Math.abs(x - x2);
    var distY = Math.abs(y - y2);

    return (distX > distY) ? distX : distY;
};
Utils.NaN2Zero = function(num){
    if(isNaN(num*1)){
        return 0;
    } else{
        return num*1;
    }
};
Utils.trueFalse = function(bool){
    return bool === "true" ? true : false;
}