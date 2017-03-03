define(['text!../../shared/data/inappstore.json', 'jquery'], function(StoreJSON) {

    var StoreData = JSON.parse(StoreJSON);

    var InAppStore = Class.extend({
        init: function(game) {
            var self = this;

            self.storeData = StoreData;
            self.game = game;
        }
    });

    return InAppStore;
});