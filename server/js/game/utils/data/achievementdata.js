
var _ = require("underscore"),
    AchievementJson = require("../../../../../shared/data/achievements_english.json"),
    Types = require('../../../../../shared/js/gametypes');


var AchievementData = {};

var i=0;
_.each( AchievementJson, function( value, key ) {
    AchievementData[i] = value;
    AchievementData[i].id = i;
	i++;
});

Types.setAchievementData(AchievementData);

module.exports.AchievementData = AchievementData;

