var _ = require('underscore');
var Item = require('./item');
var Types = require('../../../../../shared/js/gametypes');
var Utils = require('./../../utils/utils');
var Messages = require('./../../network/packets/message');

var Gather = Item.extend({
    init: function (id, kind, x, y) {
        this._super(id, kind, x, y);
        this.setRandomOrientation();
        this.isStatic = true;
        this.scheduleRespawn(10000);
    },

    getState: function () {
        var basestate = this._getBaseState(),
            state = [];
        state.push(this.orientation);
        return basestate.concat(state);
    },

    drop: function (item) {
        if (item) {
            return new Messages.Drop(this, item);
        }
    },    
});

module.exports = Gather;


