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
                    name = self.getName(false, achievement.id),
                    description = self.getDescription(false, achievement.id),
                    progress = self.getProgress(false, achievement.id);

                name.text(achievement.name);
                description.text(achievement.description);
                progress.text(achievement.progress);

                item.append(name, description, progress);

                self.achievements.append(item);
            });

            _.each(quests, function(quest) {
                var item = self.getItem(true, quest.id),
                    name = self.getName(true, quest.id),
                    description = self.getDescription(true, quest.id),
                    progress = self.getProgress(true, quest.id);

                name.text(quest.name);
                description.text(quest.description);
                progress.text(quest.progress);

                item.append(name, description, progress);

                self.quests.append(item);
            });

        },

        progress: function(id, stage) {
            var self = this,
                quest = self.getQuest(id);

            if (!quest)
                return;

            var progress = quest.find('progress');

            progress.text(stage);
        },

        finish: function(id) {
            var self = this,
                quest = self.getQuest(id);

            if (!quest)
                return;

            quest.addClass('finished');
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
        },

        getDescription: function(isQuest, id) {
            return $('<div id="' + (isQuest ? 'quest' : 'achievement') + id + 'description" class="questDescription"></div>')
        },

        getProgress: function(isQuest, id) {
            return $('<div id="' + (isQuest ? 'quest' : 'achievement') + id + 'progress" class="questProgress"></div>')
        }

    });

});
