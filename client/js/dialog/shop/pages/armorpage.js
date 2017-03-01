/**
 * Created by flavius on 2017-02-27.
 */
define(['./storepage'], function(StorePage) {

    var ArmorPage = StorePage.extend({
        init: function(game) {
            this._super('#storeDialogStoreArmor', 2, ItemTypes.Store.Armors, game);
        }
    });

    return ArmorPage;
});