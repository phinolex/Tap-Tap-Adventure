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

        }

    });

});