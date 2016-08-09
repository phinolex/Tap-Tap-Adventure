
var _ = require("underscore"),
    AchievementJson = require("../../shared/data/achievements_english.json");


var AchievementData = {};

var i=0;
_.each( AchievementJson, function( value, key ) {
    AchievementData[i] = value;
    AchievementData[i].id = i;
	i++;
	
});

module.exports.AchievementData = AchievementData;

