var Mob = require('./mob');

module.exports = Pet = Mob.extend({
    init: function (id, kind, x, y, playerId) {
    	this._super(id, kind, x, y);
    	this.playerId = playerId;
    	this.type = "pet";
    	
    },
    
    getState: function () {
        var basestate = this._getBaseState(),
            state = [];
        state.push(this.orientation);
        if (this.target)
        	state.push(this.target.id);
        else
        	state.push(null);
        state.push(this.playerId);
        return basestate.concat(state);    	    
    }
});

