/**
 * Created by flavius on 2017-02-27.
 */
define(['./storepage'], function(StorePage) {

    var WeaponPage = StorePage.extend({
        init: function(game) {
            this._super('#storeDialogStoreWeapon', 3, ItemTypes.Store.Weapons, game);
        }
    });

    return WeaponPage;
});