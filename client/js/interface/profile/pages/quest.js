define(['jquery', '../page'], function($, Page) {

    return Page.extend({

        init: function() {
            var self = this;

            self._super('#questPage');

            self.achievements = $('#achievementList');
            self.quests = $('#questList');

        },

        load: function(quests, achievements) {
            var self = this;

            _.each(achievements, function(achievement) {
                var item = self.getItem(false, achievement.id),
                    name = self.getName(false, achievement.id);

                name.text(achievement.name);

                item.append(name);

                self.achievements.append(item);
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

                self.quests.append(item);
            });

        },

        progress: function(id, stage) {
            var self = this,
                quest = self.getQuest(id);

            if (!quest)
                return;

            var name = quest.find('quest' + id + 'name');

            if (!name)
                return;

            name.css('background', 'rgba(255, 255, 10, 0.4)');
        },

        finish: function(id) {
            var self = this,
                quest = self.getQuest(id);

            if (!quest)
                return;

            var name = quest.find('quest' + id + 'name');

            if (!name)
                return;

            name.css('background', 'rgba(10, 255, 10, 0.3)');
        },

        getQuest: function(id) {
            return this.achievements.find('ul').find('li')[id];
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
