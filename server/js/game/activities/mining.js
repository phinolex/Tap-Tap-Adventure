/**
 * Created by flavius on 2017-02-20.
 */

var Activity = require('../entity/character/player/activity');

module.exports = Mining = Activity.extend({
    
    init: function(id, name, player) {
        var self = this;

        self._super(id, name)

        self.player = player;
        
        self.loadPlayerData();
    },

    loadPlayerData: function() {
        var self = this,
            exp;

        exp = self.player.getActivityExp(self.id);
        
        
    }
});

