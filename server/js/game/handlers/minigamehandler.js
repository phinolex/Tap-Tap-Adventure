var cls = require('../lib/class');

/**
 * This is similar in concept to
 * https://www.rune-server.ee/runescape-development/rs-503-client-server/snippets/480042-minigame-handler.html
 */

module.exports = MinigameHandler = cls.Class.extend({
    init: function(id, name) {
        var self = this;

        self.id = id;
        self.name = name;
        self.minigames = {}; //We process every minigame as an instance
    },

    getId: function() {
        return this.id;
    },

    getName: function() {
        return this.name;
    },

    loadMinigames: function() {
        //self.minigames["minigameName"] = new MinigameInstance();
    },
    
    getMinigameState: function(minigame) {

    }
});