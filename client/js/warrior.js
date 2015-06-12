
/* global Types */

define(['player'], function(Player) {

    var Warrior = Player.extend({
        init: function(id, name, game) {
            this._super(id, name, Types.Entities.WARRIOR, game);
            this.setAtkRange(1);
        }
    });

    return Warrior;
});