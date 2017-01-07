/**
 * Created by flavius on 2017-01-07.
 */
var Quest = require('./quest');

module.exports = Introduction = Quest.extend({
    init: function(jsonData, player) {
        var self = this;

        self._super(jsonData[0], jsonData[1], jsonData[2]);

        self.jsonData = jsonData;
        self.player = player;
        self.stage = 0;

        self.setUpQuest();
    },

    setUpQuest: function() {
        /**
         * Will continue later, here we gather current quest stage based on players
         * database information, his items, inventory, etc. We basically have full control through his instance.
         */

        log.info("Quest initialized.");
    }
})