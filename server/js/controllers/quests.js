var cls = require('../lib/class'),
    Introduction = require('../game/entity/character/player/quest/misc/introduction'),
    BulkySituation = require('../game/entity/character/player/quest/misc/bulkysituation'),
    QuestData = require('../../data/quests.json'),
    AchievementData = require('../../data/achievements.json'),
    Achievement = require('../game/entity/character/player/achievement'),
    _ = require('underscore');

module.exports = Quests = cls.Class.extend({

    init: function(player) {
        var self = this;

        self.player = player;
        self.quests = {};
        self.achievements = {};

        self.load();
    },

    load: function() {
        var self = this,
            questCount = 0;

        _.each(QuestData, function(quest) {

            if (questCount === 0)
                self.quests[quest.id] = new Introduction(self.player, quest);
            else if (questCount === 1)
                self.quests[quest.id] = new BulkySituation(self.player, quest);

            questCount++;
        });

        _.each(AchievementData, function(achievement) {
            self.achievements[achievement.id] = new Achievement(achievement.id, self.player);
        });

    },

    updateQuests: function(ids, stages) {
        var self = this;

        for (var id = 0; id < ids.length; id++)
            if (!isNaN(parseInt(ids[id])) && self.quests[id])
                self.quests[id].load(stages[id]);
    },

    updateAchievements: function(ids, progress) {
        var self = this;

        for (var id = 0; id < ids.length; id++)
            if (!isNaN(parseInt(ids[id])) && self.achievements[id])
                self.achievements[id].setProgress(progress[id]);

        if (self.readyCallback)
            self.readyCallback();
    },

    getQuest: function(id) {
        var self = this;

        if (id in self.quests)
            return self.quests[id];

        return null;
    },

    getQuests: function() {
        var self = this,
            ids = '',
            stages = '';

        for (var id = 0; id < self.getQuestSize(); id++) {
            ids += id + ' ';
            stages += self.quests[id].stage + ' ';
        }

        return {
            username: self.player.username,
            ids: ids,
            stages: stages
        }
    },

    getAchievements: function() {
        var self = this,
            ids = '',
            progress = '';

        for (var id = 0; id < self.getAchievementSize(); id++) {
            ids += id + ' ';
            progress += self.achievements[id].progress + ' '
        }

        return {
            username: self.player.username,
            ids: ids,
            progress: progress
        }
    },

    getData: function() {
        var self = this,
            quests = [],
            achievements = [];

        self.forEachQuest(function(quest) {
            quests.push(quest.getInfo());
        });

        self.forEachAchievement(function(achievement) {
            achievements.push(achievement.getInfo());
        });

        return {
            quests: quests,
            achievements: achievements
        };
    },

    forEachQuest: function(callback) {
        _.each(this.quests, function(quest) {
            callback(quest);
        });
    },

    forEachAchievement: function(callback) {
        _.each(this.achievements, function(achievement) {
            callback(achievement);
        });
    },

    getQuestsCompleted: function() {
        var self = this,
            count = 0;

        for (var id in self.quests)
            if (self.quests.hasOwnProperty(id))
                if (self.quests[id].isFinished())
                    count++;

        return count;
    },

    getAchievementsCompleted: function() {
        var self = this,
            count = 0;

        for (var id in self.achievements)
            if (self.achievements.hasOwnProperty(id))
                if (self.achievements[id].isFinished())
                    count++;

        return count;
    },

    getQuestSize: function() {
        return Object.keys(this.quests).length;
    },

    getAchievementSize: function() {
        return Object.keys(this.achievements).length;
    },

    getQuestByNPC: function(npc) {
        var self = this;

        /**
         * Iterate through the quest list in the order it has been
         * added so that NPC's that are required by multiple quests
         * follow the proper order.
         */

        for (var id in self.quests) {
            if (self.quests.hasOwnProperty(id)) {
                var quest = self.quests[id];

                if (quest.hasNPC(npc.id))
                    return quest;
            }
        }

        return null;
    },

    getAchievementByNPC: function(npc) {
        var self = this;

        for (var id in self.achievements)
            if (self.achievements.hasOwnProperty(id))
                if (self.achievements[id].data.npc === npc.id && !self.achievements[id].isFinished())
                    return self.achievements[id];

        return null;
    },

    getAchievementByMob: function(mob) {
        var self = this;

        for (var id in self.achievements)
            if (self.achievements.hasOwnProperty(id))
                if (self.achievements[id].data.mob === mob.id)
                    return self.achievements[id];

        return null;
    },

    isQuestMob: function(mob) {
        var self = this;

        for (var id in self.quests) {
            if (self.quests.hasOwnProperty(id)) {
                var quest = self.quests[id];

                if (!quest.isFinished() && quest.hasMob(mob.id))
                    return true;
            }
        }
    },

    isAchievementMob: function(mob) {
        var self = this;

        for (var id in self.achievements)
            if (self.achievements.hasOwnProperty(id))
                if (self.achievements[id].data.mob === mob.id && !self.achievements[id].isFinished())
                    return true;

        return false;
    },

    isQuestNPC: function(npc) {
        var self = this;

        for (var id in self.quests) {
            if (self.quests.hasOwnProperty(id)) {
                var quest = self.quests[id];

                if (!quest.isFinished() && quest.hasNPC(npc.id))
                    return true;
            }
        }
    },

    isAchievementNPC: function(npc) {
        var self = this;

        for (var id in self.achievements)
            if (self.achievements.hasOwnProperty(id))
                if (self.achievements[id].data.npc === npc.id && !self.achievements[id].isFinished())
                    return true;

        return false;
    },

    onReady: function(callback) {
        this.readyCallback = callback;
    }

});