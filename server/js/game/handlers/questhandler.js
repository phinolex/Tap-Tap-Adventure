var cls = require('../lib/class'),
    Introduction = require('../quests/introduction'),
    GameTypes = require('../../../../shared/js/gametypes'),
    QuestsJSON = require('../../../../shared/data/quests.json'),
    Quests = require('../utils/data/questdata');

/**
 * Quests will be far more complex than Achievements, they will a similar system
 * to that of the Minigame Handler, alongside with part of JSON for information.
 */

module.exports = QuestHandler = cls.Class.extend({
    init: function(player) {
        var self = this;

        self.player = player;
        self.quests = {};

        self.loadQuests();
    },
    
    loadQuests: function() {
        var self = this;
        
        self.quests[Quests.QuestData[0].name] = new Introduction(Quests.QuestData[0], self.player);
    },

    saveAll: function() {
        var self = this;

        for (var quest in self.quests)
            quest.update();
    }
});