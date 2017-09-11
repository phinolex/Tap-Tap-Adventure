var cls = require('../../../../lib/class'),
    Data = require('../../../../../data/achievements.json');

module.exports = Achievement = cls.Class.extend({

    init: function(id, player) {
        var self = this;

        self.id = id;
        self.player = player;

        self.progress = 0;

        self.data = Data[self.id];

        self.name = self.data.name;
        self.description = self.data.description;
    },

    setProgress: function(progress) {
        this.progress = progress;
    },

    getInfo: function() {
        return {
            id: this.id,
            name: this.name,
            description: this.description,
            progress: this.progress
        }
    }

});