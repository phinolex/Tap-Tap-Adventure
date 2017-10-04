define(['jquery', '../page'], function($, Page) {

    return Page.extend({

        init: function() {
            var self = this;

            self._super('#questPage');

            self.achievements = $('#achievementList');
            self.quests = $('#questList');

            self.achievementsList = self.achievements.find('ul');
            self.questList = self.quests.find('ul');

        },

        load: function(quests, achievements) {
            var self = this;

            _.each(achievements, function(achievement) {
                var item = self.getItem(false, achievement.id),
                    name = self.getName(false, achievement.id);

                name.text('????????');

                name.css('background', 'rgba(255, 10, 10, 0.3)');

                if (achievement.progress > 0 && achievement.progress < 9999) {
                    name.css('background', 'rgba(255, 255, 10, 0.4)');

                    if (achievement.type === 1)
                        name.text(achievement.name + ' ' + achievement.progress + '/' + achievement.count);

                } else if (achievement.progress > 9998)
                    name.css('background', 'rgba(10, 255, 10, 0.3)');

                item.append(name);

                var listItem = $('<li></li>');

                listItem.append(item);

                self.achievementsList.append(listItem);
            });

            _.each(quests, function(quest) {
                var item = self.getItem(true, quest.id),
                    name = self.getName(true, quest.id);

                name.text(quest.name);

                name.css('background', 'rgba(255, 10, 10, 0.3)');

                if (quest.stage > 0 && quest.stage < 9999)
                    name.css('background', 'rgba(255, 255, 10, 0.4)');
                else if (quest.stage > 9998)
                    name.css('background', 'rgba(10, 255, 10, 0.3)');

                item.append(name);

                var listItem = $('<li></li>');

                listItem.append(item);

                self.questList.append(listItem);
            });

        },

        progress: function(id, stage) {
            var self = this,
                quest = self.getQuest(id);

            log.info(quest);

            if (stage > 9999) {

                self.finish(id);
                return;
            }

            if (!quest)
                return;

            var name = quest.find('#quest' + id + 'name');

            if (!name)
                return;

            name.css('background', 'rgba(255, 255, 10, 0.4)');
        },

        finish: function(id) {
            var self = this,
                quest = self.getQuest(id);


            if (!quest)
                return;

            var name = quest.find('#quest' + id + 'name');

            if (!name)
                return;

            name.css('background', 'rgba(10, 255, 10, 0.3)');
        },

        getQuest: function(id) {
            return $(this.questList.find('li')[id]).find('#quest' + id);
        },

        getAchievement: function(id) {
            return $(this.achievementsList.find('li')[id]).find('#achievement' + id);
        },

        /**
         * Might as well properly organize them based
         * on their type of item and id (index).
         */

        getItem: function(isQuest, id) {
            return $('<div id="' + (isQuest ? 'quest' : 'achievement') + id + '" class="questItem"></div>');
        },

        getName: function(isQuest, id) {
            return $('<div id="' + (isQuest ? 'quest' : 'achievement') + id + 'name" class="questName"></div>')
        }

    });

});
