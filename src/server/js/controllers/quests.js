var cls = require("../lib/class"),
  Introduction = require("../game/entity/character/player/quest/misc/introduction"),
  BulkySituation = require("../game/entity/character/player/quest/misc/bulkysituation"),
  QuestData = require("../../data/quests.json"),
  AchievementData = require("../../data/achievements.json"),
  Achievement = require("../game/entity/character/player/achievement"),
  _ = require("underscore");

module.exports = Quests = cls.Class.extend({
  constructor(player) {
    

    this.player = player;
    this.quests = {};
    this.achievements = {};

    this.load();
  },

  load() {
    var self = this,
      questCount = 0;

    _.each(QuestData, function(quest) {
      if (questCount === 0)
        this.quests[quest.id] = new Introduction(this.player, quest);
      else if (questCount === 1)
        this.quests[quest.id] = new BulkySituation(this.player, quest);

      questCount++;
    });

    _.each(AchievementData, function(achievement) {
      this.achievements[achievement.id] = new Achievement(
        achievement.id,
        this.player
      );
    });
  },

  updateQuests(ids, stages) {
    

    for (var id = 0; id < ids.length; id++)
      if (!isNaN(parseInt(ids[id])) && this.quests[id])
        this.quests[id].load(stages[id]);
  },

  updateAchievements(ids, progress) {
    

    for (var id = 0; id < ids.length; id++)
      if (!isNaN(parseInt(ids[id])) && this.achievements[id])
        this.achievements[id].setProgress(progress[id]);

    if (this.readyCallback) this.readyCallback();
  },

  getQuest(id) {
    

    if (id in this.quests) return this.quests[id];

    return null;
  },

  getQuests() {
    var self = this,
      ids = "",
      stages = "";

    for (var id = 0; id < this.getQuestSize(); id++) {
      ids += id + " ";
      stages += this.quests[id].stage + " ";
    }

    return {
      username: this.player.username,
      ids: ids,
      stages: stages
    };
  },

  getAchievements() {
    var self = this,
      ids = "",
      progress = "";

    for (var id = 0; id < this.getAchievementSize(); id++) {
      ids += id + " ";
      progress += this.achievements[id].progress + " ";
    }

    return {
      username: this.player.username,
      ids: ids,
      progress: progress
    };
  },

  getData() {
    var self = this,
      quests = [],
      achievements = [];

    this.forEachQuest(function(quest) {
      quests.push(quest.getInfo());
    });

    this.forEachAchievement(function(achievement) {
      achievements.push(achievement.getInfo());
    });

    return {
      quests: quests,
      achievements: achievements
    };
  },

  forEachQuest(callback) {
    _.each(this.quests, function(quest) {
      callback(quest);
    });
  },

  forEachAchievement(callback) {
    _.each(this.achievements, function(achievement) {
      callback(achievement);
    });
  },

  getQuestsCompleted() {
    var self = this,
      count = 0;

    for (var id in this.quests)
      if (this.quests.hasOwnProperty(id))
        if (this.quests[id].isFinished()) count++;

    return count;
  },

  getAchievementsCompleted() {
    var self = this,
      count = 0;

    for (var id in this.achievements)
      if (this.achievements.hasOwnProperty(id))
        if (this.achievements[id].isFinished()) count++;

    return count;
  },

  getQuestSize() {
    return Object.keys(this.quests).length;
  },

  getAchievementSize() {
    return Object.keys(this.achievements).length;
  },

  getQuestByNPC(npc) {
    

    /**
     * Iterate through the quest list in the order it has been
     * added so that NPC's that are required by multiple quests
     * follow the proper order.
     */

    for (var id in this.quests) {
      if (this.quests.hasOwnProperty(id)) {
        var quest = this.quests[id];

        if (quest.hasNPC(npc.id)) return quest;
      }
    }

    return null;
  },

  getAchievementByNPC(npc) {
    

    for (var id in this.achievements)
      if (this.achievements.hasOwnProperty(id))
        if (
          this.achievements[id].data.npc === npc.id &&
          !this.achievements[id].isFinished()
        )
          return this.achievements[id];

    return null;
  },

  getAchievementByMob(mob) {
    

    for (var id in this.achievements)
      if (this.achievements.hasOwnProperty(id))
        if (this.achievements[id].data.mob === mob.id)
          return this.achievements[id];

    return null;
  },

  isQuestMob(mob) {
    

    for (var id in this.quests) {
      if (this.quests.hasOwnProperty(id)) {
        var quest = this.quests[id];

        if (!quest.isFinished() && quest.hasMob(mob.id)) return true;
      }
    }
  },

  isAchievementMob(mob) {
    

    for (var id in this.achievements)
      if (this.achievements.hasOwnProperty(id))
        if (
          this.achievements[id].data.mob === mob.id &&
          !this.achievements[id].isFinished()
        )
          return true;

    return false;
  },

  isQuestNPC(npc) {
    

    for (var id in this.quests) {
      if (this.quests.hasOwnProperty(id)) {
        var quest = this.quests[id];

        if (!quest.isFinished() && quest.hasNPC(npc.id)) return true;
      }
    }
  },

  isAchievementNPC(npc) {
    

    for (var id in this.achievements)
      if (this.achievements.hasOwnProperty(id))
        if (
          this.achievements[id].data.npc === npc.id &&
          !this.achievements[id].isFinished()
        )
          return true;

    return false;
  },

  onReady(callback) {
    this.readyCallback = callback;
  }
});
