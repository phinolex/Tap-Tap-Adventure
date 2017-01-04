var _ = require('underscore'),
    Warps = require('../../../../../shared/data/warps.json');

var Properties = {};
var Ids = {};

_.each(Warps, function(value, key) {
    Properties[key.toLowerCase()] = {
        key: key.toLowerCase(),
        id: value.id ? value.id : -1,
        levelUnlocked: value.levelUnlocked ? value.levelUnlocked : 0
    };

    Ids[value.id] = Properties[key.toLowerCase()];
});


var isWarp = function(id) {
    return Ids[id] ? true : false;
};

var forEachWarp = function(callback) {
    for (var id in Ids) {
        if (Ids.hasOwnProperty(id))
            callback(Ids[id][0], id);
    }
};

module.exports.Properties = Properties;
module.exports.Ids = Ids;
module.exports.isWarps = isWarp;
module.exports.forEachWarp = forEachWarp;

