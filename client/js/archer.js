/* global Types */

define(['player'], function(Player) {
    var Archer = Player.extend({
        init: function(id, name, game) {
            this._super(id, name, Types.Entities.ARCHER, game);
            this.setAtkRange(10);
        }
    });

    return Archer;
});
