
var _ = require("underscore"),
    QuestsJson = require("../../shared/data/newquests_english.json");


var QuestData = {};

var i=0;
//log.info(QuestsJson);
_.each( QuestsJson, function( value, key ) {
	QuestData[i] = value;
	QuestData[i].id = i;
	i++;
	
});

//log.info(QuestData);
module.exports.QuestData = QuestData;

