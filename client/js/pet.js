define(['mob'], function(Mob) {
    var Pet = Mob.extend({
        init: function(id, kind, name) {
            this._super(id, kind, name);
            this.playerId = null;
        },
    });
    return Pet;
});

