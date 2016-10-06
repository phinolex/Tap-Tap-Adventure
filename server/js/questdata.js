var _ = require('underscore'),
    QuestJson = require('../../shared/data/quests.json');

var QuestData = {};

var i = 0;
_.each(QuestJson, function(value, key) {
    QuestData[i] = value;
    QuestData[i].id = i;
    i++;
});

module.exports.QuestData = QuestData;