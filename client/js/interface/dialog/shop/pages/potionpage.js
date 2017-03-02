/**
 * Created by flavius on 2017-02-27.
 */
define(['./storepage'], function(StorePage) {

    var PotionPage = StorePage.extend({
        init: function(game) {
            this._super('#storeDialogStorePotion', 1, ItemTypes.Store.Potions, game);
        }
    });

    return PotionPage;
});