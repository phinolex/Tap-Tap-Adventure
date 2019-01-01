define(["jquery", "../page"], function($, Page) {
  return Page.extend({
    constructor() {
      

      this._super("#questPage");

      this.achievements = $("#achievementList");
      this.quests = $("#questList");

      this.achievementsCount = $("#achievementCount");
      this.questCount = $("#questCount");

      this.achievementsList = this.achievements.find("ul");
      this.questList = this.quests.find("ul");
    },

    load(quests, achievements) {
      var self = this,
        finishedAchievements = 0,
        finishedQuests = 0;

      _.each(achievements, function(achievement) {
        var item = this.getItem(false, achievement.id),
          name = this.getName(false, achievement.id);

        name.text("????????");

        name.css("background", "rgba(255, 10, 10, 0.3)");

        if (achievement.progress > 0 && achievement.progress < 9999) {
          name.css("background", "rgba(255, 255, 10, 0.4)");

          name.text(
            achievement.name +
              (achievement.count > 2
                ? " " +
                  (achievement.progress - 1) +
                  "/" +
                  (achievement.count - 1)
                : "")
          );
        } else if (achievement.progress > 9998) {
          name.text(achievement.name);
          name.css("background", "rgba(10, 255, 10, 0.3)");
        }

        if (achievement.finished) finishedAchievements++;

        item.append(name);

        var listItem = $("<li></li>");

        listItem.append(item);

        this.achievementsList.append(listItem);
      });

      _.each(quests, function(quest) {
        var item = this.getItem(true, quest.id),
          name = this.getName(true, quest.id);

        name.text(quest.name);

        name.css("background", "rgba(255, 10, 10, 0.3)");

        if (quest.stage > 0 && quest.stage < 9999)
          name.css("background", "rgba(255, 255, 10, 0.4)");
        else if (quest.stage > 9998)
          name.css("background", "rgba(10, 255, 10, 0.3)");

        if (quest.finished) finishedQuests++;

        item.append(name);

        var listItem = $("<li></li>");

        listItem.append(item);

        this.questList.append(listItem);
      });

      this.achievementsCount.html(
        finishedAchievements + "/" + achievements.length
      );
      this.questCount.html(finishedQuests + "/" + quests.length);
    },

    progress(info) {
      var self = this,
        item = info.isQuest
          ? this.getQuest(info.id)
          : this.getAchievement(info.id);

      if (!item) return;

      var name = item.find(
        "" + (info.isQuest ? "#quest" : "#achievement") + info.id + "name"
      );

      if (!name) return;

      if (!info.isQuest && info.count > 2)
        name.text(info.name + " " + info.progress + "/" + (info.count - 1));

      name.css("background", "rgba(255, 255, 10, 0.4)");
    },

    finish(info) {
      var self = this,
        item = info.isQuest
          ? this.getQuest(info.id)
          : this.getAchievement(info.id);

      if (!item) return;

      var name = item.find(
        "" + (info.isQuest ? "#quest" : "#achievement") + info.id + "name"
      );

      if (!name) return;

      if (!info.isQuest) name.text(info.name);

      name.css("background", "rgba(10, 255, 10, 0.3)");
    },

    getQuest(id) {
      return $(this.questList.find("li")[id]).find("#quest" + id);
    },

    getAchievement(id) {
      return $(this.achievementsList.find("li")[id]).find("#achievement" + id);
    },

    /**
     * Might as well properly organize them based
     * on their type of item and id (index).
     */

    getItem(isQuest, id) {
      return $(
        '<div id="' +
          (isQuest ? "quest" : "achievement") +
          id +
          '" class="questItem"></div>'
      );
    },

    getName(isQuest, id) {
      return $(
        '<div id="' +
          (isQuest ? "quest" : "achievement") +
          id +
          'name" class="questName"></div>'
      );
    }
  });
});
