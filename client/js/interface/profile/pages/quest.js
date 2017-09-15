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

            self.quests.text(quests[0].name);
            self.achievements.text(achievements[0].name);

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
        }

    });

});